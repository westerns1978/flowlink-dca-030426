import React from 'react';
import { Bot, CheckCircle, Clock, Zap } from 'lucide-react';

export const AgentWorkUnits: React.FC = () => {
  const agents = [
    { name: 'Katie', role: 'Billing Agent', completions: 142, billableEvents: 142, status: 'Active' },
    { name: 'AIVA', role: 'Telemetry Agent', completions: 89, billableEvents: 89, status: 'Active' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm">
      <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
        <Bot size={18} className="text-emerald-500" />
        Agent Work Units (AWU)
      </h2>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{agent.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{agent.role}</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Completions</p>
                <p className="text-lg font-black text-slate-900 dark:text-white font-mono">{agent.completions}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Billable Events</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-500 font-mono">{agent.billableEvents}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
