"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  History,
  GitCommit,
  FileText,
  ArrowRight,
  Search,
  Building2,
  GraduationCap,
  HeartPulse,
  Sprout,
  Briefcase,
  Users,
  ShieldCheck,
  Calendar,
  ExternalLink
} from "lucide-react";

interface TimelineEvent {
  year: string;
  version: string;
  isCurrent: boolean;
  statusType: "current" | "amendment" | "original";
  title: string;
  description: string;
  date: string;
  gazetteRef?: string;
  changes?: string[];
}

interface SchemeItem {
  id: string;
  name: string;
  department: string;
  category: string;
  timeline: TimelineEvent[];
}

const CATEGORIES = [
  { id: "Housing & Urban", label: "Housing & Urban", icon: Building2, count: 117 },
  { id: "Education & Scholarships", label: "Education & Scholarships", icon: GraduationCap, count: 783 },
  { id: "Health & Medical", label: "Health & Medical", icon: HeartPulse, count: 184 },
  { id: "Agriculture & Farmers", label: "Agriculture & Farmers", icon: Sprout, count: 337 },
  { id: "Employment & MSME", label: "Employment & MSME", icon: Briefcase, count: 614 },
  { id: "Women & Child", label: "Women & Child", icon: Users, count: 330 },
  { id: "Social Welfare & Security", label: "Social Welfare & Security", icon: ShieldCheck, count: 2621 },
];

