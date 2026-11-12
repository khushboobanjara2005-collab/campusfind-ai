import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DirectoryView } from './components/DirectoryView';
import { MatchEngineView } from './components/MatchEngineView';
import { ReportFormModal } from './components/ReportFormModal';
import { VerificationModal } from './components/VerificationModal';
import { WeightSettingsModal } from './components/WeightSettingsModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import {
  ItemReport,
  ReportType,
  MatchWeightConfig,
} from './types';
import {
  getStoredReports,
  getStoredWeights,
  saveStoredWeights,
  resetDemoDataSafely,
  factoryResetAll,
  deleteReport,
} from './services/storage';
import { CheckCircle2, Compass } from 'lucide-react';

export const App: React.FC = () => {
  const [reports, setReports] = useState<ItemReport[]>([]);
  const [weights, setWeights] = useState<MatchWeightConfig>(getStoredWeights());
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'matcher'>('home');
  const [browseSearchQuery, setBrowseSearchQuery] = useState('');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<ReportType>('LOST');

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [selectedMatchItem, setSelectedMatchItem] = useState<ItemReport | null>(null);

  const [verificationPair, setVerificationPair] = useState<{
    target: ItemReport | null;
    candidate: ItemReport | null;
  }>({ target: null, candidate: null });
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);

  const [inspectedItem, setInspectedItem] = useState<ItemReport | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initial load from storage
  useEffect(() => {
    const loaded = getStoredReports();
    setReports(loaded);
    setWeights(getStoredWeights());
  }, []);

  const refreshReports = () => {
    const current = getStoredReports();
    setReports(current);
  };

  // Safe Demo Reset
  const handleSafeDemoReset = () => {
    const res = resetDemoDataSafely();
    refreshReports();
    showToast(
      `Demo data reset: ${res.demoRestoredCount} sample items restored. ${res.userItemsPreservedCount} custom items preserved.`
    );
  };

  const handleFactoryReset = () => {
    factoryResetAll();
    refreshReports();
    setWeights(getStoredWeights());
    showToast('Factory reset complete: restored default sample records and weights.');
  };

  const handleWeightsSaved = (newWeights: MatchWeightConfig) => {
    saveStoredWeights(newWeights);
    setWeights(newWeights);
    showToast('Matching formula weights updated successfully.');
  };

  const handleOpenReportModal = (type: ReportType) => {
    setReportModalType(type);
    setIsReportModalOpen(true);
  };

  const handleSelectForMatching = (item: ItemReport) => {
    setSelectedMatchItem(item);
    setActiveTab('matcher');
  };

  const handleOpenDetails = (item: ItemReport) => {
    setInspectedItem(item);
    setIsDetailOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    deleteReport(id);
    refreshReports();
    showToast('Report deleted successfully.');
  };

  const handleOpenVerification = (target: ItemReport, candidate: ItemReport) => {
    setVerificationPair({ target, candidate });
    setIsVerificationOpen(true);
  };

  const handleHomeSearchSubmit = (query: string) => {
    setBrowseSearchQuery(query);
    setActiveTab('browse');
  };

  const handleScrollToHowItWorks = () => {
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-brand-100 selection:text-brand-800">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={handleOpenReportModal}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onScrollToHowItWorks={handleScrollToHowItWorks}
        itemCount={reports.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HomeView
                reports={reports}
                onSearchSubmit={handleHomeSearchSubmit}
                onNavigateToBrowse={() => {
                  setBrowseSearchQuery('');
                  setActiveTab('browse');
                }}
                onOpenReportModal={handleOpenReportModal}
                onOpenDetails={handleOpenDetails}
                onSelectForMatching={handleSelectForMatching}
              />
            </motion.div>
          )}

          {activeTab === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DirectoryView
                reports={reports}
                initialSearchQuery={browseSearchQuery}
                onSelectForMatching={handleSelectForMatching}
                onOpenDetails={handleOpenDetails}
                onOpenReportModal={handleOpenReportModal}
              />
            </motion.div>
          )}

          {activeTab === 'matcher' && (
            <motion.div
              key="matcher"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MatchEngineView
                reports={reports}
                selectedItem={selectedMatchItem}
                onSelectItem={setSelectedMatchItem}
                weights={weights}
                onOpenVerification={handleOpenVerification}
                onOpenDetails={handleOpenDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Light Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">CampusFind AI</span>
            <span>— College Lost & Found Made Simple</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-slate-800 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className="hover:text-slate-800 transition-colors"
            >
              Browse Directory
            </button>
            <button
              onClick={handleScrollToHowItWorks}
              className="hover:text-slate-800 transition-colors"
            >
              How It Works
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              Formula & Demo Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialType={reportModalType}
        onReportCreated={(newRep) => {
          refreshReports();
          showToast(`Report for "${newRep.title}" created successfully!`);
        }}
      />

      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        targetItem={verificationPair.target}
        candidateItem={verificationPair.candidate}
        onVerificationComplete={() => {
          refreshReports();
          showToast('Ownership verified! Both items marked as resolved.');
        }}
      />

      <WeightSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        weights={weights}
        onSaveWeights={handleWeightsSaved}
        onResetDemoSafely={handleSafeDemoReset}
        onFactoryResetAll={handleFactoryReset}
      />

      <ItemDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={inspectedItem}
        onMatchThisItem={handleSelectForMatching}
        onDeleteThisItem={handleDeleteItem}
      />

      {/* Elegant Slide-In Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-lg max-w-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
