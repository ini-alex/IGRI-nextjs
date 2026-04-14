import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMagnitudeLevel(mag: string | number): import("@/lib/types").MagnitudeLevel {
  const magnitude = typeof mag === "string" ? parseFloat(mag) : mag;
  if (magnitude < 4.0) return "low";
  if (magnitude < 6.0) return "medium";
  return "high";
}

export function getMagnitudeColor(mag: string | number): string {
  const level = getMagnitudeLevel(mag);
  const colors = {
    low: "var(--ios-green)",
    medium: "var(--ios-orange)",
    high: "var(--ios-red)",
  };
  return colors[level];
}

export function detectRegion(wilayah: string): string {
  const w = wilayah.toLowerCase();
  if (w.includes("sumatera") || w.includes("aceh") || w.includes("padang") || w.includes("medan") || w.includes("bengkulu")) return "Sumatera";
  if (w.includes("jawa") || w.includes("jakarta") || w.includes("bandung") || w.includes("yogyakarta") || w.includes("surabaya") || w.includes("semarang")) return "Jawa";
  if (w.includes("kalimantan") || w.includes("borneo")) return "Kalimantan";
  if (w.includes("sulawesi") || w.includes("makassar") || w.includes("manado") || w.includes("palu")) return "Sulawesi";
  if (w.includes("bali") || w.includes("lombok") || w.includes("ntt") || w.includes("ntb") || w.includes("kupang")) return "Bali & NT";
  if (w.includes("papua") || w.includes("maluku") || w.includes("ambon") || w.includes("jayapura")) return "Papua & Maluku";
  return "Lainnya";
}

export function formatTimeAgo(dateTime: string): string {
  const time = new Date(dateTime);
  const now = new Date();
  const diff = Math.floor((now.getTime() - time.getTime()) / 60000);
  
  if (diff < 1) return "Baru";
  if (diff < 60) return `${diff}m`;
  if (diff < 1440) return `${Math.floor(diff / 60)}j`;
  return `${Math.floor(diff / 1440)}h`;
}

export function generateQuakeDescription(quake: import("@/lib/types").Gempa): string {
  return `Gempa bumi magnitude ${quake.Magnitude} M di ${quake.Wilayah} pada ${quake.Tanggal} ${quake.Jam} WIB. Kedalaman ${quake.Kedalaman}. ${quake.Potensi || "Tidak berpotensi tsunami"}. Data BMKG Indonesia.`;
}
