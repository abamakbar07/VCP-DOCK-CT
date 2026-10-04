import React, { useState } from 'react';
import { 
  FileSpreadsheet, Download, Image as ImageIcon, Filter, 
  Calendar, CheckCircle2, ShieldCheck, Clock, ExternalLink,
  MessageSquare, Search, Eye, Archive, CheckSquare, Square,
  Loader2, Mail
} from 'lucide-react';
import { DockOperation, WarehouseProject, formatTruckReference } from '../../types/warehouse';
import { PROJECTS } from '../../data/initialData';
import { exportOperationsToCSV, bulkDownloadPhotosZip } from '../../services/storage';

interface ReportSummaryViewProps {
  operations: DockOperation[];
  selectedProject: WarehouseProject | 'ALL';
  onOpenWhatsAppModal: (op: DockOperation) => void;
  onOpenEvidenceModal: (op: DockOperation) => void;
}

export const ReportSummaryView: React.FC<ReportSummaryViewProps> = ({
  operations,
  selectedProject,
  onOpenWhatsAppModal,
  onOpenEvidenceModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'safety' | 'cargo' | 'serrico' | 'container_fill'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpIds, setSelectedOpIds] = useState<string[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccessMessage, setZipSuccessMessage] = useState<string | null>(null);

  const filteredOps = operations.filter((op) => {
    const matchProj = selectedProject === 'ALL' || op.project === selectedProject;
    const matchSearch =
      op.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.containerNumber && op.containerNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      op.planCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.gateDock.toLowerCase().includes(searchTerm.toLowerCase());
    return matchProj && matchSearch;
  });

  const completedOps = filteredOps.filter((o) => o.status === 'COMPLETED' || o.status === 'GATE_OUT');
  const totalPhotosUploaded = filteredOps.reduce((sum, o) => sum + Object.keys(o.evidences || {}).length, 0);

  // Toggle selection for bulk actions
  const toggleSelectOp = (id: string) => {
    setSelectedOpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedOpIds.length === filteredOps.length) {
      setSelectedOpIds([]);
    } else {
      setSelectedOpIds(filteredOps.map((o) => o.id));
    }
  };

  // Bulk ZIP Download Handler
  const handleDownloadZip = async (targetList: DockOperation[], customLabel?: string) => {
    if (targetList.length === 0) {
      alert('Pilih minimal 1 ritase truk untuk mengunduh arsip foto evidence.');
      return;
    }

    try {
      setIsZipping(true);
      const todayStr = new Date().toISOString().slice(0, 10);
      const filename = customLabel 
        ? `Evidence_${customLabel}_${todayStr}.zip`
        : `DockFlow_Evidence_Bulky_Report_${todayStr}.zip`;

      const result = await bulkDownloadPhotosZip(targetList, filename);
      setZipSuccessMessage(`Berhasil mengunduh ${result.count} foto evidence dalam berkas ZIP siap lampir email!`);
      setTimeout(() => setZipSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengompres berkas foto.');
    } finally {
      setIsZipping(false);
    }
  };

  const selectedOperations = operations.filter((o) => selectedOpIds.includes(o.id));

  return (
    <div className="space-y-6">
      {/* Top Banner with Email Bulky Report Highlighting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUDIT &amp; REPORTING EMAIL CENTER
            </span>
            <span className="text-xs text-slate-400">Solusi Download Bulky untuk Attachment Email</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Rekap Laporan &amp; Download Foto Bulky
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-0.5">
            Admin tidak perlu download foto satu per satu dari WhatsApp. Unduh seluruh foto evidence (Serrico, ban terganjal, kontainer, segel) dalam 1 berkas ZIP terorganisir per folder armada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download Selected or All as ZIP */}
          <button
            onClick={() => handleDownloadZip(selectedOperations.length > 0 ? selectedOperations : filteredOps)}
            disabled={isZipping}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 disabled:opacity-50"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengompres Foto ZIP...
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                {selectedOperations.length > 0
                  ? `Download ZIP (${selectedOperations.length} Truk Dipilih)`
                  : 'Download Semua Foto (.ZIP)'}
              </>
            )}
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportOperationsToCSV(filteredOps)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ekspor Excel / CSV
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {zipSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {zipSuccessMessage}
          </span>
          <span className="text-[11px] text-emerald-400/80">Siap dilampirkan ke Email Laporan</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Total Foto Evidence Tersimpan</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-cyan-400 font-mono">{totalPhotosUploaded}</span>
            <span className="text-xs text-slate-400">Foto Terverifikasi</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Ritase Muat/Bongkar Selesai</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-400 font-mono">{completedOps.length}</span>
            <span className="text-xs text-slate-400">dari {filteredOps.length} ritase</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium block">Truk Dipilih untuk Download ZIP</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400 font-mono">{selectedOpIds.length}</span>
            <span className="text-xs text-slate-400">Truk terpilih</span>
          </div>
        </div>
      </div>

      {/* Audit Gallery & Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              {selectedOpIds.length === filteredOps.length ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              {selectedOpIds.length === filteredOps.length ? 'Batal Pilih Semua' : 'Pilih Semua untuk ZIP'}
            </button>
            <span className="text-xs text-slate-400">
              Format: <strong className="text-cyan-400">[WH] - [RIT] - [NO MOBIL] - [DOCK]</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Plat atau Driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Operations List with Bulky ZIP Download per Truck */}
        <div className="space-y-4">
          {filteredOps.map((op) => {
            const proj = PROJECTS[op.project];
            const evidenceList = Object.entries(op.evidences || {});
            const isSelected = selectedOpIds.includes(op.id);
            const refTitle = formatTruckReference(op);

            return (
              <div
                key={op.id}
                className={`p-4 rounded-xl border transition ${
                  isSelected
                    ? 'border-amber-500/50 bg-amber-950/10'
                    : 'border-slate-800/80 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSelectOp(op.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {/* Standard Reference: [WH] - [RIT] - [NO MOBIL] - [DOCK] */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${proj?.badgeBg} ${proj?.badgeText}`}>
                        {op.project}
                      </span>
                      <span className="font-mono font-bold text-amber-400 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        RIT {op.ritase}
                      </span>
                      <span className="font-mono font-black text-white text-sm">
                        {op.plateNumber || 'No Mobil -'}
                      </span>
                      <span className="text-xs font-bold text-cyan-400">
                        {op.gateDock}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({op.driverName || 'Driver'} • {op.transporter})
                      </span>
                    </div>
                  </div>

                  {/* Actions for this truck */}
                  <div className="flex items-center gap-2">
                    {/* Download Single Truck ZIP */}
                    <button
                      onClick={() => handleDownloadZip([op], `${op.project}_RIT${op.ritase}_${op.plateNumber.replace(/\s+/g, '_')}`)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 transition"
                      title="Download Semua Foto Truk Ini dalam File ZIP untuk Email"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Download ZIP ({evidenceList.length} Foto)
                    </button>

                    <button
                      onClick={() => onOpenEvidenceModal(op)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Lihat Audit
                    </button>

                    <button
                      onClick={() => onOpenWhatsAppModal(op)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-800/60"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Format WA
                    </button>
                  </div>
                </div>

                {/* Evidence Previews Row */}
                {evidenceList.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                    {evidenceList.map(([key, url]) => (
                      <div
                        key={key}
                        onClick={() => onOpenEvidenceModal(op)}
                        className="group relative h-20 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer"
                      >
                        <img
                          src={url}
                          alt={key}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[8px] text-slate-300 px-1 py-0.5 truncate text-center leading-tight">
                          {key.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900/60 rounded-lg text-xs text-slate-500 italic">
                    Belum ada foto evidence yang di-upload untuk ritase ini.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
