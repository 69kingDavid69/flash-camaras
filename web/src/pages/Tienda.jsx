import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Truck } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Reveal from "../components/Reveal";
import CtaBanner from "../components/CtaBanner";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/products";
import { fetchProducts } from "../lib/products";

export default function Tienda() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [products, setProducts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchProducts()
      .then((data) => !cancelled && setProducts(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleCategories = useMemo(() => {
    if (!products) return [];
    return CATEGORIES.filter((c) => c.id === "all" || products.some((p) => p.category === c.id));
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchCat = cat === "all" || p.category === cat;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ;
    });
  }, [products, cat, q]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bone pt-40 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(182,134,42,0.12),_transparent_50%)]" />
        <div className="container-x relative">
          <SectionTitle
            eyebrow="Tienda"
            title="Cámaras de segunda mano"
            accent="y accesorios."
            sub="Equipos usados revisados por nuestro taller, accesorios y repuestos. Compra por WhatsApp y recíbelo en tu casa."
          />
          <p className="mt-7 inline-flex items-center gap-3 font-display text-xl sm:text-2xl text-ink">
            <Truck className="h-6 w-6 shrink-0 text-flash-600" />
            <span>
              Hacemos <span className="gold-text italic">envíos a todo el país</span>
            </span>
          </p>
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
              {visibleCategories.map((c) => (
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
        {error ? (
          <div className="rounded-3xl border border-dashed border-ink/15 p-16 text-center">
            <p className="font-display text-2xl text-ink">No pudimos cargar la tienda.</p>
            <p className="mt-2 text-sm text-ink-mute">Intentá recargar la página en un momento.</p>
          </div>
        ) : !products ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[380px] animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 p-16 text-center">
            <p className="font-display text-2xl text-ink">Nada encontrado.</p>
            <p className="mt-2 text-sm text-ink-mute">Probá con otra búsqueda o categoría.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.06}>
                <ProductCard product={p} />
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
