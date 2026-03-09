
# 🦗 Crickets Continuum: Dealer Control Agent (DCA)
### *Official Product Documentation & User Guide (v2.5)*

---

## 📝 **1. Executive Summary: "The Robot-as-a-Copier" Strategy**

The **Crickets Dealer Control Agent (DCA)** is the industry's first "Translation Layer" between **Autonomous Mobile Robots (AMRs)** and **Legacy Office Equipment ERPs** (e.g., E-automate, Forza).

As dealers pivot from "Selling Boxes" (Copiers) to "Selling Outcomes" (Robotics), they face a data gap: Robots speak complex telemetry (JSON, LiDAR, Voltage), but billing systems only speak "Meter Reads."

The DCA closes this gap by making the robot **look and bill exactly like a copier**:
1.  **Virtual MIB (SNMP):** The DCA simulates a printer on the network (Port 161). Legacy tools like FMAudit/PrintFleet can "scan" it and pull meter reads without custom integration.
2.  **Service Code Translation:** Robot errors (e.g., "LiDAR Obstructed") are translated into standard **Copier Service Codes** (e.g., "SC-550") so dispatchers know who to send.
3.  **Universal Billing:** Converts robot activity into standard billing units: **Runtime (CPTT)**, **Tasks (CPT)**, and **Distance (CPLF)**.

**Core Philosophy:** "It’s just like a copier. It just moves."

---

## 🚀 **2. New Features (v2.5) - The "Wow" Factors**

### **🌍 Twin Mode (Multi-Window Sync)**
*   **Technology:** Uses the `BroadcastChannel` API to sync state across browser tabs/windows without a backend.
*   **Demo:** Open the app in two windows. Use the **Fleet Simulator** in one window to "Simulate Work Day". Watch the other window update instantly.

### **📥 Real Data Injection (CSV)**
*   **Feature:** Drag-and-drop your actual fleet list to populate the dashboard.
*   **Persistence:** Data is saved to `localStorage`, so your custom fleet remains even after refreshing the page.
*   **Reset:** Clear data via **Settings > Simulation Data > Clear Fleet Data**.

### **🗺️ Interactive Mapping**
*   **Technology:** Leaflet.js / OpenStreetMap.
*   **Feature:** Dynamic visualization of fleet density and status. No API key required.

---

## 💻 **3. Developer SDK & Simulation**

### **A. CSV Import Format**
To test the "Real Data" ingestion, create a `.csv` file with the following headers:

```csv
serial,customer,type,location,ip,runtime,tasks,odometer
ROBO-9901,Acme HQ,ROBOT,Lobby,192.168.1.55,1200,45,15000
ROBO-9902,Acme HQ,ROBOT,Cafeteria,192.168.1.56,3400,112,42000
KM-C458-X,Acme HQ,COPIER,Mailroom,192.168.1.10,50000,12000,62000
```

### **B. Chaos Engineering**
Located in the **Fleet Simulator** view:
*   **Minor Outage:** Randomly fails 20% of the fleet (Simulates network jitter).
*   **Major Outage:** Randomly fails 50% of the fleet (Simulates server crash).
*   **Restabilize:** Forces all units back to `ONLINE` status.

---

## 📱 **4. User Guide & Interface Walkthrough**

### **A. 📊 The Dashboard (Command Center)**
The landing page provides an immediate health check of the robotics business.
*   **Active Fleet:** Total deployed units. Green badge indicates **100% Uptime**.
*   **Pending Billing:** Real-time revenue estimator based on current month's Cost-Per-Task (CPT) and Cost-Per-Time (CPTT) activity.
*   **System Alerts:** Highlights critical issues (e.g., "Battery Health < 70%").

### **B. 🤖 Device List (The "Translation Table")**
*The most critical view for the Billing Department.*
*   **Meter 1 (Black / Runtime):** Tracks total minutes of operation. Used for hourly billing contracts.
*   **Meter 2 (Color / Tasks):** Tracks discrete tasks completed. Used for outcome-based billing.
*   **Odometer:** Tracks cumulative distance in meters. Used for lease overage calculations (Cost-Per-Linear-Foot).
*   **Export:** Download the current view as a `.csv` for ERP import.

### **C. 🏢 Site Management**
Manage customer deployments and technical environments.
*   **Map View:** Toggle between List and Map views to see geographic distribution.
*   **Technical Audit:** View Wi-Fi SSID strength and Firewall pass/fail status per site.

### **D. 🧠 "Cricket" AI Assistant**
Located in the bottom-right corner.
*   **Voice Mode:** Tap the mic to ask, *"Compare RaaS vs. SaaS profitability for a fleet of 5 robots."*
*   **File Analysis:** Upload CSV fleet logs for anomaly detection.

---

## ⚙️ **5. Billing Logic Definitions**

The DCA supports three industry-standard billing models:

| Model | ERP Mapping | Logic | Best For |
| :--- | :--- | :--- | :--- |
| **Cost-Per-Time (CPTT)** | Meter 1 (Black) | `Runtime Minutes / 60 * Hourly Rate` | Security, Patrol, Hospitality |
| **Cost-Per-Task (CPT)** | Meter 2 (Color) | `Task Count * Per Task Rate` | Deliveries, Lab Samples, Room Service |
| **Cost-Per-Linear-Foot** | Odometer | `Meters Traveled * 3.28 * Foot Rate` | Cleaning (Scrubbers), Warehousing |

---

*© 2025 Crickets Continuum. All Rights Reserved.*
