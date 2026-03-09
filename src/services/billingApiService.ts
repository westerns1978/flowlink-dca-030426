
import { BillingSnapshot, BillingDelta, BaseDeviceData } from '../types';
import { supabase } from './realtimeApi';

export interface BillingPollResult {
  success: boolean;
  device_id: string;
  snapshot?: BillingSnapshot;
  delta?: BillingDelta;
  error?: string;
}

class BillingApiService {
  private snapshots: Map<string, BillingSnapshot> = new Map();

  normalizeSnapshot(raw: any): BillingSnapshot {
    const snapshot: BillingSnapshot = { ...raw };
    
    // Normalize Distance: ft -> m (divide by 3.28084)
    if (raw.distance_units === 'ft') {
      snapshot.distance_traveled = raw.distance_traveled / 3.28084;
      snapshot.distance_units = 'm';
    }

    // Normalize Time: hours -> internal hours (RWU engine expects hours)
    if (raw.time_operating_units === 's') {
      snapshot.time_operating = raw.time_operating / 3600;
      snapshot.time_operating_units = 'hours';
    }

    return snapshot;
  }

  calculateDelta(prev: BillingSnapshot | null, current: BillingSnapshot): BillingDelta {
    // If no previous or epoch changed, can't calculate meaningful delta
    if (!prev || prev.counter_epoch !== current.counter_epoch) {
      return {
        amr_id: current.amr_id,
        period_start: prev?.generated_at || current.counters_since || current.generated_at,
        period_end: current.generated_at,
        distance_delta_m: 0,
        tasks_delta: 0,
        time_delta_hours: 0,
        energy_delta_wh: 0,
        epoch_changed: !prev || prev.counter_epoch !== current.counter_epoch
      };
    }
    
    // Normalize both to SI units then calculate delta
    const prevDistanceM = prev.distance_units === 'ft' ? prev.distance_traveled / 3.28084 : prev.distance_traveled;
    const currDistanceM = current.distance_units === 'ft' ? current.distance_traveled / 3.28084 : current.distance_traveled;
    
    const prevTimeHours = prev.time_operating_units === 'hours' ? prev.time_operating : prev.time_operating / 3600;
    const currTimeHours = current.time_operating_units === 'hours' ? current.time_operating : current.time_operating / 3600;
    
    const prevEnergyWh = prev.energy_units === 'J' ? prev.energy_used / 3600 : prev.energy_used;
    const currEnergyWh = current.energy_units === 'J' ? current.energy_used / 3600 : current.energy_used;
    
    return {
      amr_id: current.amr_id,
      period_start: prev.generated_at,
      period_end: current.generated_at,
      distance_delta_m: currDistanceM - prevDistanceM,
      tasks_delta: current.tasks_completed - prev.tasks_completed,
      time_delta_hours: currTimeHours - prevTimeHours,
      energy_delta_wh: currEnergyWh - prevEnergyWh,
      epoch_changed: false
    };
  }

  async pollAndPersistBilling(device: BaseDeviceData): Promise<BillingPollResult> {
    try {
      if (!device.billing_endpoint_url) return { success: false, device_id: device.id, error: "No endpoint URL" };

      // 1. Fetch from AMR endpoint
      const url = `${device.billing_endpoint_url}/billing/v1/usage`;
      const response = await fetch(url, { 
        headers: { 
          'Cache-Control': 'no-store',
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        return { success: false, device_id: device.id, error: `HTTP ${response.status}` };
      }
      
      const raw = await response.json();
      const snapshot = this.normalizeSnapshot(raw);
      
      // 2. Get previous snapshot from device state
      const prevSnapshot = device.last_billing_snapshot || null;
      
      // 3. Calculate delta
      const delta = this.calculateDelta(prevSnapshot, snapshot);
      
      // 4. Normalize units and insert telemetry record
      const telemetryRecord = {
        device_id: device.id,
        task_count: snapshot.tasks_completed,
        distance_meters: snapshot.distance_units === 'ft' 
          ? snapshot.distance_traveled / 3.28084 
          : snapshot.distance_traveled,
        runtime_minutes: snapshot.time_operating_units === 'hours'
          ? snapshot.time_operating * 60
          : snapshot.time_operating / 60,
        energy_wh: snapshot.energy_units === 'J'
          ? snapshot.energy_used / 3600
          : snapshot.energy_used,
        counter_epoch: snapshot.counter_epoch,
        billing_snapshot: snapshot,
        recorded_at: new Date().toISOString()
      };
      
      const { error: telError } = await supabase.from('device_telemetry').insert(telemetryRecord);
      if (telError) console.error("[BillingAPI] Telemetry insert failed:", telError);
      
      // 5. Update device with latest snapshot
      const { error: devError } = await supabase
        .from('devices')
        .update({ 
          last_billing_snapshot: snapshot,
          last_seen: new Date().toISOString()
        })
        .eq('id', device.id);
      
      if (devError) console.error("[BillingAPI] Device update failed:", devError);
      
      return { success: true, device_id: device.id, snapshot, delta };
    } catch (e) {
      console.error(`[BillingAPI] Poll failed for ${device.id}:`, e);
      return { success: false, device_id: device.id, error: e instanceof Error ? e.message : 'Unknown' };
    }
  }

  async pollAllBillingDevices(): Promise<BillingPollResult[]> {
    try {
      // Get all billing-enabled devices
      const { data: devices, error } = await supabase
        .from('devices')
        .select('*')
        .eq('billing_api_supported', true)
        .not('billing_endpoint_url', 'is', null);
      
      if (error || !devices) return [];
      
      // Poll each device
      const results = await Promise.allSettled(
        devices.map(device => this.pollAndPersistBilling(device as any))
      );
      
      return results
        .filter((r): r is PromiseFulfilledResult<BillingPollResult> => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (e) {
      console.error("[BillingAPI] Bulk poll failed:", e);
      return [];
    }
  }
}

export const billingApi = new BillingApiService();
