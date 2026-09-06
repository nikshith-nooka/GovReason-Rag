"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sprout,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Sparkles,
  Bot,
  ExternalLink
} from "lucide-react";
import { checkStructuredEligibility, ExplainableResponse } from "@/lib/api";

export default function EligibilityWizardPage() {
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    age: "21",
    state: "Telangana",
    occupation: "Student",
    category: "General",
    annualIncome: "240000",
    rationCard: "White / BPL",
    residentialType: "Urban",
    puccaHouse: "No",
    disability: "No",
  });

  const [evaluating, setEvaluating] = useState(false);
  const [evalResponse, setEvalResponse] = useState<ExplainableResponse | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  const runEvaluation = async () => {
    setEvaluating(true);
    setEvalError(null);
    try {
      const res = await checkStructuredEligibility({
        age: Number(formData.age) || 21,
        state: formData.state,
        annual_family_income: Number(formData.annualIncome) || 240000,
        occupation: formData.occupation,
        social_category: formData.category,
        pucca_house_owned: formData.puccaHouse === "Yes",
        disability_status: formData.disability === "Yes",
        location_type: formData.residentialType,
      });
      setEvalResponse(res);
    } catch (err: any) {
      console.error("Evaluation error:", err);
      setEvalError(err?.message || "Failed to connect to backend engine.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextStep = () => {
    if (step === 3) {
      setStep(4);
      runEvaluation();
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    { num: 1, label: "About You" },
    { num: 2, label: "Financial Info" },
    { num: 3, label: "Additional Details" },
    { num: 4, label: "Results" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Check Eligibility
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Answer a few questions to check your eligibility for government schemes.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4 py-2">
        {steps.map((s, idx) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(s.num)}
                className="flex items-center gap-2 text-xs font-medium focus:outline-none"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    isActive
                      ? "bg-[#123C35] text-white ring-2 ring-[#123C35]/20"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </div>
                <span className={isActive ? "font-bold text-gray-900" : "text-gray-500"}>
                  {s.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div className="w-10 sm:w-16 h-0.5 bg-gray-200 mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Form Card (approx 65%) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8E0] rounded-2xl p-6 shadow-sm space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-base font-bold text-gray-900">About You</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Basic information to get started.
                </p>
              </div>

              {/* Age & State Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="21"
                    className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35] focus:ring-2 focus:ring-[#123C35]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35] focus:ring-2 focus:ring-[#123C35]/10 cursor-pointer"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="All India">All India</option>
                  </select>
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Occupation
                </label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Student"
                  className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35] focus:ring-2 focus:ring-[#123C35]/10"
                />
              </div>

              {/* Category (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Category (Optional)
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35] focus:ring-2 focus:ring-[#123C35]/10 cursor-pointer"
                >
                  <option value="General">General</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-base font-bold text-gray-900">Financial Info</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Information on household income and economic classification.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Annual Household Income (₹)
                </label>
                <input
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  placeholder="240000"
                  className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35]"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Qualifies for EWS ceiling (≤ ₹3,00,000) under central guidelines.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Ration Card Status
                </label>
                <select
                  value={formData.rationCard}
                  onChange={(e) => setFormData({ ...formData, rationCard: e.target.value })}
                  className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35]"
                >
                  <option value="White / BPL">White Card / BPL (Priority Household)</option>
                  <option value="Antyodaya (AAY)">Antyodaya Anna Yojana (AAY)</option>
                  <option value="None / APL">Non-Priority / Above Poverty Line</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-base font-bold text-gray-900">Additional Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Housing asset and residence details for statutory matching.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Do you or family own a pucca house?
                  </label>
                  <select
                    value={formData.puccaHouse}
                    onChange={(e) => setFormData({ ...formData, puccaHouse: e.target.value })}
                    className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35]"
                  >
                    <option value="No">No (Living in rent / kutcha dwelling)</option>
                    <option value="Yes">Yes (Own a concrete pucca house)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Area of Residence
                  </label>
                  <select
                    value={formData.residentialType}
                    onChange={(e) => setFormData({ ...formData, residentialType: e.target.value })}
                    className="w-full bg-white border border-[#CFD9CE] rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#123C35]"
                  >
                    <option value="Urban">Urban Municipality / Corporation</option>
                    <option value="Rural">Rural Gram Panchayat</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-base font-bold text-gray-900">Live Scheme Evaluation Results</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Evaluated across active central & state policies via AST Constraint Engine & Grounded LLM:
                </p>
              </div>

              {evaluating ? (
                <div className="bg-[#F8FAF8] border border-[#CFDFD5] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="w-7 h-7 text-[#2F6B5F] animate-spin" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-800">Reasoning Over 4,986 Policy Gazette Rules...</p>
                    <p className="text-xs text-gray-500">Running AST constraint solver, coverage invariant check, and grounded verbalization.</p>
                  </div>
                </div>
              ) : evalError ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 space-y-1">
                  <p className="font-bold">Failed to execute live reasoning:</p>
                  <p>{evalError}</p>
                  <button
                    type="button"
                    onClick={runEvaluation}
                    className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded font-semibold text-xs"
                  >
                    Retry Live Check
                  </button>
                </div>
              ) : evalResponse ? (
                <div className="space-y-4">
                  {/* Grounded LLM Verdict Card */}
                  <div className="bg-[#F4FAF6] border border-[#CFE5D8] rounded-xl p-4 space-y-2.5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#123C35]">
                        <Bot className="w-4 h-4 text-[#2F6B5F]" />
                        <span>Authoritative Model Finding</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#123C35] bg-[#E2F2EB] px-2.5 py-0.5 rounded-full border border-[#BDE0D0]">
                        ⚡ Qwen-2.5 1.5B + AST Solver
                      </span>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed font-medium">
                      {evalResponse.decision_summary}
                    </p>
                    {evalResponse.research_trace?.critical_coverage_pct !== undefined && (
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-600">
                        <span className="font-semibold text-[#123C35]">Evidence Obligations:</span>
                        <span>{evalResponse.research_trace.covered_obligations} / {evalResponse.research_trace.total_obligations}</span>
                        <span className="text-gray-300">•</span>
                        <span className="font-semibold text-[#123C35]">Critical Coverage:</span>
                        <span className="font-mono">{evalResponse.research_trace.critical_coverage_pct}%</span>
                      </div>
                    )}
                  </div>

                  {/* Scheme Result Cards */}
                  <div className="space-y-3">
                    {evalResponse.results?.map((res, idx) => {
                      const isElig = res.decision === "ELIGIBLE";
                      const isCond = res.decision === "CONDITIONALLY_ELIGIBLE";
                      const isDisq = res.decision === "INELIGIBLE";
                      const badgeClass = isElig
                        ? "text-emerald-800 bg-emerald-100 border-emerald-200"
                        : isCond
                        ? "text-amber-800 bg-amber-100 border-amber-200"
                        : isDisq
                        ? "text-rose-800 bg-rose-100 border-rose-200"
                        : "text-gray-700 bg-gray-100 border-gray-200";

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-[#E2E8E0] bg-white shadow-sm space-y-2.5 hover:border-[#CFDFD5] transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="font-bold text-sm text-gray-900">
                                {res.scheme_name}
                              </span>
                              <div className="mt-1 flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}>


                                  {res.decision.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                            <Link
                              href={`/assistant?q=Explain eligibility details for ${encodeURIComponent(res.scheme_name)}`}
                              className="text-xs font-bold text-[#123C35] hover:underline shrink-0 flex items-center gap-1"
                            >
                              <span>Reasoning Trace</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>

                          {/* Satisfied / Failed Conditions */}
                          <div className="space-y-1 text-xs">
                            {res.satisfied_conditions?.map((c, i) => (
                              <div key={i} className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>{c}</span>
                              </div>
                            ))}
                            {res.failed_conditions?.map((c, i) => (
                              <div key={i} className="flex items-center gap-2 text-rose-700">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>Disqualification: {c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                step === 1
                  ? "opacity-50 cursor-not-allowed text-gray-400 bg-gray-50 border border-gray-200"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-lg bg-[#123C35] hover:bg-[#1E5249] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-lg bg-[#123C35] hover:bg-[#1E5249] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Start Over</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: "Why we ask this?" Card (approx 35%) */}
        <div className="lg:col-span-4 bg-[#F2F7F4] border border-[#CFDFD5] rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#E0EFE8] text-[#123C35] flex items-center justify-center mb-3">
              <Sprout className="w-5 h-5 text-[#2F6B5F]" />
            </div>

            <h3 className="font-bold text-sm text-gray-900">
              Why we ask this?
            </h3>

            <p className="text-xs text-gray-600 leading-relaxed mt-2">
              This information helps us match your profile with official eligibility criteria from government guidelines.
            </p>
          </div>

          {/* Inspirational Quote callout */}
          <div className="pt-4 border-t border-[#CFDFD5]">
            <blockquote className="font-serif italic text-sm text-[#855B24] leading-relaxed">
              “Empowering citizens through information.”
            </blockquote>
            <div className="w-12 h-0.5 bg-[#E8A317] mt-2 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
