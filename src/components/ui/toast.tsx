"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type = "success", isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] transition-all duration-300",
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      )}
    >
      <div className="bg-black/80 backdrop-blur-xl text-white px-6 py-4 rounded-ios-xl flex items-center gap-3 shadow-lg">
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-ios-green" />
        ) : (
          <XCircle className="w-5 h-5 text-ios-red" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
