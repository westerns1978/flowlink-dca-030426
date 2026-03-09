
import { DeviceData, DeviceStatus, DCAData, SiteData, AlertData, SettingsData, StrategicInsight, WeeklyData, AllocationData } from './types';

export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; 

// --- PLATFORM CONFIG ---
export const BACKEND_URL = "https://ldzzlndsspkyohvzfiiu.supabase.co/functions/v1/mcp-orchestrator";

export const ORCHESTRATOR_CONFIG = {
  URL: BACKEND_URL,
  WS_URL: "wss://ldzzlndsspkyohvzfiiu.supabase.co/functions/v1/mcp-orchestrator"
};

export const FLOWHUB_MCP_CONFIG = {
  API_URL: BACKEND_URL,
  ENABLED: true
};

export const DEMO_ORG_NAME = "Regional Dealer Network";

export const MOCK_DEVICES: DeviceData[] = [
  // --- QUASI C2 (twAIn BILLING API) ---
  {
    id: 'c2-34534',
    type: 'ROBOT',
    serialNumber: 'C2-00034534',
    model: 'Quasi C2 Cart',
    ipAddress: '10.0.4.55',
    customer: 'City Bistro',
    location: 'Warehouse B',
    erpAssetId: 'AST-Q34534',
    odometerMeters: 217700,
    meterRuntimeMinutes: 74646, // ~1244 hrs
    meterDeliveries: 2348, 
    batteryLevel: 92,
    lastSync: 'Live',
    status: DeviceStatus.ONLINE,
    hasFault: false,
    cpuLoad: 12,
    temperature: 38,
    firmwareVersion: 'v3.1.2-twain',
    motorState: 'Idle',
    rwuAccrued: 60252.60,
    trueCostOfService: 125.0,
    billing_api_supported: true,
    billing_endpoint_url: 'http://10.0.4.55:8080/billing/v1/usage',
    last_billing_snapshot: {
        schema_version: "billing_usage_v1",
        amr_id: "c2-34534",
        amr_name: "C2-00034534",
        generated_at: new Date().toISOString(),
        distance_traveled: 714422, // ft
        distance_units: 'ft',
        tasks_completed: 2348,
        time_operating: 1244.1,
        time_operating_units: 'hours',
        energy_used: 13900, // Wh
        energy_units: 'Wh',
        counter_epoch: 4,
        firmware_version: 'v3.1.2-twain'
    }
  },
  {
    id: 'c2-34535',
    type: 'ROBOT',
    serialNumber: 'C2-00034535',
    model: 'Quasi C2 Cart',
    ipAddress: '10.0.4.56',
    customer: 'City Bistro',
    location: 'Warehouse B',
    erpAssetId: 'AST-Q34535',
    odometerMeters: 159500,
    meterRuntimeMinutes: 59238, // ~987 hrs
    meterDeliveries: 1876, 
    batteryLevel: 85,
    lastSync: 'Live',
    status: DeviceStatus.ONLINE,
    hasFault: false,
    cpuLoad: 22,
    temperature: 41,
    firmwareVersion: 'v3.1.2-twain',
    motorState: 'Driving',
    rwuAccrued: 45654.90,
    trueCostOfService: 125.0,
    billing_api_supported: true,
    billing_endpoint_url: 'http://10.0.4.56:8080/billing/v1/usage',
    last_billing_snapshot: {
        schema_version: "billing_usage_v1",
        amr_id: "c2-34535",
        amr_name: "C2-00034535",
        generated_at: new Date().toISOString(),
        distance_traveled: 523108, // ft
        distance_units: 'ft',
        tasks_completed: 1876,
        time_operating: 987.3,
        time_operating_units: 'hours',
        energy_used: 10200, // Wh
        energy_units: 'Wh',
        counter_epoch: 2,
        firmware_version: 'v3.1.2-twain'
    }
  },
  // --- CRICKET R1 (LEGACY BUS) ---
  {
    id: 'cr1-1001',
    type: 'ROBOT',
    serialNumber: 'CR1-00001001',
    model: 'Cricket R1',
    ipAddress: '192.168.1.50',
    customer: 'Acme Corp',
    location: 'Warehouse A',
    erpAssetId: 'AST-CR1001',
    odometerMeters: 45000,
    meterRuntimeMinutes: 10402,
    meterDeliveries: 994, 
    batteryLevel: 92,
    lastSync: '2025-02-14',
    status: DeviceStatus.ONLINE,
    hasFault: false,
    cpuLoad: 24,
    temperature: 42,
    firmwareVersion: 'v2.4.1',
    motorState: 'Driving',
    rwuAccrued: 450.5,
    trueCostOfService: 125.0,
    billing_api_supported: false
  },
  // --- COPIER ASSETS ---
  {
    id: 'km-101',
    type: 'COPIER',
    serial_number: 'KM-C458-9921',
    serialNumber: 'KM-C458-9921',
    model: 'Konica Minolta C458',
    ipAddress: '192.168.1.10',
    customer: 'Acme Corp',
    location: 'Finance Office',
    erpAssetId: 'AST-1001',
    meterTotalClicks: 154200,
    meterBlackClicks: 120000,
    meterColorClicks: 34200,
    tonerLevels: { c: 80, m: 45, y: 90, k: 15 },
    lastSync: '2025-02-14',
    status: DeviceStatus.ONLINE,
    hasFault: false,
    firmwareVersion: 'G00-K4',
    billing_api_supported: false
  }
];

