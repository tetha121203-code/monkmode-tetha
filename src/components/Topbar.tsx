import React from 'react';
import { Icon } from './Icon';
import { WeightData } from '../types';

interface TopbarProps {
  currentTabLabel: string;
  fmtDate: string;
  dayN: number;
  totalDays: number;
  pct: number;
  weight: WeightData;
  isMobile: boolean;
  onOpenCalendar: () => void;
  onOpenWeight: () => void;
  onOpenSettings: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTabLabel,
  fmtDate,
  dayN,
  totalDays,
  pct,
  weight,
  isMobile,
  onOpenCalendar,
  onOpenWeight,
  onOpenSettings,
}) => {
  return (
    <div className="topbar">
      <div>
        <div className="tb-title">{currentTabLabel}</div>
        <div className="tb-sub">{fmtDate} — Day {dayN}/{totalDays}</div>
      </div>
      <div className="tb-right" style={{ display: 'flex', gap: 12 }}>
        {isMobile && (
          <button className="icon-btn" onClick={onOpenSettings} aria-label="Settings">
            <Icon name="settings" />
          </button>
        )}
        <div className="stat-chip" onClick={onOpenCalendar}>
          <Icon name="cal" size={18} className="pulse-glow" style={{ color: 'var(--blue)' }} />
          <div>
            <div className="chip-label">Progress</div>
            <div className="chip-val">{pct}%</div>
          </div>
        </div>
        <div className="stat-chip" onClick={onOpenWeight}>
          <Icon name="scale" size={18} style={{ color: 'var(--green)' }} />
          <div>
            <div className="chip-label">Berat</div>
            <div className="chip-val">{weight.current}kg</div>
          </div>
        </div>
      </div>
    </div>
  );
};
