import React from 'react';
import { Wrench, CheckCircle2, Circle, Loader2, ArrowRight, Bot, Database, ArrowLeftRight } from 'lucide-react';
import { triggerCricket } from '../utils/chatUtils';

export const ActiveResolutions: React.FC = () => {
  const steps = [
    { id: 1, label: 'Error Logged', status: 'completed' },
    { id: 2, label: 'Code Mapping', status: 'completed' },
    { id: 3, label: 'Pushing ERP', status: 'active' }, 
    { id: 4, label: 'Dispatched', status: 'pending' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 p-5 mb-4 animate-in fade-in duration-500 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <Wrench size={14} className="text-emerald-500" />
          Active Resolution Pipeline
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/5 rounded-md text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase border border-emerald-500/20">
            Node Syncing
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 border border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
            <Bot size={18} className="text-emerald-500" />
            <div>
               <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-tight">KM-C458</h4>
                  <span className="text-[8px] font-mono bg-slate-200 dark:bg-white/5 text-slate-500 px-1 rounded">SC2502-0042</span>
               </div>
               <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold">
                   <span className="text-red-500 dark:text-red-400">ERR_FUSER</span>
                   <ArrowLeftRight size={10} className="text-slate-300 dark:text-slate-700" />
                   <span className="text-emerald-600 dark:text-emerald-500 font-mono">SC-550</span>
               </div>
            </div>
        </div>

        <div className="flex justify-between items-start w-full">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-1.5 relative z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                step.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 
                step.status === 'active' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 animate-pulse' : 
                'bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-white/10 text-slate-400 dark:text-slate-700'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 size={12} /> : step.status === 'active' ? <Loader2 size={12} className="animate-spin" /> : <Circle size={10} />}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};