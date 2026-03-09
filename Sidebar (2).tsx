import React from 'react';
import { LayoutDashboard, ServerCog, Cpu, AlertTriangle, Building2, Settings, X, Database, Wrench, HardDrive, Layers, Activity, BookOpen } from 'lucide-react';
import { usePersistentSession } from '../hooks/usePersistentSession';

interface SidebarProps {
  activeView: string;
  setView: (view: string) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isMobileOpen = false, setIsMobileOpen }) => {
  const { user } = usePersistentSession();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live_fleet', label: 'Live Fleet', icon: Activity },
    { id: 'devices', label: 'Device Registry', icon: Cpu },
    { id: 'vault', label: 'Document Vault', icon: HardDrive },
    { id: 'tech_spec', label: 'Blueprint', icon: Layers }, 
    { id: 'docs', label: 'Showroom', icon: BookOpen }, 
    { id: 'simulation', label: 'Simulator', icon: ServerCog },
    { id: 'erp_mirror', label: 'ERP Bridge', icon: Database }, 
    { id: 'sites', label: 'Facilities', icon: Building2 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'tech_mode', label: 'Field Service', icon: Wrench }, 
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
        ></div>
      )}

      <div className={`
        fixed inset-y-0 left-0 w-64 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 flex flex-col h-full border-r border-slate-200 dark:border-white/5 z-50 shadow-xl transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-transparent">
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="relative group-hover:scale-110 transition-all duration-500">
                <img 
                src="https://storage.googleapis.com/gemynd-public/projects/flowlink/flowlink-icon.jpg" 
                alt="FlowLink" 
                className="h-10 w-10 object-contain ring-2 ring-emerald-500/20 shadow-xl rounded-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-100 dark:border-slate-900 flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 dark:text-white tracking-tighter leading-none text-xl uppercase">FlowLink</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-500 font-black mt-1 opacity-80">Hub</span>
            </div>
          </div>
          <button className="lg:hidden p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400" onClick={() => setIsMobileOpen && setIsMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 space-y-1.5 px-4 custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black transition-all duration-300 group relative overflow-hidden uppercase tracking-[0.2em] ${
                    isActive 
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon size={16} className={`${isActive ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
                  )}
                </button>
              );
            })}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-emerald-600 dark:text-emerald-500 border border-slate-200 dark:border-emerald-500/10 shadow-sm uppercase truncate px-1">
                {user?.name?.substring(0, 5) || 'ADMIN'}
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest truncate max-w-[120px]">
                   {user?.name || 'Dealer Admin'}
               </span>
               <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-widest">Active Link</span>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 3px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </>
  );
};