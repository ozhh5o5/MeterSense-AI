import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DATA } from "@/data/mock-data";
import KpiCard from "@/components/KpiCard";

export default function Topology() {
  const [showMismatchOnly, setShowMismatchOnly] = useState(false);
  const topo = DATA.topologyInferences;
  const mismatches = topo.filter(t => t.isMismatch).length;
  const avgConf = Math.round(topo.reduce((a, t) => a + t.confidence, 0) / topo.length * 1000) / 10;

  const confBuckets = [
    { range: "90-100%", count: topo.filter(t => t.confidence >= 0.9).length },
    { range: "70-90%", count: topo.filter(t => t.confidence >= 0.7 && t.confidence < 0.9).length },
    { range: "50-70%", count: topo.filter(t => t.confidence >= 0.5 && t.confidence < 0.7).length },
    { range: "<50%", count: topo.filter(t => t.confidence < 0.5).length },
  ];

  const methodMap = new Map<string, number>();
  topo.forEach(t => methodMap.set(t.method, (methodMap.get(t.method) ?? 0) + 1));
  const methodData = [...methodMap.entries()].map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

  const visible = showMismatchOnly ? topo.filter(t => t.isMismatch) : topo;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Grid Topology Inference</h1>
        <p className="text-stone-500">Algorithmic reverse-engineering of the physical grid topology from voltage fluctuation correlations and phase-angle signatures.</p>
      </div>
      <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
        <p className="font-semibold text-blue-800">Algorithmic grid topology correction</p>
        <p className="text-sm text-blue-700">Analyzing voltage fluctuation correlations and phase-angle signatures across {topo.length} meters to reverse-engineer the physical grid topology. Mismatched connections are flagged with confidence scores — replacing years of manual line-walking surveys.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Connections analyzed" value={topo.length} color="blue" />
        <KpiCard label="Topology mismatches" value={mismatches} sub={`${((mismatches / topo.length) * 100).toFixed(1)}% of total`} color="red" />
        <KpiCard label="Confirmed matches" value={topo.length - mismatches} color="green" />
        <KpiCard label="Avg confidence" value={`${avgConf}%`} color="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800">Confidence distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={confBuckets} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800">Inference method</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                {methodData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-6 pb-2">
          <h3 className="text-lg font-semibold text-stone-800">Connection topology map</h3>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input type="checkbox" checked={showMismatchOnly} onChange={e => setShowMismatchOnly(e.target.checked)} className="accent-amber-600" />
            Show mismatches only
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs font-semibold uppercase text-stone-500">
              <th className="px-4 py-2">Consumer RR</th><th className="px-4 py-2">Recorded feeder</th><th className="px-4 py-2">Inferred feeder</th>
              <th className="px-4 py-2">Match</th><th className="px-4 py-2">Confidence</th><th className="px-4 py-2">V-Corr</th>
              <th className="px-4 py-2">Phase-Angle</th><th className="px-4 py-2">Method</th>
            </tr></thead>
            <tbody>{visible.slice(0, 50).map(t => (
              <tr key={t.id} className={`border-b border-stone-50 ${t.isMismatch ? "bg-red-50/50" : "hover:bg-amber-50/40"}`}>
                <td className="px-4 py-2 font-mono text-xs">{t.consumerRR}</td>
                <td className="px-4 py-2 font-mono text-xs">{t.recordedFeeder}</td>
                <td className="px-4 py-2 font-mono text-xs">{t.inferredFeeder}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.isMismatch ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{t.isMismatch ? "MISMATCH" : "OK"}</span></td>
                <td className="px-4 py-2">{(t.confidence * 100).toFixed(1)}%</td>
                <td className="px-4 py-2">{t.voltageCorr}</td>
                <td className="px-4 py-2">{t.phaseAngle}</td>
                <td className="px-4 py-2 text-xs text-stone-500">{t.method}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
