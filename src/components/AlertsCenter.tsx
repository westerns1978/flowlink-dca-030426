import React from 'react';
import { AlertTriangle, Info, CheckCircle, Search, Filter, Loader2 } from 'lucide-react';
import { ActiveResolutions } from './ActiveResolutions';
import { triggerCricket } from '../utils/chatUtils';
import { useAlerts } from '../hooks/useDCAData';

export const AlertsCenter: React.FC = () => {
  const { data: alerts, loading } = useAlerts(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Alerts Center</h2>
           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Real-time hardware faults and business logic notifications.</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search alerts..." 
               className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none backdrop-blur-sm shadow-sm transition-all focus:bg-white dark:focus:bg-slate-800 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
             />
          </div>
          <button className="p-2 bg-white/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm active:scale-95">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Enhancement: Active Resolution Bridge */}
      <ActiveResolutions />

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
           <Loader2 size={40} className="animate-spin text-emerald-500" />
           <span className="text-xs font-bold uppercase tracking-widest">Filtering Neural Alerts...</span>
        </div>
      ) : alerts.length === 0 ? (
        <div className="py-20 text-center bg-white/40 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
           <CheckCircle size={48} className="mx-auto text-emerald-500/30 mb-4" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No Active High Priority Alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert: any) => (
            <div 
              key={alert.call_number} 
              className={`
                bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border p-4 flex gap-4 transition-all duration-300 group
                hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]
                ${alert.priority === 'CRITICAL'
                    ? 'border-red-200 dark:border-red-900/50 shadow-md hover:border-red-300'
                    : 'border-slate-300 dark:border-slate-700 shadow-sm hover:border-emerald-300/50'
                }
              `}
            >
               {/* Icon */}
               <div className={`p-3 rounded-full shrink-0 h-fit border shadow-sm ${
                 alert.priority === 'CRITICAL' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50' :
                 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50'
               }`}>
                 <AlertTriangle size={20} />
               </div>

               {/* Content */}
               <div className="flex-1">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {alert.problem_description}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap ml-2 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {new Date(alert.opened_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                 </div>
                 
                 <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-medium">
                   <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">{alert.problem_code || 'CODE_UNK'}</span> 
                   <span className="text-slate-300 dark:text-slate-600">•</span> 
                   Customer: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{alert.customer_id}</span>
                   <span className="text-slate-300 dark:text-slate-600">•</span> 
                   Call: <span className="text-indigo-500 font-bold">#{alert.call_number}</span>
                 </p>

                 <div className="mt-3 flex gap-2">
                   <button 
                     onClick={() => triggerCricket(`I'm acknowledging the '${alert.problem_description}' alert for call ${alert.call_number}. What are the next steps?`)}
                     className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-md font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm hover:shadow-md active:scale-95"
                   >
                     Acknowledge
                   </button>
                   <button 
                      onClick={() => triggerCricket(`Review service history for ${alert.customer_id} regarding issue ${alert.problem_code}.`)}
                      className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded-md font-bold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-sm hover:shadow-md active:scale-95"
                   >
                     Inspect History
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
