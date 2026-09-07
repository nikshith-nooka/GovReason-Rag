"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { MarketingNav } from "@/components/MarketingNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMarketing = pathname === "/";

  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
        <MarketingNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#E5E9E6] bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71807B]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#123C35] font-serif tracking-tight text-sm">GovReasonRAG</span>
              <span>•</span>
              <span className="font-medium text-[#17211F]">Understand. Verify. Decide.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Grounding: Official Gazettes & Operational Guidelines</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} GovReasonRAG</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  const isAssistant = pathname === "/assistant";

  return (
    <div className="h-screen flex bg-[#FAFAF7] overflow-hidden">
      {/* Persistent Left Sidebar on Desktop & Slide-out Drawer on Mobile */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className={
          isAssistant
            ? "flex-1 min-h-0 w-full mx-auto p-3 sm:p-4 lg:p-5 flex flex-col overflow-hidden max-w-[1700px]"
            : "flex-1 min-h-0 w-full mx-auto p-3.5 sm:p-5 lg:p-7 overflow-y-auto max-w-[1600px]"
        }>
          {children}
        </main>
      </div>
    </div>
  );
}
