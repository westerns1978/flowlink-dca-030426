
import { getFleetDevices } from './api';

export interface BackendFleetDevice {
  id: string;
  type: string; 
  model: string;
  status: string;
  location: string;
  battery?: number;
  toner?: number;
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

export interface OpportunityItem {
  id: string;
  type: any;
  impact: string;
  description: string;
  title: string;
  metric?: string;
  customer: string;
  deviceType: any;
  actionLabel?: string;
}

class DCAApiService {
  async getFleet(): Promise<FleetResponse> {
    const allDevices = await getFleetDevices();
    
    // Map to the format expected by useFleet hook
    const mapped = allDevices.map(d => ({
      id: d.id,
      type: d.device_type?.toLowerCase() || 'copier',
      model: d.model_name || d.model || 'MFP',
      status: d.latest_telemetry?.status?.toLowerCase() || 'online',
      location: d.location || 'Unknown',
      customer: d.customer_name || d.customer || 'PDS Account',
      serial: d.serial_number || d.serial || 'UNKNOWN'
    }))

    return {
      total_devices: mapped.length,
      devices: mapped as any
    }
  }

  async getRevenueProjection(): Promise<RevenueResponse> {
    return {
      current_monthly: 24500,
      growth_percentage: 12.5,
      projected_annual: 294000,
      last_updated: new Date().toISOString()
    }
  }

  async getOpportunities(): Promise<OpportunityItem[]> {
    return []
  }

  async getActivityFeed(): Promise<{ activities: ActivityItem[] }> {
    return { activities: [] }
  }
}

export const dcaApi = new DCAApiService();
export default dcaApi;
