import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  colorVariant?: 'teal' | 'emerald' | 'amber' | 'orange' | 'rose' | 'red' | 'indigo';
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  colorVariant = 'teal',
  showPercentage = true,
  height = 'md'
}) => {
  const boundedValue = Math.min(100, Math.max(0, value));

  const colorMap = {
    teal: 'bg-teal-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500',
    rose: 'bg-rose-600',
    red: 'bg-red-800',
    indigo: 'bg-indigo-600'
  };

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-700">
          <span>{label} {sublabel && <span className="text-slate-400 font-normal">({sublabel})</span>}</span>
          {showPercentage && <span className="font-semibold text-slate-900">{boundedValue.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 ${heightMap[height]}`}>
        <div
          className={`${colorMap[colorVariant]} ${heightMap[height]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${boundedValue}%` }}
        />
      </div>
    </div>
  );
};
