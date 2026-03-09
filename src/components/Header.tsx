import React, { useState, useEffect } from 'react';
import { Wifi, Menu, Terminal, Moon, Sun, Database, Activity, ShieldCheck, PlayCircle, Sparkles } from 'lucide-react';
import { triggerCricket } from '../utils/chatUtils';

interface HeaderProps {
  onMenuClick?: () => void;
  onTerminalClick?: () => void;
  isTerminalOpen?: boolean;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  systemStatus?: string;
  erpConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
    onMenuClick, 
    onTerminalClick, 
    isTerminalOpen, 
    isDarkMode, 
    toggleTheme,
    systemStatus = 'Operational',
    erpConnected = true
}) => {
  const [metrics, setMetrics] = useState({ latency: 42, syncRate: '99.8%' });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        latency: Math.floor(40 + Math.random() * 5),
        syncRate: (99.7 + Math.random() * 0.2).toFixed(1) + '%'
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startBriefing = () => {
      triggerCricket({
          prompt: "SYSTEM_ACTION: EXECUTIVE_BRIEFING. Cricket, act as the seasoned tech veteran. Start the tour immediately. Use your 'navigate_app' virtual hands to walk me through the Dashboard, then the Device Registry. Explain why these 'moving copiers' are a goldmine for my service department. Keep it real and tech-first.",
          contextType: 'INSIGHT'
      });
  };

  return (
    <header className="fixed top-4 left-4 right-4 lg:left-72 lg:right-6 z-40 transition-all duration-500">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-xl px-4 py-2 flex justify-between items-center shadow-lg">
        
        <div className="flex items-center gap-3">
          <button 
            className="lg:hidden p-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-300 hover:bg-emerald-500/10 rounded-lg transition-all active:scale-95"
            onClick={onMenuClick}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="text-xs font-black tracking-widest text-slate-900 dark:text-white leading-none uppercase">
                  FLOWLINK
              </h1>
              <div className="flex items-center gap-2 mt-1">
                  <div className="text-[7px] flex items-center gap-1 font-bold uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                      CONNECTED
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          <button 
            onClick={startBriefing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 dark:bg-slate-950 text-white dark:text-emerald-400 border border-emerald-700 dark:border-emerald-500/30 hover:bg-emerald-700 dark:hover:border-emerald-400 transition-all active:scale-95 group"
          >
             <PlayCircle size={14} className="group-hover:scale-110 transition-transform" />
             <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Executive Briefing</span>
          </button>

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
             <Database size={10} className="text-emerald-600 dark:text-emerald-500" />
             <div className="flex flex-col">
                <span className="text-[6px] font-bold text-slate-500 uppercase leading-none mb-0.5">Latency</span>
                <span className="text-[9px] font-mono font-bold text-slate-700 dark:text-white leading-none">{metrics.latency}ms</span>
             </div>
          </div>

          <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
              {isDarkMode ? (
                  <Sun size={14} className="text-slate-400 hover:text-amber-400" />
              ) : (
                  <Moon size={14} className="text-slate-400 hover:text-slate-700" />
              )}
          </button>

          <button 
            onClick={onTerminalClick}
            className={`p-2 rounded-lg transition-all active:scale-95 border ${
                isTerminalOpen 
                ? 'bg-slate-950 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/5'
            }`}
          >
            <Terminal size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};