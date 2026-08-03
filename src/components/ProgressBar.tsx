import React from 'react';

interface ProgressBarProps {
  cur: number;
  tot: number;
  cls?: string; // 'g' | 'r' | 'a' | 'p' or custom
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ cur, tot, cls = '' }) => {
  const percentage = Math.min(100, Math.max(0, (cur / (tot || 1)) * 100));
  return (
    <div className="prog">
      <div className={`prog-bar ${cls}`} style={{ width: `${percentage}%` }} />
    </div>
  );
};
