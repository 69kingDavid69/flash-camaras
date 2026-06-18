import { MessageCircle } from "lucide-react";
import { wa } from "../data/site";

export default function WhatsAppFAB() {
  return (
    <a
      href={wa("Hola FlasCámaras 👋, quisiera hacer una consulta.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3"
    >
      <span className="hidden sm:flex translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-ink text-white px-4 py-2 text-xs font-medium shadow-card">
        Hablemos
      </span>
      <span className="gold-surface relative flex h-14 w-14 items-center justify-center rounded-full text-ink transition-transform duration-300 group-hover:scale-110">
        <span className="absolute inset-0 rounded-full bg-flash-600 animate-ping opacity-30" />
        <MessageCircle className="relative h-6 w-6" />
      </span>
    </a>
  );
}
