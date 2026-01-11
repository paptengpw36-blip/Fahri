
import React from 'react';
import { LayoutDashboard, FileText, PlusCircle, History, Settings, ChevronRight, ShieldCheck, Share2, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as ViewState, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'list' as ViewState, icon: FileText, label: 'Semua Notulen' },
    { id: 'create' as ViewState, icon: PlusCircle, label: 'Buat Baru' },
    { id: 'integrations' as ViewState, icon: Share2, label: 'Integrasi' },
    { id: 'archive' as ViewState, icon: History, label: 'Arsip' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight uppercase tracking-tight">E-Notulen BPKP</h1>
          <p className="text-[10px] text-slate-500 font-medium">Papua Tengah</p>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {currentView === item.id && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto border-t border-slate-800 space-y-2">
        <button className="flex items-center gap-3 px-4 py-2 hover:text-white transition-colors w-full text-sm">
          <Settings size={18} />
          <span>Pengaturan</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all w-full text-sm font-semibold"
        >
          <LogOut size={18} />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
