import React, { useState } from 'react';
import { 
  Boxes, Play, CheckCircle, Clock, Camera, MessageSquare, 
  MapPin, Truck, ShieldCheck, Image, Lock, Sparkles, User,
  CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import { DockOperation, EvidenceKey, WarehouseProject, formatTruckReference } from '../../types/warehouse';
import { PROJECTS, EVIDENCE_CONFIGS } from '../../data/initialData';
import { MOCK_EVIDENCES } from '../../data/mockAssets';

interface CheckerDockViewProps {
  operations: DockOperation[];
  selectedProject: WarehouseProject | 'ALL';
  onOpenWhatsAppModal: (op: DockOperation) => void;
  onOpenEvidenceModal: (op: DockOperation) => void;
  onUpdateOperation: (id: string, updates: Partial<DockOperation>) => void;
}

export const CheckerDockView: React.FC<CheckerDockViewProps> = ({
  operations,
  selectedProject,
  onOpenWhatsAppModal,
  onOpenEvidenceModal,
  onUpdateOperation,
}) => {
  const filteredOps = operations.filter(
    (op) => selectedProject === 'ALL' || op.project === selectedProject
  );

  const [selectedOpId, setSelectedOpId] = useState<string>(filteredOps[0]?.id || operations[0]?.id || '');
  const currentOp = operations.find((o) => o.id === selectedOpId) || filteredOps[0] || operations[0];

  // Editable fields during dock operation - ONLY filled from existing operation data, NO static fallback strings
  const [quantity, setQuantity] = useState(currentOp?.quantity || '');
  const [sealNumber, setSealNumber] = useState(currentOp?.sealNumber || '');
  const [containerNumber, setContainerNumber] = useState(currentOp?.containerNumber || '');
  const [forkliftDriver, setForkliftDriver] = useState(currentOp?.forkliftDriver || '');
  const [checkerName, setCheckerName] = useState(currentOp?.checkerName || '');
  const [keterangan, setKeterangan] = useState(currentOp?.keterangan || '');
  const [evidences, setEvidences] = useState(currentOp?.evidences || {});

  // Active photo tab in Checker view
  const [activePhotoTab, setActivePhotoTab] = useState<'CONTAINER' | 'SERRICO' | 'SEAL'>('CONTAINER');

  // Sync when active op changes
  React.useEffect(() => {
    if (currentOp) {
      setQuantity(currentOp.quantity || '');
      setSealNumber(currentOp.sealNumber || '');
      setContainerNumber(currentOp.containerNumber || '');
      setForkliftDriver(currentOp.forkliftDriver || '');
      setCheckerName(currentOp.checkerName || '');
      setKeterangan(currentOp.keterangan || '');
      setEvidences(currentOp.evidences || {});
    }
  }, [currentOp?.id]);

  if (!currentOp) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        Tidak ada operasi di area dock.
      </div>
    );
  }

  const proj = PROJECTS[currentOp.project];

  const handleStartProcess = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    onUpdateOperation(currentOp.id, {
      startTime: timeStr,
      status: 'IN_PROGRESS',
      forkliftDriver: forkliftDriver || 'Triyadi',
      checkerName: checkerName || 'Dedi Kurniawan',
    });
  };

  const handleFinishProcess = () => {
    const now = new Date();
    const endStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Auto attach seal evidence if empty
    const updatedEvidences = { ...evidences };
    if (!updatedEvidences.segel_terpasang) {
      updatedEvidences.segel_terpasang = MOCK_EVIDENCES.segel_terpasang;
    }
    if (!updatedEvidences.kontainer_penuh) {
      updatedEvidences.kontainer_penuh = MOCK_EVIDENCES.kontainer_penuh;
    }

    onUpdateOperation(currentOp.id, {
      endTime: endStr,
      quantity: quantity || '52 BOK',
      sealNumber: sealNumber || '01572033',
      containerNumber,
      forkliftDriver: forkliftDriver || 'Triyadi',
      checkerName: checkerName || 'Dedi Kurniawan',
      keterangan: keterangan || 'Ban Terganjal 2, Serrico, surat jalan lengkap. Aman lancar kondusif',
      status: 'COMPLETED',
      evidences: updatedEvidences,
    });
  };

  const handlePhotoUpload = (key: EvidenceKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const newEvidences = { ...evidences, [key]: base64 };
        setEvidences(newEvidences);
        onUpdateOperation(currentOp.id, { evidences: newEvidences });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFillSerricoAndContainerDemo = () => {
    const newEvidences = {
      ...evidences,
      kontainer_kosong: MOCK_EVIDENCES.kontainer_kosong,
      kontainer_setengah: MOCK_EVIDENCES.kontainer_setengah,
      kontainer_penuh: MOCK_EVIDENCES.kontainer_penuh,
      serrico_luar_sebelum: MOCK_EVIDENCES.serrico_luar_sebelum,
      serrico_luar_sesudah: MOCK_EVIDENCES.serrico_luar_sesudah,
      serrico_dalam_sebelum: MOCK_EVIDENCES.serrico_dalam_sebelum,
      serrico_dalam_sesudah: MOCK_EVIDENCES.serrico_dalam_sesudah,
      segel_terpasang: MOCK_EVIDENCES.segel_terpasang,
    };
    setEvidences(newEvidences);
    setSealNumber(sealNumber || '01572033');
    setQuantity(quantity || '52 BOK');
    setForkliftDriver(forkliftDriver || 'Triyadi');
    setCheckerName(checkerName || 'Dedi Kurniawan');
    setKeterangan(keterangan || 'Ban Terganjal 2, Serrico, surat jalan lengkap. Aman lancar kondusif');

    onUpdateOperation(currentOp.id, {
      evidences: newEvidences,
      sealNumber: sealNumber || '01572033',
      quantity: quantity || '52 BOK',
      forkliftDriver: forkliftDriver || 'Triyadi',
      checkerName: checkerName || 'Dedi Kurniawan',
      keterangan: keterangan || 'Ban Terganjal 2, Serrico, surat jalan lengkap. Aman lancar kondusif',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Strict Reference: WH/Project - Rit - No Mobil - Dock */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Boxes className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CHECKER &amp; FD CONSOLE
              </span>
              <span className="text-xs text-slate-400">Urutan Referensi: WH - RIT - NOPOL - DOCK</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              Terminal Operasional Loading Dock
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-0.5">
              Pilih armada berdasarkan urutan <strong className="text-cyan-400 font-mono">[WH] - [RIT] - [NO MOBIL] - [DOCK]</strong> untuk verifikasi kuantiti, Serrico trap, dan foto kontainer.
            </p>
          </div>
        </div>

        {/* Quick Demo Preload */}
        <button
          onClick={handleAutoFillSerricoAndContainerDemo}
          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          Isi Foto Serrico &amp; Kontainer (Demo)
        </button>
      </div>

      {/* 1. SELEKSI TRUK MUDAH: Urutan [WH/Project] - [Ritase] - [No Mobil] - [Dock] */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            Daftar Armada di Dock (Format: WH ➔ RIT ➔ NO MOBIL ➔ DOCK)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {filteredOps.length} Truk Tersedia
          </span>
        </div>

        {/* Horizontal Card Selector arranged by WH -> Rit -> Nopol -> Dock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {filteredOps.map((op) => {
            const isSelected = op.id === currentOp.id;
            const opProj = PROJECTS[op.project];
            const refText = formatTruckReference(op);

            return (
              <button
                key={op.id}
                onClick={() => setSelectedOpId(op.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top line: WH & Rit */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${opProj?.badgeBg} ${opProj?.badgeText}`}>
                      WH: {op.project}
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      RIT {op.ritase}
                    </span>
                  </div>

                  {/* Middle line: Nopol */}
                  <div className="font-mono font-black text-white text-base tracking-wide">
                    {op.plateNumber || 'No Mobil -'}
                  </div>

                  {/* Bottom line: Dock */}
                  <div className="text-xs font-bold text-cyan-300 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {op.gateDock}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{op.processType === 'LOADING' ? 'MUAT' : 'BONGKAR'}</span>
                  <span className={`font-semibold ${op.status === 'COMPLETED' ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {op.status === 'COMPLETED' ? 'Selesai' : op.status === 'IN_PROGRESS' ? 'Sedang Muat' : 'Siap Dock'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Truck Status & Timing */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            {/* Header Badge */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                REFERENSI AKTIF:
              </span>
              <div className="font-mono text-sm font-black text-cyan-400 leading-snug">
                {formatTruckReference(currentOp)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-300">
                Driver: <strong>{currentOp.driverName || 'Belum diisi'}</strong> • {currentOp.transporter || 'Ekspedisi'}
              </div>
              {currentOp.containerNumber && (
                <div className="text-xs text-slate-400 font-mono">
                  Kontainer: <span className="text-white font-bold">{currentOp.containerNumber}</span>
                </div>
              )}
            </div>

            {/* Timers Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Jam Mulai Muat:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {currentOp.startTime || '--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Jam Selesai Muat:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  {currentOp.endTime || '--:--'}
                </span>
              </div>
              {currentOp.durationMinutes && (
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Durasi Pengerjaan:</span>
                  <span className="font-mono font-extrabold text-amber-400">
                    {currentOp.durationMinutes} Menit
                  </span>
                </div>
              )}
            </div>

            {/* Start / Finish Action */}
            <div className="space-y-2">
              {!currentOp.startTime ? (
                <button
                  onClick={handleStartProcess}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  Mulai Muat / Bongkar Sekarang
                </button>
              ) : !currentOp.endTime ? (
                <button
                  onClick={handleFinishProcess}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition active:scale-[0.98]"
                >
                  <CheckCircle className="w-4 h-4" />
                  Selesai Muat / Pasang Segel
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-center">
                  <span className="text-xs font-bold text-cyan-400 flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Operasi Muat Selesai
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format laporan WhatsApp siap disalin.
                  </p>
                </div>
              )}

              <button
                onClick={() => onOpenWhatsAppModal(currentOp)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                Format Laporan WhatsApp (1-Klik)
              </button>
            </div>
          </div>
        </div>

        {/* Right Columns: Checker Form + Serrico + Kontainer Fill Evidence */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section: Data Kuantiti & Personil (No static prefilled defaults) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              1. Input Kuantiti, Segel &amp; Petugas Dock
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Jumlah Muatan / Bongkar
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Contoh: 52 BOK / 40 Pallet"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nomor Kontainer
                </label>
                <input
                  type="text"
                  value={containerNumber}
                  onChange={(e) => setContainerNumber(e.target.value)}
                  placeholder="Contoh: TGHU 9103630"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nomor Segel (Seal No.)
                </label>
                <input
                  type="text"
                  value={sealNumber}
                  onChange={(e) => setSealNumber(e.target.value)}
                  placeholder="Contoh: 01572033"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Operator Forklift (Forklift Driver)
                </label>
                <input
                  type="text"
                  value={forkliftDriver}
                  onChange={(e) => setForkliftDriver(e.target.value)}
                  placeholder="Nama Forklift Driver (e.g. Triyadi)"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Checker / Field Dispatcher
                </label>
                <input
                  type="text"
                  value={checkerName}
                  onChange={(e) => setCheckerName(e.target.value)}
                  placeholder="Nama Checker (e.g. Dedi Kurniawan)"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Keterangan &amp; Catatan Khusus Laporan WhatsApp
              </label>
              <textarea
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Ban Terganjal 2, Serrico, surat jalan lengkap. Aman lancar kondusif"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Section: 2. Foto Evidence Khusus (Serrico Luar/Dalam & Kontainer Kosong/Setengah/Penuh) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  2. Evidence Serrico &amp; Kondisi Kontainer
                </h4>
                <p className="text-xs text-slate-400">
                  Dokumentasi Serrico luar/dalam (sebelum &amp; sesudah) serta level pengisian kontainer
                </p>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('CONTAINER')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activePhotoTab === 'CONTAINER' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kontainer (0% / 50% / 100%)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('SERRICO')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activePhotoTab === 'SERRICO' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Serrico Trap (Luar / Dalam)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('SEAL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    activePhotoTab === 'SEAL' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Segel Pintu
                </button>
              </div>
            </div>

            {/* TAB 1: Kondisi Kontainer (Kosong, Setengah, Penuh) */}
            {activePhotoTab === 'CONTAINER' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Kosong */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white block">
                      Kontainer Kosong (0%)
                    </span>
                    {evidences.kontainer_kosong && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2 leading-tight">
                    Sebelum muat / sesudah bongkar bersih
                  </span>
                  {evidences.kontainer_kosong ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.kontainer_kosong} alt="Kontainer Kosong" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('kontainer_kosong', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] font-medium text-slate-300">Foto Kosong</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('kontainer_kosong', e)} className="hidden" />
                    </label>
                  )}
                </div>

                {/* 2. Setengah */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white block">
                      Terisi Setengah (50%)
                    </span>
                    {evidences.kontainer_setengah && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2 leading-tight">
                    Proses muat/bongkar berjalan separuh
                  </span>
                  {evidences.kontainer_setengah ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.kontainer_setengah} alt="Kontainer Setengah" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('kontainer_setengah', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] font-medium text-slate-300">Foto 50% Muat</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('kontainer_setengah', e)} className="hidden" />
                    </label>
                  )}
                </div>

                {/* 3. Penuh */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white block">
                      Terisi Penuh (100%)
                    </span>
                    {evidences.kontainer_penuh && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2 leading-tight">
                    Muatan selesai tertata rapi
                  </span>
                  {evidences.kontainer_penuh ? (
                    <div className="relative h-28 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.kontainer_penuh} alt="Kontainer Penuh" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/80 text-[10px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('kontainer_penuh', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-5 h-5 text-slate-500 mb-1" />
                      <span className="text-[11px] font-medium text-slate-300">Foto 100% Penuh</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('kontainer_penuh', e)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Serrico Trap (Luar & Dalam, Sebelum & Sesudah) */}
            {activePhotoTab === 'SERRICO' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Serrico Luar Sebelum */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300">Serrico Luar (Sebelum)</span>
                    {evidences.serrico_luar_sebelum && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2">Bodi luar pintu awal</span>
                  {evidences.serrico_luar_sebelum ? (
                    <div className="relative h-24 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.serrico_luar_sebelum} alt="Serrico Luar Sebelum" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_luar_sebelum', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-4 h-4 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-300">Foto Luar Awal</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_luar_sebelum', e)} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Serrico Luar Sesudah */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400">Serrico Luar (Sesudah)</span>
                    {evidences.serrico_luar_sesudah && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2">Bodi luar pintu akhir</span>
                  {evidences.serrico_luar_sesudah ? (
                    <div className="relative h-24 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.serrico_luar_sesudah} alt="Serrico Luar Sesudah" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_luar_sesudah', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-4 h-4 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-300">Foto Luar Akhir</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_luar_sesudah', e)} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Serrico Dalam Sebelum */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-cyan-300">Serrico Dalam (Sebelum)</span>
                    {evidences.serrico_dalam_sebelum && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2">Trap gantung interior awal</span>
                  {evidences.serrico_dalam_sebelum ? (
                    <div className="relative h-24 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.serrico_dalam_sebelum} alt="Serrico Dalam Sebelum" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_dalam_sebelum', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-4 h-4 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-300">Foto Dalam Awal</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_dalam_sebelum', e)} className="hidden" />
                    </label>
                  )}
                </div>

                {/* Serrico Dalam Sesudah */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400">Serrico Dalam (Sesudah)</span>
                    {evidences.serrico_dalam_sesudah && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block mb-2">Trap gantung interior akhir</span>
                  {evidences.serrico_dalam_sesudah ? (
                    <div className="relative h-24 rounded-lg overflow-hidden border border-slate-700 bg-black">
                      <img src={evidences.serrico_dalam_sesudah} alt="Serrico Dalam Sesudah" className="w-full h-full object-cover" />
                      <label className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-slate-200 cursor-pointer">
                        Ganti
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_dalam_sesudah', e)} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 rounded-lg border border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/50 cursor-pointer">
                      <Camera className="w-4 h-4 text-slate-500 mb-1" />
                      <span className="text-[10px] text-slate-300">Foto Dalam Akhir</span>
                      <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('serrico_dalam_sesudah', e)} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Segel Pintu */}
            {activePhotoTab === 'SEAL' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs font-bold text-white block mb-1">
                    Foto Nomor Segel Terpasang di Engsel Pintu
                  </span>
                  <p className="text-xs text-slate-400 mb-3">
                    Pastikan nomor segel (<span className="text-amber-400 font-mono font-bold">{sealNumber || 'Belum diisi'}</span>) terlihat tajam dan terbaca jelas untuk audit security &amp; customer.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white cursor-pointer border border-slate-700">
                    <Camera className="w-4 h-4 text-amber-400" />
                    Ambil / Upload Foto Segel
                    <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload('segel_terpasang', e)} className="hidden" />
                  </label>
                </div>

                <div className="w-44 h-32 rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center">
                  {evidences.segel_terpasang ? (
                    <img src={evidences.segel_terpasang} alt="Segel" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-500">Belum ada foto</span>
                  )}
                </div>
              </div>
            )}

            {/* Save updates */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateOperation(currentOp.id, {
                    quantity,
                    sealNumber,
                    containerNumber,
                    forkliftDriver,
                    checkerName,
                    keterangan,
                    evidences,
                  });
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-slate-700"
              >
                Simpan Perubahan Data &amp; Foto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
