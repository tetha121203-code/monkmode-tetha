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
    <header className="topbar">
      <div>
        <div className="tb-title">
          <span>{currentTabLabel}</span>
          <span 
            className="tag tag-blue" 
            style={{ 
              fontSize: 10, 
              padding: '3px 8px', 
              borderRadius: 6,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25), rgba(124, 58, 237, 0.2))',
              border: '1px solid rgba(96, 165, 250, 0.4)'
            }}
          >
            2026 PROTOCOL
          </span>
        </div>
        <div className="tb-sub">
          <span style={{ color: 'var(--text2)' }}>{fmtDate}</span>
          <span aria-hidden="true" style={{ color: 'var(--text3)' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--cyan)', fontWeight: 700 }}>
            <span className="glow-dot" style={{ background: 'var(--cyan)' }} />
            Day {dayN} dari {totalDays}
          </span>
        </div>
      </div>

      <div className="tb-right">
        {isMobile && (
          <button className="icon-btn" onClick={onOpenSettings} aria-label="Settings" title="Pengaturan">
            <Icon name="settings" size={18} />
          </button>
        )}

        <div className="stat-chip" onClick={onOpenCalendar} title="Buka Kalender Timeline Protokol">
          <Icon name="cal" size={18} className="pulse-glow" style={{ color: 'var(--blue-hover)' }} />
          <div>
            <div className="chip-label">Protocol</div>
            <div className="chip-val" style={{ color: 'var(--blue-hover)', textShadow: '0 0 10px rgba(96, 165, 250, 0.5)' }}>
              {pct}%
            </div>
          </div>
        </div>

        <div className="stat-chip purple" onClick={onOpenWeight} title="Klik untuk Update Berat Badan">
          <Icon name="scale" size={18} className="pulse-purple-glow" style={{ color: 'var(--purple-light)' }} />
          <div>
            <div className="chip-label">Target 63kg</div>
            <div className="chip-val" style={{ color: 'var(--purple-light)', textShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }}>
              {weight.current}kg
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
