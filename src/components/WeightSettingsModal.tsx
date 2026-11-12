import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Sliders,
  RotateCcw,
  Check,
  Database,
} from 'lucide-react';
import { MatchWeightConfig } from '../types';
import { DEFAULT_MATCH_WEIGHTS } from '../services/matcher';

interface WeightSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: MatchWeightConfig;
  onSaveWeights: (newWeights: MatchWeightConfig) => void;
  onResetDemoSafely: () => void;
  onFactoryResetAll: () => void;
}

export const WeightSettingsModal: React.FC<WeightSettingsModalProps> = ({
  isOpen,
  onClose,
  weights,
  onSaveWeights,
  onResetDemoSafely,
  onFactoryResetAll,
}) => {
  const [desc, setDesc] = useState(Math.round(weights.description * 100));
  const [cat, setCat] = useState(Math.round(weights.category * 100));
  const [loc, setLoc] = useState(Math.round(weights.location * 100));
  const [col, setCol] = useState(Math.round(weights.colour * 100));
  const [date, setDate] = useState(Math.round(weights.date * 100));

  if (!isOpen) return null;

  const handleApply = () => {
    onSaveWeights({
      description: desc / 100,
      category: cat / 100,
      location: loc / 100,
      colour: col / 100,
      date: date / 100,
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setDesc(Math.round(DEFAULT_MATCH_WEIGHTS.description * 100));
    setCat(Math.round(DEFAULT_MATCH_WEIGHTS.category * 100));
    setLoc(Math.round(DEFAULT_MATCH_WEIGHTS.location * 100));
    setCol(Math.round(DEFAULT_MATCH_WEIGHTS.colour * 100));
    setDate(Math.round(DEFAULT_MATCH_WEIGHTS.date * 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-modal overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200/80 text-brand-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Algorithm & Data Settings
              </h2>
              <p className="text-xs text-slate-500">
                Calibrate feature weights or safely reset sample demo items.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Sliders */}
          <div className="space-y-3.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Match Formula Weights
            </span>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Description Similarity</span>
                <span className="font-bold text-brand-600">{desc}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={desc}
                onChange={(e) => setDesc(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Category Compatibility</span>
                <span className="font-bold text-brand-600">{cat}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cat}
                onChange={(e) => setCat(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Location Proximity</span>
                <span className="font-bold text-brand-600">{loc}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={loc}
                onChange={(e) => setLoc(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Colour */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Colour Match</span>
                <span className="font-bold text-brand-600">{col}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={col}
                onChange={(e) => setCol(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>Date Proximity</span>
                <span className="font-bold text-brand-600">{date}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={date}
                onChange={(e) => setDate(Number(e.target.value))}
                className="w-full accent-brand-500 bg-slate-200 rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Demo Data Reset Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Database className="w-4 h-4 text-brand-500" />
              <span>Demo Records Management</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Safe demo reset restores the original sample items without erasing items you submitted. Data is saved in browser localStorage.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onResetDemoSafely();
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Demo Records</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Factory reset will restore all default data and formula weights. Continue?')) {
                    onFactoryResetAll();
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Factory Reset
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Weights</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
