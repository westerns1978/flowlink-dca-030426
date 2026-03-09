
import React, { useState, useRef, useEffect } from 'react';
import { ScanFace, CheckCircle2, ShieldCheck, Fingerprint, X, Loader2, Zap } from 'lucide-react';
import { IValtService, IValtAuthStatus } from '../services/iValtService';

interface Props {
  phoneNumber: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const IValtModal: React.FC<Props> = ({ phoneNumber, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<IValtAuthStatus>({
    status: 'pending',
    message: 'Initializing Secure Link...',
  });
  const [started, setStarted] = useState(false);
  const locked = useRef(false);
  const service = useRef(new IValtService());

  useEffect(() => {
    startBiometric();
    return () => {
      service.current.cancel();
      locked.current = true;
    };
  }, []);

  const startBiometric = async () => {
    if (started) return;
    setStarted(true);

    try {
      await service.current.initiateHandshake(phoneNumber);
      setStatus({ status: 'pending', message: 'Uplink Ready. Check Phone.' });

      service.current.startPolling(
        (s) => {
          if (locked.current) return;
          if (s.status === 'success') locked.current = true;
          setStatus(s);
        },
        onSuccess,
        (err) => {
          if (!locked.current) {
            setStatus({ status: 'failed', message: err });
          }
        }
      );
    } catch (err) {
      setStatus({
        status: 'failed',
        message: err instanceof Error ? err.message : 'Uplink Failure',
      });
      setStarted(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 font-sans">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_0_100px_rgba(255,184,0,0.1)] relative overflow-hidden ring-1 ring-solaris-gold/20">
        
        {/* Scanning Laser Animation */}
        {status.status === 'pending' && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="w-full h-0.5 bg-solaris-gold shadow-[0_0_15px_#FFB800] animate-[scan_3s_infinite_linear] opacity-40"></div>
          </div>
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-solaris-gold/10 rounded-2xl flex items-center justify-center border border-solaris-gold/30">
                <ShieldCheck size={24} className="text-solaris-gold" />
              </div>
              <div>
                <h2 className="text-white font-black uppercase tracking-widest text-sm">Biometric MFA</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Uplink Stable</span>
                </div>
              </div>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="bg-slate-950/50 rounded-3xl p-8 mb-8 border border-white/5 text-center flex flex-col items-center">
            {status.status === 'pending' && (
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-solaris-gold/20 blur-2xl animate-pulse rounded-full"></div>
                <div className="relative p-6 bg-slate-900 rounded-full border-2 border-solaris-gold shadow-[0_0_30px_rgba(255,184,0,0.2)]">
                  <ScanFace size={48} className="text-solaris-gold animate-pulse" />
                </div>
              </div>
            )}
            {status.status === 'success' && (
              <div className="p-6 bg-emerald-500/20 rounded-full border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6 animate-bounce">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
            )}
            {status.status === 'failed' && (
              <div className="p-6 bg-red-500/20 rounded-full border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] mb-6">
                <X size={48} className="text-red-500" />
              </div>
            )}
            
            <p className={`text-xl font-black tracking-tight mb-2 ${status.status === 'success' ? 'text-emerald-400' : 'text-white'}`}>
              {status.message}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {status.status === 'pending' ? 'Awaiting Thumbprint/FaceID' : 'Handshake Concluded'}
            </p>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-4 mb-8 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Target Identity</p>
              <p className="text-sm font-mono text-solaris-gold font-bold">{phoneNumber}</p>
            </div>
            <Fingerprint size={20} className="text-slate-700" />
          </div>

          <button
            onClick={onCancel}
            className="w-full py-4 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-white/5 transition-all"
          >
            Abort Protocol
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-50px); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(450px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
