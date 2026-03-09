
# 🚀 Crickets Continuum C2: Technical Platform Manifest
**Project Code:** Solaris-Lexington-DCA  
**Version:** 2.6.0-STABLE  
**Environment:** Production Node (US-West Lexington)  
**Status:** Operational (Supabase + KPAX Cloud + Gemini 3)

---

## 1. Executive Summary: The "Outcome-Based" Pivot
Crickets C2 DCA is the first "Translator Middleware" designed specifically for Office Equipment Dealers. It bridges the gap between high-frequency **Autonomous Mobile Robot (AMRs)** telemetry and legacy **Office Equipment ERPs** (E-automate, Forza, SAP).

**Core Value Prop:** It makes a $40,000 logistics robot look and bill exactly like a Konica Minolta copier. By simulating SNMP "Meter Reads" and mapping technical faults to standard Copier Service Codes (e.g., SC-550), dealers can manage robotics fleets using their existing billing and dispatch personnel.

---

## 2. Technical Stack & Architecture

### A. Frontend Layer (Responsive PWA)
- **Framework:** React 19 (High-Voltage Solaris Specs)
- **State:** Shared Singleton Pattern with Neural Circuit Breaker logic.
- **Intelligence:** Gemini Live API (WebRTC) for voice/visual auditing and Maps Grounding.
- **Mapping:** Leaflet.js with CartoDB Dark Matter tiles.

### B. Reasoning Layer (The "Cricket" Agent)
- **Models:** `gemini-3-flash-preview` (Logic), `gemini-2.5-flash` (Maps Grounding).
- **Orchestration:** Model Context Protocol (MCP) routing via Supabase Edge Functions.

### C. Data Fabric (Hybrid Cloud)
- **Supabase Node:** Primary fleet registry and neural vault storage (PostgreSQL).
- **KPAX Cloud Integration:** RESTful bridge to KPAX managed print services via the `KATIE` agent to pull legacy copier telemetry alongside robot data.
- **ERP Bridge:** Port 9780 secure tunnel for E-automate SQL injection.

---

## 3. Integration Handshake Specification

### Aggregated Fleet Sync
- **Process:** Parallel execution of `get_fleet_status` (Supabase) and `get_devices` (KPAX).
- **Endpoint:** `POST /mcp-orchestrator`
- **Agent Mapping:** `CRICKET` (Internal Fleet) | `KATIE` (KPAX/Engineering Uplink).
- **Deduplication:** Assets are unified by Serial Number across both Supabase and KPAX sources.

### Neural Vault Pipe
- **Input:** Multimodal binary (PDF, JPEG, PNG).
- **Processing:** DNA extraction using Gemini 3 to populate `analyzed_files` schema.
- **Outcome:** Automated asset registration and contract conformance checking.

---
*© 2025 Crickets Continuum Platform. Confidential Technical Documentation.*
