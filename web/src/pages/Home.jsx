import { useEffect, useState } from "react";
import ScrollHero from "../components/ScrollHero";
import SectionTitle from "../components/SectionTitle";
import ServicesGrid from "../components/ServicesGrid";
import Pillars from "../components/Pillars";
import Testimonials from "../components/Testimonials";
import CtaBanner from "../components/CtaBanner";
import Reveal from "../components/Reveal";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchProducts } from "../lib/products";

export default function Home() {
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => {
        if (cancelled) return;
        const withPhoto = data.filter((p) => p.image_url && !p.sold);
        const withoutPhoto = data.filter((p) => !(p.image_url && !p.sold));
        setFeatured([...withPhoto, ...withoutPhoto].slice(0, 4));
      })
      .catch(() => !cancelled && setFeatured([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <ScrollHero />

      {/* Servicios */}
      <section id="servicios" className="container-x py-28 sm:py-36">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            eyebrow="Qué hacemos"
            title="Todo para cuidar"
            accent="tu equipo."
            sub="Mantenimiento, reparación, compra, venta, accesorios y asesoría con técnicos."
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
              title="Equipos de segunda mano"
              accent="revisados."
              sub="Cámaras usadas revisadas por nuestro taller y accesorios profesionales. Envíos a todo el país."
            />
            <Link to="/tienda" className="btn-ghost self-start lg:self-end">
              Explorar tienda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(featured ?? Array.from({ length: 4 })).map((p, i) =>
              p ? (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProductCard product={p} aspect="aspect-[4/3]" compact />
                </Reveal>
              ) : (
                <div key={i} className="h-[340px] animate-pulse rounded-3xl bg-white/60" />
              )
            )}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="container-x py-28 sm:py-36">
        <SectionTitle
          align="center"
          eyebrow="Por qué FlasCámaras"
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
