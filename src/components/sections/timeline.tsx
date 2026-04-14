"use client";

import { formatTimeAgo, getMagnitudeColor } from "@/lib/utils";
import type { Gempa } from "@/lib/types";

interface TimelineProps {
  quakes: Gempa[];
}

export function Timeline({ quakes }: TimelineProps) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4 px-1 text-ios-text-primary">Aktivitas Terbaru</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {quakes.map((quake, i) => {
          const color = getMagnitudeColor(quake.Magnitude);
          const timeText = formatTimeAgo(quake.DateTime);

          return (
            <div
              key={quake.DateTime}
              className="flex flex-col items-center min-w-[70px] text-center animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className="w-3 h-3 rounded-full border-[3px] border-ios-surface mb-2 relative z-10"
                style={{ backgroundColor: color, boxShadow: `0 0 0 2px ${color}` }}
              />
              <span className="text-xs text-ios-text-secondary mb-1">{timeText}</span>
              <span className="text-[15px] font-bold text-ios-text-primary">
                {quake.Magnitude}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
