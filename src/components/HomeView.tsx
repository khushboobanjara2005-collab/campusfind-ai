import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  PlusCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Backpack,
  Headphones,
  KeyRound,
  BookOpen,
  Droplets,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import { ItemReport, ReportType } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface HomeViewProps {
  reports: ItemReport[];
  onSearchSubmit: (query: string) => void;
  onNavigateToBrowse: () => void;
  onOpenReportModal: (type: ReportType) => void;
  onOpenDetails: (item: ItemReport) => void;
  onSelectForMatching: (item: ItemReport) => void;
}

interface IllustrationItemProps {
  icon: React.ReactNode;
  bg: string;
  border: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: number;
  rotate?: number;
}

const FloatingItem: React.FC<IllustrationItemProps> = ({
  icon,
  bg,
  border,
  top,
  bottom,
  left,
  right,
  delay,
  rotate = 0,
}) => (
  <motion.div
    className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl border-2 shadow-[0_14px_28px_-18px_rgba(15,23,42,0.28)] ${bg} ${border}`}
    style={{ top, bottom, left, right, rotate: `${rotate}deg` }}
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3.2 + delay * 0.45, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    {icon}
  </motion.div>
);

export const HomeView: React.FC<HomeViewProps> = ({
  reports,
  onSearchSubmit,
  onNavigateToBrowse,
  onOpenReportModal,
  onOpenDetails,
  onSelectForMatching,
}) => {
  const [heroSearch, setHeroSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onSearchSubmit(heroSearch.trim());
    } else {
      onNavigateToBrowse();
    }
  };

  const recentlyFoundItems = reports
    .filter((r) => r.type === 'FOUND' && r.status !== 'RESOLVED_RECOVERED')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const displayFound =
    recentlyFoundItems.length > 0
      ? recentlyFoundItems
      : reports.filter((r) => r.type === 'FOUND').slice(0, 4);

  const lostCount = reports.filter((r) => r.type === 'LOST' && r.status !== 'RESOLVED_RECOVERED').length;
  const foundCount = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RESOLVED_RECOVERED').length;
  const recoveredCount = reports.filter((r) => r.status === 'RESOLVED_RECOVERED').length;

  const statItems = [
    { label: 'Lost', value: lostCount, tone: 'coral', text: 'text-coral-600', bg: 'bg-coral-50', border: 'border-coral-100' },
    { label: 'Found', value: foundCount, tone: 'teal', text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    { label: 'Recovered', value: recoveredCount, tone: 'brand', text: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-100' },
  ];

  const categoryStyles: Record<string, { accent: string; badge: string }> = {
    'Bottles & Tumblers': { accent: 'from-cyan-400 to-sky-500', badge: 'border-cyan-200 bg-cyan-50 text-cyan-700' },
    'Electronics & Gadgets': { accent: 'from-indigo-400 to-blue-500', badge: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
    'Bags & Backpacks': { accent: 'from-violet-400 to-fuchsia-500', badge: 'border-violet-200 bg-violet-50 text-violet-700' },
    'Wallets & Identification': { accent: 'from-emerald-400 to-teal-500', badge: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
    'Keys & Access Badges': { accent: 'from-amber-400 to-orange-500', badge: 'border-amber-200 bg-amber-50 text-amber-700' },
    'Books & Notebooks': { accent: 'from-brand-500 to-indigo-500', badge: 'border-brand-200 bg-brand-50 text-brand-700' },
    'Clothing & Wearables': { accent: 'from-rose-400 to-pink-500', badge: 'border-rose-200 bg-rose-50 text-rose-700' },
    'Eyewear': { accent: 'from-teal-400 to-cyan-500', badge: 'border-teal-200 bg-teal-50 text-teal-700' },
    'Jewelry & Accessories': { accent: 'from-yellow-400 to-amber-500', badge: 'border-yellow-200 bg-yellow-50 text-yellow-700' },
  };

  return (
    <div className="space-y-20 pb-16">
      <section className="relative mt-2 overflow-hidden rounded-[28px] border border-brand-100/70 bg-hero-gradient px-6 pb-10 pt-10 shadow-hero sm:px-10 lg:px-14">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-8 h-56 w-56 rounded-full bg-teal-100/70 blur-2xl" />
        <div className="pointer-events-none absolute right-10 top-14 h-20 w-20 rounded-full border border-white/60 bg-white/20" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/80 px-4 py-1.5 shadow-[0_10px_30px_-20px_rgba(65,105,225,0.5)] backdrop-blur-sm"
            >
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-700">
                Your campus, reconnected
              </span>
            </motion.div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-brand-900 sm:text-5xl">
                Lost something on campus?
                <span className="mt-1 block text-brand-500">Let&apos;s bring it back.</span>
              </h1>
              <p className="max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
                Search campus-wide reports and let our matching engine surface the most likely matches — instantly.
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-xl">
              <div className="relative flex items-center overflow-hidden rounded-2xl border-2 border-brand-100 bg-white/95 shadow-[0_20px_40px_-24px_rgba(65,105,225,0.42)] transition-all duration-200 focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-100/70 focus-within:shadow-[0_22px_50px_-24px_rgba(65,105,225,0.52)] hover:border-brand-300">
                <Search className="ml-4 h-5 w-5 shrink-0 text-brand-500" />
                <input
                  type="text"
                  placeholder="e.g. Hydro Flask, blue backpack, AirPods..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-brand-900 placeholder:text-slate-400 outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="m-1.5 shrink-0 rounded-xl bg-[#0D9488] px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_28px_-18px_rgba(13,148,136,0.76)] transition-all duration-200 hover:bg-[#0F766E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99F6E4] focus-visible:ring-offset-2"
                >
                  Search
                </motion.button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNavigateToBrowse}
                className="flex items-center gap-2 rounded-xl border-2 border-brand-200 bg-white px-6 py-3 text-sm font-bold text-[#172B4D] shadow-[0_18px_30px_-22px_rgba(65,105,225,0.58)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-[#EDF3FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2"
              >
                <Search className="h-4 w-4 text-brand-600" />
                Browse All Items
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenReportModal('LOST')}
                className="flex items-center gap-2 rounded-xl border border-[#FBCFE8] bg-[#FCE7F3] px-6 py-3 text-sm font-bold text-[#9F1239] shadow-[0_18px_28px_-22px_rgba(244,63,94,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FBE1E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F9A8D4] focus-visible:ring-offset-2"
              >
                <PlusCircle className="h-4 w-4 text-[#E11D48]" />
                Report Lost Item
              </motion.button>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
              {statItems.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border ${stat.border} ${stat.bg}/90 px-4 py-3 text-center shadow-[0_12px_24px_-18px_rgba(15,23,42,0.18)]`}
                >
                  <p className={`text-2xl font-extrabold ${stat.text}`}>{stat.value}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative hidden h-72 items-center justify-center lg:flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="absolute h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(65,105,225,0.18),_rgba(255,255,255,0)_65%)] blur-2xl" />
            <motion.div
              className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[28px] border-2 border-brand-200 bg-gradient-to-br from-brand-500 via-brand-500 to-teal-500 text-center shadow-[0_20px_40px_-18px_rgba(65,105,225,0.6)]"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div>
                <Search className="mx-auto h-10 w-10 text-white" />
                <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-brand-50">Match</span>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-52 w-52 rounded-full border border-brand-200/80 border-dashed" />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full border border-violet-200/60 border-dashed" />
            </div>

            <FloatingItem
              icon={<Backpack className="h-7 w-7 text-brand-600" />}
              bg="bg-brand-50"
              border="border-brand-200"
              top="8%"
              left="18%"
              delay={0}
              rotate={-6}
            />
            <FloatingItem
              icon={<Headphones className="h-7 w-7 text-violet-600" />}
              bg="bg-violet-50"
              border="border-violet-200"
              top="6%"
              right="14%"
              delay={0.6}
              rotate={8}
            />
            <FloatingItem
              icon={<KeyRound className="h-7 w-7 text-amber-500" />}
              bg="bg-amber-50"
              border="border-amber-200"
              bottom="14%"
              right="10%"
              delay={1}
              rotate={-4}
            />
            <FloatingItem
              icon={<BookOpen className="h-7 w-7 text-teal-600" />}
              bg="bg-teal-50"
              border="border-teal-200"
              bottom="10%"
              left="14%"
              delay={0.4}
              rotate={5}
            />
            <FloatingItem
              icon={<Droplets className="h-7 w-7 text-sky-500" />}
              bg="bg-sky-50"
              border="border-sky-200"
              top="42%"
              left="4%"
              delay={0.8}
              rotate={-3}
            />
            <FloatingItem
              icon={<CreditCard className="h-7 w-7 text-coral-500" />}
              bg="bg-coral-50"
              border="border-coral-200"
              top="38%"
              right="2%"
              delay={1.2}
              rotate={7}
            />
          </motion.div>
        </div>
      </section>

      {displayFound.length > 0 && (
        <section className="mx-auto max-w-7xl space-y-6 px-1">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-600">Turned in recently</span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">Recently Found Items</h2>
              <p className="mt-1 text-sm text-slate-500">Reported at campus locations — one might be yours.</p>
            </div>
            <motion.button
              whileHover={{ x: 3 }}
              onClick={onNavigateToBrowse}
              className="flex items-center gap-1.5 self-start text-sm font-bold text-brand-600 transition-colors hover:text-brand-700 sm:self-auto"
            >
              View all items
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayFound.map((item, idx) => {
              const tone = categoryStyles[item.category] ?? { accent: 'from-slate-400 to-slate-500', badge: 'border-slate-200 bg-slate-50 text-slate-700' };

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.07, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_32px_-24px_rgba(15,23,42,0.28)] transition-all duration-200 hover:border-brand-200 hover:shadow-[0_20px_40px_-24px_rgba(65,105,225,0.26)]"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${tone.accent}`} />

                  <div className="flex flex-1 flex-col space-y-3 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <CategoryIcon category={item.category} size="md" />
                      <span className="shrink-0 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
                        Found
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="line-clamp-1 text-base font-extrabold text-brand-900 transition-colors group-hover:text-brand-700">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.description}</p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => onOpenDetails(item)}
                        className="flex items-center gap-1 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-800"
                      >
                        Details
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>

                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onSelectForMatching(item)}
                        className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_12px_22px_-16px_rgba(65,105,225,0.72)] transition-all hover:from-brand-600 hover:to-brand-500"
                      >
                        Match This
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      <section id="how-it-works" className="mx-auto max-w-7xl px-1">
        <div className="overflow-hidden rounded-[28px] border border-brand-100/70 bg-gradient-to-br from-white via-brand-50/40 to-violet-50/60 shadow-[0_18px_42px_-26px_rgba(65,105,225,0.18)]">
          <div className="space-y-3 px-6 pb-8 pt-12 text-center">
            <span className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
              Simple 3-step process
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">How CampusFind Works</h2>
            <p className="mx-auto max-w-lg text-sm text-slate-600">
              Designed for busy students to quickly report, discover, and safely recover lost belongings.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-0 px-6 pb-12 md:grid-cols-3">
            {[
              {
                step: '01',
                bg: 'bg-brand-50',
                iconBg: 'bg-brand-500',
                title: 'Report Lost or Found',
                desc: 'Fill out a simple form with the category, colour, campus location, date, and brief description of the item.',
                tag: 'Takes < 2 minutes',
                tagColor: 'text-brand-600 bg-brand-50 border-brand-200',
              },
              {
                step: '02',
                bg: 'bg-violet-50',
                iconBg: 'bg-violet-500',
                title: 'Smart Matching',
                desc: 'Our engine compares descriptions, categories, campus zones, colours, and dates to surface the closest candidates.',
                tag: 'Instant results',
                tagColor: 'text-violet-600 bg-violet-50 border-violet-200',
              },
              {
                step: '03',
                bg: 'bg-teal-50',
                iconBg: 'bg-teal-500',
                title: 'Verify & Recover',
                desc: 'Answer a confidential ownership challenge to prove the item is yours, then pick it up safely.',
                tag: 'Private & secure',
                tagColor: 'text-teal-600 bg-teal-50 border-teal-200',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`group relative flex flex-col items-center space-y-4 p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_28px_-22px_rgba(15,23,42,0.22)] ${index < 2 ? 'border-slate-200/70 md:border-r' : ''} ${step.bg}`}
              >
                <span className="absolute right-7 top-6 select-none text-5xl font-black text-brand-900/80">{step.step}</span>
                <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl ${step.iconBg} text-xl font-black text-white shadow-[0_16px_30px_-18px_rgba(15,23,42,0.32)] transition-transform duration-200 group-hover:scale-105`}>
                  {index + 1}
                </div>
                <h3 className="relative z-10 text-base font-extrabold text-brand-900">{step.title}</h3>
                <p className="relative z-10 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                <span className={`relative z-10 inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${step.tagColor}`}>
                  {step.tag}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-6 sm:flex-row">
            <div className="text-white">
              <p className="text-base font-extrabold">Ready to start?</p>
              <p className="mt-0.5 text-sm text-brand-100">Report a lost or found item in under 2 minutes.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenReportModal('LOST')}
                className="rounded-xl border border-[#FBCFE8] bg-[#FCE7F3] px-5 py-2.5 text-sm font-bold text-[#9F1239] shadow-[0_16px_30px_-22px_rgba(244,63,94,0.4)] transition-all hover:bg-[#FBE1E7]"
              >
                I Lost Something
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenReportModal('FOUND')}
                className="rounded-xl bg-[#0D9488] px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_30px_-18px_rgba(13,148,136,0.7)] transition-all hover:bg-[#0F766E]"
              >
                I Found Something
              </motion.button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
