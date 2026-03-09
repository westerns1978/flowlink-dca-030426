import React, { useState, useEffect } from 'react';
import { CheckCircle2, MapPin, ScanFace, ShieldCheck, Fingerprint, Lock, ArrowRight, Zap, Loader2, User, KeyRound, Smartphone, AlertTriangle } from 'lucide-react';
import { IValtModal } from './IValtModal';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

const LOGO_URL = "https://storage.googleapis.com/gemynd-public/projects/flowlink/flowlink-icon.jpg";
const DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenpsbmRzc3BreW9odnpmaWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTEzMDUsImV4cCI6MjA3NzI4NzMwNX0.SK2Y7XMzeGQoVMq9KAmEN1vwy7RjtbIXZf6TyNneFnI';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin@flowlink.io');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('8163089206');
  const [step, setStep] = useState<'credentials' | 'ivalt' | 'success'>('credentials');
  const [showIValt, setShowIValt] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowIValt(true);
    setStep('ivalt');
  };

  const handleDemoBypass = () => {
    console.log('[FlowLink] Executing Demo Master Bypass');
    completeLogin('DEMO_OVERRIDE', 'Demo User', 'demo');
  };

  const handleIValtSuccess = () => {
    console.log('[FlowLink] iVALT Biometric Verified');
    setShowIValt(false);
    completeLogin('IVALT_BIO', 'Fleet Manager', 'dealer_admin');
  };

  const completeLogin = (method: string, name: string, role: string) => {
    const sessionUser = { 
        id: '71077b47-66e8-4fd9-90e7-709773ea6582', 
        email: username, 
        name: name, 
        role: role,
        mfa_verified: true,
        auth_method: method
    };
    
    setStep('success');
    setTimeout(() => onLogin(sessionUser), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-solaris-gold/10 rounded-full blur-[80px]"></div>

      <div className="w-full max-w-md mx-auto z-10 relative">
        <main className="bg-white/90 backdrop-blur-3xl w-full rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white overflow-hidden ring-1 ring-slate-900/5">
            
            <div className="bg-slate-50/80 p-10 border-b border-slate-100 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 p-2 overflow-hidden ring-4 ring-emerald-500/10">
                  <img 
                    src={LOGO_URL} 
                    alt="FlowLink Logo" 
                    className="w-full h-full object-contain rounded-2xl"
                  />
               </div>
               <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">FlowLink</h1>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Zero Trust Biometric Portal</p>
            </div>

            <div className="p-10 bg-white/50">
                {step === 'credentials' && (
                    <div className="space-y-6">
                        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Biometric ID</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        type="email" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block pl-11 p-4 outline-none transition-all shadow-inner" 
                                        placeholder="name@dealer.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">MFA Mobile</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-solaris-gold transition-colors" />
                                    <input 
                                        type="tel" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-2 focus:ring-solaris-gold/20 focus:border-solaris-gold block pl-11 p-4 outline-none transition-all shadow-inner font-mono" 
                                        placeholder="8163089206"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
                                <div className="relative group">
                                    <KeyRound className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block pl-11 p-4 outline-none transition-all shadow-inner" 
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full text-white bg-slate-900 hover:bg-slate-800 font-black rounded-2xl text-xs uppercase tracking-widest py-4 px-6 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all group">
                                Verify Biometrics
                                <Fingerprint className="w-4 h-4 text-solaris-gold group-hover:scale-110 transition-transform" />
                            </button>
                        </form>

                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Demo Access</span>
                        </div>

                        <button 
                            onClick={handleDemoBypass}
                            className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 font-black rounded-2xl text-[10px] uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                        >
                            <AlertTriangle size={14} className="group-hover:rotate-12 transition-transform" />
                            Execute Demo Master Bypass
                        </button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl mb-8 animate-bounce">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Trust Verified</h2>
                        <p className="text-slate-400 mt-2 text-xs font-bold uppercase tracking-widest">Bridging to Fleet Hub...</p>
                    </div>
                )}
            </div>
        </main>
        
        <p className="mt-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">
            Dealer Connection • Active
        </p>
        <p className="mt-1 text-center text-[8px] text-slate-400 font-mono uppercase tracking-widest opacity-60">
            FlowLink Secure Session • LEX-702
        </p>

        {showIValt && (
          <IValtModal
            phoneNumber={phone}
            onSuccess={handleIValtSuccess}
            onCancel={() => { setShowIValt(false); setStep('credentials'); }}
          />
        )}
      </div>
    </div>
  );
};