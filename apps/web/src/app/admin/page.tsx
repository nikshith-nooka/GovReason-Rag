"use client";

import { Settings, RefreshCw, Database, FileCheck, CheckCircle2, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("Today at 04:30 AM IST");

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("Just now");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          System Administration
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage statutory Gazette crawlers, policy knowledge graphs, and model deployment health.
        </p>
      </div>

      <div className="bg-white border border-[#E2E8E0] rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="font-bold text-sm text-gray-900">National Gazette Synchronization</h2>
            <p className="text-xs text-gray-500 mt-0.5">Last synced: {lastSync}</p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-[#123C35] hover:bg-[#1E5249] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            <span>{syncing ? "Ingesting Gazettes..." : "Trigger Gazette Sync"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#F9FAF8] border border-[#E2E8E0] space-y-1">
            <div className="text-gray-500 font-medium">Embedding Pipeline</div>
            <div className="font-bold text-gray-900">BAAI/bge-small-en-v1.5 (Local ONNX)</div>
            <div className="text-emerald-700 flex items-center gap-1 font-semibold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Online (P99 Latency: 12ms)</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F9FAF8] border border-[#E2E8E0] space-y-1">
            <div className="text-gray-500 font-medium">Symbolic Engine & Graph Store</div>
            <div className="font-bold text-gray-900">Neo4j Policy Graph + Z3 Solver</div>
            <div className="text-emerald-700 flex items-center gap-1 font-semibold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>4,986 Statutory Policies Mapped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
