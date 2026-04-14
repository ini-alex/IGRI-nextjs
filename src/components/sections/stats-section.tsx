"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Flame, MapPin, Calculator } from "lucide-react";
import type { Gempa } from "@/lib/types";
import { detectRegion } from "@/lib/utils";

interface StatsSectionProps {
  quakes: Gempa[];
}

interface Stats {
  total: number;
  max: string;
  region: string;
  avg: string;
}

export function StatsSection({ quakes }: StatsSectionProps) {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    max: "-",
    region: "-",
    avg: "-",
  });

  useEffect(() => {
    if (!quakes.length) return;

    const now = new Date();
    const last24h = quakes.filter((q) => {
      const quakeTime = new Date(q.DateTime);
      return (now.getTime() - quakeTime.getTime()) < 24 * 60 * 60 * 1000;
    });

    const total = last24h.length || quakes.length;
    const magnitudes = quakes.map((q) => parseFloat(q.Magnitude));
    const maxMag = Math.max(...magnitudes);
    const avgMag = (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(1);

    const regions: Record<string, number> = {};
    quakes.forEach((q) => {
      const region = detectRegion(q.Wilayah);
      regions[region] = (regions[region] || 0) + 1;
    });
    const mostActiveRegion = Object.entries(regions)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    // Animate numbers
    animateValue("stat-total", total, setStats);
    animateValue("stat-max", maxMag, setStats, (v) => v.toFixed(1));
    animateValue("stat-avg", parseFloat(avgMag), setStats, (v) => v.toFixed(1));

    setStats((prev) => ({ ...prev, region: mostActiveRegion }));
  }, [quakes]);

  function animateValue(
    key: keyof Stats,
    target: number,
    setter: React.Dispatch<React.SetStateAction<Stats>>,
    formatter: (v: number) => string | number = (v) => Math.floor(v)
  ) {
    const duration = 1000;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = target * easeProgress;

      setter((prev) => ({
        ...prev,
        [key]: formatter(current),
      }));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setter((prev) => ({
          ...prev,
          [key]: formatter(target),
        }));
      }
    }

    requestAnimationFrame(update);
  }

  const statItems = [
    { icon: TrendingUp, color: "text-ios-accent", value: stats.total, label: "Total 24h" },
    { icon: Flame, color: "text-ios-orange", value: stats.max, label: "Terbesar" },
    { icon: MapPin, color: "text-ios-green", value: stats.region, label: "Wilayah Aktif" },
    { icon: Calculator, color: "text-ios-purple", value: stats.avg, label: "Rata-rata M" },
  ];

  return (
    <section className="mb-6">
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, i) => (
          <div
            key={i}
            className="bg-ios-surface rounded-ios-lg p-4 shadow-ios-sm flex flex-col active:scale-96 transition-transform"
          >
            <div className={`w-10 h-10 rounded-ios-md bg-ios-surface-secondary flex items-center justify-center mb-2 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-ios-text-primary tracking-tight">
              {item.value}
            </div>
            <div className="text-[13px] text-ios-text-secondary mt-0.5">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
