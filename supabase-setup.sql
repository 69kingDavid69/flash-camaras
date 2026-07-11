-- Ejecutar UNA sola vez en: Supabase Dashboard → SQL Editor → New query → pegar todo → Run
-- Proyecto: dtppmqwdkvvmtttzhybv

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  brand text not null default '' check (char_length(brand) <= 60),
  category text not null check (category in ('usados','camaras-nuevas','baterias','flash','lentes','filtros','tarjetas','correas','adaptadores','limpieza')),
  price bigint check (price is null or (price >= 0 and price <= 1000000000)),
  tag text not null default 'Nuevo' check (char_length(tag) <= 30),
  used boolean not null default false,
  condition text check (condition is null or char_length(condition) <= 80),
  description text not null default '' check (char_length(description) <= 400),
  image_url text check (image_url is null or char_length(image_url) <= 500),
  sold boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Lectura pública (la tienda no requiere login)
drop policy if exists "public_read" on public.products;
create policy "public_read" on public.products
  for select using (true);

-- Escritura SOLO para el admin (tu email), aunque alguien más logre registrarse
drop policy if exists "admin_insert" on public.products;
create policy "admin_insert" on public.products
  for insert to authenticated
  with check ((auth.jwt()->>'email') = 'davidbb0003@gmail.com');

drop policy if exists "admin_update" on public.products;
create policy "admin_update" on public.products
  for update to authenticated
  using ((auth.jwt()->>'email') = 'davidbb0003@gmail.com')
  with check ((auth.jwt()->>'email') = 'davidbb0003@gmail.com');

drop policy if exists "admin_delete" on public.products;
create policy "admin_delete" on public.products
  for delete to authenticated
  using ((auth.jwt()->>'email') = 'davidbb0003@gmail.com');

-- Tope duro de 500 productos: imposible inflar la base de datos por error o abuso
create or replace function public.enforce_products_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (select count(*) from public.products) >= 500 then
    raise exception 'Límite de 500 productos alcanzado';
  end if;
  return new;
end;
$$;

drop trigger if exists products_limit on public.products;
create trigger products_limit before insert on public.products
  for each row execute function public.enforce_products_limit();

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- Bucket de fotos: máx 300KB por archivo, solo imágenes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 307200, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  public = excluded.public;

-- Storage: lectura pública, escritura solo admin
drop policy if exists "public_read_images" on storage.objects;
create policy "public_read_images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "admin_upload_images" on storage.objects;
create policy "admin_upload_images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and (auth.jwt()->>'email') = 'davidbb0003@gmail.com');

drop policy if exists "admin_update_images" on storage.objects;
create policy "admin_update_images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and (auth.jwt()->>'email') = 'davidbb0003@gmail.com');

drop policy if exists "admin_delete_images" on storage.objects;
create policy "admin_delete_images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (auth.jwt()->>'email') = 'davidbb0003@gmail.com');

-- Tope duro de 1000 fotos (1000 x 300KB = 300MB máx, muy por debajo del límite de 1GB del plan free)
create or replace function public.enforce_images_limit()
returns trigger
language plpgsql
security definer set search_path = storage
as $$
begin
  if new.bucket_id = 'product-images' and
     (select count(*) from storage.objects where bucket_id = 'product-images') >= 1000 then
    raise exception 'Límite de 1000 imágenes alcanzado';
  end if;
  return new;
end;
$$;

drop trigger if exists images_limit on storage.objects;
create trigger images_limit before insert on storage.objects
  for each row execute function public.enforce_images_limit();
