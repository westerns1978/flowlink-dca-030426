import React, { useState, useEffect } from 'react';
import { Database, Table, Search, RefreshCw, Server, ArrowDownToLine, ArrowUpFromLine, CheckCircle2 } from 'lucide-react';
import { DeviceData } from '../types';

interface EAutomateMirrorProps {
  devices: DeviceData[];
}

export const EAutomateMirror: React.FC<EAutomateMirrorProps> = ({ devices }) => {
  const [activeTable, setActiveTable] = useState<'MeterReads' | 'ServiceCalls' | 'Contracts'>('MeterReads');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  // Add handleSync function to handle SQL refresh simulation
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsSyncing(false);
    }, 1500);
  };

  // realistic mixed-device dataset for ECI Demo
  const meterRows = [
    { EquipmentID: 'KM-LRM-C368-001', MeterType: 'Black_M1', Reading: 45230, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'KM-LRM-C368-001', MeterType: 'Color_M2', Reading: 12100, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'KM-BHC-258-003', MeterType: 'Black_M1', Reading: 38750, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'KM-BHC-258-003', MeterType: 'Color_M2', Reading: 9840, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'QUASI-C2-001', MeterType: 'RWU_CPTT', Reading: 847, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'QUASI-C2-001', MeterType: 'RWU_CPT', Reading: 2340, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'QUASI-C2-001', MeterType: 'RWU_CPLF', Reading: 18450, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'PUDU-BB-001', MeterType: 'RWU_CPTT', Reading: 623, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'PUDU-BB-001', MeterType: 'RWU_CPT', Reading: 4120, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'EPSON-DS780-001', MeterType: 'Scan_M1', Reading: 8500, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'EPSON-DS780-002', MeterType: 'Scan_M1', Reading: 3200, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'KM-C458-ACME', MeterType: 'Black_M1', Reading: 67800, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
    { EquipmentID: 'KM-C458-ACME', MeterType: 'Color_M2', Reading: 22450, Date: '2026-02-10', Source: 'WestFlow_DCA', Valid: true },
  ];

  const renderTable = () => {
      let headers: string[] = [];
      let rows: any[] = [];

      switch(activeTable) {
          case 'MeterReads':
              headers = ['EquipmentID', 'MeterType', 'Reading', 'Date', 'Source', 'Valid'];
              rows = meterRows;
              break;
          case 'ServiceCalls':
              headers = ['CallNumber', 'EquipmentID', 'Description', 'Status', 'Priority', 'Created'];
              rows = [
                  { CallNumber: 'SC2026-001', EquipmentID: 'QUASI-C2-001', Description: 'LIDAR Obstruction Detected', Status: 'Dispatched', Priority: 'High', Created: '10:42 AM' },
                  { CallNumber: 'SC2026-002', EquipmentID: 'KM-LRM-C368-001', Description: 'Fuser Replacement Required', Status: 'Pending', Priority: 'Med', Created: '09:15 AM' },
              ];
              break;
          case 'Contracts':
              headers = ['ContractID', 'CustomerID', 'EquipmentID', 'BillCode', 'BaseRate', 'OverageRate'];
              rows = Array.from({ length: 15 }, (_, i) => ({
                  ContractID: `CTR-PDS-${(1000 + i)}`,
                  CustomerID: 'Acme Logistics',
                  EquipmentID: i < 5 ? meterRows[i].EquipmentID : `AST-${5000 + i}`,
                  BillCode: 'RWU_PREMIUM',
                  BaseRate: '$450.00',
                  OverageRate: '$0.015'
              }));
              break;
      }

      return (
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10">
                          {headers.map(h => (
                              <th key={h} className="py-2.5 px-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-900/40">
                      {rows.map((row, i) => (
                          <tr key={i} className={`
                              hover:bg-emerald-50 dark:hover:bg-blue-900/10 transition-colors group
                              ${row.EquipmentID?.startsWith('QUASI-') || row.EquipmentID?.startsWith('PUDU-') 
                                  ? 'border-l-2 border-l-emerald-500' 
                                  : row.EquipmentID?.startsWith('EPSON-') 
                                      ? 'border-l-2 border-l-cyan-500' 
                                      : ''
                              }
                          `}>
                              {headers.map(h => (
                                  <td key={h} className={`py-2 px-4 text-slate-600 dark:text-slate-400 font-medium ${h === 'EquipmentID' ? `text-slate-900 dark:text-white font-bold` : ''}`}>
                                      {h === 'Valid' ? <span className="text-emerald-600 dark:text-emerald-500 font-bold">TRUE</span> : row[h]}
                                  </td>
                              ))}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-end px-2">
            <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                    <Database size={24} className="text-emerald-600 dark:text-emerald-500" /> E-automate Mirror
                </h2>
                <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest">
                    Direct Read-Only SQL Bridge :: US-WEST-NODE
                </p>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    SQL_BRIDGE: ESTABLISHED
                </div>
                <button onClick={handleSync} className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                    <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'QUERYING...' : 'REFRESH'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <h3 className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3 px-1">Source Objects</h3>
                {[
                    { id: 'MeterReads', label: 'dbo.CM_MeterReads', icon: ArrowDownToLine, count: 13 },
                    { id: 'ServiceCalls', label: 'dbo.SC_ServiceCalls', icon: Server, count: 6 },
                    { id: 'Contracts', label: 'dbo.CN_Contracts', icon: Table, count: 95 },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTable(item.id as any)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            activeTable === item.id 
                            ? 'bg-emerald-50 dark:bg-blue-900/20 border-emerald-200 dark:border-blue-800 text-emerald-700 dark:text-blue-300 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={14} />
                            <span className="font-mono text-[10px] font-bold">{item.label}</span>
                        </div>
                        <span className="bg-slate-100 dark:bg-black/50 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            {item.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col shadow-xl">
                <div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-900 dark:bg-slate-950 flex justify-between items-center px-4">
                    <span className="text-[10px] font-mono text-emerald-400 dark:text-emerald-500/60">
                        SELECT TOP 100 * FROM dbo.{activeTable} ORDER BY Date DESC
                    </span>
                    <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white/5 border border-white/10"></span>
                        <span className="w-2 h-2 rounded-full bg-white/5 border border-white/10"></span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500/40"></span>
                    </div>
                </div>
                {renderTable()}
            </div>
        </div>
    </div>
  );
};
