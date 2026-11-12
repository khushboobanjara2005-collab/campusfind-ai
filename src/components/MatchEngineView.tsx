import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { ItemReport, MatchWeightConfig } from '../types';
import { findRankedMatches } from '../services/matcher';
import { ScoreCounter } from './ScoreCounter';
import { CategoryIcon } from './CategoryIcon';

interface MatchEngineViewProps {
  reports: ItemReport[];
  selectedItem: ItemReport | null;
  onSelectItem: (item: ItemReport) => void;
  weights: MatchWeightConfig;
  onOpenVerification: (target: ItemReport, candidate: ItemReport) => void;
  onOpenDetails: (item: ItemReport) => void;
}

export const MatchEngineView: React.FC<MatchEngineViewProps> = ({
  reports,
  selectedItem,
  onSelectItem,
  weights,
  onOpenVerification,
  onOpenDetails,
}) => {
  const [targetTypeFilter, setTargetTypeFilter] = useState<'LOST' | 'FOUND'>(
    selectedItem?.type || 'LOST'
  );
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Active pool of candidate target items
  const targetPool = useMemo(() => {
    return reports.filter(
      (r) => r.type === targetTypeFilter && r.status !== 'RESOLVED_RECOVERED'
    );
  }, [reports, targetTypeFilter]);

  // Current target item
  const currentTarget = useMemo(() => {
    if (selectedItem && selectedItem.type === targetTypeFilter && selectedItem.status !== 'RESOLVED_RECOVERED') {
      return selectedItem;
    }
    return targetPool.length > 0 ? targetPool[0] : null;
  }, [selectedItem, targetTypeFilter, targetPool]);

  // Ranked match results
  const rankedMatches = useMemo(() => {
    if (!currentTarget) return [];
    const results = findRankedMatches(currentTarget, reports, weights);
    if (minConfidenceFilter > 0) {
      return results.filter((r) => r.finalScore >= minConfidenceFilter);
    }
    return results;
  }, [currentTarget, reports, weights, minConfidenceFilter]);

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Item Matcher
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Compare lost items against turned-in items to identify likely matches.
            </p>
          </div>

          {/* Direction toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => {
                setTargetTypeFilter('LOST');
                const firstLost = reports.find(
                  (r) => r.type === 'LOST' && r.status !== 'RESOLVED_RECOVERED'
                );
                if (firstLost) onSelectItem(firstLost);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                targetTypeFilter === 'LOST'
                  ? 'bg-[#FCE7F3] text-[#9F1239] shadow-xs border-[#FBCFE8]'
                  : 'border-transparent text-slate-600 hover:text-[#172B4D]'
              }`}
            >
              Match a Lost Item
            </button>
            <button
              onClick={() => {
                setTargetTypeFilter('FOUND');
                const firstFound = reports.find(
                  (r) => r.type === 'FOUND' && r.status !== 'RESOLVED_RECOVERED'
                );
                if (firstFound) onSelectItem(firstFound);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                targetTypeFilter === 'FOUND'
                  ? 'bg-[#CCFBF1] text-[#172B4D] shadow-xs border-[#99F6E4]'
                  : 'border-transparent text-slate-600 hover:text-[#172B4D]'
              }`}
            >
              Match a Found Item
            </button>
          </div>
        </div>
      </div>

      {/* Target Item Focus Card */}
      {currentTarget ? (
        <div className="bg-white rounded-2xl border border-brand-200/90 p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200/60">
                Matching For ({currentTarget.type})
              </span>
              <span className="text-xs text-slate-500">
                Select an item to compare against candidate reports:
              </span>
            </div>

            {/* Target Dropdown Selector */}
            <select
              value={currentTarget.id}
              onChange={(e) => {
                const found = reports.find((r) => r.id === e.target.value);
                if (found) onSelectItem(found);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-brand-500"
            >
              {targetPool.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.location})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-start gap-4 pt-1">
            <CategoryIcon category={currentTarget.category} size="lg" />

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{currentTarget.title}</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {currentTarget.primaryColor}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentTarget.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentTarget.location}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentTarget.date}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          No active {targetTypeFilter.toLowerCase()} items available for comparison.
        </div>
      )}

      {/* Ranked Candidate Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Possible Matches</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200/60">
                {rankedMatches.length} Found
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Ranked from strongest match to lowest similarity.
            </p>
          </div>

          {/* Simple Minimum Score Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Show:</span>
            <select
              value={minConfidenceFilter}
              onChange={(e) => setMinConfidenceFilter(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 outline-none"
            >
              <option value={0}>All matches (0%+)</option>
              <option value={30}>Moderate & above (30%+)</option>
              <option value={50}>Possible & above (50%+)</option>
              <option value={75}>Strong only (75%+)</option>
            </select>
          </div>
        </div>

        {/* Candidate List */}
        {rankedMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No matching reports found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No opposite reports meet the current threshold. You can lower the filter or check back as more items are turned in.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankedMatches.map((res, index) => {
              const candidate = res.candidateItem;
              const isExpanded = expandedCardId === candidate.id;

              return (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-card hover:shadow-card-hover ${
                    res.finalScore >= 75
                      ? 'border-brand-300 ring-1 ring-brand-100'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top Candidate Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Rank Number */}
                      <span className="w-7 h-7 rounded-xl bg-slate-100 font-bold text-xs text-slate-600 flex items-center justify-center shrink-0 mt-0.5">
                        #{index + 1}
                      </span>

                      <CategoryIcon category={candidate.category} size="md" />

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              candidate.type === 'LOST'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                : 'bg-brand-50 text-brand-700 border border-brand-200/60'
                            }`}
                          >
                            {candidate.type}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500 font-medium">
                            {candidate.location}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            {candidate.date}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {candidate.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {candidate.description}
                        </p>

                        {/* Top reasoning preview */}
                        {res.reasons.length > 0 && (
                          <p className="text-xs text-brand-700 font-medium pt-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                            <span>{res.reasons[0]}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Animated Score Gauge */}
                    <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <ScoreCounter
                        score={res.finalScore}
                        size="md"
                        confidenceTier={res.confidenceTier}
                      />
                    </div>
                  </div>

                  {/* Actions & Expandable Trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => toggleExpand(candidate.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start"
                    >
                      <span>Why this matches</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => onOpenDetails(candidate)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        Details
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => currentTarget && onOpenVerification(currentTarget, candidate)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Ownership</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Expandable Breakdown Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pt-4 mt-3 border-t border-slate-100/90 space-y-4"
                      >
                        {/* 5-Factor Score Bars */}
                        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                            Similarity Breakdown
                          </span>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                            {/* Description */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600">
                                <span>Description</span>
                                <span className="font-semibold text-brand-600">{res.componentScores.descriptionScore}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${res.componentScores.descriptionScore}%` }}
                                />
                              </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600">
                                <span>Category</span>
                                <span className="font-semibold text-brand-600">{res.componentScores.categoryScore}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${res.componentScores.categoryScore}%` }}
                                />
                              </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600">
                                <span>Location</span>
                                <span className="font-semibold text-brand-600">{res.componentScores.locationScore}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${res.componentScores.locationScore}%` }}
                                />
                              </div>
                            </div>

                            {/* Colour */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600">
                                <span>Colour</span>
                                <span className="font-semibold text-brand-600">{res.componentScores.colourScore}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${res.componentScores.colourScore}%` }}
                                />
                              </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] text-slate-600">
                                <span>Date</span>
                                <span className="font-semibold text-brand-600">{res.componentScores.dateScore}%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-brand-500 rounded-full"
                                  style={{ width: `${res.componentScores.dateScore}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Positive reasons & Contradictions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Reasons */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Matching Points</span>
                            </span>
                            <ul className="space-y-1 text-slate-600 text-[11px]">
                              {res.reasons.map((r, ri) => (
                                <li key={ri} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 mt-0.5">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Contradictions & Warnings */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              <span>Notes & Differences</span>
                            </span>
                            <ul className="space-y-1 text-slate-600 text-[11px]">
                              {res.contradictions.map((c, ci) => (
                                <li key={`c-${ci}`} className="flex items-start gap-1.5 text-rose-700">
                                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                              {res.warnings.map((w, wi) => (
                                <li key={`w-${wi}`} className="flex items-start gap-1.5 text-amber-700">
                                  <span className="text-amber-500 font-bold shrink-0">!</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                              {res.contradictions.length === 0 && res.warnings.length === 0 && (
                                <li className="text-slate-500">No discrepancies detected between records.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
