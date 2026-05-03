"use client";

import { useState } from "react";
import { Card, Title, Text, LineChart, DonutChart, Metric } from "@tremor/react";

type FedRound = {
  roundNumber: number;
  participatingNodes: number;
  avgTrainLoss: number;
  globalAccuracy: number;
  privacyBudgetEps: number;
  deltaWeightsKB: number;
  convergenceRate: number | null;
  timestamp: string;
};

export function FederatedDashboard({ rounds }: { rounds: FedRound[] }) {
  const latest = rounds[rounds.length - 1];
  const accChart = rounds.map((r) => ({
    Round: `R${r.roundNumber}`,
    "Global Accuracy": Math.round(r.globalAccuracy * 1000) / 10,
    "Train Loss": Math.round(r.avgTrainLoss * 1000) / 10,
  }));
  const privChart = rounds.map((r) => ({
    Round: `R${r.roundNumber}`,
    "Privacy ε": Math.round(r.privacyBudgetEps * 100) / 100,
    "Δ Weights (KB)": Math.round(r.deltaWeightsKB),
  }));

  return (
    <div className="space-y-6">
      {/* Privacy-first banner */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl text-white">
            🔒
          </div>
          <div>
            <p className="font-semibold text-green-900">
              DPDP Act 2023 Compliant by Architecture
            </p>
            <p className="mt-1 text-sm text-green-800">
              Raw consumption data never leaves edge nodes. Only mathematical model weight updates
              (Δ ≈ {latest ? Math.round(latest.deltaWeightsKB) : 120} KB) are transmitted to the
              central aggregation server. Consumer privacy is cryptographically guaranteed through
              differential privacy (ε = {latest ? latest.privacyBudgetEps.toFixed(2) : "3.00"}),
              not policy-promised.
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card decoration="top" decorationColor="amber">
          <Text>FL Rounds Completed</Text>
          <Metric>{rounds.length}</Metric>
        </Card>
        <Card decoration="top" decorationColor="emerald">
          <Text>Global Model Accuracy</Text>
          <Metric>{latest ? (latest.globalAccuracy * 100).toFixed(1) : 0}%</Metric>
        </Card>
        <Card decoration="top" decorationColor="blue">
          <Text>Participating Edge Nodes</Text>
          <Metric>{latest?.participatingNodes ?? 0}</Metric>
        </Card>
        <Card decoration="top" decorationColor="violet">
          <Text>Privacy Budget (ε)</Text>
          <Metric>{latest ? latest.privacyBudgetEps.toFixed(2) : "—"}</Metric>
        </Card>
      </div>

      {/* FL Architecture diagram */}
      <Card>
        <Title>Federated Learning architecture</Title>
        <Text>Edge-trained anomaly detection models with privacy-preserving aggregation</Text>
        <div className="mt-4 grid gap-4 md:grid-cols-5">
          <div className="col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
            <p className="text-lg font-bold text-amber-800">Edge Nodes</p>
            <p className="text-3xl font-bold text-amber-900">{latest?.participatingNodes ?? 0}</p>
            <p className="mt-1 text-xs text-amber-700">Smart meters & data concentrators</p>
            <p className="mt-2 text-xs text-amber-600">
              Local model training on raw consumption data.
              Data never leaves the edge.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl">→</div>
            <p className="text-xs text-stone-500">Δ weights only</p>
            <p className="text-xs font-semibold text-green-700">~{Math.round(latest?.deltaWeightsKB ?? 120)} KB</p>
            <div className="text-2xl">←</div>
            <p className="text-xs text-stone-500">Global model</p>
          </div>
          <div className="col-span-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-center">
            <p className="text-lg font-bold text-blue-800">Aggregation Server</p>
            <p className="text-3xl font-bold text-blue-900">FedAvg</p>
            <p className="mt-1 text-xs text-blue-700">Secure model weight aggregation</p>
            <p className="mt-2 text-xs text-blue-600">
              Differential privacy noise injection.
              Zero raw data access.
            </p>
          </div>
        </div>
      </Card>

      {/* Accuracy & Loss convergence */}
      <Card>
        <Title>Model convergence — Accuracy & Loss</Title>
        <Text>Federated averaging across {rounds.length} communication rounds</Text>
        <LineChart
          className="mt-4 h-80"
          data={accChart}
          index="Round"
          categories={["Global Accuracy", "Train Loss"]}
          colors={["emerald", "red"]}
          valueFormatter={(v) => `${v}%`}
          yAxisWidth={48}
        />
      </Card>

      {/* Privacy budget tracking */}
      <Card>
        <Title>Privacy budget & weight transfer</Title>
        <Text>Differential privacy epsilon (ε) accumulation per round</Text>
        <LineChart
          className="mt-4 h-72"
          data={privChart}
          index="Round"
          categories={["Privacy ε", "Δ Weights (KB)"]}
          colors={["violet", "amber"]}
          yAxisWidth={48}
        />
      </Card>

      {/* Round history table */}
      <Card>
        <Title>Round history</Title>
        <div className="mt-3 max-h-[400px] overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-amber-50 text-amber-900">
              <tr>
                <th className="px-3 py-2">Round</th>
                <th className="px-3 py-2">Nodes</th>
                <th className="px-3 py-2">Accuracy</th>
                <th className="px-3 py-2">Train Loss</th>
                <th className="px-3 py-2">ε</th>
                <th className="px-3 py-2">Δ KB</th>
                <th className="px-3 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {[...rounds].reverse().map((r) => (
                <tr key={r.roundNumber} className="border-t border-amber-100 hover:bg-amber-50/50">
                  <td className="px-3 py-2 font-semibold">R{r.roundNumber}</td>
                  <td className="px-3 py-2">{r.participatingNodes}</td>
                  <td className="px-3 py-2 font-semibold text-green-700">{(r.globalAccuracy * 100).toFixed(1)}%</td>
                  <td className="px-3 py-2">{r.avgTrainLoss.toFixed(4)}</td>
                  <td className="px-3 py-2">{r.privacyBudgetEps.toFixed(2)}</td>
                  <td className="px-3 py-2">{Math.round(r.deltaWeightsKB)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.timestamp.slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
