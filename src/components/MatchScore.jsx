import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MatchScore({ score, size = 'md' }) {
  if (score === null || score === undefined) return null;

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeColor = 'bg-emerald-500';

  if (score >= 80) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300';
    badgeColor = 'bg-emerald-600';
  } else if (score >= 60) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-300';
    badgeColor = 'bg-blue-600';
  } else {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-300';
    badgeColor = 'bg-amber-500';
  }

  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xs font-semibold ${colorClasses} ${isSmall ? 'text-xs' : 'text-sm'}`}>
      <Sparkles className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'} text-primary animate-pulse`} />
      <span>{score}% Match</span>
    </div>
  );
}
