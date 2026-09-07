"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  Layers,
  CheckSquare,
  GitCommit,
  Columns,
  ShieldCheck,
  BarChart3,
  Settings,
  Sparkles,
  X
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/schemes", label: "Schemes", icon: Layers },
  { href: "/eligibility", label: "Eligibility", icon: CheckSquare },
  { href: "/timeline", label: "Policy Timeline", icon: GitCommit },
  { href: "/compare", label: "Compare", icon: Columns },
  { href: "/evidence", label: "Evidence", icon: ShieldCheck },
  { href: "/evaluation", label: "Evaluation", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#123C35] text-white select-none">
      <div className="flex-1">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-lg tracking-tight text-white flex items-center gap-1 font-serif">
                <span>GovReason</span>
                <span className="text-[#E8A317]">RAG</span>
              </div>
              <div className="text-[10px] text-white/50 tracking-wider uppercase font-medium">
                Understand. Verify. Decide.
              </div>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1E5249] text-white shadow-sm font-semibold border-l-2 border-[#E8A317]"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#E8A317]" : "text-white/70"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status / Citation grounding indicator */}
      <div className="p-4 border-t border-white/10 text-xs text-white/60">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium text-[11px]">Gazette Grounded</span>
        </div>
        <p className="text-[10px] text-white/40 leading-relaxed">
          Evidence-contracted policy reasoning for Indian welfare schemes
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 min-h-screen border-r border-[#0D2D27] sticky top-0 h-screen overflow-y-auto z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 animate-fade-up">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
