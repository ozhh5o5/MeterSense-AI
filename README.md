# MeterSense AI

A comprehensive smart grid intelligence platform designed for BESCOM (Bangalore Electricity Supply Company Limited), addressing the core challenges of AT&C (Aggregate Technical & Commercial) loss detection, predictive maintenance, and grid topology mapping.

This project implements the features outlined in **Theme 8: Advanced Agentic Coding - Smart Grid Intelligence**.

## 🌟 Key Features

### 1. 7-Type Anomaly Taxonomy & Spatio-Temporal Detection
Advanced algorithms combining Isolation Forests and temporal rule-based heuristics to detect and classify 7 distinct types of anomalies:
- **Tamper Suspected:** Detects meter tampering signatures.
- **Bypass Suspected:** Identifies potential direct line tapping.
- **Zero Consumption Live:** Flags active meters reporting zero usage.
- **Power Factor Drop:** Detects sudden drops in power quality.
- **Reverse Flow:** Identifies energy feeding back into the grid unexpectedly.
- **Voltage Sag:** Monitors severe voltage fluctuations.
- **Meter Comm Loss:** Tracks AMI communication failures.
*Every anomaly provides explainable evidence for field investigators.*

### 2. Federated Learning Dashboard (Privacy-Preserving)
A fully operational dashboard demonstrating a Federated Learning architecture that is **DPDP Act 2023 Compliant by design**.
- Edge nodes (smart meters/concentrators) train models locally on raw data.
- Only mathematical model weight updates (Δ) are transmitted to the central server.
- Consumer privacy is cryptographically guaranteed through differential privacy, tracking Privacy Budget (ε).
- Visualizes model convergence (Accuracy & Loss) across communication rounds.

### 3. Predictive Maintenance for Transformers
Survival analysis module estimating failure probabilities (30/60/90-day) for distribution transformers.
- Ranks transformers by risk level (Critical, High, Medium, Low) based on load percentages, oil temperatures, and age.
- Automatically generates and prioritizes maintenance work orders.
- Visualized through a comprehensive health register and survival probability bar charts.

### 4. Algorithmic Grid Topology Inference
Corrects outdated GIS maps by algorithmic reverse-engineering of the physical grid topology.
- Analyzes voltage fluctuation correlations and phase-angle signatures across consumer meters.
- Identifies mismatches between recorded feeder connections and actual physical connections.
- Assigns confidence scores to inferences, replacing the need for manual line-walking surveys.

### 5. Feeder-Level Reconciliation
Detailed dashboards tracking energy supplied vs. billed at the substation and feeder levels.
- Calculates and breaks down AT&C losses.
- Provides interactive visualizations of consumption patterns.

### 6. Interactive Spatial Visualization
A Leaflet-based interactive map displaying substations, feeders, and consumer endpoints.
- Heatmap overlay for AT&C loss concentration by pincode.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI Components:** React, Tailwind CSS, Tremor (for data visualization)
- **Database:** SQLite (local/dev) managed by Prisma ORM
- **Maps:** Leaflet & React-Leaflet
- **Deployment:** Vercel & Netlify compatible (includes `/tmp` DB copy strategy for read-only filesystems).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Setup

1. **Install dependencies:**
   `npm install`

2. **Initialize the database:**
   Push the Prisma schema to create the SQLite database:
   `npx prisma db push`

3. **Seed the database with mock data:**
   Generate synthetic readings, anomalies, transformers, and federated learning rounds:
   `npm run seed`

4. **Start the development server:**
   `npm run dev`

Open `http://localhost:3000` in your browser to view the application.

## 📁 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components and dashboard widgets.
- `/lib`: Database client, utility functions, and AI detection heuristics.
- `/prisma`: Database schema (`schema.prisma`) and SQLite file.
- `/scripts`: Data generation and seeding scripts.
- `/public`: Static assets, including GeoJSON data for the map.

## ☁️ Deployment Notes

This project is configured to run on platforms with read-only filesystems (like Vercel and Netlify). 
- During the build phase (`npm run build`), the database is seeded.
- At runtime, `lib/db.ts` checks if the environment is Serverless. If so, it copies the pre-seeded SQLite database from the build output to the `/tmp` directory, allowing the application to read and write data during the serverless function's lifecycle.
- To resolve peer dependency conflicts (e.g., React 19 vs Tremor requiring React 18) during deployment, an `.npmrc` file with `legacy-peer-deps=true` is included.
