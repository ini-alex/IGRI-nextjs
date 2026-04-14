"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const tips = [
  {
    id: 1,
    icon: "🚨",
    title: "Saat Gempa Terjadi",
    content: "Tetap tenang, lindungi kepala, cari tempat berlindung di bawah meja yang kokoh.",
  },
  {
    id: 2,
    icon: "🚪",
    title: "Evakuasi",
    content: "Jangan gunakan lift. Gunakan tangga darurat. Bantu lansia & anak-anak.",
  },
  {
    id: 3,
    icon: "📱",
    title: "Siapkan Emergency Kit",
    content: "Simpan air, makanan, obat-obatan, dan power bank di tempat mudah dijangkau.",
  },
];

export function TipsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-ios-text-primary">Tips Safety</h2>
        <div className="flex gap-1.5">
          {tips.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-5 bg-ios-accent" : "w-1.5 bg-ios-text-tertiary"
              )}
              aria-label={`Go to tip ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative h-[160px] overflow-hidden rounded-ios-xl">
        {tips.map((tip, i) => (
          <div
            key={tip.id}
            className={cn(
              "absolute inset-0 p-5 flex flex-col justify-center transition-all duration-500",
              "bg-gradient-to-br from-ios-accent to-ios-accent-secondary text-white",
              i === current
                ? "translate-x-0 opacity-100"
                : i < current
                ? "-translate-x-full opacity-0"
                : "translate-x-full opacity-0"
            )}
          >
            <div className="text-3xl mb-2">{tip.icon}</div>
            <h3 className="text-lg font-bold mb-1">{tip.title}</h3>
            <p className="text-sm opacity-90 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
