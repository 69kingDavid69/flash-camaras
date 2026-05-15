import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import SectionTitle from "../components/SectionTitle";
import Reveal from "../components/Reveal";
import { SITE, wa } from "../data/site";

export default function Contacto() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "Mantenimiento", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const msg = `Hola, soy *${form.name}* (tel: ${form.phone}).%0AAsunto: ${form.subject}.%0A%0A${form.message}`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div className="relative bg-bone overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.10),_transparent_55%)]" />

      <section className="relative pt-40 pb-20">
        <div className="container-x">
          <SectionTitle
            eyebrow="Contacto"
            title="Estamos para"
            accent="ayudarte."
            sub="Escribinos por WhatsApp o pasá por el taller. Respondemos en menos de 1 hora en horario hábil."
          />
        </div>
      </section>

      <section className="relative container-x pb-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Form */}
          <Reveal>
            <form
              onSubmit={onSubmit}
              className="rounded-[2rem] bg-white p-8 sm:p-10 shadow-card border border-ink/5"
            >
              <h3 className="font-display text-3xl">Cuéntanos qué necesitas</h3>
              <p className="mt-2 text-sm text-ink-mute">
                Enviamos tu mensaje directo por WhatsApp para resolverlo en minutos.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Nombre" required>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-bone-soft px-4 py-3 text-sm focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
                    placeholder="Tu nombre"
                  />
                </Field>
                <Field label="Teléfono" required>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-bone-soft px-4 py-3 text-sm focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
                    placeholder="300 123 4567"
                  />
                </Field>
                <Field label="Asunto" required className="sm:col-span-2">
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-bone-soft px-4 py-3 text-sm focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
                  >
                    <option>Mantenimiento</option>
                    <option>Reparación</option>
                    <option>Accesorios / Tienda</option>
                    <option>Otro</option>
                  </select>
                </Field>
                <Field label="Mensaje" required className="sm:col-span-2">
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-bone-soft px-4 py-3 text-sm focus:border-flash-600 focus:outline-none focus:ring-2 focus:ring-flash-100"
                    placeholder="Cuéntanos qué cámara, qué falla, qué necesitas…"
                  />
                </Field>
              </div>

              <button type="submit" className="btn-primary mt-8 w-full sm:w-auto">
                <Send className="h-4 w-4" />
                Enviar por WhatsApp
              </button>

              {sent && (
                <p className="mt-4 text-sm text-flash-700">
                  ¡Listo! Te abrimos WhatsApp con el mensaje pre-cargado.
                </p>
              )}
            </form>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col gap-6">
              <a
                href={SITE.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-[2rem] border border-ink/5 shadow-card aspect-[4/3] relative"
              >
                <iframe
                  title="Ubicación Flash Cámaras en Google Maps"
                  src={SITE.mapsEmbed}
                  className="h-full w-full pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <span className="absolute bottom-4 right-4 rounded-full bg-white/95 backdrop-blur px-4 py-2 text-xs font-medium text-ink shadow-card opacity-0 transition-opacity group-hover:opacity-100">
                  Abrir en Google Maps ↗
                </span>
              </a>

              <div className="rounded-[2rem] bg-ink text-white p-8 sm:p-10 relative overflow-hidden">
                <h3 className="relative font-display text-2xl">Visítanos</h3>
                <ul className="relative mt-6 space-y-5 text-sm">
                  <InfoLine icon={MapPin}>{SITE.address}</InfoLine>
                  <InfoLine icon={Phone}>{SITE.phone}</InfoLine>
                  <InfoLine icon={Mail}>{SITE.email}</InfoLine>
                  <InfoLine icon={Clock}>{SITE.hours}</InfoLine>
                </ul>
                <a
                  href={wa("Hola, quiero pasar por el taller. ¿Cómo agendamos?")}
                  target="_blank"
                  rel="noreferrer"
                  className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white text-ink px-5 py-3 text-sm font-medium transition hover:bg-flash-100"
                >
                  <MessageCircle className="h-4 w-4" />
                  Escribir directo
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Field({ label, required, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs uppercase tracking-[0.2em] text-ink-mute mb-2">
        {label}
        {required && <span className="text-flash-600"> *</span>}
      </span>
      {children}
    </label>
  );
}

function InfoLine({ icon: Icon, children }) {
  return (
    <li className="flex items-start gap-3 text-white/85">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
        <Icon className="h-4 w-4 text-flash-400" />
      </span>
      <span className="pt-2">{children}</span>
    </li>
  );
}
