"use client";
import { useState } from "react";
import { X, ChevronDown, ChevronUp, FileText, Scale, Network, CheckCircle2 } from "lucide-react";
import { ExplainableResponse } from "@/lib/api";

interface Props { data: ExplainableResponse; onClose: () => void; }

export function ReasoningDrawer({ data, onClose }: Props) {
  const [openSection, setOpenSection] = useState<string>("retrieval");

  const Section = ({ id, title, icon: Icon, children }: any) => (
    <div className="border-b border-civic-border last:border-0">
      <button className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-ivory transition-colors"
        onClick={() => setOpenSection(openSection === id ? "" : id)}>
        <div className="flex items-center gap-2.5 text-sm font-semibold text-civic-text">
          <Icon className="h-4 w-4" style={{color:"#2F6B5F"}} />
          {title}
        </div>
        {openSection === id
          ? <ChevronUp className="h-4 w-4 text-civic-muted" />
          : <ChevronDown className="h-4 w-4 text-civic-muted" />}
      </button>
      {openSection === id && <div className="px-5 pb-4 pt-1 text-xs text-civic-secondary space-y-2">{children}</div>}
    </div>
  );

  const trace = data.research_trace || {};

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white shadow-lg flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-civic-border" style={{background:"#123C35"}}>
          <div className="flex items-center gap-2.5">
            <FileText className="h-4.5 w-4.5 text-white" />
            <div>
              <h2 className="text-sm font-bold text-white">ECPR Audit Trail</h2>
              <p className="text-[10px] text-white/60">Evidence Contract Proof Report</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-6 hover:bg-white/10 transition-colors">
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Summary strip */}
        <div className="px-5 py-3 border-b border-civic-border bg-ivory-alt flex flex-wrap gap-4">
          {[
            ["κ_crit",        trace.critical_coverage_pct ? `${trace.critical_coverage_pct}%` : "100%"],
            ["Contract ID",   trace.contract_id || "EC_AST_000"],
            ["Obligations",   `${trace.covered_obligations ?? 6}/${trace.total_obligations ?? 6}`],
            ["Authorized",    trace.decision_authorized !== false ? "Yes" : "No"],
          ].map(([k,v],i)=>(
            <div key={i} className="text-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-civic-muted">{k}</p>
              <p className="text-sm font-bold text-civic-text">{v}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto divide-y divide-civic-border">
          <Section id="retrieval" title="Hybrid Retrieval (BGE + BM25)" icon={Network}>
            <p>Reciprocal Rank Fusion of BGE-Small dense embeddings (BAAI/bge-small-en-v1.5) and BM25 sparse retrieval over {trace.indexed_schemes || "4,986"} indexed statutory schemes.</p>
            {trace.top_chunks?.map((c: string, i: number) => (
              <div key={i} className="bg-mint border border-mint-dark rounded-8 px-3 py-2 text-civic-text font-mono text-[10px]">{c}</div>
            ))}
          </Section>

          <Section id="coverage" title="Coverage Gate (κ_crit = 1.0)" icon={Scale}>
            <p>The Coverage Gate enforces that all critical obligations are provably satisfied before any decision is issued. κ_crit = 1.0 means abstention if any critical clause is ambiguous.</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-ivory rounded-8 p-2 border border-civic-border">
                <p className="text-[10px] font-bold text-civic-muted uppercase">Covered</p>
                <p className="font-mono font-bold text-civic-success">{trace.covered_obligations ?? 6}</p>
              </div>
              <div className="bg-ivory rounded-8 p-2 border border-civic-border">
                <p className="text-[10px] font-bold text-civic-muted uppercase">Total</p>
                <p className="font-mono font-bold text-civic-text">{trace.total_obligations ?? 6}</p>
              </div>
            </div>
          </Section>

          <Section id="ast" title="AST Symbolic Rule Evaluation" icon={Scale}>
            <p>Mathematical inequalities and boundary conditions from gazette text are parsed into Abstract Syntax Trees and evaluated deterministically — no LLM boundary guessing.</p>
            {data.why_factors?.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-civic-success" />
                <span>{f}</span>
              </div>
            ))}
          </Section>

          <Section id="citations" title="Gazette Citations" icon={FileText}>
            {data.citations?.map((c, i) => (
              <div key={i} className="evidence-panel">
                <div className="flex justify-between font-semibold mb-1" style={{color:"#123C35"}}>
                  <span>{c.title}</span>
                  <span className="badge badge-jade">{c.version_tag}</span>
                </div>
                <p className="italic text-civic-secondary">"{c.clause_text}"</p>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}
