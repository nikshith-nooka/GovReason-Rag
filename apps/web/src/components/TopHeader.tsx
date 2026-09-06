"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, Sun, Shield } from "lucide-react";

export function TopHeader() {
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="h-16 border-b border-[#E2E8E0] bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schemes, policies, or ask a question..."
          className="w-full bg-[#F5F7F5] border border-[#E0E6DF] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#123C35] focus:bg-white transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification Bell */}
        <button
          type="button"
          title="Notifications"
          className="relative p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8A317]" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          title="Toggle mode"
          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-full bg-[#123C35] text-white font-bold flex items-center justify-center text-sm shadow-sm">
            S
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-gray-900 leading-tight">StudyUser</div>
            <div className="text-[11px] text-gray-500 leading-tight">Student</div>
          </div>
        </div>
      </div>
    </header>
  );
}
