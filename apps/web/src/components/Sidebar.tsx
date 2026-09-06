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
  Sparkles
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 shrink-0 min-h-screen text-white flex flex-col justify-between select-none border-r border-[#0D2D27]"
      style={{ backgroundColor: "#123C35" }}
    >
      <div className="flex-1">
        {/* Brand Header */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <Link href="/dashboard" className="block">
            <div className="font-bold text-lg tracking-tight text-white flex items-center gap-1 font-serif">
              <span>GovReason</span>
              <span className="text-[#E8A317]">RAG</span>
            </div>
          </Link>
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1E5249] text-white shadow-sm font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#E8A317]" : "text-white/70"}`} />
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
    </aside>
  );
}
