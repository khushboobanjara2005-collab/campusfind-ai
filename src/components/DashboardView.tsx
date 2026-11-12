import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  PlusCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowRight,
  Tag,
  Building,
} from 'lucide-react';
import { ItemReport, ReportType, MatchWeightConfig } from '../types';
import { findRankedMatches } from '../services/matcher';

interface SpotlightMatch {
  lost: ItemReport;
  candidate: ItemReport;
  score: number;
}

interface DashboardViewProps {
  reports: ItemReport[];
  weights: MatchWeightConfig;
  onNavigateTab: (tab: 'dashboard' | 'directory' | 'matcher') => void;
  onOpenReportModal: (type: ReportType) => void;
  onSelectForMatching: (item: ItemReport) => void;
  onOpenDetails: (item: ItemReport) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  weights,
  onNavigateTab,
  onOpenReportModal,
  onSelectForMatching,
  onOpenDetails,
}) => {
  // Real dynamic calculations from stored dataset
  const stats = useMemo(() => {
    const total = reports.length;
    const lost = reports.filter((r) => r.type === 'LOST' && r.status !== 'RESOLVED_RECOVERED');
    const found = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RESOLVED_RECOVERED');
    const recovered = reports.filter((r) => r.status === 'RESOLVED_RECOVERED');
    const userCreated = reports.filter((r) => !r.isDemoItem);

    const recoveryRate = total > 0 ? Math.round((recovered.length / total) * 100) : 0;

    // Hotspot locations calculation
    const locationCounts: Record<string, number> = {};
    reports.forEach((r) => {
      locationCounts[r.location] = (locationCounts[r.location] || 0) + 1;
    });
    const hotspots = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    // Category distribution
    const categoryCounts: Record<string, number> = {};
    reports.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // High affinity matches calculation
    let highMatchCount = 0;
    let spotlightMatch: SpotlightMatch | null = null;

    lost.forEach((l) => {
      const candidateMatches = findRankedMatches(l, reports, weights);
      if (candidateMatches.length > 0 && candidateMatches[0].finalScore >= 65) {
        highMatchCount++;
        if (!spotlightMatch || candidateMatches[0].finalScore > spotlightMatch.score) {
          spotlightMatch = {
            lost: l,
            candidate: candidateMatches[0].candidateItem,
            score: candidateMatches[0].finalScore,
          };
        }
      }
    });

    return {
      total,
      lostCount: lost.length,
      foundCount: found.length,
      recoveredCount: recovered.length,
      userCreatedCount: userCreated.length,
      recoveryRate,
      hotspots,
      topCategories,
      highMatchCount,
      spotlightMatch: spotlightMatch as SpotlightMatch | null,
    };
  }, [reports, weights]);

  const recentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);
  }, [reports]);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-cyan-500/30 glow-cyan-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Lost & Found Match Automation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Reconnecting Campus Belongings with AI Precision
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Evaluating multi-vector evidence across descriptions, semantic synonyms, campus geography, and temporal proximity to maximize recovery success.
            </p>
          </div>

          {/* Quick CTA cluster */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onOpenReportModal('LOST')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white bg-rose-500/20 border border-rose-500/50 hover:bg-rose-500/30 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-rose-400" />
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => onOpenReportModal('FOUND')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Calculated from Real Data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Logged Reports</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {stats.total}
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              ({stats.userCreatedCount} custom)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Live active & archived items</p>
        </motion.div>

        {/* Active Lost Reports */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Awaiting Recovery</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-300">
              {stats.lostCount}
            </span>
            <span className="text-[11px] text-slate-400">Lost</span>
          </div>
          <p className="text-[11px] text-slate-500">{stats.foundCount} found items in holding</p>
        </motion.div>

        {/* High Match Potential */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2 cursor-pointer hover:border-cyan-500/40 transition-colors"
          onClick={() => onNavigateTab('matcher')}
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High-Affinity Matches</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-300">
              {stats.highMatchCount}
            </span>
            <span className="text-[11px] text-cyan-400">Ready</span>
          </div>
          <p className="text-[11px] text-slate-500">Pairs with score ≥ 65%</p>
        </motion.div>

        {/* Recovery Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Resolved Recoveries</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-300">
              {stats.recoveryRate}%
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              ({stats.recoveredCount} items)
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Verified through safety challenge</p>
        </motion.div>
      </div>

      {/* High Priority Match Spotlight (if available) */}
      {stats.spotlightMatch && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-cyan-500/40 glow-cyan-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Top Algorithmic Match Spotlight
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
              {stats.spotlightMatch.score}% Affinity Score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lost Card */}
            <div className="p-4 rounded-xl bg-navy-950 border border-rose-500/20 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                Reported Lost Item
              </span>
              <h4 className="font-bold text-white text-sm">{stats.spotlightMatch.lost.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {stats.spotlightMatch.lost.description}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{stats.spotlightMatch.lost.location}</span>
                <span>•</span>
                <Calendar className="w-3 h-3 text-rose-400" />
                <span>{stats.spotlightMatch.lost.date}</span>
              </div>
            </div>

            {/* Found Card */}
            <div className="p-4 rounded-xl bg-navy-950 border border-teal-500/20 space-y-2">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                Matching Found Item Candidate
              </span>
              <h4 className="font-bold text-white text-sm">{stats.spotlightMatch.candidate.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                {stats.spotlightMatch.candidate.description}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <MapPin className="w-3 h-3 text-teal-400" />
                <span>{stats.spotlightMatch.candidate.location}</span>
                <span>•</span>
                <Calendar className="w-3 h-3 text-teal-400" />
                <span>{stats.spotlightMatch.candidate.date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-1">
            <button
              onClick={() => {
                if (stats.spotlightMatch) {
                  onSelectForMatching(stats.spotlightMatch.lost);
                  onNavigateTab('matcher');
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 transition-all shadow-sm"
            >
              <span>Inspect Match Breakdown & Verify</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Compact Insights & Analytics Section using Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspots Breakdown */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Campus Lost & Found Hotspots</span>
            </h3>
            <span className="text-[11px] text-slate-500">Based on report volume</span>
          </div>

          <div className="space-y-3 pt-1">
            {stats.hotspots.map(([loc, count]) => {
              const pct = Math.round((count / (stats.total || 1)) * 100);
              return (
                <div key={loc} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{loc}</span>
                    <span className="font-mono text-cyan-300">
                      {count} {count === 1 ? 'item' : 'items'} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-teal-400" />
              <span>Top Item Categories</span>
            </h3>
            <span className="text-[11px] text-slate-500">Frequency distribution</span>
          </div>

          <div className="space-y-3 pt-1">
            {stats.topCategories.map(([cat, count]) => {
              const pct = Math.round((count / (stats.total || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="font-mono text-teal-300">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-navy-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Recent Activity Stream</span>
          </h3>
          <button
            onClick={() => onNavigateTab('directory')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            View all directory records →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentReports.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenDetails(item)}
              className="p-4 rounded-xl bg-navy-950 border border-navy-800/80 hover:border-cyan-500/30 transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase ${
                    item.type === 'LOST'
                      ? 'bg-rose-500/15 text-rose-300'
                      : 'bg-teal-500/15 text-teal-300'
                  }`}
                >
                  {item.type}
                </span>
                <span className="font-mono text-slate-500">{item.date}</span>
              </div>

              <h4 className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors truncate">
                {item.title}
              </h4>

              <p className="text-[11px] text-slate-400 truncate">
                {item.location} • {item.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
