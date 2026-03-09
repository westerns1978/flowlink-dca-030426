
export enum DeviceStatus {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  WARNING = 'Warning'
}

export type DeviceType = 'ROBOT' | 'COPIER';

export interface BaseDeviceData {
  id: string;
  serial_number?: string; // DB field
  serialNumber: string; // Legacy field
  model: string;
  ipAddress: string;
  ip_address?: string; // DB field
  mac_address?: string; // DB field
  customer: string;
  customer_name?: string; // DB field
  location: string;
  erpAssetId: string;
  lastSync: string;
  last_seen?: string; // DB field
  status: DeviceStatus | string;
  hasFault: boolean;
  type: DeviceType;
  org_id?: string;
  // Billing API Fields
  billing_api_supported: boolean;
  billing_endpoint_url?: string;
  last_billing_snapshot?: BillingSnapshot;
  contract_type?: 'CPTT' | 'CPT' | 'CPLF';
}

export interface BillingSnapshot {
  schema_version: string;
  amr_id: string;
  amr_name: string;
  generated_at: string;
  amr_ip?: string;
  amr_mac?: string;
  firmware_version?: string;
  uptime_s?: number;
  counters_since?: string;
  counter_epoch?: number;
  distance_traveled: number;
  distance_units: 'm' | 'ft';
  tasks_completed: number;
  time_operating: number;
  time_operating_units: 's' | 'hours';
  energy_used: number;
  energy_units: 'Wh' | 'J';
  site_id?: string;
}

export interface BillingDelta {
  amr_id: string;
  period_start: string;
  period_end: string;
  distance_delta_m: number;
  tasks_delta: number;
  time_delta_hours: number;
  energy_delta_wh: number;
  epoch_changed: boolean;
}

export interface RobotDevice extends BaseDeviceData {
  type: 'ROBOT';
  odometerMeters: number;
  meterRuntimeMinutes: number;
  meterDeliveries: number;
  batteryLevel: number;
  cpuLoad: number;
  temperature: number;
  firmwareVersion: string;
  motorState: 'Idle' | 'Driving' | 'Stalled';
  rwuAccrued: number;
  trueCostOfService: number;
}

export interface CopierDevice extends BaseDeviceData {
  type: 'COPIER';
  meterTotalClicks: number;
  meterBlackClicks: number;
  meterColorClicks: number;
  tonerLevels: {
    c: number;
    m: number;
    y: number;
    k: number;
  };
  firmwareVersion: string;
}

export type DeviceData = RobotDevice | CopierDevice;

export interface KPIStats {
  activeFleet: number;
  offlineCount: number;
  pendingBilling: number;
  criticalAlerts: number;
  totalRWU?: number;
}

export interface StrategicInsight {
  id: string;
  type: 'OPPORTUNITY' | 'RISK' | 'OPTIMIZATION';
  title: string;
  description: string;
  impact: string;
  metric?: string;
  customer: string;
  deviceType: DeviceType;
  actionLabel?: string;
  autoAction?: boolean;
}

export interface WeeklyData {
  day: string;
  value: number;
}

export interface AllocationData {
  label: string;
  percentage: number;
  color: string;
}

export interface AnalysisItem {
  title: string;
  status: DiagnosticStatus;
  priority?: string;
  description: string;
  reference: string;
  recommendation?: string;
}

export enum DiagnosticStatus {
  OPTIMAL = 'OPTIMAL',
  ISSUE_DETECTED = 'ISSUE_DETECTED',
  WARNING = 'WARNING'
}

export interface AnalysisResult {
  documentTitle: string;
  complianceScore: number;
  summary: string;
  items: AnalysisItem[];
}

export interface RepositoryFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  cloudPath: string;
}

// Added missing interface DCAData used in constants.ts
export interface DCAData {
  id: string;
  siteName: string;
  version: string;
  status: string;
  lastCheckIn: string;
  ipAddress: string;
}

// Added missing interface SiteData used in constants.ts
export interface SiteData {
  id: string;
  name: string;
  address: string;
  contactName: string;
  contactEmail: string;
  robotCount: number;
  wifiSSID: string;
  firewallStatus: string;
}

// Added missing interface AlertData used in constants.ts
export interface AlertData {
  id: string;
  type: string;
  severity: 'Critical' | 'Warning' | 'Info' | string;
  message: string;
  timestamp: string;
  status: 'Active' | 'Resolved' | string;
  device?: string;
}

// Added missing interface SettingsData used in constants.ts
export interface SettingsData {
  dealerName: string;
  adminEmail: string;
  erpEndpoint: string;
  pollingInterval: number;
  notifications: {
    email: boolean;
    sms: boolean;
    webhook: boolean;
  };
}

// Added missing interface VisualSnapshot for use in VisualAuditSession
export interface VisualSnapshot {
  timestamp: string;
  imageUrl: string;
  ocrText?: string;
  detectedObjects?: Array<{ type: string; confidence: number }>;
}

// Added missing interface VisualAuditSession used in reportGenerator.ts
export interface VisualAuditSession {
  snapshots: VisualSnapshot[];
}
