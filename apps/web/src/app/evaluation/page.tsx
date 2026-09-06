"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { Award, ShieldAlert, Cpu } from "lucide-react";

export default function ModelEvaluationPage() {
  const modelsData = [
    { model: "Dense RAG", accuracy: "78.4%", faithfulness: "81.2%", hallucination: "14.3%", isOurs: false },
    { model: "Hybrid RAG", accuracy: "82.7%", faithfulness: "86.5%", hallucination: "10.8%", isOurs: false },
    { model: "GraphRAG", accuracy: "85.1%", faithfulness: "89.3%", hallucination: "8.7%", isOurs: false },
    { model: "GovReasonRAG", accuracy: "91.6%", faithfulness: "95.8%", hallucination: "4.2%", isOurs: true },
  ];

  const ablationData = [
    { name: "Base", score: 78.4, fill: "#24584F" },
    { name: "+ Graph", score: 82.1, fill: "#24584F" },
    { name: "+ Rules", score: 86.7, fill: "#24584F" },
    { name: "+ Evidence", score: 89.3, fill: "#24584F" },
    { name: "+ Version", score: 91.6, fill: "#D97706" }, // Saffron highlight for GovReasonRAG
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Model Evaluation
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Performance comparison across different approaches.
        </p>
      </div>

      {/* Model Benchmark Table */}
      <div className="bg-white border border-[#E2E8E0] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAF8] border-b border-[#E2E8E0] text-xs font-bold text-gray-600">
              <th className="py-3.5 px-5">Model</th>
              <th className="py-3.5 px-5">Accuracy</th>
              <th className="py-3.5 px-5">Faithfulness</th>
              <th className="py-3.5 px-5">Hallucination</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {modelsData.map((row, idx) => (
              <tr
                key={idx}
                className={
                  row.isOurs
                    ? "bg-[#EBF5F0] font-semibold text-[#123C35]"
                    : "hover:bg-gray-50 text-gray-800"
                }
              >
                <td className="py-3.5 px-5 flex items-center gap-2">
                  <span>{row.model}</span>
                  {row.isOurs && (
                    <span className="text-[10px] bg-[#123C35] text-white px-2 py-0.5 rounded-full font-bold">
                      Ours
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-5">{row.accuracy}</td>
                <td className="py-3.5 px-5">{row.faithfulness}</td>
                <td className="py-3.5 px-5">{row.hallucination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ablation Study Chart Card */}
      <div className="bg-white border border-[#E2E8E0] rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Ablation Study</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Stepwise impact of Neuro-Symbolic Graph, Rule Engine, and Gazette Version Verification.
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ablationData} margin={{ top: 20, right: 20, left: -15, bottom: 10 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#4B5563" }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={{ stroke: "#E5E7EB" }}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: any) => [`${val}%`, "Accuracy Score"]}
                contentStyle={{ borderRadius: "8px", fontSize: "12px", border: "1px solid #E5E7EB" }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={48}>
                <LabelList dataKey="score" position="top" style={{ fontSize: "11px", fontWeight: "bold", fill: "#374151" }} />
                {ablationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
