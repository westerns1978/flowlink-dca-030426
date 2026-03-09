
import React, { useState } from 'react';
import { RefreshCw, Play, CloudLightning, Shield, AlertCircle, Terminal, FileText, ChevronRight, Server, Database, Globe, Laptop, ArrowRight, Activity, Book, Link, CheckCircle2, Wrench } from 'lucide-react';
import { MOCK_DCAS, BACKEND_URL } from '../constants';
import { ApiDocsModal } from './ApiDocsModal';
import westflow from '../services/westflow-client';

export const DCAStatus: React.FC = () => {
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);
  
  // Connection Test State
  const [apiStatus, setApiStatus] = useState<'IDLE' | 'TESTING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [apiLatency, setApiLatency] = useState<number>(0);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<any>(null);

  const handleTestConnection = async () => {
      setApiStatus('TESTING');
      setRawResponse('');
      setErrorDetails(null);
      const start = Date.now();
      
      try {
          // Use the real WestFlow client to test the CRICKET agent
          const response = await westflow.call('CRICKET', 'get_fleet_status', {});
          const end = Date.now();
          setApiLatency(end - start);
          
          if (response.success) {
              setApiStatus('CONNECTED');
              setRawResponse(JSON.stringify(response.data, null, 2));
          } else {
              setApiStatus('ERROR');
              setRawResponse(response.error || 'Unknown Error');
              setErrorDetails(response.debug);
          }
      } catch (e: any) {
          setApiStatus('ERROR');
          setRawResponse(`Unexpected Exception: ${e.message}`);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <ApiDocsModal isOpen={isApiOpen} onClose={() => setIsApiOpen(false)} />

      {/* Backend Debugger */}
      <div className="bg-slate-900 dark:bg-black rounded-xl p-6 shadow-xl border border-slate-700 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <CloudLightning size={24} className="text-cyan-400" />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-white">Cloud Pipeline Diagnostics</h3>
                      <p className="text-xs text-slate-400 font-mono">SUPABASE_ORCHESTRATOR :: AGENT_CRICKET</p>
                  </div>
              </div>
              <div className="flex gap-2">
                <button 
                    onClick={handleTestConnection}
                    disabled={apiStatus === 'TESTING'}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                    {apiStatus === 'TESTING' ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                    Ping Cricket Agent
                </button>
              </div>
          </div>

          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs border border-slate-800 min-h-[120px] max-h-[300px] overflow-y-auto relative">
              {apiStatus === 'IDLE' && <span className="text-slate-600 italic">Waiting for manual trigger...</span>}
              {apiStatus === 'TESTING' && <span className="text-cyan-500 animate-pulse">Requesting payload from Supabase Edge...</span>}
              
              {apiStatus === 'ERROR' && (
                  <div className="space-y-4">
                      <div className="text-red-400">
                          <strong className="text-sm">❌ CONNECTION FAILURE</strong>
                          <div className="mt-2 p-3 bg-red-950/30 border border-red-900/50 rounded text-red-200">
                            {rawResponse}
                          </div>
                      </div>
                      
                      {rawResponse.includes('fetch') && (
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 animate-in slide-in-from-top-2">
                            <h5 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
                                <Wrench size={14} /> Potential Fix: CORS Check
                            </h5>
                            <p className="text-slate-400 text-[10px] leading-relaxed mb-3">
                                A "Failed to fetch" error usually means your browser blocked the request because the Supabase Edge Function is not returning correct CORS headers for the "agent" header.
                            </p>
                            <ul className="space-y-1 text-[9px] text-slate-500">
                                <li>• Check if you have an ad-blocker or VPN interference</li>
                                <li>• Ensure the Supabase Anon Key is current</li>
                                <li>• Try opening the Dashboard in a Private/Incognito window</li>
                            </ul>
                        </div>
                      )}
                  </div>
              )}

              {apiStatus === 'CONNECTED' && (
                  <div>
                      <div className="flex items-center gap-4 mb-3 pb-2 border-b border-slate-800">
                          <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> STATUS: 200 OK</span>
                          <span className="text-slate-500">LATENCY: {apiLatency}ms</span>
                      </div>
                      <div className="text-slate-500 mb-1 uppercase tracking-tighter text-[9px] font-bold">Raw Payload Data:</div>
                      <pre className="text-emerald-300 whitespace-pre-wrap break-all">{rawResponse}</pre>
                  </div>
              )}
          </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">DCA Management</h2>
           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Monitor middleware agents and cloud orchestrator status.</p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={() => setIsApiOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all text-sm font-medium border border-slate-300 dark:border-slate-700"
            >
              <Book size={16} /> API Docs
            </button>
             <button 
                onClick={() => setIsArchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm font-medium"
            >
              <Activity size={16} /> Topology
            </button>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl shadow-lg border border-slate-300 dark:border-slate-700 overflow-hidden group">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 dark:bg-slate-800/90 border-b border-slate-300 dark:border-slate-700">
              <th className="py-3 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Site Name</th>
              <th className="py-3 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">DCA Version</th>
              <th className="py-3 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">IP Address</th>
              <th className="py-3 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
              <th className="py-3 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {enrichedDCAs.map((dca) => (
              <tr key={dca.id} className="even:bg-slate-50/60 dark:even:bg-slate-800/40 hover:bg-cyan-50/40 dark:hover:bg-cyan-900/30 transition-colors">
                <td className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm">{dca.siteName}</td>
                <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 font-mono text-xs">{dca.version}</td>
                <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 font-mono text-xs">{dca.ipAddress}</td>
                <td className="py-3.5 px-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${
                    dca.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {dca.status}
                  </div>
                </td>
                <td className="py-3.5 px-6 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-emerald-500"><RefreshCw size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const enrichedDCAs = [
    ...MOCK_DCAS,
    {
      id: 'dca-nav-001',
      siteName: 'Managed IT (Naverisk)',
      version: 'v1.2',
      status: 'Active',
      lastCheckIn: '2025-02-14 11:00 AM',
      ipAddress: '10.200.1.5'
    }
];
