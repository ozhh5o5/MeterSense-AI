# MeterSense AI: Project Description

**Short Description (140 characters)**
MeterSense AI is a privacy-preserving smart grid intelligence platform for BESCOM, featuring federated learning, predictive maintenance, and AT&C loss detection.

**Long Description**
MeterSense AI transforms raw smart meter telemetry into actionable grid intelligence for distribution companies like BESCOM. Moving beyond basic consumption dashboards, it introduces a highly advanced, agentic AI approach to grid management to solve the core challenges of Aggregate Technical and Commercial (AT&C) losses, equipment failure, and outdated GIS infrastructure.

Key features include:
1. **Federated Learning for Theft Detection:** A DPDP Act 2023 compliant architecture where anomaly detection models are trained at the edge (on the meter). Raw consumer data never leaves the premises; only mathematical weight updates are sent to the central server, cryptographically guaranteeing consumer privacy.
2. **Predictive Maintenance:** A survival analysis module that calculates 30, 60, and 90-day failure probabilities for distribution transformers based on load, temperature, and age, automatically generating prioritized work orders before catastrophic failures occur.
3. **Grid Topology Inference:** An algorithmic engine that reverse-engineers the physical grid by analyzing voltage fluctuation correlations and phase-angle signatures across meters. It automatically detects and flags mismatches in the utility's recorded GIS database, replacing expensive manual line-walking surveys.
4. **7-Type Anomaly Taxonomy:** A robust detection engine combining Isolation Forests and temporal rules to identify issues ranging from power factor drops to bypass tampering, providing explainable JSON evidence for field investigators.
5. **Feeder Reconciliation:** Real-time dashboards calculating energy supplied versus billed, mapping AT&C loss concentration geospatially using Leaflet.

Built with Next.js, Tremor, and Prisma, MeterSense AI represents a production-ready vision for the future of India's smart grid infrastructure.
