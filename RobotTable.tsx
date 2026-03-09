import React, { useEffect, useState, useMemo } from 'react';
import { Search, Bot, Printer, ChevronRight, Box, Layers, ScanLine, Wifi, WifiOff, Zap, Battery, Database, Filter, ArrowRight, Activity, DollarSign } from 'lucide-react';
import { RobotDetailModal } from './RobotDetailModal';

interface RobotTableProps {
    initialDevices?: any[];
    loading?: boolean;
}

export const RobotTable: React.FC<RobotTableProps> = ({ initialDevices = [], loading: parentLoading = false }) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AMR' | 'MFP' | 'SCANNER'>('ALL');
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialDevices.length > 0) {
        setDevices(initialDevices);
    }
  }, [initialDevices]);

  const handleRowClick = (device: any) => {
      const mappedDevice = {
          ...device,
          serialNumber: device.serial_number || device.serialNumber,
          model: device.model_name || device.model || 'Generic Asset',
          customer: device.customer_name || device.customer,
          status: device.latest_telemetry?.status || device.status || 'OFFLINE',
          batteryLevel: device.batteryLevel || 0,
          meterRuntimeMinutes: device.meterRuntimeMinutes || 0,
          meterDeliveries: device.meterDeliveries || 0,
          rwuAccrued: device.rwuAccrued || 0,
          trueCostOfService: device.trueCostOfService || 125.00,
          billing_api_supported: device.billing_api_supported
      };
      setSelectedDevice(mappedDevice);
      setIsModalOpen(true);
  };

  const getDeviceCategory = (d: any): string => {
    const dt = (d.device_type || d.type || '').toUpperCase();
    if (dt === 'ROBOT' || dt === 'AMR') return 'ROBOTICS';
    if (dt === 'COPIER' || dt === 'MFP' || dt === 'PRINTER') return 'PRINT';
    if (dt === 'SCANNER') return 'SCAN';
    return 'OTHER';
  };

  const filteredDevices = useMemo(() => {
    let result = devices;
    if (activeFilter !== 'ALL') {
        result = result.filter(d => {
            const category = getDeviceCategory(d);
            switch (activeFilter) {
              case 'AMR': return category === 'ROBOTICS';
              case 'MFP': return category === 'PRINT';
              case 'SCANNER': return category === 'SCAN';
              default: return true;
            }
        });
    }
    const term = searchTerm.toLowerCase();
    if (term) {
        result = result.filter(device => 
            (device.serial_number || device.serialNumber || '').toLowerCase().includes(term) ||
            (device.customer_name || device.customer || '').toLowerCase().includes(term) ||
            (device.model_name || device.model || '').toLowerCase().includes(term)
        );
    }
    return result;
  }, [devices, searchTerm, activeFilter]);

  const stats = useMemo(() => {
    const counts = { amr: 0, mfp: 0, scanner: 0 };
    devices.forEach(d => {
        const category = getDeviceCategory(d);
        if (category === 'ROBOTICS') counts.amr++;
        else if (category === 'PRINT') counts.mfp++;
        else if (category === 'SCAN') counts.scanner++;
    });
    return counts;
  }, [devices]);

  const StatusIndicator = ({ lastSync }: { lastSync: string }) => {
    const isLive = lastSync === 'Live' || !lastSync;
    const colorClass = isLive ? 'emerald' : 'amber';
    return (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 bg-${colorClass}-50 dark:bg-${colorClass}-500/5 rounded-md border border-${colorClass}-200 dark:border-${colorClass}-500/20`}>
            <div className={`w-1 h-1 rounded-full bg-${colorClass}-600 dark:bg-${colorClass}-500 ${isLive ? 'animate-pulse' : ''}`}></div>
            <span className={`text-[8px] font-bold text-${colorClass}-700 dark:text-${colorClass}-400 uppercase tracking-widest`}>{isLive ? 'Live' : 'Synced'}</span>
        </div>
    );
  };

  const DeviceRow: React.FC<{ device: any }> = ({ device }) => {
      const category = getDeviceCategory(device);
      const isRobot = category === 'ROBOTICS';
      const isBilling = device.billing_api_supported;
      const yieldAmount = (device.rwuAccrued || 0);

      const renderMeter1 = () => {
          if (isRobot) {
              const runtime = device.latest_telemetry?.runtime_minutes ?? device.meterRuntimeMinutes;
              return runtime > 0 ? `${(runtime / 60).toFixed(1)}h` : '—';
          } else {
              const black = device.latest_telemetry?.meter_black ?? device.meterBlackClicks;
              return black > 0 ? black.toLocaleString() : '—';
          }
      };

      const renderMeter2 = () => {
          if (isRobot) {
              const tasks = device.latest_telemetry?.task_count ?? device.meterDeliveries;
              return tasks > 0 ? tasks.toLocaleString() : '—';
          } else {
              const color = device.latest_telemetry?.meter_color ?? device.meterColorClicks;
              return color > 0 ? color.toLocaleString() : '—';
          }
      };

      const renderOdometer = () => {
          if (isRobot) {
              const dist = device.latest_telemetry?.distance_meters ?? device.odometerMeters;
              return dist > 0 ? `${((dist * 3.28084) / 1000).toFixed(1)}k ft` : '—';
          }
          return 'N/A';
      };

      return (
        <div 
            onClick={() => handleRowClick(device)}
            className="flex items-center justify-between px-5 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/[0.04] transition-all cursor-pointer border-b border-slate-100 dark:border-white/5 last:border-0 group relative"
        >
            <div className="flex items-center gap-4 min-w-[240px] w-[30%]">
                <div className={`p-2 rounded-lg border transition-all ${isRobot ? 'bg-slate-900 dark:bg-slate-950 border-white/10 text-emerald-500' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}>
                    {isRobot ? <Bot size={16} /> : <Printer size={16} />}
                </div>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors uppercase">
                            {device.serial_number || device.serialNumber}
                        </span>
                        <StatusIndicator lastSync={device.lastSync || device.last_seen || 'Live'} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{device.customer_name || device.customer}</span>
                        {isBilling && <span className="px-1 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[6px] font-black rounded border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-widest">twAIn</span>}
                    </div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-10 flex-1 justify-center px-4">
                <div className="flex flex-col items-start min-w-[90px]">
                    <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{isRobot ? 'Runtime' : 'Meter 1'}</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                            {renderMeter1()}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-start min-w-[90px]">
                    <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{isRobot ? 'Tasks' : 'Meter 2'}</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                            {renderMeter2()}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-start min-w-[90px]">
                    <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Odometer</span>
                    <div className="text-xs font-mono font-bold text-slate-500">
                        {renderOdometer()}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-[15%] justify-end">
                <div className="flex flex-col items-end">
                    <div className="text-sm font-mono font-black text-slate-900 dark:text-white tracking-tighter">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mr-0.5">$</span>
                        {Math.floor(yieldAmount).toLocaleString()}
                    </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
        </div>
      );
  };

  const NavColumn = ({ id, label, count, icon: Icon }: any) => {
      const isActive = activeFilter === id;
      return (
          <button 
            onClick={() => setActiveFilter(id)}
            className={`flex-1 min-w-[140px] p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                isActive 
                ? `bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-sm` 
                : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
            }`}
          >
              <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-700 dark:border-emerald-400' : 'bg-slate-100 dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10'} transition-all`}>
                      <Icon size={14} />
                  </div>
                  <span className={`text-xl font-mono font-black ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-800'}`}>{count}</span>
              </div>
              <div className="mt-4">
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'}`}>{label}</h4>
              </div>
          </button>
      );
  };

  return (
    <>
    <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-nowrap sm:grid sm:grid-cols-4 gap-4 overflow-x-auto pb-2 custom-scrollbar">
            <NavColumn id="ALL" label="Global Fleet" count={devices.length} icon={Layers} />
            <NavColumn id="AMR" label="AMR Robotics" count={stats.amr} icon={Bot} />
            <NavColumn id="MFP" label="Managed Print" count={stats.mfp} icon={Printer} />
            <NavColumn id="SCANNER" label="Service Scan" count={stats.scanner} icon={ScanLine} />
        </div>

        <div className="bg-white dark:bg-transparent text-slate-900 dark:text-slate-100 rounded-2xl flex flex-col border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-black/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-slate-950 rounded-xl flex items-center justify-center text-emerald-500 border border-white/5 shadow-lg">
                        <Layers size={18} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none">Device Registry</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Partition: {activeFilter || 'ALL'}</span>
                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                            <span className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest">{filteredDevices.length} ACTIVE</span>
                        </div>
                    </div>
                </div>
                
                <div className="relative group max-w-xs w-full">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                        placeholder="Search Fleet Node..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[400px]">
                {filteredDevices.length === 0 ? (
                    <div className="py-20 text-center">
                        <WifiOff size={40} className="mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                        <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-[10px]">Zero Matches</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filteredDevices.map(device => <DeviceRow key={device.id} device={device} />)}
                    </div>
                )}
            </div>

            <div className="px-6 py-3 bg-slate-50 dark:bg-black/60 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-slate-400 dark:text-slate-600 uppercase">Uptime Index:</span>
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-500 tracking-wider">99.98%</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200 dark:bg-white/5"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-slate-400 dark:text-slate-600 uppercase">Status:</span>
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                           <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Stable
                        </span>
                    </div>
                </div>
                <span className="text-[8px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest opacity-50">NODE_LEX_v2.7</span>
            </div>
        </div>
    </div>
    <RobotDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} robot={selectedDevice} />
    </>
  );
};
