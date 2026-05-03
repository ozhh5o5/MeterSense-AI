import { db } from "@/lib/db";
import { MaintenanceDashboard } from "@/components/maintenance-dashboard";

export default async function MaintenancePage() {
  const transformers = await db.transformer.findMany({
    orderBy: { failureProb30: "desc" },
    include: { substation: { select: { name: true } } },
  });
  const workOrders = await db.maintenanceWorkOrder.findMany({
    orderBy: [{ priority: "asc" }, { dueDate: "asc" }],
    include: { transformer: { select: { code: true } } },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Predictive Maintenance</h1>
        <p className="text-stone-600">
          Transformer health monitoring, survival analysis failure prediction (30/60/90 day),
          and prioritized maintenance work orders.
        </p>
      </div>
      <MaintenanceDashboard
        transformers={transformers.map((t) => ({
          id: t.id,
          code: t.code,
          name: t.name,
          capacityKVA: t.capacityKVA,
          phase: t.phase,
          oilTempC: t.oilTempC,
          loadPct: t.loadPct,
          failureProb30: t.failureProb30,
          failureProb60: t.failureProb60,
          failureProb90: t.failureProb90,
          riskLevel: t.riskLevel,
          lastInspected: t.lastInspected?.toISOString() ?? null,
          installDate: t.installDate?.toISOString() ?? null,
          consumersServed: t.consumersServed,
          substationName: t.substation.name,
        }))}
        workOrders={workOrders.map((w) => ({
          id: w.id,
          priority: w.priority,
          status: w.status,
          description: w.description,
          dueDate: w.dueDate.toISOString(),
          assignedCrew: w.assignedCrew,
          transformerCode: w.transformer.code,
        }))}
      />
    </div>
  );
}
