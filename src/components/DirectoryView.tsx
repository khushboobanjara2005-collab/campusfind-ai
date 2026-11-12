import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowUpDown,
  Plus,
  Eye,
  X,
  ChevronDown,
} from 'lucide-react';
import { ItemReport, ReportType } from '../types';
import { CATEGORIES, COLORS } from '../services/constants';
import { CAMPUS_LOCATION_OPTIONS } from '../services/campusLocations';
import { CategoryIcon } from './CategoryIcon';

interface DirectoryViewProps {
  reports: ItemReport[];
  initialSearchQuery?: string;
  onSelectForMatching: (item: ItemReport) => void;
  onOpenDetails: (item: ItemReport) => void;
  onOpenReportModal: (type: ReportType) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  reports,
  initialSearchQuery = '',
  onSelectForMatching,
  onOpenDetails,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOST' | 'FOUND' | 'RECOVERED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [colorFilter, setColorFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'title_asc'>('date_desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sync if initialSearchQuery changes from home search
  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Deterministic filtering & sorting
  const filteredReports = useMemo(() => {
    return reports
      .filter((item) => {
        if (typeFilter === 'LOST' && item.type !== 'LOST') return false;
        if (typeFilter === 'FOUND' && item.type !== 'FOUND') return false;
        if (typeFilter === 'RECOVERED' && item.status !== 'RESOLVED_RECOVERED') return false;

        if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
        if (locationFilter !== 'ALL' && item.location !== locationFilter) return false;
        if (colorFilter !== 'ALL' && item.primaryColor !== colorFilter) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchBrand = (item.brandModel || '').toLowerCase().includes(q);
          const matchFeatures = (item.distinctiveFeatures || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchBrand && !matchFeatures) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [reports, searchQuery, typeFilter, categoryFilter, locationFilter, colorFilter, sortBy]);

  const activeAdvancedCount =
    (categoryFilter !== 'ALL' ? 1 : 0) +
    (locationFilter !== 'ALL' ? 1 : 0) +
    (colorFilter !== 'ALL' ? 1 : 0) +
    (sortBy !== 'date_desc' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setLocationFilter('ALL');
    setColorFilter('ALL');
    setSortBy('date_desc');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Campus Items
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search lost property reports and items currently held at campus locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenReportModal('LOST')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Lost</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenReportModal('FOUND')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Found</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Compact Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        {/* Top search line + primary category pills */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items by name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick status filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 shrink-0">
            {(['ALL', 'LOST', 'FOUND', 'RECOVERED'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  typeFilter === t
                    ? t === 'LOST'
                      ? 'bg-rose-50 text-[#9F1239] shadow-xs border-[#FBCFE8]'
                      : t === 'FOUND'
                      ? 'bg-[#CCFBF1] text-[#172B4D] shadow-xs border-[#99F6E4]'
                      : t === 'RECOVERED'
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200/60'
                      : 'bg-white text-[#172B4D] shadow-xs border-[#E2E8F0]'
                    : 'border-transparent text-slate-600 hover:text-[#172B4D]'
                }`}
              >
                {t === 'ALL' ? 'All' : t === 'LOST' ? 'Lost' : t === 'FOUND' ? 'Found' : 'Recovered'}
              </button>
            ))}
          </div>

          {/* Advanced filter toggle button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showAdvancedFilters || activeAdvancedCount > 0
                ? 'bg-brand-50 border-brand-200 text-brand-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeAdvancedCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeAdvancedCount}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showAdvancedFilters ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Expandable Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-3 border-t border-slate-100 overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500"
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.label} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Campus Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500"
                  >
                    <option value="ALL">All Locations</option>
                    {CAMPUS_LOCATION_OPTIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Colour Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Primary Colour
                  </label>
                  <select
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 outline-none focus:border-brand-500"
                  >
                    <option value="ALL">All Colours</option>
                    {COLORS.map((col) => (
                      <option key={col.label} value={col.label}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Option */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Sort By
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-xs text-slate-700 outline-none w-full cursor-pointer"
                    >
                      <option value="date_desc">Date: Newest First</option>
                      <option value="date_asc">Date: Oldest First</option>
                      <option value="title_asc">Title: A to Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Summary & Quick Reset */}
        {(searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'ALL' || locationFilter !== 'ALL' || colorFilter !== 'ALL') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing {filteredReports.length} of {reports.length} total items
            </span>
            <button
              onClick={resetFilters}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Item Cards Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No items found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any reports matching your search criteria. Try clearing filters or checking another category.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredReports.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.25) }}
                whileHover={{ y: -3 }}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-card hover:shadow-card-hover flex flex-col justify-between group ${
                  item.status === 'RESOLVED_RECOVERED'
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Top Status & Category Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <CategoryIcon category={item.category} size="md" />

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                          item.status === 'RESOLVED_RECOVERED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.type === 'LOST'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-brand-50 text-brand-700 border-brand-200'
                        }`}
                      >
                        {item.status === 'RESOLVED_RECOVERED' ? 'Recovered' : item.type}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 mb-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[140px]">{item.location}</span>
                    </span>

                    <span>•</span>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Additional attributes chip */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {item.primaryColor}
                    </span>
                    {item.brandModel && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium truncate max-w-[150px]">
                        {item.brandModel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenDetails(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-50"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Details</span>
                  </button>

                  {item.status !== 'RESOLVED_RECOVERED' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectForMatching(item)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200/80 hover:bg-brand-100 transition-all shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                      <span>
                        Match {item.type === 'LOST' ? 'Found' : 'Lost'}
                      </span>
                    </motion.button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Item Returned
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
