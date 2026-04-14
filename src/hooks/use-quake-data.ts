"use client";

import { useState, useEffect, useCallback } from "react";
import type { Gempa, QuakeStats } from "@/lib/types";
import { API_ENDPOINTS } from "@/lib/constants";
import { detectRegion } from "@/lib/utils";

interface UseQuakeDataReturn {
  data: Gempa[];
  latestQuake: Gempa | null;
  feltQuakes: Gempa[];
  majorQuakes: Gempa[];
  stats: QuakeStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useQuakeData(): UseQuakeDataReturn {
  const [data, setData] = useState<Gempa[]>([]);
  const [latestQuake, setLatestQuake] = useState<Gempa | null>(null);
  const [feltQuakes, setFeltQuakes] = useState<Gempa[]>([]);
  const [majorQuakes, setMajorQuakes] = useState<Gempa[]>([]);
  const [stats, setStats] = useState<QuakeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [resAuto, resFelt, resMajor] = await Promise.all([
        fetch(API_ENDPOINTS.autoGempa, { cache: "no-store" }),
        fetch(API_ENDPOINTS.gempaDirasakan, { cache: "no-store" }),
        fetch(API_ENDPOINTS.gempaTerkini, { cache: "no-store" }),
      ]);

      let allQuakes: Gempa[] = [];
      let auto: Gempa | null = null;

      // Parse auto gempa (latest)
      if (resAuto.ok) {
        const data = await resAuto.json();
        auto = data.Infogempa?.gempa as Gempa;
        if (auto) {
          allQuakes.push(auto);
          setLatestQuake(auto);
        }
      }

      // Parse felt quakes
      let felt: Gempa[] = [];
      if (resFelt.ok) {
        const data = await resFelt.json();
        const gempa = data.Infogempa?.gempa;
        felt = Array.isArray(gempa) ? gempa.slice(0, 15) : gempa ? [gempa] : [];
        setFeltQuakes(felt);
        allQuakes = allQuakes.concat(felt);
      }

      // Parse major quakes
      let major: Gempa[] = [];
      if (resMajor.ok) {
        const data = await resMajor.json();
        const gempa = data.Infogempa?.gempa;
        major = Array.isArray(gempa) ? gempa.slice(0, 15) : gempa ? [gempa] : [];
        const filteredMajor = major.filter((q) => parseFloat(q.Magnitude) >= 5);
        setMajorQuakes(filteredMajor);
        allQuakes = allQuakes.concat(major);
      }

      // Remove duplicates by DateTime
      const uniqueMap = new Map<string, Gempa>();
      allQuakes.forEach((q) => {
        if (q.DateTime) uniqueMap.set(q.DateTime, q);
      });
      const uniqueQuakes = Array.from(uniqueMap.values());
      setData(uniqueQuakes);

      // Calculate stats
      if (uniqueQuakes.length > 0) {
        const now = new Date();
        const last24h = uniqueQuakes.filter((q) => {
          const quakeTime = new Date(q.DateTime);
          return now.getTime() - quakeTime.getTime() < 24 * 60 * 60 * 1000;
        });

        const total = last24h.length || uniqueQuakes.length;
        const magnitudes = uniqueQuakes.map((q) => parseFloat(q.Magnitude));
        const maxMag = Math.max(...magnitudes);
        const avgMag = (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(1);

        const regions: Record<string, number> = {};
        uniqueQuakes.forEach((q) => {
          const region = detectRegion(q.Wilayah);
          regions[region] = (regions[region] || 0) + 1;
        });
        const mostActiveRegion = Object.entries(regions)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

        setStats({
          total24h: total,
          maxMagnitude: maxMag,
          activeRegion: mostActiveRegion,
          avgMagnitude: avgMag,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    data,
    latestQuake,
    feltQuakes,
    majorQuakes,
    stats,
    loading,
    error,
    refetch: fetchData,
  };
}

// Hook for single quake detail
export function useQuakeDetail(id: string) {
  const [quake, setQuake] = useState<Gempa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const all = await fetchAllQuakesStatic();
        const found = all.find((q) => q.DateTime === decodeURIComponent(id));
        setQuake(found || null);
      } catch (err) {
        setError("Gagal memuat detail gempa");
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  return { quake, loading, error };
}

// Static fetcher for detail page
async function fetchAllQuakesStatic(): Promise<Gempa[]> {
  const [resDirasakan, resTerkini, resAuto] = await Promise.all([
    fetch(API_ENDPOINTS.gempaDirasakan, { cache: "no-store" }),
    fetch(API_ENDPOINTS.gempaTerkini, { cache: "no-store" }),
    fetch(API_ENDPOINTS.autoGempa, { cache: "no-store" }),
  ]);

  let all: Gempa[] = [];

  if (resDirasakan.ok) {
    const data = await resDirasakan.json();
    const gempa = data.Infogempa?.gempa;
    all = all.concat(Array.isArray(gempa) ? gempa : gempa ? [gempa] : []);
  }
  if (resTerkini.ok) {
    const data = await resTerkini.json();
    const gempa = data.Infogempa?.gempa;
    all = all.concat(Array.isArray(gempa) ? gempa : gempa ? [gempa] : []);
  }
  if (resAuto.ok) {
    const data = await resAuto.json();
    const gempa = data.Infogempa?.gempa;
    if (gempa) all.push(gempa as Gempa);
  }

  const unique = new Map<string, Gempa>();
  all.forEach((q) => {
    if (q.DateTime) unique.set(q.DateTime, q);
  });

  return Array.from(unique.values());
}
