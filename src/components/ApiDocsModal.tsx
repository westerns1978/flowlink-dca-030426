
import React, { useState } from 'react';
import { X, Server, Database, Globe, Shield, Code, Zap, Cpu, Layers, Box, Terminal, Copy, Check, PlayCircle, Command, Link, Network } from 'lucide-react';
import { BACKEND_URL } from '../constants';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'api' | 'mcp' | 'curl'>('specs');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const TechStackItem = ({ icon: Icon, title, desc, details }: any) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <Icon size={18} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h4 className="font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {details.map((tag: string, i: number) => (
          <span key={i} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-mono font-bold">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const EndpointBlock = ({ method, path, desc, payload }: any) => (
    <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-8 last:border-0">
       <div className="flex items-center gap-3 mb-3">
          <span className={`px-2 py-1 rounded-md text-xs font-bold font-mono ${
              method === 'POST' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              method === 'TOOL' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
              {method}
          </span>
          <code className="text-sm font-bold text-slate-700 dark:text-slate-300">{path}</code>
       </div>
       <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{desc}</p>
       
       {payload && (
         <div className="bg-slate-900 rounded-lg p-4 relative group">
            <button 
                onClick={() => handleCopy(payload, path)}
                className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copiedId === path ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {payload}
            </pre>
         </div>
       )}
    </div>
  );

  const CurlBlock = ({ title, command }: { title: string, command: string }) => (
    <div className="mb-8">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <Terminal size={14} className="text-slate-500" /> {title}
        </h4>
        <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 relative group">
             <button 
                onClick={() => handleCopy(command, title)}
                className="absolute top-3 right-3 p-1.5 text-slate-500 hover:text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copiedId === title ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <code className="text-xs font-mono text-cyan-300 break-all whitespace-pre-wrap">
                {command}
            </code>
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-lg shadow-emerald-500/30">
                 <Terminal size={20} />
              </div>
              <div>
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Crickets Continuum Developer Portal</h2>
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">API Version 2.5.0-live</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
             <X size={20} />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
           {[
               { id: 'specs', label: 'Tech Stack', icon: Layers },
               { id: 'api', label: 'REST API', icon: Globe },
               { id: 'curl', label: 'Integration Tests', icon: Command },
               { id: 'mcp', label: 'MCP Tools', icon: Box },
           ].map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[140px] py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                      activeTab === tab.id 
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10' 
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
               >
                   <tab.icon size={16} /> {tab.label}
               </button>
           ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-black/20">
            
            {/* TAB: SPECS */}
            {activeTab === 'specs' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TechStackItem 
                            icon={Globe}
                            title="Frontend / PWA"
                            desc="Progressive Web App built for offline-first resilience in warehouse environments."
                            details={['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Recharts']}
                        />
                        <TechStackItem 
                            icon={Server}
                            title="Middleware (DCA)"
                            desc="Local aggregation agent running on-premise to buffer robot telemetry."
                            details={['Python 3.11', 'FastAPI', 'SQLite (WAL Mode)', 'WebSockets', 'AsyncIO']}
                        />
                        <TechStackItem 
                            icon={Network}
                            title="SNMP Agent Simulation"
                            desc="Exposes a Virtual MIB so legacy copier tools (FMAudit) can 'scan' the robot."
                            details={['PySNMP', 'Virtual OIDs', 'Read-Only Community', 'Port 161']}
                        />
                        <TechStackItem 
                            icon={Link}
                            title="WestFlow Connector"
                            desc="Authorized ESN endpoint for pushing AI-generated Service Calls to E-automate."
                            details={['ESN 23.0+', 'Service Call API', 'Write-Back', 'Custom Properties']}
                        />
                         <TechStackItem 
                            icon={Shield}
                            title="ERP Integration"
                            desc="Secure, encrypted tunnel to E-automate via ECI Equipment Solutions Network."
                            details={['ECI ESN', 'Port 9780', 'Blowfish Encryption', 'CoExecutive User']}
                        />
                        <TechStackItem 
                            icon={Zap}
                            title="AI / Reasoning"
                            desc="Multi-model agentic system for insights and conversational interface."
                            details={['Gemini 2.5 Flash', 'Gemma 2 (Edge)', 'Live API (WebRTC)']}
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Architecture Topology</h3>
                        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-around px-12">
                             {/* Diagram Lines */}
                             <div className="absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-slate-300 dark:bg-slate-700 -z-0"></div>

                             <div className="z-10 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2">
                                <Cpu size={24} className="text-indigo-500" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Robot (Edge)</span>
                             </div>

                             <div className="z-10 bg-white dark:bg-slate-900 p-4 rounded-lg border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 flex flex-col items-center gap-2">
                                <Server size={24} className="text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">ECI ESN (9780)</span>
                             </div>

                             <div className="z-10 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2">
                                <Globe size={24} className="text-blue-500" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">GCP (Cloud)</span>
                             </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 text-center max-w-2xl mx-auto">
                            WestFlow uses the <strong>Standard ESN Pattern</strong> (Port 9780) to securely inject meter reads into the E-automate SQL database. Service Calls are written back via the WestFlow ESN Connector, respecting the ERP as the system of record.
                        </p>
                    </div>
                </div>
            )}

            {/* TAB: API */}
            {activeTab === 'api' && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto">
                     <div className="prose dark:prose-invert max-w-none mb-8">
                         <h3>REST API Reference</h3>
                         <p className="text-slate-600 dark:text-slate-400">
                             Base URL: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold">{BACKEND_URL}/api/v1</code>
                         </p>
                     </div>

                     <EndpointBlock 
                        method="POST"
                        path="/ingest/telemetry"
                        desc="Primary endpoint for robots to report status, odometer readings, and billing events."
                        payload={`{
  "device_id": "Q-C2-8851",
  "timestamp": "2025-02-14T10:42:00Z",
  "metrics": {
    "odometer_meters": 14502.5,
    "battery_level": 88.2,
    "cpu_load": 14
  },
  "billing_events": [
    {
      "type": "TASK_COMPLETED",
      "task_id": "TSK-9921",
      "revenue_code": "CPT_TIER_2"
    }
  ]
}`}
                     />

                    <EndpointBlock 
                        method="GET"
                        path="/fleet/sync"
                        desc="Returns the current synchronized state of the fleet for a specific site."
                        payload={`[
  {
    "id": "dev_001",
    "status": "ONLINE",
    "last_seen": "2s ago",
    "config": {
       "rate_plan": "RAAS_PRO"
    }
  }
]`}
                     />

                    <EndpointBlock 
                        method="POST"
                        path="/alerts/webhook"
                        desc="Inbound webhook for hardware faults (LIDAR, E-Stop) triggered by the robot OS."
                        payload={`{
  "severity": "CRITICAL",
  "code": "NAV_STACK_TIMEOUT",
  "msg": "Robot stuck in hallway 4B",
  "source": "Q-C2-8851"
}`}
                     />
                 </div>
            )}

            {/* TAB: CURL */}
            {activeTab === 'curl' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto">
                    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Validation Tests</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Run these commands from your terminal or CI/CD pipeline to verify backend connectivity.
                        </p>
                    </div>

                    <CurlBlock 
                        title="1. Health Check (Ping)" 
                        command={`curl -X GET ${BACKEND_URL}/`} 
                    />

                    <CurlBlock 
                        title="2. Send Telemetry (Simulate Robot Heartbeat)" 
                        command={`curl -X POST ${BACKEND_URL}/api/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "manual-test-001",
    "timestamp": "${new Date().toISOString()}",
    "device": { 
       "serial": "CURL-TEST-BOT", 
       "customer": "IT-OPS-TEST",
       "ip": "10.0.0.99"
    },
    "metrics": { 
       "battery_level": 99.5, 
       "CPLF_odometer_meters": 1250.0,
       "CPTT_runtime_minutes": 45
    }
  }'`} 
                    />

                    <CurlBlock 
                        title="3. Retrieve Fleet Status" 
                        command={`curl -X GET ${BACKEND_URL}/api/fleet`} 
                    />
                    
                    <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-sm text-amber-800 dark:text-amber-200 rounded-r-lg">
                        <strong>Note:</strong> If you are running the DCA locally (not using the cloud backend), change the URL to <code>http://localhost:8080</code>.
                    </div>
                </div>
            )}

            {/* TAB: MCP */}
            {activeTab === 'mcp' && (
                 <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-w-4xl mx-auto">
                     <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 p-6 rounded-xl mb-8">
                         <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-2">
                             <Box size={20} /> Model Context Protocol (MCP)
                         </h3>
                         <p className="text-sm text-indigo-800 dark:text-indigo-200">
                             These tool definitions are exposed to the Gemini AI agent ("Cricket"). 
                             They allow the LLM to query the fleet database and perform actions on behalf of the user.
                         </p>
                     </div>

                     <EndpointBlock 
                        method="TOOL"
                        path="get_fleet_billing_summary"
                        desc="Retrieves accrued revenue and projected totals for the current billing period."
                        payload={`// Input Schema
{
  "customer_id": "string (optional)"
}

// Output Schema
{
  "period": "February 2025",
  "accrued_revenue": 4500.00,
  "projected_total": 5200.00,
  "currency": "USD"
}`}
                     />

                    <EndpointBlock 
                        method="TOOL"
                        path="create_service_ticket"
                        desc="Bridges the gap between the DCA and the E-automate ERP to dispatch technicians."
                        payload={`// Input Schema
{
  "device_id": "string (required)",
  "issue_summary": "string (required)",
  "priority": "Critical | High | Medium | Low"
}

// Output Schema
{
  "ticket_number": "TKT-88421",
  "status": "QUEUED",
  "estimated_response": "4h"
}`}
                     />
                 </div>
            )}

        </div>
      </div>
    </div>
  );
};
