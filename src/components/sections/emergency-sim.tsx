"use client";

import { useState, useRef, useCallback } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmergencySim() {
  const [isActive, setIsActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playAlertSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioContext;

      intervalRef.current = setInterval(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = "square";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }, 700);
    } catch (e) {
      console.log("Audio not supported");
    }
  }, []);

  const stopAlert = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
    if (navigator.vibrate) navigator.vibrate(0);
  }, []);

  const startSimulation = () => {
    setIsActive(true);
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 1000, 200, 1000]);
    }
    playAlertSound();
  };

  return (
    <>
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4 px-1 text-ios-text-primary">Simulasi Darurat</h2>
        <button
          onClick={startSimulation}
          className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-ios-red to-[#FF6B6B] text-white rounded-ios-xl active:scale-98 transition-transform shadow-lg shadow-ios-red/20"
        >
          <div className="w-12 h-12 rounded-ios-md bg-white/20 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-[17px]">Uji Siren Gempa</div>
            <div className="text-sm opacity-90">Ketuk untuk simulasi alarm</div>
          </div>
          <ChevronRight className="w-5 h-5 opacity-80" />
        </button>
      </section>

      {/* Emergency Modal */}
      <div
        className={cn(
          "fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-300",
          isActive ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={stopAlert} />
        <div className="relative bg-ios-surface rounded-ios-xl p-8 mx-5 text-center max-w-[320px] animate-modal-up">
          <div className="w-24 h-24 mx-auto mb-5 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-ios-red/30 rounded-full animate-siren" />
            <Bell className="w-12 h-12 text-ios-red animate-bell-shake" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3 text-ios-text-primary">🚨 SIMULASI ALARM</h2>
          <p className="text-[15px] text-ios-text-secondary mb-6 leading-relaxed">
            Ini adalah simulasi. Pada kondisi nyata, segera evakuasi ke tempat aman!
          </p>
          <button
            onClick={stopAlert}
            className="w-full py-3.5 bg-ios-accent text-white rounded-ios-lg font-semibold active:scale-96 transition-transform"
          >
            Matikan Alarm
          </button>
        </div>
      </div>
    </>
  );
}
