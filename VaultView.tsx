
import React, { useState, useEffect } from 'react';
import { HardDrive, Search, FileText, Download, Loader2, Calendar, ShieldCheck, LayoutGrid, List, Trash2, Zap, Database } from 'lucide-react';
import { storageService, VaultFile } from '../services/storageService';
import { IngestionNode } from './IngestionNode';

export const VaultView: React.FC = () => {
    const [files, setFiles] = useState<VaultFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadVault();
    }, []);

    const loadVault = async () => {
        setLoading(true);
        try {
            const data = await storageService.listVault();
            setFiles(data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (file: VaultFile) => {
        if (!confirm(`Permanently remove ${file.file_name} and its AI DNA from the vault?`)) return;
        setIsDeleting(file.id);
        try {
            await storageService.deleteFile(file);
            setFiles(prev => prev.filter(f => f.id !== file.id));
        } catch (e) {
            alert("Deletion failure on Lexington node.");
        } finally {
            setIsDeleting(null);
        }
    };

    const filteredFiles = files.filter(f => 
        f.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.metadata?.dna?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.metadata?.dna?.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-solaris-gold rounded-2xl text-slate-900 shadow-lg shadow-solaris-gold/20">
                            <HardDrive size={28} />
                        </div>
                        Strategic Neural Vault
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Consolidated Asset Storage & AI DNA Processing Hub.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search Node DNA..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-9 pr-4 py-2.5 bg-white/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-solaris-gold/40 outline-none backdrop-blur-md transition-all"
                        />
                    </div>
                    <div className="flex bg-white/60 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-solaris-gold text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                            <LayoutGrid size={18} />
                        </button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-solaris-gold text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Consolidating Upload into the main view */}
            <div className="max-w-2xl">
                <IngestionNode assetId="GLOBAL" onComplete={() => loadVault()} />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="relative">
                        <Loader2 size={40} className="animate-spin text-solaris-gold" />
                        <div className="absolute inset-0 blur-xl bg-solaris-gold/20 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Synchronizing Neural Nodes...</span>
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 p-20 text-center shadow-inner">
                    <Database size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4 opacity-50" />
                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Vault Baseline Empty</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">Drop service manuals, contracts, or fleet telemetry logs above to begin strategic ingestion.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFiles.map((file) => (
                        <div key={file.id} className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-md hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ring-1 ring-slate-900/5 dark:ring-white/5 hover:border-solaris-gold/40 relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${file.metadata?.dna?.document_type === 'INVOICE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-solaris-gold/10 text-solaris-gold'}`}>
                                    <FileText size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <a href={file.public_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-solaris-gold hover:bg-solaris-gold/10 rounded-full transition-colors">
                                        <Download size={18} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(file)}
                                        disabled={isDeleting === file.id}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        {isDeleting === file.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-solaris-gold transition-colors truncate">
                                {file.metadata?.dna?.title || file.file_name}
                            </h3>
                            
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 leading-relaxed h-10">
                                {file.metadata?.dna?.summary || 'Asset analyzed and persisted.'}
                            </p>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {file.metadata?.dna?.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase rounded-md border border-slate-200 dark:border-slate-700">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase rounded-md border border-indigo-500/20">
                                        {file.metadata?.dna?.document_type || 'OTHER'}
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                                            {new Date(file.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50">
                                        <ShieldCheck size={10} className="text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Asset</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Class</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronized</th>
                                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredFiles.map(file => (
                                <tr key={file.id} className="hover:bg-solaris-gold/5 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-900 rounded-lg text-solaris-gold">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-solaris-gold transition-colors">{file.metadata?.dna?.title || file.file_name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono">{(file.file_size / 1024).toFixed(1)} KB • {file.file_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black rounded-md uppercase border border-slate-200 dark:border-slate-700">
                                            {file.metadata?.dna?.document_type || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                                            <Calendar size={12} /> {new Date(file.uploaded_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <a href={file.public_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-solaris-gold transition-colors inline-block p-2">
                                                <Download size={18} />
                                            </a>
                                            <button onClick={() => handleDelete(file)} className="text-slate-400 hover:text-red-500 transition-colors inline-block p-2">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
