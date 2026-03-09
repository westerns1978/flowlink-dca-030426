
import { DeviceData, DeviceStatus, BillingSnapshot } from '../types';

export type EventType = 'TELEMETRY' | 'BILLING_EVENT' | 'SYSTEM_ALERT' | 'HEARTBEAT' | 'PROVISIONING' | 'BILLING_API_POLL';

export interface AgentEvent {
  id: string;
  timestamp: string;
  robotId: string;
  type: EventType;
  payload: any;
  rawJson: string;
}

type Subscriber = (event: AgentEvent, updatedFleet: DeviceData[]) => void;

const STORAGE_KEY = 'crickets_dca_simulated_fleet';
const BROADCAST_CHANNEL = 'crickets_fleet_channel';

export class AgentSimulator {
  private devices: DeviceData[];
  private intervalId: any = null;
  private subscribers: Subscriber[] = [];
  private isRunning: boolean = false;
  private channel: BroadcastChannel;
  private counterEpochs: Map<string, number> = new Map();

  constructor(initialDevices: DeviceData[]) {
    this.channel = new BroadcastChannel(BROADCAST_CHANNEL);
    const savedFleet = localStorage.getItem(STORAGE_KEY);
    this.devices = savedFleet ? JSON.parse(savedFleet) : JSON.parse(JSON.stringify(initialDevices));

    // Ensure simulated devices have billing api support for demo
    this.devices = this.devices.map(d => ({
        ...d,
        billing_api_supported: d.type === 'ROBOT',
        billing_endpoint_url: d.type === 'ROBOT' ? `http://${d.ipAddress || '192.168.0.10'}:8080` : undefined,
        last_billing_snapshot: d.last_billing_snapshot || (d.type === 'ROBOT' ? this.getMockBillingData(d.id) : undefined)
    }));
  }

  public subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 4000);
  }

  public stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.isRunning = false;
    this.channel.close();
  }

  private saveAndBroadcast() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.devices));
    this.channel.postMessage({ type: 'SYNC_STATE', payload: this.devices });
  }

  /**
   * Generates a twAIn Robotics V1 compliant response for simulation
   */
  public getMockBillingData(amrId: string): BillingSnapshot {
    const device = this.devices.find(d => (d.id === amrId || d.serialNumber === amrId)) as any;
    const epoch = this.counterEpochs.get(amrId) || 1;
    const last = device?.last_billing_snapshot;

    return {
        schema_version: "billing_usage_v1",
        amr_id: amrId,
        amr_name: device?.serialNumber || amrId,
        generated_at: new Date().toISOString(),
        distance_traveled: (last?.distance_traveled || 0) + (Math.random() * 20),
        distance_units: "ft",
        tasks_completed: (last?.tasks_completed || 0) + (Math.random() > 0.7 ? 1 : 0),
        time_operating: (last?.time_operating || 0) + 0.05,
        time_operating_units: "hours",
        energy_used: (last?.energy_used || 0) + (Math.random() * 10),
        energy_units: "Wh",
        counter_epoch: epoch,
        firmware_version: "v3.1.2-twain",
        amr_ip: device?.ipAddress || '10.0.0.10',
        uptime_s: (last?.uptime_s || 0) + 180
    };
  }

  private async tick() {
    let stateChanged = false;
    this.devices = this.devices.map(device => {
      if (device.type === 'ROBOT' && device.status !== DeviceStatus.OFFLINE) {
          if (Math.random() > 0.8) {
             stateChanged = true;
             const newSnapshot = this.getMockBillingData(device.id);
             return { 
                ...device, 
                last_billing_snapshot: newSnapshot,
                meterDeliveries: newSnapshot.tasks_completed,
                odometerMeters: newSnapshot.distance_traveled / 3.28084,
                meterRuntimeMinutes: newSnapshot.time_operating * 60,
                lastSync: newSnapshot.generated_at
             };
          }
      } 
      return device;
    });

    if (stateChanged) {
        this.saveAndBroadcast();
        this.notifySubscribers(this.createEvent('SYSTEM', 'BILLING_API_POLL', { delta: true }));
    }
  }

  public simulateEpochReset(amrId: string) {
    const current = this.counterEpochs.get(amrId) || 1;
    this.counterEpochs.set(amrId, current + 1);
    this.notifySubscribers(this.createEvent(amrId, 'SYSTEM_ALERT', { msg: 'Counter Epoch Incremented' }));
  }

  private notifySubscribers(event: AgentEvent) {
      this.subscribers.forEach(cb => cb(event, this.devices));
  }

  private createEvent(robotId: string, type: EventType, payload: any): AgentEvent {
     const timestamp = new Date().toISOString();
     return {
         id: Math.random().toString(36).substr(2, 9),
         timestamp,
         robotId,
         type,
         payload,
         rawJson: JSON.stringify({ ts: timestamp, did: robotId, type: type, data: payload })
     };
  }

  public addDevice(newDevice: DeviceData) {
      this.devices.push(newDevice);
      this.saveAndBroadcast();
  }

  public resetHealth() {
      this.devices = this.devices.map(d => ({ ...d, status: DeviceStatus.ONLINE, hasFault: false, batteryLevel: 100 }));
      this.saveAndBroadcast();
  }
  
  public simulateWorkDay() {
      this.devices = this.devices.map(d => {
          if (d.type === 'ROBOT') {
              const snap = d.last_billing_snapshot || this.getMockBillingData(d.id);
              const extendedSnap = {
                  ...snap,
                  tasks_completed: snap.tasks_completed + Math.floor(Math.random() * 20),
                  time_operating: snap.time_operating + 8,
                  distance_traveled: snap.distance_traveled + (Math.random() * 5000),
                  energy_used: snap.energy_used + (Math.random() * 2000),
                  generated_at: new Date().toISOString()
              };
              return {
                  ...d,
                  last_billing_snapshot: extendedSnap,
                  meterRuntimeMinutes: extendedSnap.time_operating * 60,
                  meterDeliveries: extendedSnap.tasks_completed,
                  odometerMeters: extendedSnap.distance_traveled / 3.28084,
                  batteryLevel: Math.max(5, d.batteryLevel - 40)
              };
          }
          return d;
      });
      this.saveAndBroadcast();
  }

  public triggerChaos(severity: 'LOW' | 'HIGH') {
      this.devices = this.devices.map(d => {
          if (Math.random() > (severity === 'HIGH' ? 0.5 : 0.8)) {
              return { ...d, status: DeviceStatus.OFFLINE, hasFault: true };
          }
          return d;
      });
      this.saveAndBroadcast();
  }
}
