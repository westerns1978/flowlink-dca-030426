import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KPIGrid } from './components/KPIGrid';
import { RobotTable } from './components/RobotTable';
import { DCAStatus } from './components/DCAStatus';
import { ReportsView } from './components/ReportsView';
import { SiteManagement } from './components/SiteManagement';
import { AlertsCenter } from './components/AlertsCenter';
import { SettingsView } from './components/SettingsView';
import { CricketsChat } from './components/CricketsChat';
import { LiveLogDrawer } from './components/LiveLogDrawer';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { AgentWorkUnits } from './components/AgentWorkUnits';
import { RevenueProjection } from './components/RevenueProjection';
import { SimulationControl } from './components/SimulationControl';
import { EAutomateMirror } from './components/EAutomateMirror';
import { TechView } from './components/TechView';
import { LoginScreen } from './components/LoginScreen';
import { VaultView } from './components/VaultView';
import { TechSpecView } from './components/TechSpecView';
import { FleetDashboard } from './components/FleetDashboard';
import { FileManager } from './components/FileManager';
import { StrategicCommandHub } from './components/StrategicCommandHub';
import { DocumentationView } from './components/DocumentationView';
import { AgentSimulator, AgentEvent } from './utils/agentSimulator';
import { MOCK_DEVICES } from './constants';
import { DeviceData, DeviceStatus, RobotDevice, CopierDevice } from './types';
import { useGemyndData } from './hooks/useGemyndData';
import { useFleet, useDashboardStats } from './hooks/useDCAData';
import { billingApi } from './services/billingApiService';
import { API_CONFIG } from './config/api';
import { usePersistentSession } from './hooks/usePersistentSession';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated, login: sessionLogin, saveView, getSavedView } = usePersistentSession();
  const { data: fleetData, loading: fleetLoading, refresh: refreshFleet } = useFleet(isAuthenticated);
  const { stats: liveStats, loading: statsLoading } = useDashboardStats(isAuthenticated);

  const [currentView, setCurrentView] = useState(() => getSavedView());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode for demo
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<AgentEvent[]>([]);
  const [simulatedDevices, setSimulatedDevices] = useState<DeviceData[] | null>(null);
  const simulatorRef = useRef<AgentSimulator | null>(null);

  const { systemStatus, isKatieReady } = useGemyndData();

  const handleSetActiveView = (view: string) => {
    setCurrentView(view);
    saveView(view);
  };

  useEffect(() => {
    const handleNav = (e: any) => handleSetActiveView(e.detail);
    const handleToggleTerminal = () => setIsLogDrawerOpen(prev => !prev);
    
    window.addEventListener('navigate-view', handleNav);
    window.addEventListener('toggle-terminal', handleToggleTerminal);
    
    return () => {
        window.removeEventListener('navigate-view', handleNav);
        window.removeEventListener('toggle-terminal', handleToggleTerminal);
    };
  }, []);

  const devices: DeviceData[] = useMemo(() => {
    if (fleetData && fleetData.length > 0) {
      return (fleetData as any[]).map(d => {
        const rawType = (d.device_type || 'COPIER').toUpperCase();
        
        // Determine base type category for backwards compatibility
        const isRobot = rawType === 'ROBOT' || rawType === 'AMR';
        
        // Default model based on device type
        const defaultModel = isRobot ? 'Autonomous Mobile Robot' 
          : rawType === 'SCANNER' ? 'Epson DS-780N'
          : 'Konica Minolta C458';

        // Extract latest telemetry from Supabase nested array
        const telemetryArray = d.device_telemetry || [];
        const latestTelemetry = telemetryArray.length > 0 
            ? telemetryArray.sort((a: any, b: any) => 
                new Date(b.recorded_at || 0).getTime() - new Date(a.recorded_at || 0).getTime()
              )[0]
            : null;

        // Parse billing snapshot
        let billingSnapshot = latestTelemetry?.billing_snapshot || d.last_billing_snapshot || null;
        if (typeof billingSnapshot === 'string') {
            try { billingSnapshot = JSON.parse(billingSnapshot); } catch(e) { billingSnapshot = null; }
        }

        return {
          id: d.id,
          serialNumber: d.serial_number || 'UNKNOWN',
          serial_number: d.serial_number,
          model: d.model_name || d.model || defaultModel,
          ipAddress: d.ip_address || '10.0.0.1',
          customer: d.customer_name || d.customer || 'PDS Account',
          location: d.location || 'Lexington',
          erpAssetId: d.erp_asset_id || `AST-${String(d.id).slice(-4)}`,
          lastSync: d.last_seen || 'Live',
          status: (d.status || d.latest_telemetry?.status || 'ONLINE').toUpperCase() as DeviceStatus,
          hasFault: d.has_fault || false,
          type: isRobot ? 'ROBOT' : 'COPIER',  // Keep legacy 2-type for components that need it
          device_type: rawType,                // PRESERVE the real type for partition filtering
          billing_api_supported: d.billing_api_supported || false,
          billing_endpoint_url: d.billing_endpoint_url,
          last_billing_snapshot: billingSnapshot,
          firmwareVersion: d.firmware_version || 'v1.0.0',
          kpax_device_id: d.kpax_device_id,
          data_source: d.kpax_device_id ? 'KPAX' : 'SUPABASE',
          latest_telemetry: latestTelemetry,
          batteryLevel: latestTelemetry?.battery_voltage ? Math.min(100, Math.round((latestTelemetry.battery_voltage / 29.4) * 100)) : 0,
          meterRuntimeMinutes: latestTelemetry?.runtime_minutes ?? 0,
          meterDeliveries: latestTelemetry?.task_count ?? 0,
          meterBlackClicks: latestTelemetry?.meter_black ?? 0,
          meterColorClicks: latestTelemetry?.meter_color ?? 0,
          odometerMeters: latestTelemetry?.distance_meters ?? 0,
        } as any;
      }) as DeviceData[];
    }
    return simulatedDevices || MOCK_DEVICES;
  }, [fleetData, simulatedDevices]);

  const displayStats = useMemo(() => {
    if (liveStats) return liveStats;
    return { 
      activeFleet: devices.length, 
      offlineCount: devices.filter(d => d.status === DeviceStatus.OFFLINE).length, 
      pendingBilling: 24500, 
      criticalAlerts: 0,
      efficiency: "52.4",
      accruedRevenue: 24500
    };
  }, [liveStats, devices]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(async () => {
      if (!simulatedDevices) {
          const results = await billingApi.pollAllBillingDevices();
          if (results.length > 0) {
              refreshFleet();
          }
      }
    }, API_CONFIG.billing?.pollIntervalMs || 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, simulatedDevices, refreshFleet]);

  useEffect(() => {
    simulatorRef.current = new AgentSimulator(MOCK_DEVICES); 
    const unsubscribe = simulatorRef.current.subscribe((event, updatedFleet) => {
        setSimulatedDevices(updatedFleet);
        setLogs(prev => [...prev.slice(-99), event]);
    });
    if (isAuthenticated) simulatorRef.current.start();
    return () => simulatorRef.current?.stop();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <LoginScreen onLogin={(u) => sessionLogin(u)} />;

  const renderView = () => {
      switch(currentView) {
          case 'dashboard':
              return (
                <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueProjection />
                <AgentWorkUnits />
              </div>
              <StrategicCommandHub stats={liveStats} />
              <KPIGrid stats={displayStats} />
              <DashboardAnalytics />
              <RobotTable initialDevices={devices} loading={fleetLoading} />
                </>
              );
          case 'live_fleet':
              return <FleetDashboard />;
          case 'devices':
              return <RobotTable initialDevices={devices} loading={fleetLoading} />;
          case 'vault':
              return <VaultView />;
          case 'storage':
              return <FileManager bucketName="cricket-telemetry" appName="FlowLink" />;
          case 'tech_spec':
              return <TechSpecView />;
          case 'docs':
              return <DocumentationView />;
          case 'simulation':
              return <SimulationControl simulator={simulatorRef.current} />;
          case 'sites':
              return <SiteManagement />;
          case 'alerts':
              return <AlertsCenter />;
          case 'reports':
              return <ReportsView />;
          case 'dcas':
              return <DCAStatus />;
          case 'erp_mirror':
              return <EAutomateMirror devices={devices} />;
          case 'tech_mode':
              return <TechView />;
          case 'settings':
              return <SettingsView />;
          default:
              return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Protocol Null: {currentView}</div>;
      }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden relative">
      <Sidebar activeView={currentView} setView={handleSetActiveView} isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header 
            onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            onTerminalClick={() => setIsLogDrawerOpen(!isLogDrawerOpen)}
            isTerminalOpen={isLogDrawerOpen}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            systemStatus={systemStatus}
            erpConnected={isKatieReady}
        />
        <main className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6 flex flex-col pb-40">
            <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-white/5 rounded-xl p-3 mb-6 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-3 text-[9px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    {statsLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={10} className="animate-spin" /> Node Sync...
                      </span>
                    ) : "FlowLink :: Lexington Node Stable"}
                </div>
                <div className="hidden sm:block text-[9px] font-mono text-slate-500">V2.7.0-PROD</div>
            </div>
            {renderView()}
           <div className="mt-auto pt-10 text-center text-[9px] text-slate-500 font-mono tracking-tighter opacity-50">
             LEXINGTON_NODE_STABLE | SUPABASE_DIRECT_QUERY | AGENT_CRICKET_ACTIVE
           </div>
        </main>
      </div>
      <LiveLogDrawer isOpen={isLogDrawerOpen} onClose={() => setIsLogDrawerOpen(false)} logs={logs} />
      <CricketsChat />
    </div>
  );
};

export default App;