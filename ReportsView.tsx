
import React, { useState } from 'react';
import { Calendar, Download, ChevronRight, FileBarChart, Loader2, CheckCircle2, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PdfViewerModal } from './PdfViewerModal';

export const ReportsView: React.FC = () => {
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null);
  const [currentReportTitle, setCurrentReportTitle] = useState('');

  const reports = [
    { id: 1, name: 'Monthly Billing Summary', desc: 'Consolidated billing meters (CPT/CPTT) for all active contracts.', lastRan: 'Yesterday', type: 'BILLING' },
    { id: 2, name: 'Device Volume Report', desc: 'Detailed task and runtime volume trends by site.', lastRan: '02/13/2025', type: 'VOLUME' },
    { id: 3, name: 'Supply Usage History', desc: 'Battery charge cycles and maintenance part logs.', lastRan: 'Never', type: 'SUPPLY' },
    { id: 4, name: 'Device Uptime Summary', desc: 'Availability percentages and downtime error codes.', lastRan: '02/01/2025', type: 'UPTIME' },
  ];

  const generateAndOpenPdf = (reportName: string, reportType: string) => {
    setGeneratingPdf(true);
    
    // Simulate Processing Delay
    setTimeout(() => {
        try {
            const doc: any = new jsPDF();
            
            // --- HEADER ---
            doc.setFontSize(22);
            doc.setTextColor(33, 44, 55); 
            doc.text((reportName || '').toUpperCase(), 14, 22);
            
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
            doc.text("Source: Crickets Continuum DCA", 14, 35);

            // --- DEALER INFO (Right Side) ---
            doc.setFontSize(12);
            doc.setTextColor(33, 44, 55);
            doc.text("PDS Dealer Services", 200, 22, { align: "right" });
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text("1200 Robot Way, Suite 400", 200, 30, { align: "right" });
            doc.text("Atlanta, GA 30308", 200, 35, { align: "right" });

            doc.setDrawColor(200, 200, 200);
            doc.line(14, 45, 196, 45); // Horizontal Line

            // --- DYNAMIC CONTENT BASED ON REPORT TYPE ---
            let head = [];
            let body = [];

            if (reportType === 'BILLING') {
                head = [['Item / Description', 'Asset ID', 'Meter Type', 'Previous', 'Current', 'Usage', 'Rate', 'Total']];
                body = [
                    ['Quasi C2 (Logistics Robot)', 'AST-0044', 'Runtime (Min)', '10,000', '10,402', '402', '$0.05', '$20.10'],
                    ['Quasi C2 (Logistics Robot)', 'AST-0044', 'Tasks (Deliveries)', '950', '994', '44', '$0.75', '$33.00'],
                    ['Quasi C2 (Logistics Robot)', 'AST-0045', 'Runtime (Min)', '9,500', '9,820', '320', '$0.05', '$16.00'],
                    ['Quasi C2 (Logistics Robot)', 'AST-0045', 'Tasks (Deliveries)', '680', '710', '30', '$0.75', '$22.50'],
                    ['Konica Minolta C458', 'AST-1001', 'Black (Clicks)', '119,500', '120,000', '500', '$0.012', '$6.00'],
                    ['Konica Minolta C458', 'AST-1001', 'Color (Clicks)', '34,000', '34,200', '200', '$0.085', '$17.00'],
                ];
            } else if (reportType === 'UPTIME') {
                head = [['Asset ID', 'Model', 'Site', 'Uptime %', 'Downtime (Hrs)', 'Primary Error']];
                body = [
                    ['AST-0044', 'Quasi C2', 'Warehouse A', '99.8%', '0.5', 'None'],
                    ['AST-0045', 'Quasi C2', 'Warehouse A', '99.5%', '1.2', 'Network Timeout'],
                    ['AST-8853', 'Quasi C2', 'Hospital Lobby', '82.0%', '48.0', 'LIDAR_OBSTRUCTION'],
                    ['AST-1001', 'KM C458', 'Finance', '99.9%', '0.1', 'None'],
                ];
            } else {
                // Generic Fallback
                head = [['Metric', 'Value', 'Trend', 'Notes']];
                body = [
                    ['Total Fleet Size', '24 Units', '+2', 'New deployment at Acme'],
                    ['Average Battery Health', '94%', '-1%', 'Normal degradation'],
                    ['Total Distance (This Week)', '450km', '+12%', 'High activity'],
                ];
            }

            // --- TABLE ---
            doc.autoTable({
                startY: 55,
                head: head,
                body: body,
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' }, // Emerald header
                footStyles: { fillColor: [241, 245, 249], textColor: 33, fontStyle: 'bold' },
                styles: { fontSize: 8, cellPadding: 3 },
                columnStyles: { 0: { cellWidth: 40 } }
            });

            // --- TOTALS (Only for Billing) ---
            if (reportType === 'BILLING') {
                const finalY = (doc as any).lastAutoTable.finalY + 10;
                doc.setFontSize(10);
                doc.setTextColor(33, 44, 55);
                doc.text("Subtotal:", 160, finalY, { align: "right" });
                doc.text("$114.60", 196, finalY, { align: "right" });
                doc.setFontSize(14);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(16, 185, 129); // Emerald
                doc.text("Total Due:", 160, finalY + 12, { align: "right" });
                doc.text("$114.60", 196, finalY + 12, { align: "right" });
            }

            // --- FOOTER ---
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(150);
            doc.text("Confidential Property of PDS Dealer Services.", 14, 280);
            doc.text("Generated by Crickets Continuum v2.5", 14, 284);

            // Generate Blob URL instead of saving
            const pdfBlob = doc.output('bloburl');
            setCurrentPdfUrl(pdfBlob.toString());
            setCurrentReportTitle(reportName);
            setViewerOpen(true);
            setGeneratingPdf(false);

        } catch (e) {
            console.error("PDF Generation Error:", e);
            setGeneratingPdf(false);
        }
    }, 1000);
  };

  return (
    <>
    <PdfViewerModal 
        isOpen={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        pdfUrl={currentPdfUrl}
        title={currentReportTitle}
    />

    <div className="space-y-6 animate-in fade-in duration-500">
       <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Reports Center</h2>
           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Generate and export billing and operational reports.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Report List */}
        <div className="lg:col-span-2 space-y-4">
           {reports.map((report) => (
             <div 
               key={report.id} 
               onClick={() => generateAndOpenPdf(report.name, report.type)}
               className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm transition-all duration-300 cursor-pointer group ring-1 ring-slate-900/5 dark:ring-white/5 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-400/50"
             >
               <div className="flex justify-between items-center">
                 <div className="flex items-start gap-5">
                    <div className="p-3.5 bg-gradient-to-br from-cyan-50 to-emerald-50 dark:from-cyan-900/30 dark:to-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 group-hover:from-cyan-100 dark:group-hover:from-cyan-800/40 group-hover:to-emerald-100 dark:group-hover:to-emerald-800/40 transition-colors shadow-inner border border-slate-200/50 dark:border-slate-600/50 group-hover:border-emerald-200 dark:group-hover:border-emerald-600/50">
                      <FileBarChart size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{report.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{report.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-3 font-mono bg-slate-50 dark:bg-slate-700/50 inline-block px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                        Last Generated: {report.lastRan}
                      </p>
                    </div>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-full border border-slate-100 dark:border-slate-600 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:border-emerald-200 dark:group-hover:border-emerald-700 transition-colors">
                    <ChevronRight size={20} className="text-slate-300 dark:text-slate-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                 </div>
               </div>
             </div>
           ))}
        </div>

        {/* Configuration Panel */}
        <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg p-6 rounded-xl border border-slate-200/60 dark:border-slate-700/60 h-fit shadow-xl ring-1 ring-slate-900/5 dark:ring-white/5">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
            Report Parameters
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Start Date</label>
              <input type="date" className="w-full px-3 py-2.5 border border-slate-300/60 dark:border-slate-600/60 rounded-lg bg-white/60 dark:bg-slate-700/60 text-sm text-slate-700 dark:text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-sm hover:bg-white dark:hover:bg-slate-600" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">End Date</label>
              <input type="date" className="w-full px-3 py-2.5 border border-slate-300/60 dark:border-slate-600/60 rounded-lg bg-white/60 dark:bg-slate-700/60 text-sm text-slate-700 dark:text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-sm hover:bg-white dark:hover:bg-slate-600" />
            </div>
            
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3">
               <button 
                 onClick={() => generateAndOpenPdf('Invoice Preview', 'BILLING')}
                 disabled={generatingPdf}
                 className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-bold rounded-lg text-sm hover:from-cyan-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
               >
                 {generatingPdf ? (
                     <>
                        <Loader2 size={16} className="animate-spin" /> Generating...
                     </>
                 ) : (
                     <>
                        <Eye size={16} /> Generate & View Invoice
                     </>
                 )}
               </button>
               <div className="flex gap-3">
                 <button className="flex-1 py-2 bg-white/60 dark:bg-slate-700/60 border border-slate-300/60 dark:border-slate-600/60 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-sm hover:bg-white dark:hover:bg-slate-600 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex justify-center items-center gap-2 backdrop-blur-sm shadow-sm hover:shadow active:scale-95">
                   <Download size={14} /> CSV
                 </button>
                 <button className="flex-1 py-2 bg-white/60 dark:bg-slate-700/60 border border-slate-300/60 dark:border-slate-600/60 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-sm hover:bg-white dark:hover:bg-slate-600 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex justify-center items-center gap-2 backdrop-blur-sm shadow-sm hover:shadow active:scale-95">
                   <Download size={14} /> XLSX
                 </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};
