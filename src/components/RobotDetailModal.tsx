import React, { useState, useEffect } from 'react';
import { X, Zap, Activity, Database, RefreshCw, Calculator, FileText, Download, ShieldCheck, DollarSign, Bot, Printer, ChevronRight, Gauge, Cpu, ArrowRight, LayoutDashboard, Radio } from 'lucide-react';
import { storageService, VaultFile } from '../services/storageService';
import { IngestionNode } from './IngestionNode';
import { BillingApiStatus } from './BillingApiStatus';

interface RobotDetailModalProps {
  robot: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RobotDetailModal: React.FC<RobotDetailModalProps> = ({ robot, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'revenue' | 'docs'>('telemetry');
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    if (isOpen) setActiveTab('telemetry');
  }, [isOpen, robot]);

  useEffect(() => {
      if (activeTab === 'docs' && robot) loadVault();
  }, [activeTab, robot]);

  const loadVault = async () => {
      setIsLoadingFiles(true);
      try {
          const files = await storageService.listVault(robot?.id);
          setVaultFiles(files);
      } finally {
          setIsLoadingFiles(false);
      }
  };

  const handleSimCommand = (cmd: string) => {
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 2000);
  };

  if (!isOpen || !robot) return null;

  const calculateRWU = (device: any) => {
    const tel = device.latest_telemetry || {};
    const snap = device.last_billing_snapshot || {};
    
    // Use telemetry first, billing snapshot as fallback
    const runtimeMinutes = tel.runtime_minutes ?? snap.runtime_minutes ?? device.meterRuntimeMinutes ?? 0;
    const hours = runtimeMinutes / 60;
    const tasks = tel.task_count ?? snap.task_count ?? device.meterDeliveries ?? 0;
    const distanceMeters = tel.distance_meters ?? snap.distance_meters ?? device.odometerMeters ?? 0;
    const distanceFeet = distanceMeters * 3.28084;
    
    // FlowLink RWU rates
    const cptt = hours * 15.00;        // $15/hr
    const cpt = tasks * 2.50;          // $2.50/task
    const cplf = distanceFeet * 0.05;  // $0.05/linear foot
    
    return {
        total: Math.round(cptt + cpt + cplf),
        cptt: cptt.toFixed(2),
        cpt: cpt.toFixed(2),
        cplf: cplf.toFixed(2),
        hours: hours.toFixed(1),
        tasks: tasks,
        feet: Math.round(distanceFeet).toLocaleString(),
    };
  };

  const rwu = calculateRWU(robot);
  const isRobot = robot.device_type === 'ROBOT' || robot.type === 'ROBOT';
  
  const grossRevenue = rwu.total * 0.052;
  const tcosLabor = 125.00; 
  const tcosWear = rwu.total * 0.002;
  const netMargin = grossRevenue - tcosLabor - tcosWear;

  const statusUpper = robot.status?.toUpperCase() || 'OFFLINE';
  const isHealthy = statusUpper === 'ONLINE' || statusUpper === 'ACTIVE' || statusUpper === 'LIVE_UPLINK';
  const statusStyles = isHealthy 
    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20';

  const tabs = [
    { id: 'telemetry', label: 'Telemetry Hub', icon: <Activity size={14} className="mr-1.5" /> },
    { id: 'revenue', label: 'Fiscal Audit', icon: <DollarSign size={14} className="mr-1.5" /> },
    { id: 'docs', label: 'Neural Vault', icon: <Database size={14} className="mr-1.5" /> }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
          className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 pointer-events-none font-sans">
        <div className="
            pointer-events-auto
            w-full max-w-3xl max-h-[85vh]
            bg-white dark:bg-slate-900 
            border border-slate-200 dark:border-white/10
            rounded-2xl
            shadow-2xl
            overflow-hidden
            flex flex-col
            animate-in zoom-in-95 fade-in duration-300
        ">
          {/* Header */}
          <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                      {isRobot 
                          ? <Bot size={22} className="text-emerald-600 dark:text-emerald-400" />
                          : <Printer size={22} className="text-slate-600 dark:text-slate-400" />
                      }
                  </div>
                  <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white font-mono tracking-tight uppercase leading-none">
                          {robot.serialNumber || robot.serial_number}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{robot.customer} › {robot.location}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusStyles}`}>
                      {statusUpper}
                  </span>
              </div>
              <button 
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                  <X size={18} />
              </button>
          </div>

          {/* Tab bar */}
          <div className="shrink-0 border-b border-slate-200 dark:border-white/10 px-6 bg-white dark:bg-slate-900">
              <div className="flex gap-1">
                  {tabs.map(tab => (
                      <button 
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors relative flex items-center ${
                              activeTab === tab.id 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                          }`}
                      >
                          <span className="flex items-center gap-1.5">{tab.icon} {tab.label}</span>
                          {activeTab === tab.id && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                          )}
                      </button>
                  ))}
              </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 custom-scrollbar">
              {activeTab === 'telemetry' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                      <BillingApiStatus device={robot} />
                      
                      {/* Core Power + Efficiency + Thermal */}
                      <div className="bg-gray-50 border border-gray-200 dark:bg-slate-800/50 dark:border-white/5 rounded-xl p-5 shadow-sm">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Core Power</p>
                          <div className="flex items-baseline gap-6">
                              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                                  {robot.batteryLevel || 81}<span className="text-xl text-slate-400">%</span>
                              </span>
                              <div className="flex gap-6">
                                  <div>
                                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Efficiency</p>
                                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">98.2%</p>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Thermal</p>
                                      <p className="text-lg font-bold text-slate-700 dark:text-slate-300">42°C</p>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Runtime + Tasks meters */}
                      <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 border border-gray-200 dark:bg-slate-800/50 dark:border-white/5 rounded-xl p-5 shadow-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{isRobot ? 'Runtime (M1)' : 'B&W Meter'}</p>
                              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                  {isRobot ? `${rwu.hours}h` : (robot.meterBlackClicks || 0).toLocaleString()}
                              </p>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 dark:bg-slate-800/50 dark:border-white/5 rounded-xl p-5 shadow-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{isRobot ? 'Tasks (M2)' : 'Color Meter'}</p>
                              <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                                  {isRobot ? rwu.tasks.toLocaleString() : (robot.meterColorClicks || 0).toLocaleString()}
                              </p>
                          </div>
                      </div>

                      {/* Operations panel */}
                      <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4 bg-white dark:bg-slate-800/30 shadow-sm">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Operations</p>
                          <div className="flex gap-3">
                              <button 
                                  disabled={isProcessing}
                                  onClick={() => handleSimCommand('restart')}
                                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent shadow-sm"
                              >
                                  {isProcessing ? 'Processing...' : 'Restart Node'}
                              </button>
                              <button 
                                  onClick={() => handleSimCommand('calibrate')}
                                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors bg-white dark:bg-transparent shadow-sm"
                              >
                                  Calibrate
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'revenue' && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="p-8 bg-gray-50 border border-gray-200 dark:bg-slate-800/50 dark:border-white/5 rounded-2xl">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                             <DollarSign size={16} className="text-emerald-600" /> Fiscal Node Audit
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-4 font-mono text-[11px]">
                                  <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-white/5">
                                      <span className="text-slate-500 uppercase">Accrued Volume</span>
                                      <span className="text-slate-900 dark:text-white font-bold">{rwu.total.toLocaleString()} RWU</span>
                                  </div>
                                  <div className="space-y-2 pl-4 border-l-2 border-emerald-500/30 mb-4 opacity-80">
                                      <div className="flex justify-between text-slate-500">
                                          <span>CPTT (Runtime): {rwu.hours}h × $15.00</span>
                                          <span>${rwu.cptt}</span>
                                      </div>
                                      <div className="flex justify-between text-slate-500">
                                          <span>CPT (Tasks): {rwu.tasks} × $2.50</span>
                                          <span>${rwu.cpt}</span>
                                      </div>
                                      <div className="flex justify-between text-slate-500">
                                          <span>CPLF (Distance): {rwu.feet} ft × $0.05</span>
                                          <span>${rwu.cplf}</span>
                                      </div>
                                  </div>
                                  <div className="flex justify-between pb-3 border-b border-gray-200 dark:border-white/5">
                                      <span className="text-slate-500 uppercase">Margin Rate</span>
                                      <span className="text-slate-900 dark:text-white font-bold">$0.052</span>
                                  </div>
                                  <div className="flex justify-between">
                                      <span className="text-slate-500 uppercase">Service Debt</span>
                                      <span className="text-red-500 font-bold">-${(tcosLabor + tcosWear).toFixed(0)}</span>
                                  </div>
                              </div>
                              <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-white/5 shadow-inner">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Net Margin Projection</span>
                                  <span className={`text-6xl font-black ${netMargin > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'} tracking-tighter`}>
                                      ${netMargin.toFixed(0)}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {activeTab === 'docs' && (
                  <div className="animate-in fade-in duration-300 space-y-6">
                      <IngestionNode assetId={robot.id} onComplete={() => loadVault()} />
                      <div className="p-8 bg-gray-50 border border-gray-200 dark:bg-slate-800/50 dark:border-white/5 rounded-2xl flex flex-col justify-center text-center">
                          <Database size={32} className="mx-auto text-emerald-600 dark:text-emerald-500 mb-4 opacity-50" />
                          <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Neural Vault Connected</h5>
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-2 leading-relaxed">
                              {vaultFiles.length > 0 ? `${vaultFiles.length} nodes indexed for this asset.` : 'Multimodal technical DNA extraction pipeline stabilized.'}
                          </p>
                      </div>
                  </div>
              )}
          </div>

          {/* Footer bar */}
          <div className="shrink-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-white/10 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-mono uppercase">Node Stable</span>
                  <span className="opacity-30">|</span>
                  <span className="font-mono uppercase">SYS_V2.7.0</span>
              </div>
              <button 
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white dark:hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
              >
                  Close
              </button>
          </div>
        </div>
      </div>
    </>
  );
};
