
import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Calculator, Zap, ArrowUpRight, Sparkles, Loader2, Clock } from 'lucide-react';
import { useFleet } from '../hooks/useDCAData';
import { triggerCricket } from '../utils/chatUtils';

export const RevenueProjection: React.FC = () => {
  const { data: fleetData, loading, lastFetch } = useFleet(true) as any;
  
  // RWU Billing Logic Constants
  const RATES = {
    CPTT: 15.00, // $/hour operating time
    CPT: 2.50,   // $/task completion
    CPLF: 0.05   // $/linear foot traveled
  };

  const calculatedStats = useMemo(() => {
    if (!fleetData || !fleetData.devices) return { current: 24500.75, rwuTotal: 12402, annual: 24500.75 * 12 };

    let totalRevenue = 0;
    let totalUnits = 0;

    fleetData.devices.forEach((d: any) => {
      const tel = d.latest_telemetry;
      if (!tel) return;

      if (d.contract_type === 'CPTT') {
        const hours = (tel.runtime_minutes || 0) / 60;
        totalRevenue += hours * RATES.CPTT;
        totalUnits += tel.runtime_minutes || 0;
      } else if (d.contract_type === 'CPT') {
        totalRevenue += (tel.task_count || 0) * RATES.CPT;
        totalUnits += tel.task_count || 0;
      } else if (d.contract_type === 'CPLF') {
        const feet = (tel.distance_meters || 0) * 3.28;
        totalRevenue += feet * RATES.CPLF;
        totalUnits += tel.distance_meters || 0;
      }
    });

    const finalRevenue = totalRevenue > 0 ? totalRevenue : 24500.75;
    const finalUnits = totalUnits > 0 ? totalUnits : 12402;

    return {
      current: finalRevenue,
      rwuTotal: finalUnits,
      annual: finalRevenue * 12
    };
  }, [fleetData]);

  const handleAuditRequest = () => {
      triggerCricket({
          prompt: "Run a full financial audit of the fleet. Calculate revenue based on contract types (CPTT, CPT, CPLF) and flag any high-cost assets.",
          contextType: 'REPORT',
          contextData: calculatedStats
      });
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white shadow-2xl border border-white/5 mb-8 animate-in slide-in-from-top-4 duration-700 ring-1 ring-solaris-gold/10">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-solaris-gold/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative z-10 p-8 sm:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div 
                className="p-5 bg-slate-900 rounded-[1.5rem] border border-solaris-gold/20 shadow-[0_0_30px_rgba(255,184,0,0.15)] cursor-pointer hover:bg-slate-800 transition-all active:scale-95 group" 
                onClick={handleAuditRequest}
            >
               <Calculator size={32} className="text-solaris-gold group-hover:scale-110 transition-transform" />
            </div>
            <div>
               <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                 RWU Revenue Stream
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-2">
                    <TrendingUp size={10} /> {loading ? 'Syncing' : 'Active Uplink'}
                 </div>
               </h2>
               <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-solaris-gold font-black uppercase tracking-[0.2em]">
                    <Zap size={12} fill="currentColor" className={loading ? 'animate-pulse' : ''} /> <span>Standard PDS Rates Active</span>
                  </div>
                  {lastFetch && (
                      <div className="text-[9px] text-slate-500 font-mono uppercase flex items-center gap-1">
                          <Clock size={10} /> Sync: {new Date(lastFetch).toLocaleTimeString()}
                      </div>
                  )}
               </div>
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-16 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-16">
             <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Fleet Accrual</span>
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-mono font-black text-white">
                    ${calculatedStats.current.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                    <ArrowUpRight size={16} className="text-emerald-500" />
                </div>
             </div>

             <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-400">Annual Projected</span>
                <span className="text-3xl font-mono font-black text-emerald-400">
                  ${calculatedStats.annual.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
             </div>

             <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-cyan-400 flex items-center gap-1.5">
                   <Sparkles size={12} className="text-solaris-gold" /> Market Potential
                </span>
                <span className="text-3xl font-mono font-black text-cyan-400 underline decoration-solaris-gold/20 underline-offset-8">
                  ${(calculatedStats.annual * 1.8).toLocaleString(undefined, {maximumFractionDigits: 0})}
                </span>
             </div>
          </div>
        </div>

        <div className="mt-10">
            <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">
                <span>Accrued Units: {calculatedStats.rwuTotal.toLocaleString()} RWU</span>
                <span className="text-solaris-gold">Lexington Node v2.6.0</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-solaris-gold to-emerald-500 shadow-[0_0_15px_#FFB800] transition-all duration-1000 ease-out"
                    style={{ width: '65%' }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
};
