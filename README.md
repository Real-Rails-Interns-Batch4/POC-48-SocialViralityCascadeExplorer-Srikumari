#  Social Virality Cascade Explorer 

A high-fidelity, interactive frontend prototype designed to visualize and track simulated cross-platform information cascades minute-by-minute.

>  This application is a client-side Proof of Concept (PoC) built to demonstrate user interaction quality, dashboard storytelling, and visual identity. It operates entirely on static mock data pipelines and does not require active database configurations or external API integrations.

---

##  Project Intent
This system serves as an **Interactive Forensics Dashboard** prototype for data analysts and brand safety managers. Instead of creating content, its purpose is to map out and study data *after* a viral event or data leak occurs. By tracking data propagation across platform algorithms ("The Rails"), users can isolate high-density influencer hubs and export structural data for targeted crisis response.

---

##  Core Features & Requirements

* **Multi-Incident Scenario Selector:** A dropdown menu that lets you instantly swap the entire data environment between different viral events (e.g., Corporate Security Leaks vs. Hardware Product Rumors).
* **Interactive Timeline Slider:** Move the scrubber to watch how a specific post spreads network-wide minute-by-minute from `T+0` to `T+60`.
* **Dynamic Content Scoreboard:** Tracks total views, active nodes, and sharing speed in real-time, completely synchronized with the active scenario data specs.
* **Custom Social App Nodes:** Built on top of a 2D canvas matching real app styles (X, TikTok, LinkedIn, Reddit) so you can visually isolate where the data is traveling.
* **Top-Level KPI Analytics Grid:** High-visibility structured cards at the top of the sidebar that dynamically capture and display critical tracking metrics (Total Aggregate Views, Peak Velocity, and Primary Rail Share).
* **Node Propagation Spread Timeline:** A high-visibility bar chart explicitly color-matched with your slate design signature (`#647d8b`). Formatted with a clean, vertical **CHANNELS** Y-axis indicator and an X-axis tracking discovery benchmarks.
* **Ingestion Decay Half-Life Curves:** An analytical vector line graph visualizing the mathematical exponential decay trajectories calculated by the Pandas engine. Features explicit path mappings for Scenario A vs. Scenario B alongside an explicit vertical **VELOCITY %** Y-axis metric.
* **Live System Terminal Ticker Log:** An anchored, screen-stabilized scrolling log monitor printing real-time structural routing modifications as timeline milestones execute.
* **One-Click Data Export:** Instantly download the active cascade event dataset to your machine as a clean data file (`.json`).
* **Live System Terminal Ticker:** A scrolling log monitor printing real-time alerts as events unfold, featuring high-contrast amber text for critical milestones.
* **One-Click Data Export:** Instantly download the active cascade event dataset to your machine as a clean data file (`.json`).


---

##  Tech Stack
* **Frontend UI Layer:** Next.js 14+ (App Router Architecture), TypeScript, Tailwind CSS
* **Graph Canvas Engine:** `@xyflow/react` (React Flow)
* **Backend API Layer:** FastAPI (Python)
* **Data Processing Framework:** Pandas

---

##  Getting Started

This application operates using a decoupled Client-Server architecture. You will need to spin up both the Python backend and the Next.js frontend in separate terminal windows.

###  1. Setup Backend API (Python & Pandas)
Navigate to your backend directory, install the required libraries, and boot your server instance:
```bash
# Install Python dependencies
pip install fastapi uvicorn pandas

# Start the local API server
uvicorn main:app --reload
```
### 2.Start the application
```bash
npm run dev
```
### 2. Setup Frontend Workspace (Next.js & React Flow)
Open a separate terminal window, change into your frontend workspace folder, and run:
#### Install Node modules
```bash
npm install
```

#### Run the development compilation engine
```bash
npm run dev
```
### 3. Access the Dashboard
Open your web browser and navigate to:

http://localhost:3000

### Repository Structure Checklist
Ensure your branch includes the following required verification artifacts prior to push:

* Live Frontend Interface (app/page.tsx)

* High-Performance Data Backend (main.py)

* VAR_REPORT.md (Gate 1 — Visualization Audit Review PASS)

* UAT_CHECKLIST.md (Gate 2 — User Acceptance Testing sign-off)

* Architecture_Summary.md (Documented system decoupled data flows)

* README.md (This file)


