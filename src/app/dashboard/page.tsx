import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { MiniMap } from "@/components/map/mini-map";
import { TipsCarousel } from "@/components/sections/tips-carousel";
import { Timeline } from "@/components/sections/timeline";
import { QuakeList } from "@/components/sections/quake-list";
import { EmergencySim } from "@/components/sections/emergency-sim";
import { fetchAllQuakes, fetchAutoGempa, fetchGempaDirasakan, fetchGempaTerkini } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard - Pantau Gempa Real-time",
  description: "Informasi gempa bumi real-time dari BMKG Indonesia. Pantau gempa terkini, dirasakan, dan berpotensi tsunami dengan data akurat dan update terbaru.",
  keywords: [
    "dashboard gempa",
    "gempa terkini",
    "bmkg real-time",
    "peta gempa indonesia",
    "gempa hari ini",
    "info gempa terbaru",
    "peringatan tsunami",
  ],
  openGraph: {
    title: `Dashboard - ${SITE_CONFIG.fullName}`,
    description: "Pantau gempa bumi real-time seluruh Indonesia dengan data BMKG.",
    url: `${SITE_CONFIG.url}/dashboard`,
    images: [
      {
        url: "/og/dashboard.png",
        width: 1200,
        height: 630,
        alt: "Dashboard IGRI - Peta Gempa Real-time Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Dashboard - ${SITE_CONFIG.fullName}`,
    description: "Pantau gempa bumi real-time Indonesia.",
    images: ["/og/dashboard.png"],
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/dashboard`,
  },
};

// JSON-LD for WebApplication
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: `${SITE_CONFIG.fullName} Dashboard`,
  applicationCategory: "WeatherApplication",
  operatingSystem: "Any",
  description: "Dashboard monitoring gempa bumi real-time Indonesia",
  url: `${SITE_CONFIG.url}/dashboard`,
  author: {
    "@type": "Person",
    name: SITE_CONFIG.developer.name,
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IDR",
  },
};

export default async function DashboardPage() {
  const [allQuakes, autoGempa, feltQuakes, majorQuakes] = await Promise.all([
    fetchAllQuakes(),
    fetchAutoGempa(),
    fetchGempaDirasakan(),
    fetchGempaTerkini(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="min-h-screen bg-ios-bg pt-20 pb-10">
        <Container>
          <HeroSection />
          <StatsSection quakes={allQuakes} />
          
          {/* Mini Map Section */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-bold text-ios-text-primary">Peta Sebaran</h2>
              <button className="text-ios-accent text-[15px] font-medium hover:opacity-80">
                Lihat Detail
              </button>
            </div>
            <MiniMap quakes={allQuakes.slice(0, 30)} />
          </section>

          {/* Intensity Scale */}
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4 px-1 text-ios-text-primary">Skala Intensitas</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { level: "I-II", label: "Lemah", color: "bg-ios-green" },
                { level: "III-IV", label: "Ringan", color: "bg-ios-yellow" },
                { level: "V-VI", label: "Sedang", color: "bg-ios-orange" },
                { level: "VII+", label: "Kuat", color: "bg-ios-red" },
              ].map((item) => (
                <div 
                  key={item.level}
                  className="flex flex-col items-center gap-2 min-w-[70px] p-3 bg-ios-surface rounded-ios-md shadow-ios-sm"
                >
                  <div className={`w-8 h-8 rounded-full ${item.color} shadow-inner`} />
                  <span className="text-xs font-semibold text-ios-text-secondary">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <TipsCarousel />
          <Timeline quakes={allQuakes.slice(0, 8)} />
          
          {/* Search & Filter Placeholder */}
          <section className="mb-6">
            <div className="flex items-center gap-3 bg-ios-surface-secondary rounded-full px-4 py-3">
              <svg className="w-5 h-5 text-ios-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Cari wilayah..." 
                className="flex-1 bg-transparent outline-none text-ios-text-primary placeholder:text-ios-text-secondary"
              />
              <button className="w-8 h-8 rounded-full bg-ios-surface flex items-center justify-center text-ios-accent">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>
          </section>

          <QuakeList 
            latestQuake={autoGempa}
            feltQuakes={feltQuakes}
            majorQuakes={majorQuakes.filter(q => parseFloat(q.Magnitude) >= 5)}
          />
          
          <EmergencySim />
        </Container>
        <Footer />
      </main>
    </>
  );
}
