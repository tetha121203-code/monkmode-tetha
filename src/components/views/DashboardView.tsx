import React from 'react';
import { ProgressBar } from '../ProgressBar';
import { DashboardCalendar } from '../DashboardCalendar';
import { QuickNote } from '../QuickNote';
import { Icon } from '../Icon';
import { HABITS, TOTAL_DAYS } from '../../data/defaults';
import { calculateHabitStreak } from '../../utils/streak';
import {
  WeightData,
  Exercise,
  WorkoutDay,
  DiaryEntry,
  HabitLog,
  RoadmapProgress,
  ToeflProgress
} from '../../types';

interface DashboardViewProps {
  dayN: number;
  pct: number;
  weight: WeightData;
  fp: { done: number; total: number };
  nfStreak: number;
  njStreak: number;
  todayM: any[];
  safeRprog: RoadmapProgress;
  toggleRprog: (id: string) => void;
  codeDone: number;
  allVidsLength: number;
  setTab: (tab: string) => void;
  ws: WorkoutDay;
  priEx: Exercise[];
  isExDone: (ex: Exercise) => boolean;
  toggleEx: (ex: Exercise) => void;
  dayName: string;
  safeDiary: DiaryEntry[];
  safeHL: HabitLog;
  setHabitLog: React.Dispatch<React.SetStateAction<HabitLog>>;
  dateKey: string;
  toeflDone: number;
  allToeflLength: number;
  quickNote: string;
  setQuickNote: (val: string) => void;
  onCopyToDiary?: (text: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dayN,
  pct,
  weight,
  fp,
  nfStreak,
  njStreak,
  todayM,
  safeRprog,
  toggleRprog,
  codeDone,
  allVidsLength,
  setTab,
  ws,
  priEx,
  isExDone,
  toggleEx,
  dayName,
  safeDiary,
  safeHL,
  setHabitLog,
  dateKey,
  toeflDone,
  allToeflLength,
  quickNote,
  setQuickNote,
  onCopyToDiary,
}) => {
  const lastEntry = safeDiary.length > 0 ? safeDiary[safeDiary.length - 1] : null;
  const todayHabits = safeHL[dateKey] || {};
  const habitDone = HABITS.filter(h => todayHabits[h.id]).length;

  const toggleH = (id: string) => {
    setHabitLog((prev) => {
      const s = prev || {};
      const d = s[dateKey] || {};
      return { ...s, [dateKey]: { ...d, [id]: !d[id] } };
    });
  };

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="grid5">
        {[
          { l: 'NOFAP STREAK', v: `${nfStreak} hari`, c: '#38bdf8' },
          { l: 'NO JUNKFOOD', v: `${njStreak} hari`, c: '#22c55e' },
          { l: 'DATA ANALYST', v: `${codeDone}/${allVidsLength}`, c: '#ffffff' },
          { l: 'CPNS', v: `${toeflDone}/${allToeflLength}`, c: '#a855f7' },
          { l: 'BERAT', v: `${weight.current}kg`, c: '#ffffff' }
        ].map(s => (
          <div key={s.l} className="card card-p" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.c, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="between" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              BRUTAL TRANSFORMATION — DAY {dayN}
            </span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#f43f5e' }}>{pct}%</span>
          </div>
          <ProgressBar cur={dayN} tot={TOTAL_DAYS} cls="r" />
        </div>

        {/* Calendar on Dashboard */}
        <DashboardCalendar dayN={dayN} total={TOTAL_DAYS} habitLog={safeHL} />
      </div>

      <div className="grid2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>DAILY ACTIVITY</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#ffffff' }}>Habits Hari Ini</div>
            </div>
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 900 }}>{habitDone}/{HABITS.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HABITS.map(h => {
              const done = !!todayHabits[h.id];
              const streak = calculateHabitStreak(h.id, safeHL);
              return (
                <div key={h.id} className={`habit-card${done ? ' done' : ''}`} onClick={() => toggleH(h.id)}>
                  <div className="habit-check">{done && <Icon name="check" size={12} />}</div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700, color: done ? '#94a3b8' : '#ffffff', flex: 1 }}>
                    <span style={{ color: done ? h.color : 'inherit' }}><Icon name={h.iconName} size={16} /></span> {h.label}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: streak > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      color: streak > 0 ? '#f59e0b' : '#64748b',
                      border: `1px solid ${streak > 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`
                    }}
                    title={`Current streak: ${streak} hari berturut-turut`}
                  >
                    <Icon name="flame" size={13} style={{ color: streak > 0 ? '#f59e0b' : '#64748b' }} />
                    <span>{streak} Hari</span>
                  </div>
                </div>
              );
            })}
          </div>
          <ProgressBar cur={habitDone} tot={HABITS.length} cls="g" />
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{ws.type || 'REST DAY'}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#ffffff' }}>{dayName} — {ws.focus}</div>
            </div>
            <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 900 }}>{fp.done}/{fp.total}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priEx.slice(0, 4).map((ex, i) => {
              const done = isExDone(ex);
              return (
                <div key={i} className={`ex-card${done ? ' done' : ''}`} onClick={() => toggleEx(ex)}>
                  <div className="ex-num">{done ? <Icon name="check" size={14} /> : i + 1}</div>
                  <div>
                    <div className="ex-title">{ex.name}</div>
                    <div className="ex-meta">{ex.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <ProgressBar cur={fp.done} tot={fp.total} />
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="between">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Data Analyst — Day {dayN}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>Target Data Analyst Hari Ini</div>
          </div>
          <span style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 800 }}>{codeDone}/{allVidsLength}</span>
        </div>
        {todayM.length === 0 && (
          <div style={{ fontSize: 14, color: 'var(--text2)', padding: '10px 0' }}>
            Target hari ini sudah selesai. Lanjutkan progres di luar modul.
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {todayM.map(m => {
            const done = safeRprog[m.id];
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${done ? 'var(--blue-border)' : 'var(--border)'}`,
                  background: done ? 'var(--blue-dim)' : 'var(--surface2)',
                  transition: 'all 0.2s'
                }}
              >
                <div
                  onClick={() => toggleRprog(m.id)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: `2px solid ${done ? 'var(--blue)' : 'var(--text3)'}`,
                    background: done ? 'var(--blue)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                >
                  {done && <Icon name="check" size={14} style={{ color: 'white' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <span className={`tag ${m.type === 'video' ? 'tag-blue' : 'tag-dim'}`}>
                      {m.type === 'video' ? 'Video' : 'Case'}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: done ? 'var(--text3)' : 'var(--text)',
                      textDecoration: done ? 'line-through' : 'none',
                      lineHeight: 1.4
                    }}
                  >
                    {m.title}
                  </div>
                  {m.url && (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12,
                        color: 'var(--blue-hover)',
                        marginTop: 6,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <Icon name="ext" size={12} /> Buka Link
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lastEntry && (
        <div className="card card-p" style={{ cursor: 'pointer' }} onClick={() => setTab('diary')}>
          <div className="between" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entri Diary Terakhir</span>
            <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{lastEntry.date}</span>
          </div>
          <div
            style={{
              fontSize: 15,
              color: 'var(--text)',
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {lastEntry.text}
          </div>
        </div>
      )}

      {/* Floating Quick Note Widget for Deep Work Session Scratchpad */}
      <QuickNote
        value={quickNote}
        onChange={setQuickNote}
        onCopyToDiary={onCopyToDiary}
      />
    </div>
  );
};
