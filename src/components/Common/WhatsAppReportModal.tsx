import React, { useState } from 'react';
import { Copy, Check, MessageSquare, ExternalLink, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { DockOperation } from '../../types/warehouse';
import { formatWhatsAppReport } from '../../services/storage';

interface WhatsAppReportModalProps {
  operation: DockOperation;
  isOpen: boolean;
  onClose: () => void;
  onOpenGallery: (op: DockOperation) => void;
}

export const WhatsAppReportModal: React.FC<WhatsAppReportModalProps> = ({
  operation,
  isOpen,
  onClose,
  onOpenGallery,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = formatWhatsAppReport(operation);
  const evidenceEntries = Object.entries(operation.evidences || {});
  const photoCount = evidenceEntries.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* WhatsApp App Style Top Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#075e54] text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Format Laporan WhatsApp</h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  1-KLIK COPAS
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Sesuai standar grup WhatsApp warehouse (Assa Delta Cainiao)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950">
          {/* Quick Notice */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              Pak Security / Checker tidak perlu mengetik ulang secara manual.
            </span>
            <span className="font-bold font-mono text-[11px] bg-emerald-900/60 px-2 py-1 rounded text-emerald-200">
              RIT {operation.ritase}
            </span>
          </div>

          {/* WhatsApp Chat Bubble Mockup */}
          <div className="rounded-2xl p-4 bg-[#121b22] border border-[#222d34] shadow-inner font-sans">
            {/* 4-Photo Collage Mockup (Exact layout from user screenshot) */}
            <div 
              onClick={() => onOpenGallery(operation)}
              className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden mb-3.5 bg-black/40 border border-slate-800 cursor-pointer group relative hover:opacity-95 transition"
            >
              <div className="h-32 bg-slate-800 overflow-hidden relative">
                {evidenceEntries[0] ? (
                  <img
                    src={evidenceEntries[0][1]}
                    alt="Evidence 1"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Foto Kontainer
                  </div>
                )}
                <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold bg-black/70 text-slate-200 px-1.5 py-0.5 rounded">
                  Kondisi Box
                </span>
              </div>

              <div className="h-32 bg-slate-800 overflow-hidden relative">
                {evidenceEntries[1] ? (
                  <img
                    src={evidenceEntries[1][1]}
                    alt="Evidence 2"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Tag Segel
                  </div>
                )}
                <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold bg-black/70 text-slate-200 px-1.5 py-0.5 rounded">
                  Tag Checklist
                </span>
              </div>

              <div className="h-32 bg-slate-800 overflow-hidden relative">
                {evidenceEntries[2] ? (
                  <img
                    src={evidenceEntries[2][1]}
                    alt="Evidence 3"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Ban Terganjal
                  </div>
                )}
                <span className="absolute bottom-1 left-1.5 text-[9px] font-semibold bg-black/70 text-slate-200 px-1.5 py-0.5 rounded">
                  Safety Ganjal
                </span>
              </div>

              <div className="h-32 bg-slate-800 overflow-hidden relative">
                {evidenceEntries[3] ? (
                  <img
                    src={evidenceEntries[3][1]}
                    alt="Evidence 4"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Evidences Lainnya
                  </div>
                )}
                {/* Overlay Badge for remaining photos */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-bold font-mono">
                    +{Math.max(1, photoCount > 4 ? photoCount - 3 : 18)}
                  </span>
                  <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <ImageIcon className="w-3 h-3" /> Klik Galeri
                  </span>
                </div>
              </div>
            </div>

            {/* Formatted Text Box */}
            <div className="relative bg-[#202c33] rounded-xl p-3.5 border border-[#2a3942]">
              <pre className="font-['JetBrains_Mono',monospace] text-[13px] leading-relaxed text-[#e9edef] whitespace-pre-wrap select-all">
                {reportText}
              </pre>

              <div className="mt-2 text-right">
                <span className="text-[10px] text-[#8696a0]">
                  {operation.endTime || '16:22'} ✓✓
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleCopy}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] ${
              copied
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                Format WhatsApp Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Salin Format WhatsApp
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            Buka WhatsApp
          </button>

          <button
            onClick={() => onOpenGallery(operation)}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Audit Galeri Foto ({photoCount})
          </button>
        </div>
      </div>
    </div>
  );
};
