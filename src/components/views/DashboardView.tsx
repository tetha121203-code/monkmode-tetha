import React from 'react';
import { HABITS, TOTAL_DAYS } from '../../data/defaults';
import { DiaryEntry, HabitLog, ToeflDailyProgress, ToeflPhase, ToeflProgress, ToeflSchedule, WeightData, TryoutRecord } from '../../types';
import { DashboardCalendar } from '../DashboardCalendar';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { QuickNote } from '../QuickNote';
import { CpnsScoreTrendChart } from '../CpnsScoreTrendChart';

interface DashboardViewProps {
  dayN: number;
  pct: number;
  weight: WeightData;
  fp: { done: number; total: number };
  nfStreak: number;
  njStreak: number;
  setTab: (tab: string) => void;
  ws: any;
  priEx: any[];
  isExDone: (ex: any) => boolean;
  toggleEx: (ex: any) => void;
  dayName: string;
  safeDiary: DiaryEntry[];
  safeHL: HabitLog;
  setHabitLog: React.Dispatch<React.SetStateAction<HabitLog>>;
  dateKey: string;
  toeflDone: number;
  allToeflLength: number;
  safeToefl: ToeflPhase[];
  safeToeflProg: ToeflProgress;
  toeflSched: ToeflSchedule;
  toeflDaily: ToeflDailyProgress;
  setToeflDaily: React.Dispatch<React.SetStateAction<ToeflDailyProgress>>;
  quickNote: string;
  setQuickNote: (val: string) => void;
  onCopyToDiary: (text: string) => void;
  tryouts?: TryoutRecord[];
  onAddTryout?: (record: TryoutRecord) => void;
}

