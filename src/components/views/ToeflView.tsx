import React, { useState } from 'react';
import { DAYS } from '../../data/defaults';
import { ToeflDailyProgress, ToeflPhase, ToeflProgress, ToeflSchedule } from '../../types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { ProgressBar } from '../ProgressBar';

interface ToeflViewProps {
  safeToefl: ToeflPhase[];
  safeToeflProg: ToeflProgress;
  toggleToeflProg: (id: string) => void;
  toeflPhase: string | null;
  setToeflPhase: (id: string | null) => void;
  toeflSched: ToeflSchedule;
  setToeflSched: React.Dispatch<React.SetStateAction<ToeflSchedule>>;
  toeflDaily: ToeflDailyProgress;
  setToeflDaily: React.Dispatch<React.SetStateAction<ToeflDailyProgress>>;
  dayName: string;
  dateKey: string;
  setSettTab: (tab: string) => void;
  setSettOpen: (open: boolean) => void;
}

export const ToeflView: React.FC<ToeflViewProps> = ({
  safeToefl,
  safeToeflProg,
  toggleToeflProg,
  toeflPhase,
  setToeflPhase,
  toeflSched,
  setToeflSched,
  toeflDaily,
  setToeflDaily,
  dayName,
  dateKey,
  setSettTab,
  setSettOpen,
}) => {
  const [view, setView] = useState<'today' | 'weekly' | 'roadmap'>('today');
  const [selDay, setSelDay] = useState<string>(dayName);

  const activeRoadmap = safeToefl.find(p => p.id === toeflPhase);
  const totalAllRoadmap = safeToefl.reduce((a, p) => a + (p.items || []).length, 0);
  const totalDoneRoadmap = Object.keys(safeToeflProg).filter(k => safeToeflProg[k]).length;

  const dailyKeyFor = (day: string, taskName: string) => `${dateKey}-toefl-${day}-${taskName}`;
  const isTaskDone = (day: string, taskName: string) => !!toeflDaily[dailyKeyFor(day, taskName)];

  const toggleTask = (day: string, taskName: string) =>
    setToeflDaily(p => {
      const s = p || {};
      const k = dailyKeyFor(day, taskName);
      return { ...s, [k]: !s[k] };
    });

  const todaySched = toeflSched[dayName] || { type: 'Rest', focus: '-', tasks: [] };
  const todayTasks = todaySched.tasks || [];
  const todayDone = todayTasks.filter(t => isTaskDone(dayName, t.name)).length;

  const viewSched = toeflSched[view === 'today' ? dayName : selDay] || { type: 'Rest', focus: '-', tasks: [] };
  const viewTasks = viewSched.tasks || [];

  return (
    <div className="fade-up">
      <div className="between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            TOEFL iBT Preparation
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>Dominasi Bahasa Inggris Akademik</div>
        </div>

        <div style={{ display: 'flex', gap: 0, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {[
            { id: 'today', l: 'Hari Ini' },
            { id: 'weekly', l: 'Mingguan' },
            { id: 'roadmap', l: 'Syllabus' }
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          <div className="card card-p">
            <div className="between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {dayName} — Jadwal TOEFL
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--purple)' }}>{todaySched.type}</div>
                <div style={{ fontSize: 14, color: 'var(--text)', marginTop: 4, fontWeight: 500 }}>
                  Fokus: {todaySched.focus}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{todayDone}</div>
                <div style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 700 }}>/ {todayTasks.length}</div>
              </div>
            </div>
            <ProgressBar cur={todayDone} tot={todayTasks.length} cls="p" />
          </div>

          <div className="sep">
            <div className="sep-line" />
            <div className="sep-label" style={{ color: 'var(--purple)' }}>Misi Hari Ini</div>
            <div className="sep-line" />
          </div>

          {todayTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {todayTasks.map((t, i) => {
                const done = isTaskDone(dayName, t.name);
                return (
                  <div
                    key={i}
                    className={`ex-card${done ? ' done' : ''}`}
                    style={{ borderLeftColor: 'var(--purple)' }}
                    onClick={() => toggleTask(dayName, t.name)}
                  >
                    <div className="ex-num" style={{ borderColor: done ? 'var(--green)' : 'var(--purple)', color: done ? 'var(--green)' : 'var(--purple)' }}>
                      {done ? <Icon name="check" size={14} /> : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ex-title" style={{ color: done ? 'var(--text3)' : 'var(--text)' }}>{t.name}</div>
                      <div className="ex-meta">{t.detail}</div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: done ? 'var(--green)' : 'var(--purple)',
                        background: 'var(--surface)',
                        padding: '6px 10px',
                        borderRadius: 8,
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
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', fontWeight: 600 }}>
              Tidak ada jadwal untuk hari ini. Disiplin adalah kunci.
            </div>
          )}
        </div>
      )}

      {view === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          <div className="between">
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
              {DAYS.map(d => (
                <button
                  key={d}
                  className={`day-btn${selDay === d ? ' on' : ''}`}
                  onClick={() => setSelDay(d)}
                  style={{ flexShrink: 0, minWidth: 80 }}
                >
                  {d} {d === dayName && <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />}
                </button>
              ))}
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setSettTab('toefl');
                setSettOpen(true);
              }}
            >
              <Icon name="settings" /> Kelola Jadwal
            </button>
          </div>

          <div className="card">
            <div className="between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--purple)', marginBottom: 4 }}>
                  {selDay} — {viewSched.type}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>Fokus: {viewSched.focus}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {selDay === dayName && <span className="tag tag-green">Hari Ini</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {viewTasks.map((t, i) => (
                <div key={i} className={`ex-card${isTaskDone(selDay, t.name) ? ' done' : ''}`} style={{ borderLeftColor: 'var(--purple)', cursor: 'default' }}>
                  <div className="ex-num" style={{ borderColor: isTaskDone(selDay, t.name) ? 'var(--green)' : 'var(--purple)', color: isTaskDone(selDay, t.name) ? 'var(--green)' : 'var(--purple)' }}>
                    {isTaskDone(selDay, t.name) ? <Icon name="check" size={14} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-title">{t.name}</div>
                    <div className="ex-meta">{t.detail}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text2)', background: 'var(--surface)', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)' }}>
                    {t.time}
                  </div>
                </div>
              ))}
              {viewTasks.length === 0 && (
                <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', padding: '20px' }}>
                  Tidak ada tugas yang dijadwalkan.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === 'roadmap' && (
        <>
          <div className="card card-p" style={{ marginBottom: 24 }}>
            <div className="between" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase' }}>
                Penguasaan Syllabus Total
              </span>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--purple)' }}>
                {Math.round((totalDoneRoadmap / Math.max(totalAllRoadmap, 1)) * 100)}%
              </span>
            </div>
            <ProgressBar cur={totalDoneRoadmap} tot={totalAllRoadmap} cls="p" />
          </div>

          <div className="grid2">
            {safeToefl.map((p, idx) => {
              const all = (p.items || []).map(i => i.id);
              const done = all.filter(id => safeToeflProg[id]).length;
              const pct = Math.round((done / (all.length || 1)) * 100);
              return (
                <div key={p.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setToeflPhase(p.id)}>
                  <div className="between" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: `${p.color || '#8b5cf6'}15`,
                          border: `1px solid ${p.color || '#8b5cf6'}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          fontWeight: 800,
                          color: p.color || '#8b5cf6',
                          flexShrink: 0
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{p.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 600 }}>
                          Week {p.week} · {all.length} materi
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 800, color: pct === 100 ? 'var(--green)' : 'var(--text3)' }}>
                      {pct}%
                    </span>
                  </div>
                  <ProgressBar cur={done} tot={all.length} cls={p.color === '#8b5cf6' ? 'p' : ''} />
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 12, fontWeight: 500 }}>
                    {done}/{all.length} — {p.desc}
                  </div>
                </div>
              );
            })}
          </div>

          <Modal open={!!activeRoadmap} onClose={() => setToeflPhase(null)} title={activeRoadmap?.title || ''} wide>
            {activeRoadmap && (() => {
              const pitems = activeRoadmap.items || [];
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, fontWeight: 500 }}>{activeRoadmap.desc}</p>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                      Checklist Materi ({pitems.filter(i => safeToeflProg[i.id]).length}/{pitems.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
                      {pitems.map((it, i) => {
                        const done = safeToeflProg[it.id];
                        return (
                          <div
                            key={it.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '12px 16px',
                              borderRadius: 10,
                              border: `1px solid ${done ? 'var(--blue-border)' : 'var(--border)'}`,
                              background: done ? 'var(--blue-dim)' : 'var(--surface2)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => toggleToeflProg(it.id)}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 6,
                                border: `2px solid ${done ? 'var(--blue)' : 'var(--text3)'}`,
                                background: done ? 'var(--blue)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {done && <Icon name="check" size={12} style={{ color: 'white' }} />}
                            </div>
                            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
                              {i + 1}. {it.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </Modal>
        </>
      )}
    </div>
  );
};
