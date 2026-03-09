import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Minimize2, Globe, AudioLines, Zap, Navigation2, Send, X, Bot } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { CRICKETS_KNOWLEDGE_BASE } from '../knowledgeBase';
import { AudioStore } from '../utils/audioStore';
import { flowHub, flowHubTools } from '../services/flowhub-mcp';
import { GroundedLocation } from '../services/mapsService';
import { supabase } from '../services/realtimeApi';

const ASSETS = {
  logo: "https://storage.googleapis.com/gemynd-public/projects/crickets/120925/crickets-logo.jpg",
  flowlinkIcon: "https://storage.googleapis.com/gemynd-public/projects/flowlink/flowlink-icon.jpg"
};

interface TranscriptItem {
  role: 'user' | 'model';
  text: string;
  isFinal?: boolean;
  isFlyer?: boolean;
  isBriefing?: boolean;
  groundingLinks?: GroundedLocation[];
}

export const CricketsChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [isBriefingActive, setIsBriefingActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const audioStore = useRef<AudioStore | null>(null);
  const sessionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const fetchLiveContext = async () => {
    try {
      const [devices, calls, invoices] = await Promise.all([
        supabase.from('devices').select('*', { count: 'exact', head: true }),
        supabase.from('service_calls').select('status, priority, total_cost, is_billed'),
        supabase.from('invoices').select('status, total, balance_due')
      ]);

      const openCount = calls.data?.filter(c => !['COMPLETED','CLOSED'].includes(c.status)).length || 0;
      const unbilledLabor = calls.data?.filter(c => !c.is_billed).reduce((s, c) => s + (c.total_cost || 0), 0) || 0;
      const overdueAmount = invoices.data?.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + (i.balance_due || 0), 0) || 0;

      return `\n\n[LIVE CONTEXT UPDATE]\nLive fleet: ${devices.count} devices synchronized. Open service calls: ${openCount}. Unbilled technician labor: $${unbilledLabor.toLocaleString()}. Overdue invoice balance: $${overdueAmount.toLocaleString()}. Use this specific data if the user asks for current fleet status.`;
    } catch (e) {
      return "\n\n[CONTEXT WARNING] Live context query failed. Fallback to baseline simulator values.";
    }
  };

  const connectSession = async (initialPrompt?: string) => {
    setConnectionStatus('connecting');
    try {
      const liveContext = await fetchLiveContext();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!audioStore.current) audioStore.current = new AudioStore();
      
      await audioStore.current.startRecording((base64) => {
         if (sessionRef.current && !isMuted) {
             try {
                 sessionRef.current.sendRealtimeInput({ 
                    media: { mimeType: "audio/pcm;rate=16000", data: base64 } 
                 });
             } catch (e) {}
         }
      });

      sessionRef.current = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setConnectionStatus('connected');
            if (initialPrompt) {
                setTimeout(() => {
                    sessionRef.current.sendRealtimeInput({ text: initialPrompt });
                    if (initialPrompt.includes('EXECUTIVE_BRIEFING')) {
                        setIsBriefingActive(true);
                        setTranscript(prev => [...prev, { 
                            role: 'user', 
                            text: "Establishing Link with Senior Advisor Cricket...", 
                            isFinal: true, 
                            isBriefing: true 
                        }]);
                    }
                }, 100);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
                audioStore.current?.clearBuffer();
                return;
            }

            const outputText = message.serverContent?.outputTranscription?.text;
            if (outputText) {
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'model' && !last.isFinal) return [...prev.slice(0, -1), { ...last, text: last.text + outputText }];
                else return [...prev, { role: 'model', text: outputText, isFinal: false }];
              });
            }

            if (message.serverContent?.turnComplete) {
               setTranscript(prev => {
                   if (prev.length === 0) return prev;
                   const last = prev[prev.length - 1];
                   const isFlyer = last.text.toLowerCase().includes('flyer') || last.text.toLowerCase().includes('outline');
                   return [...prev.slice(0, -1), { ...last, isFinal: true, isFlyer }];
               });
            }

            if (message.toolCall && sessionRef.current) {
              for (const call of message.toolCall.functionCalls) {
                const result = await flowHub.executeTool(call.name, call.args);
                sessionRef.current.sendToolResponse({ 
                  functionResponses: [{ id: call.id, name: call.name, response: { result: result } }] 
                });
              }
            }

            const parts = message.serverContent?.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                audioStore.current?.playAudioChunk(part.inlineData.data);
              }
            }
          },
          onclose: () => {
              setConnectionStatus('disconnected');
              setIsBriefingActive(false);
          },
          onerror: () => {
              setConnectionStatus('error');
              setIsBriefingActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Charon' }
            }
          },
          systemInstruction: CRICKETS_KNOWLEDGE_BASE + liveContext,
          tools: [{ functionDeclarations: flowHubTools }],
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        }
      });
    } catch (err) { setConnectionStatus('error'); }
  };

  useEffect(() => {
    const handleOpenWithPrompt = (e: any) => {
        const { prompt } = e.detail;
        if (!isOpen || connectionStatus === 'disconnected') {
            setIsOpen(true);
            connectSession(prompt);
        } else {
            sessionRef.current?.sendRealtimeInput({ text: prompt });
            if (prompt.includes('EXECUTIVE_BRIEFING')) setIsBriefingActive(true);
        }
    };
    window.addEventListener('open-cricket-chat', handleOpenWithPrompt);
    return () => window.removeEventListener('open-cricket-chat', handleOpenWithPrompt);
  }, [isOpen, connectionStatus]);

  const toggleChat = () => {
    if (!isOpen) { 
        setIsOpen(true); 
        connectSession(); 
    } else { 
        setIsOpen(false); 
        sessionRef.current?.close(); 
        audioStore.current?.stopRecording();
        audioStore.current?.clearBuffer();
        setConnectionStatus('disconnected'); 
        setIsBriefingActive(false);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || connectionStatus !== 'connected') return;
    
    setTranscript(prev => [...prev, { role: 'user', text: inputValue, isFinal: true }]);
    sessionRef.current?.sendRealtimeInput({ text: inputValue });
    setInputValue('');
  };

  return (
    <>
      <button
          onClick={toggleChat}
          className={`
              fixed bottom-6 right-6 z-50
              w-16 h-16
              rounded-full
              bg-slate-900 dark:bg-slate-800
              hover:bg-slate-800 dark:hover:bg-slate-700
              text-white
              shadow-xl shadow-black/20
              hover:shadow-2xl hover:shadow-black/30
              transition-all duration-300
              hover:scale-110 active:scale-95
              flex items-center justify-center
              ring-[3px] ring-white/20 dark:ring-white/10
              ring-offset-2 ring-offset-white dark:ring-offset-slate-950
              group
              ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
          `}
          title="Chat with Cricket AI"
      >
          <div className="relative">
              <img 
                  src={ASSETS.logo} 
                  alt="Cricket" 
                  className="w-11 h-11 rounded-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 dark:border-slate-800">
                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40"></div>
              </div>
          </div>
      </button>

      <div className={`fixed bottom-20 right-6 z-50 w-96 h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        
        <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 rounded-t-2xl flex justify-between items-center shrink-0">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-sm border-2 border-white/10 overflow-hidden">
                 <img src={ASSETS.logo} alt="Cricket" className="w-8 h-8 rounded-full object-cover" />
              </div>
              <div>
                 <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cricket</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                 </div>
                 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">FlowLink AI Advisor</p>
              </div>
           </div>
           <button onClick={toggleChat} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg"><X size={18} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {transcript.length === 0 && connectionStatus === 'connected' && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40 grayscale">
                    <AudioLines size={32} className="text-slate-400" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Command</p>
                </div>
            )}

            {transcript.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1.5 animate-in slide-in-from-bottom-1 duration-300`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none font-medium' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>

        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-3 rounded-b-2xl shrink-0">
            <form onSubmit={handleSendText} className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask Cricket about your fleet..."
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl p-2.5 transition-all shadow-sm active:scale-95"
                >
                    <Send size={18} />
                </button>
                <button 
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${isMuted ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}
                >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
            </form>
            <p className="text-[8px] text-slate-400 font-mono text-center mt-2 uppercase tracking-widest opacity-60">Handshake Secured • LEX-NODE-PROD</p>
        </div>
      </div>
    </>
  );
};
