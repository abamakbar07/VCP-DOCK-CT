import React, { useState } from 'react';
import { 
  Shield, Truck, QrCode, MessageSquare, Clock, CheckCircle2, 
  ArrowRight, Search, Plus, MapPin, AlertCircle, Image, ExternalLink,
  Check, Copy
} from 'lucide-react';
import { DockOperation, ProcessType, WarehouseProject, formatTruckReference } from '../../types/warehouse';
import { PROJECTS } from '../../data/initialData';
import { formatWhatsAppReport } from '../../services/storage';

interface SecurityGateViewProps {
  operations: DockOperation[];
  selectedProject: WarehouseProject | 'ALL';
  onOpenWhatsAppModal: (op: DockOperation) => void;
  onOpenEvidenceModal: (op: DockOperation) => void;
  onOpenQrModal: (op: DockOperation) => void;
  onUpdateOperation: (id: string, updates: Partial<DockOperation>) => void;
  onAddOperation: (op: DockOperation) => void;
  onOpenDriverView: (opId: string) => void;
}

export const SecurityGateView: React.FC<SecurityGateViewProps> = ({
  operations,
  selectedProject,
  onOpenWhatsAppModal,
  onOpenEvidenceModal,
  onOpenQrModal,
  onUpdateOperation,
  onAddOperation,
  onOpenDriverView,
}) => {
  const [activeTab, setActiveTab] = useState<'ANTREAN' | 'SEMUA'>('ANTREAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);

  // Quick on-the-spot entry state - START EMPTY (NO STATIC PREFILL)
  const [quickProject, setQuickProject] = useState<WarehouseProject>('HMS');
  const [quickRitase, setQuickRitase] = useState<number | ''>('');
  const [quickPlate, setQuickPlate] = useState('');
  const [quickContainer, setQuickContainer] = useState('');
  const [quickDriver, setQuickDriver] = useState('');
  const [quickDock, setQuickDock] = useState(PROJECTS.HMS.docks[0] || 'Dock 04');
  const [quickType, setQuickType] = useState<ProcessType>('LOADING');
  const [securityOfficer, setSecurityOfficer] = useState('Budi');

  const filtered = operations.filter((op) => {
    const matchProj = selectedProject === 'ALL' || op.project === selectedProject;
    const matchSearch =
      op.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.containerNumber && op.containerNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      op.gateDock.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'ANTREAN') {
      return matchProj && matchSearch && (op.status === 'PLANNED' || op.status === 'GATE_IN' || op.status === 'SAFETY_CHECK');
    }
    return matchProj && matchSearch;
  });

  const handleGateIn = (op: DockOperation) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    onUpdateOperation(op.id, {
      status: 'GATE_IN',
      gateInTime: timeStr,
      securityName: securityOfficer,
    });
    onOpenQrModal({
      ...op,
      status: 'GATE_IN',
      gateInTime: timeStr,
      securityName: securityOfficer,
    });
  };

  const handleGateOut = (op: DockOperation) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    onUpdateOperation(op.id, {
      status: 'GATE_OUT',
      gateOutTime: timeStr,
      securityName: securityOfficer,
    });
  };

  const handleQuickCopyWhatsApp = (op: DockOperation) => {
    const text = formatWhatsAppReport(op);
    navigator.clipboard.writeText(text);
    setCopiedId(op.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateQuickEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const dateStr = now.toISOString().slice(0, 10);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const ritNum = Number(quickRitase) || (operations.length + 1);

    const newOp: DockOperation = {
      id: `op-${quickProject.toLowerCase()}-${Date.now().toString().slice(-6)}`,
      planCode: `SEC-${quickProject}-${dateStr.replace(/-/g, '')}-${ritNum.toString().padStart(2, '0')}`,
      project: quickProject,
      ritase: ritNum,
      processType: quickType,
      gateDock: quickDock,
      date: dateStr,
      dayName: dayNames[now.getDay()],
      plateNumber: quickPlate.trim().toUpperCase(),
      containerNumber: quickContainer ? quickContainer.trim().toUpperCase() : undefined,
      sealNumber: '',
      transporter: 'Ekspedisi Rekanan',
      driverName: quickDriver.trim(),
      forkliftDriver: '',
      checkerName: '',
      securityName: securityOfficer,
      gateInTime: timeStr,
      quantity: '',
      cargoType: 'Finished Goods / Material',
      status: 'GATE_IN',
      safetyChecklist: {
        wheelChock: false,
        keyRemoved: false,
        handbrakeOn: false,
        simValid: false,
        kirValid: false,
        doComplete: false,
        ppeWorn: false,
        containerClean: false,
      },
      keterangan: 'Ban Terganjal 2, Serrico, surat jalan lengkap. Aman lancar kondusif',
      evidences: {},
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    onAddOperation(newOp);
    setIsQuickEntryOpen(false);

    // Reset clean
    setQuickPlate('');
    setQuickContainer('');
    setQuickDriver('');
    setQuickRitase('');

    onOpenQrModal(newOp);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                POS SATPAM &amp; GATE LOGISTIK
              </span>
              <span className="text-xs text-slate-400">Format: WH - RIT - NO MOBIL - DOCK</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              Terminal Security Gate &amp; Registrasi Truk
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5">
              Penerimaan armada, pencatatan Gate In, pembagian QR registrasi driver, dan 1-klik salin laporan WhatsApp.
            </p>
          </div>
        </div>

        {/* Security Officer On Duty Setting */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Petugas Jaga (Security)</span>
            <input
              type="text"
              value={securityOfficer}
              onChange={(e) => setSecurityOfficer(e.target.value)}
              className="text-xs font-bold text-emerald-400 bg-transparent text-right border-b border-emerald-500/30 focus:outline-none"
              placeholder="Nama Security"
            />
          </div>
          <button
            onClick={() => setIsQuickEntryOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Truk Masuk Cepat
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('ANTREAN')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'ANTREAN'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Antrean Masuk / Gate In ({operations.filter(o => o.status === 'PLANNED' || o.status === 'GATE_IN' || o.status === 'SAFETY_CHECK').length})
          </button>
          <button
            onClick={() => setActiveTab('SEMUA')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              activeTab === 'SEMUA'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Ritase Hari Ini ({operations.length})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Plat (B 9522 SEI) atau Driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Security Cards Grid - STRICT ORDER: WH - RIT - NO MOBIL - DOCK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((op) => {
          const proj = PROJECTS[op.project];
          const isCopied = copiedId === op.id;
          const photoCount = Object.keys(op.evidences || {}).length;

          return (
            <div
              key={op.id}
              className={`rounded-2xl border bg-slate-900/90 p-5 shadow-xl flex flex-col justify-between transition hover:border-slate-600 ${
                op.status === 'GATE_IN'
                  ? 'border-blue-500/50 bg-blue-950/10'
                  : op.status === 'IN_PROGRESS'
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header: [WH/Project] - [Ritase] - [No Mobil] - [Dock] */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${proj?.badgeBg} ${proj?.badgeText}`}>
                      WH: {op.project}
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      RIT {op.ritase}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {op.gateDock}
                  </span>
                </div>

                {/* Truck Plate & Details */}
                <div className="my-3.5">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xl font-black text-white tracking-wide">
                      {op.plateNumber || 'No Mobil -'}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      op.processType === 'LOADING' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {op.processType === 'LOADING' ? 'MUAT' : 'BONGKAR'}
                    </span>
                  </div>

                  {op.containerNumber && (
                    <div className="text-xs text-slate-300 font-mono mt-1">
                      No. Kontainer: <strong className="text-cyan-300">{op.containerNumber}</strong>
                    </div>
                  )}

                  <div className="text-xs text-slate-300 mt-1">
                    Driver: <strong className="text-slate-100">{op.driverName || 'Belum Registrasi'}</strong> • <span className="text-slate-400">{op.transporter || 'Ekspedisi'}</span>
                  </div>
                </div>

                {/* Flow Timestamps */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] mb-3.5">
                  <div>
                    <span className="text-slate-400 block">Gate In:</span>
                    <span className="font-mono font-bold text-blue-400">
                      {op.gateInTime || 'Belum Tiba'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mulai - Selesai:</span>
                    <span className="font-mono font-bold text-slate-200">
                      {op.startTime ? `${op.startTime} - ${op.endTime || '...'}` : '-'}
                    </span>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="p-2 rounded-lg bg-slate-800/40 text-[11px] text-slate-300 italic mb-4">
                  "{op.keterangan || 'Ban Terganjal 2, Serrico, surat jalan lengkap.'}"
                </div>
              </div>

              {/* Action Buttons for Security */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {op.status === 'PLANNED' && (
                  <button
                    onClick={() => handleGateIn(op)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition active:scale-98"
                  >
                    <Clock className="w-4 h-4" />
                    Truk Tiba (Catat Gate In &amp; Tampilkan QR)
                  </button>
                )}

                {(op.status === 'GATE_IN' || op.status === 'SAFETY_CHECK') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenQrModal(op)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                    >
                      <QrCode className="w-4 h-4" />
                      Tunjukkan QR ke Driver
                    </button>
                    <button
                      onClick={() => onOpenDriverView(op.id)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                      title="Buka Form Driver Langsung"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      Buka Form
                    </button>
                  </div>
                )}

                {op.status === 'COMPLETED' && (
                  <button
                    onClick={() => handleGateOut(op)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Catat Gate Out (Truk Keluar Warehouse)
                  </button>
                )}

                {/* Reporting Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickCopyWhatsApp(op)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isCopied
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-400 border border-emerald-800/60'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        Teks WA Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Salin Format WA
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenWhatsAppModal(op)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700"
                    title="Buka Preview Laporan WhatsApp Lengkap"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenEvidenceModal(op)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 relative"
                    title="Periksa Foto Evidence Safety"
                  >
                    <Image className="w-4 h-4" />
                    {photoCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-cyan-500 text-slate-950 font-bold px-1 rounded-full">
                        {photoCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Quick Entry On-The-Spot (CLEAN EMPTY INITIAL VALUES) */}
      {isQuickEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Registrasi Truk Masuk Langsung di Gate</h3>
                  <p className="text-[11px] text-slate-400">Urutan: WH / Project ➔ Ritase ➔ No Mobil ➔ Dock</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickEntryOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickEntry} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    1. WH / Project
                  </label>
                  <select
                    value={quickProject}
                    onChange={(e) => {
                      const p = e.target.value as WarehouseProject;
                      setQuickProject(p);
                      setQuickDock(PROJECTS[p].docks[0] || 'Dock 01');
                    }}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  >
                    <option value="HMS">PT HMS (HM Sampoerna)</option>
                    <option value="SFP">PT SFP (Sampoerna Finished)</option>
                    <option value="PMID">PT PMID (Philip Morris)</option>
                    <option value="CLOVE">PT CLOVE (Material Cengkeh)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    2. Nomor Ritase (RIT)
                  </label>
                  <input
                    type="number"
                    value={quickRitase}
                    onChange={(e) => setQuickRitase(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Contoh: 7"
                    required
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    3. Nomor Polisi (No Mobil)
                  </label>
                  <input
                    type="text"
                    value={quickPlate}
                    onChange={(e) => setQuickPlate(e.target.value)}
                    required
                    placeholder="Contoh: B 9522 SEI"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    4. Arahkan ke Dock/Gate
                  </label>
                  <select
                    value={quickDock}
                    onChange={(e) => setQuickDock(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-bold text-cyan-300"
                  >
                    {PROJECTS[quickProject].docks.map((d) => (
                      <option key={d} value={d}>
                        {d} ({quickProject})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nama Driver
                  </label>
                  <input
                    type="text"
                    value={quickDriver}
                    onChange={(e) => setQuickDriver(e.target.value)}
                    placeholder="Nama Lengkap Driver"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Nomor Kontainer (Opsional)
                  </label>
                  <input
                    type="text"
                    value={quickContainer}
                    onChange={(e) => setQuickContainer(e.target.value)}
                    placeholder="Contoh: TGHU 9103630"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickEntryOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Simpan &amp; Tampilkan QR Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