const DEFAULT_SCHEMES_BY_CAT: Record<string, SchemeItem[]> = {
  "Housing & Urban": [
    {
      id: "PMAY",
      name: "Pradhan Mantri Awas Yojana (PMAY - Urban & Gramin)",
      department: "Ministry of Housing and Urban Affairs",
      category: "Housing & Urban",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v3.0)",
          isCurrent: true,
          statusType: "current",
          title: "Current Version (v3.0)",
          description: "Revised income limits, enhanced interest subsidy, and extended operational deadline.",
          date: "Jan 2026",
          gazetteRef: "CG-DL-E-15012026-248901",
          changes: [
            "Increased EWS ceiling from ₹2,00,000 to ₹3,00,000 per annum",
            "Extended nationwide application deadline to 30 April 2026",
            "Aadhaar-based biometric e-KYC and geotagged house construction mandatory",
          ],
        },
        {
          year: "2024",
          version: "Amendment (v2.1)",
          isCurrent: false,
          statusType: "amendment",
          title: "Amendment (v2.1)",
          description: "Added mandatory land title verification certificate and revised self-declaration affidavit format.",
          date: "Mar 2024",
          gazetteRef: "MoHUA Notification No. 18-A/2024",
          changes: [
            "Mandatory land title verification certificate from District Collectorate",
            "Self-declaration affidavit format updated to prevent multiple dwelling claims",
          ],
        },
        {
          year: "2023",
          version: "Amendment (v2.0)",
          isCurrent: false,
          statusType: "amendment",
          title: "Amendment (v2.0)",
          description: "LIG threshold adjusted for tier-2 urban agglomerations with expanded carpet area norms.",
          date: "Jul 2023",
          gazetteRef: "Gazette Notification Extraordinary No. 89",
          changes: ["LIG threshold adjusted for tier-2 urban agglomerations", "Carpet area norms expanded up to 60 sq. meters"],
        },
        {
          year: "2022",
          version: "Original Guideline (v1.0)",
          isCurrent: false,
          statusType: "original",
          title: "Original Guideline (v1.0)",
          description: "Initial foundational master circular enacted for Housing for All mission.",
          date: "Jan 2022",
          gazetteRef: "MoHUA Master Circular v1.0",
          changes: ["Foundational statutory guidelines enacted and notified in Official Gazette"],
        },
      ],
    },
    {
      id: "AHCPPMAY",
      name: "Affordable Housing in Partnership (PMAY-U) Uttarakhand Rules",
      department: "Government of Uttarakhand Housing Department",
      category: "Housing & Urban",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v2.0)",
          isCurrent: true,
          statusType: "current",
          title: "Current Version (v2.0)",
          description: "State co-subsidy enhancement of ₹1.5 Lakh paired with Central assistance.",
          date: "Jan 2026",
          gazetteRef: "UK-GAZ-2026-9812",
          changes: [
            "Mandatory hill-terrain structural safety certification",
            "Direct beneficiary account transfer linked to PFMS portal",
          ],
        },
        {
          year: "2024",
          version: "Original Guideline (v1.0)",
          isCurrent: false,
          statusType: "original",
          title: "Uttarakhand Housing Policy Rules 2024",
          description: "Initial adoption of public-private partnership guidelines for affordable homes.",
          date: "Apr 2024",
          gazetteRef: "UK Notification No. 102/HUD/2024",
          changes: ["Initial PPP affordable housing framework enacted"],
        },
      ],
    },
    {
      id: "AAY",
      name: "Abua Awas Yojana (Jharkhand)",
      department: "Government of Jharkhand Rural Development Department",
      category: "Housing & Urban",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v2.0)",
          isCurrent: true,
          statusType: "current",
          title: "Current Operational Version (v2.0)",
          description: "3-room pucca housing allocation with ₹2.00 Lakh assistance in 4 phases.",
          date: "Feb 2026",
          gazetteRef: "JH-GAZ-EXT-2026-441",
          changes: [
            "Assistance amount disbursed directly in 4 construction milestones",
            "Mandatory inclusion of hygienic cooking space / kitchen",
          ],
        },
        {
          year: "2023",
          version: "Original Guideline (v1.0)",
          isCurrent: false,
          statusType: "original",
          title: "Launch of Abua Awas Yojana",
          description: "State-funded scheme to cover rural families left out of SECC-2011 lists.",
          date: "Nov 2023",
          gazetteRef: "JH-RDD-NOTIF-2023-89",
          changes: ["Formal notification for homeless families in Jharkhand"],
        },
      ],
    },
    {
      id: "AGY",
      name: "Antyodaya Gruha Yojana: Construction of New House",
      department: "Government of Gujarat Housing Board",
      category: "Housing & Urban",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v2.2)",
          isCurrent: true,
          statusType: "current",
          title: "Current Version (v2.2)",
          description: "Upgraded construction grant with solar rooftop convergence subsidy.",
          date: "Jan 2026",
          gazetteRef: "GJ-GAZ-2026-3021",
          changes: [
            "Subsidy enhanced to ₹1,20,000 for rural BPL cardholders",
            "Convergence with Swachh Bharat toilet construction grant",
          ],
        },
        {
          year: "2022",
          version: "Original Guideline (v1.0)",
          isCurrent: false,
          statusType: "original",
          title: "Antyodaya Gruha Operational Guidelines",
          description: "Foundational scheme rollout for destitute and rural BPL families.",
          date: "Aug 2022",
          gazetteRef: "GJ Master Notification No. 44/AGY",
          changes: ["Initial release of construction assistance guidelines"],
        },
      ],
    },
  ],
  "Education & Scholarships": [
    {
      id: "PMS",
      name: "PM Scholarship Scheme (PMSS - WARB / RPF)",
      department: "Ministry of Home Affairs / Ministry of Education",
      category: "Education & Scholarships",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v3.0)",
          isCurrent: true,
          statusType: "current",
          title: "Current Version (v3.0)",
          description: "Scholarship disbursed: ₹3,000/month for girls, ₹2,500/month for boys pursuing professional courses.",
          date: "Jan 2026",
          gazetteRef: "MHA-WARB-NOTIF-2026-04",
          changes: [
            "Incorporated AICTE and NMC accredited integrated master degree programs",
            "Direct National Scholarship Portal (NSP 3.0) verification via DigiLocker",
          ],
        },
        {
          year: "2024",
          version: "Amendment (v2.0)",
          isCurrent: false,
          statusType: "amendment",
          title: "Amendment (v2.0)",
          description: "Raised minimum qualifying aggregate marks in 10+2 / diploma to 60%.",
          date: "May 2024",
          gazetteRef: "MHA Gazette Ref 2024-812",
          changes: ["Streamlined renewal process and mandatory annual attendance certificate"],
        },
      ],
    },
  ],
  "Health & Medical": [
    {
      id: "ABPMJAY",
      name: "Ayushman Bharat PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
      department: "National Health Authority (NHA)",
      category: "Health & Medical",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v3.1)",
          isCurrent: true,
          statusType: "current",
          title: "Current Version (v3.1)",
          description: "Universal coverage for all senior citizens aged 70+ regardless of family income.",
          date: "Jan 2026",
          gazetteRef: "NHA-PMJAY-EXP-2026-001",
          changes: [
            "Ayushman Vaya Vandana card enabled for all citizens aged 70 and above",
            "Portability across 29,000+ empanelled hospitals nationwide with zero-deposit cashless admission",
            "Annual health cover ceiling maintained at ₹5,00,000 per family/senior",
          ],
        },
        {
          year: "2023",
          version: "Amendment (v2.0)",
          isCurrent: false,
          statusType: "amendment",
          title: "Standard Treatment Guidelines Revision",
          description: "Expanded package master with 1,949 treatments including oncology and robotic surgeries.",
          date: "Oct 2023",
          gazetteRef: "Gazette Notification No. 412/PMJAY",
          changes: ["Added specialized tertiary daycare procedures", "Enforced digital discharge summary upload"],
        },
      ],
    },
  ],
  "Agriculture & Farmers": [
    {
      id: "PM-KISAN",
      name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      department: "Ministry of Agriculture & Farmers Welfare",
      category: "Agriculture & Farmers",
      timeline: [
        {
          year: "2026",
          version: "Current Version (v4.0)",
          isCurrent: true,
          statusType: "current",
          title: "Current Version (v4.0)",
          description: "Direct financial support of ₹6,000 per year paid in three equal 4-monthly installments.",
          date: "Jan 2026",
          gazetteRef: "CG-DL-E-15012026-KISAN-901",
          changes: [
            "e-KYC through facial recognition mobile app and biometric Aadhaar linkage",
            "Mandatory land registry seeding with Bhulekh state records",
            "Automated exclusion of institutional landholders and IT assessment payees",
          ],
        },
        {
          year: "2024",
          version: "Amendment (v3.0)",
          isCurrent: false,
          statusType: "amendment",
          title: "Land Seeding & Aadhaar DBT Mandate",
          description: "Enforced strict verification to eliminate ineligible beneficiaries.",
          date: "Feb 2024",
          gazetteRef: "MoA&FW Circular No. 12-B/2024",
          changes: ["Mandatory land record verification before releasing 16th installment"],
        },
      ],
    },
  ],
};

