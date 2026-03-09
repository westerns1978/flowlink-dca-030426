import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Clock, AlertCircle, RefreshCw, Zap, DollarSign } from 'lucide-react';
import { useActivityFeed } from '../hooks/useDCAData';

export const LiveActivityFeed: React.FC = () => {
  const { data: items, loading, error, lastFetch } = useActivityFeed(true) as any;
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (lastFetch) {
        setSecondsSinceUpdate(Math.floor((Date.now() - lastFetch) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastFetch]);

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } catch (e) {
      return '—';
    }
  };

  const renderIcon = (status: string) => {
      if (status === 'success' || status === 'completed') return <CheckCircle2 size={12} />;
      if (status === 'in_progress' || status === 'syncing') return <RefreshCw size={12} className="animate-spin" />;
      return <Zap size={12} />;
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col h-full overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
        <h3 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Recent Activity</h3>
        <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[160px]">
         {items.slice(0, 5).map((item: any, idx: number) => (
             <div key={idx} className="px-4 py-2 border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                 <div className="flex gap-3 items-center">
                     <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 ${
                         item.status === 'success' ? 'text-emerald-500 bg-emerald-500/5' : 'text-slate-400 bg-slate-100 dark:bg-white/5'
                     }`}>
                         {renderIcon(item.status)}
                     </div>
                     <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-center">
                             <h4 className="text-[10px] font-bold text-slate-800 dark:text-white truncate uppercase tracking-tight">{item.title}</h4>
                             <span className="text-[7px] text-slate-400 dark:text-slate-600 font-bold uppercase whitespace-nowrap ml-2">
                               {getRelativeTime(item.timestamp)}
                             </span>
                         </div>
                         <p className="text-[9px] text-slate-500 truncate">{item.description}</p>
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};