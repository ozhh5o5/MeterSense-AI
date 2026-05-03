import { db } from "@/lib/db";
import { TopologyDashboard } from "@/components/topology-dashboard";

export default async function TopologyPage() {
  const inferences = await db.topologyInference.findMany({
    include: {
      consumer: {
        select: { rrNumber: true, name: true, feeder: { select: { code: true } } },
      },
    },
    orderBy: { confidence: "desc" },
  });

  // Look up feeder codes for inferred feeders
  const feederMap = new Map<string, string>();
  const feeders = await db.feeder.findMany({ select: { id: true, code: true } });
  feeders.forEach((f) => feederMap.set(f.id, f.code));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Grid Topology Inference</h1>
        <p className="text-stone-600">
          Algorithmic reverse-engineering of the physical grid topology from voltage fluctuation
          correlations and phase-angle signatures. Corrects BESCOM&apos;s outdated GIS maps
          by identifying which meter truly connects to which transformer/feeder.
        </p>
      </div>
      <TopologyDashboard
        rows={inferences.map((i) => ({
          id: i.id,
          consumerId: i.consumerId,
          consumerRR: i.consumer.rrNumber,
          consumerName: i.consumer.name,
          recordedFeederCode: i.consumer.feeder.code,
          inferredFeederCode: feederMap.get(i.inferredFeederId) ?? i.inferredFeederId,
          confidence: i.confidence,
          isMismatch: i.isMismatch,
          method: i.method,
          voltageCorrelation: i.voltageCorrelation,
          phaseAngleMatch: i.phaseAngleMatch,
        }))}
      />
    </div>
  );
}
