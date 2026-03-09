import React from 'react';
import { TIME_ALLOCATION_DATA, WEEKLY_DISTANCE_DATA } from '../constants';
import { Activity, BatteryCharging, Zap } from 'lucide-react';
import { LiveActivityFeed } from './LiveActivityFeed';

export const DashboardAnalytics: React.FC = () => {
  const maxBarValue = Math.max(...WEEKLY_DISTANCE_DATA.map(d => d.value));
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const navigateTo = (view: string) => {
    window.dispatchEvent(new CustomEvent('navigate-view', { detail: view }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 animate-in fade-in duration-700">
      
      {/* 1. Time Allocation Donut */}
      <div 
        onClick={() => navigateTo('live_fleet')}
        className="cursor-pointer bg-white dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700 transition-all group shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500/30 active:scale-[0.99]"
      >
        <div className="flex justify-between items-start mb-4">
           <div>
             <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Fleet Time Allocation</h3>
             <p className="text-[8px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider mt-0.5">Weekly Fleet Utilization</p>
           </div>
           <Activity size={14} className="text-slate-300 dark:text-slate-700" />
        </div>

        <div className="flex items-center justify-around py-4">
           <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r={radius} fill="transparent" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-800" />
                 {TIME_ALLOCATION_DATA.map((segment, i) => {
                    const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                    accumulatedPercent += segment.percentage;
                    return (
                        <circle key={i} cx="50" cy="50" r={radius} fill="transparent" strokeWidth="10" stroke={segment.color} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all duration-700 opacity-80" />
                    );
                 })}
              </svg>
           </div>
           <div className="flex flex-col gap-2">
              {TIME_ALLOCATION_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-white ml-2">{item.percentage}%</span>
                  </div>
              ))}
           </div>
        </div>
      </div>

      {/* 2. Weekly Output */}
      <div 
        onClick={() => navigateTo('erp_mirror')}
        className="cursor-pointer bg-white dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700 transition-all shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500/30 active:scale-[0.99]"
      >
        <div className="flex justify-between items-start mb-4">
           <div>
             <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Weekly Output</h3>
             <p className="text-[8px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider mt-0.5">Meters normalized to billable units</p>
           </div>
           <Zap size={14} className="text-emerald-600/50 dark:text-emerald-500/50" />
        </div>
        <div className="flex items-end justify-between h-32 px-1 gap-2 pt-2">
            {WEEKLY_DISTANCE_DATA.map((data, i) => {
                const heightPercent = (data.value / maxBarValue) * 100;
                return (
                    <div key={i} className="flex flex-col items-center gap-1.5 w-full h-full justify-end">
                        <div className="relative w-full rounded-t bg-slate-100 dark:bg-slate-800 h-full flex items-end overflow-hidden shadow-inner">
                            <div className="w-full bg-emerald-500 opacity-60 rounded-t" style={{ height: `${heightPercent}%` }}></div>
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase">{data.day}</span>
                    </div>
                )
            })}
        </div>
      </div>

      {/* 3. Charging Events Scatter */}
      <div 
        onClick={() => navigateTo('live_fleet')}
        className="cursor-pointer bg-white dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500/30 active:scale-[0.99]"
      >
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Docking Logs</h3>
            <BatteryCharging size={14} className="text-slate-300 dark:text-slate-700" />
         </div>
         <div className="relative h-24 w-full border-l border-b border-slate-100 dark:border-white/5">
             {[...Array(8)].map((_, i) => (
                 <div 
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full opacity-40 border border-white/20"
                    style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 70}%` }}
                 />
             ))}
         </div>
         <div className="flex justify-between mt-2 text-[8px] text-slate-400 dark:text-slate-600 font-mono">
             <span>00:00</span>
             <span>12:00</span>
             <span>23:59</span>
         </div>
      </div>

      <LiveActivityFeed />
    </div>
  );
};