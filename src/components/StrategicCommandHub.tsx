import React, { useState } from 'react';
import { Activity, TrendingUp, Zap, ChevronRight, BarChart3, Database, ArrowRight, Bot, DollarSign, X } from 'lucide-react';
import { triggerCricket } from '../utils/chatUtils';

interface StrategicCommandHubProps {
    stats?: any;
}

export const StrategicCommandHub: React.FC<StrategicCommandHubProps> = ({ stats }) => {
    const [showMoneySlide, setShowMoneySlide] = useState(false);
    
    const uptime = stats?.uptime || "98.2";
    const deviceBreakdown = stats?.deviceTypeString || "8 COPIERS • 4 ROBOTS • 2 SCANNERS";
    const totalRevenue = stats?.accruedRevenue ? Number(stats.accruedRevenue) : 24500;
    const accruedRevenue = totalRevenue.toLocaleString();
    const margin = stats?.margin || "52";

    // Proportional breakdown for the demo
    const copierShare = Math.round(totalRevenue * 0.74);
    const robotShare = Math.round(totalRevenue * 0.20);
    const scannerShare = totalRevenue - copierShare - robotShare;

    return (
        <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-500">
                <div 
                    onClick={() => triggerCricket("Analyze current fleet efficiency and battery health trends.")}
                    className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all p-6 shadow-sm"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <Zap size={100} className="text-emerald-500" />
                    </div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                            <Activity size={24} className="text-slate-600 dark:text-cyan-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Fleet Diagnostics</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Uptime: {uptime}% • {deviceBreakdown}</p>
                        </div>
                        <ChevronRight className="text-slate-300 dark:text-slate-700 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" size={20} />
                    </div>
                </div>

                <div 
                    onClick={() => setShowMoneySlide(true)}
                    className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all p-6 shadow-sm"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                        <TrendingUp size={100} className="text-emerald-500" />
                    </div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-emerald-500/20 group-hover:scale-105 transition-transform duration-500">
                            <DollarSign size={24} className="text-slate-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Revenue Hub</h3>
                            <div className="flex flex-col gap-0.5 mt-1">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                    ACCRUED: ${accruedRevenue} • MARGIN: {margin}%
                                </p>
                                <p className="text-slate-400 dark:text-slate-600 font-medium text-[9px] uppercase tracking-[0.1em]">
                                    COPIERS: ${copierShare.toLocaleString()} | ROBOTICS: ${robotShare.toLocaleString()} | SCANNERS: ${scannerShare.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-300 dark:text-slate-700 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" size={20} />
                    </div>
                </div>
            </div>

            {/* Money Slide Modal */}
            {showMoneySlide && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowMoneySlide(false)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowMoneySlide(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-white/5 hover:bg-red-500 text-slate-400 hover:text-white rounded-lg transition-all">
                            <X size={18} />
                        </button>

                        <div className="mb-8">
                           <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                              <Bot size={28} className="text-emerald-600 dark:text-emerald-500" />
                              Universal Billing Model
                           </h2>
                           <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">Translating complex device telemetry into the billing units your dealership already speaks.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-xl border border-slate-200 dark:border-white/5 text-center">
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Fleet Telemetry</span>
                                <div className="mt-2 font-mono text-emerald-700 dark:text-emerald-500 space-y-1 text-sm">
                                    <p>Pages: 2.3M</p>
                                    <p>Deliveries: 1,247</p>
                                    <p>Scans: 42k</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center">
                                <ArrowRight size={32} className="text-emerald-600 dark:text-emerald-500 opacity-50" />
                                <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-widest mt-1">FlowLink</span>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-xl border border-slate-200 dark:border-white/5 text-center">
                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Integrated Meters</span>
                                <div className="mt-2 font-mono text-emerald-700 dark:text-emerald-400 space-y-1 text-sm">
                                    <p>M1: B&W/Hours</p>
                                    <p>M2: Color/Tasks</p>
                                    <p>ODO: Linear Use</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-8 border border-slate-200 dark:border-white/5 text-center relative overflow-hidden">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Unified Monthly Revenue</span>
                            <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">${accruedRevenue}<span className="text-xl opacity-40">.00</span></div>
                            <p className="text-slate-500 text-xs font-medium">
                                Consolidated Volume from Copier, Robot, and Scanner nodes.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};