import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DATA } from "@/data/mock-data";
import KpiCard from "@/components/KpiCard";

export default function Federated() {
  const rounds = DATA.federatedRounds;
  const latest = rounds[rounds.length - 1];
  const totalNodes = latest?.participatingNodes ?? 0;

  const chartData = rounds.map(r => ({
    round: `R${r.roundNumber}`,
    "Accuracy %": Math.round(r.globalAccuracy * 100 * 10) / 10,
    "Loss %": Math.round(r.avgTrainLoss * 100 * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Federated Learning</h1>
        <p className="text-stone-500">Privacy-preserving theft detection — anomaly detection models trained at the edge via Federated Averaging. Only Δ weight updates are transmitted, never raw data. DPDP Act 2023 compliant by architecture.</p>
      </div>

      <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
        <p className="font-semibold text-emerald-800">🔒 DPDP Act 2023 Compliant by Architecture</p>
        <p className="text-sm text-emerald-700">Raw consumption data never leaves edge nodes. Only mathematical model weight updates (Δ ≈ {latest?.deltaWeightsKB ?? 117} KB) are transmitted to the central aggregation server. Consumer privacy is cryptographically guaranteed through differential privacy (ε = {latest?.privacyBudgetEps.toFixed(2) ?? "3.00"}), not policy-promised.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="FL Rounds Completed" value={rounds.length} color="amber" />
        <KpiCard label="Global Model Accuracy" value={`${((latest?.globalAccuracy ?? 0) * 100).toFixed(1)}%`} color="green" />
        <KpiCard label="Participating Edge Nodes" value={totalNodes} color="blue" />
        <KpiCard label="Privacy Budget (ε)" value={latest?.privacyBudgetEps.toFixed(2) ?? "—"} color="purple" />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-stone-800">Federated Learning Architecture</h3>
        <p className="text-sm text-stone-500 mb-4">Edge-trained anomaly detection models with privacy-preserving aggregation</p>
        <div className="flex items-center justify-center gap-8 rounded-lg bg-stone-50 p-8">
          <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6 text-center">
            <p className="font-bold text-amber-700">Edge Nodes</p>
            <p className="text-3xl font-extrabold text-amber-900">{totalNodes}</p>
            <p className="text-xs text-amber-600 mt-1">Smart meters & data concentrators</p>
            <p className="text-[10px] text-amber-500">Local model training on raw data. Data never leaves the edge.</p>
          </div>
          <div className="text-center text-stone-400">
            <p>→</p>
            <p className="text-xs">Δ weights only</p>
            <p className="text-xs">~{latest?.deltaWeightsKB ?? 117} KB</p>
            <p>←</p>
            <p className="text-xs">Global model</p>
          </div>
          <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-6 text-center">
            <p className="font-bold text-emerald-700">Aggregation Server</p>
            <p className="text-3xl font-extrabold text-emerald-900">FedAvg</p>
            <p className="text-xs text-emerald-600 mt-1">Secure model weight aggregation</p>
            <p className="text-[10px] text-emerald-500">Differential privacy noise injection. Zero raw data access.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-stone-800">Model Convergence — Accuracy & Loss</h3>
        <p className="text-sm text-stone-500 mb-2">Federated averaging across {rounds.length} communication rounds</p>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
            <XAxis dataKey="round" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Accuracy %" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Loss %" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm">
        <h3 className="p-6 pb-2 font-semibold text-stone-800">Round Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs font-semibold uppercase text-stone-500">
              <th className="px-4 py-2">Round</th><th className="px-4 py-2">Nodes</th><th className="px-4 py-2">Accuracy</th>
              <th className="px-4 py-2">Loss</th><th className="px-4 py-2">ε</th><th className="px-4 py-2">Δ KB</th>
            </tr></thead>
            <tbody>{rounds.map(r => (
              <tr key={r.roundNumber} className="border-b border-stone-50 hover:bg-amber-50/40">
                <td className="px-4 py-2 font-medium">{r.roundNumber}</td>
                <td className="px-4 py-2">{r.participatingNodes}</td>
                <td className="px-4 py-2 font-medium text-emerald-700">{(r.globalAccuracy * 100).toFixed(1)}%</td>
                <td className="px-4 py-2 text-red-600">{(r.avgTrainLoss * 100).toFixed(1)}%</td>
                <td className="px-4 py-2">{r.privacyBudgetEps.toFixed(2)}</td>
                <td className="px-4 py-2">{r.deltaWeightsKB}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
