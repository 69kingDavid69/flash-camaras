export const SITE = {
  name: "FlasCámaras",
  tagline: "Servicio técnico en cámaras fotográficas",
  years: 41,
  shipping: "Envíos a todo el país",
  whatsapp: "573042151828",
  phone: "+57 304 215 1828",
  email: "flascamaras@hotmail.com",
  address: "Calle 53 #49-48, Medellín, Antioquia",
  hours: "Lun – Sáb · 9:00 a.m. – 6:00 p.m.",
  coords: { lat: 6.2518969, lng: -75.5657047 },
  mapsLink:
    "https://www.google.com/maps/place/FLAS+C%C3%81MARAS/@6.2518969,-75.5657047,17z",
  mapsEmbed:
    "https://maps.google.com/maps?q=6.2518969,-75.5657047&hl=es&z=17&output=embed",
  social: {
    instagram: "https://instagram.com/flascamaras",
    facebook: "https://facebook.com/flascamaras",
  },
};

export const wa = (msg) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
