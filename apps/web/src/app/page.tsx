"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  BrainCircuit,
  Clock,
  Sparkles,
  CheckCircle2,
  FileCheck,
  BookOpen,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Scale
} from "lucide-react";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/assistant?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/assistant");
    }
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Evidence-backed answers",
      desc: "Every eligibility determination is paired with an immutable Evidence Contract grounded in official Gazette notifications."
    },
    {
      icon: Building2,
      title: "Official sources only",
      desc: "Sourced directly from central ministries, gazettes, and official operational policy guidelines without fabrication."
    },
    {
      icon: BrainCircuit,
      title: "Explainable reasoning",
      desc: "Neuro-symbolic AST rule graph evaluates statutory clauses deterministically, delivering human-interpretable reasons."
    },
    {
      icon: Clock,
      title: "Bi-temporal accuracy",
      desc: "Tracks gazette publication dates vs. enforcement dates to prevent outdated advice across changing policy versions."
    }
  ];

  const popularQueries = [
    "Am I eligible for PMAY-Urban?",
    "PM Scholarship Scheme eligibility for CAPF",
    "Ayushman Bharat PM-JAY income limit",
    "National Social Assistance Programme (NSAP)"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Headline, Search, Feature pills */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8F3EA] border border-[#B2E2CE] text-[#123C35] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#2F6B5F]" />
            <span>Civic AI Intelligence Platform · Understand. Verify. Decide.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17211F] tracking-tight leading-[1.15] font-serif">
            Clear, verifiable answers to your <span className="text-[#123C35]">civic policy questions</span>.
          </h1>

          <p className="text-sm sm:text-base text-[#71807B] leading-relaxed max-w-xl">
            Empowering citizens and researchers with deterministic reasoning over Indian welfare schemes, gazette amendments, and statutory criteria.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="bg-white border border-[#E5E9E6] rounded-2xl p-2 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 focus-within:border-[#2F6B5F] focus-within:ring-2 focus-within:ring-[#2F6B5F]/15 transition-all"
          >
            <div className="flex items-center gap-2 px-3 flex-1 py-1 sm:py-0">
              <Search className="w-5 h-5 text-[#71807B] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about any scheme, income limit, or required documents..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#17211F] placeholder-[#71807B] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#123C35] hover:bg-[#1B5247] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <span>Ask Assistant</span>
              <ArrowRight className="w-4 h-4 text-[#E8A317]" />
            </button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#71807B]">
            <span className="font-bold text-[#17211F]">Try asking:</span>
            {popularQueries.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => router.push(`/assistant?q=${encodeURIComponent(item)}`)}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#E5E9E6] hover:border-[#2F6B5F] hover:bg-[#D8F3EA]/30 text-[#123C35] font-medium transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Illustration & Artistic Accent */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-md border-2 border-[#123C35]/15 bg-white p-4 flex flex-col items-center justify-center group hover:shadow-xl transition-all">
            {/* Top Gazette Grounded Badge */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D8F3EA] shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16805A] animate-pulse" />
              <span className="text-[11px] font-bold text-[#123C35] tracking-wide">Gazette Grounded · Active</span>
            </div>

            {/* Indian Parliament Illustration */}
            <Image
              src="/parliament.jpg"
              alt="Indian Parliament Illustration"
              width={420}
              height={420}
              className="object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-300"
              priority
            />

            {/* Overlay Cursive Tag */}
            <div className="absolute bottom-5 right-6 text-right bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-[#E5E9E6]/80 shadow-sm">
              <span className="font-serif italic text-xs sm:text-sm text-[#8A5A20] tracking-wide block font-medium">
                Policies • People • Possibilities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-6 pt-6 border-t border-[#E5E9E6]">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#17211F] tracking-tight">
            Built for transparency, accountability, and citizen trust.
          </h2>
          <p className="text-xs sm:text-sm text-[#71807B]">
            Combining deterministic symbolic logic with retrieval-augmented generation to eliminate hallucinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white border border-[#E5E9E6] rounded-2xl p-5 shadow-sm hover:shadow transition-all space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#D8F3EA] text-[#123C35] flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5 text-[#2F6B5F]" />
                </div>
                <h3 className="font-bold text-sm text-[#17211F]">{feat.title}</h3>
                <p className="text-xs text-[#71807B] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
