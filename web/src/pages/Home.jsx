import ScrollHero from "../components/ScrollHero";
import SectionTitle from "../components/SectionTitle";
import ServicesGrid from "../components/ServicesGrid";
import Pillars from "../components/Pillars";
import Testimonials from "../components/Testimonials";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { wa } from "../data/site";

const FEATURED = PRODUCTS.slice(0, 4);
const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function Home() {
  return (
    <>
      <ScrollHero />

      {/* Servicios */}
      <section id="servicios" className="container-x py-28 sm:py-36">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow="Qué hacemos"
            title="Tres formas de cuidar"
            accent="tu equipo."
            sub="Mantenimiento, reparación y accesorios. Todo bajo el mismo techo, con técnicos certificados."
          />
          <Link to="/servicios" className="btn-ghost self-start lg:self-end">
            Ver todos los servicios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14">
          <ServicesGrid />
        </div>
      </section>

      {/* Productos destacados */}
      <section className="bg-bone-soft py-28 sm:py-36">
        <div className="container-x">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
            <SectionTitle
              eyebrow="Tienda"
              title="Accesorios"
              accent="seleccionados."
              sub="Curaduría de marcas profesionales: Sony, Canon, Hoya, Peak Design, SanDisk, Manfrotto y más."
            />
            <Link to="/tienda" className="btn-ghost self-start lg:self-end">
              Explorar tienda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <article className="group flex h-full flex-col rounded-3xl border border-ink/5 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bone-soft">
                    <div className="absolute inset-0 bg-gradient-to-br from-flash-50 via-white to-bone-soft" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-4xl text-flash-700/40">
                        {p.brand.charAt(0)}
                      </span>
                    </div>
                    <span className="absolute top-3 left-3 rounded-full bg-ink/85 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-wider text-white">
                      {p.tag}
                    </span>
                  </div>
                  <div className="mt-5 flex-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-ink-mute">
                      {p.brand}
                    </span>
                    <h3 className="mt-2 font-display text-lg leading-tight text-ink line-clamp-2">
                      {p.name}
                    </h3>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between border-t border-ink/5 pt-4">
                    <span className="text-lg font-medium text-ink">{fmt(p.price)}</span>
                    <a
                      href={wa(`Hola, me interesa: ${p.name}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-flash-700 hover:text-flash-800"
                    >
                      Consultar →
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="container-x py-28 sm:py-36">
        <SectionTitle
          align="center"
          eyebrow="Por qué Flash Cámaras"
          title="Precisión, confianza,"
          accent="garantía."
          sub="No improvisamos. Cada paso del proceso está documentado, medido y respaldado."
        />
        <div className="mt-14">
          <Pillars />
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-bone-soft py-28 sm:py-36">
        <div className="container-x">
          <SectionTitle
            align="center"
            eyebrow="Lo que dicen"
            title="Fotógrafos que"
            accent="confían en nosotros."
          />
          <div className="mt-14">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container-x py-20 sm:py-28">
        <CtaBanner />
      </section>
    </>
  );
}
