import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  AlertCircle,
  Tag,
  Sparkles,
  ChevronDown,
  Lock,
} from 'lucide-react';
import { ItemCategory, ItemColor, ItemReport, ReportType } from '../types';
import { CATEGORIES, COLORS } from '../services/constants';
import { CAMPUS_LOCATION_OPTIONS } from '../services/campusLocations';
import { correctDescriptionGrammar } from '../services/grammarCorrection';
import { addReport } from '../services/storage';

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ReportType;
  onReportCreated: (newReport: ItemReport) => void;
}

export const ReportFormModal: React.FC<ReportFormModalProps> = ({
  isOpen,
  onClose,
  initialType = 'LOST',
  onReportCreated,
}) => {
  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Bottles & Tumblers');
  const [primaryColor, setPrimaryColor] = useState<ItemColor>('Black');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATION_OPTIONS[0]);
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState('2026-10-12');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [description, setDescription] = useState('');
  const [brandModel, setBrandModel] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [privateQuestion, setPrivateQuestion] = useState('');
  const [privateAnswer, setPrivateAnswer] = useState('');

  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grammarStatus, setGrammarStatus] = useState<
    'idle' | 'waiting' | 'checking' | 'corrected' | 'unchanged' | 'error'
  >('idle');
  const [grammarError, setGrammarError] = useState('');
  const [grammarRetry, setGrammarRetry] = useState(0);
  const descriptionRef = useRef(description);
  const lastCheckedDescriptionRef = useRef('');

  React.useEffect(() => {
    setReportType(initialType);
  }, [initialType, isOpen]);

  React.useEffect(() => {
    const text = description;
    if (
      !isOpen ||
      text.trim().length < 8 ||
      text === lastCheckedDescriptionRef.current
    ) {
      return;
    }

    const abortController = new AbortController();
    const timeout = window.setTimeout(async () => {
      if (descriptionRef.current !== text) return;
      setGrammarStatus('checking');

      try {
        const correctedText = await correctDescriptionGrammar(text, abortController.signal);
        if (descriptionRef.current !== text) return;

        lastCheckedDescriptionRef.current = correctedText;
        descriptionRef.current = correctedText;
        if (correctedText !== text) {
          setDescription(correctedText);
        }
        setGrammarStatus(correctedText === text ? 'unchanged' : 'corrected');
        setGrammarError('');
      } catch (error) {
        if (abortController.signal.aborted || descriptionRef.current !== text) return;
        setGrammarStatus('error');
        setGrammarError(
          error instanceof Error ? error.message : 'Grammar correction failed. Please try again.',
        );
      }
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
      abortController.abort();
    };
  }, [description, grammarRetry, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Please enter an item name';
    if (!category) errs.category = 'Please choose a category';
    if (!primaryColor) errs.primaryColor = 'Please choose a primary colour';
    if (!location.trim() || !CAMPUS_LOCATION_OPTIONS.includes(location)) {
      errs.location = 'Please choose a valid campus location';
    }
    if (!date.trim()) errs.date = 'Please select a date';
    if (!description.trim() || description.trim().length < 8) {
      errs.description = 'Please write a short description (at least 8 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const created = addReport({
        type: reportType,
        title: title.trim(),
        category,
        primaryColor,
        secondaryColor: secondaryColor.trim() || undefined,
        location,
        specificLocation: specificLocation.trim() || undefined,
        date,
        timeEstimate: timeEstimate.trim() || undefined,
        description: description.trim(),
        brandModel: brandModel.trim() || undefined,
        distinctiveFeatures: distinctiveFeatures.trim() || undefined,
        reporterName: reporterName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        privateVerificationQuestion: privateQuestion.trim() || undefined,
        privateVerificationAnswer: privateAnswer.trim() || undefined,
      });

      onReportCreated(created);
      onClose();

      // Reset state
      setTitle('');
      descriptionRef.current = '';
      lastCheckedDescriptionRef.current = '';
      setDescription('');
      setGrammarStatus('idle');
      setGrammarError('');
      setBrandModel('');
      setDistinctiveFeatures('');
      setLocation(CAMPUS_LOCATION_OPTIONS[0]);
      setSpecificLocation('');
      setPrivateQuestion('');
      setPrivateAnswer('');
      setShowOptionalDetails(false);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ form: 'Unable to save report. Please check your entries.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-modal overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                reportType === 'LOST'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                  : 'bg-brand-50 text-brand-600 border border-brand-200/60'
              }`}
            >
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {reportType === 'LOST' ? 'Report a Lost Item' : 'Report a Found Item'}
              </h2>
              <p className="text-xs text-slate-500">
                Quick 1-minute form to help match and return property.
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errors.form && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Toggle Type: Lost vs Found */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              I am reporting
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setReportType('LOST')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  reportType === 'LOST'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                An Item I Lost (Owner)
              </button>
              <button
                type="button"
                onClick={() => setReportType('FOUND')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  reportType === 'FOUND'
                    ? 'bg-white text-brand-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                An Item I Found (Finder)
              </button>
            </div>
          </div>

          {/* REQUIRED FIELDS SECTION */}
          <div className="space-y-4">
            {/* 1. Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Name / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Matte Black Hydro Flask 32oz, Blue Backpack"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
              />
              {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
            </div>

            {/* 2. Category & Colour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.label} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-rose-600">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Colour <span className="text-rose-500">*</span>
                </label>
                <select
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value as ItemColor)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
                >
                  {COLORS.map((col) => (
                    <option key={col.label} value={col.label}>
                      {col.label}
                    </option>
                  ))}
                </select>
                {errors.primaryColor && <p className="mt-1 text-xs text-rose-600">{errors.primaryColor}</p>}
              </div>
            </div>

            {/* 3. Campus Location & Date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Campus location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((prev) => ({ ...prev, location: '' }));
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                >
                  {CAMPUS_LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
                {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
              </div>
            </div>

            {/* 4. Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length} chars
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Describe size, material, stickers, wear and tear, or contents..."
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  descriptionRef.current = value;
                  setDescription(value);
                  setGrammarStatus(value.trim().length >= 8 ? 'waiting' : 'idle');
                  setGrammarError('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm outline-none focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all leading-relaxed"
              />
              {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
              <div className="mt-1 flex items-start justify-between gap-2">
                <p className="text-[11px] text-slate-500">
                  Description text is sent to OpenRouter for grammar correction. Avoid private details.
                </p>
                <p aria-live="polite" className="shrink-0 text-[11px]">
                  {grammarStatus === 'waiting' && <span className="text-slate-500">Correction pending…</span>}
                  {grammarStatus === 'checking' && <span className="text-brand-600">Checking grammar…</span>}
                  {grammarStatus === 'corrected' && <span className="text-emerald-700">Grammar corrected</span>}
                  {grammarStatus === 'unchanged' && <span className="text-slate-500">Grammar checked</span>}
                  {grammarStatus === 'error' && (
                    <span className="text-rose-600">
                      {grammarError}{' '}
                      <button
                        type="button"
                        className="font-semibold underline"
                        onClick={() => setGrammarRetry((attempt) => attempt + 1)}
                      >
                        Retry
                      </button>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* EXPANDABLE OPTIONAL DETAILS DISCLOSURE */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            <button
              type="button"
              onClick={() => setShowOptionalDetails(!showOptionalDetails)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>Additional Details (Optional)</span>
                <span className="text-[11px] font-normal text-slate-400">
                  — room, brand, stickers & verification
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  showOptionalDetails ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showOptionalDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4 space-y-4 border-t border-slate-200/60 pt-3"
                >
                  {/* Brand & Specific Room */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Brand / Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hydro Flask, Apple, Fossil"
                        value={brandModel}
                        onChange={(e) => setBrandModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        More specific location (optional)
                      </label>
                      <input
                        type="text"
                        placeholder={location === 'Other Campus Area' ? 'Describe the exact area or landmark' : 'e.g. Second floor, near Room 204'}
                        value={specificLocation}
                        onChange={(e) => setSpecificLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Distinctive Features */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Distinctive Features / Stickers
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Yosemite decal sticker, dent on bottom rim"
                      value={distinctiveFeatures}
                      onChange={(e) => setDistinctiveFeatures(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Private Verification Challenge */}
                  <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/70 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-brand-800 font-semibold text-xs">
                      <Lock className="w-3.5 h-3.5 text-brand-600" />
                      <span>Confidential Ownership Challenge</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Set a secret question only the true owner would know. The answer is kept private and never shown on public listings.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Question: What sticker is on it?"
                        value={privateQuestion}
                        onChange={(e) => setPrivateQuestion(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand-500"
                      />
                      <input
                        type="text"
                        placeholder="Secret Answer: Yosemite"
                        value={privateAnswer}
                        onChange={(e) => setPrivateAnswer(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Secondary Colour & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Secondary Colour / Trim
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Silver rim, black handle"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Approximate Time
                      </label>
                      <input
                        type="time"
                        value={timeEstimate}
                        onChange={(e) => setTimeEstimate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                    />
                    <input
                      type="email"
                      placeholder="Campus Email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (Optional)"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl border border-[#0F766E] bg-[#0D9488] px-6 py-2.5 text-xs font-bold text-white shadow-[0_8px_18px_-10px_rgba(13,148,136,0.7)] transition-all hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99F6E4] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#CBD5E1] disabled:bg-[#E2E8F0] disabled:text-slate-500 disabled:shadow-none"
            >
              <span>Submit Report</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
