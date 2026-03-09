
import React, { useState, useRef } from 'react';
import { Bot, Plus, Zap, AlertTriangle, RefreshCw, Printer, Box, FastForward, ShieldCheck, UploadCloud, FileSpreadsheet, MonitorSmartphone, Cat, Check } from 'lucide-react';
import { AgentSimulator } from '../utils/agentSimulator';
import { DeviceStatus, DeviceData } from '../types';

interface SimulationControlProps {
  simulator: AgentSimulator | null;
}

export const SimulationControl: React.FC<SimulationControlProps> = ({ simulator }) => {
  const [activeTab, setActiveTab] = useState<'provision' | 'chaos'>('provision');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [ffStatus, setFfStatus] = useState<'idle' | 'triggered'>('idle');
  const [chaosStatus, setChaosStatus] = useState<'idle' | 'triggered'>('idle');
  
  // Provisioning Form State
  const [deviceType, setDeviceType] = useState<'ROBOT' | 'COPIER'>('ROBOT');
  const [robotModel, setRobotModel] = useState<'QUASI' | 'PUDU'>('QUASI');
  const [serial, setSerial] = useState('');
  const [customer, setCustomer] = useState('Acme Corp');
  const [location, setLocation] = useState('Warehouse B');
  const [initialMeter1, setInitialMeter1] = useState(100);
  const [initialMeter2, setInitialMeter2] = useState(0);

  const handleAddDevice = () => {
      if (!simulator) return;

      const id = Math.random().toString(36).substr(2, 9);
      let newSerial = serial;
      let newModel = 'Generic Device';

      if (deviceType === 'ROBOT') {
          if (robotModel === 'QUASI') {
              newSerial = serial || `Q-C2-${Math.floor(Math.random()*9000)+1000}`;
              newModel = 'Quasi C2';
          } else {
              newSerial = serial || `PUDU-BB-${Math.floor(Math.random()*9000)+1000}`;
              newModel = 'Pudu BellaBot';
          }
      } else {
          newSerial = serial || `KM-C${Math.floor(Math.random()*900)+100}`;
          newModel = 'Konica Minolta C458';
      }

      const newDevice: any = {
          id,
          type: deviceType,
          serialNumber: newSerial,
          model: newModel,
          ipAddress: `192.168.1.${Math.floor(Math.random()*254)}`,
          customer: customer,
          location: location,
          erpAssetId: `AST-${Math.floor(Math.random()*9000)+1000}`,
          lastSync: new Date().toLocaleString(),
          status: DeviceStatus.ONLINE,
          hasFault: false,
          // Robot Specifics
          odometerMeters: 0,
          meterRuntimeMinutes: deviceType === 'ROBOT' ? Number(initialMeter1) : 0,
          meterDeliveries: deviceType === 'ROBOT' ? Number(initialMeter2) : 0,
          batteryLevel: 100,
          cpuLoad: 10,
          temperature: 35,
          firmwareVersion: 'v2.5.0-sim',
          motorState: 'Idle',
          // Copier Specifics
          meterTotalClicks: Number(initialMeter1) + Number(initialMeter2),
          meterBlackClicks: deviceType === 'COPIER' ? Number(initialMeter1) : 0,
          meterColorClicks: deviceType === 'COPIER' ? Number(initialMeter2) : 0,
          tonerLevels: { c: 100, m: 100, y: 100, k: 100 }
      };

      simulator.addDevice(newDevice);
      setSerial('');
  };

  const handleSimulateWorkDay = () => {
      setFfStatus('triggered');
      simulator?.simulateWorkDay();
      setTimeout(() => setFfStatus('idle'), 1500);
  };

  const handleChaos = (level: 'LOW' | 'HIGH') => {
      setChaosStatus('triggered');
      simulator?.triggerChaos(level);
      setTimeout(() => setChaosStatus('idle'), 1500);
  };

  const handleReset = () => {
      simulator?.resetHealth();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !simulator) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const csv = event.target?.result as string;
              const lines = csv.split('\n');
              const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
              
              // Basic validation
              if (!headers.includes('serial') && !headers.includes('customer')) {
                  setUploadStatus('Error: CSV must have "serial" and "customer" columns.');
                  return;
              }

              let count = 0;
              lines.slice(1).forEach(line => {
                  if (!line.trim()) return;
                  const values = line.split(',');
                  const row: any = {};
                  headers.forEach((h, i) => row[h] = values[i]?.trim());

                  if (row.serial) {
                      const id = Math.random().toString(36).substr(2, 9);
                      const isRobot = (row.type || 'robot').toLowerCase() === 'robot';
                      
                      const newDevice: any = {
                          id,
                          type: isRobot ? 'ROBOT' : 'COPIER',
                          serialNumber: row.serial,
                          model: row.model || (isRobot ? 'Quasi C2' : 'Generic MFP'),
                          ipAddress: row.ip || `10.0.0.${Math.floor(Math.random()*255)}`,
                          customer: row.customer || 'Unknown',
                          location: row.location || 'Site 1',
                          erpAssetId: row.asset_id || `AST-${Math.floor(Math.random()*9000)}`,
                          lastSync: new Date().toLocaleString(),
                          status: DeviceStatus.ONLINE,
                          hasFault: false,
                          batteryLevel: 100,
                          // Metrics
                          meterRuntimeMinutes: Number(row.runtime || 0),
                          meterDeliveries: Number(row.tasks || 0),
                          odometerMeters: Number(row.odometer || 0),
                          meterTotalClicks: Number(row.total_clicks || 0),
                          meterBlackClicks: Number(row.bw_clicks || 0),
                          meterColorClicks: Number(row.color_clicks || 0),
                          tonerLevels: { c: 100, m: 100, y: 100, k: 100 },
                          firmwareVersion: 'v2.5.0-csv'
                      };
                      
                      simulator.addDevice(newDevice);
                      count++;
                  }
              });
              setUploadStatus(`Success! Imported ${count} devices.`);
              
              // Clear status after 3s
              setTimeout(() => setUploadStatus(''), 3000);

          } catch (err) {
              setUploadStatus('Error parsing CSV file.');
              console.error(err);
          }
      };
      reader.readAsText(file);
  };

  const handleBroadcastTest = () => {
      // Open current page in new window to demo sync
      window.open(window.location.href, '_blank', 'width=1000,height=800');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm flex items-center gap-3">
             <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                 <Bot size={24} />
             </div>
             Data Injection & Simulation
           </h2>
           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Control the fleet via manual override, CSV import, or chaos testing.</p>
        </div>
        
        {/* Global Controls */}
        <div className="flex items-center gap-2">
            <button 
                onClick={handleSimulateWorkDay}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 ${ffStatus === 'triggered' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
            >
                {ffStatus === 'triggered' ? <Check size={16} /> : <FastForward size={16} />} 
                {ffStatus === 'triggered' ? '8h Shift Completed!' : 'Fast-Forward 8h'}
            </button>
            <button 
                onClick={handleBroadcastTest}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
            >
                <MonitorSmartphone size={16} /> Launch Twin
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Provisioning & Import */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* CSV Import Card */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-6 ring-1 ring-slate-900/5 dark:ring-white/5 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                          <FileSpreadsheet size={20} className="text-emerald-500" />
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Bulk Import (CSV)</h3>
                      </div>
                      {uploadStatus && (
                          <span className={`text-xs font-bold px-2 py-1 rounded ${uploadStatus.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {uploadStatus}
                          </span>
                      )}
                  </div>
                  
                  <div 
                    className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                      <UploadCloud size={32} className="mx-auto text-slate-400 mb-2 group-hover:text-emerald-500 transition-colors" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          Click to upload fleet.csv
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                          Columns: serial, customer, type, location, ip
                      </p>
                      <input 
                          type="file" 
                          ref={fileInputRef}
                          accept=".csv"
                          className="hidden"
                          onChange={handleFileUpload}
                      />
                  </div>
              </div>

              {/* Manual Provisioning Form */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-6 ring-1 ring-slate-900/5 dark:ring-white/5">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <Box size={20} className="text-indigo-500" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Manual Provisioning</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type Selection */}
                    <div className="col-span-1 md:col-span-2 flex gap-4">
                        <button 
                            onClick={() => setDeviceType('ROBOT')}
                            className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${deviceType === 'ROBOT' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-indigo-200'}`}
                        >
                            <Bot size={32} />
                            <span className="font-bold">Autonomous Robot</span>
                        </button>
                        <button 
                            onClick={() => setDeviceType('COPIER')}
                            className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${deviceType === 'COPIER' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-cyan-200'}`}
                        >
                            <Printer size={32} />
                            <span className="font-bold">Managed Copier</span>
                        </button>
                    </div>

                    {deviceType === 'ROBOT' && (
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Model Family</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setRobotModel('QUASI')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border ${robotModel === 'QUASI' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 border-indigo-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200'}`}
                                >
                                    Quasi C2 (Logistics)
                                </button>
                                <button
                                    onClick={() => setRobotModel('PUDU')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 ${robotModel === 'PUDU' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 border-orange-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200'}`}
                                >
                                    <Cat size={14} /> Pudu BellaBot (Hospitality)
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Serial Number (Optional)</label>
                        <input 
                            type="text" 
                            value={serial}
                            onChange={(e) => setSerial(e.target.value)}
                            placeholder={deviceType === 'ROBOT' && robotModel === 'PUDU' ? 'PUDU-...' : 'Auto-generated'}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Customer Name</label>
                        <input 
                            type="text" 
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Location / Site</label>
                        <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase text-emerald-600 dark:text-emerald-400">
                            {deviceType === 'ROBOT' ? 'Initial Runtime (M1)' : 'B&W Clicks (M1)'}
                        </label>
                        <input 
                            type="number" 
                            value={initialMeter1}
                            onChange={(e) => setInitialMeter1(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase text-cyan-600 dark:text-cyan-400">
                            {deviceType === 'ROBOT' ? 'Initial Tasks (M2)' : 'Color Clicks (M2)'}
                        </label>
                        <input 
                            type="number" 
                            value={initialMeter2}
                            onChange={(e) => setInitialMeter2(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleAddDevice}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Provision Asset
                    </button>
                </div>
              </div>
          </div>

          {/* Right: Chaos Engineering */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-xl border border-slate-700 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                  <Zap size={20} className="text-amber-500" />
                  <h3 className="text-lg font-bold">Chaos Engineering</h3>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-amber-400">
                      <AlertTriangle size={16} /> Random Failures
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                      Simulate network drops or hardware faults across the fleet to test dashboard alerts.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleChaos('LOW')}
                        className={`p-2 rounded text-xs font-bold transition-colors ${chaosStatus === 'triggered' ? 'bg-red-800 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                      >
                          Minor Outage (20%)
                      </button>
                      <button 
                        onClick={() => handleChaos('HIGH')}
                        className={`p-2 border border-red-900 rounded text-xs font-bold transition-colors ${chaosStatus === 'triggered' ? 'bg-red-600 text-white' : 'bg-red-900/50 hover:bg-red-900/80 text-red-200'}`}
                      >
                          Major Outage (50%)
                      </button>
                  </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-emerald-400">
                      <ShieldCheck size={16} /> Health Restoration
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                      Force all devices back to ONLINE status and reset battery levels to 100%.
                  </p>
                  <button 
                     onClick={handleReset}
                     className="w-full p-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-900 rounded text-xs font-bold transition-colors"
                  >
                      Restabilize Fleet
                  </button>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono text-center">
                      SIMULATOR_CORE :: v2.5.1
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
