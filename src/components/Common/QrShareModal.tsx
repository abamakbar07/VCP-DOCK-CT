import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, ExternalLink, X, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { DockOperation, formatTruckReference } from '../../types/warehouse';
import { PROJECTS } from '../../data/initialData';

interface QrShareModalProps {
  operation: DockOperation;
  isOpen: boolean;
  onClose: () => void;
  onOpenDriverView: (opId: string) => void;
}

export const QrShareModal: React.FC<QrShareModalProps> = ({
  operation,
  isOpen,
  onClose,
  onOpenDriverView,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const project = PROJECTS[operation.project];

  // Generate driver registration link
  const driverLink = `${window.location.origin}/?op=${operation.id}&role=DRIVER`;

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        driverLink,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    }
  }, [isOpen, driverLink]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(driverLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">QR Registrasi Driver Mandiri</h3>
              <p className="text-xs text-slate-400">Scan QR di Pos Security untuk isi checklist safety</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          {/* Badge Info Truk with Standard Reference: [WH] - [RIT] - [NO MOBIL] - [DOCK] */}
          <div className="w-full mb-5 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-slate-700/50 text-slate-200">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {operation.plateNumber || 'No Mobil -'}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${project?.badgeBg} ${project?.badgeText}`}>
                    {operation.project} • RIT {operation.ritase}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Driver: {operation.driverName || 'Belum diisi'} • {operation.transporter || 'Ekspedisi'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium text-slate-400 block">Tujuan Dock:</span>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {operation.gateDock}
              </span>
            </div>
          </div>

          {/* Reference Line */}
          <div className="w-full mb-4 px-3 py-1.5 bg-slate-950 rounded-lg text-center font-mono text-xs text-cyan-400 border border-slate-800">
            {formatTruckReference(operation)}
          </div>

          {/* QR Code Canvas */}
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-500/20 mb-4">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <p className="text-xs text-center text-slate-300 max-w-xs mb-4">
            Arahkan kamera HP Driver ke QR Code di atas untuk membuka formulir registrasi armada dan upload bukti keselamatan.
          </p>

          {/* Direct Link box */}
          <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-400 font-mono truncate flex-1 pl-2">
              {driverLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenDriverView(operation.id);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-[0.98]"
            >
              <ExternalLink className="w-4 h-4" />
              Buka Form Driver Sekarang
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Keamanan K3 &amp; Dokumen Wajib
          </span>
          <span className="font-mono text-slate-500">{operation.planCode}</span>
        </div>
      </div>
    </div>
  );
};
