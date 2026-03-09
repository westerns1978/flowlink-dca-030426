
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Zap, ShieldCheck, Loader2, FileText, CheckCircle2, Terminal, Sparkles, CloudLightning, ShieldAlert } from 'lucide-react';
import { storageService, VaultFile } from '../services/storageService';

interface IngestionNodeProps {
    assetId: string;
    onComplete: (file: VaultFile) => void;
}

export const IngestionNode: React.FC<IngestionNodeProps> = ({ assetId, onComplete }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'transmitting' | 'success'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [uplinkStatus, setUplinkStatus] = useState('OFFLINE');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        storageService.checkConnection().then(res => setUplinkStatus(res.status === 'healthy' ? 'UPLINK_STABLE' : 'DEGRADED'));
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus('transmitting');
        setLogs([]);
        addLog(`>> HIGH_VOLTAGE_TRANSCEIVER_INIT: ${file.name}`);

        try {
            const result = await storageService.uploadWithDNA(file, assetId, addLog);
            addLog(">> PERSISTENCE_VERIFIED: Memory Node Confirmed");
            setStatus('success');
            setTimeout(() => {
                onComplete(result);
                setStatus('idle');
                setIsUploading(false);
            }, 1800);
        } catch (err) {
            addLog(`!! UPLINK_TERMINATED: ${err instanceof Error ? err.message : 'Unknown Fault'}`);
            setIsUploading(false);
            setStatus('idle');
        }
    };

    return (
        <div className="w-full space-y-4 font-sans">
            <div 
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={(e) => { e.preventDefault(); setIsHovering(false); /* handle drop logic */ }}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
                    relative group overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-700 cursor-pointer
                    ${status === 'transmitting' ? 'bg-slate-950 border-solaris-gold shadow-[0_0_50px_rgba(255,184,0,0.3)]' : 
                      isHovering ? 'bg-white/10 border-solaris-gold/60 scale-[1.02]' : 'bg-white/5 border-white/10 backdrop-blur-2xl'}
                `}
            >
                {/* Solaris Background Pulse */}
                <div className={`absolute inset-0 bg-gradient-to-tr from-solaris-gold/10 via-transparent to-solaris-gold/5 transition-opacity duration-1000 ${status === 'transmitting' ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                
                {/* Scanning Laser (Solaris Spec) */}
                {status === 'transmitting' && (
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                        <div className="w-full h-[2px] bg-solaris-gold shadow-[0_0_20px_#FFB800] animate-[scan_2s_infinite_linear] opacity-80"></div>
                    </div>
                )}

                <div className="p-10 flex flex-col items-center justify-center relative z-10">
                    {status === 'idle' && (
                        <>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-5 group-hover:bg-solaris-gold/10 group-hover:border-solaris-gold/40 group-hover:rotate-12 transition-all duration-500 shadow-xl group-hover:shadow-solaris-glow/20">
                                <UploadCloud size={40} className="text-slate-400 group-hover:text-solaris-gold" />
                            </div>
                            <h4 className="text-white font-black text-xl mb-1 tracking-tight group-hover:text-solaris-gold transition-colors">Neural Vault Ingestion</h4>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${uplinkStatus === 'UPLINK_STABLE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">{uplinkStatus}</p>
                            </div>
                        </>
                    )}

                    {status === 'transmitting' && (
                        <div className="w-full space-y-8 flex flex-col items-center animate-in zoom-in duration-500">
                            <div className="relative">
                                <div className="p-6 rounded-full bg-solaris-gold/20 border-2 border-solaris-gold shadow-[0_0_40px_rgba(255,184,0,0.4)] animate-pulse-gold">
                                    <CloudLightning size={48} className="text-solaris-gold" />
                                </div>
                            </div>
                            
                            <div className="w-full max-w-sm space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-solaris-gold uppercase tracking-widest flex items-center gap-2">
                                        <Loader2 size={10} className="animate-spin" /> Solaris Power Surge
                                    </span>
                                    <span className="text-xs font-mono text-white opacity-80">MULTIMODAL_SYNC</span>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                                    <div className="h-full bg-gradient-to-r from-solaris-gold via-white to-solaris-gold shadow-[0_0_20px_#FFB800] w-full animate-[power_3s_infinite_linear]"></div>
                                </div>
                                <p className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Archiving Asset to Cloud Node</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center animate-in zoom-in-75 duration-500">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <h4 className="text-white font-black mt-5 text-lg tracking-tight uppercase">Strategic Asset Secured</h4>
                            <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest mt-1">Transaction Memory Locked</p>
                        </div>
                    )}
                </div>

                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
            </div>

            {/* Solaris Transmission Log */}
            {logs.length > 0 && (
                <div className="bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-2 duration-500">
                    <div className="p-2.5 px-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-solaris-gold" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Transmission Telemetry</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/40"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                        </div>
                    </div>
                    <div className="p-5 h-36 overflow-y-auto font-mono text-[10px] space-y-1.5 custom-scrollbar bg-black/40">
                        {logs.map((log, i) => (
                            <div key={i} className={`${log.includes('!!') ? 'text-red-400' : log.includes('🧬') ? 'text-solaris-gold font-bold' : 'text-emerald-400/70'} opacity-0 animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-forwards`} style={{ animationDelay: `${i * 40}ms` }}>
                                <span className="text-slate-700 mr-2">SYS_MSG::</span> {log}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-20px); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(220px); opacity: 0; }
                }
                @keyframes power {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 184, 0, 0.4); border-radius: 10px; }
            `}</style>
        </div>
    );
};
