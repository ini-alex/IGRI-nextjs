"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

interface UseThemeReturn {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  systemTheme: string | undefined;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export function useTheme(): UseThemeReturn {
  const {
    theme,
    setTheme: setNextTheme,
    resolvedTheme,
    systemTheme,
  } = useNextTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setTheme = (newTheme: string) => {
    setNextTheme(newTheme);
    // Haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return {
      theme: undefined,
      setTheme,
      resolvedTheme: undefined,
      systemTheme: undefined,
      toggleTheme,
      isDark: false,
      isLight: false,
    };
  }

  const isDark = resolvedTheme === "dark";
  const isLight = resolvedTheme === "light";

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    toggleTheme,
    isDark,
    isLight,
  };
}

// Hook for theme-aware colors (maps, charts, etc)
export function useThemeColor() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const colors = {
    // Map tiles
    mapTileUrl: isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",

    // UI colors
    bg: isDark ? "#000000" : "#F2F2F7",
    surface: isDark ? "#1C1C1E" : "#FFFFFF",
    surfaceSecondary: isDark ? "#2C2C2E" : "#F2F2F7",
    textPrimary: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#8E8E93" : "#8E8E93",
    separator: isDark ? "#38383A" : "#E5E5EA",

    // Accent colors (slightly adjusted for dark mode)
    accent: isDark ? "#0A84FF" : "#007AFF",
    green: isDark ? "#30D158" : "#34C759",
    orange: isDark ? "#FF9F0A" : "#FF9500",
    red: isDark ? "#FF453A" : "#FF3B30",
  };

  return { isDark, colors };
}
