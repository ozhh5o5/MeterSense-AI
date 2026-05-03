# MeterSense AI — BESCOM Smart Grid Intelligence Platform

**PanIIT AI for Bharat Hackathon — Theme 8 Submission**

---

## 1. Executive Summary

BESCOM (Bangalore Electricity Supply Company) must reduce **Aggregate Technical and Commercial (AT&C)** loss and improve grid reliability across thousands of 11kV/415V feeders. 

**MeterSense AI** is a comprehensive Next.js operations console that ingests **feeder- and consumer-level smart meter data** to provide a unified grid intelligence platform. The solution goes beyond basic monitoring by implementing advanced AI/ML features including a **7-type anomaly detection taxonomy** (using Isolation Forests and rules), **Predictive Maintenance** for transformers via survival analysis, algorithmic **Grid Topology Inference** to correct GIS mismatches, and a privacy-preserving **Federated Learning** architecture for theft detection that complies with the DPDP Act 2023.

A beautiful **Tremor** dashboard, **Leaflet** geospatial visualization, and an investigator **status workflow** complete the field-ready story—running entirely on synthetic data without requiring live SCADA integration.

---

## 2. Architecture & Technology Stack

| Layer | Technology | Responsibility |
|--------|-----------------|-----------------|
| **Frontend** | Next.js 15 (App Router), Tremor, Tailwind CSS, React-Leaflet | UI rendering, geospatial mapping, data visualization, and responsive design. |
| **Backend** | Next.js API Routes | Server-side logic, anomaly orchestration, and AI endpoints. |
| **Database** | Prisma ORM + SQLite | Relational models (`Substation`, `Feeder`, `Consumer`, `Transformer`, `MaintenanceWorkOrder`, `TopologyInference`, `FederatedRound`). |
| **Detection Engine** | `isolation-forest` (npm), custom heuristics (`lib/detectors`) | Time-series analysis, cohort scoring, and rule-based anomaly flagging. |
| **Deployment** | Vercel / Netlify compatible | Uses a `/tmp` copy strategy for the SQLite DB to run on serverless read-only filesystems. |

See `docs/diagrams/architecture.png` for a visual representation.

---

## 3. Core Features (Theme 8 Implementation)

### 3.1 Federated Learning (Privacy-Preserving Theft Detection)
To comply with the DPDP Act 2023, the platform simulates a Federated Learning architecture:
- Raw consumer data never leaves the edge node (smart meter).
- Only mathematical model weight updates (Δ) are transmitted to the central server.
- The dashboard tracks model convergence (accuracy & loss) and monitors the Differential Privacy Budget (ε) across training rounds.

### 3.2 Seven-Type Anomaly Taxonomy
Uses a combination of Isolation Forests (for cohort outliers) and temporal rule engines to detect:
1. `ZERO_CONSUMPTION_LIVE`
2. `REVERSE_FLOW`
3. `POWER_FACTOR_DROP`
4. `VOLTAGE_SAG`
5. `METER_COMM_LOSS`
6. `BYPASS_SUSPECTED`
7. `TAMPER_SUSPECTED`
*Every anomaly provides JSON-backed explainable evidence to assist field investigators.*

### 3.3 Predictive Maintenance for Transformers
Monitors distribution transformers to prevent catastrophic failures:
- Survival analysis calculates 30/60/90-day failure probabilities based on oil temperature, load percentage, and age.
- Transformers are ranked by Risk Level (Critical, High, Medium, Low).
- Automatically generates prioritized `MaintenanceWorkOrder` records for field crews.

### 3.4 Algorithmic Grid Topology Inference
Corrects outdated physical GIS maps without manual line-walking surveys:
- Analyzes voltage fluctuation correlations and phase-angle signatures across consumer meters.
- Identifies and flags "mismatches" where a meter is physically connected to a different feeder than recorded in the database.
- Assigns confidence scores to every inference.

### 3.5 Feeder-Level Reconciliation
Aggregates feeder readings against the sum of underlying consumer readings to calculate real-time AT&C losses and estimate "revenue at risk".

---

## 4. Reproducibility & Local Setup

```bash
# Install dependencies
npm install

# Build the database schema
npx prisma db push

# Generate and seed the synthetic data (Transformers, Topology, FL Rounds, Anomalies)
npm run seed

# Run the development server
npm run dev
```

- **Mock Data Engine** — `scripts/generate-mock-meter-data.ts` uses Faker to generate a realistic, multi-modal dataset representing a slice of the BESCOM grid.
- **Seeding** — `scripts/seed-demo.ts` loads the data and executes the detection pipelines.

---

## 5. Security, Ethics & Limitations

- **Synthetic Data Only** — No real consumer RR numbers or live grid telemetry are used. The platform is entirely sandboxed.
- **Privacy by Design** — The Federated Learning architecture ensures raw consumption patterns cannot be reverse-engineered by the central server.
- **Limitations** — The Isolation Forest is tuned for the hackathon synthetic data. In production, models would require hyperparameter tuning and calibration against historical BESCOM incident reports. The geospatial map uses simplified envelopes for visualization purposes.

---

## 6. Conclusion

MeterSense AI demonstrates a complete, highly-advanced control-room loop for power distribution utilities. By moving beyond simple dashboards to incorporate Federated Learning, predictive survival analysis, and algorithmic topology correction, the platform is ready to be swapped for real API keys and PostgreSQL to deliver massive operational savings.
