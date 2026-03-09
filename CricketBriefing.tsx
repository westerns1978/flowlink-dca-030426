import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, ChevronUp, ChevronDown, Mic, Scan, DollarSign, ShieldAlert, Zap, Radio, Info } from 'lucide-react';
import { StrategicInsight } from '../types';
import { triggerCricket } from '../utils/chatUtils';

const CRICKET_BUSINESS_INSIGHTS = [
  "Your fleet has 92 devices — 78 copiers reporting through KPAX, 6 Epson scanners on TWAIN Direct, and 8 robotic units. Total metered revenue: $24,500.",
  "That Pudu BellaBot has completed 1,247 deliveries this month. At $2.50 per delivery, that's $3,117 in billable RWUs — processed exactly like color clicks on a copier.",
  "See this? The device reports 'runtime_minutes' but your E-automate sees 'Meter 1 Black'. We translate device physics into copier accounting for every asset class.",
  "When that Quasi throws a LIDAR error, we translate it to SC-550 — same code your techs see on a Konica fuser. Your dispatcher doesn't need to learn a new language.",
  "Here's the opportunity: dealers already have the infrastructure and customer relationships. Robots and high-speed scanners are just... first-class subscriber assets.",
  "Every document scanned is training data. Every delivery is a transaction. FlowLink connects them into a unified AI platform for your dealership."
];

interface CricketBriefingProps {
  insights: StrategicInsight[];
  systemStatus: string;
}

export const CricketBriefing: React.FC<CricketBriefingProps> = ({ insights, systemStatus }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTalkingPoint, setCurrentTalkingPoint] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTalkingPoint(prev => (prev + 1) % CRICKET_BUSINESS_INSIGHTS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (isDismissed) return null;

  return (
    <div className="relative mb-8 group animate-in slide-in-from-top-4 duration-700">
      <div className="bg-slate-900 border-x border-t border-slate-700 rounded-t-3xl h-10 flex items-center overflow-hidden relative z-0">
          <div className="bg-emerald-600 h-full px-4 flex items-center gap-2 z-10 shrink-0">
              <Bot size={18} className="text-white animate-bounce" />
              <span className="text-xs font-black text-white uppercase tracking-widest">Cricket AI Advisor</span>
          </div>
          <div className="flex-1 px-4 flex items-center bg-slate-950">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
             <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-tighter">Analyzing Universal ROI Tiers...</span>
          </div>
      </div>

      <div className="relative overflow-hidden rounded-b-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl ring-1 ring-emerald-500/20">
        <div className="p-8">
           <div className="flex gap-6">
              <div className="shrink-0">
                 <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-emerald-500/30 shadow-2xl relative group">
                    <Bot size={48} className="text-emerald-600 dark:text-emerald-500" />
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl"></div>
                 </div>
              </div>
              
              <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                       <Radio size={16} className="text-red-500 animate-pulse" />
                       Fleet Briefing
                    </h3>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-emerald-600 transition-colors">
                       {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                 </div>

                 {isExpanded && (
                    <>
                      <p className="text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-50 dark:bg-emerald-500/5 rounded-r-2xl">
                        "{CRICKET_BUSINESS_INSIGHTS[currentTalkingPoint]}"
                      </p>
                      
                      <div className="flex items-center gap-6 pt-4">
                         <button 
                            onClick={() => triggerCricket("Run a comparative ROI audit across robots, MFPs, and scanners.")}
                            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-95 transition-all"
                         >
                            Audit Fleet ROI
                         </button>
                         <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                            <ShieldAlert size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Platform Advantage: +22%</span>
                         </div>
                      </div>
                    </>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};