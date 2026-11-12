import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Plus,
  HelpCircle,
  Sliders,
  Menu,
  X,
  Compass,
} from 'lucide-react';
import { ReportType } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'browse' | 'matcher';
  setActiveTab: (tab: 'home' | 'browse' | 'matcher') => void;
  onOpenReportModal: (initialType: ReportType) => void;
  onOpenSettingsModal: () => void;
  onScrollToHowItWorks: () => void;
  itemCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenSettingsModal,
  onScrollToHowItWorks,
  itemCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'browse' | 'matcher') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const navButtonClasses = (isActive: boolean) =>
    `group relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 ${
      isActive
        ? 'bg-[#CCFBF1] text-[#172B4D] shadow-sm ring-1 ring-[#99F6E4]'
        : 'text-[#172B4D] hover:bg-[#EDF3FF] hover:text-[#172B4D]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-[0_18px_40px_-26px_rgba(37,99,235,0.22)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div
            onClick={() => handleNavClick('home')}
            className="group flex cursor-pointer items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-4"
            role="button"
            tabIndex={0}
            aria-label="CampusFind AI home"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleNavClick('home');
              }
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-brand-500 to-teal-500 text-white shadow-[0_12px_24px_-14px_rgba(65,105,225,0.75)] transition-transform duration-200 group-hover:scale-105 group-hover:rotate-6">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">CampusFind</span>
              <span className="rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">
                AI
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => handleNavClick('home')}
              className={navButtonClasses(activeTab === 'home')}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('browse')}
              className={navButtonClasses(activeTab === 'browse')}
            >
              <Search className={`h-4 w-4 ${activeTab === 'browse' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>Browse Items</span>
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                {itemCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('matcher')}
              className={navButtonClasses(activeTab === 'matcher')}
            >
              <Sparkles className={`h-4 w-4 ${activeTab === 'matcher' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>Smart Matches</span>
            </button>

            <button
              onClick={onScrollToHowItWorks}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2"
            >
              <HelpCircle className="h-4 w-4 text-slate-400" />
              <span>How It Works</span>
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenReportModal('LOST')}
                className="rounded-xl border border-[#FBCFE8] bg-[#FCE7F3] px-3.5 py-2 text-xs font-bold text-[#9F1239] shadow-[0_12px_20px_-16px_rgba(244,63,94,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FBE1E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9A8D4] focus-visible:ring-offset-2"
              >
                Report Lost
              </motion.button>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenReportModal('FOUND')}
                className="flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-4 py-2 text-xs font-bold text-white shadow-[0_16px_30px_-18px_rgba(13,148,136,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99F6E4] focus-visible:ring-offset-2"
              >
                <Plus className="h-3.5 w-3.5 text-white" />
                <span>Report Found</span>
              </motion.button>
            </div>

            <button
              onClick={onOpenSettingsModal}
              title="Calibration & Demo Reset"
              className="rounded-lg p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2"
            >
              <Sliders className="h-4 w-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white/95 px-4 pb-5 pt-3 shadow-lg md:hidden"
          >
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className={`rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                  activeTab === 'home' ? 'bg-brand-50 text-brand-700' : 'text-slate-700'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('browse')}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                  activeTab === 'browse' ? 'bg-brand-50 text-brand-700' : 'text-slate-700'
                }`}
              >
                <span>Browse Items</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {itemCount}
                </span>
              </button>
              <button
                onClick={() => handleNavClick('matcher')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                  activeTab === 'matcher' ? 'bg-brand-50 text-brand-700' : 'text-slate-700'
                }`}
              >
                <Sparkles className="h-4 w-4 text-brand-500" />
                <span>Smart Matches</span>
              </button>
              <button
                onClick={() => {
                  onScrollToHowItWorks();
                  setMobileMenuOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700"
              >
                How It Works
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2">
              <button
                onClick={() => {
                  onOpenReportModal('LOST');
                  setMobileMenuOpen(false);
                }}
                className="rounded-xl border border-[#FBCFE8] bg-[#FCE7F3] px-3 py-2.5 text-center text-xs font-bold text-[#9F1239]"
              >
                Report Lost
              </button>
              <button
                onClick={() => {
                  onOpenReportModal('FOUND');
                  setMobileMenuOpen(false);
                }}
                className="rounded-xl bg-[#0D9488] px-3 py-2.5 text-center text-xs font-bold text-white shadow-[0_12px_22px_-16px_rgba(13,148,136,0.7)]"
              >
                Report Found
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
