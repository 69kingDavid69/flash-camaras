import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, MapPin } from "lucide-react";
import { SITE, wa } from "../data/site";

export default function WhatsAppFAB() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onEscape = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="animate-fade-up absolute bottom-full right-0 mb-3 w-72 rounded-2xl border border-ink/10 bg-white p-3 shadow-card">
          <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink-mute">
            ¿Con qué sede querés hablar?
          </p>
          <div className="flex flex-col gap-1.5">
            {SITE.locations.map((location) => (
              <a
                key={location.name}
                href={wa("Hola FlasCámaras 👋, quisiera hacer una consulta.", location.whatsapp)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="group/item flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-sm transition hover:bg-bone-soft"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-flash-600" />
                <span>
                  <span className="block font-medium text-ink">{location.name}</span>
                  <span className="block text-xs text-ink-mute">{location.address}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Escribir por WhatsApp"
        aria-expanded={open}
        className="group flex items-center gap-3"
      >
        <span className="hidden sm:flex translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-ink text-white px-4 py-2 text-xs font-medium shadow-card">
          Hablemos
        </span>
        <span className="gold-surface relative flex h-14 w-14 items-center justify-center rounded-full text-ink transition-transform duration-300 group-hover:scale-110">
          {!open && <span className="absolute inset-0 rounded-full bg-flash-600 animate-ping opacity-30" />}
          {open ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
        </span>
      </button>
    </div>
  );
}
