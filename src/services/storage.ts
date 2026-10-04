import JSZip from 'jszip';
import { DockOperation, StageStatus } from '../types/warehouse';
import { INITIAL_OPERATIONS, PROJECTS } from '../data/initialData';

const STORAGE_KEY = 'dockflow_operations_v1';

export function getStoredOperations(): DockOperation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OPERATIONS));
      return INITIAL_OPERATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_OPERATIONS;
    }
    return parsed;
  } catch (e) {
    console.error('Error loading operations from storage:', e);
    return INITIAL_OPERATIONS;
  }
}

export function saveAllOperations(ops: DockOperation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ops));
  } catch (e) {
    console.error('Error saving operations:', e);
  }
}

export function updateOperationInStorage(id: string, updates: Partial<DockOperation>): DockOperation[] {
  const current = getStoredOperations();
  const index = current.findIndex(op => op.id === id);
  if (index >= 0) {
    const existing = current[index];
    const updated: DockOperation = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Calculate duration in minutes if both startTime and endTime are present
    if (updated.startTime && updated.endTime) {
      try {
        const [startH, startM] = updated.startTime.split(':').map(Number);
        const [endH, endM] = updated.endTime.split(':').map(Number);
        const diff = (endH * 60 + endM) - (startH * 60 + startM);
        if (diff > 0) {
          updated.durationMinutes = diff;
        }
      } catch (err) {
        console.warn('Could not parse time diff', err);
      }
    }

    current[index] = updated;
    saveAllOperations(current);
  }
  return current;
}

export function addOperationToStorage(op: DockOperation): DockOperation[] {
  const current = getStoredOperations();
  const updated = [op, ...current];
  saveAllOperations(updated);
  return updated;
}

export function deleteOperationFromStorage(id: string): DockOperation[] {
  const current = getStoredOperations();
  const updated = current.filter(op => op.id !== id);
  saveAllOperations(updated);
  return updated;
}

export function resetStorageToDefaults(): DockOperation[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_OPERATIONS));
  return INITIAL_OPERATIONS;
}

// Format: [WH/Project] - [Ritase] - [No Mobil] - [Dock]
export function formatTruckReference(op: {
  project: string;
  ritase: number | string;
  plateNumber: string;
  gateDock: string;
}): string {
  const proj = op.project || 'WH';
  const rit = typeof op.ritase === 'number' ? `RIT ${op.ritase}` : (op.ritase || 'RIT -');
  const plate = op.plateNumber || 'No Mobil -';
  const dock = op.gateDock || 'Dock -';
  return `${proj} - ${rit} - ${plate} - ${dock}`;
}

