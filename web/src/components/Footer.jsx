import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import Logo from "./Logo";
import { SITE } from "../data/site";

export default function Footer() {
  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-flash-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-flash-700/10 blur-3xl" />

      <div className="container-x relative grid gap-12 py-20 lg:grid-cols-4">
        <div className="lg:col-span-2 max-w-md">
          <div className="flex items-center gap-3">
            <Logo size={44} variant="light" />
            <span className="font-display text-2xl">
              Flash<span className="text-flash-500"> Cámaras</span>
            </span>
          </div>
          <p className="mt-6 text-white/70 leading-relaxed">
            Servicio técnico especializado en cámaras fotográficas. Mantenimiento, reparación y accesorios premium con garantía real.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-flash-500 hover:text-flash-500"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-flash-500 hover:text-flash-500"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.25em] text-white/50">
            Navegación
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/" className="text-white/80 hover:text-flash-500 transition">Inicio</Link></li>
            <li><Link to="/servicios" className="text-white/80 hover:text-flash-500 transition">Servicios</Link></li>
            <li><Link to="/tienda" className="text-white/80 hover:text-flash-500 transition">Tienda</Link></li>
            <li><Link to="/contacto" className="text-white/80 hover:text-flash-500 transition">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.25em] text-white/50">
            Contacto
          </h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3 text-white/80">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-flash-500" />
              {SITE.address}
            </li>
            <li className="flex gap-3 text-white/80">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-flash-500" />
              {SITE.phone}
            </li>
            <li className="flex gap-3 text-white/80">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-flash-500" />
              {SITE.email}
            </li>
            <li className="flex gap-3 text-white/80">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-flash-500" />
              {SITE.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</span>
          <span>Hecho con precisión. Diseñado para fotógrafos.</span>
        </div>
      </div>
    </footer>
  );
}
