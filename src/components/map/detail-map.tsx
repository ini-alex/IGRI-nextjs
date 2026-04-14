"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { getMagnitudeColor } from "@/lib/utils";

interface DetailMapProps {
  lat: number;
  lon: number;
  magnitude: number;
  wilayah: string;
}

export function DetailMap({ lat, lon, magnitude, wilayah }: DetailMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([lat, lon], 8);

    mapRef.current = map;

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Add tile layer
    const isDark = theme === "dark";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    // Custom marker
    const markerColor = getMagnitudeColor(magnitude);
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 24px; 
        height: 24px; 
        background: ${markerColor}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([lat, lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: -apple-system, sans-serif; text-align: center;">
          <div style="font-size: 18px; font-weight: 700; color: ${markerColor};">${magnitude} M</div>
          <div style="font-size: 13px; color: #666; margin-top: 4px;">${wilayah}</div>
        </div>`,
        { closeButton: false }
      )
      .openPopup();

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lon, magnitude, wilayah, theme]);

  return <div ref={containerRef} className="w-full h-full bg-ios-surface-secondary" />;
}