// Generate the exact WhatsApp report template matching user's screenshot
export function formatWhatsAppReport(op: DockOperation): string {
  const isMuat = op.processType === 'LOADING';
  const processTitle = isMuat ? 'Muat barang' : 'Bongkar barang';
  const mulaititle = isMuat ? 'Mulai Muat' : 'Mulai Bongkar';
  const selesaititle = isMuat ? 'Selesai Muat' : 'Selesai Bongkar';
  const jumlahtitle = isMuat ? 'Jumlah muat' : 'Jumlah bongkar';

  // Format date to DD-MM-YYYY
  let formattedDate = op.date;
  if (op.date && op.date.includes('-')) {
    const parts = op.date.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  const lines = [
    `Pemantauan ${processTitle} : PT ${op.project}`,
    `RIT ${op.ritase}`,
    `Hari         : ${op.dayName || 'Hari Ini'}`,
    `Tanggal      : ${formattedDate}`,
    `${mulaititle.padEnd(12, ' ')}: ${op.startTime || '-'}${op.startTime && !op.startTime.includes(':') ? '' : ''}`,
    `${selesaititle.padEnd(12, ' ')}: ${op.endTime || '-'}`,
    `${jumlahtitle.padEnd(12, ' ')}: ${op.quantity || '-'}`,
    `No. Polisi   : ${op.plateNumber || '-'}`,
    `No. Kontainer: ${op.containerNumber || '-'}`,
    `No. Segel    : ${op.sealNumber || '-'}`,
    `Driver       : ${op.driverName || '-'}`,
    `Forklift Driver : ${op.forkliftDriver || '-'}`,
    `Security     : ${op.securityName || '-'}`,
    ``,
    `Keterangan : ${op.keterangan || 'Ban Terganjal 2, Serrico, surat jalan lengkap.'}`,
    `Aman lancar kondusif`,
  ];

  // If evidence photos exist, attach verifiable reference
  const evidenceCount = Object.keys(op.evidences || {}).length;
  if (evidenceCount > 0) {
    lines.push(``);
    lines.push(`📸 Bukti Evidences (${evidenceCount} Foto Terverifikasi Termasuk Serrico & Kontainer):`);
    lines.push(`Ref Truk  : ${formatTruckReference(op)}`);
    lines.push(`Link Audit: ${window.location.origin}/?op=${op.id}&view=evidence`);
  }

  return lines.join('\n');
}

// Export all records to CSV for Admin download
export function exportOperationsToCSV(ops: DockOperation[]): void {
  const headers = [
    'Referensi Truk [WH - RIT - NOPOL - DOCK]',
    'ID Operasi',
    'Project',
    'Tipe',
    'Ritase',
    'Dock / Gate',
    'Tanggal',
    'Hari',
    'No Polisi',
    'No Kontainer',
    'No Segel',
    'Nama Driver',
    'Vendor Transporter',
    'Forklift Driver',
    'Checker',
    'Security',
    'Gate In',
    'Mulai',
    'Selesai',
    'Durasi (Menit)',
    'Gate Out',
    'Jumlah Muatan',
    'Kargo',
    'Status',
    'Jumlah Foto Evidence',
    'Keterangan',
  ];

  const rows = ops.map(op => [
    `"${formatTruckReference(op)}"`,
    `"${op.id}"`,
    `"${op.project}"`,
    `"${op.processType}"`,
    `"RIT ${op.ritase}"`,
    `"${op.gateDock}"`,
    `"${op.date}"`,
    `"${op.dayName}"`,
    `"${op.plateNumber}"`,
    `"${op.containerNumber || ''}"`,
    `"${op.sealNumber || ''}"`,
    `"${op.driverName}"`,
    `"${op.transporter}"`,
    `"${op.forkliftDriver}"`,
    `"${op.checkerName}"`,
    `"${op.securityName}"`,
    `"${op.gateInTime || ''}"`,
    `"${op.startTime || ''}"`,
    `"${op.endTime || ''}"`,
    `"${op.durationMinutes || ''}"`,
    `"${op.gateOutTime || ''}"`,
    `"${op.quantity}"`,
    `"${op.cargoType}"`,
    `"${op.status}"`,
    `"${Object.keys(op.evidences || {}).length}"`,
    `"${(op.keterangan || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `DockFlow_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Bulk Download All Photos into a structured ZIP Archive for Email Reporting
export async function bulkDownloadPhotosZip(
  targetOps: DockOperation[],
  customFilename?: string
): Promise<{ success: boolean; count: number }> {
  const zip = new JSZip();
  let totalPhotosPacked = 0;

  for (const op of targetOps) {
    const safeRef = `${op.project}_RIT${op.ritase}_${op.plateNumber.replace(/\s+/g, '_')}_${op.gateDock.replace(/\s+/g, '_')}`;
    const folder = zip.folder(safeRef);
    if (!folder) continue;

    // 1. Add Text Report to folder for email body paste
    const reportText = formatWhatsAppReport(op);
    folder.file('LAPORAN_WHATSAPP_EMAIL.txt', reportText);

    // 2. Add all evidence photos
    const evidenceEntries = Object.entries(op.evidences || {});
    for (const [key, dataUrl] of evidenceEntries) {
      if (!dataUrl) continue;

      if (dataUrl.startsWith('data:image/svg+xml')) {
        // Decode SVG data URI
        const cleanSvg = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml(?:;utf8)?,/, ''));
        folder.file(`${key}.svg`, cleanSvg);
        totalPhotosPacked++;
      } else if (dataUrl.startsWith('data:image/')) {
        // Base64 image
        const parts = dataUrl.split(',');
        const mimeMatch = parts[0].match(/:(.*?);/);
        const ext = mimeMatch ? (mimeMatch[1].includes('png') ? 'png' : 'jpg') : 'jpg';
        const base64Data = parts[1];
        folder.file(`${key}.${ext}`, base64Data, { base64: true });
        totalPhotosPacked++;
      }
    }
  }

  // Add Master summary
  const summaryLines = [
    `============================================================`,
    `DOCKFLOW - REKAP EVIDENCE REPORT PHOTO ARCHIVE`,
    `Generated At: ${new Date().toLocaleString('id-ID')}`,
    `Total Ritase: ${targetOps.length}`,
    `Total Photos: ${totalPhotosPacked}`,
    `============================================================\n`,
    ...targetOps.map((o) => `[${formatTruckReference(o)}] - Status: ${o.status} - Driver: ${o.driverName} - Segel: ${o.sealNumber || '-'}`),
  ];
  zip.file('SUMMARY_REKAP_EMAIL.txt', summaryLines.join('\n'));

  // Generate blob & trigger browser download
  const content = await zip.generateAsync({ type: 'blob' });
  const filename = customFilename || `DockFlow_Evidence_Bulky_Report_${new Date().toISOString().slice(0, 10)}.zip`;

  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { success: true, count: totalPhotosPacked };
}
