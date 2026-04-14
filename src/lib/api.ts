import { API_ENDPOINTS } from "./constants";
import type { BMKGResponse, Gempa } from "./types";

export async function fetchAutoGempa(): Promise<Gempa | null> {
  try {
    const res = await fetch(API_ENDPOINTS.autoGempa, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data: BMKGResponse = await res.json();
    return data.Infogempa.gempa as Gempa;
  } catch {
    return null;
  }
}

export async function fetchGempaDirasakan(): Promise<Gempa[]> {
  try {
    const res = await fetch(API_ENDPOINTS.gempaDirasakan, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: BMKGResponse = await res.json();
    const gempa = data.Infogempa.gempa;
    return Array.isArray(gempa) ? gempa.slice(0, 15) : [gempa];
  } catch {
    return [];
  }
}

export async function fetchGempaTerkini(): Promise<Gempa[]> {
  try {
    const res = await fetch(API_ENDPOINTS.gempaTerkini, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data: BMKGResponse = await res.json();
    const gempa = data.Infogempa.gempa;
    return Array.isArray(gempa) ? gempa.slice(0, 15) : [gempa];
  } catch {
    return [];
  }
}

export async function fetchAllQuakes(): Promise<Gempa[]> {
  const [auto, dirasakan, terkini] = await Promise.all([
    fetchAutoGempa(),
    fetchGempaDirasakan(),
    fetchGempaTerkini(),
  ]);

  const all = [];
  if (auto) all.push(auto);
  all.push(...dirasakan, ...terkini);

  // Remove duplicates by DateTime
  const unique = new Map<string, Gempa>();
  all.forEach((q) => {
    if (q.DateTime) unique.set(q.DateTime, q);
  });
  
  return Array.from(unique.values());
}

export async function fetchQuakeById(id: string): Promise<Gempa | null> {
  const all = await fetchAllQuakes();
  return all.find((q) => q.DateTime === decodeURIComponent(id)) || null;
}
