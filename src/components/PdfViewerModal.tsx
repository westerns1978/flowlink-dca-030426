
import React from 'react';
import { X, Download, Share2, Printer, MessageSquare, Bot } from 'lucide-react';
import { triggerCricket } from '../utils/chatUtils';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ isOpen, onClose, pdfUrl, title }) => {
  if (!isOpen || !pdfUrl) return null;

  const handleAiAnalysis = () => {
      onClose();
      triggerCricket({
          prompt: `I just reviewed the ${title}. Can you analyze the key metrics and summarize any anomalies?`,
          contextType: 'REPORT',
          contextData: { reportName: title }
      });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full h-full max-w-6xl rounded-2xl shadow-2xl flex flex-col border border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                    <p className="text-xs text-slate-400 font-mono">Generated: {new Date().toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button 
                    onClick={handleAiAnalysis}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors border border-indigo-400/30"
                >
                    <Bot size={16} /> <span className="hidden sm:inline">Ask Cricket</span>
                </button>
                <div className="h-6 w-px bg-slate-700"></div>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Print">
                    <Printer size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Download">
                    <Download size={18} />
                </button>
                <button 
                    onClick={onClose}
                    className="p-2 bg-slate-700 hover:bg-red-600 text-white rounded-lg transition-colors ml-2"
                >
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* PDF Viewer Frame */}
        <div className="flex-1 bg-slate-500/50 relative">
            <iframe 
                src={pdfUrl} 
                className="w-full h-full border-0" 
                title="PDF Viewer"
            />
        </div>

      </div>
    </div>
  );
};
