"use client";

import Link from "next/link";
import { Sparkles, Globe } from "lucide-react";
import { useLanguage, Language } from "@/lib/i18n";

export function MarketingNav() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="w-full bg-white/95 backdrop-blur border-b border-[#E2E8E0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#123C35] text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#E8A317]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#123C35] font-serif">
            GovReason<span className="text-[#E8A317]">RAG</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="text-[#123C35] font-semibold hover:text-[#123C35] transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-[#123C35] transition-colors">
            Features
          </Link>
          <Link href="/schemes" className="hover:text-[#123C35] transition-colors">
            Schemes
          </Link>
          <Link href="/evaluation" className="hover:text-[#123C35] transition-colors">
            About
          </Link>
          <Link href="/assistant" className="hover:text-[#123C35] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5DDD3] bg-white text-xs text-gray-700">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select interface language"
              className="bg-transparent font-medium text-xs text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          {/* Sign In Button */}
          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-lg bg-[#123C35] hover:bg-[#1E5249] text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
