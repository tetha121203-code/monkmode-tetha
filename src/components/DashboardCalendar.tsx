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
      <div className="between" style={{ marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {new Date(y, m, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, marginTop: 2 }}>Hari ke-{dayN} dari {total} Protocol</div>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'var(--text2)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--blue)' }}></span> Hari Ini
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--blue-dim)', border: '1px solid var(--blue-border)' }}></span> Perfect
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
        {dayLabels.map(l => (
          <div key={l} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textAlign: 'center', paddingBottom: 4 }}>
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

          let bg = 'var(--surface2)';
          let border = '1px solid var(--border)';
          let color = 'var(--text2)';

          if (status === 'today') {
            bg = 'var(--blue)';
            color = '#ffffff';
            border = '1px solid var(--blue-hover)';
          } else if (status === 'done-all') {
            bg = 'var(--blue-dim)';
            color = 'var(--blue-hover)';
            border = '1px solid var(--blue-border)';
          } else if (status === 'past') {
            bg = 'var(--surface2)';
            color = 'var(--text3)';
            border = '1px solid rgba(255, 255, 255, 0.04)';
          } else if (status === 'future') {
            bg = 'transparent';
            color = 'var(--text-muted)';
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
                fontSize: 11,
                fontWeight: status === 'today' ? 800 : 600,
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
