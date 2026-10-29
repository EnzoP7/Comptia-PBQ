import React from 'react';

/**
 * The simulator's own emblem: a brand-red ring open at the bottom around the exam code. It is an
 * original mark, not a certification badge, so it never carries the CompTIA name or logo.
 * `mark` is the small version (favicon, header); `full` adds the wordmark for larger placements.
 */
export const Emblem: React.FC<{ variant?: 'mark' | 'full'; className?: string; title?: string }> = ({
  variant = 'mark',
  className,
  title = 'Security+ SY0-701 PBQ Simulator',
}) => {
  // Ring from 120° to 60° going over the top, leaving a gap at the bottom.
  const ring = 'M 170 525.167 A 260 260 0 1 1 430 525.167';
  if (variant === 'mark') {
    return (
      <svg viewBox="0 0 600 600" className={className} role="img" aria-label={title}>
        <circle cx="300" cy="300" r="290" fill="#ffffff" />
        <path d={ring} fill="none" stroke="#c8102e" strokeWidth="58" strokeLinecap="butt" />
        <text x="300" y="352" textAnchor="middle" fontFamily="'Source Sans 3', 'Segoe UI', sans-serif" fontWeight="800" fontSize="170" fill="#101317" letterSpacing="-4">
          PBQ
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label={title}>
      <circle cx="300" cy="300" r="290" fill="#ffffff" />
      <path d={ring} fill="none" stroke="#c8102e" strokeWidth="44" strokeLinecap="butt" />
      <g fontFamily="'Source Sans 3', 'Segoe UI', sans-serif" textAnchor="middle">
        <text x="300" y="200" fontWeight="700" fontSize="56" fill="#c8102e" letterSpacing="2">SY0-701</text>
        <text x="300" y="338" fontWeight="800" fontSize="150" fill="#101317" letterSpacing="-4">PBQ</text>
        <rect x="160" y="370" width="280" height="56" rx="28" fill="none" stroke="#5f6670" strokeWidth="5" />
        <text x="300" y="410" fontWeight="700" fontSize="32" fill="#454c56" letterSpacing="3">SIMULATOR</text>
        <text x="300" y="474" fontWeight="600" fontSize="34" fill="#5f6670">Exam practice</text>
      </g>
    </svg>
  );
};
