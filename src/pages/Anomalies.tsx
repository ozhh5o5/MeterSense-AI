import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DATA } from "@/data/mock-data";

export default function Anomalies() {
  const [typeFilter, setTypeFilter] = useState("All");
  const [sevFilter, setSevFilter] = useState("All");
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);

  const types = ["All", ...new Set(DATA.anomalies.map(a => a.type))];
  const sevs = ["All", "CRITICAL", "HIGH", "MEDIUM"];

  const filtered = DATA.anomalies.filter(a =>
    (typeFilter === "All" || a.type === typeFilter) && (sevFilter === "All" || a.severity === sevFilter)
  );

  const selectedAnomaly = DATA.anomalies.find(a => a.id === selectedAnomalyId);

  const sevColor: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700", MEDIUM: "bg-yellow-100 text-yellow-700",
  };

  // Mock time-series data for the evidence panel
  const evidenceChartData = Array.from({ length: 24 }).map((_, i) => ({
    hour: `${i}:00`,
    expected: Math.round(5 + Math.sin(i / 3) * 3),
    actual: selectedAnomaly?.type === "ZERO_CONSUMPTION_LIVE" && i > 12 
      ? 0 
      : selectedAnomaly?.type === "REVERSE_FLOW" && i > 8 
        ? -2 
        : Math.round(5 + Math.sin(i / 3) * 3 + (Math.random() > 0.8 ? -4 : 0)),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Anomaly Ledger & Evidence</h1>
        <p className="text-stone-500">Seven-type taxonomy classification with explainable evidence for field investigators.</p>
      </div>

      <div className="rounded-xl border-l-4 border-purple-500 bg-purple-50 p-4">
        <p className="font-semibold text-purple-800">🧠 Spatio-Temporal Transformer Detection Active</p>
        <p className="text-sm text-purple-700">Detecting sophisticated, coordinated evasion strategies. Analyzing multi-day temporal patterns across meter cohorts to catch organized tampering rings that bypass simple rule-based thresholds.</p>
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

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-left text-xs font-semibold uppercase text-stone-500">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Sev</th>
                <th className="px-4 py-3">Feeder</th>
                <th className="px-4 py-3">Consumer</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr 
                  key={a.id} 
                  onClick={() => setSelectedAnomalyId(a.id === selectedAnomalyId ? null : a.id)}
                  className={`border-b border-stone-50 cursor-pointer transition-colors ${a.id === selectedAnomalyId ? "bg-amber-100/50" : "hover:bg-amber-50/40"}`}
                >
                  <td className="px-4 py-2.5 font-medium text-stone-800">{a.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevColor[a.severity] ?? ""}`}>{a.severity}</span></td>
                  <td className="px-4 py-2.5 font-mono text-xs text-stone-600">{a.feederCode}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-stone-600">{a.consumerRR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedAnomaly ? (
          <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-semibold text-stone-800 mb-2">Investigator Brief</h3>
            <div className="mb-4 grid grid-cols-2 gap-4 text-sm bg-stone-50 p-4 rounded-lg">
              <div>
                <p className="text-stone-500 text-xs uppercase font-semibold">Classification</p>
                <p className="font-medium text-stone-900">{selectedAnomaly.type.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-stone-500 text-xs uppercase font-semibold">AI Confidence</p>
                <p className="font-medium text-stone-900">{(selectedAnomaly.score * 100).toFixed(1)}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-stone-500 text-xs uppercase font-semibold">Evidence Summary</p>
                <p className="text-stone-800">{selectedAnomaly.evidence}</p>
              </div>
            </div>

            <h4 className="font-semibold text-stone-800 mb-2 text-sm">24-Hour Load Signature Analysis</h4>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={evidenceChartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="expected" stroke="#94a3b8" strokeDasharray="3 3" fill="transparent" name="Expected load pattern" />
                <Area type="monotone" dataKey="actual" stroke="#ef4444" fill="url(#colorActual)" name="Actual recorded load" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200">Dismiss (False Positive)</button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 shadow-sm">Dispatch Field Crew</button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-stone-200 border-dashed bg-stone-50/50 p-12 text-center text-stone-500 flex flex-col items-center justify-center min-h-[400px]">
            <svg className="w-12 h-12 text-stone-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p>Select an anomaly from the ledger to view the AI investigator brief and load signature evidence.</p>
          </div>
        )}
      </div>
    </div>
  );
}
