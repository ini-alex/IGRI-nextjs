"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn, getMagnitudeLevel } from "@/lib/utils";
import type { Gempa } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface QuakeListProps {
  latestQuake: Gempa | null;
  feltQuakes: Gempa[];
  majorQuakes: Gempa[];
}

interface ListItemProps {
  quake: Gempa;
  index?: number;
}

function QuakeListItem({ quake, index = 0 }: ListItemProps) {
  const level = getMagnitudeLevel(quake.Magnitude);
  const colors = {
    low: "text-ios-green bg-ios-green/10",
    medium: "text-ios-orange bg-ios-orange/10",
    high: "text-ios-red bg-ios-red/10",
  };

  return (
    <Link
      href={`/gempa/${encodeURIComponent(quake.DateTime)}`}
      className="flex items-center gap-3 p-4 border-b border-ios-separator last:border-0 active:bg-ios-surface-secondary transition-colors"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className={cn("w-14 h-14 rounded-ios-md flex flex-col items-center justify-center font-bold", colors[level])}>
        <span className="text-xl leading-none">{quake.Magnitude}</span>
        <span className="text-[10px] uppercase tracking-wide opacity-80">M</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ios-text-primary truncate">
          {quake.Wilayah}
        </div>
        <div className="text-[13px] text-ios-text-secondary flex items-center gap-1 mt-0.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {quake.Tanggal} • {quake.Jam}
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-ios-text-tertiary -rotate-90" />
    </Link>
  );
}

interface CollapsibleSectionProps {
  title: string;
  badge?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, badge, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (navigator.vibrate) navigator.vibrate(5);
        }}
        className="w-full flex items-center gap-2 py-3 px-1"
      >
        <h2 className="text-xl font-bold flex-1 text-left text-ios-text-primary">{title}</h2>
        {badge !== undefined && (
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5">
            {badge}
          </Badge>
        )}
        <div className={cn("w-8 h-8 flex items-center justify-center transition-transform duration-300", isOpen && "rotate-180")}>
          <ChevronDown className="w-4 h-4 text-ios-text-secondary" />
        </div>
      </button>
      <div className={cn("overflow-hidden transition-all duration-400", isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0")}>
        <div className="bg-ios-surface rounded-ios-lg shadow-ios-sm overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export function QuakeList({ latestQuake, feltQuakes, majorQuakes }: QuakeListProps) {
  if (!latestQuake) return null;

  const hasTsunami = latestQuake.Potensi?.toLowerCase().includes("tsunami");

  return (
    <>
      {/* Latest Quake - Featured */}
      <CollapsibleSection title="Gempa Terbaru" defaultOpen>
        <div className="p-6 bg-gradient-to-br from-ios-surface to-ios-surface-secondary relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ios-accent to-ios-accent-secondary" />
          
          <div className="text-[72px] font-extrabold leading-none text-gradient mb-2">
            {latestQuake.Magnitude}
          </div>
          <div className="text-[15px] text-ios-text-secondary font-semibold uppercase tracking-wide mb-5">
            Magnitudo
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center py-2 border-b border-ios-separator">
              <span className="text-[15px] text-ios-text-secondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Waktu
              </span>
              <span className="text-[15px] font-semibold text-ios-text-primary">
                {latestQuake.Tanggal}, {latestQuake.Jam}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-ios-separator">
              <span className="text-[15px] text-ios-text-secondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Lokasi
              </span>
              <span className="text-[15px] font-semibold text-ios-text-primary text-right max-w-[60%]">
                {latestQuake.Wilayah}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-ios-separator">
              <span className="text-[15px] text-ios-text-secondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Kedalaman
              </span>
              <span className="text-[15px] font-semibold text-ios-text-primary">
                {latestQuake.Kedalaman}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-ios-text-secondary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Koordinat
              </span>
              <span className="text-[15px] font-semibold text-ios-text-primary">
                {latestQuake.Coordinates}
              </span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2.5 p-3 rounded-ios-md text-[15px] font-medium",
            hasTsunami ? "bg-ios-red/10 text-ios-red" : "bg-ios-green/10 text-ios-green"
          )}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {hasTsunami ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              )}
            </svg>
            <span>{latestQuake.Potensi || "Tidak berpotensi tsunami"}</span>
          </div>

          <Link
            href={`/gempa/${encodeURIComponent(latestQuake.DateTime)}`}
            className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 bg-ios-accent text-white rounded-ios-lg font-semibold active:scale-95 transition-transform"
          >
            <span>Lihat Detail</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </CollapsibleSection>

      {/* Felt Quakes */}
      <CollapsibleSection title="Dirasakan" badge={feltQuakes.length}>
        <div>
          {feltQuakes.map((quake, i) => (
            <QuakeListItem key={quake.DateTime} quake={quake} index={i} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Major Quakes */}
      <CollapsibleSection title="Magnitudo ≥ 5.0" badge={majorQuakes.length}>
        <div>
          {majorQuakes.map((quake, i) => (
            <QuakeListItem key={quake.DateTime} quake={quake} index={i} />
          ))}
        </div>
      </CollapsibleSection>
    </>
  );
}
