import API_CONFIG from '../config/api';

// Types based on backend responses
export interface BackendFleetDevice {
  id: string;
  type: string; // 'robot' | 'copier'
  model: string;
  status: string;
  location: string;
  battery?: number;
  toner?: number;
  // Optional extended fields if backend provides them later
  ip?: string;
  customer?: string;
}

export interface FleetResponse {
  total_devices: number;
  devices: BackendFleetDevice[];
}

export interface RevenueResponse {
  current_monthly: number;
  growth_percentage: number;
  projected_annual: number;
  last_updated?: string;
  // Optional breakdown if available
  breakdown?: {
    robot_revenue: number;
    copier_revenue: number;
    opportunity_pipeline: number;
  };
}

export interface ActivityItem {
  id: number | string;
  timestamp: string;
  title: string;
  description: string;
  billing?: string;
  status: string;
  icon?: string;
}

export interface ActivityFeedResponse {
  activities: ActivityItem[];
}

export interface OpportunityItem {
  id?: string;
  type: 'RISK' | 'UPSELL' | 'MAINTENANCE' | 'OPPORTUNITY' | string;
  impact: string;
  description: string;
  recommendation?: string;
  priority?: number;
  title?: string; // Frontend expects title
  metric?: string; // Frontend expects metric
  customer?: string; // Frontend expects customer
  deviceType?: string; // Frontend expects deviceType
  actionLabel?: string; // Frontend expects actionLabel
}

class DCAApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private async fetchJson<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Get service info
  async getServiceInfo() {
    return this.fetchJson<{
      service: string;
      version: string;
      status: string;
      mcp_endpoint: string;
    }>(API_CONFIG.endpoints.root);
  }

  // Get health status
  async getHealth() {
    return this.fetchJson(API_CONFIG.endpoints.health);
  }

  // Get fleet data
  async getFleet(): Promise<FleetResponse> {
    return this.fetchJson<FleetResponse>(API_CONFIG.endpoints.fleet);
  }

  // Get revenue projection
  async getRevenueProjection(): Promise<RevenueResponse> {
    return this.fetchJson<RevenueResponse>(API_CONFIG.endpoints.revenue);
  }

  // Get activity feed
  async getActivityFeed(): Promise<ActivityFeedResponse> {
    return this.fetchJson<ActivityFeedResponse>(API_CONFIG.endpoints.activity);
  }

  // Get AI opportunities
  async getOpportunities(): Promise<OpportunityItem[]> {
    return this.fetchJson<OpportunityItem[]>(API_CONFIG.endpoints.opportunities);
  }

  // MCP JSON-RPC call
  async callMCP(method: string, params: any = {}) {
    const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.mcp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`MCP Error: ${response.status}`);
    }
    
    return response.json();
  }
}

export const dcaApi = new DCAApiService();
export default dcaApi;
