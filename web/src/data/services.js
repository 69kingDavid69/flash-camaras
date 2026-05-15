import { Wrench, Camera, Sparkles, ShieldCheck, Cpu, Aperture } from "lucide-react";

export const SERVICES = [
  {
    id: "mantenimiento",
    icon: Sparkles,
    title: "Mantenimiento preventivo",
    short: "Limpieza profunda de sensor, lentes y cuerpo.",
    description:
      "Eliminamos polvo y residuos del sensor, calibramos visor y limpiamos contactos eléctricos. Tu cámara funcionando como nueva.",
    bullets: [
      "Limpieza húmeda y seca de sensor",
      "Limpieza de óptica y filtros",
      "Calibración de visor y diopter",
      "Diagnóstico completo gratis",
    ],
    price: "Desde $80.000 COP",
  },
  {
    id: "reparacion",
    icon: Wrench,
    title: "Reparación especializada",
    short: "Fallas mecánicas, electrónicas y de obturador.",
    description:
      "Diagnóstico, reparación de obturador, espejo, pantalla LCD, tarjetas lógicas, lentes con focus motor y más.",
    bullets: [
      "Cambio de obturador",
      "Reparación de electrónica",
      "Lentes: focus, diafragma, hongos",
      "Garantía de 90 días",
    ],
    price: "Cotización en 24 h",
  },
  {
    id: "accesorios",
    icon: Camera,
    title: "Accesorios premium",
    short: "Filtros, baterías, correas, tarjetas y más.",
    description:
      "Curaduría de accesorios originales y compatibles certificados para Sony, Canon, Nikon, Fuji y Panasonic.",
    bullets: [
      "Baterías originales y OEM",
      "Filtros UV / ND / CPL",
      "Tarjetas SD / CFexpress",
      "Correas, mochilas, soportes",
    ],
    price: "Catálogo en tienda",
  },
];

export const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Garantía real",
    text: "90 días sobre cada reparación. Si vuelve a fallar, lo arreglamos sin costo.",
  },
  {
    icon: Cpu,
    title: "Técnicos certificados",
    text: "+12 años de experiencia con Sony, Canon, Nikon, Fuji, Panasonic y Leica.",
  },
  {
    icon: Aperture,
    title: "Equipo profesional",
    text: "Cuartos limpios, herramientas de precisión y repuestos originales.",
  },
];
