"use client";

import { useState } from "react";
import { Card, Title, Text, BarChart, DonutChart, Metric } from "@tremor/react";

type TopoRow = {
  id: string;
  consumerId: string;
  consumerRR: string;
  consumerName: string;
  recordedFeederCode: string;
  inferredFeederCode: string;
  confidence: number;
  isMismatch: boolean;
  method: string;
  voltageCorrelation: number | null;
  phaseAngleMatch: number | null;
};

const confColor = (c: number) => {
  if (c >= 0.9) return "text-green-700";
  if (c >= 0.7) return "text-amber-700";
  return "text-red-700";
};

export function TopologyDashboard({ rows }: { rows: TopoRow[] }) {
  const [showMismatchOnly, setShowMismatchOnly] = useState(false);
  const displayed = showMismatchOnly ? rows.filter((r) => r.isMismatch) : rows;
  const sorted = [...displayed].sort((a, b) => {
    if (a.isMismatch !== b.isMismatch) return a.isMismatch ? -1 : 1;
    return b.confidence - a.confidence;
  });

  const totalMismatch = rows.filter((r) => r.isMismatch).length;
  const totalMatched = rows.length - totalMismatch;
  const avgConf = rows.length > 0
    ? rows.reduce((s, r) => s + r.confidence, 0) / rows.length
    : 0;
  const methodCounts: Record<string, number> = {};
  rows.forEach((r) => { methodCounts[r.method] = (methodCounts[r.method] ?? 0) + 1; });
  const methodDonut = Object.entries(methodCounts).map(([name, value]) => ({ name, value }));

  const confBuckets = [
    { range: "90-100%", count: 0 },
    { range: "70-90%", count: 0 },
    { range: "50-70%", count: 0 },
    { range: "<50%", count: 0 },
  ];
  rows.forEach((r) => {
    if (r.confidence >= 0.9) confBuckets[0]!.count++;
    else if (r.confidence >= 0.7) confBuckets[1]!.count++;
    else if (r.confidence >= 0.5) confBuckets[2]!.count++;
    else confBuckets[3]!.count++;
  });

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl text-white">
            🔌
          </div>
          <div>
            <p className="font-semibold text-blue-900">Algorithmic grid topology correction</p>
            <p className="mt-1 text-sm text-blue-800">
              Analyzing voltage fluctuation correlations and phase-angle signatures across {rows.length} meters
              to reverse-engineer the physical grid topology. Mismatched connections are flagged with confidence
              scores — replacing years of manual line-walking surveys.
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card decoration="top" decorationColor="blue">
          <Text>Connections analyzed</Text>
          <Metric>{rows.length}</Metric>
        </Card>
        <Card decoration="top" decorationColor="red">
          <Text>Topology mismatches</Text>
          <Metric>{totalMismatch}</Metric>
          <Text>{rows.length > 0 ? ((totalMismatch / rows.length) * 100).toFixed(1) : 0}% of total</Text>
        </Card>
        <Card decoration="top" decorationColor="emerald">
          <Text>Confirmed matches</Text>
          <Metric>{totalMatched}</Metric>
        </Card>
        <Card decoration="top" decorationColor="amber">
          <Text>Avg confidence</Text>
          <Metric>{(avgConf * 100).toFixed(1)}%</Metric>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Title>Confidence distribution</Title>
          <BarChart
            className="mt-4 h-56"
            data={confBuckets}
            index="range"
            categories={["count"]}
            colors={["amber"]}
            valueFormatter={(v) => String(v)}
            yAxisWidth={32}
          />
        </Card>
        <Card>
          <Title>Inference method</Title>
          <DonutChart
            className="mt-4 h-56"
            data={methodDonut}
            category="value"
            index="name"
            colors={["blue", "violet"]}
          />
        </Card>
      </div>

      {/* Table */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <Title>Connection topology map</Title>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={showMismatchOnly}
              onChange={(e) => setShowMismatchOnly(e.target.checked)}
              className="rounded border-amber-300"
            />
            Show mismatches only
          </label>
        </div>
        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-amber-50 text-amber-900">
              <tr>
                <th className="px-3 py-2">Consumer RR</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Recorded feeder</th>
                <th className="px-3 py-2">Inferred feeder</th>
                <th className="px-3 py-2">Match</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">V-Corr</th>
                <th className="px-3 py-2">Phase-Angle</th>
                <th className="px-3 py-2">Method</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.id}
                  className={`border-t ${r.isMismatch ? "border-red-100 bg-red-50/30" : "border-amber-100"} hover:bg-amber-50/50`}
                >
                  <td className="px-3 py-2 font-mono text-xs">{r.consumerRR}</td>
                  <td className="px-3 py-2">{r.consumerName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.recordedFeederCode}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.inferredFeederCode}</td>
                  <td className="px-3 py-2">
                    {r.isMismatch ? (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">MISMATCH</span>
                    ) : (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">OK</span>
                    )}
                  </td>
                  <td className={`px-3 py-2 font-semibold ${confColor(r.confidence)}`}>
                    {(r.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2">{r.voltageCorrelation?.toFixed(2) ?? "—"}</td>
                  <td className="px-3 py-2">{r.phaseAngleMatch?.toFixed(2) ?? "—"}</td>
                  <td className="px-3 py-2 text-xs">{r.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
