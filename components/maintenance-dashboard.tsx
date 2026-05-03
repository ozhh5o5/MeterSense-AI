"use client";

import { useState } from "react";
import { BarChart, Card, Title, Text, LineChart } from "@tremor/react";

type Transformer = {
  id: string; code: string; name: string; capacityKVA: number;
  phase: string; oilTempC: number | null; loadPct: number | null;
  failureProb30: number; failureProb60: number; failureProb90: number;
  riskLevel: string; lastInspected: string | null; installDate: string | null;
  consumersServed: number; substationName: string;
};
type WorkOrder = {
  id: string; priority: string; status: string; description: string;
  dueDate: string; assignedCrew: string | null; transformerCode: string;
};

const riskBadge = (r: string) => {
  if (r === "CRITICAL") return "bg-red-100 text-red-800 border-red-200";
  if (r === "HIGH") return "bg-orange-100 text-orange-800 border-orange-200";
  if (r === "MEDIUM") return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-green-100 text-green-800 border-green-200";
};

const prioBadge = (p: string) =>
  p.startsWith("P1") ? "bg-red-600 text-white" : "bg-orange-500 text-white";

export function MaintenanceDashboard({
  transformers, workOrders,
}: { transformers: Transformer[]; workOrders: WorkOrder[] }) {
  const [riskFilter, setRiskFilter] = useState("");
  const filtered = riskFilter
    ? transformers.filter((t) => t.riskLevel === riskFilter)
    : transformers;
  const sorted = [...filtered].sort((a, b) => b.failureProb30 - a.failureProb30);

  const barData = sorted.slice(0, 15).map((t) => ({
    name: t.code,
    "30-day": Math.round(t.failureProb30 * 100),
    "60-day": Math.round(t.failureProb60 * 100),
    "90-day": Math.round(t.failureProb90 * 100),
  }));

  const riskCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  transformers.forEach((t) => {
    if (t.riskLevel in riskCounts) riskCounts[t.riskLevel as keyof typeof riskCounts]++;
  });

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card decoration="top" decorationColor="red">
          <Text>Critical Risk</Text>
          <p className="text-3xl font-bold text-red-700">{riskCounts.CRITICAL}</p>
        </Card>
        <Card decoration="top" decorationColor="orange">
          <Text>High Risk</Text>
          <p className="text-3xl font-bold text-orange-700">{riskCounts.HIGH}</p>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <Text>Medium Risk</Text>
          <p className="text-3xl font-bold text-amber-700">{riskCounts.MEDIUM}</p>
        </Card>
        <Card decoration="top" decorationColor="emerald">
          <Text>Low Risk</Text>
          <p className="text-3xl font-bold text-green-700">{riskCounts.LOW}</p>
        </Card>
      </div>

      {/* Failure probability chart */}
      <Card>
        <Title>Transformer failure probability — Survival Analysis</Title>
        <Text>Top 15 transformers ranked by 30-day failure probability (%)</Text>
        <BarChart
          className="mt-4 h-80"
          data={barData}
          index="name"
          categories={["30-day", "60-day", "90-day"]}
          colors={["red", "orange", "amber"]}
          valueFormatter={(v) => `${v}%`}
          yAxisWidth={40}
        />
      </Card>

      {/* Transformer table */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <Title>Transformer health register</Title>
          <select
            className="rounded border border-amber-200 bg-white px-2 py-1 text-sm"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="">All risk levels</option>
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-amber-50 text-amber-900">
              <tr>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">Substation</th>
                <th className="px-3 py-2">kVA</th>
                <th className="px-3 py-2">Oil °C</th>
                <th className="px-3 py-2">Load %</th>
                <th className="px-3 py-2">Fail 30d</th>
                <th className="px-3 py-2">Fail 60d</th>
                <th className="px-3 py-2">Fail 90d</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Consumers</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id} className="border-t border-amber-100 hover:bg-amber-50/50">
                  <td className="px-3 py-2 font-mono text-xs">{t.code}</td>
                  <td className="px-3 py-2">{t.substationName}</td>
                  <td className="px-3 py-2">{t.capacityKVA}</td>
                  <td className="px-3 py-2">{t.oilTempC?.toFixed(0) ?? "—"}°</td>
                  <td className="px-3 py-2">{t.loadPct?.toFixed(0) ?? "—"}%</td>
                  <td className="px-3 py-2 font-semibold">{(t.failureProb30 * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2">{(t.failureProb60 * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2">{(t.failureProb90 * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2">
                    <span className={`rounded border px-2 py-0.5 text-xs font-medium ${riskBadge(t.riskLevel)}`}>
                      {t.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 py-2">{t.consumersServed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Work Orders */}
      <Card>
        <Title>Maintenance work orders</Title>
        <Text>Prioritized by failure probability and consumer impact</Text>
        <div className="mt-4 max-h-[400px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-amber-50 text-amber-900">
              <tr>
                <th className="px-3 py-2">Transformer</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Crew</th>
                <th className="px-3 py-2">Due</th>
                <th className="px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((w) => (
                <tr key={w.id} className="border-t border-amber-100">
                  <td className="px-3 py-2 font-mono text-xs">{w.transformerCode}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${prioBadge(w.priority)}`}>
                      {w.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2">{w.status}</td>
                  <td className="px-3 py-2">{w.assignedCrew ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{w.dueDate.slice(0, 10)}</td>
                  <td className="px-3 py-2 text-xs text-stone-600">{w.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
