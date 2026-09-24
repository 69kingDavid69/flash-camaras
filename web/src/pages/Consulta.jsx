import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays, Camera, CheckCircle2, Clock, MapPin, MessageCircle, RefreshCw, Search, ShieldCheck,
} from "lucide-react";
import { SITE, wa } from "../data/site";
import { ESTADOS, PASOS, TOKEN_VALIDO, consultarEstado, normalizarToken } from "../lib/ordenes";

const ESPERA_ACTUALIZAR_S = 30;

// Las fechas llegan como "2026-09-14": se leen como fecha local, no UTC, para
// que no se corran un día en Colombia.
function fechaLocal(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatoFecha(iso, opciones = { day: "numeric", month: "long", year: "numeric" }) {
  const f = fechaLocal(iso);
  return f ? f.toLocaleDateString("es-CO", opciones) : "—";
}

function diasHasta(iso) {
  const f = fechaLocal(iso);
  if (!f) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return Math.round((f - hoy) / 86_400_000);
}

function mensajeError(e) {
  return /demasiadas consultas/i.test(e?.message || "")
    ? "Hiciste muchas consultas seguidas. Esperá un minuto y volvé a intentar."
    : "No pudimos consultar el estado en este momento. Revisá tu conexión e intentá de nuevo.";
}

function sedePorCodigo(codigo) {
  return SITE.locations.find((l) => l.code === codigo) ?? SITE.locations[0];
}

export default function Consulta() {
  const { token } = useParams();
  // Remonta la vista al cambiar de código: estado limpio sin resetear a mano.
  return <ConsultaToken key={token ?? ""} tokenUrl={token} />;
}

function ConsultaToken({ tokenUrl }) {
  const navigate = useNavigate();
  const [estado, setEstado] = useState({ cargando: Boolean(tokenUrl), orden: null, error: null, buscado: false });
  const [espera, setEspera] = useState(0);
  const timer = useRef(null);

  // La página de un cliente no debe aparecer en buscadores.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const titulo = document.title;
    document.title = "Estado de tu reparación · FlasCámaras";
    return () => {
      meta.remove();
      document.title = titulo;
    };
  }, []);

  const cargar = async (force = false) => {
    if (!tokenUrl) return;
    setEstado((s) => ({ ...s, cargando: true, error: null }));
    try {
      const orden = await consultarEstado(tokenUrl, { force });
      setEstado({ cargando: false, orden, error: null, buscado: true });
    } catch (e) {
      setEstado({ cargando: false, orden: null, buscado: true, error: mensajeError(e) });
    }
  };

  // Una sola consulta al cargar (HU-10): sin intervalos, sin Realtime.
  useEffect(() => {
    let vigente = true;
    if (tokenUrl) {
      consultarEstado(tokenUrl)
        .then((orden) => vigente && setEstado({ cargando: false, orden, error: null, buscado: true }))
        .catch((e) => vigente && setEstado({ cargando: false, orden: null, buscado: true, error: mensajeError(e) }));
    }
    return () => {
      vigente = false;
    };
  }, [tokenUrl]);

  useEffect(() => () => clearInterval(timer.current), []);

  const actualizar = () => {
    if (espera > 0) return;
    cargar(true);
    setEspera(ESPERA_ACTUALIZAR_S);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setEspera((s) => {
        if (s <= 1) {
          clearInterval(timer.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <div className="relative bg-bone overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(182,134,42,0.12),_transparent_55%)]" />
      <section className="relative container-x pt-32 pb-20 sm:pt-40">
        <div className="mx-auto max-w-2xl">
          <span className="eyebrow">Servicio técnico</span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-medium leading-tight text-ink">
            Estado de tu <span className="gold-text italic">reparación</span>
          </h1>

          {!tokenUrl ? (
            <FormularioCodigo onBuscar={(t) => navigate(`/r/${t}`)} />
          ) : estado.cargando && !estado.orden ? (
            <Tarjeta>
              <p className="flex items-center gap-3 text-ink-mute">
                <RefreshCw className="h-5 w-5 animate-spin" aria-hidden /> Consultando…
              </p>
            </Tarjeta>
          ) : estado.error ? (
            <Tarjeta>
              <p className="text-ink">{estado.error}</p>
              <button type="button" onClick={() => cargar(true)} className="btn-ghost mt-6">
                Reintentar
              </button>
            </Tarjeta>
          ) : estado.buscado && !estado.orden ? (
            <NoEncontrada token={tokenUrl} onBuscar={(t) => navigate(`/r/${t}`)} />
          ) : estado.orden?.estado === "purgado" ? (
            <Tarjeta>
              <h2 className="font-display text-2xl">Esta orden ya fue entregada</h2>
              <p className="mt-3 text-ink-mute">
                Las órdenes entregadas hace más de seis meses ya no se consultan en línea. Si necesitás
                información, escribinos o pasá por el taller.
              </p>
              <a href={wa("Hola, quiero consultar una orden de servicio antigua.")} target="_blank" rel="noreferrer" className="btn-primary mt-6">
                <MessageCircle className="h-4 w-4" aria-hidden /> Escribir por WhatsApp
              </a>
            </Tarjeta>
          ) : estado.orden ? (
            <FichaOrden orden={estado.orden} espera={espera} cargando={estado.cargando} onActualizar={actualizar} />
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Tarjeta({ children, className = "" }) {
  return (
    <div className={`mt-8 rounded-[2rem] bg-white p-6 sm:p-10 shadow-card border border-ink/5 ${className}`}>
      {children}
    </div>
  );
}

function FormularioCodigo({ onBuscar, inicial = "" }) {
  const [valor, setValor] = useState(inicial);
  const token = normalizarToken(valor);
  const valido = TOKEN_VALIDO.test(token);
  return (
    <Tarjeta>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valido) onBuscar(token);
        }}
      >
        <label htmlFor="codigo" className="text-sm font-semibold text-ink">
          Código de tu comprobante
        </label>
        <p className="mt-1 text-sm text-ink-mute">
          Son 8 caracteres y aparecen debajo del código QR. Ej.: K7M2QXAB
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="codigo"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            maxLength={12}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="K7M2QXAB"
            className="input font-mono text-lg tracking-[0.3em] uppercase"
          />
          <button type="submit" disabled={!valido} className="btn-primary disabled:opacity-50 disabled:hover:translate-y-0">
            <Search className="h-4 w-4" aria-hidden /> Consultar
          </button>
        </div>
      </form>
    </Tarjeta>
  );
}

function NoEncontrada({ token, onBuscar }) {
  return (
    <>
      <Tarjeta>
        <h2 className="font-display text-2xl">No encontramos esa orden</h2>
        <p className="mt-3 text-ink-mute">
          El código <span className="font-mono font-semibold text-ink">{normalizarToken(token)}</span> no
          corresponde a ninguna orden activa. Puede que esté mal escrito o que el taller haya generado un
          código nuevo. Revisá tu comprobante o escribinos.
        </p>
        <a href={wa("Hola, no puedo consultar el estado de mi reparación con el código del comprobante.")} target="_blank" rel="noreferrer" className="btn-ghost mt-6">
          <MessageCircle className="h-4 w-4" aria-hidden /> Escribir por WhatsApp
        </a>
      </Tarjeta>
      <FormularioCodigo onBuscar={onBuscar} />
    </>
  );
}

function FichaOrden({ orden, espera, cargando, onActualizar }) {
  const info = ESTADOS[orden.estado] ?? { texto: "En proceso", paso: null };
  const sede = sedePorCodigo(orden.sede);
  const listo = orden.estado === "listo_entrega";
  const entregado = orden.estado === "entregado";
  const diasReclamo = diasHasta(orden.fecha_limite_reclamo);
  const urgente = listo && diasReclamo !== null && diasReclamo <= 15;
  const mesesGarantia = orden.garantia_dias ? Math.round(orden.garantia_dias / 30) : null;

  return (
    <>
      <Tarjeta className={listo ? "ring-2 ring-flash-400" : ""}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-mute">Orden</p>
            <p className="mt-1 font-mono text-xl font-semibold text-ink">{orden.consecutivo}</p>
          </div>
          <button
            type="button"
            onClick={onActualizar}
            disabled={espera > 0 || cargando}
            className="btn-ghost !px-4 !py-2 disabled:opacity-60"
            aria-label="Actualizar estado"
          >
            <RefreshCw className={`h-4 w-4 ${cargando ? "animate-spin" : ""}`} aria-hidden />
            {espera > 0 ? `Actualizar (${espera})` : "Actualizar"}
          </button>
        </div>

        <div className={`mt-6 rounded-2xl p-5 ${listo ? "gold-surface" : "bg-bone-soft"}`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${listo ? "text-ink" : "text-ink-mute"}`}>
            Estado actual
          </p>
          <p className="mt-2 flex items-center gap-2 font-display text-3xl font-medium text-ink">
            {(listo || entregado) && <CheckCircle2 className="h-7 w-7 shrink-0" aria-hidden />}
            {info.texto}
          </p>
        </div>

        {info.paso && <Progreso paso={info.paso} />}

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <Dato icono={Camera} titulo="Equipo" valor={orden.equipos_resumen || "—"} />
          <Dato icono={MapPin} titulo="Sede" valor={sede.name} detalle={sede.address} />
          <Dato icono={CalendarDays} titulo="Ingreso" valor={formatoFecha(orden.fecha_ingreso)} />
          {!entregado && (
            <Dato icono={Clock} titulo="Fecha estimada" valor={formatoFecha(orden.fecha_estimada)} />
          )}
          {entregado && mesesGarantia ? (
            <Dato icono={ShieldCheck} titulo="Garantía" valor={`${mesesGarantia} ${mesesGarantia === 1 ? "mes" : "meses"} sobre el trabajo realizado`} />
          ) : null}
        </dl>

        {orden.actualizado_en && (
          <p className="mt-8 text-xs text-ink-mute">
            Última actualización del taller:{" "}
            {new Date(orden.actualizado_en).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        )}
      </Tarjeta>

      {listo && (
        <Tarjeta>
          <h2 className="font-display text-2xl">Pasá a recogerlo</h2>
          <p className="mt-2 text-ink-mute">
            Tu equipo está en <strong className="text-ink">{sede.name}</strong>, {sede.address}.
          </p>
          <p className="mt-1 text-ink-mute">{SITE.hours}</p>
          {orden.fecha_limite_reclamo && (
            <p className={`mt-5 rounded-xl px-4 py-3 text-sm ${urgente ? "bg-flash-100 font-semibold text-ink" : "bg-bone-soft text-ink"}`}>
              Tenés hasta el {formatoFecha(orden.fecha_limite_reclamo, { day: "2-digit", month: "2-digit", year: "numeric" })} para recogerlo
              {urgente && diasReclamo >= 0 && ` (quedan ${diasReclamo} ${diasReclamo === 1 ? "día" : "días"})`}.
            </p>
          )}
          <a
            href={wa(`Hola, mi equipo de la orden ${orden.consecutivo} está listo. ¿Cuándo puedo pasar?`, sede.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp {sede.name}
          </a>
        </Tarjeta>
      )}

      {orden.estado === "pasar_por_taller" && (
        <Tarjeta>
          <p className="text-ink">
            Necesitamos hablar con vos sobre este equipo. Pasá por {sede.name} o escribinos.
          </p>
          <a href={wa(`Hola, consulto por la orden ${orden.consecutivo}.`, sede.whatsapp)} target="_blank" rel="noreferrer" className="btn-primary mt-6">
            <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp {sede.name}
          </a>
        </Tarjeta>
      )}
    </>
  );
}

function Progreso({ paso }) {
  return (
    <div className="mt-6">
      <ol className="grid grid-cols-5 gap-1.5" aria-label={`Paso ${paso} de ${PASOS.length}: ${PASOS[paso - 1]}`}>
        {PASOS.map((nombre, i) => {
          const hecho = i + 1 <= paso;
          return (
            <li key={nombre} className="flex flex-col gap-2">
              <span className={`h-1.5 rounded-full ${hecho ? "gold-surface !border-0 !shadow-none" : "bg-ink/10"}`} />
              {/* En celular no caben cinco rótulos: se muestra solo el paso actual abajo. */}
              <span className={`hidden text-xs leading-tight sm:block ${hecho ? "font-semibold text-ink" : "text-ink-mute"}`}>
                {nombre}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-ink-mute sm:hidden">
        Paso {paso} de {PASOS.length}: <span className="font-semibold text-ink">{PASOS[paso - 1]}</span>
      </p>
    </div>
  );
}

function Dato({ icono: Icono, titulo, valor, detalle }) {
  return (
    <div className="flex gap-3">
      <Icono className="mt-0.5 h-5 w-5 shrink-0 text-flash-600" aria-hidden />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-mute">{titulo}</dt>
        <dd className="mt-1 text-ink">{valor}</dd>
        {detalle && <dd className="text-sm text-ink-mute">{detalle}</dd>}
      </div>
    </div>
  );
}
