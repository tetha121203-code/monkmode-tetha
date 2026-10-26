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
  const isStudyTaskDone = (day: string, taskName: string) => !!toeflDaily[dailyKeyFor(day, taskName)];
  const todayStudyDone = todayTasks.filter(t => isStudyTaskDone(dayName, t.name)).length;

  const toggleStudyTask = (day: string, taskName: string) => {
    setToeflDaily(p => {
      const s = p || {};
      const k = dailyKeyFor(day, taskName);
      return { ...s, [k]: !s[k] };
    });
  };

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* 2026 Futuristic Quick Action Cockpit Header */}
      <div 
        className="card glow-card-dual"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          padding: '16px 24px',
          background: 'linear-gradient(135deg, rgba(9, 16, 36, 0.9) 0%, rgba(22, 14, 46, 0.85) 100%)',
          borderRadius: 18
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 14, 
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
              color: '#fff'
            }}
          >
            <Icon name="zap" size={22} className="pulse-glow" />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MONK COCKPIT • {dayName.toUpperCase()}
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Disiplin Tanpa Kompromi — Brutal Transformation
            </div>
          </div>
        </div>

        {/* Quick Launch Shortcuts for Seamless Usability */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button 
            onClick={() => setTab('toefl')} 
            className="btn btn-dual"
            style={{ fontSize: 12, padding: '8px 16px', fontWeight: 800 }}
          >
            <Icon name="book" size={16} /> Deep Work & Study
          </button>
          <button 
            onClick={() => setTab('habits')} 
            className="btn btn-blue"
            style={{ fontSize: 12, padding: '8px 16px', fontWeight: 800 }}
          >
            <Icon name="habits" size={16} /> Checklist Habit
          </button>
          <button 
            onClick={() => setTab('fitness')} 
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '8px 16px', fontWeight: 700 }}
          >
            <Icon name="fitness" size={16} /> Workout Hari Ini
          </button>
        </div>
      </div>

      {/* 5-Column 2026 Minimalist Glowing Metric Grid */}
      <div className="grid5">
        {[
          { l: 'NOFAP STREAK', v: `${nfStreak} hari`, c: 'var(--cyan)', glow: 'rgba(56, 189, 248, 0.35)', icon: 'zap', sub: 'Mind Clarity' },
          { l: 'NO JUNKFOOD', v: `${njStreak} hari`, c: 'var(--green)', glow: 'rgba(16, 185, 129, 0.35)', icon: 'flame', sub: 'Metabolic Fuel' },
          { l: 'MODUL BELAJAR', v: `${toeflDone}/${allToeflLength}`, c: 'var(--blue-hover)', glow: 'rgba(59, 130, 246, 0.35)', icon: 'book', sub: 'Target 100%' },
          { l: 'MISI HARI INI', v: `${todayStudyDone}/${todayTasks.length}`, c: 'var(--purple-light)', glow: 'rgba(167, 139, 250, 0.35)', icon: 'check', sub: `${dayName} Session` },
          { l: 'BERAT BADAN', v: `${weight.current}kg`, c: '#ffffff', glow: 'rgba(255, 255, 255, 0.25)', icon: 'scale', sub: `Target ${weight.target}kg` }
        ].map(s => (
          <div
            key={s.l}
            className="card card-p"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(0,0,0,0.45), 0 0 20px ${s.glow}`,
              border: `1px solid ${s.glow}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {s.l}
              </span>
              <span className="glow-dot" style={{ background: s.c, boxShadow: `0 0 10px ${s.c}` }} />
            </div>
            <div 
              style={{ 
                fontSize: 23, 
                fontWeight: 900, 
                color: s.c, 
                letterSpacing: '-0.02em', 
                lineHeight: 1, 
                textShadow: `0 0 18px ${s.glow}` 
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 600, marginTop: 6 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Master Bar & Calendar Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div 
          className="card card-p" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            border: '1px solid rgba(96, 165, 250, 0.45)', 
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 25px rgba(59, 130, 246, 0.22)' 
          }}
        >
          <div className="between" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="glow-dot" style={{ background: 'var(--cyan)' }} />
              <div>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Protokol Monk Mode — {dayN === 0 ? 'Day 0 (Kickoff 12 Okt)' : `Day ${dayN}`}
                </span>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>
                  Start 12 Oktober 2026 • {TOTAL_DAYS} Hari Transformasi Brutal
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span 
                className="text-glow-blue" 
                style={{ fontSize: 24, fontWeight: 900, color: 'var(--cyan)', letterSpacing: '-0.02em' }}
              >
                {pct}%
              </span>
            </div>
          </div>

          <ProgressBar cur={dayN} tot={TOTAL_DAYS} cls="r" />

          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Tenggat Waktu: <b style={{ color: '#fff' }}>31 Desember 2026 (Akhir Tahun 2026)</b></span>
            <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>
              Tersisa <b className="text-glow-blue" style={{ color: '#fff' }}>{Math.max(0, TOTAL_DAYS - dayN)}</b> Hari Lagi
            </span>
          </div>
        </div>

        <DashboardCalendar dayN={dayN} total={TOTAL_DAYS} habitLog={safeHL} />
      </div>

      {/* Habits & Fitness Grid */}
      <div className="grid2">
        {/* Habits Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between">
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                DAILY ACTIVITY PROTOCOL
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>
                Habits Hari Ini ({dayName})
              </div>
            </div>
            <span style={{ fontSize: 13, color: 'var(--cyan)', fontWeight: 800 }}>
              {habitDone}/{HABITS.length} Selesai
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {HABITS.map(h => {
              const done = !!todayHabits[h.id];
              const streak = calculateHabitStreak(h.id, safeHL);
              return (
                <div key={h.id} className={`habit-card${done ? ' done' : ''}`} onClick={() => toggleH(h.id)}>
                  <div className="habit-check">{done && <Icon name="check" size={13} />}</div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: done ? 'var(--text3)' : 'var(--text)', flex: 1 }}>
                    <span style={{ color: done ? 'var(--green)' : 'var(--blue-hover)' }}>
                      <Icon name={h.iconName} size={16} />
                    </span> 
                    {h.label}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 8,
                      background: streak > 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: streak > 0 ? 'var(--cyan)' : 'var(--text3)',
                      border: `1px solid ${streak > 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      boxShadow: streak > 0 ? '0 0 10px rgba(56, 189, 248, 0.2)' : 'none'
                    }}
                    title={`Streak: ${streak} hari berturut-turut`}
                  >
                    <Icon name="flame" size={12} style={{ color: streak > 0 ? 'var(--cyan)' : 'var(--text3)' }} />
                    <span>{streak} Hari</span>
                  </div>
                </div>
              );
            })}
          </div>
          <ProgressBar cur={habitDone} tot={HABITS.length} cls="g" />
        </div>

        {/* Workout Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {ws.type || 'REST DAY'}
                </div>
                {(ws.location === 'Gym' || ws.type?.includes('Gym')) && (
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 6, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 800, border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    🏋️ GYM
                  </span>
                )}
                {(ws.location === 'Home' || ws.type?.includes('Home')) && (
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 800, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    🏠 HOME
                  </span>
                )}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>
                {dayName} — {ws.focus}
              </div>
              {ws.targetTime && (
                <div style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 700, marginTop: 3 }}>
                  ⏱️ {ws.targetTime}
                </div>
              )}
            </div>
            <span style={{ fontSize: 13, color: 'var(--purple-light)', fontWeight: 800 }}>
              {fp.done}/{fp.total} Gerakan
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, maxHeight: 340, overflowY: 'auto', paddingRight: 2 }}>
            {priEx.map((ex, i) => {
              const done = isExDone(ex);
              return (
                <div key={i} className={`ex-card${done ? ' done' : ''}`} onClick={() => toggleEx(ex)}>
                  <div className="ex-num">{done ? <Icon name="check" size={13} /> : i + 1}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="ex-title">{ex.name}</div>
                    <div className="ex-meta">{ex.detail} — {ex.target}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <ProgressBar cur={fp.done} tot={fp.total} cls="purple" />
        </div>
      </div>

      {/* Deep Work & Study Focus Card (Deep Purple & Blue Glass Theme) */}
      <div 
        className="card card-purple glow-card-purple" 
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div className="between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--purple-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              DEEP WORK & STUDY — DAY {dayN} PROTOCOL
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
              {todaySched.type} <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>— {todaySched.focus}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--purple-light)', fontWeight: 800 }}>
              {todayStudyDone}/{todayTasks.length} Misi Selesai
            </span>
            <button
              onClick={() => setTab('toefl')}
              className="btn btn-purple"
              style={{ fontSize: 12, padding: '7px 16px', fontWeight: 800 }}
            >
              Deep Work & Study →
            </button>
          </div>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text2)', padding: '12px 0' }}>
            Hari santai / istirahat. Evaluasi dan review materi mandiri.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {todayTasks.map((t, i) => {
              const done = isStudyTaskDone(dayName, t.name);
              return (
                <div
                  key={i}
                  className={`ex-card${done ? ' done' : ''}`}
                  style={{ cursor: 'pointer', background: 'rgba(27, 17, 61, 0.7)' }}
                  onClick={() => toggleStudyTask(dayName, t.name)}
                >
                  <div className="ex-num" style={{ borderColor: done ? 'var(--green)' : 'var(--purple)', color: done ? 'var(--green)' : 'var(--purple-light)' }}>
                    {done ? <Icon name="check" size={13} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-title" style={{ color: done ? 'var(--text3)' : '#ffffff', textDecoration: done ? 'line-through' : 'none' }}>
                      {t.name}
                    </div>
                    <div className="ex-meta" style={{ color: 'var(--text2)' }}>{t.detail}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: done ? 'var(--green)' : 'var(--purple-light)',
                      background: 'rgba(18, 11, 41, 0.8)',
                      padding: '4px 8px',
                      borderRadius: 8,
                      border: '1px solid rgba(139, 92, 246, 0.3)',
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

        <div className="between" style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid rgba(139, 92, 246, 0.2)', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500 }}>
            Benchmark Standar: <b style={{ color: '#fff' }}>Fokus ≥ 65</b> · <b style={{ color: '#fff' }}>Logika ≥ 80</b> · <b style={{ color: '#fff' }}>Eksekusi ≥ 166</b> (Total target: <b style={{ color: 'var(--cyan)' }}>450+</b>)
          </span>
          <span style={{ fontSize: 12, color: 'var(--purple-light)', fontWeight: 800 }}>
            Penguasaan Modul: {Math.round((toeflDone / Math.max(allToeflLength, 1)) * 100)}% ({toeflDone}/{allToeflLength} Modul)
          </span>
        </div>
      </div>

      {/* Performance Benchmark Trend Chart */}
      <CpnsScoreTrendChart
        tryouts={tryouts}
        onAddTryout={onAddTryout}
        onNavigateToCockpit={() => setTab('toefl')}
      />

      {/* Diary Card */}
      {lastEntry && (
        <div 
          className="card card-p" 
          style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(9, 16, 36, 0.8) 0%, rgba(20, 14, 42, 0.8) 100%)' }} 
          onClick={() => setTab('diary')}
        >
          <div className="between" style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              ENTRI DIARY TERAKHIR
            </span>
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
