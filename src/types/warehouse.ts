export type WarehouseProject = 'SFP' | 'HMS' | 'PMID' | 'CLOVE';

export type ProcessType = 'LOADING' | 'UNLOADING';

export type UserRole = 'ADMIN' | 'SECURITY' | 'DRIVER' | 'CHECKER';

export type StageStatus = 
  | 'PLANNED'             // Di-planning oleh Admin
  | 'GATE_IN'             // Truk tiba di Security (Pos Satpam)
  | 'SAFETY_CHECK'        // Driver sedang registrasi & upload foto evidence safety
  | 'IN_PROGRESS'         // Forklift / Checker sedang muat / bongkar
  | 'COMPLETED'           // Selesai muat/bongkar, segel terpasang, siap gate out
  | 'GATE_OUT';           // Truk keluar area warehouse

export interface SafetyChecklist {
  wheelChock: boolean;       // Ban Terganjal 2
  keyRemoved: boolean;       // Kunci Kontak Tercabut
  handbrakeOn: boolean;      // Rem Tangan Aktif
  simValid: boolean;         // SIM Masih Berlaku
  kirValid: boolean;         // Uji KIR Aktif
  doComplete: boolean;       // Surat Jalan / DO Lengkap
  ppeWorn: boolean;          // APD (Safety Helmet, Rompi, Safety Shoes)
  containerClean: boolean;   // Kontainer bersih, kering, tidak bau/bocor
}

export type EvidenceKey = 
  | 'tampak_depan'
  | 'sisi_truk'
  | 'ban_terganjal'
  | 'kunci_tercabut'
  | 'rem_tangan'
  | 'sim_driver'
  | 'kir_truk'
  | 'surat_jalan'
  // Serrico (Pest trap & monitoring) Luar & Dalam (Sebelum & Sesudah)
  | 'serrico_luar_sebelum'
  | 'serrico_luar_sesudah'
  | 'serrico_dalam_sebelum'
  | 'serrico_dalam_sesudah'
  // Kondisi Kontainer (Kosong, Setengah, Penuh)
  | 'kontainer_kosong'
  | 'kontainer_setengah'
  | 'kontainer_penuh'
  // Proses Muat & Segel
  | 'proses_muat'
  | 'segel_terpasang';

export interface EvidenceConfig {
  key: EvidenceKey;
  label: string;
  description: string;
  role: 'DRIVER' | 'CHECKER' | 'SECURITY' | 'ALL';
  category: 'safety' | 'legal' | 'cargo' | 'serrico' | 'container_fill';
  stage?: 'SEBELUM' | 'PROSES' | 'SESUDAH';
  required: boolean;
}

export interface DockOperation {
  id: string;
  planCode: string;
  project: WarehouseProject;
  ritase: number;
  processType: ProcessType;
  gateDock: string;           // e.g. "Dock 07"
  date: string;               // YYYY-MM-DD
  dayName: string;            // Senin, Selasa, Rabu, etc.
  
  // Data Armada & Personil
  plateNumber: string;        // e.g. "B 9522 SEI"
  containerNumber?: string;   // e.g. "TGHU 9103630"
  sealNumber?: string;        // e.g. "01572033"
  transporter: string;        // e.g. "PT Assa Logistik"
  driverName: string;         // e.g. "Wawan"
  driverPhone?: string;       // e.g. "081234567890"
  forkliftDriver: string;     // e.g. "Triyadi"
  checkerName: string;        // e.g. "Dedi Kurniawan"
  securityName: string;       // e.g. "Budi"

  // Jam Operasional
  gateInTime?: string;        // e.g. "11:45"
  startTime?: string;         // e.g. "12:15" (Mulai Muat)
  endTime?: string;           // e.g. "12:40" (Selesai Muat)
  gateOutTime?: string;       // e.g. "13:05"
  durationMinutes?: number;

  // Cargo & Detail
  quantity: string;           // e.g. "52 BOK" / "24 Pallet"
  cargoType: string;          // e.g. "Finished Goods Rokok", "Raw Materials"
  targetQuantity?: string;

  // Status & Keselamatan
  status: StageStatus;
  safetyChecklist: SafetyChecklist;
  keterangan: string;         // e.g. "Ban Terganjal 2, Serrico, surat jalan lengkap. Aman lancar kondusif"
  
  // Evidences (Key -> DataURL or sample image link)
  evidences: Partial<Record<EvidenceKey, string>>;
  
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInfo {
  code: WarehouseProject;
  name: string;
  fullName: string;
  docks: string[];
  themeColor: string;
  badgeBg: string;
  badgeText: string;
  borderCol: string;
}

// Utility: Standard Reference Format: [WH/Project] - [Ritase] - [No Mobil] - [Dock]
export function formatTruckReference(op: {
  project: string;
  ritase: number | string;
  plateNumber: string;
  gateDock: string;
}): string {
  const proj = op.project || 'WH';
  const rit = typeof op.ritase === 'number' ? `RIT ${op.ritase}` : op.ritase || 'RIT -';
  const plate = op.plateNumber || 'No Mobil -';
  const dock = op.gateDock || 'Dock -';
  return `${proj} - ${rit} - ${plate} - ${dock}`;
}
