import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Pillars from "../components/Pillars";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import { SERVICES } from "../data/services";
import { wa } from "../data/site";

export default function Servicios() {
  const location = useLocation();
  const scrollId = location.state?.scrollTo;

  useEffect(() => {
    if (!scrollId) return;
    const el = document.getElementById(scrollId);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    }
  }, [scrollId]);

  return (
    <>
      {/* Hero secundario */}
      <section className="relative overflow-hidden bg-bone pt-40 pb-20 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(200,16,46,0.10),_transparent_50%)]" />
        <div className="container-x relative">
          <SectionTitle
            eyebrow="Servicios"
            title="Diagnosticamos, reparamos,"
            accent="cuidamos."
            sub="Trabajamos con cuartos limpios y protocolos certificados. Lo que hacemos en una semana, otros tardan un mes."
          />
        </div>
      </section>

      {/* Detalle de cada servicio */}
      <section className="container-x py-20 space-y-24">
        {SERVICES.map((s, idx) => {
          const Icon = s.icon;
          const reverse = idx % 2 === 1;
          return (
            <Reveal key={s.id}>
              <article
                id={s.id}
                className={`grid scroll-mt-32 gap-10 lg:grid-cols-2 lg:items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink">
                  <div className="absolute inset-0 bg-gradient-to-br from-flash-800 via-ink to-ink" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_60%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="h-32 w-32 text-white/40" strokeWidth={1} />
                  </div>
                  <span className="absolute top-6 left-6 font-display text-7xl text-white/15">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <span className="eyebrow">{s.price}</span>
                  <h3 className="mt-4 font-display text-4xl sm:text-5xl leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-5 text-ink-mute leading-relaxed">{s.description}</p>

                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-ink/80">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-flash-50 text-flash-700">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={wa(`Hola, quisiera más información sobre el servicio: ${s.title}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary mt-10"
                  >
                    Cotizar este servicio
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            </Reveal>
          );
        })}
      </section>

      {/* Pillars */}
      <section className="container-x py-20 sm:py-28">
        <SectionTitle
          align="center"
          eyebrow="Cómo trabajamos"
          title="Calidad que se"
          accent="puede medir."
        />
        <div className="mt-14">
          <Pillars />
        </div>
      </section>

      <section className="container-x pb-28">
        <CtaBanner />
      </section>
    </>
  );
}
