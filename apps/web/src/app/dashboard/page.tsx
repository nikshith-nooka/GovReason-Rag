"use client";

import Link from "next/link";
import {
  Bot,
  CheckSquare,
  Compass,
  History,
  GraduationCap,
  Home,
  HeartPulse,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  Clock,
  Layers,
  CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
  const metricCards = [
    {
      title: "Policies Indexed",
      value: "327",
      change: "↑ 12% gazettes this month",
      isPositive: true,
      icon: Layers
    },
    {
      title: "Active Versions",
      value: "284",
      change: "Bi-temporally validated",
      isPositive: true,
      icon: Clock
    },
    {
      title: "Evidence Coverage",
      value: "94.8%",
      change: "Statutory AST verified",
      isPositive: true,
      icon: ShieldCheck
    },
    {
      title: "Decision Accuracy",
      value: "91.7%",
      change: "Benchmark certified",
      isPositive: true,
      icon: FileCheck
    },
  ];

  const quickActions = [
    {
      title: "Ask AI Assistant",
      desc: "Conversational eligibility & gazette reasoning",
      icon: Bot,
      href: "/assistant",
      accent: "#123C35"
    },
    {
      title: "Eligibility Wizard",
      desc: "Step-by-step structured citizen verification",
      icon: CheckSquare,
      href: "/eligibility",
      accent: "#2F6B5F"
    },
    {
      title: "Explore Schemes",
      desc: "Filter by ministry, state, income & benefits",
      icon: Compass,
      href: "/schemes",
      accent: "#123C35"
    },
    {
      title: "Policy Timeline",
      desc: "Track amendments & superseded clauses",
      icon: History,
      href: "/timeline",
      accent: "#2F6B5F"
    },
  ];

  const recentUpdates = [
    {
      title: "Pradhan Mantri Awas Yojana (Urban 2.0)",
      desc: "EWS income ceiling confirmed at ₹3,00,000 with mandatory female co-ownership.",
      time: "Gazette 2026",
      icon: Home,
      tag: "Housing",
      href: "/schemes"
    },
    {
      title: "PM Scholarship Scheme for Wards of CAPF & AR",
      desc: "Minimum educational qualification benchmark set at 60% with Aadhaar DBT mandate.",
      time: "Gazette 2024",
      icon: GraduationCap,
      tag: "Education",
      href: "/schemes"
    },
    {
      title: "Ayushman Bharat PM-JAY 2024",
      desc: "Coverage expanded for senior citizens aged 70+ irrespective of family income.",
      time: "MoHFW Directive",
      icon: HeartPulse,
      tag: "Healthcare",
      href: "/schemes"
    },
    {
      title: "National Education Policy (NEP) Free Coaching",
      desc: "Eligibility guidelines updated for SC/OBC students appearing in national competitive exams.",
      time: "MoSJE Resolution",
      icon: BookOpen,
      tag: "Social Welfare",
      href: "/schemes"
    },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E5E9E6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#123C35] bg-[#D8F3EA] px-2.5 py-0.5 rounded-full border border-[#B2E2CE]">
              <Sparkles className="w-3 h-3 text-[#2F6B5F]" />
              Civic Intelligence Hub
            </span>
            <span className="text-xs text-[#71807B] font-medium hidden sm:inline">
              Understand. Verify. Decide.
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17211F] tracking-tight mt-1">
            Policy Overview & Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#123C35] hover:bg-[#1B5247] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Bot className="w-4 h-4 text-[#E8A317]" />
            <span>Launch Assistant</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="bg-white border border-[#E5E9E6] rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#71807B] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-[#FAFAF7] border border-[#E5E9E6] flex items-center justify-center text-[#123C35]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="text-3xl font-extrabold text-[#17211F] tracking-tight font-serif">
                {card.value}
              </div>

              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16805A] bg-[#EBF7F2] px-2 py-0.5 rounded-full border border-[#16805A]/20">
                <span>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Gazette Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#17211F] tracking-tight">
              Civic Navigation & Tools
            </h2>
            <span className="text-xs text-[#71807B]">Choose a tool to begin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  href={action.href}
                  className="group bg-white border border-[#E5E9E6] rounded-2xl p-5 shadow-xs hover:border-[#2F6B5F] hover:shadow-sm transition-all space-y-3 block"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#D8F3EA] text-[#123C35] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#2F6B5F]" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#71807B] group-hover:text-[#123C35] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-[#17211F] group-hover:text-[#123C35] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-[#71807B] leading-relaxed mt-1">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Evidence Contract highlight banner */}
          <div className="bg-[#FAFAF7] border-2 border-[#123C35] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#123C35] bg-[#D8F3EA] px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-[#16805A]" />
                Zero Hallucination Architecture
              </div>
              <h3 className="font-bold text-sm text-[#17211F]">
                Deterministic Neuro-Symbolic Verification
              </h3>
              <p className="text-xs text-[#71807B] leading-relaxed max-w-lg">
                Every query is evaluated by a Python AST rule graph before response synthesis. No answers without gazette grounding.
              </p>
            </div>

            <Link
              href="/evaluation"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E9E6] text-xs font-bold text-[#123C35] hover:border-[#2F6B5F] hover:bg-[#D8F3EA]/30 transition-colors shrink-0"
            >
              <span>View Benchmark</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Recent Policy & Gazette Updates (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#17211F] tracking-tight">
              Recent Gazette Updates
            </h2>
            <Link href="/timeline" className="text-xs font-bold text-[#2F6B5F] hover:underline">
              View All →
            </Link>
          </div>

          <div className="bg-white border border-[#E5E9E6] rounded-2xl p-4 shadow-xs divide-y divide-[#E5E9E6]">
            {recentUpdates.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="py-3.5 first:pt-1 last:pb-1 flex items-start gap-3 group hover:bg-[#FAFAF7] rounded-xl px-2.5 transition-colors block"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FAFAF7] border border-[#E5E9E6] text-[#123C35] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[#2F6B5F]">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#17211F] truncate group-hover:text-[#123C35]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#71807B] shrink-0 font-mono">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71807B] leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                    <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#2F6B5F] bg-[#D8F3EA] px-2 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
