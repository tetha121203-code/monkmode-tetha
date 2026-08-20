import React, { useState, useEffect } from 'react';
import { DAYS, DEFAULT_TOEFL_SCHEDULE } from '../../data/defaults';
import { ToeflDailyProgress, ToeflPhase, ToeflProgress, ToeflSchedule, TryoutRecord } from '../../types';
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
  tryoutHistory?: TryoutRecord[];
  setTryoutHistory?: React.Dispatch<React.SetStateAction<TryoutRecord[]>>;
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
  tryoutHistory = [],
  setTryoutHistory,
}) => {
  const [view, setView] = useState<'today' | 'roadmap' | 'cheatsheet' | 'tryout' | 'weekly'>('today');
  const [selDay, setSelDay] = useState<string>(dayName);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCheatTab, setActiveCheatTab] = useState<'passing_grade' | 'uud' | 'pancasila' | 'tiu_formula' | 'tkp_mindset'>('passing_grade');
  const [showDoctrines, setShowDoctrines] = useState<boolean>(false);

  // Daily Questions Conquered Tracker
  const [drillCount, setDrillCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`cpns_drill_count_${dateKey}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const DAILY_DRILL_GOAL = 60; // 60 questions/day extreme quota

  const addDrills = (amount: number) => {
    const nextVal = Math.max(0, drillCount + amount);
    setDrillCount(nextVal);
    try {
      localStorage.setItem(`cpns_drill_count_${dateKey}`, nextVal.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const resetDrills = () => {
    setDrillCount(0);
    try {
      localStorage.setItem(`cpns_drill_count_${dateKey}`, '0');
    } catch (e) {
      console.error(e);
    }
  };

  // Focus Timer for Study
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  const toggleExpandPhase = (phaseId: string) => {
    setExpandedPhases(p => ({ ...p, [phaseId]: !p[phaseId] }));
  };

  const expandAllPhases = () => {
    const all: Record<string, boolean> = {};
    safeToefl.forEach(p => { all[p.id] = true; });
    setExpandedPhases(all);
  };

  const collapseAllPhases = () => {
    setExpandedPhases({});
  };

  const handleApplyExtremeProtocol = () => {
    if (window.confirm('Terapkan template Protokol Ekstrem SKD 450+ ke seluruh hari dalam jadwal?')) {
      setToeflSched(DEFAULT_TOEFL_SCHEDULE);
      alert('Protokol Ekstrem SKD (Target 450+) berhasil diterapkan!');
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const resetTimer = (mins: number) => {
    setTimerRunning(false);
    setTimerSeconds(mins * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Tryout Form State
  const [toName, setToName] = useState('Tryout SKD Mandiri #1');
  const [toTwk, setToTwk] = useState<number>(85);
  const [toTiu, setToTiu] = useState<number>(115);
  const [toTkp, setToTkp] = useState<number>(185);
  const [toNotes, setToNotes] = useState('');

  const [localTryouts, setLocalTryouts] = useState<TryoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('monk_mode_cpns_tryouts');
      return saved ? JSON.parse(saved) : [
        { id: 'to_init_1', name: 'Simulasi Mandiri #1', date: '2026-08-10', twk: 75, tiu: 95, tkp: 172, notes: 'TWK perlu review pasal UUD 1945, TIU perlu percepat deret angka.' }
      ];
    } catch {
      return [];
    }
  });

  const activeTryouts = tryoutHistory.length > 0 ? tryoutHistory : localTryouts;

  const handleAddTryout = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TryoutRecord = {
      id: `to_${Date.now()}`,
      name: toName.trim() || 'Tryout SKD',
      date: dateKey,
      twk: Number(toTwk) || 0,
      tiu: Number(toTiu) || 0,
      tkp: Number(toTkp) || 0,
      notes: toNotes.trim()
    };

    const updated = [newRecord, ...activeTryouts];
    if (setTryoutHistory) {
      setTryoutHistory(updated);
    } else {
      setLocalTryouts(updated);
      localStorage.setItem('monk_mode_cpns_tryouts', JSON.stringify(updated));
    }
    setToName(`Tryout SKD Mandiri #${activeTryouts.length + 2}`);
    setToNotes('');
  };

  const handleDeleteTryout = (id: string) => {
    const updated = activeTryouts.filter(t => t.id !== id);
    if (setTryoutHistory) {
      setTryoutHistory(updated);
    } else {
      setLocalTryouts(updated);
      localStorage.setItem('monk_mode_cpns_tryouts', JSON.stringify(updated));
    }
  };

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

  const filteredPhases = safeToefl.filter(phase => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchTitle = phase.title.toLowerCase().includes(q);
    const matchDesc = phase.desc.toLowerCase().includes(q);
    const matchItem = (phase.items || []).some(i => i.title.toLowerCase().includes(q));
    return matchTitle || matchDesc || matchItem;
  });

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Top Header & Extreme Badge with Neon Glow */}
      <div className="between" style={{ flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.18)',
                color: 'var(--red-hover)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                boxShadow: '0 0 16px rgba(239, 68, 68, 0.3)',
                letterSpacing: '0.04em'
              }}
            >
              🔥 MONK MODE: TARGET EKSTREM 450+
            </span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>Zona Ranking 1 Formasi Nasional</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 3, textShadow: '0 0 14px rgba(255,255,255,0.2)' }}>
            Protokol Belajar SKD CPNS 2026
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
            Mastery TWK (110+), TIU Speed (<span style={{ color: 'var(--blue-hover)', fontWeight: 700, textShadow: '0 0 8px rgba(96, 165, 250, 0.4)' }}>150+</span>), & TKP Mindset 5 (<span style={{ color: 'var(--green-hover)', fontWeight: 700, textShadow: '0 0 8px rgba(52, 211, 153, 0.4)' }}>210+</span>)
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tab-bar">
          {[
            { id: 'today', l: 'Target Hari Ini' },
            { id: 'roadmap', l: 'Silabus SKD' },
            { id: 'cheatsheet', l: 'Rumus & Materi' },
            { id: 'tryout', l: 'Tryout & Nilai' },
            { id: 'weekly', l: 'Jadwal Mingguan' }
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id as any)}
              className={`stab${view === v.id ? ' on' : ''}`}
            >
              {v.l}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW: TODAY */}
      {view === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 860, margin: '0 auto', width: '100%' }}>
          {/* Main Today Protocol Card */}
          <div className="card card-p" style={{ border: '1px solid var(--blue-border)', background: 'linear-gradient(135deg, var(--surface), var(--surface2))', boxShadow: '0 0 24px rgba(59, 130, 246, 0.16)' }}>
            <div className="between" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--red-hover)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="glow-dot red" />
                  {dayName} — PROTOKOL SKD EKSTREM
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#ffffff' }}>{todaySched.type}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3, fontWeight: 500 }}>
                  Fokus Misi: <span style={{ color: '#ffffff', fontWeight: 700 }}>{todaySched.focus}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '8px 18px', borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 0 16px rgba(59, 130, 246, 0.15)' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: todayDone === todayTasks.length && todayTasks.length > 0 ? 'var(--green-hover)' : 'var(--blue-hover)', lineHeight: 1, textShadow: '0 0 12px rgba(96, 165, 250, 0.4)' }}>
                  {todayDone}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, marginTop: 2 }}>/ {todayTasks.length} Misi Tuntas</div>
              </div>
            </div>
            <ProgressBar cur={todayDone} tot={todayTasks.length} cls="r" />
          </div>

          {/* Extreme Question Drill Counter */}
          <div className="card" style={{ border: '1px solid var(--blue-border)', background: 'var(--surface2)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.12)' }}>
            <div className="between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--blue-hover)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="glow-dot" />
                  KUOTA DRILL SOAL HARIAN (TARGET 50–80 SOAL/HARI)
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>
                  {drillCount} <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>/ {DAILY_DRILL_GOAL} Butir Soal Teruji Hari Ini</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => addDrills(5)}
                  className="btn btn-ghost"
                  style={{ padding: '6px 12px', fontSize: 12, fontWeight: 800 }}
                  title="Tambah 5 soal"
                >
                  +5 Soal
                </button>
                <button
                  onClick={() => addDrills(10)}
                  className="btn btn-ghost"
                  style={{ padding: '6px 12px', fontSize: 12, fontWeight: 800, color: 'var(--blue-hover)' }}
                  title="Tambah 10 soal"
                >
                  +10 Soal
                </button>
                <button
                  onClick={() => addDrills(25)}
                  className="btn btn-blue"
                  style={{ padding: '6px 14px', fontSize: 12, fontWeight: 800 }}
                  title="Tambah 25 soal sprint"
                >
                  +25 Sprint 🔥
                </button>
                {drillCount > 0 && (
                  <button
                    onClick={resetDrills}
                    className="btn btn-ghost"
                    style={{ padding: '6px 8px', fontSize: 11, color: 'var(--text3)' }}
                    title="Reset hitungan hari ini"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <ProgressBar cur={drillCount} tot={DAILY_DRILL_GOAL} cls={drillCount >= DAILY_DRILL_GOAL ? 'g' : 'r'} />
            <div className="between" style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
              <span>Status: {drillCount >= DAILY_DRILL_GOAL ? '👑 Monster CAT Kuota Tuntas!' : drillCount >= 25 ? '⚡ Hardcore Drilling Mode...' : '🎯 Pemanasan Awal'}</span>
              <span>{Math.round((drillCount / DAILY_DRILL_GOAL) * 100)}% Capaian Kuota</span>
            </div>
          </div>

          {/* Hardcore Deep Study Timer */}
          <div className="card" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <div className="between" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  Hardcore Focus Timer
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
                  Drill kecepatan tinggi dengan batasan waktu ketat
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: timerRunning ? 'var(--red)' : 'var(--text)', letterSpacing: '0.05em' }}>
                  {formatTime(timerSeconds)}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`btn ${timerRunning ? 'btn-red' : 'btn-blue'}`}
                    style={{ padding: '7px 16px', fontSize: 12, fontWeight: 700 }}
                  >
                    {timerRunning ? 'Pause' : 'Mulai Drill'}
                  </button>
                  <button
                    onClick={() => resetTimer(25)}
                    className="btn btn-ghost"
                    style={{ padding: '7px 10px', fontSize: 11 }}
                    title="25 menit sprint"
                  >
                    25m Sprint
                  </button>
                  <button
                    onClick={() => resetTimer(35)}
                    className="btn btn-ghost"
                    style={{ padding: '7px 10px', fontSize: 11 }}
                    title="35 menit drill TKP 45 soal"
                  >
                    35m TKP
                  </button>
                  <button
                    onClick={() => resetTimer(50)}
                    className="btn btn-ghost"
                    style={{ padding: '7px 10px', fontSize: 11 }}
                    title="50 menit speed sprint 65 soal"
                  >
                    50m Sprint
                  </button>
                  <button
                    onClick={() => resetTimer(100)}
                    className="btn btn-ghost"
                    style={{ padding: '7px 10px', fontSize: 11, color: 'var(--purple)' }}
                    title="100 menit Full CAT 110 soal standar BKN"
                  >
                    100m CAT
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="between" style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Misi Ekstrem Hari Ini ({todayDone}/{todayTasks.length})
              </div>
              <button
                onClick={handleApplyExtremeProtocol}
                className="btn btn-ghost"
                style={{ fontSize: 11, padding: '3px 8px', color: 'var(--blue-hover)' }}
                title="Terapkan Protokol Ekstrem SKD 450+"
              >
                ⚡ Reset Template Ekstrem
              </button>
            </div>

            {todayTasks.length > 0 ? (
              todayTasks.map((t, i) => {
                const done = isTaskDone(dayName, t.name);
                return (
                  <div
                    key={i}
                    className={`ex-card${done ? ' done' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleTask(dayName, t.name)}
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
                        fontSize: 11,
                        fontWeight: 800,
                        color: done ? 'var(--green)' : 'var(--blue)',
                        background: 'var(--surface)',
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                        flexShrink: 0
                      }}
                    >
                      {t.time}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text3)', fontSize: 13 }}>
                Tidak ada jadwal aktif. Klik "Reset Template Ekstrem" di atas untuk memuat protokol harian!
              </div>
            )}
          </div>

          {/* 5 Doktrin SKD Ekstrem (Expandable Accordion) */}
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div
              className="between"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowDoctrines(!showDoctrines)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>⚔️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    5 Doktrin SKD Ekstrem (Monk Mode CPNS)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                    Pedoman disiplin mutlak untuk menembus Ranking 1 Formasi
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>
                {showDoctrines ? 'Tutup ▲' : 'Buka Doktrin ▼'}
              </button>
            </div>

            {showDoctrines && (
              <div className="fade-up" style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                {[
                  { n: '1. Zero Tolerance Skip', d: 'Tidak ada hari tanpa drill minimal 50 butir soal SKD terukur.' },
                  { n: '2. Speed Constraint TIU (< 40s/soal)', d: 'Eliminasi coretan berlebih di numerik & kuasai pola silogisme negasi seketika.' },
                  { n: '3. TKP Skor 5 Mindset (Zero Tolerance ≤ 3)', d: 'Hanya terima opsi proaktif, solutif, integritas tinggi, & berorientasi pelayanan publik.' },
                  { n: '4. Bank Soal Error Re-drill', d: 'Setiap butir soal yang salah wajib diulang sampai meraih akurasi 100% tanpa cela.' },
                  { n: '5. Target Ranking 1 Nasional (Skor 450+)', d: 'Standar kita bukan sekadar lolos passing grade (311), melainkan skor overkill 450+ demi mengamankan selisih SKD saat SKB.' }
                ].map((doc, idx) => (
                  <div key={idx} style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{doc.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{doc.d}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Extreme Score Matrix vs Passing Grade */}
          <div className="card" style={{ marginTop: 4 }}>
            <div className="between" style={{ marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target Skor Ekstrem 450+ vs Passing Grade Resmi
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                  Perbandingan ambang batas minimum BKN vs Target Juara 1 Formasi
                </div>
              </div>
              <button onClick={() => setView('cheatsheet')} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}>
                Lihat Silabus & Rumus →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
                <div className="between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 800 }}>TWK (30 Soal)</span>
                  <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 800 }}>🔥 EKSTREM</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                  110–125 <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 150</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
                  Passing Grade Min: <b>65</b> (Target Benar 24–28 Soal)
                </div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
                <div className="between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--blue-hover)', fontWeight: 800 }}>TIU (35 Soal)</span>
                  <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 800 }}>🔥 EKSTREM</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                  150–165 <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 175</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
                  Passing Grade Min: <b>80</b> (Speed &lt; 40 dtk/soal)
                </div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
                <div className="between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 800 }}>TKP (45 Soal)</span>
                  <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 800 }}>🔥 EKSTREM</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                  210–220 <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 225</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
                  Passing Grade Min: <b>166</b> (Zero Opsi ≤ 3)
                </div>
              </div>

              <div style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
                <div className="between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--purple)', fontWeight: 900 }}>TOTAL SKD OVERKILL</span>
                  <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 900 }}>RANK #1</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--purple)', lineHeight: 1.1 }}>
                  450–480+ <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>
                  Ambang Batas BKN: <b>311</b> (Selisih +140 Poin)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ROADMAP / SILABUS */}
      {view === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Progress Header */}
          <div className="card card-p">
            <div className="between" style={{ marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                  Silabus Lengkap SKD CPNS
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                  Total Penguasaan Materi
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--blue-hover)' }}>
                {Math.round((totalDoneRoadmap / Math.max(totalAllRoadmap, 1)) * 100)}%
                <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 600, marginLeft: 6 }}>
                  ({totalDoneRoadmap}/{totalAllRoadmap} Modul)
                </span>
              </div>
            </div>
            <ProgressBar cur={totalDoneRoadmap} tot={totalAllRoadmap} cls="r" />
          </div>

          {/* Search & Actions Bar */}
          <div className="between" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1, minWidth: 260 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari materi SKD (Pancasila, Silogisme, Jarak & Kecepatan, Pelayanan Publik)..."
                className="inp"
                style={{ fontSize: 13 }}
              />
              {searchQuery && (
                <button className="btn btn-ghost" onClick={() => setSearchQuery('')} style={{ fontSize: 12, padding: '8px 14px' }}>
                  Reset
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-ghost"
                onClick={expandAllPhases}
                style={{ fontSize: 12, padding: '8px 12px' }}
                title="Buka seluruh rincian materi"
              >
                Buka Semua
              </button>
              <button
                className="btn btn-ghost"
                onClick={collapseAllPhases}
                style={{ fontSize: 12, padding: '8px 12px' }}
                title="Tutup seluruh rincian materi"
              >
                Tutup Semua
              </button>
            </div>
          </div>

          {/* Grid of Phases */}
          <div className="grid2">
            {filteredPhases.map((p, idx) => {
              const all = (p.items || []).map(i => i.id);
              const done = all.filter(id => safeToeflProg[id]).length;
              const pct = Math.round((done / Math.max(all.length, 1)) * 100);
              const isExpanded = !!expandedPhases[p.id];

              return (
                <div
                  key={p.id}
                  className="card"
                  style={{
                    transition: 'all 0.2s',
                    borderTop: '2px solid var(--blue)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                  }}
                >
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleExpandPhase(p.id)}
                  >
                    <div className="between" style={{ marginBottom: 12, alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: 'var(--blue-dim)',
                            border: '1px solid var(--blue-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 900,
                            color: 'var(--blue-hover)',
                            flexShrink: 0
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{p.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>
                            Week {p.week} · {all.length} materi
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 900, color: pct === 100 ? 'var(--green)' : 'var(--text3)' }}>
                        {pct}%
                      </span>
                    </div>

                    <ProgressBar cur={done} tot={all.length} cls={pct === 100 ? 'g' : 'r'} />
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 10, lineHeight: 1.5 }}>
                      {p.desc}
                    </div>
                  </div>

                  {/* Buttons for Toggle / Modal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)', fontSize: 12 }}>
                    <span style={{ color: 'var(--text3)', fontWeight: 600, fontSize: 11 }}>
                      {done}/{all.length} tuntas
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setToeflPhase(p.id);
                        }}
                      >
                        Pop-up ↗
                      </button>
                      <button
                        className="btn btn-blue"
                        style={{ fontSize: 11, padding: '5px 12px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandPhase(p.id);
                        }}
                      >
                        {isExpanded ? 'Tutup Checklist ▲' : 'Buka Checklist ▼'}
                      </button>
                    </div>
                  </div>

                  {/* Inline Expandable Checklist */}
                  {isExpanded && (
                    <div
                      className="fade-up"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        background: 'var(--surface2)',
                        padding: '12px',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        maxHeight: 320,
                        overflowY: 'auto'
                      }}
                    >
                      <div className="between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Checklist Materi ({done}/{all.length})
                        </span>
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 10, padding: '2px 8px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle all in this phase
                            const shouldMarkAll = done < all.length;
                            all.forEach(id => {
                              if (shouldMarkAll && !safeToeflProg[id]) toggleToeflProg(id);
                              if (!shouldMarkAll && safeToeflProg[id]) toggleToeflProg(id);
                            });
                          }}
                        >
                          {done === all.length ? 'Reset Phase' : 'Centang Semua'}
                        </button>
                      </div>

                      {(p.items || []).map((it, i) => {
                        const isDone = !!safeToeflProg[it.id];
                        return (
                          <div
                            key={it.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 10px',
                              borderRadius: 6,
                              background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface)',
                              border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleToeflProg(it.id);
                            }}
                          >
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                border: `1.5px solid ${isDone ? 'var(--green)' : 'var(--text3)'}`,
                                background: isDone ? 'var(--green)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {isDone && <Icon name="check" size={12} style={{ color: 'white' }} />}
                            </div>
                            <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: isDone ? 'var(--text3)' : 'var(--text)', textDecoration: isDone ? 'line-through' : 'none' }}>
                              {i + 1}. {it.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal for Phase Checklist */}
          <Modal open={!!activeRoadmap} onClose={() => setToeflPhase(null)} title={activeRoadmap?.title || ''} wide>
            {activeRoadmap && (() => {
              const pitems = activeRoadmap.items || [];
              const doneCount = pitems.filter(i => safeToeflProg[i.id]).length;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                      {activeRoadmap.desc}
                    </p>
                  </div>

                  <div>
                    <div className="between" style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Checklist Materi ({doneCount}/{pitems.length})
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--blue-hover)' }}>
                        {Math.round((doneCount / Math.max(pitems.length, 1)) * 100)}% Tuntas
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 380, overflowY: 'auto' }}>
                      {pitems.map((it, i) => {
                        const done = safeToeflProg[it.id];
                        return (
                          <div
                            key={it.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: '10px 14px',
                              borderRadius: 8,
                              border: `1px solid ${done ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                              background: done ? 'rgba(16, 185, 129, 0.06)' : 'var(--surface2)',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onClick={() => toggleToeflProg(it.id)}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                border: `1.5px solid ${done ? 'var(--green)' : 'var(--text3)'}`,
                                background: done ? 'var(--green)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              {done && <Icon name="check" size={12} style={{ color: 'white' }} />}
                            </div>
                            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: done ? 'var(--text3)' : 'var(--text)', textDecoration: done ? 'line-through' : 'none' }}>
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
        </div>
      )}

      {/* VIEW: CHEATSHEET & RUMUS CEPAT */}
      {view === 'cheatsheet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Sub Navigation */}
          <div className="tab-bar">
            {[
              { id: 'passing_grade', l: 'Passing Grade MenPAN-RB' },
              { id: 'uud', l: 'Ringkasan UUD 1945' },
              { id: 'pancasila', l: '45 Butir Pancasila' },
              { id: 'tiu_formula', l: 'Rumus Cepat TIU' },
              { id: 'tkp_mindset', l: 'Mindset Poin 5 TKP' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCheatTab(tab.id as any)}
                className={`stab${activeCheatTab === tab.id ? ' on' : ''}`}
              >
                {tab.l}
              </button>
            ))}
          </div>

          {/* Tab Content: PASSING GRADE */}
          {activeCheatTab === 'passing_grade' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                  Ketentuan Nilai Ambang Batas SKD CPNS 2026
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                  Berdasarkan standar Keputusan MenPAN-RB, pelamar harus melampaui Passing Grade di setiap sub-tes agar berhak masuk pemeringkatan (ranking) 3x formasi menuju tahap SKB.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                <div style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue)', marginBottom: 6 }}>
                    1. TWK (Tes Wawasan Kebangsaan)
                  </div>
                  <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
                    <li>Jumlah Soal: <b>30 Butir</b></li>
                    <li>Skor: Benar = <b>5</b>, Salah/Kosong = <b>0</b></li>
                    <li>Maksimal: <b>150</b></li>
                    <li><b>Passing Grade: 65</b> (Benar 13 soal)</li>
                    <li>Target Rekomendasi: <b>≥ 90</b></li>
                  </ul>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 6 }}>
                    2. TIU (Tes Inteligensia Umum)
                  </div>
                  <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
                    <li>Jumlah Soal: <b>35 Butir</b></li>
                    <li>Skor: Benar = <b>5</b>, Salah/Kosong = <b>0</b></li>
                    <li>Maksimal: <b>175</b></li>
                    <li><b>Passing Grade: 80</b> (Benar 16 soal)</li>
                    <li>Target Rekomendasi: <b>≥ 130</b></li>
                  </ul>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 6 }}>
                    3. TKP (Tes Karakteristik Pribadi)
                  </div>
                  <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
                    <li>Jumlah Soal: <b>45 Butir</b></li>
                    <li>Skor: Bertingkat <b>1 s/d 5</b> (Kosong = 0)</li>
                    <li>Maksimal: <b>225</b></li>
                    <li><b>Passing Grade: 166</b></li>
                    <li>Target Rekomendasi: <b>≥ 200</b></li>
                  </ul>
                </div>
              </div>

              <div style={{ background: 'var(--blue-dim)', padding: '14px 18px', borderRadius: 10, border: '1px solid var(--blue-border)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>
                  Strategi Lolos Ranking 3x Formasi:
                </div>
                <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>
                  Lolos passing grade saja belum cukup jika total nilai berada di ambang batas bawah. Targetkan total skor <b>≥ 400+</b> dengan memaksimalkan perolehan di <b>TKP (200+)</b> dan <b>TIU (130+)</b>.
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: UUD 1945 */}
          {activeCheatTab === 'uud' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  Ringkasan Pasal Kunci UUD NRI 1945
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Pasal-pasal yang paling sering keluar dalam Tes Wawasan Kebangsaan (TWK).
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                {[
                  { p: 'Pasal 1', desc: 'Ayat (1): Negara Kesatuan Republik. Ayat (2): Kedaulatan di tangan rakyat. Ayat (3): Negara Hukum.' },
                  { p: 'Pasal 2 & 3', desc: 'MPR: Terdiri atas DPR dan DPD. Wewenang: Mengubah/menetapkan UUD, melantik Presiden/Wapres, memberhentikan Presiden sesuai UUD.' },
                  { p: 'Pasal 4 s/d 16', desc: 'Presiden. Pasal 7: Masa jabatan 5 tahun, maks 2 periode. Pasal 11: Menyatakan perang/perjanjian (persetujuan DPR). Pasal 14: Grasi/Rehabilitasi (pertimbangan MA), Amnesti/Abolisi (pertimbangan DPR).' },
                  { p: 'Pasal 19 s/d 22B', desc: 'DPR: Fungsi Legislasi, Anggaran, Pengawasan. Hak: Interpelasi, Angket, Menyatakan Pendapat.' },
                  { p: 'Pasal 22C & 22D', desc: 'DPD: Dipilih melalui Pemilu per provinsi. Mengajukan RUU otonomi daerah, pemekaran.' },
                  { p: 'Pasal 23 s/d 23G', desc: 'BPK: Bebas dan mandiri memeriksa pengelolaan keuangan negara, melapor ke DPR, DPD, DPRD.' },
                  { p: 'Pasal 24 s/d 24C', desc: 'Peradilan: MA (kasasi & uji perundangan di bawah UU). MK (uji UU terhadap UUD, sengketa kewenangan, sengketa pemilu). KY (usul Hakim Agung).' },
                  { p: 'Pasal 27', desc: 'Ayat (1): Persamaan di dalam hukum. Ayat (2): Hak pekerjaan layak. Ayat (3): Hak & kewajiban membela negara.' },
                  { p: 'Pasal 28A s/d 28J', desc: 'Hak Asasi Manusia: Hak hidup (28A), berkeluarga (28B), mengembangkan diri (28C), kepastian hukum (28D), bebas beragama/berpendapat (28E).' },
                  { p: 'Pasal 30', desc: 'Sishankamrata: TNI/Polri kekuatan utama, rakyat kekuatan pendukung.' },
                  { p: 'Pasal 31', desc: 'Pendidikan: Pemerintah wajib membiayai pendidikan dasar. Anggaran min 20% APBN/APBD.' },
                  { p: 'Pasal 33 & 34', desc: 'Ekonomi & Sosial: Cabang produksi penting dikuasai negara (33). Fakir miskin dipelihara negara (34).' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 2 }}>{item.p}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: PANCASILA */}
          {activeCheatTab === 'pancasila' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  45 Butir Pengamalan Sila Pancasila (TAP MPR No. I/MPR/2003)
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Kunci menjawab soal analisis kasus dan pengamalan nilai dalam TWK.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  {
                    sila: 'Sila 1: Ketuhanan Yang Maha Esa (Bintang)',
                    items: [
                      'Percaya dan takwa kepada Tuhan YME sesuai agama dan kepercayaan masing-masing.',
                      'Hormat menghormati dan bekerjasama antar pemeluk agama yang berbeda.',
                      'Membina kerukunan hidup di antara sesama umat beragama.',
                      'Tidak memaksakan suatu agama atau kepercayaan kepada orang lain.'
                    ]
                  },
                  {
                    sila: 'Sila 2: Kemanusiaan Yang Adil dan Beradab (Rantai)',
                    items: [
                      'Mengakui dan memperlakukan manusia sesuai harkat dan martabatnya.',
                      'Mengakui persamaan derajat, hak, dan kewajiban tanpa membeda-bedakan suku/agama.',
                      'Mengembangkan sikap saling mencintai sesama manusia dan tenggang rasa.',
                      'Menjunjung tinggi nilai kemanusiaan dan berani membela kebenaran.'
                    ]
                  },
                  {
                    sila: 'Sila 3: Persatuan Indonesia (Pohon Beringin)',
                    items: [
                      'Menempatkan persatuan dan keselamatan bangsa di atas kepentingan pribadi/golongan.',
                      'Rela berkorban untuk kepentingan negara dan bangsa.',
                      'Mengembangkan rasa cinta kepada tanah air dan bangsa.',
                      'Memelihara ketertiban dunia berdasarkan kemerdekaan dan keadilan sosial.'
                    ]
                  },
                  {
                    sila: 'Sila 4: Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan... (Kepala Banteng)',
                    items: [
                      'Sebagai warga negara, mempunyai kedudukan, hak, dan kewajiban yang sama.',
                      'Tidak boleh memaksakan kehendak kepada orang lain.',
                      'Mengutamakan musyawarah dalam mengambil keputusan untuk kepentingan bersama.',
                      'Menerima dan melaksanakan hasil keputusan musyawarah dengan iktikad baik.'
                    ]
                  },
                  {
                    sila: 'Sila 5: Keadilan Sosial bagi Seluruh Rakyat Indonesia (Padi & Kapas)',
                    items: [
                      'Mengembangkan perbuatan luhur yang mencerminkan kekeluargaan dan gotong royong.',
                      'Mengembangkan sikap adil terhadap sesama dan menjaga keseimbangan hak-kewajiban.',
                      'Suka memberi pertolongan kepada orang lain agar dapat berdiri sendiri.',
                      'Tidak menggunakan hak milik untuk gaya hidup mewah atau pemborosan.'
                    ]
                  }
                ].map((s, idx) => (
                  <div key={idx} style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 6 }}>{s.sila}</div>
                    <ul style={{ fontSize: 12, color: 'var(--text2)', paddingLeft: 16, margin: 0, lineHeight: 1.6 }}>
                      {s.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: RUMUS TIU */}
          {activeCheatTab === 'tiu_formula' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  Rumus Cepat TIU Numerik & Logika
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Gunakan trik cepat ini untuk menghemat waktu pengerjaan di bawah 50 detik per butir soal.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>1. Pekerja Bersama</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Jika A selesai dlm <b>x</b> hari, B dlm <b>y</b> hari:<br />
                    <code style={{ color: 'var(--blue-hover)', fontWeight: 700 }}>Waktu = (x × y) / (x + y)</code>
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>2. Berpapasan & Menyusul</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    • Waktu Berpapasan = <b>Jarak Total / (Kecepatan A + B)</b><br />
                    • Waktu Menyusul = <b>Selisih Jarak / (Kecepatan B - A)</b>
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>3. Perbandingan</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    • <b>Senilai</b> (Bensin & Jarak): <code>a1/b1 = a2/b2</code><br />
                    • <b>Berbalik Nilai</b> (Pekerja & Waktu): <code>a1 × b1 = a2 × b2</code>
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>4. Pecahan Istimewa</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    • 1/8 = <b>12.5%</b> | 3/8 = <b>37.5%</b> | 5/8 = <b>62.5%</b><br />
                    • 1/6 = <b>16.67%</b> | 1/3 = <b>33.33%</b> | 2/3 = <b>66.67%</b>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: TKP MINDSET */}
          {activeCheatTab === 'tkp_mindset' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  Mindset & Kata Kunci Opsi Skor 5 TKP
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Pilih selalu opsi yang mencerminkan integritas tinggi, pelayanan prima, dan kolaborasi tim.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>1. Pelayanan Publik</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Pilih opsi yang <b>mengutamakan kepentingan masyarakat</b>, ramah, solutif tanpa menunda, dan menolak gratifikasi/pungli.
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>2. Profesionalisme</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Pilih opsi yang <b>bertanggung jawab penuh atas tugas</b>, memisahkan urusan pribadi, dan menuntaskan target tepat waktu.
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>3. Jejaring Kerja & Kolaborasi</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Pilih opsi yang <b>membangun komunikasi terbuka</b>, mendengarkan masukan tim, dan fokus pada target bersama.
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>4. TIK & Digitalisasi</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Pilih opsi yang <b>antusias mengadopsi teknologi baru</b> dan proaktif membantu rekan kerja dalam efisiensi digital.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: TRYOUT & PASSING GRADE TRACKER */}
      {view === 'tryout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Add Tryout Form */}
          <div className="card card-p">
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
              Catat Hasil Simulasi / Tryout SKD
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 14 }}>
              Hitung otomatis skor total dan verifikasi kelolosan ambang batas MenPAN-RB.
            </div>

            <form onSubmit={handleAddTryout} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                <div>
                  <label className="label">Nama Tryout / Paket</label>
                  <input
                    type="text"
                    value={toName}
                    onChange={e => setToName(e.target.value)}
                    className="inp"
                    placeholder="Contoh: Tryout Mandiri CAT #1"
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ color: 'var(--blue)' }}>Skor TWK (Min: 65, Maks: 150)</label>
                  <input
                    type="number"
                    min={0}
                    max={150}
                    value={toTwk}
                    onChange={e => setToTwk(Number(e.target.value))}
                    className="inp"
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ color: 'var(--blue-hover)' }}>Skor TIU (Min: 80, Maks: 175)</label>
                  <input
                    type="number"
                    min={0}
                    max={175}
                    value={toTiu}
                    onChange={e => setToTiu(Number(e.target.value))}
                    className="inp"
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ color: 'var(--green)' }}>Skor TKP (Min: 166, Maks: 225)</label>
                  <input
                    type="number"
                    min={0}
                    max={225}
                    value={toTkp}
                    onChange={e => setToTkp(Number(e.target.value))}
                    className="inp"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Catatan Evaluasi / Topik Yang Perlu Diperbaiki (Opsional)</label>
                <input
                  type="text"
                  value={toNotes}
                  onChange={e => setToNotes(e.target.value)}
                  className="inp"
                  placeholder="Contoh: Kehabisan waktu di deret TIU, TWK UUD 1945 sudah stabil"
                />
              </div>

              {/* Live Calculation Preview */}
              {(() => {
                const totalScore = Number(toTwk || 0) + Number(toTiu || 0) + Number(toTkp || 0);
                const twkPass = Number(toTwk) >= 65;
                const tiuPass = Number(toTiu) >= 80;
                const tkpPass = Number(toTkp) >= 166;
                const allPass = twkPass && tiuPass && tkpPass;

                return (
                  <div className="between" style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>PREVIEW SKOR TOTAL</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: allPass ? (totalScore >= 400 ? 'var(--green)' : 'var(--blue-hover)') : 'var(--red)', lineHeight: 1.1 }}>
                        {totalScore} <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 600 }}>/ 550</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className={`tag ${twkPass ? 'tag-green' : 'tag-dim'}`}>TWK: {toTwk} ({twkPass ? 'Lolos' : '< 65'})</span>
                      <span className={`tag ${tiuPass ? 'tag-green' : 'tag-dim'}`}>TIU: {toTiu} ({tiuPass ? 'Lolos' : '< 80'})</span>
                      <span className={`tag ${tkpPass ? 'tag-green' : 'tag-dim'}`}>TKP: {toTkp} ({tkpPass ? 'Lolos' : '< 166'})</span>
                    </div>

                    <button type="submit" className="btn btn-blue" style={{ padding: '8px 18px', fontWeight: 700 }}>
                      Simpan Hasil Tryout
                    </button>
                  </div>
                );
              })()}
            </form>
          </div>

          {/* Tryout History */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
              Riwayat Skor Tryout ({activeTryouts.length})
            </div>

            {activeTryouts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeTryouts.map((tr) => {
                  const total = tr.twk + tr.tiu + tr.tkp;
                  const twkOk = tr.twk >= 65;
                  const tiuOk = tr.tiu >= 80;
                  const tkpOk = tr.tkp >= 166;
                  const passed = twkOk && tiuOk && tkpOk;

                  return (
                    <div
                      key={tr.id}
                      className="card"
                      style={{
                        borderLeft: `3px solid ${passed ? (total >= 400 ? 'var(--green)' : 'var(--blue)') : 'var(--red)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        padding: '14px 18px'
                      }}
                    >
                      <div className="between" style={{ flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{tr.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>{tr.date}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 20, fontWeight: 900, color: passed ? 'var(--text)' : 'var(--red)' }}>
                              {total} <span style={{ fontSize: 11, color: 'var(--text3)' }}>/ 550</span>
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 900, color: passed ? (total >= 450 ? 'var(--red)' : total >= 400 ? 'var(--green)' : 'var(--blue-hover)') : 'var(--red)' }}>
                              {passed ? (total >= 450 ? '🔥 OVERKILL: RANKING 1 FORMASI' : total >= 400 ? '★ AMAN BERSAING (SKOR 400+)' : '✓ LOLOS PASSING GRADE') : '✗ BELUM MEMENUHI'}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTryout(tr.id)}
                            className="icon-btn"
                            style={{ width: 28, height: 28 }}
                            title="Hapus riwayat"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <span className={`tag ${twkOk ? 'tag-green' : 'tag-dim'}`}>TWK: {tr.twk} / 150</span>
                        <span className={`tag ${tiuOk ? 'tag-green' : 'tag-dim'}`}>TIU: {tr.tiu} / 175</span>
                        <span className={`tag ${tkpOk ? 'tag-green' : 'tag-dim'}`}>TKP: {tr.tkp} / 225</span>
                      </div>

                      {tr.notes && (
                        <div style={{ fontSize: 12, color: 'var(--text2)', background: 'var(--surface2)', padding: '6px 10px', borderRadius: 6, fontStyle: 'italic' }}>
                          "{tr.notes}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text3)', fontSize: 13 }}>
                Belum ada data tryout tersimpan. Masukkan hasil simulasi pertama Anda di atas!
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: WEEKLY SCHEDULE */}
      {view === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 860, margin: '0 auto', width: '100%' }}>
          <div className="between">
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {DAYS.map(d => (
                <button
                  key={d}
                  className={`day-btn${selDay === d ? ' on' : ''}`}
                  onClick={() => setSelDay(d)}
                  style={{ flexShrink: 0, minWidth: 70 }}
                >
                  {d} {d === dayName && <span style={{ marginLeft: 4, width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />}
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
              <Icon name="settings" size={14} /> Kelola Jadwal
            </button>
          </div>

          <div className="card">
            <div className="between" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  {selDay} — {viewSched.type}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Fokus: {viewSched.focus}</div>
              </div>
              <div>
                {selDay === dayName && <span className="tag tag-green">Hari Ini</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {viewTasks.map((t, i) => (
                <div key={i} className={`ex-card${isTaskDone(selDay, t.name) ? ' done' : ''}`} style={{ cursor: 'default' }}>
                  <div className="ex-num" style={{ borderColor: isTaskDone(selDay, t.name) ? 'var(--green)' : 'var(--blue)', color: isTaskDone(selDay, t.name) ? 'var(--green)' : 'var(--blue)' }}>
                    {isTaskDone(selDay, t.name) ? <Icon name="check" size={13} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-title">{t.name}</div>
                    <div className="ex-meta">{t.detail}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text2)', background: 'var(--surface)', padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)' }}>
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
    </div>
  );
};
