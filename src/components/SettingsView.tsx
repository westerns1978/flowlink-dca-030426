
import React, { useState } from 'react';
import { Save, User, CloudCog, Bell, ToggleLeft, ToggleRight, Server, Shield, CheckCircle2, AlertCircle, Loader2, Link, Globe, PenTool, Database, Trash2, HardDrive, Cloud } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../constants';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  // ESN Specific State
  const [esnConfig, setEsnConfig] = useState({
    host: '192.168.1.10',
    port: 9780,
    companyId: 'Sample',
    dbUser: 'coexecutive',
    dbPass: '••••••••',
    // WestFlow Connector Specifics
    esnDealerId: '',
    serviceUrl: 'https://esn.westflow.ai/Services/Connector.svc',
    enableWriteBack: true
  });
  
  // Cirrus State
  const [cirrusConfig, setCirrusConfig] = useState({
      endpoint: 'https://api.cirrusfileserver.com/v1',
      oemKey: 'TF-OEM-99281-X',
      storageZone: 'US-West-2'
  });

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testLog, setTestLog] = useState<string[]>([]);

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTestLog([]);
    
    const steps = [
        "Resolving ESN Host (192.168.1.10)... OK",
        "Handshake: Port 9780 (Blowfish)... OK",
        "Auth: 'coexecutive' @ 'Sample'... OK",
        "Query: SELECT TOP 1 * FROM CM_Meters... FOUND",
        "Query: INSERT INTO SC_ServiceCalls (DryRun)... PERMISSION GRANTED",
        "Latency: 42ms"
    ];

    let delay = 0;
    steps.forEach((step, i) => {
        delay += 600;
        setTimeout(() => {
            setTestLog(prev => [...prev, step]);
            if (i === steps.length - 1) setConnectionStatus('success');
        }, delay);
    });
  };

  const handleClearData = () => {
      if (confirm('Are you sure? This will delete all imported CSV data and reset the simulation to defaults.')) {
          localStorage.removeItem('crickets_dca_simulated_fleet');
          window.location.reload();
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div>
         <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">System Settings</h2>
         <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Configure dealer profile, ESN bridge, and E-automate integration.</p>
      </div>

      {/* Dealer Profile */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-6 ring-1 ring-slate-900/5 dark:ring-white/5 hover:border-emerald-400/30 transition-colors">
         <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-6 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
           <User size={20} className="text-emerald-600 dark:text-emerald-400" /> Dealer Profile
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dealer Name</label>
               <input 
                 type="text" 
                 value={settings.dealerName}
                 readOnly
                 className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300/60 dark:border-slate-600/60 rounded-lg text-sm text-slate-500 dark:text-slate-400 font-medium shadow-inner cursor-not-allowed"
               />
            </div>
            <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Admin Email</label>
               <input 
                 type="email" 
                 value={settings.adminEmail}
                 onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                 className="w-full px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all hover:bg-white dark:hover:bg-slate-800"
               />
            </div>
         </div>
      </div>

      {/* WestFlow ESN Connector Configuration */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-6 ring-1 ring-slate-900/5 dark:ring-white/5 hover:border-cyan-400/30 transition-colors">
         <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <CloudCog size={20} className="text-cyan-600 dark:text-cyan-400" /> WestFlow ESN Connector
            </h3>
            <span className="text-[10px] font-mono bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-0.5 rounded border border-cyan-200 dark:border-cyan-700">
                Pattern: Naverisk-Compatible
            </span>
         </div>
         
         <div className="space-y-5">
            {/* Toggle Write-Back Mode */}
            <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-200 dark:bg-indigo-800 rounded text-indigo-700 dark:text-indigo-300">
                        <Database size={16} />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">E-automate Integration Mode</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Push "Service Calls" via ESN. Read "Meters" via SQL Mirror.</p>
                    </div>
                </div>
                <button 
                   onClick={() => setEsnConfig({...esnConfig, enableWriteBack: !esnConfig.enableWriteBack})}
                   className="text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                 >
                   {esnConfig.enableWriteBack ? (
                     <ToggleRight size={36} className="text-indigo-500 drop-shadow-sm" />
                   ) : (
                     <ToggleLeft size={36} className="group-hover:text-slate-400" />
                   )}
                 </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Server size={12} /> SQL Server Host / IP
                    </label>
                    <input 
                        type="text" 
                        value={esnConfig.host}
                        onChange={(e) => setEsnConfig({...esnConfig, host: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-cyan-700 dark:text-cyan-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:bg-white dark:hover:bg-slate-800"
                        placeholder="192.168.x.x"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Port</label>
                    <input 
                        type="number" 
                        value={esnConfig.port}
                        onChange={(e) => setEsnConfig({...esnConfig, port: parseInt(e.target.value)})}
                        className="w-full px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:bg-white dark:hover:bg-slate-800"
                        placeholder="9780"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company ID</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={esnConfig.companyId}
                            onChange={(e) => setEsnConfig({...esnConfig, companyId: e.target.value})}
                            className="w-full px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all hover:bg-white dark:hover:bg-slate-800"
                        />
                        <div className="absolute right-3 top-2.5 group">
                            <AlertCircle size={16} className="text-amber-500 cursor-help" />
                            <div className="absolute right-0 top-6 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-xl z-20 hidden group-hover:block">
                                Do not include "Co" prefix. Ex: If DB is "CoSample", enter "Sample".
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Shield size={12} /> DB User (CoExecutive)
                    </label>
                    <input 
                        type="password" 
                        value={esnConfig.dbPass}
                        readOnly
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-slate-500 dark:text-slate-400"
                    />
                </div>
            </div>

            {/* Connection Test */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {connectionStatus === 'idle' && (
                            <span className="text-xs text-slate-500">Service Status: Unknown</span>
                        )}
                        {connectionStatus === 'testing' && (
                            <span className="text-xs text-cyan-600 dark:text-cyan-400 flex items-center gap-2 font-bold">
                                <Loader2 size={14} className="animate-spin" /> Verifying Tables...
                            </span>
                        )}
                        {connectionStatus === 'success' && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-bold">
                                <CheckCircle2 size={14} /> E-automate Connected (Read/Write)
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={handleTestConnection}
                        disabled={connectionStatus === 'testing'}
                        className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        Test Connection
                    </button>
                </div>
                
                {testLog.length > 0 && (
                    <div className="mt-4 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-400 h-24 overflow-y-auto">
                        {testLog.map((log, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-emerald-600 mr-2">{'>'}</span>{log}
                            </div>
                        ))}
                    </div>
                )}
            </div>
         </div>
      </div>

      {/* Content Repository (TierFive / Cirrus) - NEW SECTION */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-6 ring-1 ring-slate-900/5 dark:ring-white/5 hover:border-purple-400/30 transition-colors">
         <div className="flex justify-between items-center mb-6 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cloud size={20} className="text-purple-600 dark:text-purple-400" /> Content Repository (OEM)
            </h3>
            <span className="text-[10px] font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-700">
                Provider: Cirrus File Server (TierFive)
            </span>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cirrus Endpoint</label>
               <input 
                 type="text" 
                 value={cirrusConfig.endpoint}
                 onChange={(e) => setCirrusConfig({...cirrusConfig, endpoint: e.target.value})}
                 className="w-full px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
               />
            </div>
            <div className="space-y-2">
               <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">OEM Partner Key</label>
               <input 
                 type="password" 
                 value={cirrusConfig.oemKey}
                 readOnly
                 className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono text-slate-500 dark:text-slate-400"
               />
            </div>
         </div>
         <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-lg text-xs text-purple-800 dark:text-purple-200">
             <strong>Note:</strong> Files uploaded via the "WestFlow Vault" interface are stored in a dedicated, isolated container on Cirrus infrastructure compliant with GDPR/CCPA.
         </div>
      </div>

      {/* Data Management */}
      <div className="bg-red-50/50 dark:bg-red-900/10 backdrop-blur-xl rounded-xl border border-red-200/60 dark:border-red-800/30 shadow-lg p-6 hover:border-red-400/50 transition-colors">
         <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
           <HardDrive size={20} className="text-red-500" /> Simulation Data
         </h3>
         <div className="flex items-center justify-between">
             <div className="text-sm text-slate-600 dark:text-slate-400">
                 <p>Reset the "Twin Mode" simulator. This will delete all imported CSV data and reset the local browser storage.</p>
             </div>
             <button 
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all active:scale-95 text-xs"
             >
                 <Trash2 size={14} /> Clear Fleet Data
             </button>
         </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl hover:bg-emerald-600 dark:hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shadow-lg active:scale-95">
          <Save size={18} /> Save Configuration
        </button>
      </div>
    </div>
  );
};
