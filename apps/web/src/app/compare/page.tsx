"use client";

import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Equal,
  GitCompare,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

export default function ComparePolicyVersionsPage() {
  const [versionA, setVersionA] = useState("v2.0 (2023)");
  const [versionB, setVersionB] = useState("v3.0 (2026)");

  const comparisonRows = [
    {
      parameter: "Income limit",
      valA: "₹2,00,000",
      valB: "₹3,00,000",
      diff: "increased",
    },
    {
      parameter: "Age",
      valA: "18+",
      valB: "18+",
      diff: "equal",
    },
    {
      parameter: "Documents",
      valA: "3",
      valB: "4",
      diff: "increased",
    },
    {
      parameter: "Application deadline",
      valA: "31 Mar",
      valB: "30 Apr",
      diff: "increased",
    },
    {
      parameter: "House ownership",
      valA: "No pucca house",
      valB: "No pucca house",
      diff: "equal",
    },
    {
      parameter: "Beneficiary type",
      valA: "EWS/LIG",
      valB: "EWS/LIG/MIG",
      diff: "increased",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Compare Policy Versions
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          See what changed between different versions.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white border border-[#E2E8E0] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Base Version
          </label>
          <select
            value={versionA}
            onChange={(e) => setVersionA(e.target.value)}
            className="w-full bg-[#F5F7F5] border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#123C35] cursor-pointer"
          >
            <option value="v1.0 (2022)">Version 1.0 (2022)</option>
            <option value="v2.0 (2023)">Version 2.0 (2023)</option>
            <option value="v2.1 (2024)">Version 2.1 (2024)</option>
          </select>
        </div>

        <div className="text-center font-bold text-sm text-gray-400 px-2 pt-4 sm:pt-0">
          vs
        </div>

        <div className="flex-1">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            Target Version
          </label>
          <select
            value={versionB}
            onChange={(e) => setVersionB(e.target.value)}
            className="w-full bg-[#F5F7F5] border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#123C35] cursor-pointer"
          >
            <option value="v3.0 (2026)">Version 3.0 (2026)</option>
            <option value="v2.1 (2024)">Version 2.1 (2024)</option>
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-[#E2E8E0] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAF8] border-b border-[#E2E8E0] text-xs font-bold text-gray-600">
              <th className="py-3 px-5">Parameter</th>
              <th className="py-3 px-5">{versionA}</th>
              <th className="py-3 px-5">{versionB}</th>
              <th className="py-3 px-5 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
            {comparisonRows.map((row, idx) => {
              return (
                <tr key={idx} className="hover:bg-[#F9FAF8] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-gray-900">
                    {row.parameter}
                  </td>
                  <td className="py-3.5 px-5 text-gray-600">{row.valA}</td>
                  <td className="py-3.5 px-5 font-medium text-gray-900">{row.valB}</td>
                  <td className="py-3.5 px-5 text-right">
                    {row.diff === "increased" && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                        <ArrowUp className="w-4 h-4 font-bold stroke-[3]" />
                      </span>
                    )}
                    {row.diff === "decreased" && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-600">
                        <ArrowDown className="w-4 h-4 font-bold stroke-[3]" />
                      </span>
                    )}
                    {row.diff === "equal" && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500">
                        <Equal className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend at Bottom */}
      <div className="flex items-center gap-6 text-xs text-gray-500 justify-start px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Increased</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span>Decreased</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
          <span>No change</span>
        </div>
      </div>
    </div>
  );
}
