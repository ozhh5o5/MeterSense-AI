import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DATA } from "@/data/mock-data";
import KpiCard from "@/components/KpiCard";

export default function Maintenance() {
  const tx = DATA.transformers;
  const crit = tx.filter(t => t.riskLevel === "CRITICAL").length;
  const high = tx.filter(t => t.riskLevel === "HIGH").length;
  const med = tx.filter(t => t.riskLevel === "MEDIUM").length;

  const chartData = tx.filter(t => t.riskLevel !== "LOW").map(t => ({
    name: t.code,
    "30-day": Math.round(t.failureProb30 * 100),
    "60-day": Math.round(t.failureProb60 * 100),
    "90-day": Math.round(t.failureProb90 * 100),
  }));

  const riskColor: Record<string, string> = {
    CRITICAL: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Predictive Maintenance</h1>
        <p className="text-stone-500">Transformer survival analysis and maintenance scheduling.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total transformers" value={tx.length} color="stone" />
        <KpiCard label="Critical risk" value={crit} color="red" />
        <KpiCard label="High risk" value={high} color="yellow" />
        <KpiCard label="Medium risk" value={med} color="amber" />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-stone-800">Failure Probability (30/60/90 day)</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" />
            <YAxis tick={{ fontSize: 11 }} label={{ value: "Probability %", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="30-day" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="60-day" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="90-day" fill="#eab308" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <h3 className="p-6 pb-2 text-lg font-semibold text-stone-800">Transformer Health Register</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs font-semibold uppercase text-stone-500">
              <th className="px-4 py-2">Code</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">KVA</th>
              <th className="px-4 py-2">Oil °C</th><th className="px-4 py-2">Load %</th><th className="px-4 py-2">Risk</th>
              <th className="px-4 py-2">Consumers</th>
            </tr></thead>
            <tbody>{tx.map(t => (
              <tr key={t.id} className="border-b border-stone-50 hover:bg-amber-50/40">
                <td className="px-4 py-2 font-mono text-xs">{t.code}</td>
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.capacityKVA}</td>
                <td className="px-4 py-2">{t.oilTempC}</td>
                <td className="px-4 py-2">{t.loadPct}%</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${riskColor[t.riskLevel]}`}>{t.riskLevel}</span></td>
                <td className="px-4 py-2">{t.consumersServed}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <h3 className="p-6 pb-2 text-lg font-semibold text-stone-800">Maintenance Work Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs font-semibold uppercase text-stone-500">
              <th className="px-4 py-2">Transformer</th><th className="px-4 py-2">Priority</th><th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Due</th><th className="px-4 py-2">Crew</th><th className="px-4 py-2">Description</th>
            </tr></thead>
            <tbody>{DATA.workOrders.map(w => (
              <tr key={w.id} className="border-b border-stone-50 hover:bg-amber-50/40">
                <td className="px-4 py-2 font-mono text-xs">{w.transformerCode}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${w.priority.includes("P1") ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{w.priority}</span></td>
                <td className="px-4 py-2">{w.status}</td>
                <td className="px-4 py-2">{w.dueDate}</td>
                <td className="px-4 py-2">{w.assignedCrew}</td>
                <td className="px-4 py-2 max-w-xs truncate">{w.description}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
