export const SITE_CONFIG = {
  name: "IGRI",
  fullName: "Info Gempa Republik Indonesia",
  shortName: "Info Gempa",
  description: "Pantau aktivitas seismik Indonesia dengan data real-time dari BMKG",
  url: "https://infogempa.lexxa.site",
  developer: {
    name: "Lexxa2nd (Alexx)",
    email: "alexaputra498@gmail.com",
    github: "https://github.com/ini-alex",
    whatsapp: "https://wa.me/6285129426672",
    tiktok: "https://tiktok.com/@ini__alexx",
  },
  keywords: [
    "gempa bumi",
    "bmkg",
    "info gempa",
    "indonesia",
    "seismik",
    "earthquake",
    "real-time",
    "monitoring gempa",
    "pusat info gempa",
    "peringatan dini",
  ],
  social: {
    ogImage: "/public/og/home.png",
    twitterHandle: "@ini__alexx",
  },
} as const;

export const API_ENDPOINTS = {
  autoGempa: "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json",
  gempaDirasakan: "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json",
  gempaTerkini: "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json",
} as const;

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  tentang: "/tentang",
  detailGempa: (id: string) => `/gempa/${encodeURIComponent(id)}`,
} as const;
