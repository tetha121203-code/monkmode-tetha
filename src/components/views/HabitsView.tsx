import React, { useState } from 'react';
import { HABITS, PROGRAM_START_DATE } from '../../data/defaults';
import { HabitLog } from '../../types';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { calculateHabitStreak, calculateHabit30DayRate, toDateKey } from '../../utils/streak';

interface HabitsViewProps {
  habitLog: HabitLog;
  setHabitLog: React.Dispatch<React.SetStateAction<HabitLog>>;
  today: Date;
  dateKey: string;
  fmtDate: string;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habitLog,
  setHabitLog,
  today,
  dateKey,
  fmtDate
}) => {
  const [view, setView] = useState<'today' | 'calendar' | 'chart'>('today');
  const [selHabit, setSelHabit] = useState<string>('coding');
  const [calMonth, setCalMonth] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selDate, setSelDate] = useState<Date>(() => {
    const [y, m, d] = dateKey.split('-').map(Number);
    return new Date(y, m - 1, d);
  });

  const toKey = (d: Date) => toDateKey(d);

  const stripDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayKey = toKey(today);
  const selDateKey = toKey(selDate);
  const isSelToday = selDateKey === todayKey;
  const fmtSelDate = selDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const canGoPrev = stripDay(selDate) > stripDay(PROGRAM_START_DATE);
  const canGoNext = stripDay(selDate) < stripDay(today);

  const goPrevDay = () => {
    if (!canGoPrev) return;
    const d = new Date(selDate);
    d.setDate(d.getDate() - 1);
    setSelDate(d);
  };

  const goNextDay = () => {
    if (!canGoNext) return;
    const d = new Date(selDate);
    d.setDate(d.getDate() + 1);
    setSelDate(d);
  };

  const goToday = () => setSelDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));

  const openDayChecklist = (y: number, m: number, d: number) => {
    const target = new Date(y, m, d);
    if (stripDay(target) > stripDay(today)) return;
    setSelDate(target);
    setView('today');
  };

  const safeLog = habitLog || {};
  const selDayData = safeLog[selDateKey] || {};
  const doneSelCount = HABITS.filter(h => selDayData[h.id]).length;

  const toggleH = (id: string) => {
    setHabitLog(p => {
      const s = p || {};
      const d = s[selDateKey] || {};
      return { ...s, [selDateKey]: { ...d, [id]: !d[id] } };
    });
  };

  const getStreak = (hid: string) => calculateHabitStreak(hid, safeLog, today);
  const getRate = (hid: string, days = 30) => calculateHabit30DayRate(hid, safeLog, today, days);

  const activeHabit = HABITS.find(h => h.id === selHabit) || HABITS[0];

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Daily Activity
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>
            {fmtSelDate} — {doneSelCount}/{HABITS.length} selesai{isSelToday ? ' hari ini' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {[
            { id: 'today', l: 'Hari Ini' },
            { id: 'calendar', l: 'Kalender' },
            { id: 'chart', l: 'Grafik' }
          ].map((v, vi) => (
            <button
              key={v.id}
              onClick={() => setView(v.id as any)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRight: vi < 2 ? '1px solid var(--border)' : 'none',
                background: view === v.id ? 'var(--blue-dim)' : 'transparent',
                color: view === v.id ? 'var(--blue-hover)' : 'var(--text2)',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {v.l}
            </button>
          ))}
        </div>
      </div>

      {view === 'today' && (
        <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="date-nav-bar">
            <div className="date-box-wrap">
              <button className="date-box-btn" onClick={goPrevDay} disabled={!canGoPrev} title="Hari sebelumnya">
                <Icon name="chL" size={16} />
              </button>
              <div className="date-val-text">{fmtSelDate}</div>
              <button className="date-box-btn" onClick={goNextDay} disabled={!canGoNext} title="Hari berikutnya">
                <Icon name="chR" size={16} />
              </button>
            </div>
            {isSelToday ? (
              <span className="tag tag-blue">Hari Ini</span>
            ) : (
              <button className="date-today-btn" onClick={goToday}>
                <Icon name="cal" size={12} /> Hari Ini
              </button>
            )}
          </div>

          <div className="card card-p">
            <div className="between" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                {isSelToday ? 'Checklist Hari Ini' : 'Checklist'}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{doneSelCount}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 700 }}>/ {HABITS.length}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {HABITS.map(h => {
                const done = !!selDayData[h.id];
                const streak = getStreak(h.id);
                const rate = getRate(h.id);
                return (
                  <div
                    key={h.id}
                    className={`habit-card${done ? ' done' : ''}`}
                    onClick={() => toggleH(h.id)}
                    style={{ borderColor: done ? h.color + '40' : 'var(--border)', padding: '16px' }}
                  >
                    <div className="habit-check" style={{ borderColor: done ? h.color : 'var(--text3)', width: 26, height: 26 }}>
                      {done && <Icon name="check" size={14} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 800, color: done ? h.color : '#ffffff' }}>
                          <span style={{ color: done ? h.color : 'var(--text2)' }}>
                            <Icon name={h.iconName} size={18} />
                          </span>{' '}
                          {h.label}
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '4px 10px',
                            borderRadius: 8,
                            background: streak > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            color: streak > 0 ? '#f59e0b' : '#64748b',
                            border: `1px solid ${streak > 0 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                            fontSize: 12,
                            fontWeight: 800
                          }}
                        >
                          <Icon name="flame" size={14} style={{ color: streak > 0 ? '#f59e0b' : '#64748b' }} />
                          <span>{streak} Hari Consecutive Streak</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6, fontWeight: 600 }}>
                        {rate}% konsistensi 30 hari
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <ProgressBar cur={doneSelCount} tot={HABITS.length} cls="g" />
            {doneSelCount === HABITS.length && (
              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--green)', fontWeight: 700 }}>
                Semua Target Selesai{isSelToday ? ' Hari Ini' : ''}!
              </div>
            )}
          </div>

          <div className="grid2">
            {HABITS.map(h => {
              const streak = getStreak(h.id);
              const rate = getRate(h.id);
              return (
                <div
                  key={h.id}
                  className="card card-p"
                  style={{
                    cursor: 'pointer',
                    borderColor: selDayData[h.id] ? h.color + '40' : 'var(--border)',
                    background: selDayData[h.id] ? h.color + '0a' : 'var(--surface)'
                  }}
                  onClick={() => {
                    setSelHabit(h.id);
                    setView('calendar');
                  }}
                >
                  <div style={{ fontSize: 26, marginBottom: 10, color: h.color }}>
                    <Icon name={h.iconName} size={22} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{h.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, fontWeight: 600 }}>
                    Streak: <b style={{ color: h.color }}>{streak} hari</b>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface-solid)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${rate}%`, background: h.color, borderRadius: 99 }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, fontWeight: 700 }}>{rate}% dalam 30 hari</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {HABITS.map(h => (
              <button
                key={h.id}
                onClick={() => setSelHabit(h.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 12,
                  border: `1px solid ${selHabit === h.id ? h.color + '50' : 'var(--border)'}`,
                  background: selHabit === h.id ? h.color + '15' : 'var(--surface)',
                  color: selHabit === h.id ? h.color : 'var(--text2)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
              >
                <Icon name={h.iconName} size={16} /> {h.label}
              </button>
            ))}
          </div>

          <div className="date-nav-bar" style={{ width: '100%' }}>
            <div className="date-box-wrap">
              <button
                className="date-box-btn"
                onClick={() => setCalMonth(p => { const d = new Date(p.y, p.m - 1, 1); return { y: d.getFullYear(), m: d.getMonth() }; })}
                title="Bulan sebelumnya"
              >
                <Icon name="chL" size={16} />
              </button>
              <div className="date-val-text">
                {new Date(calMonth.y, calMonth.m, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </div>
              <button
                className="date-box-btn"
                onClick={() => setCalMonth(p => { const d = new Date(p.y, p.m + 1, 1); return { y: d.getFullYear(), m: d.getMonth() }; })}
                title="Bulan berikutnya"
              >
                <Icon name="chR" size={16} />
              </button>
            </div>
            <button
              className="date-today-btn"
              onClick={() => setCalMonth({ y: today.getFullYear(), m: today.getMonth() })}
            >
              <Icon name="cal" size={12} /> Hari Ini
            </button>
          </div>

          {activeHabit && (() => {
            const { y, m } = calMonth;
            const firstDay = new Date(y, m, 1).getDay();
            const daysInMonth = new Date(y, m + 1, 0).getDate();
            const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            const cells: (number | null)[] = [];
            for (let i = 0; i < firstDay; i++) cells.push(null);
            for (let d = 1; d <= daysInMonth; d++) cells.push(d);

            const doneCount = cells.filter(d => {
              if (!d) return false;
              return !!safeLog[toKey(new Date(y, m, d))]?.[activeHabit.id];
            }).length;

            return (
              <div className="card">
                <div className="between" style={{ marginBottom: 20 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>
                      <span style={{ color: activeHabit.color }}><Icon name={activeHabit.iconName} size={20} /></span> {activeHabit.label}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6, fontWeight: 600 }}>
                      {doneCount} hari selesai bulan ini · Streak: {getStreak(activeHabit.id)} hari
                    </div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: activeHabit.color }}>
                    {getRate(activeHabit.id, daysInMonth)}%
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12, fontWeight: 600 }}>
                  Klik tanggal untuk buka checklist hari tersebut
                </div>

                <div className="cal-grid" style={{ marginBottom: 8 }}>
                  {dayLabels.map(d => <div key={d} className="cal-day-label">{d}</div>)}
                </div>

                <div className="cal-grid">
                  {cells.map((d, i) => {
                    if (d === null) return <div key={`e${i}`} className="cal-cell empty" />;
                    const dateStr = toKey(new Date(y, m, d));
                    const isFuture = stripDay(new Date(y, m, d)) > stripDay(today);
                    const isDone = !!safeLog[dateStr]?.[activeHabit.id];
                    const isToday = dateStr === todayKey;
                    const isSel = dateStr === selDateKey;

                    return (
                      <div
                        key={d}
                        className={`cal-cell${isSel ? ' sel-day' : ''}`}
                        style={{
                          background: isFuture ? 'var(--surface2)' : isDone ? activeHabit.color + '20' : 'var(--surface)',
                          color: isFuture ? 'var(--text3)' : isDone ? activeHabit.color : 'var(--text2)',
                          outline: isToday ? `2px solid ${activeHabit.color}` : 'none',
                          outlineOffset: -2,
                          borderColor: isDone ? activeHabit.color + '50' : 'var(--border)',
                          cursor: isFuture ? 'default' : 'pointer',
                          opacity: isFuture ? 0.5 : 1
                        }}
                        title={isFuture ? dateStr : `${dateStr} — klik untuk checklist`}
                        onClick={() => !isFuture && openDayChecklist(y, m, d)}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {view === 'chart' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
              Tingkat Konsistensi (30 Hari)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {HABITS.map(h => {
                const rate = getRate(h.id);
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 32, textAlign: 'center', fontSize: 20, flexShrink: 0, color: h.color }}>
                      <Icon name={h.iconName} size={20} />
                    </div>
                    <div style={{ width: 120, fontSize: 13, color: 'var(--text)', fontWeight: 700, flexShrink: 0 }}>
                      {h.label}
                    </div>
                    <div style={{ flex: 1, height: 24, background: 'var(--surface-solid)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <div style={{ width: `${rate}%`, height: '100%', background: h.color, borderRadius: 8, opacity: 0.9 }} />
                    </div>
                    <div style={{ width: 50, fontSize: 15, fontWeight: 800, color: h.color, flexShrink: 0, textAlign: 'right' }}>
                      {rate}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
