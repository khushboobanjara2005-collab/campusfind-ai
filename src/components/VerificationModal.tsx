import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { ItemReport } from '../types';
import { normalizeText } from '../services/matcher';
import { markAsRecovered } from '../services/storage';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: ItemReport | null;
  candidateItem: ItemReport | null;
  onVerificationComplete: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  candidateItem,
  onVerificationComplete,
}) => {
  const [claimantAnswer, setClaimantAnswer] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [verifiedState, setVerifiedState] = useState<'IDLE' | 'MATCH' | 'MISMATCH'>('IDLE');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !targetItem || !candidateItem) return null;

  const challengeItem = targetItem.privateVerificationQuestion
    ? targetItem
    : candidateItem.privateVerificationQuestion
    ? candidateItem
    : null;

  const challengeQuestion = challengeItem?.privateVerificationQuestion;
  const challengeAnswer = challengeItem?.privateVerificationAnswer;

  const handleTestAnswer = () => {
    if (!challengeAnswer) return;
    const normUser = normalizeText(claimantAnswer);
    const normTarget = normalizeText(challengeAnswer);

    if (normUser && (normUser.includes(normTarget) || normTarget.includes(normUser))) {
      setVerifiedState('MATCH');
    } else {
      setVerifiedState('MISMATCH');
    }
  };

  const handleConfirmRecovery = () => {
    const res = markAsRecovered(targetItem.id, candidateItem.id);
    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onVerificationComplete();
        onClose();
        setIsSuccess(false);
        setClaimantAnswer('');
        setStaffNotes('');
        setVerifiedState('IDLE');
      }, 1400);
    }
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Confirm Item Recovery
              </h2>
              <p className="text-xs text-slate-500">
                Verify identity and mark the item as successfully recovered.
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

        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Item Successfully Returned!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Both reports have been updated to recovered status and safely archived.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Friendly Privacy Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Verification Reminder</span>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                A match indicates a strong likelihood, not legal proof of ownership. Please confirm identifying features before handing over personal property.
              </p>
            </div>

            {/* Comparison Overview */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="space-y-1 pr-2 border-r border-slate-200">
                <span className="text-[10px] font-bold text-rose-600 uppercase">
                  {targetItem.type} Report
                </span>
                <p className="font-bold text-slate-900 truncate">{targetItem.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{targetItem.location}</p>
              </div>

              <div className="space-y-1 pl-2">
                <span className="text-[10px] font-bold text-brand-600 uppercase">
                  {candidateItem.type} Report
                </span>
                <p className="font-bold text-slate-900 truncate">{candidateItem.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{candidateItem.location}</p>
              </div>
            </div>

            {/* Secret Verification Challenge */}
            {challengeQuestion ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                  <Lock className="w-3.5 h-3.5 text-brand-600" />
                  <span>Confidential Ownership Challenge</span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Secret Question from Report:</p>
                  <p className="text-xs font-semibold text-slate-800 italic bg-white p-2 rounded-lg border border-slate-200">
                    "{challengeQuestion}"
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Enter Claimant's Answer:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Yosemite sticker"
                      value={claimantAnswer}
                      onChange={(e) => {
                        setClaimantAnswer(e.target.value);
                        setVerifiedState('IDLE');
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleTestAnswer}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 transition-colors"
                    >
                      Check
                    </button>
                  </div>
                </div>

                {verifiedState === 'MATCH' && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Verified! The answer matches the confidential record.</span>
                  </div>
                )}

                {verifiedState === 'MISMATCH' && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Answer does not match. Please verify student ID or other unique marks.</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                No automatic challenge question was set. Campus staff should verify student ID in person.
              </p>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Handover Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Picked up at Main Library front desk by student on 12 Oct."
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-brand-500"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
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
                onClick={handleConfirmRecovery}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Recovered</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
