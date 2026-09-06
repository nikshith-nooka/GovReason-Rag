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
  CheckCircle2
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
    },
    {
      icon: Building2,
      title: "Official sources only",
    },
    {
      icon: BrainCircuit,
      title: "Explainable reasoning",
    },
    {
      icon: Clock,
      title: "Always up to date",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline, Search, Feature pills */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5F0] border border-[#CFE7DC] text-[#123C35] text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#2F6B5F]" />
            <span>AI for a more informed India</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1B2A26] font-serif leading-[1.12]">
            Understand <br />
            Government Policies <br />
            <span className="text-[#C87D20]">Without the Headache.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
            Ask questions about government schemes, eligibility, documents, policy changes — and get evidence-backed, explainable answers.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white border border-[#CFD9CE] rounded-xl p-2 shadow-sm max-w-xl focus-within:border-[#123C35] focus-within:ring-2 focus-within:ring-[#123C35]/10 transition-all"
          >
            <div className="pl-3 pr-2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Which scholarships can I apply for?"
              className="flex-1 bg-transparent py-2.5 px-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-lg bg-[#123C35] hover:bg-[#1E5249] text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Search"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Suggested Quick Queries */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pt-1">
            <span className="font-medium text-gray-600">Popular:</span>
            {[
              "Am I eligible for PMAY?",
              "PM Scholarship documents",
              "Ayushman Bharat income limit",
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/assistant?q=${encodeURIComponent(tag)}`)}
                className="px-2.5 py-1 rounded-md bg-white border border-gray-200 hover:border-[#123C35] hover:text-[#123C35] transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Illustration & Artistic Accent */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-sm border border-[#E2E8E0] bg-white p-4 flex flex-col items-center justify-center">
            <Image
              src="/parliament.jpg"
              alt="Indian Parliament Illustration"
              width={420}
              height={420}
              className="object-contain rounded-xl"
              priority
            />
            {/* Overlay cursive tag */}
            <div className="absolute bottom-6 right-6 text-right">
              <span className="font-serif italic text-xs sm:text-sm text-[#8A5A20] tracking-wide block">
                Policies • People • Possibilities
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Feature Badges in a Row */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-[#E0E7DE] shadow-sm hover:border-[#2F6B5F] hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-[#EBF5F0] text-[#123C35] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#123C35]" />
              </div>
              <span className="font-semibold text-sm text-[#1B2A26]">
                {feat.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explore Portal Direct Actions Banner */}
      <div className="mt-12 p-6 rounded-2xl bg-[#EAF2ED] border border-[#CFDFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-[#123C35]">
            Ready to explore verified civic intelligence?
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            Access the citizen dashboard, run multi-criteria eligibility checks, and inspect statutory timeline amendments.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-lg bg-[#123C35] hover:bg-[#1E5249] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/schemes"
            className="px-4 py-2.5 rounded-lg bg-white border border-[#CFDFD5] hover:border-[#123C35] text-xs font-semibold text-[#123C35] transition-all"
          >
            Browse Schemes
          </Link>
        </div>
      </div>
    </div>
  );
}