const calculateHabitStreak = (habitId: string, habitLog: HabitLog): number => {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = d.toISOString().split('T')[0];
    if (!habitLog[key]?.[habitId]) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  dayN,
  pct,
  weight,
  fp,
  nfStreak,
  njStreak,
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
  toeflSched,
  toeflDaily,
  setToeflDaily,
  quickNote,
  setQuickNote,
  onCopyToDiary,
  tryouts = [],
  onAddTryout,
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

  const todaySched = toeflSched[dayName] || { type: 'Rest', focus: '-', tasks: [] };
  const todayTasks = todaySched.tasks || [];
  const dailyKeyFor = (day: string, taskName: string) => `${dateKey}-toefl-${day}-${taskName}`;
  const isCpnsTaskDone = (day: string, taskName: string) => !!toeflDaily[dailyKeyFor(day, taskName)];
  const todayCpnsDone = todayTasks.filter(t => isCpnsTaskDone(dayName, t.name)).length;

  const toggleCpnsTask = (day: string, taskName: string) => {
    setToeflDaily(p => {
      const s = p || {};
      const k = dailyKeyFor(day, taskName);
      return { ...s, [k]: !s[k] };
    });
  };

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 5-Column Minimalist Overview with Neon Glow */}
      <div className="grid5">
        {[
          { l: 'NOFAP STREAK', v: `${nfStreak} hari`, c: 'var(--cyan)', glow: 'rgba(56, 189, 248, 0.25)', icon: 'zap' },
          { l: 'NO JUNKFOOD', v: `${njStreak} hari`, c: 'var(--green)', glow: 'rgba(16, 185, 129, 0.25)', icon: 'flame' },
          { l: 'CPNS SKD MATERI', v: `${toeflDone}/${allToeflLength}`, c: 'var(--blue)', glow: 'rgba(59, 130, 246, 0.25)', icon: 'book' },
          { l: 'MISI HARI INI', v: `${todayCpnsDone}/${todayTasks.length}`, c: 'var(--blue-hover)', glow: 'rgba(96, 165, 250, 0.25)', icon: 'check' },
          { l: 'BERAT BADAN', v: `${weight.current}kg`, c: 'var(--text)', glow: 'rgba(255, 255, 255, 0.15)', icon: 'scale' }
        ].map(s => (
          <div
            key={s.l}
            className="card card-p"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 16px ${s.glow}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</span>
              <span className="glow-dot" style={{ background: s.c, boxShadow: `0 0 8px ${s.c}` }} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.c, letterSpacing: '-0.02em', lineHeight: 1, textShadow: `0 0 16px ${s.glow}` }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Progress & Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid var(--blue-border)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)' }}>
          <div className="between" style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="glow-dot" style={{ background: 'var(--blue-hover)' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Protokol Monk Mode — Day {dayN}
              </span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--blue-hover)', textShadow: '0 0 12px rgba(96, 165, 250, 0.5)' }}>{pct}%</span>
          </div>
          <ProgressBar cur={dayN} tot={TOTAL_DAYS} cls="r" />
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span>Target: 214 Hari Disiplin Penuh</span>
            <span>Tersisa <b style={{ color: 'var(--blue-hover)' }}>{Math.max(0, TOTAL_DAYS - dayN)}</b> Hari</span>
          </div>
        </div>

        <DashboardCalendar dayN={dayN} total={TOTAL_DAYS} habitLog={safeHL} />
      </div>

      {/* Habits & Fitness Grid */}
      <div className="grid2">
        {/* Habits Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>DAILY ACTIVITY</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Habits Hari Ini</div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 800 }}>{habitDone}/{HABITS.length} Selesai</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {HABITS.map(h => {
              const done = !!todayHabits[h.id];
              const streak = calculateHabitStreak(h.id, safeHL);
              return (
                <div key={h.id} className={`habit-card${done ? ' done' : ''}`} onClick={() => toggleH(h.id)}>
                  <div className="habit-check">{done && <Icon name="check" size={12} />}</div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: done ? 'var(--text3)' : 'var(--text)', flex: 1 }}>
                    <span style={{ color: done ? 'var(--green)' : 'var(--blue)' }}><Icon name={h.iconName} size={15} /></span> {h.label}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 6,
                      background: streak > 0 ? 'var(--blue-dim)' : 'var(--surface)',
                      color: streak > 0 ? 'var(--blue-hover)' : 'var(--text3)',
                      border: `1px solid ${streak > 0 ? 'var(--blue-border)' : 'var(--border)'}`
                    }}
                    title={`Streak: ${streak} hari berturut-turut`}
                  >
                    <Icon name="flame" size={12} style={{ color: streak > 0 ? 'var(--blue)' : 'var(--text3)' }} />
                    <span>{streak} Hari</span>
                  </div>
                </div>
              );
            })}
          </div>
          <ProgressBar cur={habitDone} tot={HABITS.length} cls="g" />
        </div>

        {/* Workout Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{ws.type || 'REST DAY'}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{dayName} — {ws.focus}</div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 800 }}>{fp.done}/{fp.total} Gerakan</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {priEx.slice(0, 4).map((ex, i) => {
              const done = isExDone(ex);
              return (
                <div key={i} className={`ex-card${done ? ' done' : ''}`} onClick={() => toggleEx(ex)}>
                  <div className="ex-num">{done ? <Icon name="check" size={13} /> : i + 1}</div>
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

      {/* CPNS SKD Study Focus Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, border: '1px solid var(--blue-border)' }}>
        <div className="between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              BELAJAR CPNS SKD — DAY {dayN}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>
              {todaySched.type} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>— {todaySched.focus}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--blue-hover)', fontWeight: 700 }}>
              {todayCpnsDone}/{todayTasks.length} Misi Selesai
            </span>
            <button
              onClick={() => setTab('toefl')}
              className="btn btn-blue"
              style={{ fontSize: 12, padding: '6px 14px', fontWeight: 700 }}
            >
              Buka Cockpit CPNS →
            </button>
          </div>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text2)', padding: '8px 0' }}>
            Hari santai / istirahat. Evaluasi dan review materi mandiri.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {todayTasks.map((t, i) => {
              const done = isCpnsTaskDone(dayName, t.name);
              return (
                <div
                  key={i}
                  className={`ex-card${done ? ' done' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleCpnsTask(dayName, t.name)}
                >
                  <div className="ex-num" style={{ borderColor: done ? 'var(--green)' : 'var(--blue)', color: done ? 'var(--green)' : 'var(--blue)' }}>
                    {done ? <Icon name="check" size={13} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-title" style={{ color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
                      {t.name}
                    </div>
                    <div className="ex-meta">{t.detail}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: done ? 'var(--green)' : 'var(--blue)',
                      background: 'var(--surface)',
                      padding: '3px 7px',
                      borderRadius: 6,
                      border: '1px solid var(--border)',
                      flexShrink: 0
                    }}
                  >
                    {t.time}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="between" style={{ marginTop: 2, paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>
            Ambang Batas Kelulusan: <b style={{ color: 'var(--text2)' }}>TWK ≥ 65</b> · <b style={{ color: 'var(--text2)' }}>TIU ≥ 80</b> · <b style={{ color: 'var(--text2)' }}>TKP ≥ 166</b>
          </span>
          <span style={{ fontSize: 11, color: 'var(--blue-hover)', fontWeight: 700 }}>
            Penguasaan Silabus: {Math.round((toeflDone / Math.max(allToeflLength, 1)) * 100)}% ({toeflDone}/{allToeflLength} Bab)
          </span>
        </div>
      </div>

      {/* CPNS Practice Scores Trend Chart */}
      <CpnsScoreTrendChart
        tryouts={tryouts}
        onAddTryout={onAddTryout}
        onNavigateToCockpit={() => setTab('toefl')}
      />

      {/* Diary Card */}
      {lastEntry && (
        <div className="card card-p" style={{ cursor: 'pointer' }} onClick={() => setTab('diary')}>
          <div className="between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Entri Diary Terakhir</span>
            <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>{lastEntry.date}</span>
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: 1.6,
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

      {/* Floating Quick Note Widget */}
      <QuickNote
        value={quickNote}
        onChange={setQuickNote}
        onCopyToDiary={onCopyToDiary}
      />
    </div>
  );
};
