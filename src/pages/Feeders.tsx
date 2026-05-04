import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { DATA } from "@/data/mock-data";
import KpiCard from "@/components/KpiCard";

export default function Feeders() {
  const [selectedFeeder, setSelectedFeeder] = useState<string | null>(null);
  const feeders = DATA.feeders;
  const readings = DATA.dailyReadings;

  /* per-feeder reconciliation stats */
  const feederStats = feeders.map((f, i) => {
    const lossBase = 8 + (i % 7) * 4.5 + (i === 7 ? 18 : 0);
    const supplied = 2400 + i * 180 + (i % 3) * 120;
    const billed = Math.round(supplied * (1 - lossBase / 100));
    const lossKwh = supplied - billed;
    const lossPct = Math.round(lossBase * 10) / 10;
    const consumers = 10;
    const revLoss = Math.round(lossKwh * 7.5);
    return { ...f, supplied, billed, lossKwh, lossPct, consumers, revLoss };
  });

  const totalSupplied = feederStats.reduce((a, f) => a + f.supplied, 0);
  const totalBilled = feederStats.reduce((a, f) => a + f.billed, 0);
  const totalLoss = totalSupplied - totalBilled;
  const avgLossPct = totalSupplied > 0 ? Math.round((totalLoss / totalSupplied) * 1000) / 10 : 0;

  const selected = selectedFeeder ? feederStats.find(f => f.id === selectedFeeder) : null;

  /* Generate 30-day drill-down for selected feeder */
  const drillDown = selected ? readings.map((r, i) => ({
    day: r.day,
    supplied: Math.round(selected.supplied / 30 + Math.sin(i / 2) * 15 + (i % 3) * 5),
    billed: Math.round(selected.billed / 30 + Math.sin(i / 2) * 10 + (i % 3) * 3),
  })) : [];

  const lossColor = (pct: number) =>
    pct > 25 ? "bg-red-100 text-red-700" : pct > 15 ? "bg-orange-100 text-orange-700" : pct > 8 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Feeder-Level Reconciliation</h1>
        <p className="text-stone-500">Energy supplied (transformer meter) vs energy billed (∑ consumer meters) per feeder. The gap is the AT&C loss for that feeder segment.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total feeders" value={feeders.length} color="amber" />
        <KpiCard label="Total supplied (kWh)" value={totalSupplied.toLocaleString()} color="stone" />
        <KpiCard label="Total billed (kWh)" value={totalBilled.toLocaleString()} color="green" />
        <KpiCard label="Avg AT&C loss" value={`${avgLossPct}%`} color="red" />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-stone-800 mb-3">Supplied vs Billed by Feeder</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feederStats} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
            <XAxis dataKey="code" tick={{ fontSize: 9 }} angle={-40} textAnchor="end" />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="supplied" fill="#d97706" name="Supplied kWh" radius={[4, 4, 0, 0]} />
            <Bar dataKey="billed" fill="#10b981" name="Billed kWh" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <h3 className="p-6 pb-2 font-semibold text-stone-800">Feeder AT&C Reconciliation Table</h3>
        <p className="px-6 text-sm text-stone-500 mb-2">Click a row to drill down into 30-day supplied vs billed trend.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs font-semibold uppercase text-stone-500">
              <th className="px-4 py-2">Feeder</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Supplied</th>
              <th className="px-4 py-2">Billed</th><th className="px-4 py-2">Loss kWh</th><th className="px-4 py-2">Loss %</th>
              <th className="px-4 py-2">Consumers</th><th className="px-4 py-2">Est. Revenue Loss ₹</th>
            </tr></thead>
            <tbody>{feederStats.map(f => (
              <tr key={f.id}
                onClick={() => setSelectedFeeder(f.id === selectedFeeder ? null : f.id)}
                className={`border-b border-stone-50 cursor-pointer transition-colors ${f.id === selectedFeeder ? "bg-amber-50" : "hover:bg-amber-50/40"}`}>
                <td className="px-4 py-2 font-mono text-xs">{f.code}</td>
                <td className="px-4 py-2">{f.name}</td>
                <td className="px-4 py-2">{f.supplied.toLocaleString()}</td>
                <td className="px-4 py-2">{f.billed.toLocaleString()}</td>
                <td className="px-4 py-2 font-medium text-red-600">{f.lossKwh.toLocaleString()}</td>
                <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${lossColor(f.lossPct)}`}>{f.lossPct}%</span></td>
                <td className="px-4 py-2">{f.consumers}</td>
                <td className="px-4 py-2">₹{f.revLoss.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-stone-800">Drill-Down: {selected.code} — {selected.name}</h3>
          <p className="text-sm text-stone-500 mb-3">30-day supplied vs billed trend. AT&C loss: {selected.lossPct}%</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={drillDown} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/><stop offset="95%" stopColor="#d97706" stopOpacity={0}/></linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="supplied" stroke="#d97706" fill="url(#gS)" strokeWidth={2} name="Supplied" />
              <Area type="monotone" dataKey="billed" stroke="#10b981" fill="url(#gB)" strokeWidth={2} name="Billed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
