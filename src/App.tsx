import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AdminPlanningView } from './components/Admin/AdminPlanningView';
import { SecurityGateView } from './components/Security/SecurityGateView';
import { DriverRegistrationView } from './components/Driver/DriverRegistrationView';
import { CheckerDockView } from './components/Checker/CheckerDockView';
import { ReportSummaryView } from './components/Admin/ReportSummaryView';
import { WhatsAppReportModal } from './components/Common/WhatsAppReportModal';
import { EvidenceGalleryModal } from './components/Common/EvidenceGalleryModal';
import { QrShareModal } from './components/Common/QrShareModal';
import { DockOperation, UserRole, WarehouseProject } from './types/warehouse';
import { 
  getStoredOperations, 
  saveAllOperations, 
  updateOperationInStorage, 
  addOperationToStorage, 
  deleteOperationFromStorage,
  resetStorageToDefaults
} from './services/storage';
import { 
  Building, Shield, Truck, Boxes, CheckCircle2, 
  ArrowRight, Sparkles, AlertCircle, Info, MessageSquare
} from 'lucide-react';

export default function App() {
  const [operations, setOperations] = useState<DockOperation[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole | 'REPORT'>('ADMIN');
  const [selectedProject, setSelectedProject] = useState<WarehouseProject | 'ALL'>('ALL');
  const [activeDriverOpId, setActiveDriverOpId] = useState<string>('');

  // Modals state
  const [whatsAppModalOp, setWhatsAppModalOp] = useState<DockOperation | null>(null);
  const [evidenceModalOp, setEvidenceModalOp] = useState<DockOperation | null>(null);
  const [qrModalOp, setQrModalOp] = useState<DockOperation | null>(null);

  // Initialize data and check URL query params
  useEffect(() => {
    const loaded = getStoredOperations();
    setOperations(loaded);

    // Read URL params if opened via QR or direct link
    const searchParams = new URLSearchParams(window.location.search);
    const opParam = searchParams.get('op');
    const roleParam = searchParams.get('role');
    const viewParam = searchParams.get('view');

    if (opParam) {
      setActiveDriverOpId(opParam);
      const targetOp = loaded.find((o) => o.id === opParam);
      if (targetOp && viewParam === 'evidence') {
        setEvidenceModalOp(targetOp);
      }
    }

    if (roleParam && ['ADMIN', 'SECURITY', 'DRIVER', 'CHECKER'].includes(roleParam)) {
      setCurrentRole(roleParam as UserRole);
    }
  }, []);

  const handleUpdateOperation = (id: string, updates: Partial<DockOperation>) => {
    const updated = updateOperationInStorage(id, updates);
    setOperations([...updated]);
    // update modal if open
    if (whatsAppModalOp && whatsAppModalOp.id === id) {
      const refreshed = updated.find((o) => o.id === id);
      if (refreshed) setWhatsAppModalOp(refreshed);
    }
    if (evidenceModalOp && evidenceModalOp.id === id) {
      const refreshed = updated.find((o) => o.id === id);
      if (refreshed) setEvidenceModalOp(refreshed);
    }
  };

  const handleAddOperation = (op: DockOperation) => {
    const updated = addOperationToStorage(op);
    setOperations([...updated]);
  };

  const handleDeleteOperation = (id: string) => {
    const updated = deleteOperationFromStorage(id);
    setOperations([...updated]);
  };

  const handleResetData = () => {
    if (confirm('Kembalikan ke data standar simulasi demo (PT HMS RIT 7, dll)?')) {
      const def = resetStorageToDefaults();
      setOperations([...def]);
    }
  };

  const handleOpenDriverView = (opId: string) => {
    setActiveDriverOpId(opId);
    setCurrentRole('DRIVER');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />

      {/* Interactive Workflow Guide Ribbon */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Alur Operasional:
            </span>
            <span className="hidden sm:inline text-slate-400">
              1. Admin Planning ➔ 2. Security Gate (QR) ➔ 3. Driver Safety Upload ➔ 4. Checker Tally &amp; Salin Format WA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Role Aktif:</span>
            <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {currentRole === 'ADMIN' && '🏢 Admin / Planning'}
              {currentRole === 'SECURITY' && '👮 Pos Satpam Security'}
              {currentRole === 'DRIVER' && '🚛 Driver Self-Service'}
              {currentRole === 'CHECKER' && '📦 Checker & Forklift'}
              {currentRole === 'REPORT' && '📊 Rekap WhatsApp & Audit'}
            </span>
          </div>
        </div>
      </div>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentRole === 'ADMIN' && (
          <AdminPlanningView
            operations={operations}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onOpenWhatsAppModal={(op) => setWhatsAppModalOp(op)}
            onOpenEvidenceModal={(op) => setEvidenceModalOp(op)}
            onOpenQrModal={(op) => setQrModalOp(op)}
            onAddOperation={handleAddOperation}
            onUpdateOperation={handleUpdateOperation}
            onDeleteOperation={handleDeleteOperation}
            onResetData={handleResetData}
          />
        )}

        {currentRole === 'SECURITY' && (
          <SecurityGateView
            operations={operations}
            selectedProject={selectedProject}
            onOpenWhatsAppModal={(op) => setWhatsAppModalOp(op)}
            onOpenEvidenceModal={(op) => setEvidenceModalOp(op)}
            onOpenQrModal={(op) => setQrModalOp(op)}
            onUpdateOperation={handleUpdateOperation}
            onAddOperation={handleAddOperation}
            onOpenDriverView={handleOpenDriverView}
          />
        )}

        {currentRole === 'DRIVER' && (
          <DriverRegistrationView
            operations={operations}
            activeOpId={activeDriverOpId}
            onSelectOperation={(op) => setActiveDriverOpId(op.id)}
            onUpdateOperation={handleUpdateOperation}
          />
        )}

        {currentRole === 'CHECKER' && (
          <CheckerDockView
            operations={operations}
            selectedProject={selectedProject}
            onOpenWhatsAppModal={(op) => setWhatsAppModalOp(op)}
            onOpenEvidenceModal={(op) => setEvidenceModalOp(op)}
            onUpdateOperation={handleUpdateOperation}
          />
        )}

        {currentRole === 'REPORT' && (
          <ReportSummaryView
            operations={operations}
            selectedProject={selectedProject}
            onOpenWhatsAppModal={(op) => setWhatsAppModalOp(op)}
            onOpenEvidenceModal={(op) => setEvidenceModalOp(op)}
          />
        )}
      </main>

      {/* Global Modals */}
      {whatsAppModalOp && (
        <WhatsAppReportModal
          operation={whatsAppModalOp}
          isOpen={Boolean(whatsAppModalOp)}
          onClose={() => setWhatsAppModalOp(null)}
          onOpenGallery={(op) => {
            setWhatsAppModalOp(null);
            setEvidenceModalOp(op);
          }}
        />
      )}

      {evidenceModalOp && (
        <EvidenceGalleryModal
          operation={evidenceModalOp}
          isOpen={Boolean(evidenceModalOp)}
          onClose={() => setEvidenceModalOp(null)}
        />
      )}

      {qrModalOp && (
        <QrShareModal
          operation={qrModalOp}
          isOpen={Boolean(qrModalOp)}
          onClose={() => setQrModalOp(null)}
          onOpenDriverView={(opId) => {
            setQrModalOp(null);
            handleOpenDriverView(opId);
          }}
        />
      )}
    </div>
  );
}
