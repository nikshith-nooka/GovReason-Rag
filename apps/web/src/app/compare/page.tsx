"use client";

import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Equal,
  GitCompare,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function ComparePolicyVersionsPage() {
  const [versionA, setVersionA] = useState("v2.0 (2023)");
  const [versionB, setVersionB] = useState("v3.0 (2026)");

  const comparisonRows = [
    {
      parameter: "EWS Income Limit",
      valA: "₹2,00,000 / year",
      valB: "₹3,00,000 / year",
      diff: "increased",
      impact: "Broadened eligibility to include higher wage earners",
      gazette: "MoHUA Para 3.2"
    },
    {
      parameter: "Minimum Applicant Age",
      valA: "18+ years",
      valB: "18+ years",
      diff: "equal",
      impact: "Unchanged statutory majority requirement",
      gazette: "Operational Sec 2.1"
    },
    {
      parameter: "Mandatory Documents",
      valA: "3 standard proofs",
      valB: "4 (e-KYC & Geotag added)",
      diff: "increased",
      impact: "Strict biometric authentication to prevent fraud",
      gazette: "Gazette Part II-Sec 3"
    },
    {
      parameter: "Application Deadline",
      valA: "31 March 2024",
      valB: "30 April 2026",
      diff: "increased",
      impact: "Extended window for municipal verification",
      gazette: "CCEA Resolution"
    },
    {
      parameter: "Pucca House Ownership",
      valA: "Zero owned anywhere",
      valB: "Zero owned anywhere",
      diff: "equal",
      impact: "Core housing deprivation limitation preserved",
      gazette: "Rule 4.1"
    },
    {
      parameter: "Beneficiary Coverage",
      valA: "EWS / LIG only",
      valB: "EWS / LIG + Special Focus",
      diff: "increased",
      impact: "Inclusive expansion for single women & disabled",
      gazette: "CLSS Guideline 9"
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E9E6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#123C35] bg-[#D8F3EA] px-2.5 py-0.5 rounded-full border border-[#B2E2CE]">
              <GitCompare className="w-3 h-3 text-[#2F6B5F]" />
              Policy Version Diff
            </span>
            <span className="text-xs text-[#71807B] font-medium hidden sm:inline">
              Understand. Verify. Decide.
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17211F] tracking-tight mt-1">
            Compare Policy Versions
          </h1>
          <p className="text-xs sm:text-sm text-[#71807B] mt-0.5">
            Inspect amendments, statutory relaxation, or tightened criteria between gazette editions.
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white border border-[#E5E9E6] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-[#71807B] uppercase tracking-wider mb-1.5">
            Base Version (Pre-amendment)
          </label>
          <select
            value={versionA}
            onChange={(e) => setVersionA(e.target.value)}
            className="w-full bg-[#FAFAF7] border border-[#E5E9E6] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#17211F] focus:outline-none focus:border-[#2F6B5F] cursor-pointer"
          >
            <option value="v1.0 (2022)">Version 1.0 (2022)</option>
            <option value="v2.0 (2023)">Version 2.0 (2023)</option>
            <option value="v2.1 (2024)">Version 2.1 (2024)</option>
          </select>
        </div>

        <div className="text-center font-bold text-xs text-[#71807B] px-2 pt-2 sm:pt-4">
          VS
        </div>

        <div className="flex-1">
          <label className="block text-[11px] font-bold text-[#71807B] uppercase tracking-wider mb-1.5">
            Target Version (Current Gazette)
          </label>
          <select
            value={versionB}
            onChange={(e) => setVersionB(e.target.value)}
            className="w-full bg-[#FAFAF7] border border-[#E5E9E6] rounded-xl px-3.5 py-2 text-xs font-semibold text-[#17211F] focus:outline-none focus:border-[#2F6B5F] cursor-pointer"
          >
            <option value="v3.0 (2026)">Version 3.0 (2026) · Active</option>
            <option value="v2.1 (2024)">Version 2.1 (2024)</option>
          </select>
        </div>
      </div>

      {/* Comparison Table with overflow protection */}
      <div className="bg-white border border-[#E5E9E6] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="bg-[#FAFAF7] border-b border-[#E5E9E6] text-xs font-bold text-[#17211F]">
                <th className="py-3.5 px-5">Statutory Parameter</th>
                <th className="py-3.5 px-5 text-[#71807B]">{versionA}</th>
                <th className="py-3.5 px-5 text-[#123C35]">{versionB}</th>
                <th className="py-3.5 px-5">Substantive Impact</th>
                <th className="py-3.5 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9E6] text-xs text-[#17211F]">
              {comparisonRows.map((row, idx) => {
                return (
                  <tr key={idx} className="hover:bg-[#FAFAF7] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#17211F]">
                      <div>{row.parameter}</div>
                      <div className="text-[10px] font-mono text-[#71807B]">{row.gazette}</div>
                    </td>
                    <td className="py-3.5 px-5 text-[#71807B]">{row.valA}</td>
                    <td className="py-3.5 px-5 font-bold text-[#123C35]">{row.valB}</td>
                    <td className="py-3.5 px-5 text-[#71807B] max-w-xs text-[11px] leading-relaxed">
                      {row.impact}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {row.diff === "increased" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#EBF7F2] text-[#16805A] text-[10px] font-bold border border-[#16805A]/20">
                          <ArrowUp className="w-3 h-3 font-bold" />
                          Relaxed / Expanded
                        </span>
                      )}
                      {row.diff === "decreased" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FDF0F0] text-[#C94A4A] text-[10px] font-bold border border-[#C94A4A]/20">
                          <ArrowDown className="w-3 h-3 font-bold" />
                          Tightened
                        </span>
                      )}
                      {row.diff === "equal" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAFAF7] text-[#71807B] text-[10px] font-bold border border-[#E5E9E6]">
                          <Equal className="w-3 h-3" />
                          Unchanged
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Summary Note */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#71807B] px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16805A] inline-block" />
            <span>Relaxed criteria</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C94A4A] inline-block" />
            <span>Tightened rules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5E9E6] inline-block" />
            <span>Identical</span>
          </div>
        </div>

        <div className="text-[11px] text-[#71807B]">
          Source: Gazette Bi-Temporal Reconciliation Engine v2.4
        </div>
      </div>
    </div>
  );
}
