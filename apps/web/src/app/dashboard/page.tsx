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
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const metricCards = [
    {
      title: "Policies Indexed",
      value: "327",
      change: "↑ 12% from last month",
      isPositive: true,
    },
    {
      title: "Active Versions",
      value: "284",
      change: "↑ 8% from last month",
      isPositive: true,
    },
    {
      title: "Evidence Coverage",
      value: "94.8%",
      change: null,
      isPositive: false,
    },
    {
      title: "Decision Accuracy",
      value: "91.7%",
      change: null,
      isPositive: false,
    },
  ];

  const quickActions = [
    {
      title: "Ask AI Assistant",
      desc: "Get instant answers",
      icon: Bot,
      href: "/assistant",
    },
    {
      title: "Check Eligibility",
      desc: "Step-by-step guide",
      icon: CheckSquare,
      href: "/eligibility",
    },
    {
      title: "Explore Schemes",
      desc: "Browse all schemes",
      icon: Compass,
      href: "/schemes",
    },
    {
      title: "Policy Timeline",
      desc: "View policy changes",
      icon: History,
      href: "/timeline",
    },
  ];

  const recentUpdates = [
    {
      title: "PM Scholarship Scheme",
      desc: "Guideline updated",
      time: "2 days ago",
      icon: GraduationCap,
      color: "bg-[#FFF4E5] text-[#D97706]",
      href: "/schemes",
    },
    {
      title: "PMAY 2.0",
      desc: "New amendment released",
      time: "3 days ago",
      icon: Home,
      color: "bg-[#FFF4E5] text-[#D97706]",
      href: "/timeline",
    },
    {
      title: "Ayushman Bharat",
      desc: "Application deadline extended",
      time: "5 days ago",
      icon: HeartPulse,
      color: "bg-[#EBF5F0] text-[#123C35]",
      href: "/schemes",
    },
    {
      title: "National Education Policy",
      desc: "New FAQs added",
      time: "1 week ago",
      icon: BookOpen,
      color: "bg-[#FFF4E5] text-[#D97706]",
      href: "/timeline",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back!
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Explore, ask, verify, and make informed decisions.
          </p>
        </div>
        <div className="text-xs font-medium text-gray-400">
          Dec 15, 2024
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-[#E2E8E0] rounded-xl p-5 shadow-sm hover:shadow transition-shadow"
          >
            <div className="text-xs font-medium text-gray-500">{card.title}</div>
            <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
              {card.value}
            </div>
            {card.change && (
              <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <span>{card.change}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Middle Section: Quick Actions + Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Actions (approx 65%) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  href={action.href}
                  className="group bg-white border border-[#E2E8E0] rounded-xl p-5 shadow-sm hover:border-[#123C35] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#EBF5F0] text-[#123C35] flex items-center justify-center mb-4 group-hover:bg-[#123C35] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#123C35] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Updates (approx 35%) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Updates</h2>
            <Link
              href="/timeline"
              className="text-xs font-semibold text-[#123C35] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="bg-white border border-[#E2E8E0] rounded-xl p-4 shadow-sm divide-y divide-gray-100">
            {recentUpdates.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center justify-between py-3 first:pt-1 last:pb-1 group hover:bg-[#F9FAF8] px-2 rounded-lg -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-gray-900 group-hover:text-[#123C35] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                    {item.time}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
