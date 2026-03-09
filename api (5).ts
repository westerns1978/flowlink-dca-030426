
import { getFleetDevices as getSupabaseFleet } from './realtimeApi';
import { getKPAXDevices, mapKPAXDevice } from './kpaxService';

/**
 * Global Fleet Aggregator
 * Merges direct Supabase telemetry with KPAX Global Cloud telemetry.
 */
export async function getFleetDevices(force = false) {
  try {
    console.log('[Aggregator] Negotiating multi-source handshake...');
    
    // Execute both sources in parallel for maximum performance
    const [supabaseData, kpaxRawData] = await Promise.allSettled([
      getSupabaseFleet(force),
      getKPAXDevices(2)
    ]);

    const supabaseResults = supabaseData.status === 'fulfilled' ? supabaseData.value : [];
    const kpaxRawResults = kpaxRawData.status === 'fulfilled' ? kpaxRawData.value : [];
    
    const kpaxMapped = (kpaxRawResults || []).map(mapKPAXDevice);
    
    // De-duplicate by serial number, preferring KPAX data for cloud-enrolled units
    const fleetMap = new Map();
    
    supabaseResults.forEach((d: any) => {
      const sn = d.serial_number || d.serial;
      if (sn) fleetMap.set(sn, { ...d, data_source: d.data_source || 'SUPABASE' });
    });
    
    kpaxMapped.forEach((d: any) => {
      const sn = d.serial_number;
      if (sn) fleetMap.set(sn, d); // KPAX overwrites/adds
    });

    const combined = Array.from(fleetMap.values()).sort((a, b) => {
      const nameA = (a.customer_name || '').toUpperCase();
      const nameB = (b.customer_name || '').toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });

    console.log(`[Aggregator] Sync Complete. Final Node Count: ${combined.length}`);
    return combined;
  } catch (error) {
    console.error('❌ Fleet Aggregation Failure:', error);
    // Graceful fallback to whatever local cache exists
    return getSupabaseFleet(false);
  }
}
