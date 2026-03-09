
import React, { useState } from 'react';
import { FileCode, Database, Cpu, Zap, Shield, Network, Terminal, Search, ChevronRight, Box, Layers, Globe, Code, Sparkles, Binary, Server, Share2, Check } from 'lucide-react';

const SCHEMA_CATALOG = [
    { table: 'agent_knowledge', desc: 'Neural embeddings and fix steps for technical troubleshooting.', columns: ['model_family', 'diagnosis', 'embedding', 'fix_steps'] },
    { table: 'analyzed_files', desc: 'Document DNA extracted via Gemini Multimodal Pipe.', columns: ['summary', 'topics', 'entities', 'dna_confidence'] },
    { table: 'device_telemetry', desc: 'High-frequency time-series data for robots and copiers.', columns: ['battery_voltage', 'meter_total', 'error_code', 'recorded_at'] },
    { table: 'katie_logic_hub', desc: 'Central reasoning logic for Katie Service AI.', columns: ['logic_type', 'corrective_actions', 'symptoms'] },
    { table: 'crm_pipeline', desc: 'Revenue opportunities synchronized from Copper CRM.', columns: ['deal_name', 'stage', 'value', 'copper_id'] },
    { table: 'contracts', desc: 'Financial system of record for CPT/CPTT billing.', columns: ['black_cpc', 'color_cpc', 'billing_frequency'] }
];

const AGENT_SPEC = [
    { name: 'CRICKET', role: 'Fleet Manager', focus: 'Dispatch, ROI Math, Universal Billing', tools: 'get_fleet_status, dispatch_robot' },
    { name: 'KATIE', role: 'Service Engineer', focus: 'Fault Diagnosis, Parts Allocation, Firmware', tools: 'get_device_health, recommend_part' },
    { name: 'FLOWVIEW', role: 'Executive Analyst', focus: 'Revenue Projection, P&L Insights', tools: 'executive_summary' }
];

