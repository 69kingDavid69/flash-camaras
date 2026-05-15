import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { SITE, wa } from "../data/site";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/tienda", label: "Tienda" },
  { to: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-ink/5 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between py-4">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={SITE.name}
        >
          <span className="relative inline-flex transition-transform duration-500 group-hover:rotate-6">
            <Logo size={44} />
            <span className="absolute inset-0 rounded-[14px] ring-1 ring-flash-600/30 pointer-events-none" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold tracking-tight">
              Flash<span className="text-flash-600"> Cámaras</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-mute">
              Servicio técnico premium
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive ? "text-flash-700" : "text-ink hover:text-flash-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-flash-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={wa("Hola, quiero más información sobre sus servicios.")}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !py-2.5 !px-5 !text-xs"
          >
            Agendar visita
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden rounded-full border border-ink/10 bg-white/80 p-2.5 backdrop-blur"
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container-x pb-6">
          <nav className="glass rounded-3xl p-4 flex flex-col">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-flash-50 text-flash-700"
                      : "text-ink hover:bg-bone-soft"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={wa("Hola, quiero más información sobre sus servicios.")}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-3 w-full"
            >
              Agendar visita por WhatsApp
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
