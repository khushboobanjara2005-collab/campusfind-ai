import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { ItemReport } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemReport | null;
  onMatchThisItem: (item: ItemReport) => void;
  onDeleteThisItem: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onMatchThisItem,
  onDeleteThisItem,
}) => {
  if (!isOpen || !item) return null;

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
            <CategoryIcon category={item.category} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    item.type === 'LOST'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-brand-50 text-brand-700 border-brand-200'
                  }`}
                >
                  {item.type} Report
                </span>
                {item.status === 'RESOLVED_RECOVERED' && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Recovered</span>
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5 line-clamp-1">
                {item.title}
              </h2>
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
          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Item Description
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Category</span>
              <p className="font-bold text-slate-800">{item.category}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Colour</span>
              <p className="font-bold text-slate-800">
                {item.primaryColor}
                {item.secondaryColor ? ` (${item.secondaryColor})` : ''}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Campus Area</span>
              <p className="font-bold text-slate-800 flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </p>
              {item.specificLocation && (
                <p className="text-[11px] text-slate-500 truncate">{item.specificLocation}</p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400 uppercase">Date Logged</span>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.date}</span>
              </p>
            </div>
          </div>

          {/* Optional brand & mark details */}
          {(item.brandModel || item.distinctiveFeatures) && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
              {item.brandModel && (
                <div>
                  <span className="text-slate-500">Brand / Model: </span>
                  <span className="font-semibold text-slate-800">{item.brandModel}</span>
                </div>
              )}
              {item.distinctiveFeatures && (
                <div>
                  <span className="text-slate-500">Distinctive Marks: </span>
                  <span className="font-semibold text-brand-700">{item.distinctiveFeatures}</span>
                </div>
              )}
            </div>
          )}

          {/* Reporter contact */}
          {(item.reporterName || item.contactEmail) && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Contact Information
              </span>
              <div className="flex flex-wrap gap-3">
                {item.reporterName && <span>Name: {item.reporterName}</span>}
                {item.contactEmail && <span>Email: {item.contactEmail}</span>}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                if (confirm('Delete this report?')) {
                  onDeleteThisItem(item.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 py-1.5 px-2 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>

              {item.status !== 'RESOLVED_RECOVERED' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onMatchThisItem(item);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find Matches</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
