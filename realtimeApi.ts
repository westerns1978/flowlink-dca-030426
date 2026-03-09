
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ldzzlndsspkyohvzfiiu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenpsbmRzc3BreW9odnpmaWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTEzMDUsImV4cCI6MjA3NzI4NzMwNX0.SK2Y7XMzeGQoVMq9KAmEN1vwy7RjtbIXZf6TyNneFnI';
const PDS_ORG_ID = '71077b47-66e8-4fd9-90e7-709773ea6582';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Neural Request Guard: Prevent simultaneous component hammering
let isFetchingFleet = false;
let fleetCache: any[] | null = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 15000; // 15 seconds

export async function getFleetDevices(force = false) {
  const now = Date.now();
  
  if (isFetchingFleet) {
      return fleetCache || [];
  }
  
  if (!force && fleetCache && (now - lastFetchTime < CACHE_EXPIRY)) {
      return fleetCache;
  }

  isFetchingFleet = true;
  try {
    // 1. Fetch Devices with embedded latest telemetry and billing metadata
    const { data: devices, error } = await supabase
      .from('devices')
      .select(`
        *,
        device_telemetry (
          meter_black,
          meter_color,
          meter_total,
          runtime_minutes,
          task_count,
          distance_meters,
          battery_voltage,
          error_code,
          toner_levels,
          status,
          recorded_at,
          energy_wh,
          counter_epoch
        )
      `)
      .eq('org_id', PDS_ORG_ID)
      .order('device_type', { ascending: true });

    if (error) throw error;

    // Map the response to flatten the latest telemetry for the UI
    const processed = (devices || []).map(d => {
      // Get the single latest telemetry record
      const telemetryArray = d.device_telemetry || [];
      const latest = telemetryArray.length > 0 ? telemetryArray[0] : null;

      return {
        ...d,
        customer_name: d.customer_name || d.customer || 'Local Asset',
        serial_number: d.serial_number || d.serial || 'UNKNOWN',
        model_name: d.model_name || d.model || 'Generic MFP',
        data_source: d.kpax_device_id ? 'KPAX' : 'SUPABASE',
        billing_api_supported: d.billing_api_supported || false,
        billing_endpoint_url: d.billing_endpoint_url,
        last_billing_snapshot: d.last_billing_snapshot,
        latest_telemetry: latest ? {
            ...latest,
            battery_level: latest.battery_voltage ? (latest.battery_voltage / 24 * 100) : 100,
            status: (latest.status || d.status || 'ONLINE').toUpperCase()
        } : { status: (d.status || 'ONLINE').toUpperCase() }
      };
    });

    fleetCache = processed;
    lastFetchTime = Date.now();
    return processed;

  } catch (error: any) {
    console.error('❌ Direct Query Failure:', error.message);
    return fleetCache || []; 
  } finally {
    isFetchingFleet = false;
  }
}
