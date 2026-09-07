"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, Sun, Menu, Sparkles } from "lucide-react";

interface TopHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function TopHeader({ onOpenMobileMenu }: TopHeaderProps) {
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="h-16 border-b border-[#E5E9E6] bg-white/95 backdrop-blur-sm px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#123C35] hover:bg-[#F4F5F1] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71807B]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schemes, verify eligibility, or ask a policy question..."
            className="w-full bg-[#FAFAF7] border border-[#E5E9E6] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#17211F] placeholder-[#71807B] focus:outline-none focus:border-[#2F6B5F] focus:bg-white focus:ring-2 focus:ring-[#2F6B5F]/10 transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-3">
        {/* Grounding Live Status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#D8F3EA]/70 border border-[#B2E2CE] text-[#123C35] text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16805A] animate-pulse" />
          <span>AST Verified</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          className="relative p-2 rounded-xl text-[#71807B] hover:text-[#17211F] hover:bg-[#F4F5F1] transition-colors"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8A317] ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-[#E5E9E6]" />

        {/* User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-1 select-none">
          <div className="w-8 h-8 rounded-full bg-[#123C35] text-white font-bold flex items-center justify-center text-xs shadow-xs ring-2 ring-[#D8F3EA]">
            IN
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#17211F] leading-tight">Citizen Profile</div>
            <div className="text-[10px] text-[#71807B] leading-tight">General · Urban</div>
          </div>
        </div>
      </div>
    </header>
  );
}