export const TechSpecView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isShared, setIsShared] = useState(false);

    const filteredSchema = SCHEMA_CATALOG.filter(s => 
        s.table.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleShareManifest = () => {
        const manifestText = `
# 🚀 Crickets Continuum C2: Technical Platform Manifest
Version: 2.5.0-STABLE | Production Node: US-West Lexington

1. EXECUTIVE SUMMARY: Bridge for AMR telemetry to ECI E-automate.
2. CORE STACK: React 19, Tailwind v4, Gemini 3 Flash, Supabase.
3. DATA FABRIC: US-West Lexington PostgreSQL Node.
4. AGENT LOGIC: Cricket (Fleet), Katie (Service), FlowView (Executive).

Full spec available in PLATFORM_SNAPSHOT.md
        `;
        navigator.clipboard.writeText(manifestText.trim());
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter flex items-center gap-3">
                        <div className="p-2.5 bg-solaris-gold rounded-2xl text-slate-900 shadow-[0_0_20px_rgba(255,184,0,0.3)]">
                            <Layers size={28} />
                        </div>
                        Platform Blueprint
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Technical Specification & Logic Topology :: v2.5.0-STABLE</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleShareManifest}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all active:scale-95 ${isShared ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-solaris-gold shadow-sm'}`}
                    >
                        {isShared ? <Check size={14} /> : <Share2 size={14} />}
                        {isShared ? 'COPIED TO CLIPBOARD' : 'SHARE SYSTEM MANIFEST'}
                    </button>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <Server size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">US-West Lexington Node</span>
                    </div>
                </div>
            </div>

            {/* Core Stack Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-950 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe size={120} className="text-solaris-gold" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-solaris-gold/20 flex items-center justify-center border border-solaris-gold/40 mb-6">
                            <Globe size={24} className="text-solaris-gold" />
                        </div>
                        <h3 className="text-white font-black text-xl mb-2">Omni-Channel UI</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">Multi-tenant React application with Solaris High-Voltage design specs. Optimized for low-latency fleet monitoring.</p>
                        <div className="flex flex-wrap gap-2">
                            {['React 19', 'Tailwind v4', 'Vite', 'TypeScript'].map(t => (
                                <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500 uppercase">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={120} className="text-solaris-gold" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40 mb-6">
                            <Zap size={24} className="text-indigo-400" />
                        </div>
                        <h3 className="text-white font-black text-xl mb-2">Neural Orchestrator</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">Agentic reasoning layer powered by Gemini 3 Flash. Handles tool routing and multi-modal document extraction.</p>
                        <div className="flex flex-wrap gap-2">
                            {['Gemini 3', 'MCP', 'Flash Preview', 'Multimodal'].map(t => (
                                <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500 uppercase">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-3xl p-8 border border-white/10 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database size={120} className="text-solaris-gold" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 mb-6">
                            <Database size={24} className="text-emerald-400" />
                        </div>
                        <h3 className="text-white font-black text-xl mb-2">Data Fabric</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">Supabase PostgreSQL backend with real-time storage and row-level security for enterprise isolation.</p>
                        <div className="flex flex-wrap gap-2">
                            {['PostgreSQL', 'S3 Storage', 'RLS', 'Edge Func'].map(t => (
                                <span key={t} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-slate-500 uppercase">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Agent Logic Flow */}
            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-10 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-solaris-gold via-indigo-500 to-emerald-500"></div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                    <Sparkles className="text-solaris-gold" /> Agentic Logic Stack
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {AGENT_SPEC.map((agent, i) => (
                        <div key={agent.name} className="space-y-4 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-xs font-black text-solaris-gold border border-white/10 shadow-lg">
                                    0{i+1}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">{agent.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{agent.role}</p>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10">
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4 italic leading-relaxed">"{agent.focus}"</p>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Tools:</p>
                                    <code className="block text-[10px] font-mono text-emerald-600 dark:text-emerald-400 break-all bg-black/5 dark:bg-black/40 p-2 rounded-xl">
                                        {agent.tools}
                                    </code>
                                </div>
                            </div>
                            {i < 2 && <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700"><ChevronRight size={24} /></div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Schema Catalog */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <Binary size={20} className="text-solaris-gold" /> Supabase Node Schema
                    </h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="Filter Tables..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-solaris-gold outline-none transition-all w-48 sm:w-64"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSchema.map((table) => (
                        <div key={table.table} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-white/5 p-6 hover:border-solaris-gold/40 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-slate-900 text-solaris-gold border border-white/10 group-hover:scale-110 transition-transform">
                                        <TableIcon size={18} />
                                    </div>
                                    <h4 className="font-mono font-bold text-slate-900 dark:text-white">{table.table}</h4>
                                </div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Public.Schema</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed font-medium">{table.desc}</p>
                            <div className="flex flex-wrap gap-1.5">
                                {table.columns.map(col => (
                                    <span key={col} className="px-2 py-0.5 bg-slate-200/50 dark:bg-white/5 rounded-md text-[9px] font-mono text-slate-600 dark:text-slate-400 border border-slate-300/30 dark:border-white/5">
                                        {col}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Neural Vault Logic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 overflow-hidden relative">
                    <div className="absolute -bottom-10 -right-10 opacity-10">
                        <FileCode size={200} className="text-solaris-gold" />
                    </div>
                    <h4 className="text-xl font-black text-white uppercase mb-4 flex items-center gap-3">
                        <Code size={20} className="text-solaris-gold" /> Multimodal Pipe Logic
                    </h4>
                    <div className="bg-black/50 rounded-2xl p-6 font-mono text-[10px] text-emerald-400/80 leading-relaxed border border-white/5">
                        <div className="mb-2 text-slate-500">// Extracting Document DNA via Gemini 3</div>
                        <div><span className="text-solaris-gold">const</span> analyze = <span className="text-indigo-400">async</span> (buffer) ={">"} {'{'}</div>
                        <div className="pl-4">  <span className="text-solaris-gold">const</span> res = <span className="text-indigo-400">await</span> ai.generateContent({'{'}</div>
                        <div className="pl-8">model: <span className="text-emerald-400">'gemini-3-flash-preview'</span>,</div>
                        <div className="pl-8">prompt: <span className="text-emerald-400">'Return JSON: {'{'}title, summary, tags{'}'}'</span></div>
                        <div className="pl-4">  {'}'});</div>
                        <div className="pl-4 text-slate-500">// Committing to analyzed_files node</div>
                        <div className="pl-4">  <span className="text-indigo-400">await</span> supabase.from(<span className="text-emerald-400">'analyzed_files'</span>).insert(res.json);</div>
                        <div>{'}'};</div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-6">
                    <div className="bg-solaris-gold/5 rounded-3xl border border-solaris-gold/20 p-8">
                        <h4 className="font-black text-slate-900 dark:text-solaris-gold uppercase tracking-widest text-xs mb-4">Architecture Compliance</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Data Sovereignty', status: 'Lexington US-West Verified', icon: Shield },
                                { label: 'Reasoning Engine', status: 'Gemini Multimodal Native', icon: Sparkles },
                                { label: 'ERP Bridge', status: 'ECI ESN Port 9780 Secured', icon: Network }
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-white/10 border border-white/10 text-slate-400"><item.icon size={16} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                        Download Full System Manifest (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

const TableIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
);
