import React, { useState } from 'react';
import { 
  X, ShieldCheck, Download, ZoomIn, CheckCircle2, AlertCircle, 
  FileText, Camera, Archive, Loader2, Sparkles, Filter
} from 'lucide-react';
import { DockOperation, EvidenceKey, formatTruckReference } from '../../types/warehouse';
import { EVIDENCE_CONFIGS, PROJECTS } from '../../data/initialData';
import { bulkDownloadPhotosZip } from '../../services/storage';

interface EvidenceGalleryModalProps {
  operation: DockOperation;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceGalleryModal: React.FC<EvidenceGalleryModalProps> = ({
  operation,
  isOpen,
  onClose,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<{ key: string; label: string; url: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'serrico' | 'container_fill' | 'safety' | 'legal'>('ALL');
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const project = PROJECTS[operation.project];
  const uploadedCount = Object.keys(operation.evidences || {}).length;

  const handleDownloadSingleZip = async () => {
    setIsZipping(true);
    await bulkDownloadPhotosZip([operation], `${operation.project}_RIT${operation.ritase}_${operation.plateNumber.replace(/\s+/g, '_')}`);
    setIsZipping(false);
  };

  const filteredConfigs = EVIDENCE_CONFIGS.filter((cfg) => {
    if (activeTab === 'ALL') return true;
    return cfg.category === activeTab;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with Reference Format: [WH] - [RIT] - [NO MOBIL] - [DOCK] */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Arsip Bukti &amp; Evidence Audit</h3>
                <span className="font-mono font-bold text-amber-400 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {formatTruckReference(operation)}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Driver: <span className="text-white font-semibold">{operation.driverName || 'Belum diisi'}</span> • Kontainer: <span className="text-cyan-300 font-mono">{operation.containerNumber || '-'}</span> • Segel: <span className="text-amber-400 font-mono">{operation.sealNumber || '-'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSingleZip}
              disabled={isZipping}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition disabled:opacity-50"
              title="Download Berkas ZIP Berisi Semua Foto Truk Ini"
            >
              {isZipping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Archive className="w-3.5 h-3.5" />}
              Download ZIP
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audit Status Bar & Category Filters */}
        <div className="px-6 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Filter Kategori:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  activeTab === 'ALL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Semua ({uploadedCount})
              </button>
              <button
                onClick={() => setActiveTab('serrico')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  activeTab === 'serrico' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Serrico Trap (Luar/Dalam)
              </button>
              <button
                onClick={() => setActiveTab('container_fill')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  activeTab === 'container_fill' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Level Kontainer (0%/50%/100%)
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                  activeTab === 'safety' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Safety K3
              </button>
            </div>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Waktu Operasi: {operation.startTime || '--:--'} s/d {operation.endTime || '--:--'} ({operation.durationMinutes || 0}m)
          </span>
        </div>

        {/* Photos Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredConfigs.map((cfg) => {
              const photoUrl = operation.evidences?.[cfg.key as EvidenceKey];
              const isPresent = Boolean(photoUrl);

              return (
                <div
                  key={cfg.key}
                  className={`rounded-xl border transition overflow-hidden flex flex-col bg-slate-900/90 ${
                    isPresent
                      ? 'border-slate-700/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5'
                      : 'border-dashed border-slate-800 opacity-60'
                  }`}
                >
                  {/* Photo Preview Frame */}
                  <div className="relative h-44 bg-slate-950 overflow-hidden flex items-center justify-center group">
                    {isPresent ? (
                      <>
                        <img
                          src={photoUrl}
                          alt={cfg.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer"
                          onClick={() => setSelectedPhoto({ key: cfg.key, label: cfg.label, url: photoUrl! })}
                        />
                        <button
                          onClick={() => setSelectedPhoto({ key: cfg.key, label: cfg.label, url: photoUrl! })}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-[1px]"
                        >
                          <ZoomIn className="w-4 h-4 text-cyan-400" />
                          Perbesar Foto
                        </button>
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 flex items-center gap-1 shadow">
                          <CheckCircle2 className="w-3 h-3" /> Lengkap
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-slate-500">
                        <Camera className="w-7 h-7 mb-1 text-slate-600" />
                        <span className="text-xs font-medium">Belum di-upload</span>
                        {cfg.required && (
                          <span className="text-[10px] text-amber-500/80 mt-1 flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" /> Wajib
                          </span>
                        )}
                      </div>
                    )}

                    <span className="absolute bottom-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/80 text-slate-300">
                      {cfg.category.toUpperCase()} • {cfg.role}
                    </span>
                  </div>

                  {/* Caption & Info */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 line-clamp-1">{cfg.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                        {cfg.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Status: {isPresent ? 'Terverifikasi' : 'Menunggu'}</span>
                      {isPresent && (
                        <button
                          onClick={() => setSelectedPhoto({ key: cfg.key, label: cfg.label, url: photoUrl! })}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold"
                        >
                          Lihat Detail
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Keterangan: <span className="text-slate-200 italic">"{operation.keterangan || '-'}"</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>

        {/* Zoom Lightbox Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl flex items-center justify-between mb-3 text-white">
              <span className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                {selectedPhoto.label} ({operation.plateNumber})
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-2xl max-h-[75vh] rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.label}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Foto evidence diverifikasi sistem untuk audit Serrico, kelaikan kontainer &amp; standardisasi ritase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
