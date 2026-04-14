import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";
import { DetailMap } from "@/components/map/detail-map";
import { fetchQuakeById } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";
import { generateQuakeDescription, getMagnitudeColor, getMagnitudeLevel } from "@/lib/utils";
import { Calendar, Clock, Ruler, Compass, Waves, Share2, FileText, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quake = await fetchQuakeById(id);
  
  if (!quake) {
    return {
      title: "Gempa Tidak Ditemukan",
      description: "Data gempa yang Anda cari tidak tersedia.",
    };
  }

  const title = `Gempa ${quake.Magnitude} M - ${quake.Wilayah}`;
  const description = generateQuakeDescription(quake);
  const ogImageUrl = `/api/og?title=${encodeURIComponent(quake.Magnitude + " M")}&wilayah=${encodeURIComponent(quake.Wilayah)}&tanggal=${encodeURIComponent(quake.Tanggal)}`;

  return {
    title,
    description,
    keywords: [
      `gempa ${quake.Magnitude} M`,
      `gempa ${quake.Wilayah}`,
      "bmkg",
      "info gempa",
      "gempa bumi",
      quake.Tanggal,
    ],
    openGraph: {
      title: `${title} | ${SITE_CONFIG.shortName}`,
      description,
      url: `${SITE_CONFIG.url}/gempa/${encodeURIComponent(id)}`,
      type: "article",
      publishedTime: quake.DateTime,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Gempa ${quake.Magnitude} M di ${quake.Wilayah}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.shortName}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/gempa/${encodeURIComponent(id)}`,
    },
  };
}

// JSON-LD for Earthquake Event
function generateStructuredData(quake: import("@/lib/types").Gempa) {
  const [lat, lon] = quake.Coordinates.split(",").map(c => parseFloat(c.trim()));
  
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Gempa Bumi ${quake.Magnitude} M - ${quake.Wilayah}`,
    description: generateQuakeDescription(quake),
    startDate: quake.DateTime,
    location: {
      "@type": "Place",
      name: quake.Wilayah,
      geo: {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lon,
      },
    },
    performer: {
      "@type": "Organization",
      name: "BMKG Indonesia",
    },
    organizer: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      url: SITE_CONFIG.url,
    },
  };
}

