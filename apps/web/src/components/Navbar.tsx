"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bot, CheckSquare, Layers,
  GitCompare, GitBranch, BarChart3, Globe, ShieldCheck
} from "lucide-react";
import { useLanguage, Language } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: "/",            label: t.navDashboard,   icon: LayoutDashboard },
    { href: "/assistant",   label: t.navAssistant,   icon: Bot },
    { href: "/eligibility", label: t.navEligibility, icon: CheckSquare },
    { href: "/schemes",     label: t.navSchemes,     icon: Layers },
    { href: "/compare",     label: t.navCompare,     icon: GitCompare },
    { href: "/timeline",    label: t.navTimeline,    icon: GitBranch },
    { href: "/evaluation",  label: t.navEvaluation,  icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full" style={{background:"#123C35"}}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-8 bg-white/10 ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-white tracking-tight" style={{fontFamily:"Manrope,sans-serif"}}>
              GovReason<span style={{color:"#E8A317"}}>RAG</span>
            </span>
            <p className="text-[10px] text-white/50 leading-none mt-0.5 hidden sm:block">Understand · Verify · Decide</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Live status */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            <span style={{color:"#D8F3EA"}}>Gazette Grounded</span>
          </div>

          {/* Language */}
          <div className="flex items-center gap-1.5 rounded-6 border border-white/15 bg-white/8 px-2.5 py-1">
            <Globe className="h-3 w-3 text-white/50" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[11px] font-medium text-white/80 focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-[#123C35]">EN</option>
              <option value="hi" className="bg-[#123C35]">हिन्दी</option>
              <option value="te" className="bg-[#123C35]">తెలుగు</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile scroll nav */}
      <div className="flex lg:hidden overflow-x-auto border-t border-white/10 px-4 py-1.5 gap-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`shrink-0 flex items-center gap-1 rounded-6 px-2.5 py-1 text-[11px] font-medium transition-colors ${
                active ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
              }`}>
              <Icon className="h-3 w-3" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
