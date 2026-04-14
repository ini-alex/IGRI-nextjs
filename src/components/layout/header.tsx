"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";

interface HeaderProps {
  compact?: boolean;
}

export function Header({ compact = false }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    if (navigator.vibrate) navigator.vibrate(10);
  };

  if (compact) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-ios-surface/72 backdrop-blur-xl border-b border-ios-separator safe-area-top">
        <div className="max-w-[430px] mx-auto px-4 h-14 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1 text-ios-accent -ml-2 px-2 py-1 rounded-lg active:opacity-60 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-[17px]">Kembali</span>
          </Link>
          <h1 className="text-[17px] font-semibold flex-1 text-center mr-14 text-ios-text-primary">
            Detail Gempa
          </h1>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-ios-surface-secondary flex items-center justify-center text-ios-accent active:scale-90 transition-transform"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ios-surface/72 backdrop-blur-xl border-b border-ios-separator safe-area-top">
      <div className="max-w-[430px] mx-auto px-4 h-[52px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-ios-text-primary no-underline">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ios-accent to-ios-accent-secondary flex items-center justify-center text-white font-bold text-sm">
            I
          </div>
          <span className="text-xl font-bold tracking-tight">{SITE_CONFIG.shortName}</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full bg-ios-surface-secondary flex items-center justify-center text-ios-accent active:scale-90 transition-transform"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
