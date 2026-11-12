import React, { useEffect, useState } from 'react';
import { ConfidenceTier } from '../types';

interface ScoreCounterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  confidenceTier?: ConfidenceTier;
  showCircle?: boolean;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({
  score,
  size = 'md',
  confidenceTier,
  showCircle = true,
}) => {
  const [displayedScore, setDisplayedScore] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, Math.round(score)));
    if (start === end) {
      setDisplayedScore(end);
      return;
    }

    const duration = 400; // ms snappy animation
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);
      setDisplayedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [score]);

  // Color styling based on score in friendly light theme
  const getTheme = () => {
    if (displayedScore >= 75) {
      return {
        text: 'text-brand-600',
        stroke: '#4169E1',
        bgPill: 'bg-brand-50 text-brand-700 border-brand-200',
        label: 'Strong match',
      };
    }
    if (displayedScore >= 50) {
      return {
        text: 'text-emerald-600',
        stroke: '#16A34A',
        bgPill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'Possible match',
      };
    }
    if (displayedScore >= 30) {
      return {
        text: 'text-amber-600',
        stroke: '#F59E0B',
        bgPill: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'Moderate match',
      };
    }
    return {
      text: 'text-slate-500',
      stroke: '#94A3B8',
      bgPill: 'bg-slate-100 text-slate-600 border-slate-200',
      label: 'Low match',
    };
  };

  const theme = getTheme();

  if (!showCircle) {
    return (
      <span
        className={`font-mono font-bold ${theme.text} ${
          size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-base'
        }`}
      >
        {displayedScore}%
      </span>
    );
  }

  const dimension = size === 'lg' ? 88 : size === 'md' ? 64 : 44;
  const strokeWidth = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
  const radius = (dimension - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * displayedScore) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="rotate-[-90deg]">
          {/* Subtle light background track */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={theme.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 0.15s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-semibold tracking-tight ${theme.text} ${
              size === 'lg' ? 'text-xl font-bold' : size === 'md' ? 'text-sm font-bold' : 'text-xs'
            }`}
          >
            {displayedScore}%
          </span>
        </div>
      </div>
      {confidenceTier && (
        <span
          className={`mt-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${theme.bgPill}`}
        >
          {theme.label}
        </span>
      )}
    </div>
  );
};
