
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Square, X, Maximize2, Minimize2, Radio, Zap, ShieldCheck, Loader2, Play, Download } from 'lucide-react';
import { analyzeFrame, FrameAnalysis } from '../services/visionService';

interface VisualAuditPanelProps {
  agentName: string;
  onClose: () => void;
  onSnapshot: (snapshot: { image: string; analysis: FrameAnalysis }) => void;
}

export const VisualAuditPanel: React.FC<VisualAuditPanelProps> = ({ agentName, onClose, onSnapshot }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LINK_ACTIVE' | 'RECORDING' | 'ANALYZING'>('IDLE');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setStatus('LINK_ACTIVE');
    } catch (err) {
      console.error("Camera Access Denied:", err);
      alert("Please grant camera permissions for visual audit.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setStatus('IDLE');
    }
  };

  const captureStill = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsAnalyzing(true);
    setStatus('ANALYZING');

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    try {
      const analysis = await analyzeFrame(base64Image, `Agent: ${agentName} conducting visual fleet audit.`);
      onSnapshot({ image: `data:image/jpeg;base64,${base64Image}`, analysis });
    } catch (err) {
      console.error("Analysis Failed");
    } finally {
      setIsAnalyzing(false);
      setStatus('LINK_ACTIVE');
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunks.current = [];
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      console.log("Recording complete:", blob.size);
    };
    mediaRecorder.current.start();
    setIsRecording(true);
    setStatus('RECORDING');
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setStatus('LINK_ACTIVE');
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className={`fixed bottom-24 right-6 z-[100] transition-all duration-500 ease-in-out ${isExpanded ? 'w-[400px]' : 'w-16 h-16'}`}>
      <div className={`bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col h-full ring-1 ring-solaris-gold/20 ${!isExpanded && 'rounded-full aspect-square'}`}>
        
        {/* Header */}
        <div className={`p-4 bg-slate-950 flex items-center justify-between border-b border-white/5 ${!isExpanded && 'hidden'}`}>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-solaris-gold/20 rounded-xl text-solaris-gold">
                <Video size={18} />
             </div>
             <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest">{agentName} EYE</h4>
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'IDLE' ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{status}</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsExpanded(false)} className="p-1.5 text-slate-500 hover:text-white transition-colors">
              <Minimize2 size={16} />
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Minimized Trigger */}
        {!isExpanded && (
            <button 
                onClick={() => setIsExpanded(true)}
                className="w-full h-full flex items-center justify-center bg-solaris-gold text-slate-900 shadow-xl hover:scale-110 active:scale-95 transition-all"
            >
                <Maximize2 size={24} />
            </button>
        )}

        {/* Video Area */}
        {isExpanded && (
            <div className="relative aspect-video bg-black overflow-hidden group">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay Scanning Lines */}
                {isAnalyzing && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="w-full h-[2px] bg-solaris-gold shadow-[0_0_20px_#FFB800] animate-[scan_2s_infinite_linear] opacity-80"></div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-30 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                    <Radio size={10} className={status !== 'IDLE' ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">{status}</span>
                </div>
            </div>
        )}

        {/* Controls */}
        {isExpanded && (
            <div className="p-6 space-y-4 bg-slate-900/50 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={captureStill}
                        disabled={isAnalyzing}
                        className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-white/5 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                    >
                        {isAnalyzing ? <Loader2 size={16} className="animate-spin text-solaris-gold" /> : <Camera size={16} className="text-solaris-gold" />}
                        Audit Frame
                    </button>
                    {!isRecording ? (
                        <button 
                            onClick={startRecording}
                            className="flex items-center justify-center gap-2 p-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            <Video size={16} />
                            Record
                        </button>
                    ) : (
                        <button 
                            onClick={stopRecording}
                            className="flex items-center justify-center gap-2 p-3 bg-slate-100 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg border border-red-200"
                        >
                            <Square size={16} fill="currentColor" opacity="0.3" />
                            Stop
                        </button>
                    )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <ShieldCheck size={10} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Privacy Secured</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">LEX_NODE_V2.6</span>
                </div>
            </div>
        )}
      </div>
      <style>{`
          @keyframes scan {
              0% { transform: translateY(0); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(225px); opacity: 0; }
          }
      `}</style>
    </div>
  );
};
