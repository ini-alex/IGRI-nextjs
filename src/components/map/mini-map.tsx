"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import type { Gempa } from "@/lib/types";
import { getMagnitudeColor } from "@/lib/utils";

interface MiniMapProps {
  quakes: Gempa[];
}

export function MiniMap({ quakes }: MiniMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
    }).setView([-2.5, 118], 4);

    mapRef.current = map;

    // Add tile layer based on theme
    const isDark = theme === "dark";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Add markers
    quakes.forEach((quake) => {
      const [lat, lon] = quake.Coordinates.split(",").map((c) => parseFloat(c.trim()));
      const mag = parseFloat(quake.Magnitude);
      const color = mag >= 5 ? "#FF3B30" : mag >= 4 ? "#FF9500" : "#007AFF";

      L.circleMarker([lat, lon], {
        radius: Math.max(3, mag),
        fillColor: color,
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [quakes, theme]);

  return (
    <div className="relative h-[200px] rounded-ios-xl overflow-hidden bg-ios-surface-secondary">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 z-[400]">
        <div className="bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {quakes.length} gempa
        </div>
      </div>
    </div>
  );
}
