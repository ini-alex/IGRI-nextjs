import { MetadataRoute } from "next";
import { SITE_CONFIG, API_ENDPOINTS } from "@/lib/constants";
import type { BMKGResponse } from "@/lib/types";

export const revalidate = 300; // Revalidate setiap 5 menit

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  
  // Fetch dynamic quake data untuk generate URL detail
  let quakeUrls: MetadataRoute.Sitemap = [];
  
  try {
    const [resDirasakan, resTerkini, resAuto] = await Promise.all([
      fetch(API_ENDPOINTS.gempaDirasakan, { next: { revalidate: 300 } }),
      fetch(API_ENDPOINTS.gempaTerkini, { next: { revalidate: 300 } }),
      fetch(API_ENDPOINTS.autoGempa, { next: { revalidate: 300 } }),
    ]);

    let allQuakes: import("@/lib/types").Gempa[] = [];

    if (resDirasakan.ok) {
      const data: BMKGResponse = await resDirasakan.json();
      const gempa = data.Infogempa.gempa;
      allQuakes = allQuakes.concat(Array.isArray(gempa) ? gempa : [gempa]);
    }
    if (resTerkini.ok) {
      const data: BMKGResponse = await resTerkini.json();
      const gempa = data.Infogempa.gempa;
      allQuakes = allQuakes.concat(Array.isArray(gempa) ? gempa : [gempa]);
    }
    if (resAuto.ok) {
      const data: BMKGResponse = await resAuto.json();
      const gempa = data.Infogempa.gempa;
      if (gempa) allQuakes.push(gempa as import("@/lib/types").Gempa);
    }

    // Remove duplicates
    const unique = new Map<string, import("@/lib/types").Gempa>();
    allQuakes.forEach((q) => {
      if (q.DateTime) unique.set(q.DateTime, q);
    });

    quakeUrls = Array.from(unique.values()).map((quake) => ({
      url: `${baseUrl}/gempa/${encodeURIComponent(quake.DateTime)}`,
      lastModified: new Date(quake.DateTime),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    },
    ...quakeUrls,
  ];
}
