import React from 'react';
import type { NDISeverity, DASSSeverity, ErgoRiskLevel } from '../../types/assessment';
import { AlertCircle, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SeverityBadgeProps {
  type: 'ndi' | 'depression' | 'anxiety' | 'stress' | 'ergo';
  level: NDISeverity | DASSSeverity | ErgoRiskLevel | string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  level,
  showIcon = true,
  size = 'md'
}) => {
  let colorClasses = 'bg-slate-100 text-slate-800 border-slate-200';
  let IconComponent = CheckCircle2;

  const normalized = level.toLowerCase();

  if (normalized.includes('normal') || normalized.includes('no disability') || normalized.includes('low')) {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-500/20';
    IconComponent = CheckCircle2;
  } else if (normalized.includes('mild')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/20';
    IconComponent = AlertCircle;
  } else if (normalized.includes('moderate')) {
    colorClasses = 'bg-orange-50 text-orange-800 border-orange-200 ring-orange-500/20';
    IconComponent = AlertTriangle;
  } else if (normalized.includes('extremely severe') || normalized.includes('high')) {
    colorClasses = 'bg-red-900 text-red-100 border-red-700 ring-red-500/30';
    IconComponent = ShieldAlert;
  } else if (normalized.includes('severe') || normalized.includes('complete')) {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-200 ring-rose-500/20';
    IconComponent = AlertTriangle;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-semibold gap-2'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border shadow-xs ${colorClasses} ${sizeClasses}`}>
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{level}</span>
    </span>
  );
};
