import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="text-center py-10 text-ios-text-secondary text-[13px]">
      <p>Sumber data: BMKG Indonesia</p>
      <p className="mt-1 font-medium">
        Update: {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <p className="mt-4 text-xs opacity-60">
        © 2026 {SITE_CONFIG.developer.name}. All rights reserved.
      </p>
    </footer>
  );
}
