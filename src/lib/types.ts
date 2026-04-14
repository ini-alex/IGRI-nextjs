export interface Gempa {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi?: string;
  Dirasakan?: string;
  Shakemap?: string;
}

export interface InfoGempa {
  gempa: Gempa | Gempa[];
}

export interface BMKGResponse {
  Infogempa: InfoGempa;
}

export interface QuakeStats {
  total24h: number;
  maxMagnitude: number;
  activeRegion: string;
  avgMagnitude: string;
}

export interface TimelineItem {
  time: string;
  magnitude: string;
  color: string;
}

export type Theme = "light" | "dark";

export type MagnitudeLevel = "low" | "medium" | "high";

export interface TipItem {
  id: number;
  icon: string;
  title: string;
  content: string;
}
