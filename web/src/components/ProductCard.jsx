import { MessageCircle, Camera } from "lucide-react";
import { wa } from "../data/site";

const fmt = (n) =>
  n == null
    ? "Consultar precio"
    : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function ProductCard({ product: p, aspect = "aspect-square", compact = false }) {
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-ink/5 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
      <div className={`relative ${aspect} overflow-hidden rounded-2xl bg-bone-soft`}>
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={p.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.sold ? "grayscale" : ""}`}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-flash-50 via-white to-bone-soft" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl text-flash-700/30">{p.brand?.charAt(0)}</span>
            </div>
          </>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-ink/85 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider text-white">
          {p.tag}
        </span>
        {p.sold && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink">
              Vendido
            </span>
          </span>
        )}
      </div>

      <div className="mt-5 flex-1">
        <span className="text-[10px] uppercase tracking-[0.25em] text-ink-mute">{p.brand}</span>
        <h3 className={`mt-2 font-display leading-tight text-ink line-clamp-2 ${compact ? "text-lg" : "text-base"}`}>
          {p.name}
        </h3>
        {!compact && p.description && (
          <p className="mt-2 text-xs text-ink-mute leading-relaxed line-clamp-2">{p.description}</p>
        )}
        {p.used && p.condition && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-flash-50 px-3 py-1 text-[11px] font-medium text-flash-700">
            <Camera className="h-3 w-3" />
            {p.condition}
          </span>
        )}
      </div>

      <div className="mt-5 border-t border-ink/5 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-medium text-ink">{fmt(p.price)}</span>
        </div>
        {p.sold ? (
          <span className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-ink/10 px-4 py-3 text-sm font-semibold text-ink-mute">
            Ya vendido
          </span>
        ) : (
          <a
            href={wa(
              `Hola FlasCámaras 👋, quiero *comprar* este producto:\n\n• ${p.name}${p.price != null ? `\n• Precio: ${fmt(p.price)}` : ""}${p.used && p.condition ? `\n• Estado: ${p.condition}` : ""}\n\n¿Está disponible? ¿Me confirman el envío a todo el país?`
            )}
            target="_blank"
            rel="noreferrer"
            className="gold-surface mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition"
          >
            <MessageCircle className="h-4 w-4" />
            Comprar por WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
