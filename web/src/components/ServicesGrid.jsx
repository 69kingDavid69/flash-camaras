import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { SERVICES } from "../data/services";

export default function ServicesGrid({ withCta = true }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal key={s.id} delay={i * 0.08}>
            <article className="group relative h-full flex flex-col rounded-3xl bg-white p-8 shadow-card border border-ink/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow hover:border-flash-200">
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-flash-700 via-flash-500 to-flash-700 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="flex items-start justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-flash-50 text-flash-700 transition-colors duration-500 group-hover:bg-flash-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-ink-mute">
                  0{SERVICES.indexOf(s) + 1}
                </span>
              </div>

              <h3 className="mt-8 font-display text-2xl text-ink">{s.title}</h3>
              <p className="mt-3 text-sm text-ink-mute leading-relaxed">{s.short}</p>

              <ul className="mt-6 space-y-2 text-sm text-ink/80">
                {s.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 rounded-full bg-flash-600" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-between border-t border-ink/5 pt-5">
                <span className="text-sm font-medium text-flash-700">
                  {s.price}
                </span>
                {withCta && (
                  <Link
                    to="/servicios"
                    state={{ scrollTo: s.id }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-ink hover:text-flash-700 transition"
                  >
                    Detalles
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
