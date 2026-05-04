/* ---------- deterministic seeded PRNG (no faker dependency) ---------- */
let _seed = 42;
function rand() { _seed = (_seed * 16807 + 0) % 2147483647; return (_seed - 1) / 2147483646; }
function randInt(a: number, b: number) { return Math.floor(a + rand() * (b - a + 1)); }
function randFloat(a: number, b: number) { return a + rand() * (b - a); }
function pick<T>(arr: T[]): T { return arr[randInt(0, arr.length - 1)]; }
function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

/* ---------- substations ---------- */
const SUBS_DEF = [
  { name: "Jayanagar", code: "S-JN-01", division: "South", lat: 12.925, lng: 77.5938 },
  { name: "Koramangala", code: "S-KM-01", division: "South", lat: 12.9352, lng: 77.6245 },
  { name: "Whitefield", code: "E-WF-01", division: "East", lat: 12.9698, lng: 77.75 },
  { name: "Rajajinagar", code: "W-RJ-01", division: "West", lat: 12.9988, lng: 77.55 },
  { name: "Electronic City", code: "S-EC-01", division: "South", lat: 12.8456, lng: 77.6603 },
];

export interface Substation { id: string; name: string; code: string; division: string; lat: number; lng: number; feederCount: number; avgLoss: number; }
export interface Feeder { id: string; substationId: string; code: string; name: string; capacityKW: number; }
export interface Anomaly { id: string; type: string; severity: string; status: string; detectedAt: string; feederCode: string; consumerRR: string; score: number; evidence: string; }
export interface Transformer { id: string; code: string; name: string; capacityKVA: number; oilTempC: number; loadPct: number; failureProb30: number; failureProb60: number; failureProb90: number; riskLevel: string; consumersServed: number; substationName: string; }
export interface WorkOrder { id: string; transformerCode: string; priority: string; status: string; description: string; dueDate: string; assignedCrew: string; }
export interface TopologyInference { id: string; consumerRR: string; recordedFeeder: string; inferredFeeder: string; confidence: number; isMismatch: boolean; method: string; voltageCorr: number; phaseAngle: number; }
export interface FedRound { roundNumber: number; participatingNodes: number; avgTrainLoss: number; globalAccuracy: number; privacyBudgetEps: number; deltaWeightsKB: number; }
export interface DailyReading { day: string; supplied: number; billed: number; }

