import React from 'react';
import { HABITS, PROGRAM_START_DATE, TOTAL_DAYS } from '../data/defaults';
import { HabitLog } from '../types';

interface DashboardCalendarProps {
  dayN: number;
  total: number;
  habitLog: HabitLog;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ dayN, total, habitLog }) => {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const safeLog = habitLog || {};

  return (
    <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="between" style={{ marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {new Date(y, m, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, marginTop: 2 }}>Hari ke-{dayN} dari {total} Protocol</div>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#f43f5e' }}></span> HARI INI
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.5)' }}></span> PERFECT DAY
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {dayLabels.map(l => (
          <div key={l} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textAlign: 'center', paddingBottom: 6 }}>
            {l}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const cellDate = new Date(y, m, d);
          cellDate.setHours(0,0,0,0);
          const t = new Date(today);
          t.setHours(0,0,0,0);
          const dateKey = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

          let status = '';
          if (cellDate.getTime() === t.getTime()) status = 'today';
          else if (cellDate < PROGRAM_START_DATE) status = 'past';
          else if (cellDate > new Date(PROGRAM_START_DATE.getTime() + (TOTAL_DAYS * 86400000))) status = 'future';
          else if (cellDate < t) status = 'past';
          else status = 'pending';

          // Check habits logic for past days
          let habitsDoneCount = 0;
          if (status === 'past' && cellDate >= PROGRAM_START_DATE) {
            const hl = safeLog[dateKey] || {};
            habitsDoneCount = HABITS.filter(h => hl[h.id]).length;
            if (habitsDoneCount === HABITS.length) status = 'done-all';
          }

          let bg = '#0b1120';
          let border = '1px solid rgba(255, 255, 255, 0.08)';
          let color = '#94a3b8';

          if (status === 'today') {
            bg = '#f43f5e';
            color = '#ffffff';
            border = '1px solid #f43f5e';
          } else if (status === 'done-all') {
            bg = 'rgba(56, 189, 248, 0.15)';
            color = '#38bdf8';
            border = '1px solid rgba(56, 189, 248, 0.35)';
          } else if (status === 'past') {
            bg = '#080d1a';
            color = '#64748b';
            border = '1px solid rgba(255, 255, 255, 0.05)';
          } else if (status === 'future') {
            bg = 'transparent';
            color = '#334155';
            border = '1px solid transparent';
          }

          return (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: status === 'today' ? 900 : 700,
                borderRadius: '6px',
                background: bg,
                border: border,
                color: color,
                transition: 'all 0.15s',
                cursor: d ? 'pointer' : 'default',
              }}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};
