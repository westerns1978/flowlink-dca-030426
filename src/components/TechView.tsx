import React from 'react';
import { 
  Zap, ArrowRight, Send, User, Clock, Building, 
  ChevronDown, AlertTriangle, RefreshCw, Loader2, CheckCircle2 
} from 'lucide-react';
import { useFieldService } from '../hooks/useDCAData';

const KATIE_URL = "https://katie-020526-v1-608887102507.us-west1.run.app/";

export const TechView: React.FC = () => {
  const { data: calls, loading, refresh } = useFieldService(true);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': 
        return 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20';
      case 'HIGH': 
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'LOW': 
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      default: 
        return 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'DISPATCHED':
        return 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-emerald-600" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Querying Dispatch Node...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Field Service Dispatch
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Active service calls & technician dispatch center</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Live Dispatch Active
          </span>
          <button 
            onClick={() => refresh()}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:border-emerald-400 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
          >
            <RefreshCw size={12} />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT: Service Call Queue (3/5 width) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Queue header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Active Queue • {calls.length} Calls
            </span>
            <div className="flex gap-2">
              {['ALL', 'CRITICAL', 'OPEN'].map((filter, i) => (
                <button key={filter} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {calls.length === 0 && (
            <div className="py-20 text-center bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
               <CheckCircle2 size={48} className="mx-auto text-emerald-500/20 mb-4" />
               <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Queue Clear</h3>
               <p className="text-slate-500 mt-2 text-sm">No open service calls currently registered.</p>
            </div>
          )}

          {/* Service call cards */}
          {calls.map(call => (
            <div key={call.call_number} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-emerald-400 dark:hover:border-emerald-500/30 hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Priority badge */}
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getPriorityStyles(call.priority)}`}>
                    {call.priority}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">#{call.call_number}</span>
                </div>
                {/* Status badge */}
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getStatusStyles(call.status)}`}>
                  {call.status}
                </span>
              </div>

              {/* Problem description */}
              <h3 className="text-base font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                {call.problem_description}
              </h3>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-6 text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <User size={12} className="text-emerald-600" /> {call.technician_name || 'Unassigned'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-emerald-600" /> {new Date(call.opened_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building size={12} className="text-emerald-600" /> {call.customer_id}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-white/5">
                <a 
                  href={KATIE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <Zap size={12} fill="currentColor" />
                  Resolve with Katie
                </a>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-sm">
                  <ArrowRight size={12} />
                  View Details
                </button>
                <button className="ml-auto flex items-center gap-2 px-3 py-2 text-[10px] font-black text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 uppercase tracking-widest transition-colors group/btn">
                  <Send size={12} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  Push to ERP
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Stats + Resolution Pipeline (2/5 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Dispatch Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{calls.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Calls</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-900/10 shadow-inner">
                <p className="text-3xl font-black text-red-600 dark:text-red-500 tracking-tighter">{calls.filter(c => c.priority === 'CRITICAL').length}</p>
                <p className="text-[9px] font-black text-red-600/70 dark:text-red-400 uppercase tracking-widest mt-1">Critical</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-900/10 shadow-inner">
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tighter">{calls.filter(c => c.status === 'IN_PROGRESS').length}</p>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-1">Working</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-900/10 shadow-inner">
                <p className="text-3xl font-black text-amber-600 dark:text-amber-500 tracking-tighter">{calls.filter(c => c.technician_name === 'Unassigned').length}</p>
                <p className="text-[9px] font-black text-amber-600/70 dark:text-amber-400 uppercase tracking-widest mt-1">Unassigned</p>
              </div>
            </div>
          </div>

          {/* Katie AI Resolution Pipeline */}
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/20 dark:border-emerald-500/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                <Zap size={120} className="text-emerald-500" />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 ring-4 ring-emerald-500/10">
                <img 
                  src="https://storage.googleapis.com/gemynd-public/projects/katie/katie-icon.png" 
                  alt="Katie" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <Zap size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Katie AI Co-Pilot</h3>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">Resolution Engine v3.1</p>
              </div>
            </div>

            {/* 5-tier resolution flow */}
            <div className="space-y-1">
              {[
                { step: '1', label: 'Error Detection', desc: 'Real-time telemetry pulse', color: 'bg-red-500' },
                { step: '2', label: 'Katie Analysis', desc: '600+ error code logic map', color: 'bg-amber-500' },
                { step: '3', label: 'Service Mapping', desc: 'Syncs with E-automate codes', color: 'bg-blue-500' },
                { step: '4', label: 'Tech Routing', desc: 'Optimized location dispatch', color: 'bg-cyan-500' },
                { step: '5', label: 'ERP Push', desc: 'Auto-billed parts & labor', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <div className={`w-8 h-8 rounded-xl ${item.color} text-white text-[11px] font-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{item.desc}</p>
                  </div>
                  {i < 4 && <div className="ml-auto w-px h-4 bg-slate-200 dark:bg-white/10 hidden group-hover:block" />}
                </div>
              ))}
            </div>

            <a 
              href={KATIE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full flex items-center justify-center gap-3 px-4 py-4 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 group"
            >
              <Zap size={16} fill="currentColor" className="group-hover:animate-pulse" />
              Launch Katie Console
            </a>
          </div>

          {/* Unbilled Labor Alert */}
          <div className="bg-amber-50 dark:bg-amber-500/5 border-2 border-amber-200 dark:border-amber-500/20 rounded-[2.5rem] p-8 shadow-lg group hover:border-amber-400 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-500 group-hover:rotate-12 transition-transform">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-[0.2em]">Trapped Revenue</h3>
            </div>
            <p className="text-5xl font-black text-amber-600 dark:text-amber-400 tracking-tighter">$2,340<span className="text-xl opacity-40 ml-1">.00</span></p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4 leading-relaxed">
              Unbilled labor detected across {calls.filter(c => c.technician_name !== 'Unassigned').length} dispatched calls currently in the field.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