/* ---------- generate everything ---------- */
function generate() {
  _seed = 42;

  const substations: Substation[] = SUBS_DEF.map((s, i) => ({
    id: `sub-${i}`, name: `${s.name} Sub-division`, code: s.code, division: s.division,
    lat: s.lat, lng: s.lng, feederCount: 4, avgLoss: 0,
  }));

  const feeders: Feeder[] = [];
  substations.forEach((sub, si) => {
    for (let f = 0; f < 4; f++) {
      feeders.push({
        id: `fdr-${si}-${f}`, substationId: sub.id,
        code: `FDR-${sub.code.split("-")[1]}-${String(si * 4 + f + 1).padStart(3, "0")}`,
        name: `${sub.name.split(" ")[0]} Feeder ${f + 1}`,
        capacityKW: 800 + f * 120 + si * 50,
      });
    }
  });

  /* daily readings (30 days) */
  const dailyReadings: DailyReading[] = [];
  const now = new Date();
  for (let d = 29; d >= 0; d--) {
    const dt = new Date(now.getTime() - d * 86400000);
    const day = `${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    const supplied = 800 + randFloat(-200, 600) + Math.sin(d / 3) * 300;
    const billed = supplied * (0.72 + randFloat(0, 0.08));
    dailyReadings.push({ day, supplied: Math.round(supplied), billed: Math.round(billed) });
  }

  /* avg loss */
  const totalS = dailyReadings.reduce((a, r) => a + r.supplied, 0);
  const totalB = dailyReadings.reduce((a, r) => a + r.billed, 0);
  const avgLoss = totalS > 0 ? ((totalS - totalB) / totalS) * 100 : 0;
  substations.forEach(s => { s.avgLoss = Math.round(avgLoss * 10) / 10; });

  /* anomalies */
  const TYPES = ["TAMPER_SUSPECTED", "ZERO_CONSUMPTION_LIVE", "POWER_FACTOR_DROP", "REVERSE_FLOW", "METER_COMM_LOSS", "VOLTAGE_SAG", "BYPASS_SUSPECTED"];
  const SEVS = ["CRITICAL", "HIGH", "MEDIUM"];
  const anomalies: Anomaly[] = [];
  for (let i = 0; i < 18; i++) {
    const tp = TYPES[i % TYPES.length];
    const sev = i < 4 ? "CRITICAL" : i < 11 ? "HIGH" : "MEDIUM";
    const fdr = feeders[i % feeders.length];
    anomalies.push({
      id: uid(), type: tp, severity: sev, status: "OPEN",
      detectedAt: new Date(now.getTime() - randInt(1, 72) * 3600000).toISOString(),
      feederCode: fdr.code, consumerRR: `RR-${String(i + 1).padStart(6, "0")}`,
      score: Math.round(randFloat(0.6, 0.99) * 100) / 100,
      evidence: `Anomaly score ${(0.6 + rand() * 0.35).toFixed(2)}. ${tp === "TAMPER_SUSPECTED" ? "Tamper flag pattern detected over 7-day window." : tp === "ZERO_CONSUMPTION_LIVE" ? "Zero kWh for 7+ consecutive blocks while voltage > 200V." : tp === "REVERSE_FLOW" ? "Negative kWh detected in 3+ readings." : "Statistical outlier in feeder cohort analysis."}`,
    });
  }

  /* transformers */
  const transformers: Transformer[] = [];
  substations.forEach((sub, si) => {
    const count = 3 + (si % 3);
    for (let t = 0; t < count; t++) {
      const ageYears = 5 + randInt(0, 25);
      const loadPct = Math.round(40 + randFloat(0, 55));
      const oilTempC = Math.round(45 + loadPct * 0.3 + randFloat(-5, 15));
      const baseRisk = (ageYears / 30) * 0.3 + (loadPct / 100) * 0.4 + (oilTempC > 80 ? 0.3 : 0);
      const fp30 = Math.min(0.95, baseRisk * (0.6 + randFloat(0, 0.4)));
      const fp60 = Math.min(0.98, fp30 * 1.3);
      const fp90 = Math.min(0.99, fp60 * 1.2);
      const risk = fp30 > 0.6 ? "CRITICAL" : fp30 > 0.4 ? "HIGH" : fp30 > 0.2 ? "MEDIUM" : "LOW";
      transformers.push({
        id: `trf-${si}-${t}`, code: `TRF-${sub.code.split("-")[1]}-${String(si * 10 + t + 1).padStart(3, "0")}`,
        name: `${sub.name.split(" ")[0]} Transformer ${t + 1}`,
        capacityKVA: [100, 250, 500, 630, 1000][t % 5],
        oilTempC, loadPct, failureProb30: Math.round(fp30 * 100) / 100,
        failureProb60: Math.round(fp60 * 100) / 100, failureProb90: Math.round(fp90 * 100) / 100,
        riskLevel: risk, consumersServed: 10 + randInt(0, 40), substationName: sub.name,
      });
    }
  });

  /* work orders */
  const CREWS = ["Alpha-Maintenance", "Bravo-Field", "Charlie-HV", "Delta-Patrol"];
  const workOrders: WorkOrder[] = transformers
    .filter(t => t.riskLevel === "CRITICAL" || t.riskLevel === "HIGH")
    .map((tx, i) => ({
      id: uid(), transformerCode: tx.code,
      priority: tx.riskLevel === "CRITICAL" ? "P1-URGENT" : "P2-HIGH",
      status: i % 3 === 0 ? "IN_PROGRESS" : "PENDING",
      description: `${tx.riskLevel === "CRITICAL" ? "Immediate oil sample + DGA." : "Schedule preventive maintenance."} Failure prob ${(tx.failureProb30 * 100).toFixed(0)}% in 30d. ${tx.consumersServed} consumers.`,
      dueDate: new Date(now.getTime() + randInt(3, 30) * 86400000).toISOString().slice(0, 10),
      assignedCrew: CREWS[i % CREWS.length],
    }));

  /* topology */
  const topologyInferences: TopologyInference[] = [];
  for (let i = 0; i < 200; i++) {
    const isMismatch = i % 6 === 0;
    const recF = feeders[i % feeders.length];
    const infF = isMismatch ? feeders[(i + 3) % feeders.length] : recF;
    topologyInferences.push({
      id: `topo-${i}`, consumerRR: `RR-${String(i + 1).padStart(6, "0")}`,
      recordedFeeder: recF.code, inferredFeeder: infF.code,
      confidence: Math.round((isMismatch ? 0.55 + randFloat(0, 0.3) : 0.88 + randFloat(0, 0.12)) * 1000) / 1000,
      isMismatch, method: isMismatch && i % 12 === 0 ? "phase-angle-signature" : "voltage-correlation",
      voltageCorr: Math.round((isMismatch ? 0.3 + randFloat(0, 0.3) : 0.85 + randFloat(0, 0.15)) * 100) / 100,
      phaseAngle: Math.round((isMismatch ? 0.2 + randFloat(0, 0.3) : 0.9 + randFloat(0, 0.1)) * 100) / 100,
    });
  }

  /* federated learning rounds */
  const federatedRounds: FedRound[] = [];
  for (let r = 1; r <= 25; r++) {
    federatedRounds.push({
      roundNumber: r,
      participatingNodes: 150 + randInt(0, 50),
      avgTrainLoss: Math.round(Math.max(0.05, 0.45 - r * 0.015 + randFloat(-0.02, 0.02)) * 1000) / 1000,
      globalAccuracy: Math.round(Math.min(0.97, 0.72 + r * 0.008 + randFloat(-0.01, 0.01)) * 1000) / 1000,
      privacyBudgetEps: Math.round((1.0 + r * 0.08) * 100) / 100,
      deltaWeightsKB: Math.round(120 + randFloat(-30, 30)),
    });
  }

  return { substations, feeders, dailyReadings, avgLoss: Math.round(avgLoss * 10) / 10, anomalies, transformers, workOrders, topologyInferences, federatedRounds };
}

export const DATA = generate();
