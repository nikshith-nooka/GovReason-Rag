"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { MarketingNav } from "@/components/MarketingNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketing = pathname === "/";

  if (isMarketing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
        <MarketingNav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#E2E8E0] bg-white py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#123C35] font-serif">GovReasonRAG</span>
              <span>•</span>
              <span>Understand. Verify. Decide.</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Grounding: Official Gazettes & Schemes</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} GovReasonRAG</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
