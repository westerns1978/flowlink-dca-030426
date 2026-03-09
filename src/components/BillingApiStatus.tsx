import React from 'react';
import { CheckCircle2, ShieldCheck, Clock, Hash, Activity, Zap, HardDrive, Cpu, Terminal, RefreshCw } from 'lucide-react';
import { BillingSnapshot, BaseDeviceData } from '../types';

interface BillingApiStatusProps {
    device: BaseDeviceData;
}

export const BillingApiStatus: React.FC<BillingApiStatusProps> = ({ device }) => {
    if (!device.billing_api_supported) {
        return (
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-white/5 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Legacy Device Interface</p>
                    <p className="text-[10px] text-slate-400">BUS: SM-BUS / MODBUS</p>
                </div>
                <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                    NO TWAIN PAYLOAD
                </span>
            </div>
        );
    }

    const snapshot = device.last_billing_snapshot;

    return (
        <div className="p-8 bg-zinc-800/50 rounded-[3rem] border border-emerald-900/50 shadow-2xl group transition-all ring-1 ring-black/5 mt-4">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-emerald-400 font-black uppercase tracking-[0.3em] text-sm flex items-center gap-2">
                            twAIn Billing API
                        </h4>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                           Telemetry Handshake Verified
                        </p>
                    </div>
                </div>
                {snapshot && (
                    <span className="text-xs text-zinc-500 font-mono bg-zinc-900/50 px-3 py-1 rounded-lg border border-zinc-700">
                        {snapshot.schema_version || 'billing_usage_v1'}
                    </span>
                )}
            </div>

            {snapshot ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-zinc-700 pt-8">
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Tasks Completed</p>
                        <p className="text-3xl font-mono font-black text-zinc-100 tracking-tighter">
                            {snapshot.tasks_completed?.toLocaleString() || '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Distance</p>
                        <p className="text-3xl font-mono font-black text-zinc-100 tracking-tighter">
                            {snapshot.distance_traveled ? `${(snapshot.distance_traveled / 1000).toFixed(1)}k` : '—'} <span className="text-sm text-zinc-500 font-bold uppercase">ft</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Energy Used</p>
                        <p className="text-3xl font-mono font-black text-zinc-100 tracking-tighter">
                            {snapshot.energy_used ? (snapshot.energy_used / 1000).toFixed(1) : '—'} <span className="text-sm text-zinc-500 font-bold uppercase">kWh</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Operating Time</p>
                        <p className="text-xl font-mono font-black text-zinc-100 tracking-tighter">
                            {snapshot.time_operating?.toLocaleString() || '—'} <span className="text-xs text-zinc-500 font-bold uppercase">hrs</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Counter Epoch</p>
                        <p className="text-xl font-mono font-black text-zinc-100 tracking-tighter">
                            {snapshot.counter_epoch ?? '—'}
                        </p>
                    </div>
                    <div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Firmware</p>
                        <p className="text-xl font-mono font-black text-zinc-100 tracking-tighter">
                            {snapshot.firmware_version || '—'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-emerald-500/60">
                    <RefreshCw size={40} className="animate-spin" />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Negotiating Handshake...</span>
                </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-zinc-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-slate-500" />
                    <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-500 truncate max-w-[350px]">
                        Endpoint: {device.billing_endpoint_url}
                    </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    Last poll: {snapshot?.generated_at ? new Date(snapshot.generated_at).toLocaleString() : 'Never'}
                </p>
            </div>
        </div>
    );
};
