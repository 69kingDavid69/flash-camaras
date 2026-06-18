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
  locations: [
    {
      name: "Sede centro",
      address: "Calle 53 #49-48, Medellín, Antioquia",
      phone: "+57 304 215 1828",
      whatsapp: "573042151828",
      mapsLink: "https://www.google.com/maps/place/FLAS+C%C3%81MARAS/@6.2518969,-75.5657047,17z",
      mapsEmbed: "https://maps.google.com/maps?q=6.2518969,-75.5657047&hl=es&z=17&output=embed",
    },
    {
      name: "Sede Monterey",
      address: "Cra 48 #10-45, Centro Comercial Monterey, local 140 (división 6)",
      phone: "301 207 811",
      whatsapp: "57301207811",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Cra%2048%20%2310-45%20Centro%20Comercial%20Monterey%20local%20140%20Medell%C3%ADn",
      mapsEmbed: "https://maps.google.com/maps?q=Cra%2048%20%2310-45%20Centro%20Comercial%20Monterey%20local%20140%20Medell%C3%ADn&hl=es&z=17&output=embed",
    },
  ],
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

export const wa = (msg, number = SITE.whatsapp) =>
  `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
