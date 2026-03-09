
import React, { useState } from 'react';
import { Building2, Wifi, ShieldCheck, Mail, Plus, Map as MapIcon, List, Search, MapPin, Navigation, ExternalLink, Loader2 } from 'lucide-react';
import { MOCK_SITES } from '../constants';
import { MapVisualizer } from './MapVisualizer';
import { triggerCricket } from '../utils/chatUtils';
import { searchServiceLocations, GroundedLocation } from '../services/mapsService';

export const SiteManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [groundedInfrastructure, setGroundedInfrastructure] = useState<GroundedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleGroundingSearch = async (site: any) => {
    setIsSearching(true);
    setGroundedInfrastructure([]);
    try {
        const locations = await searchServiceLocations(site.address);
        setGroundedInfrastructure(locations);
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">Customer Sites</h2>
           <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Manage deployment locations and real-world verified service hubs.</p>
        </div>
        
        <div className="flex gap-3">
             <div className="flex bg-white/60 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-300 dark:border-slate-700 backdrop-blur-sm shadow-sm">
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                    <List size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('map')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                >
                    <MapIcon size={18} />
                </button>
             </div>
             
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg transition-all text-sm font-bold active:scale-95">
                <Plus size={16} /> New Deployment
            </button>
        </div>
      </div>

      {viewMode === 'map' ? (
          <div className="h-[600px] w-full rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
              <MapVisualizer />
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
            {MOCK_SITES.map((site) => (
            <div 
                key={site.id} 
                className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col lg:flex-row gap-8 transition-all hover:border-solaris-gold/30"
            >
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 border border-slate-200 dark:border-slate-700">
                            <Building2 size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{site.name}</h3>
                            <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                <MapPin size={12} className="text-red-500" /> {site.address}
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => handleGroundingSearch(site)}
                            disabled={isSearching}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-solaris-gold text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                            Nearby Support Hubs
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                            <Mail size={14} /> Contact Admin
                        </button>
                    </div>

                    {/* Grounded Results Pane */}
                    {groundedInfrastructure.length > 0 && (
                        <div className="mt-6 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 animate-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Navigation size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Maps Verified Infrastructure</span>
                            </div>
                            <div className="space-y-2">
                                {groundedInfrastructure.map((loc, i) => (
                                    <a 
                                        key={i} 
                                        href={loc.uri} 
                                        target="_blank" 
                                        className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-solaris-gold transition-all group"
                                    >
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{loc.name}</span>
                                        <ExternalLink size={12} className="text-slate-400 group-hover:text-solaris-gold" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:w-80 space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Connectivity Node</span>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wifi size={14} className="text-cyan-500" />
                                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">{site.wifiSSID}</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">STABLE</span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Compliance Status</span>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={14} className="text-indigo-500" />
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Firewall Pass</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                        </div>
                    </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};
