import { db } from "@/lib/db";
import { FederatedDashboard } from "@/components/federated-dashboard";

export default async function FederatedPage() {
  const rounds = await db.federatedRound.findMany({
    orderBy: { roundNumber: "asc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Federated Learning</h1>
        <p className="text-stone-600">
          Privacy-preserving theft detection — anomaly detection models trained at the edge
          via Federated Averaging. Only Δ weight updates are transmitted, never raw data.
          DPDP Act 2023 compliant by architecture.
        </p>
      </div>
      <FederatedDashboard
        rounds={rounds.map((r) => ({
          roundNumber: r.roundNumber,
          participatingNodes: r.participatingNodes,
          avgTrainLoss: r.avgTrainLoss,
          globalAccuracy: r.globalAccuracy,
          privacyBudgetEps: r.privacyBudgetEps,
          deltaWeightsKB: r.deltaWeightsKB,
          convergenceRate: r.convergenceRate,
          timestamp: r.timestamp.toISOString(),
        }))}
      />
    </div>
  );
}