export default async function QuakeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const quake = await fetchQuakeById(id);

  if (!quake) {
    notFound();
  }

  const magnitudeColor = getMagnitudeColor(quake.Magnitude);
  const magnitudeLevel = getMagnitudeLevel(quake.Magnitude);
  const hasTsunami = quake.Potensi?.toLowerCase().includes("tsunami");
  const [lat, lon] = quake.Coordinates.split(",").map(c => c.trim());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(quake)) }}
      />
      <Header compact />
      <main className="min-h-screen bg-ios-bg pt-16">
        {/* Map Section */}
        <div className="relative h-[280px] -mx-0">
          <DetailMap 
            lat={parseFloat(lat)} 
            lon={parseFloat(lon)} 
            magnitude={parseFloat(quake.Magnitude)}
            wilayah={quake.Wilayah}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400]">
            <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Compass className="w-4 h-4" />
              {quake.Coordinates}
            </div>
          </div>
        </div>

        <Container className="py-6">
          {/* Detail Content */}
          <div className="bg-ios-surface rounded-ios-xl p-5 shadow-ios-sm mb-6">
            <div className="text-center pb-5 border-b border-ios-separator mb-5">
              <div 
                className="text-6xl font-extrabold mb-2"
                style={{ color: magnitudeColor }}
              >
                {quake.Magnitude} M
              </div>
              <h1 className="text-xl font-semibold text-ios-text-primary leading-tight">
                {quake.Wilayah}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-ios-surface-secondary rounded-ios-md p-3">
                <div className="w-8 h-8 rounded-full bg-ios-surface flex items-center justify-center text-ios-accent mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-xs text-ios-text-secondary uppercase font-semibold tracking-wide">Tanggal</span>
                <p className="text-base font-semibold text-ios-text-primary mt-1">{quake.Tanggal}</p>
              </div>

              <div className="bg-ios-surface-secondary rounded-ios-md p-3">
                <div className="w-8 h-8 rounded-full bg-ios-surface flex items-center justify-center text-ios-accent mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs text-ios-text-secondary uppercase font-semibold tracking-wide">Waktu</span>
                <p className="text-base font-semibold text-ios-text-primary mt-1">{quake.Jam} WIB</p>
              </div>

              <div className="bg-ios-surface-secondary rounded-ios-md p-3">
                <div className="w-8 h-8 rounded-full bg-ios-surface flex items-center justify-center text-ios-accent mb-2">
                  <Ruler className="w-4 h-4" />
                </div>
                <span className="text-xs text-ios-text-secondary uppercase font-semibold tracking-wide">Kedalaman</span>
                <p className="text-base font-semibold text-ios-text-primary mt-1">{quake.Kedalaman}</p>
              </div>

              <div className="bg-ios-surface-secondary rounded-ios-md p-3">
                <div className="w-8 h-8 rounded-full bg-ios-surface flex items-center justify-center text-ios-accent mb-2">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-xs text-ios-text-secondary uppercase font-semibold tracking-wide">Koordinat</span>
                <p className="text-base font-semibold text-ios-text-primary mt-1">{quake.Coordinates}</p>
              </div>

              <div className="col-span-2 bg-ios-surface-secondary rounded-ios-md p-3">
                <div className="w-8 h-8 rounded-full bg-ios-surface flex items-center justify-center text-ios-accent mb-2">
                  <Waves className="w-4 h-4" />
                </div>
                <span className="text-xs text-ios-text-secondary uppercase font-semibold tracking-wide">Potensi Tsunami</span>
                <p className={`text-base font-semibold mt-1 ${hasTsunami ? "text-ios-red" : "text-ios-green"}`}>
                  {quake.Potensi || "Tidak berpotensi tsunami"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="bg-ios-surface rounded-ios-xl p-5 shadow-ios-sm">
            <h3 className="text-xl font-bold mb-2 text-ios-text-primary">Bagikan Informasi</h3>
            <p className="text-sm text-ios-text-secondary mb-5">
              Sebarkan informasi gempa ini untuk meningkatkan kewaspadaan masyarakat.
            </p>
            
            <div className="flex gap-3 mb-4">
              <Button 
                className="flex-1 bg-ios-accent hover:bg-ios-accent/90 text-white rounded-ios-lg h-14 flex-col gap-1"
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs font-semibold">Buat Ringkasan</span>
              </Button>
              <Button 
                variant="outline"
                className="flex-1 bg-ios-surface-secondary hover:bg-ios-surface-secondary/80 text-ios-accent border-0 rounded-ios-lg h-14 flex-col gap-1"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-semibold">Bagikan</span>
              </Button>
            </div>

            <div className="bg-ios-surface-secondary rounded-ios-xl p-4 hidden">
              <div className="w-9 h-1 bg-ios-text-tertiary rounded-full mx-auto mb-4 opacity-50" />
              <textarea 
                readOnly
                className="w-full min-h-[140px] p-3 bg-ios-surface border border-ios-separator rounded-ios-md text-xs font-mono text-ios-text-primary resize-none mb-3"
                value={`🚨 INFO GEMPA BUMI\n\n📍 Lokasi: ${quake.Wilayah}\n🕐 Waktu: ${quake.Tanggal} ${quake.Jam} WIB\n📊 Magnitudo: ${quake.Magnitude} M\n↕️ Kedalaman: ${quake.Kedalaman}\n🌊 Potensi: ${quake.Potensi || "Tidak ada"}\n\nSumber: BMKG Indonesia\n${SITE_CONFIG.url}`}
              />
              <Button className="w-full bg-ios-accent hover:bg-ios-accent/90 text-white rounded-ios-lg h-12 gap-2">
                <Copy className="w-4 h-4" />
                Salin ke Clipboard
              </Button>
            </div>
          </div>
        </Container>
        <Footer />
      </main>
    </>
  );
}
