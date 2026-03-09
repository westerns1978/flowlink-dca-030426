
import React, { useEffect, useRef } from 'react';
import { Terminal, X, Minimize2, ArrowDown } from 'lucide-react';
import { AgentEvent } from '../utils/agentSimulator';

interface LiveLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentEvent[];
}

export const LiveLogDrawer: React.FC<LiveLogDrawerProps> = ({ isOpen, onClose, logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  return (
    <div 
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {/* Terminal Header */}
      <div className="bg-slate-900 border-t border-emerald-500/50 p-2 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
         <div className="flex items-center gap-2 px-4">
            <Terminal size={18} className="text-emerald-400 animate-pulse" />
            <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider">C2_DCA_STREAM :: WEB_SOCKET_LISTENER</span>
            <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">LIVE</span>
         </div>
         <div className="flex gap-2">
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
               <Minimize2 size={18} />
            </button>
            <button onClick={onClose} className="p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400 transition-colors">
               <X size={18} />
            </button>
         </div>
      </div>

      {/* Terminal Body */}
      <div className="bg-slate-950 h-64 overflow-y-auto p-4 font-mono text-xs scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-slate-900 text-slate-400">
         {logs.length === 0 && (
             <div className="text-slate-600 italic px-4">Waiting for telemetry stream...</div>
         )}
         
         {logs.map((log) => (
           <div key={log.id} className="mb-1.5 border-l-2 border-slate-800 pl-2 hover:border-emerald-600 hover:bg-slate-900/50 transition-colors group">
              <div className="flex gap-3 text-slate-500">
                  <span className="text-emerald-700 w-36 shrink-0">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                  <span className={`font-bold w-24 shrink-0 ${
                      log.type === 'BILLING_EVENT' ? 'text-cyan-400' : 
                      log.type === 'SYSTEM_ALERT' ? 'text-red-400' :
                      log.type === 'HEARTBEAT' ? 'text-slate-600' : 'text-emerald-600'
                  }`}>
                      {log.type}
                  </span>
                  <span className="text-slate-300 font-bold">{log.robotId}</span>
              </div>
              <div className="text-slate-400 pl-40 group-hover:text-emerald-200 break-all">
                  <span className="text-slate-600 mr-2">{'>'}</span>
                  {log.rawJson}
              </div>
           </div>
         ))}
         <div ref={bottomRef} />
      </div>
    </div>
  );
};
