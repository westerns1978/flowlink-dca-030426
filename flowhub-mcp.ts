
import { FunctionDeclaration, Type } from "@google/genai";
import westflow from './westflow-client';
import { searchServiceLocations } from './mapsService';

/**
 * FLOWHUB MCP CLIENT - Universal Toolset
 * Expanded with "Virtual Hand" capabilities for Hands-Free UI control.
 */

export const flowHubTools: FunctionDeclaration[] = [
  // --- CRICKET (Fleet/Robot) ---
  {
    name: "get_fleet_status",
    description: "CRICKET: Get unified fleet status for all connected robots and MFPs (copiers).",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "dispatch_robot_task",
    description: "CRICKET: Dispatches a physical robot for a specific mission (delivery or filing).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        robot_serial: { type: Type.STRING, description: "The serial number of the robot to dispatch." },
        task_type: { type: Type.STRING, enum: ["delivery", "filing"], description: "The type of task to perform." },
        destination: { type: Type.STRING, description: "The destination location within the facility." }
      },
      required: ["robot_serial", "task_type", "destination"]
    }
  },
  {
    name: "get_pending_billing",
    description: "CRICKET: Calculate current month's accrued CPT/CPTT billing based on robot and MFP activity.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        org_code: { type: Type.STRING, description: "ERP Org code (e.g. PDS-LEX)." }
      },
      required: ["org_code"]
    }
  },
  {
    name: "find_nearby_facilities",
    description: "CRICKET: Uses Google Maps Grounding to find verified service centers, parts hubs, or TWAIN labs near a specific location.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING, description: "The city, state, or address to search near." }
      },
      required: ["location"]
    }
  },

  // --- VIRTUAL HAND TOOLS ---
  {
    name: "navigate_app",
    description: "Navigates the user hands-free to a specific dashboard page.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        view: { type: Type.STRING, description: "dashboard, devices, sites, alerts, reports, settings, vault, erp_mirror, tech_spec" }
      },
      required: ["view"]
    }
  },
  {
    name: "toggle_theme",
    description: "Switches the app between Dark and Light mode visually.",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "open_system_logs",
    description: "Opens the live telemetry log terminal for technical inspection.",
    parameters: { type: Type.OBJECT, properties: {} }
  }
];

class FlowHubClient {
  
  async executeTool(name: string, args: any): Promise<any> {
    console.log(`[Virtual Hand] Executing Tool: ${name}`, args);

    // Handle Local UI
    if (name === "navigate_app") {
        window.dispatchEvent(new CustomEvent('navigate-view', { detail: args.view }));
        return { status: "SUCCESS", message: `Navigated to ${args.view}` };
    }

    if (name === "toggle_theme") {
        const currentIsDark = document.documentElement.classList.contains('dark');
        if (currentIsDark) document.documentElement.classList.remove('dark');
        else document.documentElement.classList.add('dark');
        return { status: "SUCCESS", theme: currentIsDark ? 'light' : 'dark' };
    }

    if (name === "open_system_logs") {
        // Find the terminal button click logic (usually via Header callback or window event)
        window.dispatchEvent(new CustomEvent('toggle-terminal'));
        return { status: "SUCCESS", terminal: "OPENED" };
    }

    // Handle Maps Grounding Tool call
    if (name === "find_nearby_facilities") {
        try {
            const locations = await searchServiceLocations(args.location);
            window.dispatchEvent(new CustomEvent('render-grounding-links', { detail: { locations, location: args.location } }));
            return { status: "SUCCESS", count: locations.length, message: `Discovered ${locations.length} facilities near ${args.location}.` };
        } catch (e) {
            return { error: "Maps Grounding service unavailable" };
        }
    }

    // Remote Agent Routing (Placeholder for real backend integration)
    try {
        const wfRes = await westflow.call('CRICKET', name, args);
        if (wfRes.success) return wfRes.data;
        return { error: wfRes.error || "Tool execution failed on remote agent" };
    } catch (e) {
        return { error: "Network error or orchestrator timeout" };
    }
  }
}

export const flowHub = new FlowHubClient();