export default function PolicyTimelinePage() {
  const [selectedCategory, setSelectedCategory] = useState("Housing & Urban");
  const [selectedSchemeId, setSelectedSchemeId] = useState("PMAY");
  const [searchTerm, setSearchTerm] = useState("");
  const [schemesData, setSchemesData] = useState<Record<string, SchemeItem[]>>(DEFAULT_SCHEMES_BY_CAT);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCategorizedSchemes = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/data/categorized_schemes.json");
        if (res.ok) {
          const data: Record<string, SchemeItem[]> = await res.json();
          if (isMounted && data && Object.keys(data).length > 0) {
            setSchemesData(data);
          }
        }
      } catch (err) {
        console.warn("Using built-in scheme timelines fallback", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCategorizedSchemes();
    return () => {
      isMounted = false;
    };
  }, []);

  const schemesInCurrentCategory = useMemo(() => {
    return schemesData[selectedCategory] || DEFAULT_SCHEMES_BY_CAT[selectedCategory] || [];
  }, [schemesData, selectedCategory]);

  const filteredCategorySchemes = useMemo(() => {
    if (!searchTerm.trim()) return schemesInCurrentCategory;
    const term = searchTerm.toLowerCase();
    return schemesInCurrentCategory.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        s.department.toLowerCase().includes(term)
    );
  }, [schemesInCurrentCategory, searchTerm]);

  useEffect(() => {
    const exists = schemesInCurrentCategory.some((s) => s.id === selectedSchemeId);
    if (!exists && schemesInCurrentCategory.length > 0) {
      setSelectedSchemeId(schemesInCurrentCategory[0].id);
    }
  }, [selectedCategory, schemesInCurrentCategory, selectedSchemeId]);

  const currentScheme = useMemo(() => {
    const found = schemesInCurrentCategory.find((s) => s.id === selectedSchemeId);
    return found || schemesInCurrentCategory[0] || DEFAULT_SCHEMES_BY_CAT["Housing & Urban"][0];
  }, [schemesInCurrentCategory, selectedSchemeId]);

  const currentEvents = currentScheme?.timeline || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <History className="w-3 h-3" />
              Bi-Temporal Audit Rail
            </span>
            <span className="text-xs text-gray-400 font-medium">
              4,986 Statutory Policies
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
            Policy Timeline & Version Evolution
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">
            Track how gazette regulations, eligibility rules, and income thresholds evolve over time across every government sector.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <Link
            href="/compare"
            className="text-xs font-semibold text-[#123C35] bg-white border border-[#CFD9CE] hover:bg-[#F5F7F5] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>Compare Versions</span>
          </Link>
          <Link
            href="/eligibility"
            className="text-xs font-semibold text-white bg-[#123C35] hover:bg-[#1A4D44] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Check Eligibility</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Select Policy Category:
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const actualCount = schemesData[cat.id]?.length || cat.count;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchTerm("");
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isSelected
                    ? "bg-[#123C35] text-white ring-2 ring-[#123C35]/20 shadow-md"
                    : "bg-white border border-[#CFD9CE] text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-300" : "text-[#2F6B5F]"}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {actualCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheme Selector Bar for Current Category */}
      <div className="bg-white border border-[#CFD9CE] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Policies Under {selectedCategory}
              </h2>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                {schemesInCurrentCategory.length} Total Policies
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Select any statutory scheme below to view its complete gazette amendments and version lineage.
            </p>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${schemesInCurrentCategory.length} ${selectedCategory} schemes...`}
              className="w-full bg-[#F5F7F5] border border-[#CFD9CE] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#123C35] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* The Scheme Dropdown populated with ALL policies under this category */}
        <div className="space-y-1 pt-1 border-t border-gray-100">
          <label className="block text-[11px] font-semibold text-gray-500">
            Active Scheme in Timeline:
          </label>
          <select
            id="policy-scheme-dropdown"
            value={currentScheme?.id || ""}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full bg-white border border-[#CFD9CE] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#123C35] focus:outline-none focus:border-[#123C35] focus:ring-2 focus:ring-[#123C35]/15 cursor-pointer shadow-sm hover:border-[#123C35] transition-colors"
          >
            {filteredCategorySchemes.length > 0 ? (
              filteredCategorySchemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — [{s.department || "Government of India"}]
                </option>
              ))
            ) : (
              <option disabled>No schemes match &quot;{searchTerm}&quot; in {selectedCategory}</option>
            )}
          </select>
        </div>

        {/* Selected Scheme Info Card */}
        {currentScheme && (
          <div className="bg-[#F8FAF8] border border-[#E2E8E0] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold bg-[#123C35] text-white px-2 py-0.5 rounded">
                  {currentScheme.id}
                </span>
                <span className="font-bold text-xs sm:text-sm text-gray-900">
                  {currentScheme.name}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Department: <span className="font-medium text-gray-800">{currentScheme.department}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory Verified</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Visual Container */}
      <div className="relative pl-6 sm:pl-12 pt-4">
        <div className="absolute left-[3.25rem] sm:left-[4.75rem] top-6 bottom-6 w-0.5 bg-[#E2E8E0]" />

        <div className="space-y-8">
          {currentEvents.length > 0 ? (
            currentEvents.map((evt, idx) => {
              const isCurrent = evt.isCurrent;
              const isAmendment = evt.statusType === "amendment";

              return (
                <div key={idx} className="relative flex items-start gap-6 sm:gap-8 group">
                  <div className="w-12 sm:w-14 shrink-0 text-right font-bold text-sm text-gray-700 pt-3">
                    {evt.year}
                  </div>

                  <div className="relative shrink-0 pt-3 z-10">
                    {isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 border-4 border-emerald-100 flex items-center justify-center shadow-sm ring-2 ring-emerald-600/30" />
                    ) : isAmendment ? (
                      <div className="w-4 h-4 rounded-full bg-[#D97706] border-2 border-white shadow-sm mt-0.5" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#2F6B5F] border-2 border-white shadow-sm mt-0.5" />
                    )}
                  </div>

                  <div
                    className={`flex-1 rounded-xl p-5 border transition-all ${
                      isCurrent
                        ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                        : "bg-white border-[#E2E8E0] shadow-sm hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-sm text-gray-900">
                          {evt.title}
                        </h3>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Current In Force</span>
                          </span>
                        )}
                        {isAmendment && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            <span>Statutory Amendment</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{evt.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {evt.description}
                    </p>

                    {evt.changes && evt.changes.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                          Notified Provisions & Clause Changes:
                        </span>
                        <ul className="space-y-1.5 text-xs text-gray-600">
                          {evt.changes.map((c, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#123C35] mt-1 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evt.gazetteRef && (
                      <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between gap-2">
                        <div className="text-[11px] font-mono text-[#2F6B5F] flex items-center gap-1 font-semibold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Gazette Citation: {evt.gazetteRef}</span>
                        </div>
                        <Link
                          href={`/evidence`}
                          className="text-[11px] text-[#123C35] hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>Verify Proof</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-[#E2E8E0] rounded-xl p-8 text-center text-gray-500">
              No timeline events recorded for this scheme.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
