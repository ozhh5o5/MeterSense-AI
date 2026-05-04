import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DATA } from "@/data/mock-data";
import KpiCard from "@/components/KpiCard";

const COLORS_PIE = ["#d97706", "#f59e0b", "#ef4444", "#eab308", "#78716c", "#3b82f6", "#a855f7"];

export default function Dashboard() {
  const d = DATA;
  const critA = d.anomalies.filter(a => a.severity === "CRITICAL").length;
  const highA = d.anomalies.filter(a => a.severity === "HIGH").length;
  const critTx = d.transformers.filter(t => t.riskLevel === "CRITICAL" || t.riskLevel === "HIGH").length;
  const topoMis = d.topologyInferences.filter(t => t.isMismatch).length;
  const latestFL = d.federatedRounds[d.federatedRounds.length - 1];

  const typeMap = new Map<string, number>();
  d.anomalies.forEach(a => typeMap.set(a.type, (typeMap.get(a.type) ?? 0) + 1));
  const donutData = [...typeMap.entries()].map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active feeders" value={d.feeders.length} color="amber" />
        <KpiCard label="Avg network loss" value={`${d.avgLoss}%`} color="yellow" />
        <KpiCard label="Open anomalies (Critical / High)" value={`${critA} / ${highA}`} color="red" />
        <KpiCard label="Est. revenue at risk (₹ Cr/yr)" value="1.24" color="amber" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Substation load (avg kW/hr)" value={49} color="stone" />
        <KpiCard label="Transformers at risk" value={`${critTx} / ${d.transformers.length}`} sub="Critical + High risk units" color="red" />
        <KpiCard label="Topology mismatches" value={`${topoMis} / ${d.topologyInferences.length}`} sub="Connections needing correction" color="blue" />
        <KpiCard label="FL model accuracy" value={`${((latestFL?.globalAccuracy ?? 0) * 100).toFixed(1)}%`} sub={`Round ${latestFL?.roundNumber ?? 0} · Privacy-preserving`} color="green" />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-800">Network supplied vs billed (30 days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={d.dailyReadings} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gSupplied" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gBilled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="supplied" stroke="#d97706" fill="url(#gSupplied)" strokeWidth={2} name="Supplied" />
            <Area type="monotone" dataKey="billed" stroke="#f59e0b" fill="url(#gBilled)" strokeWidth={2} name="Billed" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800">Recent critical / high anomalies</h3>
          <ul className="mt-3 divide-y divide-amber-100">
            {d.anomalies.filter(a => a.severity === "CRITICAL" || a.severity === "HIGH").slice(0, 8).map(a => (
              <li key={a.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium text-amber-900">{a.type.replace(/_/g, " ")}</span>
                <span className="text-stone-500">{a.feederCode}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${a.severity === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{a.severity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-800">Open anomalies by type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {donutData.map((_, i) => <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
