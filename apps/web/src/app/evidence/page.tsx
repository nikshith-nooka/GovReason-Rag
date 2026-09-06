"use client";

import { ShieldCheck, FileText, CheckCircle2, ExternalLink, Link2, Database } from "lucide-react";

export default function EvidenceLedgerPage() {
  const contracts = [
    {
      id: "CTR-2026-PMAY-U-01",
      scheme: "Pradhan Mantri Awas Yojana (Urban)",
      clause: "Section 4.1 — Ownership Limitation",
      gazetteId: "CG-DL-E-15012026-248901",
      extractedRule: "Zero pucca residential property owned anywhere in India",
      confidence: "99.4%",
      status: "VERIFIED",
    },
    {
      id: "CTR-2026-PMS-04",
      scheme: "PM Scholarship Scheme for Wards of CAPF & AR",
      clause: "Para 5.2 — Academic Benchmark",
      gazetteId: "MHA-WARB-2024-SCH-88",
      extractedRule: "Minimum 60% marks in Minimum Educational Qualification (MEQ)",
      confidence: "98.7%",
      status: "VERIFIED",
    },
    {
      id: "CTR-2026-PMJAY-09",
      scheme: "Ayushman Bharat PM-JAY",
      clause: "Schedule A — Deprivation Criteria D1-D7",
      gazetteId: "NHA-OM-2024-SEC-01",
      extractedRule: "Rural households matching SECC 2011 Deprivation Codes",
      confidence: "97.9%",
      status: "VERIFIED",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Evidence Ledger & Contracts
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Auditable, tamper-evident cryptographic grounding contracts linking reasoning to statutory Gazettes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8E0] p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-gray-500">Verified Evidence Contracts</div>
          <div className="text-2xl font-bold text-[#123C35] mt-1">4,986</div>
        </div>
        <div className="bg-white border border-[#E2E8E0] p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-gray-500">Gazette Grounding Rate</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">99.8%</div>
        </div>
        <div className="bg-white border border-[#E2E8E0] p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-gray-500">Dead Link Self-Healing</div>
          <div className="text-2xl font-bold text-[#D97706] mt-1">Active</div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8E0] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E2E8E0] bg-[#F9FAF8] flex items-center justify-between">
          <h2 className="font-bold text-xs text-gray-700 uppercase tracking-wider">
            Active Gazette Contracts
          </h2>
          <span className="text-xs text-gray-400">Showing latest verified clauses</span>
        </div>

        <div className="divide-y divide-gray-100">
          {contracts.map((c) => (
            <div key={c.id} className="p-5 hover:bg-[#F9FAF8] transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm text-gray-900">{c.scheme}</span>
                  <span className="font-mono text-[11px] text-gray-400">({c.id})</span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
                  <CheckCircle2 className="w-3 h-3" />
                  {c.status} · {c.confidence}
                </span>
              </div>

              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-700">{c.clause}: </span>
                <span>{c.extractedRule}</span>
              </div>

              <div className="text-[11px] font-mono text-[#2F6B5F] flex items-center gap-1.5 pt-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Gazette Ref: {c.gazetteId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
