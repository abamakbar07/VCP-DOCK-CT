import React, { useState } from 'react';
import { 
  Truck, Camera, CheckCircle2, ShieldCheck, MapPin, Upload, 
  Sparkles, AlertCircle, FileCheck, ArrowRight, UserCheck, ChevronRight
} from 'lucide-react';
import { DockOperation, EvidenceKey, StageStatus, formatTruckReference } from '../../types/warehouse';
import { EVIDENCE_CONFIGS, PROJECTS } from '../../data/initialData';
import { MOCK_EVIDENCES } from '../../data/mockAssets';

interface DriverRegistrationViewProps {
  operations: DockOperation[];
  activeOpId?: string;
  onSelectOperation: (op: DockOperation) => void;
  onUpdateOperation: (id: string, updates: Partial<DockOperation>) => void;
}

export const DriverRegistrationView: React.FC<DriverRegistrationViewProps> = ({
  operations,
  activeOpId,
  onSelectOperation,
  onUpdateOperation,
}) => {
  const currentOp = operations.find((o) => o.id === activeOpId) || operations[0];

  // Form fields initialized strictly from operation data, or EMPTY (NO STATIC PREFILL)
  const [driverName, setDriverName] = useState(currentOp?.driverName || '');
  const [driverPhone, setDriverPhone] = useState(currentOp?.driverPhone || '');
  const [plateNumber, setPlateNumber] = useState(currentOp?.plateNumber || '');
  const [containerNumber, setContainerNumber] = useState(currentOp?.containerNumber || '');
  const [transporter, setTransporter] = useState(currentOp?.transporter || '');
  const [evidences, setEvidences] = useState<Partial<Record<EvidenceKey, string>>>(
    currentOp?.evidences || {}
  );
  const [checklist, setChecklist] = useState({
    wheelChock: currentOp?.safetyChecklist?.wheelChock || false,
    keyRemoved: currentOp?.safetyChecklist?.keyRemoved || false,
    handbrakeOn: currentOp?.safetyChecklist?.handbrakeOn || false,
    ppeWorn: currentOp?.safetyChecklist?.ppeWorn || false,
  });
  const [submitted, setSubmitted] = useState(false);

  // Sync state when active operation changes
  React.useEffect(() => {
    if (currentOp) {
      setDriverName(currentOp.driverName || '');
      setDriverPhone(currentOp.driverPhone || '');
      setPlateNumber(currentOp.plateNumber || '');
      setContainerNumber(currentOp.containerNumber || '');
      setTransporter(currentOp.transporter || '');
      setEvidences(currentOp.evidences || {});
      setChecklist({
        wheelChock: currentOp.safetyChecklist?.wheelChock || false,
        keyRemoved: currentOp.safetyChecklist?.keyRemoved || false,
        handbrakeOn: currentOp.safetyChecklist?.handbrakeOn || false,
        ppeWorn: currentOp.safetyChecklist?.ppeWorn || false,
      });
      setSubmitted(
        currentOp.status === 'SAFETY_CHECK' ||
        currentOp.status === 'IN_PROGRESS' ||
        currentOp.status === 'COMPLETED'
      );
    }
  }, [currentOp?.id]);

  if (!currentOp) {
    return (
      <div className="p-8 text-center text-slate-400">
        <Truck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        Belum ada jadwal ritase yang aktif. Hubungi petugas security di pos.
      </div>
    );
  }

  const proj = PROJECTS[currentOp.project];

  // Handle local camera or file upload
  const handlePhotoUpload = (key: EvidenceKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setEvidences((prev) => ({ ...prev, [key]: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Instant demo photo prefill for testing
  const handlePrefillDemoPhotos = () => {
    setEvidences({
      ...evidences,
      tampak_depan: MOCK_EVIDENCES.tampak_depan,
      sisi_truk: MOCK_EVIDENCES.sisi_truk,
      ban_terganjal: MOCK_EVIDENCES.ban_terganjal,
      kunci_tercabut: MOCK_EVIDENCES.kunci_tercabut,
      rem_tangan: MOCK_EVIDENCES.rem_tangan,
      sim_driver: MOCK_EVIDENCES.sim_driver,
      kir_truk: MOCK_EVIDENCES.kir_truk,
      surat_jalan: MOCK_EVIDENCES.surat_jalan,
      kontainer_kosong: MOCK_EVIDENCES.kontainer_kosong,
    });
    setChecklist({
      wheelChock: true,
      keyRemoved: true,
      handbrakeOn: true,
      ppeWorn: true,
    });
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedChecklist = {
      ...currentOp.safetyChecklist,
      ...checklist,
      simValid: true,
      kirValid: true,
      doComplete: true,
      containerClean: true,
    };

    onUpdateOperation(currentOp.id, {
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      containerNumber: containerNumber ? containerNumber.trim().toUpperCase() : undefined,
      transporter: transporter.trim(),
      evidences,
      safetyChecklist: updatedChecklist,
      status: 'SAFETY_CHECK',
      keterangan: 'Registrasi mandiri driver telah lengkap dengan foto evidence & safety checklist',
    });

    setSubmitted(true);
  };

  const driverEvidences = EVIDENCE_CONFIGS.filter(
    (c) => c.role === 'DRIVER' || c.role === 'ALL'
  );
  const uploadedCount = Object.keys(evidences).length;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Mobile Header Banner with Strict Reference: WH ➔ RIT ➔ NO MOBIL ➔ DOCK */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/80 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${proj?.badgeBg} ${proj?.badgeText}`}>
              WH: {currentOp.project}
            </span>
            <span className="font-mono font-bold text-amber-400 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              RIT {currentOp.ritase}
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              {currentOp.processType === 'LOADING' ? 'MUAT' : 'BONGKAR'}
            </span>
          </div>

          <select
            value={currentOp.id}
            onChange={(e) => {
              const found = operations.find((o) => o.id === e.target.value);
              if (found) onSelectOperation(found);
            }}
            className="text-[11px] bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-cyan-300 font-mono"
          >
            {operations.map((o) => (
              <option key={o.id} value={o.id}>
                {formatTruckReference(o)}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned Dock Guide with Standard Reference */}
        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-cyan-300/80 uppercase font-bold tracking-wider block">
                ARAHAN PINTU DOCK
              </span>
              <div className="text-base font-extrabold text-cyan-300">
                {currentOp.gateDock}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Referensi Truk:</span>
            <span className="font-mono font-bold text-amber-400 text-xs">
              {currentOp.plateNumber || 'No Mobil -'}
            </span>
          </div>
        </div>
      </div>

      {submitted ? (
        /* Success Screen */
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Registrasi &amp; Safety Berhasil!</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
              Data armada dan {uploadedCount} foto evidence keselamatan telah tersimpan ke sistem pusat.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Referensi Operasi:</span>
              <span className="font-mono font-bold text-cyan-400">{formatTruckReference(currentOp)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Lokasi Dock:</span>
              <span className="font-bold text-amber-400">{currentOp.gateDock}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status Operasional:</span>
              <span className="text-emerald-400 font-semibold">Tersimpan di Sistem Antrean</span>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-xs text-amber-300 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              Silakan parkir truk merapat ke <strong className="text-white">{currentOp.gateDock}</strong>, pasang 2 ganjal ban, cabut kunci kontak, dan lapor ke Checker / Forklift Driver di area dock.
            </span>
          </div>

          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Ubah / Perbarui Foto Evidence
          </button>
        </div>
      ) : (
        /* Multi-Step Registration Form */
        <form onSubmit={handleSubmitRegistration} className="space-y-5">
          {/* Quick Demo Fill Helper */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Isi cepat foto demo K3?
            </span>
            <button
              type="button"
              onClick={handlePrefillDemoPhotos}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] shadow hover:bg-amber-400 transition"
            >
              Isi Foto Standar Demo
            </button>
          </div>

          {/* Section 1: Identitas Truk & Driver (NO STATIC DEFAULT VALUES) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                1. Data Supir &amp; Kendaraan
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nama Supir / Driver
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Nama Lengkap Driver"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  No. HP / WhatsApp
                </label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Plat Nomor Truk (Nopol)
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="Contoh: B 9522 SEI"
                  required
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  No. Kontainer (Opsional)
                </label>
                <input
                  type="text"
                  value={containerNumber}
                  onChange={(e) => setContainerNumber(e.target.value)}
                  placeholder="Contoh: TGHU 9103630"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Vendor Ekspedisi / Transporter
              </label>
              <input
                type="text"
                value={transporter}
                onChange={(e) => setTransporter(e.target.value)}
                placeholder="Contoh: PT Assa Logistik"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Section 2: Upload Evidence Foto Keselamatan (Camera Snap) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  2. Foto Evidence Keselamatan &amp; Dokumen
                </h4>
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-400">
                {uploadedCount} / {driverEvidences.length} Foto
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Foto satu persatu langsung dari kamera HP untuk bukti safety audit sesuai standar warehouse.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {driverEvidences.map((cfg) => {
                const photo = evidences[cfg.key];
                return (
                  <div
                    key={cfg.key}
                    className={`p-3 rounded-xl border transition ${
                      photo
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                          {cfg.description}
                        </span>
                      </div>
                      {photo ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                          Wajib
                        </span>
                      )}
                    </div>

                    {photo ? (
                      <div className="relative rounded-lg overflow-hidden h-28 border border-slate-700 bg-black">
                        <img
                          src={photo}
                          alt={cfg.label}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/80 hover:bg-black text-[10px] text-slate-200 cursor-pointer">
                          Ganti
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handlePhotoUpload(cfg.key, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-900/50 cursor-pointer group transition">
                        <Camera className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition mb-1" />
                        <span className="text-[11px] font-medium text-slate-300 group-hover:text-white">
                          Ambil Foto Kamera
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => handlePhotoUpload(cfg.key, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Safety Checklist Mandatori */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                3. Deklarasi Keselamatan K3 (Mandatori)
              </h4>
            </div>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.wheelChock}
                onChange={(e) => setChecklist({ ...checklist, wheelChock: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-xs text-slate-200 font-medium">
                Ban truk sudah terganjal minimal 2 balok ganjal (depan/belakang).
              </span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.keyRemoved}
                onChange={(e) => setChecklist({ ...checklist, keyRemoved: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-xs text-slate-200 font-medium">
                Kunci kontak mesin truk sudah dicabut &amp; diletakkan aman.
              </span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.handbrakeOn}
                onChange={(e) => setChecklist({ ...checklist, handbrakeOn: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-xs text-slate-200 font-medium">
                Rem tangan (parking brake / rem angin) telah aktif terkunci.
              </span>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={checklist.ppeWorn}
                onChange={(e) => setChecklist({ ...checklist, ppeWorn: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="text-xs text-slate-200 font-medium">
                Driver memakai APD (Rompi reflektor &amp; Safety Shoes).
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition active:scale-[0.98]"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            Kirim Registrasi &amp; Masuk ke Dock
          </button>
        </form>
      )}
    </div>
  );
};
