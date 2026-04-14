import type { Metadata } from "next";
import Link from "next/link";
import { 
  Zap, 
  MapPin, 
  Bell, 
  Info, 
  Heart, 
  Mail, 
  Github,
  MessageCircle,
  ArrowRight 
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tentang - Info Gempa Republik Indonesia",
  description: "Info Gempa Republik Indonesia (IGRI) - Platform monitoring gempa bumi real-time dengan data resmi BMKG. Pantau aktivitas seismik, akses informasi mitigasi bencana, dan simulasi alarm darurat.",
  keywords: [
    "tentang igri",
    "info gempa indonesia",
    "bmkg",
    "monitoring seismik",
    "mitigasi bencana",
    "edukasi gempa",
    "alexaputra",
    "lexxa2nd",
  ],
  openGraph: {
    title: `Tentang - ${SITE_CONFIG.fullName}`,
    description: "Platform monitoring gempa bumi real-time Indonesia dengan data BMKG resmi.",
    url: `${SITE_CONFIG.url}/tentang`,
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Tentang IGRI - Info Gempa Republik Indonesia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Tentang - ${SITE_CONFIG.fullName}`,
    description: "Platform monitoring gempa bumi real-time Indonesia.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/tentang`,
  },
};

// JSON-LD Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.fullName,
  alternateName: SITE_CONFIG.shortName,
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/logo.png`,
  description: SITE_CONFIG.description,
  founder: {
    "@type": "Person",
    name: SITE_CONFIG.developer.name,
    email: SITE_CONFIG.developer.email,
    url: SITE_CONFIG.developer.github,
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE_CONFIG.developer.email,
    contactType: "technical support",
  },
  sameAs: [
    SITE_CONFIG.developer.github,
    SITE_CONFIG.developer.tiktok,
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main className="min-h-screen bg-ios-bg">
        {/* Hero Section */}
        <section className="pt-32 pb-10 px-5 text-center bg-gradient-to-b from-ios-surface to-ios-bg">
          <Container>
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-ios-accent to-ios-accent-secondary flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                IGRI
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-ios-text-primary">
              {SITE_CONFIG.shortName}
            </h1>
            <p className="text-lg text-ios-text-secondary mb-8 max-w-md mx-auto">
              Pantau aktivitas seismik Indonesia dengan presisi data BMKG real-time
            </p>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="w-full max-w-sm bg-ios-accent hover:bg-ios-accent/90 text-white rounded-ios-lg font-semibold h-14 text-lg gap-2"
              >
                Menuju Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-8 px-5">
          <Container>
            <h2 className="text-2xl font-bold mb-6 text-ios-text-primary">Fungsi Aplikasi</h2>
            <div className="grid gap-4">
              <Card className="bg-ios-surface border-ios-separator shadow-ios-sm">
                <CardContent className="p-5">
                  <div className="w-12 h-12 rounded-ios-md bg-ios-surface-secondary flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-ios-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-ios-text-primary">Real-Time Data</h3>
                  <p className="text-sm text-ios-text-secondary leading-relaxed">
                    Mengambil data langsung dari server BMKG Indonesia untuk update gempa terkini dalam hitungan detik.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ios-surface border-ios-separator shadow-ios-sm">
                <CardContent className="p-5">
                  <div className="w-12 h-12 rounded-ios-md bg-ios-surface-secondary flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-ios-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-ios-text-primary">Visualisasi Peta</h3>
                  <p className="text-sm text-ios-text-secondary leading-relaxed">
                    Pemetaan titik pusat gempa secara interaktif untuk mempermudah identifikasi wilayah terdampak.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-ios-surface border-ios-separator shadow-ios-sm">
                <CardContent className="p-5">
                  <div className="w-12 h-12 rounded-ios-md bg-ios-surface-secondary flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-ios-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-ios-text-primary">Simulasi Alarm</h3>
                  <p className="text-sm text-ios-text-secondary leading-relaxed">
                    Fitur edukasi sirene untuk melatih kesiapsiagaan menghadapi situasi darurat gempa bumi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Education Section */}
        <section className="py-8 px-5">
          <Container>
            <h2 className="text-2xl font-bold mb-6 text-ios-text-primary">Edukasi Gempa</h2>
            
            <Card className="bg-ios-surface border-ios-separator shadow-ios-sm mb-4">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-ios-text-primary">
                  <Info className="w-5 h-5 text-ios-orange" />
                  Skala Magnitudo
                </h3>
                <p className="text-[15px] text-ios-text-secondary leading-relaxed">
                  Magnitudo mengukur energi yang dilepaskan di pusat gempa. Semakin tinggi angkanya, semakin besar potensi kerusakan yang ditimbulkan. Skala Richter digunakan sebagai standar pengukuran.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-ios-surface border-ios-separator shadow-ios-sm">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-ios-text-primary">
                  <Heart className="w-5 h-5 text-ios-green" />
                  Langkah Mitigasi
                </h3>
                <ul className="text-[15px] text-ios-text-secondary leading-relaxed space-y-2 list-disc pl-5">
                  <li>Jangan panik, cari perlindungan di bawah meja yang kokoh</li>
                  <li>Jauhi kaca dan bangunan yang berpotensi runtuh</li>
                  <li>Jika di luar ruangan, cari area terbuka yang jauh dari tiang listrik</li>
                  <li>Ikuti instruksi evakuasi dari petugas berwenang</li>
                </ul>
              </CardContent>
            </Card>
          </Container>
        </section>

        {/* Developer Section */}
        <section className="py-10 px-5 bg-ios-surface-secondary mt-8 rounded-t-[30px]">
          <Container>
            <h2 className="text-2xl font-bold text-center mb-2 text-ios-text-primary">Developer</h2>
            <p className="text-sm text-ios-text-secondary text-center mb-8">
              Hubungi saya untuk kolaborasi atau menyampaikan feedback
            </p>
            
            <div className="flex justify-center gap-5">
              <a 
                href={`mailto:${SITE_CONFIG.developer.email}`}
                className="w-12 h-12 rounded-full bg-ios-surface flex items-center justify-center text-ios-text-primary shadow-ios-sm hover:bg-ios-accent hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href={SITE_CONFIG.developer.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-ios-surface flex items-center justify-center text-ios-text-primary shadow-ios-sm hover:bg-ios-green hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href={SITE_CONFIG.developer.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-ios-surface flex items-center justify-center text-ios-text-primary shadow-ios-sm hover:bg-gray-900 hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={SITE_CONFIG.developer.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-ios-surface flex items-center justify-center text-ios-text-primary shadow-ios-sm hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-1"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </Container>
        </section>

        <Footer />
      </main>
    </>
  );
}
