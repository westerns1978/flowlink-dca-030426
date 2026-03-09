import React from 'react';
import { DollarSign, AlertTriangle, Bot, Clock, TrendingUp, Zap, ShieldAlert } from 'lucide-react';
import { triggerCricket } from '../utils/chatUtils';

interface KPIGridProps {
  stats: any;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ stats }) => {
  const revenueDisplay = stats.accruedRevenue !== undefined ? stats.accruedRevenue : stats.pendingBilling;
  const efficiency = stats.efficiency || "52.4";

  const navigateTo = (view: string) => {
    window.dispatchEvent(new CustomEvent('navigate-view', { detail: view }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Connected Devices */}
      <div 
        onClick={() => navigateTo('devices')}
        className="cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/5 flex items-start justify-between hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Connected Devices</p>
          <div className="flex items-baseline mt-2 gap-1.5">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">{stats.activeFleet}</h3>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Nodes</span>
          </div>
          <div className="mt-4 inline-flex items-center text-emerald-700 dark:text-emerald-500 text-[8px] font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-widest">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse mr-1.5"></div> Synchronized
          </div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-emerald-600 dark:text-emerald-400">
          <Bot size={18} />
        </div>
      </div>

      {/* Card 2: Accrued Revenue */}
      <div 
        onClick={() => navigateTo('erp_mirror')}
        className="cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/5 flex items-start justify-between hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Accrued Revenue</p>
          <div className="flex items-baseline mt-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">
              ${(revenueDisplay / 1000).toFixed(1)}<span className="text-lg">k</span>
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
             <Zap size={10} className="text-emerald-600 dark:text-emerald-500" />
             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                Metering Active
             </span>
          </div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-emerald-600 dark:text-emerald-400">
          <DollarSign size={18} />
        </div>
      </div>

      {/* Card 3: Fleet Efficiency */}
      <div 
        onClick={() => navigateTo('live_fleet')}
        className="cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/5 flex items-start justify-between hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fleet Efficiency</p>
          <div className="flex items-baseline mt-2">
            <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-500 font-mono tracking-tighter">
              {efficiency}%
            </h3>
          </div>
          <div className="mt-4 flex items-center gap-2">
             <TrendingUp size={10} className="text-emerald-600 dark:text-emerald-500" />
             <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Opt Index: High</span>
          </div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-emerald-600 dark:text-emerald-400">
          <Clock size={18} />
        </div>
      </div>

      {/* Card 4: Health Alerts */}
      <div 
        onClick={() => navigateTo('alerts')}
        className="cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-white/5 flex items-start justify-between hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <div>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Health Alerts</p>
          <div className="flex items-baseline mt-2">
            <h3 className="text-3xl font-black text-red-600 dark:text-red-500 font-mono tracking-tighter">{stats.criticalAlerts}</h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold ml-1.5 uppercase tracking-widest">Critical</span>
          </div>
          <p className="text-[8px] text-emerald-700 dark:text-emerald-500 mt-4 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert size={10} /> Compliance: PASS
          </p>
        </div>
        <div className={`p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-red-600 dark:text-red-500 ${stats.criticalAlerts > 0 ? 'animate-pulse' : ''}`}>
          <AlertTriangle size={18} />
        </div>
      </div>
    </div>
  );
};