import React from 'react';
import { 
  Building2, Shield, Truck, Boxes, BarChart3, Layers, 
  MapPin, Clock
} from 'lucide-react';
import { UserRole, WarehouseProject } from '../types/warehouse';
import { PROJECTS } from '../data/initialData';

interface NavbarProps {
  currentRole: UserRole | 'REPORT';
  onChangeRole: (role: UserRole | 'REPORT') => void;
  selectedProject: WarehouseProject | 'ALL';
  onSelectProject: (proj: WarehouseProject | 'ALL') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onChangeRole,
  selectedProject,
  onSelectProject,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Building2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                DockFlow <span className="text-amber-400 font-extrabold text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">WAREHOUSE</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Cainiao Delta Silicon Cikarang • Multi-Project
            </p>
          </div>
        </div>

        {/* Project Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => onSelectProject('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              selectedProject === 'ALL'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Project
          </button>
          {Object.values(PROJECTS).map((p) => {
            const isSelected = selectedProject === p.code;
            return (
              <button
                key={p.code}
                onClick={() => onSelectProject(p.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
                  isSelected
                    ? `${p.badgeBg} ${p.badgeText} shadow-sm font-black`
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-slate-800/60 flex items-center justify-between overflow-x-auto">
        <nav className="flex items-center gap-1 py-1.5">
          {/* Admin */}
          <button
            onClick={() => onChangeRole('ADMIN')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              currentRole === 'ADMIN'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            Admin / Planning
          </button>

          {/* Security */}
          <button
            onClick={() => onChangeRole('SECURITY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              currentRole === 'SECURITY'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security (Pos Satpam)
          </button>

          {/* Driver */}
          <button
            onClick={() => onChangeRole('DRIVER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              currentRole === 'DRIVER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" />
            Driver (Scan QR Safety)
          </button>

          {/* Checker */}
          <button
            onClick={() => onChangeRole('CHECKER')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              currentRole === 'CHECKER'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Checker &amp; Forklift
          </button>

          {/* Reporting */}
          <button
            onClick={() => onChangeRole('REPORT')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
              currentRole === 'REPORT'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Rekap &amp; Arsip WA
          </button>
        </nav>

        {/* Live Status indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px] text-emerald-400 font-semibold">SISTEM AKTIF</span>
        </div>
      </div>
    </header>
  );
};
