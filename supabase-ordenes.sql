-- Espejo público del estado de las órdenes de servicio (Fase 2, HU-11 a HU-15).
--
-- Ejecutar en el SQL Editor de Supabase. Se puede correr de nuevo sin dañar nada.
-- Aplicado el 2026-09-24 en el proyecto de la tienda (el mismo que usa el sitio),
-- así la página no necesita variables nuevas. Si algún día se pasa a un proyecto
-- aparte (HU-14, opción A), correrlo allí y definir VITE_ORDENES_SUPABASE_*.
--
-- Modelo de seguridad:
--   * La app de escritorio escribe con la clave secreta (service_role), que
--     ignora RLS y vive cifrada en cada PC. Nunca va en el repo ni en el front.
--   * La web NO puede leer la tabla: RLS activo y sin políticas. Solo puede
--     llamar consultar_estado(token), que devuelve una fila o nada.
--   * Límite de 20 consultas por minuto por IP contra barridos de tokens.
--   * Nada de datos personales: solo estos campos (ver HU-11).

create table if not exists public.estados_publicos (
  token                text primary key check (token ~ '^[0-9A-HJKMNP-TV-Z]{8}$'),
  consecutivo          text not null check (char_length(consecutivo) <= 16),
  sede                 text not null check (sede ~ '^[A-Z]$'),
  estado               text not null check (estado in (
                         'recibido', 'en_revision', 'esperando_aprobacion', 'en_reparacion',
                         'esperando_repuesto', 'listo_entrega', 'entregado', 'pasar_por_taller')),
  equipos_resumen      text not null default '' check (char_length(equipos_resumen) <= 60),
  fecha_ingreso        date,
  fecha_estimada       date,
  garantia_dias        int check (garantia_dias is null or garantia_dias between 0 and 3650),
  fecha_limite_reclamo date,
  actualizado_en       timestamptz not null default now()
);

alter table public.estados_publicos enable row level security;
-- Sin políticas: anon y authenticated no pueden leer ni escribir directamente.
revoke all on table public.estados_publicos from anon, authenticated;

-- Tokens purgados (HU-15): permite responder "ya fue entregada" en vez de
-- "no existe". 8 bytes por orden; crece ~2.000 filas al año.
create table if not exists public.tokens_purgados (
  token      text primary key,
  purgado_en timestamptz not null default now()
);
alter table public.tokens_purgados enable row level security;
revoke all on table public.tokens_purgados from anon, authenticated;

-- Contador de consultas por IP y minuto (HU-13).
create table if not exists public.consultas_ip (
  ip     text not null,
  minuto timestamptz not null,
  n      int not null default 1,
  primary key (ip, minuto)
);
alter table public.consultas_ip enable row level security;
revoke all on table public.consultas_ip from anon, authenticated;

-- Única puerta de lectura para la web.
create or replace function public.consultar_estado(p_token text)
returns table (
  token text, consecutivo text, sede text, estado text, equipos_resumen text,
  fecha_ingreso date, fecha_estimada date, garantia_dias int,
  fecha_limite_reclamo date, actualizado_en timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip text;
  v_n int;
  v_token text := upper(trim(coalesce(p_token, '')));
begin
  v_ip := coalesce(
    nullif(trim(split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1)), ''),
    'desconocida'
  );
  insert into consultas_ip as c (ip, minuto, n)
  values (v_ip, date_trunc('minute', now()), 1)
  on conflict (ip, minuto) do update set n = c.n + 1
  returning c.n into v_n;

  if random() < 0.02 then
    delete from consultas_ip where minuto < now() - interval '1 hour';
  end if;

  if v_n > 20 then
    raise exception 'Demasiadas consultas. Intentá de nuevo en un minuto.' using errcode = 'P0001';
  end if;

  if v_token !~ '^[0-9A-HJKMNP-TV-Z]{8}$' then
    return;
  end if;

  return query
    select e.token, e.consecutivo, e.sede, e.estado, e.equipos_resumen, e.fecha_ingreso,
           e.fecha_estimada, e.garantia_dias, e.fecha_limite_reclamo, e.actualizado_en
    from estados_publicos e
    where e.token = v_token;

  if not found and exists (select 1 from tokens_purgados p where p.token = v_token) then
    return query select v_token, null::text, null::text, 'purgado'::text, null::text,
                        null::date, null::date, null::int, null::date, null::timestamptz;
  end if;
end;
$$;

revoke all on function public.consultar_estado(text) from public;
grant execute on function public.consultar_estado(text) to anon, authenticated;

-- Purga (HU-15): órdenes entregadas hace más de 180 días salen del espejo.
-- El historial completo sigue intacto en el SQLite de cada sede.
create or replace function public.purgar_entregados()
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_n int;
begin
  with borrados as (
    delete from estados_publicos
    where estado = 'entregado' and actualizado_en < now() - interval '180 days'
    returning token
  )
  insert into tokens_purgados (token)
  select token from borrados
  on conflict do nothing;
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;
revoke all on function public.purgar_entregados() from public, anon, authenticated;

-- Programar la purga diaria (Database → Extensions → habilitar pg_cron primero):
--   select cron.schedule('purgar-entregados', '30 3 * * *', 'select public.purgar_entregados()');