export const PUBLIC_POCS = [
  { name: "Katun Robot Repair Initiative", status: "Active POC" },
  { name: "Grand Island Schools", status: "Production" },
  { name: "Palo Verde Generating Station", status: "Production" }
];

export const MOCK_INSIGHTS: StrategicInsight[] = [
  {
    id: 'ins-001',
    type: 'OPPORTUNITY',
    title: 'RWU Overage Detected',
    description: 'City Bistro has exceeded their Task Volume cap by 15%. Contract allows for spot billing on the BellaBot.',
    impact: 'Revenue: +$840',
    metric: 'Tasks: 1,247 (Cap: 1k)',
    customer: 'City Bistro',
    deviceType: 'ROBOT',
    actionLabel: 'Generate Invoice'
  }
];

export const MOCK_DCAS: DCAData[] = [
  { id: 'dca-001', siteName: 'Acme Corp (HQ)', version: '2.1.0', status: 'Active', lastCheckIn: '2s ago', ipAddress: '192.168.1.200' }
];

export const MOCK_SITES: SiteData[] = [
  { id: 'site-001', name: 'Northside Hospital', address: 'Atlanta, GA', contactName: 'Sarah Connor', contactEmail: 's.connor@dealer-network.org', robotCount: 8, wifiSSID: 'Dealer-Guest-IoT', firewallStatus: 'Pass' }
];

export const MOCK_ALERTS: AlertData[] = [
  { id: 'alert-001', type: 'Hardware', severity: 'Critical', message: 'LIDAR Obstructed [SC-550] - Navigation Failed', timestamp: '10 min ago', status: 'Active', device: 'QUASI-S2-002' }
];

export const DEFAULT_SETTINGS: SettingsData = {
  dealerName: DEMO_ORG_NAME,
  adminEmail: "admin@dealer-network.com",
  erpEndpoint: "https://api.e-automate.com/v1/sync",
  pollingInterval: 300,
  notifications: { email: true, sms: false, webhook: true }
};

export const WEEKLY_DISTANCE_DATA: WeeklyData[] = [
  { day: 'Mon', value: 3400 },
  { day: 'Tue', value: 16400 },
  { day: 'Wed', value: 13200 },
  { day: 'Thu', value: 9800 },
  { day: 'Fri', value: 15800 },
  { day: 'Sat', value: 11000 },
  { day: 'Sun', value: 5000 },
];

export const TIME_ALLOCATION_DATA: AllocationData[] = [
  { label: 'Working (Billable)', percentage: 43, color: '#0ea5e9' },
  { label: 'Charging (Cost)', percentage: 36, color: '#10b981' },
  { label: 'Offline', percentage: 21, color: '#94a3b8' },
];
