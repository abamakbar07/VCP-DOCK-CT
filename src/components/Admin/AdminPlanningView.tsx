import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Calendar, Truck, ArrowUpRight, ArrowDownRight, 
  CheckCircle2, Clock, AlertTriangle, MessageSquare, Image, QrCode, 
  Download, Edit2, Trash2, Shield, Layers, RefreshCw, Archive
} from 'lucide-react';
import { DockOperation, ProcessType, StageStatus, WarehouseProject, formatTruckReference } from '../../types/warehouse';
import { PROJECTS } from '../../data/initialData';
import { exportOperationsToCSV, bulkDownloadPhotosZip } from '../../services/storage';

interface AdminPlanningViewProps {
  operations: DockOperation[];
  selectedProject: WarehouseProject | 'ALL';
  onSelectProject: (p: WarehouseProject | 'ALL') => void;
  onOpenWhatsAppModal: (op: DockOperation) => void;
  onOpenEvidenceModal: (op: DockOperation) => void;
  onOpenQrModal: (op: DockOperation) => void;
  onAddOperation: (op: DockOperation) => void;
  onUpdateOperation: (id: string, updates: Partial<DockOperation>) => void;
  onDeleteOperation: (id: string) => void;
  onResetData: () => void;
}

export const AdminPlanningView: React.FC<AdminPlanningViewProps> = ({
  operations,
  selectedProject,
  onSelectProject,
  onOpenWhatsAppModal,
  onOpenEvidenceModal,
  onOpenQrModal,
  onAddOperation,
  onUpdateOperation,
  onDeleteOperation,
  onResetData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ProcessType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<StageStatus | 'ALL'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Form State for new plan - CLEAN EMPTY STRINGS (NO STATIC PREFILL)
  const [newProject, setNewProject] = useState<WarehouseProject>('HMS');
  const [newRitase, setNewRitase] = useState<number | ''>('');
  const [newType, setNewType] = useState<ProcessType>('LOADING');
  const [newDock, setNewDock] = useState(PROJECTS.HMS.docks[0] || 'Dock 04');
  const [newPlate, setNewPlate] = useState('');
  const [newContainer, setNewContainer] = useState('');
  const [newTransporter, setNewTransporter] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newTargetQty, setNewTargetQty] = useState('');
  const [newCargo, setNewCargo] = useState('');
  const [newForklift, setNewForklift] = useState('');
  const [newChecker, setNewChecker] = useState('');
  const [newSecurity, setNewSecurity] = useState('');

  // Filter operations
  const filteredOps = operations.filter((op) => {
    const matchProject = selectedProject === 'ALL' || op.project === selectedProject;
    const matchType = filterType === 'ALL' || op.processType === filterType;
    const matchStatus = filterStatus === 'ALL' || op.status === filterStatus;
    const matchSearch =
      op.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.containerNumber && op.containerNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      op.planCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.gateDock.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProject && matchType && matchStatus && matchSearch;
  });

  // KPI calculations
  const totalToday = operations.length;
  const completedCount = operations.filter((o) => o.status === 'COMPLETED' || o.status === 'GATE_OUT').length;
  const inProgressCount = operations.filter((o) => o.status === 'IN_PROGRESS').length;
  const queueCount = operations.filter((o) => o.status === 'GATE_IN' || o.status === 'SAFETY_CHECK').length;
  const plannedCount = operations.filter((o) => o.status === 'PLANNED').length;

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[today.getDay()];
    const ritNum = Number(newRitase) || (operations.length + 1);

    const newOp: DockOperation = {
      id: `op-${newProject.toLowerCase()}-${Date.now().toString().slice(-6)}`,
      planCode: `PLN-${newProject}-${dateStr.replace(/-/g, '')}-${ritNum.toString().padStart(2, '0')}`,
      project: newProject,
      ritase: ritNum,
      processType: newType,
      gateDock: newDock,
      date: dateStr,
      dayName: dayName,
      plateNumber: newPlate.trim().toUpperCase(),
      containerNumber: newContainer ? newContainer.trim().toUpperCase() : undefined,
      sealNumber: '',
      transporter: newTransporter.trim(),
      driverName: newDriver.trim(),
      forkliftDriver: newForklift.trim(),
      checkerName: newChecker.trim(),
      securityName: newSecurity.trim(),
      quantity: newTargetQty.trim(),
      cargoType: newCargo.trim() || 'Logistik Warehouse',
      status: 'PLANNED',
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
      keterangan: 'Jadwal harian dibuat oleh Admin Logistics',
      evidences: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddOperation(newOp);
    setIsAddModalOpen(false);

    // Reset clean fields
    setNewPlate('');
    setNewContainer('');
    setNewTransporter('');
    setNewDriver('');
    setNewTargetQty('');
    setNewCargo('');
    setNewForklift('');
    setNewChecker('');
    setNewSecurity('');
    setNewRitase('');
  };

  const handleBulkZip = async () => {
    setIsZipping(true);
    await bulkDownloadPhotosZip(filteredOps);
    setIsZipping(false);
  };

  const getStatusBadge = (status: StageStatus) => {
    switch (status) {
      case 'PLANNED':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">Planned</span>;
      case 'GATE_IN':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 animate-pulse">Tiba di Gate</span>;
      case 'SAFETY_CHECK':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Cek Safety Driver</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5"><Clock className="w-3 h-3 animate-spin" /> Sedang Muat/Bongkar</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai Muat</span>;
      case 'GATE_OUT':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">Gate Out / Keluar</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              OPERATIONAL YARD &amp; DOCKS
            </span>
            <span className="text-xs text-slate-400">Format Referensi: WH - RIT - NO MOBIL - DOCK</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Planning &amp; Monitoring Loading/Unloading
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Kelola jadwal ritase harian project SFP, HMS, PMID, &amp; CLOVE, pantau antrean gate, serta download evidence bulky untuk email.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Tambah Plan Harian
          </button>

          <button
            onClick={handleBulkZip}
            disabled={isZipping}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs md:text-sm flex items-center gap-2 border border-amber-500/30 transition"
            title="Download Semua Foto Evidence dalam File ZIP untuk Email"
          >
            <Archive className="w-4 h-4" />
            Download Foto Bulky (.ZIP)
          </button>

          <button
            onClick={() => exportOperationsToCSV(filteredOps)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs md:text-sm flex items-center gap-2 border border-slate-700 transition"
            title="Download Excel / CSV Laporan Lengkap"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Ekspor CSV
          </button>

          <button
            onClick={onResetData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
            title="Reset ke Data Standar Demo"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium block">Total Ritase Hari Ini</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-white font-mono">{totalToday}</span>
            <span className="text-xs text-slate-400">Truk Terjadwal</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 shadow-sm">
          <span className="text-xs text-emerald-400 font-medium block">Selesai (Completed)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">{completedCount}</span>
            <span className="text-xs text-slate-400">Siap Gate Out</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-900/40 shadow-sm">
          <span className="text-xs text-cyan-400 font-medium block">Sedang Muat / Bongkar</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{inProgressCount}</span>
            <span className="text-xs text-slate-400">Aktif di Dock</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40 shadow-sm">
          <span className="text-xs text-amber-400 font-medium block">Antrean Gate / Safety</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{queueCount}</span>
            <span className="text-xs text-slate-400">Truk di Pos</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-medium block">Planning Belum Tiba</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-300 font-mono">{plannedCount}</span>
            <span className="text-xs text-slate-400">Menunggu</span>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari Referensi Truk (WH, Rit, Nopol, Dock, Driver)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Tipe Operasi</option>
            <option value="LOADING">Hanya Muat (Loading)</option>
            <option value="UNLOADING">Hanya Bongkar (Unloading)</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PLANNED">Planned</option>
            <option value="GATE_IN">Tiba di Gate</option>
            <option value="SAFETY_CHECK">Safety Check</option>
            <option value="IN_PROGRESS">Sedang Muat</option>
            <option value="COMPLETED">Selesai</option>
            <option value="GATE_OUT">Gate Out</option>
          </select>
        </div>
      </div>

      {/* Main Table: Ordered by [WH/Project] - [Ritase] - [No Mobil] - [Dock] */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3.5 px-4">Referensi Truk (WH ➔ RIT ➔ NOPOL ➔ DOCK)</th>
                <th className="py-3.5 px-4">Tipe &amp; Kargo</th>
                <th className="py-3.5 px-4">Driver &amp; Ekspedisi</th>
                <th className="py-3.5 px-4">Petugas Dock &amp; Segel</th>
                <th className="py-3.5 px-4">Waktu &amp; Qty</th>
                <th className="py-3.5 px-4">Status &amp; Evidences</th>
                <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Truck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    Tidak ada jadwal operasi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredOps.map((op) => {
                  const proj = PROJECTS[op.project];
                  const photoCount = Object.keys(op.evidences || {}).length;

                  return (
                    <tr key={op.id} className="hover:bg-slate-800/40 transition">
                      {/* Urutan 1: [WH/Project] - [Ritase] - [No Mobil] - [Dock] */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${proj?.badgeBg} ${proj?.badgeText}`}>
                            {op.project}
                          </span>
                          <span className="font-mono font-bold text-amber-400 text-xs bg-slate-800 px-2 py-0.5 rounded">
                            RIT {op.ritase}
                          </span>
                          <span className="font-bold text-cyan-400 text-xs">
                            {op.gateDock}
                          </span>
                        </div>
                        <div className="font-mono font-black text-white text-base">
                          {op.plateNumber || 'No Mobil -'}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          {op.planCode} • {op.dayName}, {op.date}
                        </span>
                      </td>

                      {/* Tipe & Kargo */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5">
                          {op.processType === 'LOADING' ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              MUAT
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-cyan-400 font-semibold text-[11px]">
                              <ArrowDownRight className="w-3.5 h-3.5" />
                              BONGKAR
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-300 font-medium block mt-1">
                          {op.cargoType || 'Kargo Warehouse'}
                        </span>
                      </td>

                      {/* Driver & Ekspedisi */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-semibold text-slate-200">
                          {op.driverName || 'Belum diisi'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {op.transporter || 'Ekspedisi Rekanan'}
                        </div>
                      </td>

                      {/* Petugas Dock & Segel */}
                      <td className="py-4 px-4 align-top">
                        <div className="text-[11px] text-slate-300">
                          Forklift: <strong className="text-white">{op.forkliftDriver || '-'}</strong>
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Checker: <strong className="text-white">{op.checkerName || '-'}</strong>
                        </div>
                        {op.sealNumber && (
                          <div className="text-[10px] font-mono text-amber-400 mt-1">
                            Segel: {op.sealNumber}
                          </div>
                        )}
                      </td>

                      {/* Waktu & Qty */}
                      <td className="py-4 px-4 align-top">
                        <div className="font-bold text-amber-300 text-xs">
                          {op.quantity || '-'}
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                          {op.startTime ? `${op.startTime} - ${op.endTime || '...'}` : 'Belum mulai'}
                        </div>
                        {op.durationMinutes && (
                          <span className="text-[10px] text-emerald-400 font-semibold block">
                            Durasi: {op.durationMinutes} Menit
                          </span>
                        )}
                      </td>

                      {/* Status & Evidences */}
                      <td className="py-4 px-4 align-top">
                        {getStatusBadge(op.status)}
                        <div className="mt-2">
                          <button
                            onClick={() => onOpenEvidenceModal(op)}
                            className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1 text-[11px]"
                          >
                            <Image className="w-3.5 h-3.5" />
                            {photoCount} Foto Evidences
                          </button>
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-4 px-4 align-top text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenWhatsAppModal(op)}
                            className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/60 transition"
                            title="Format WhatsApp Laporan (1-Klik Salin)"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onOpenQrModal(op)}
                            className="p-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-400 border border-amber-800/60 transition"
                            title="Tampilkan QR Registrasi Driver"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onOpenEvidenceModal(op)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
                            title="Lihat Galeri Foto & Serrico"
                          >
                            <Image className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus jadwal plan ${op.planCode}?`)) {
                                onDeleteOperation(op.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                            title="Hapus Plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Plan Baru (CLEAN EMPTY INITIAL VALUES) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tambah Jadwal Planning Baru</h3>
                  <p className="text-xs text-slate-400">Urutan: WH / Project ➔ Ritase ➔ No Mobil ➔ Dock</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    1. WH / Project
                  </label>
                  <select
                    value={newProject}
                    onChange={(e) => {
                      const proj = e.target.value as WarehouseProject;
                      setNewProject(proj);
                      setNewDock(PROJECTS[proj].docks[0] || 'Dock 01');
                    }}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="HMS">PT HMS (HM Sampoerna)</option>
                    <option value="SFP">PT SFP (Sampoerna Finished Products)</option>
                    <option value="PMID">PT PMID (Philip Morris Indonesia)</option>
                    <option value="CLOVE">PT CLOVE (Material Cengkeh)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    2. Nomor Ritase (RIT)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Contoh: 8"
                    value={newRitase}
                    onChange={(e) => setNewRitase(e.target.value ? Number(e.target.value) : '')}
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    3. Nomor Polisi (No Mobil)
                  </label>
                  <input
                    type="text"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    placeholder="Contoh: B 9522 SEI"
                    required
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    4. Referensi Pintu Dock
                  </label>
                  <select
                    value={newDock}
                    onChange={(e) => setNewDock(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-bold text-cyan-300"
                  >
                    {PROJECTS[newProject].docks.map((d) => (
                      <option key={d} value={d}>
                        {d} ({newProject})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Tipe Operasi
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ProcessType)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LOADING">MUAT (Loading Barang)</option>
                    <option value="UNLOADING">BONGKAR (Unloading)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nomor Kontainer (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newContainer}
                    onChange={(e) => setNewContainer(e.target.value)}
                    placeholder="Contoh: TGHU 9103630"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Vendor Ekspedisi / Transporter
                  </label>
                  <input
                    type="text"
                    value={newTransporter}
                    onChange={(e) => setNewTransporter(e.target.value)}
                    placeholder="Contoh: PT Assa Logistik"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nama Driver
                  </label>
                  <input
                    type="text"
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    placeholder="Nama Lengkap Driver"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Target Muatan / Qty
                  </label>
                  <input
                    type="text"
                    value={newTargetQty}
                    onChange={(e) => setNewTargetQty(e.target.value)}
                    placeholder="Contoh: 52 BOK / 40 Pallet"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Jenis Kargo
                  </label>
                  <input
                    type="text"
                    value={newCargo}
                    onChange={(e) => setNewCargo(e.target.value)}
                    placeholder="Contoh: Finished Goods Rokok"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Forklift Driver
                  </label>
                  <input
                    type="text"
                    value={newForklift}
                    onChange={(e) => setNewForklift(e.target.value)}
                    placeholder="e.g. Triyadi"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Checker / FD
                  </label>
                  <input
                    type="text"
                    value={newChecker}
                    onChange={(e) => setNewChecker(e.target.value)}
                    placeholder="e.g. Dedi Kurniawan"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Security On-Duty
                  </label>
                  <input
                    type="text"
                    value={newSecurity}
                    onChange={(e) => setNewSecurity(e.target.value)}
                    placeholder="e.g. Budi"
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  Simpan Jadwal Planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
