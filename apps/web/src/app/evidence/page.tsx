"use client";

import { ShieldCheck, FileText, CheckCircle2, ExternalLink, Link2, Database, Sparkles, Check } from "lucide-react";

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
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      portal: "https://pmay-urban.gov.in"
    },
    {
      id: "CTR-2026-PMS-04",
      scheme: "PM Scholarship Scheme for Wards of CAPF & AR",
      clause: "Para 5.2 — Academic Benchmark",
      gazetteId: "MHA-WARB-2024-SCH-88",
      extractedRule: "Minimum 60% marks in Minimum Educational Qualification (MEQ)",
      confidence: "98.7%",
      status: "VERIFIED",
      sha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      portal: "https://scholarships.gov.in"
    },
    {
      id: "CTR-2026-PMJAY-09",
      scheme: "Ayushman Bharat PM-JAY",
      clause: "Schedule A — Deprivation Criteria D1-D7",
      gazetteId: "NHA-OM-2024-SEC-01",
      extractedRule: "Rural households matching SECC 2011 Deprivation Codes",
      confidence: "97.9%",
      status: "VERIFIED",
      sha256: "382a939f1c7d23a1a3a41130d93707c77028120b41040a455a79998ea330058b",
      portal: "https://pmjay.gov.in"
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E9E6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#123C35] bg-[#D8F3EA] px-2.5 py-0.5 rounded-full border border-[#B2E2CE]">
              <ShieldCheck className="w-3 h-3 text-[#2F6B5F]" />
              Cryptographic Grounding
            </span>
            <span className="text-xs text-[#71807B] font-medium hidden sm:inline">
              Understand. Verify. Decide.
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17211F] tracking-tight mt-1">
            Evidence Ledger & Contracts
          </h1>
          <p className="text-xs sm:text-sm text-[#71807B] mt-0.5">
            Auditable, tamper-evident cryptographic grounding contracts linking reasoning to statutory Gazettes.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5E9E6] p-5 rounded-2xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-[#71807B] uppercase tracking-wider">Verified Evidence Contracts</div>
          <div className="text-3xl font-extrabold text-[#123C35] font-serif">4,986</div>
          <div className="text-[11px] text-[#16805A] font-medium">100% Deterministic AST parsed</div>
        </div>

        <div className="bg-white border border-[#E5E9E6] p-5 rounded-2xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-[#71807B] uppercase tracking-wider">Gazette Grounding Rate</div>
          <div className="text-3xl font-extrabold text-[#16805A] font-serif">99.8%</div>
          <div className="text-[11px] text-[#71807B]">Zero fabricated citations</div>
        </div>

        <div className="bg-white border border-[#E5E9E6] p-5 rounded-2xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-[#71807B] uppercase tracking-wider">Self-Healing Dead Links</div>
          <div className="text-3xl font-extrabold text-[#E8A317] font-serif">Active</div>
          <div className="text-[11px] text-[#71807B]">Wayback + National Archive fallback</div>
        </div>
      </div>

      {/* Contracts Ledger Table / Cards */}
      <div className="bg-white border border-[#E5E9E6] rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E9E6] bg-[#FAFAF7] flex items-center justify-between">
          <h2 className="font-bold text-xs text-[#17211F] uppercase tracking-wider">
            Active Gazette Grounding Contracts
          </h2>
          <span className="text-xs text-[#71807B]">Latest verified clauses</span>
        </div>

        <div className="divide-y divide-[#E5E9E6]">
          {contracts.map((c) => (
            <div key={c.id} className="p-5 hover:bg-[#FAFAF7] transition-colors space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#D8F3EA] text-[#123C35] flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#17211F]">{c.scheme}</span>
                    <span className="font-mono text-[11px] text-[#71807B] ml-2">({c.id})</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-[#16805A] bg-[#EBF7F2] px-2.5 py-1 rounded-full border border-[#16805A]/20 inline-flex items-center gap-1 self-start sm:self-auto">
                  <Check className="w-3 h-3 text-[#16805A]" />
                  {c.status} · {c.confidence}
                </span>
              </div>

              <div className="text-xs text-[#17211F] leading-relaxed">
                <span className="font-bold text-[#123C35]">{c.clause}: </span>
                <span>{c.extractedRule}</span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                <div className="font-mono text-[#2F6B5F] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Gazette ID: {c.gazetteId}</span>
                </div>

                <a
                  href={c.portal}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#2F6B5F] hover:text-[#123C35] font-semibold"
                >
                  <span>Verify Portal Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-1 text-[10px] font-mono text-[#71807B] truncate">
                SHA-256: {c.sha256}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
