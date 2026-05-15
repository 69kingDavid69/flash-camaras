import { wa } from "../data/site";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function CtaBanner() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white">
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-flash-600/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-flash-700/30 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.05),_transparent_50%)]" />

        <div className="relative grid gap-10 p-10 sm:p-14 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-flash-300">
              <span className="h-px w-8 bg-flash-500" />
              Diagnóstico gratis
            </span>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
              ¿Tu cámara no está dando lo mejor?{" "}
              <span className="italic text-flash-400">Te ayudamos hoy.</span>
            </h2>
            <p className="mt-5 max-w-xl text-white/70 leading-relaxed">
              Llévala a nuestro taller o agenda tu visita por WhatsApp. Cotizamos en menos de 24 horas y trabajamos con garantía.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={wa("Hola, quiero diagnosticar mi cámara.")}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl bg-flash-600 px-6 py-5 text-white transition hover:bg-flash-500"
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Agendar por WhatsApp</span>
              </span>
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </a>
            <Link
              to="/contacto"
              className="group flex items-center justify-between rounded-2xl border border-white/15 px-6 py-5 transition hover:border-white"
            >
              <span className="font-medium">Ver ubicación y horarios</span>
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
