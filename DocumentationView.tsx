
import React, { useState } from 'react';
import { BookOpen, Copy, Check, FileText, PlayCircle, Star, MessageSquare, DollarSign, Bot, ArrowRight, Zap, ShieldCheck, Globe, Database, Terminal, Calculator, Download, Loader2 } from 'lucide-react';
import { triggerCricket } from '../utils/chatUtils';

export const DocumentationView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleFlyerGeneration = () => {
      setIsGenerating(true);
      triggerCricket({
          prompt: "SYSTEM_ACTION: GENERATE_SALES_FLYER. Context: Office Equipment Dealer looking to present robotics to a medical facility. Focus on RWU Meter 1 and Meter 2 mapping. Produce a structured one-page flyer content.",
          contextType: 'REPORT'
      });
      setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto pb-32 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-5">
            <div className="p-3 bg-solaris-gold rounded-[1.5rem] text-slate-900 shadow-xl shadow-solaris-gold/20">
                <BookOpen size={44} />
            </div>
            Showroom <span className="text-solaris-gold underline decoration-solaris-gold/30 underline-offset-8">Central</span>
          </h2>
          <p className="text-sm text-slate-500 font-black uppercase tracking-[0.3em] mt-5 pl-2 opacity-70">Strategic Assets for Presentation :: ECS 2026 Ready</p>
        </div>
        
        <button 
            onClick={handleFlyerGeneration}
            disabled={isGenerating}
            className="px-10 py-5 bg-slate-950 text-solaris-gold font-black rounded-[2rem] text-xs uppercase tracking-widest border border-solaris-gold/30 shadow-2xl active:scale-95 transition-all flex items-center gap-4 hover:border-solaris-gold group"
        >
            {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} className="group-hover:scale-110 transition-transform" />} 
            {isGenerating ? 'Synthesizing...' : 'Generate Sales Flyer'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
              { id: 'guide', icon: Globe, label: 'Strategy Overview', desc: 'The "Robot-as-a-Copier" strategy guide for dealer principals.', color: 'text-indigo-500' },
              { id: 'script', icon: PlayCircle, label: 'The "Money Talk"', desc: 'Master script for the ECS booth demo floor.', color: 'text-emerald-500' },
              { id: 'logic', icon: Terminal, label: 'Logic Manifest', desc: 'Technical mapping of telemetry to Meter 1/2/Odometer.', color: 'text-solaris-gold' }
          ].map((card) => (
              <div key={card.id} className="solaris-glass p-10 rounded-[3rem] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
                  <card.icon className={`absolute -bottom-8 -right-8 ${card.color} opacity-[0.03] group-hover:opacity-10 transition-opacity`} size={160} />
                  <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center ${card.color} mb-8 border border-current border-opacity-10 shadow-lg`}>
                      <card.icon size={28} />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-xl mb-3">{card.label}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{card.desc}</p>
                  <button 
                    onClick={() => card.id === 'logic' ? triggerCricket("Explain the RWU normalization logic for E-automate.") : handleCopy(card.id, card.label)} 
                    className={`mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-colors ${card.id === 'logic' ? 'text-solaris-gold' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                      {copiedSection === card.id ? <Check size={16} /> : <Copy size={16} />} {card.id === 'logic' ? 'Discuss Logic' : 'Copy Manifest'}
                  </button>
              </div>
          ))}
      </div>

      <div className="solaris-glass rounded-[4rem] overflow-hidden relative border border-slate-200/50 dark:border-white/10 shadow-premium-dark">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-indigo-500 via-solaris-gold to-emerald-500 opacity-60"></div>
          
          <div className="p-16 lg:p-24">
              <article className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="flex items-center gap-5 mb-12">
                      <ShieldCheck className="text-emerald-500" size={44} />
                      <h3 className="text-4xl font-black uppercase tracking-tighter m-0 text-slate-900 dark:text-white">Master Documentation</h3>
                  </div>

                  <section className="mb-20">
                      <h4 className="text-solaris-gold font-black uppercase tracking-[0.5em] text-xs mb-8">01. THE BRIDGE TO ROBOTICS</h4>
                      <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium italic border-l-8 border-solaris-gold/30 pl-10 py-4 bg-solaris-gold/[0.03] rounded-r-[2rem]">
                          "The DCA makes a $40,000 logistics robot look, bill, and service exactly like a Konica Minolta copier. It treats AMRs as first-class subscriber assets."
                      </p>
                  </section>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                      <div className="p-10 bg-white/40 dark:bg-black/40 rounded-[3rem] border border-slate-200/50 dark:border-white/5 shadow-inner">
                          <h4 className="flex items-center gap-3 font-black uppercase tracking-widest text-[11px] text-indigo-500 mb-8">
                              <Calculator size={20} /> RWU NORMALIZATION
                          </h4>
                          <div className="space-y-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                  <span className="font-bold">Operating Time</span>
                                  <span className="text-slate-900 dark:text-white font-black bg-white dark:bg-slate-800 px-3 py-1 rounded-md border border-white/10 shadow-sm">Meter 1 (Black)</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                  <span className="font-bold">Task Completion</span>
                                  <span className="text-slate-900 dark:text-white font-black bg-white dark:bg-slate-800 px-3 py-1 rounded-md border border-white/10 shadow-sm">Meter 2 (Color)</span>
                              </div>
                              <div className="flex justify-between items-center pb-4">
                                  <span className="font-bold">Distance</span>
                                  <span className="text-slate-900 dark:text-white font-black bg-white dark:bg-slate-800 px-3 py-1 rounded-md border border-white/10 shadow-sm">Odometer</span>
                              </div>
                          </div>
                      </div>

                      <div className="p-10 bg-white/40 dark:bg-black/40 rounded-[3rem] border border-slate-200/50 dark:border-white/5 shadow-inner">
                          <h4 className="flex items-center gap-3 font-black uppercase tracking-widest text-[11px] text-emerald-500 mb-8">
                              <Database size={20} /> SERVICE CODE TRANSLATION
                          </h4>
                          <div className="space-y-6 font-mono text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                  <span className="font-bold">LiDAR Failure</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-black">SC-550 (Fuser)</span>
                              </div>
                              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                  <span className="font-bold">Battery Low</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-black">SC-400 (Toner)</span>
                              </div>
                              <div className="flex justify-between items-center pb-4">
                                  <span className="font-bold">Obstacle Timeout</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-black">SC-100 (Jam)</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </article>
          </div>
      </div>
    </div>
  );
};
