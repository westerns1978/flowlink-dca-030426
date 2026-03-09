
import API_CONFIG from '../config/api';
import westflow from './westflow-client';

export interface OrchestratorStatus {
  service: string;
  version: string;
  status: string;
  connected_frontends: number;
  katie_status: string;
  last_error?: string;
}

export interface ServiceItem {
  service_name: string;
  service_type: string;
  status: string;
  url: string;
}

export interface SystemState {
  orchestrator: OrchestratorStatus;
  services: ServiceItem[];
}

class GemyndConnector {
  public isConnected: boolean = false;
  private callbacks: {
    onStatusChange: ((status: string) => void) | null;
    onAlert: ((alert: any) => void) | null;
    onTelemetry: ((data: any) => void) | null;
  } = {
    onStatusChange: null,
    onAlert: null,
    onTelemetry: null
  };

  /**
   * Health Check via the CRICKET Agent
   */
  async getSystemState(): Promise<SystemState | null> {
    try {
      const response = await westflow.call('CRICKET', 'get_fleet_status', {});
      
      if (!response.success) {
          return {
              orchestrator: {
                  service: "WestFlow Platform",
                  version: "v2.5-prod",
                  status: "Degraded",
                  connected_frontends: 0,
                  katie_status: 'error',
                  last_error: response.error
              },
              services: [
                  { service_name: 'Cricket DCA', service_type: 'Fleet', status: 'OFFLINE', url: API_CONFIG.baseUrl }
              ]
          };
      }

      return {
        orchestrator: {
            service: "WestFlow Platform",
            version: "v2.5-production",
            status: "Operational",
            connected_frontends: 1,
            katie_status: 'ready'
        }, 
        services: [
            { service_name: 'Cricket DCA', service_type: 'Fleet', status: 'ONLINE', url: API_CONFIG.baseUrl },
            { service_name: 'Katie AI', service_type: 'Service', status: 'ONLINE', url: API_CONFIG.baseUrl }
        ]
      };
    } catch (error) {
      console.warn("[Platform] Backend heartbeat failed completely.");
      return null;
    }
  }

  connect(
    onStatusChange: (status: string) => void,
    onAlert: (alert: any) => void,
    onTelemetry: (data: any) => void
  ) {
    this.callbacks.onStatusChange = onStatusChange;
    this.callbacks.onAlert = onAlert;
    this.callbacks.onTelemetry = onTelemetry;

    // Trigger initial status
    this.getSystemState().then(state => {
        if (state && state.orchestrator.status === 'Operational') {
            if (this.callbacks.onStatusChange) this.callbacks.onStatusChange("ONLINE");
        } else {
            if (this.callbacks.onStatusChange) this.callbacks.onStatusChange("ERROR");
        }
    });
  }
}

export const gemynd = new GemyndConnector();
