import { useMemo, useState } from "react";
import { Search, MessageCircle, Filter } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Reveal from "../components/Reveal";
import CtaBanner from "../components/CtaBanner";
import { PRODUCTS, CATEGORIES } from "../data/products";
import { wa } from "../data/site";

const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function Tienda() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = cat === "all" || p.category === cat;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [cat, q]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bone pt-40 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,16,46,0.10),_transparent_50%)]" />
        <div className="container-x relative">
          <SectionTitle
            eyebrow="Tienda"
            title="Accesorios premium"
            accent="para fotógrafos."
            sub="Pide por WhatsApp y recibe en tu casa o pasa por el taller. Despachamos a todo Colombia."
          />
        </div>
      </section>

      {/* Filtros */}
      <section className="container-x sticky top-20 z-30">
        <div className="glass rounded-3xl p-4 sm:p-5 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-mute" />
              <input
                type="search"
                placeholder="Buscar por nombre o marca…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-2xl border border-ink/10 bg-white pl-11 pr-4 py-3 text-sm placeholder:text-ink-mute focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <Filter className="h-4 w-4 shrink-0 text-ink-mute" />
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                    cat === c.id
                      ? "bg-ink text-white"
                      : "bg-white text-ink hover:bg-bone-soft border border-ink/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid productos */}
      <section className="container-x py-16">
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 p-16 text-center">
            <p className="font-display text-2xl text-ink">Nada encontrado.</p>
            <p className="mt-2 text-sm text-ink-mute">
              Probá con otra búsqueda o categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06}>
                <article className="group flex h-full flex-col rounded-3xl border border-ink/5 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-card">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-bone-soft">
                    <div className="absolute inset-0 bg-gradient-to-br from-flash-50 via-white to-bone-soft" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-5xl text-flash-700/30">
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
                    <h3 className="mt-2 font-display text-base leading-tight text-ink line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-xs text-ink-mute leading-relaxed line-clamp-2">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-ink/5 pt-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-medium text-ink">{fmt(p.price)}</span>
                    </div>
                    <a
                      href={wa(
                        `Hola Flash Cámaras, me interesa: *${p.name}* (${fmt(p.price)}). ¿Sigue disponible?`
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-flash-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-flash-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Pedir por WhatsApp
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="container-x pb-28">
        <CtaBanner />
      </section>
    </>
  );
}
