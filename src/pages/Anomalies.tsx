import { useState } from "react";
import { DATA } from "@/data/mock-data";

export default function Anomalies() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [sevFilter, setSevFilter] = useState("All");
  const types = ["All", ...new Set(DATA.anomalies.map(a => a.type))];
  const sevs = ["All", "CRITICAL", "HIGH", "MEDIUM"];

  const filtered = DATA.anomalies.filter(a =>
    (typeFilter === "All" || a.type === typeFilter) && (sevFilter === "All" || a.severity === sevFilter)
  );

  const sevColor: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700", MEDIUM: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Anomaly Ledger</h1>
        <p className="text-stone-500">Filter, expand evidence, and open drill-downs.</p>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm text-stone-600">
          Type{" "}
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="ml-1 rounded-md border border-stone-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className="text-sm text-stone-600">
          Severity{" "}
          <select value={sevFilter} onChange={e => setSevFilter(e.target.value)} className="ml-1 rounded-md border border-stone-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
            {sevs.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>
      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-left text-xs font-semibold uppercase text-stone-500">
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Sev</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Feeder</th>
              <th className="px-4 py-3">Consumer</th>
              <th className="px-4 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b border-stone-50 hover:bg-amber-50/40 transition-colors">
                <td className="px-4 py-2.5 text-stone-500">{new Date(a.detectedAt).toLocaleString()}</td>
                <td className="px-4 py-2.5 font-medium text-stone-800">{a.type.replace(/_/g, " ")}</td>
                <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevColor[a.severity] ?? ""}`}>{a.severity}</span></td>
                <td className="px-4 py-2.5 text-stone-600">{a.status}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-stone-600">{a.feederCode}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-stone-600">{a.consumerRR}</td>
                <td className="px-4 py-2.5 font-medium">{a.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
