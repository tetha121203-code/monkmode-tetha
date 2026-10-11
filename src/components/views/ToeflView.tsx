import React, { useState, useEffect } from 'react';
import { DAYS, DEFAULT_TOEFL_SCHEDULE, TOTAL_DAYS } from '../../data/defaults';
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
  tryoutHistory = [],
  setTryoutHistory,
}) => {
  const [view, setView] = useState<'today' | 'roadmap' | 'cheatsheet' | 'tryout' | 'weekly'>('today');
  const [selDay, setSelDay] = useState<string>(dayName);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCheatTab, setActiveCheatTab] = useState<'deep_work' | 'first_principles' | 'mental_models' | 'problem_solving' | 'execution'>('deep_work');
  const [showDoctrines, setShowDoctrines] = useState<boolean>(false);

  // Daily Focus Drill Tracker
  const [drillCount, setDrillCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`study_drill_count_${dateKey}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const DAILY_DRILL_GOAL = 60; // 60 mins/points daily focus goal

  const addDrills = (amount: number) => {
    const nextVal = Math.max(0, drillCount + amount);
    setDrillCount(nextVal);
    try {
      localStorage.setItem(`study_drill_count_${dateKey}`, nextVal.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const resetDrills = () => {
    setDrillCount(0);
    try {
      localStorage.setItem(`study_drill_count_${dateKey}`, '0');
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
    if (window.confirm('Terapkan template Protokol Ekstrem ke seluruh hari dalam jadwal?')) {
      setToeflSched(DEFAULT_TOEFL_SCHEDULE);
      alert('Protokol Ekstrem Belajar & Deep Work berhasil diterapkan!');
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

  // Evaluation Form State
  const [toName, setToName] = useState('Evaluasi Benchmark #1');
  const [toTwk, setToTwk] = useState<number>(85);
  const [toTiu, setToTiu] = useState<number>(115);
  const [toTkp, setToTkp] = useState<number>(185);
  const [toNotes, setToNotes] = useState('');

  const [localTryouts, setLocalTryouts] = useState<TryoutRecord[]>(() => {
    try {
      const saved = localStorage.getItem('monk_mode_study_evaluations');
      return saved ? JSON.parse(saved) : [
        { id: 'to_init_1', name: 'Evaluasi Mandiri #1', date: '2026-08-10', twk: 75, tiu: 95, tkp: 172, notes: 'Fokus pagi mantap, logika analitis dan problem solving berjalan konsisten.' }
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
      name: toName.trim() || 'Evaluasi Performa',
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
      localStorage.setItem('monk_mode_study_evaluations', JSON.stringify(updated));
    }
    setToName(`Evaluasi Benchmark #${activeTryouts.length + 2}`);
    setToNotes('');
  };

  const handleDeleteTryout = (id: string) => {
    const updated = activeTryouts.filter(t => t.id !== id);
    if (setTryoutHistory) {
      setTryoutHistory(updated);
    } else {
      setLocalTryouts(updated);
      localStorage.setItem('monk_mode_study_evaluations', JSON.stringify(updated));
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
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
                color: 'var(--cyan)',
                border: '1px solid rgba(96, 165, 250, 0.45)',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.35)',
                letterSpacing: '0.04em'
              }}
            >
              ⚡ PROTOKOL DEEP WORK & MASTERY 2026
            </span>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>
              Tenggat Waktu: Akhir Tahun 2026 (31 Des 2026) • {TOTAL_DAYS} Hari
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500, marginTop: 4 }}>
            Mastery Fondasi Kognitif, Problem Solving Analitis (<span style={{ color: 'var(--blue-hover)', fontWeight: 700, textShadow: '0 0 8px rgba(96, 165, 250, 0.4)' }}>Logika</span>), & Eksekusi Proyek Puncak (<span style={{ color: 'var(--purple-light)', fontWeight: 700, textShadow: '0 0 8px rgba(168, 85, 247, 0.4)' }}>Kualitas 100%</span>)
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tab-bar">
          {[
            { id: 'today', l: 'Target Hari Ini' },
            { id: 'roadmap', l: 'Silabus Modul' },
            { id: 'cheatsheet', l: 'Framework & Doktrin' },
            { id: 'tryout', l: 'Benchmark & Nilai' },
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 900, margin: '0 auto', width: '100%' }}>
          {/* Main Today Protocol Card */}
          <div className="card card-p glow-card-dual" style={{ background: 'linear-gradient(135deg, rgba(9, 16, 36, 0.9) 0%, rgba(22, 14, 46, 0.9) 100%)' }}>
            <div className="between" style={{ marginBottom: 14, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="glow-dot" style={{ background: 'var(--cyan)' }} />
                  {dayName} — PROTOKOL DEEP WORK EKSTREM
                </div>
                <div style={{ fontSize: 21, fontWeight: 900, color: '#ffffff' }}>{todaySched.type}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3, fontWeight: 500 }}>
                  Fokus Misi: <span style={{ color: '#ffffff', fontWeight: 700 }}>{todaySched.focus}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(14, 23, 53, 0.8)', padding: '10px 20px', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.35)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: todayDone === todayTasks.length && todayTasks.length > 0 ? 'var(--green-hover)' : 'var(--cyan)', lineHeight: 1, textShadow: '0 0 14px rgba(56, 189, 248, 0.5)' }}>
                  {todayDone}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, marginTop: 3 }}>/ {todayTasks.length} Misi Tuntas</div>
              </div>
            </div>
            <ProgressBar cur={todayDone} tot={todayTasks.length} cls="r" />
          </div>

          {/* Focus Drill / Point Counter */}
          <div className="card" style={{ border: '1px solid var(--blue-border)', background: 'var(--surface2)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.12)' }}>
            <div className="between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--blue-hover)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="glow-dot" />
                  KUOTA DEEP WORK / DRILL HARIAN (TARGET 60 MENIT / POIN)
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>
                  {drillCount} <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>/ {DAILY_DRILL_GOAL} Poin Terakumulasi Hari Ini</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onClick={() => addDrills(5)} className="btn btn-ghost" style={{ fontSize: 12, padding: '5px 10px' }}>
                  +5m
                </button>
                <button onClick={() => addDrills(15)} className="btn btn-blue" style={{ fontSize: 12, padding: '5px 12px' }}>
                  +15m
                </button>
                <button onClick={() => addDrills(30)} className="btn btn-dual" style={{ fontSize: 12, padding: '5px 12px' }}>
                  +30m
                </button>
                <button onClick={resetDrills} className="icon-btn red" title="Reset kuota hari ini" style={{ width: 30, height: 30 }}>
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
            <ProgressBar cur={drillCount} tot={DAILY_DRILL_GOAL} cls="g" />
          </div>

          {/* Pomodoro Focus Timer */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, background: 'rgba(12, 18, 36, 0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: timerRunning ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${timerRunning ? 'var(--cyan)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 900,
                  color: timerRunning ? 'var(--cyan)' : 'var(--text2)',
                  boxShadow: timerRunning ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                <Icon name="clock" size={24} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Sesi Focus Timer (Flow State)
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {formatTime(timerSeconds)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`btn ${timerRunning ? 'btn-red' : 'btn-dual'}`}
                style={{ padding: '8px 20px', fontWeight: 800 }}
              >
                {timerRunning ? 'Jeda Fokus' : 'Mulai Fokus'}
              </button>
              <button onClick={() => resetTimer(25)} className="btn btn-ghost" style={{ fontSize: 11, padding: '7px 10px' }}>
                25m
              </button>
              <button onClick={() => resetTimer(50)} className="btn btn-ghost" style={{ fontSize: 11, padding: '7px 10px' }}>
                50m
              </button>
              <button onClick={() => resetTimer(90)} className="btn btn-ghost" style={{ fontSize: 11, padding: '7px 10px' }}>
                90m (Deep Work)
              </button>
            </div>
          </div>

          {/* Task Checklist for Today */}
          <div>
            <div className="between" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={16} style={{ color: 'var(--blue)' }} /> Misi Belajar Hari Ini ({todayTasks.length})
              </div>
              <button onClick={handleApplyExtremeProtocol} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px', color: 'var(--purple)' }}>
                ⚡ Terapkan Template Ekstrem
              </button>
            </div>

            {todayTasks.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text3)' }}>
                Tidak ada tugas terjadwal untuk hari ini. Luangkan waktu untuk review modul atau eksplorasi materi di tab Silabus.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {todayTasks.map((t, idx) => {
                  const done = isTaskDone(dayName, t.name);
                  return (
                    <div
                      key={idx}
                      className={`card${done ? ' done' : ''}`}
                      onClick={() => toggleTask(dayName, t.name)}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 18px',
                        borderLeft: `3px solid ${done ? 'var(--green)' : 'var(--blue)'}`,
                        transition: 'all 0.2s',
                        background: done ? 'rgba(16, 185, 129, 0.05)' : 'var(--surface2)'
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          border: `2px solid ${done ? 'var(--green)' : 'var(--border)'}`,
                          background: done ? 'var(--green)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          flexShrink: 0
                        }}
                      >
                        {done && <Icon name="check" size={14} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: done ? 'var(--text3)' : 'var(--text)',
                            textDecoration: done ? 'line-through' : 'none',
                            marginBottom: 2
                          }}
                        >
                          {t.name}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                          {t.detail}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, background: 'var(--surface)', padding: '4px 8px', borderRadius: 6 }}>
                        ⏱ {t.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5 Doctrines of Brutal Transformation */}
          <div className="card" style={{ background: 'rgba(20, 13, 44, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <div className="between" style={{ cursor: 'pointer' }} onClick={() => setShowDoctrines(!showDoctrines)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="glow-dot purple" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
                  5 Doktrin Deep Work & Brutal Transformation
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--purple-light)', fontWeight: 700 }}>
                {showDoctrines ? 'Tutup ▲' : 'Buka Doktrin ▼'}
              </span>
            </div>

            {showDoctrines && (
              <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginTop: 14 }}>
                {[
                  { n: '1. Monotasking Mutlak', d: 'Satu tugas per blok 90 menit tanpa switch tab, tanpa browsing acak, dan tanpa multitasking.' },
                  { n: '2. Zero Toleransi Distraksi', d: 'Mode pesawat aktif, notifikasi mati total saat sesi belajar. Distraksi 3 detik menghancurkan fokus 23 menit.' },
                  { n: '3. First Principles & Logika', d: 'Jangan hanya menghafal, urai konsep rumit sampai ke hukum paling mendasar menggunakan metode Feynman.' },
                  { n: '4. High-Yield Output', d: 'Setiap sesi harus menghasilkan deliverable konkret: kode bersih, esai tajam, atau problem set terpecahkan.' },
                  { n: '5. Konsistensi Hingga Akhir 2026', d: `Jalankan ${TOTAL_DAYS} hari (12 Okt - 31 Des 2026) tanpa bolong. Repetisi harian adalah pembeda utama antara amatir dan master sejati.` }
                ].map((doc, idx) => (
                  <div key={idx} style={{ background: 'rgba(12, 8, 30, 0.7)', padding: '12px 14px', borderRadius: 9, border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--purple-light)', marginBottom: 4 }}>{doc.n}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{doc.d}</div>
                  </div>
                ))}
              </div>
            )}
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
                  Silabus Lengkap & Modul Belajar
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                  Total Penguasaan Kurikulum
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--blue-hover)' }}>
                {Math.round((totalDoneRoadmap / Math.max(totalAllRoadmap, 1)) * 100)}%
                <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 600, marginLeft: 6 }}>
                  ({totalDoneRoadmap}/{totalAllRoadmap} Modul Tuntas)
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
                placeholder="Cari materi (Deep Work, First Principles, Algoritma, High-Impact Writing)..."
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
                    borderTop: `2px solid ${p.color || 'var(--blue)'}`,
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
                            background: `${p.color || '#3b82f6'}18`,
                            border: `1px solid ${p.color || '#3b82f6'}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            fontWeight: 900,
                            color: p.color || 'var(--blue-hover)',
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
                      {(p.items || []).map((it, itemIdx) => {
                        const checked = !!safeToeflProg[it.id];
                        return (
                          <div
                            key={it.id || itemIdx}
                            onClick={() => toggleToeflProg(it.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 10px',
                              borderRadius: 6,
                              background: checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface)',
                              border: `1px solid ${checked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 5,
                                border: `2px solid ${checked ? 'var(--green)' : 'var(--border)'}`,
                                background: checked ? 'var(--green)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                flexShrink: 0
                              }}
                            >
                              {checked && <Icon name="check" size={11} />}
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: checked ? 'var(--text3)' : 'var(--text)',
                                textDecoration: checked ? 'line-through' : 'none',
                                flex: 1
                              }}
                            >
                              {it.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: CHEATSHEET & FRAMEWORKS */}
      {view === 'cheatsheet' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { id: 'deep_work', l: 'Protokol Deep Work' },
              { id: 'first_principles', l: 'First Principles' },
              { id: 'mental_models', l: 'Mental Models' },
              { id: 'problem_solving', l: 'Problem Solving' },
              { id: 'execution', l: 'Framework Eksekusi' }
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

          {/* Tab Content: DEEP WORK */}
          {activeCheatTab === 'deep_work' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                  4 Aturan Deep Work (Cal Newport Protocol)
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                  Kemampuan melakukan pekerjaan mendalam tanpa distraksi adalah superpower kognitif di era ekonomi digital modern.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {[
                  { t: '1. Jadwalkan Deep Work', d: 'Tentukan blok waktu spesifik 90 menit setiap pagi sebelum membuka inbox atau smartphone.' },
                  { t: '2. Rangkul Kebosanan', d: 'Latih otak untuk menahan dorongan instan scrolling saat merasa jenuh atau buntu.' },
                  { t: '3. Berhenti dari Media Sosial', d: 'Eliminasi platform yang merampas kapasitas rentang perhatian (attention span).' },
                  { t: '4. Tumpas Aktivitas Dangkal', d: 'Batasi rapat, chatting acak, dan administrasi minor di luar jam fokus utama.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 6 }}>{item.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: FIRST PRINCIPLES */}
          {activeCheatTab === 'first_principles' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  First Principles Thinking
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Pendekatan berpikir dengan merebus masalah hingga fakta paling mendasar, lalu membangun solusi baru dari nol.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                {[
                  { p: 'Langkah 1: Identifikasi Asumsi', desc: 'Tuliskan semua asumsi yang kamu miliki tentang masalah tersebut.' },
                  { p: 'Langkah 2: Dekonstruksi Masalah', desc: 'Tanyakan: Apakah ini fakta fisik yang mutlak benar, atau hanya kebiasaan lama?' },
                  { p: 'Langkah 3: Bangun Solusi Baru', desc: 'Rancang solusi dari kebenaran mendasar tanpa terikat tradisi sebelumnya.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--surface2)', padding: '12px 14px', borderRadius: 9, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--cyan)', marginBottom: 4 }}>{item.p}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: MENTAL MODELS */}
          {activeCheatTab === 'mental_models' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  Model Mental Pilihan untuk Brutal Transformation
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Kerangka berpikir untuk mempertajam penilaian dan membuat keputusan rasional.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                {[
                  { t: 'Prinsip Pareto (80/20)', d: '80% hasil berasal dari 20% upaya kunci. Temukan dan lipatgandakan 20% tersebut.' },
                  { t: 'Inversi (Charlie Munger)', d: 'Alih-alih mencari cara untuk sukses, cari tahu cara pasti untuk gagal dan hindari itu.' },
                  { t: 'Second-Order Thinking', d: 'Jangan hanya melihat dampak langsung, pertimbangkan konsekuensi dari konsekuensi berikutnya.' },
                  { t: 'Teknik Feynman', d: 'Uji pemahamanmu dengan mengajarkannya ke orang lain dalam bahasa paling sederhana tanpa jargon.' }
                ].map((s, idx) => (
                  <div key={idx} style={{ background: 'var(--surface2)', padding: '14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--purple-light)', marginBottom: 6 }}>{s.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: PROBLEM SOLVING */}
          {activeCheatTab === 'problem_solving' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  Prosedur Pemecahan Masalah Sistematis
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Alur baku untuk mengurai tantangan teknis kompleks dalam hitungan menit.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>1. Root Cause (5-Whys)</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Tanyakan "Mengapa hal ini terjadi?" sebanyak 5 kali berturut-turut untuk menyentuh akar masalah sebenarnya.
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>2. Reduksi Kompleksitas</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Pecah masalah besar menjadi sub-masalah kecil independen yang dapat diselesaikan satu per satu.
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--blue-hover)', marginBottom: 4 }}>3. Validasi Solusi</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Uji solusi dengan kondisi ekstrem (edge cases) sebelum menyatakan masalah selesai secara tuntas.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: EXECUTION */}
          {activeCheatTab === 'execution' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
                  Mindset Eksekusi & Deliverable
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                  Standar kualitas dan kecepatan peluncuran proyek dalam Monk Mode.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>Bias Menuju Aksi</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Analisis berlebih tanpa eksekusi adalah ilusi produktivitas. Buat prototipe secepat mungkin.
                  </div>
                </div>

                <div style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>Standar Kualitas Tertinggi</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    Jangan pernah menyerahkan hasil setengah jadi. Periksa detail kecil dan dokumentasikan secara profesional.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: BENCHMARK & EVALUASI */}
      {view === 'tryout' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Add Benchmark Form */}
          <div className="card card-p">
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>
              Catat Hasil Evaluasi / Benchmark Performa
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 14 }}>
              Ukur skor berkala metrik Fokus, Logika Problem Solving, dan Kualitas Eksekusi hingga akhir tahun 2026.
            </div>

            <form onSubmit={handleAddTryout} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                <div>
                  <label className="label">Nama Sesi Evaluasi</label>
                  <input
                    type="text"
                    value={toName}
                    onChange={e => setToName(e.target.value)}
                    className="inp"
                    placeholder="Contoh: Benchmark Mandiri #1"
                    required
                  />
                </div>

                <div>
                  <label className="label" style={{ color: 'var(--cyan)' }}>Fokus & Disiplin (0–150)</label>
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
                  <label className="label" style={{ color: 'var(--blue-hover)' }}>Problem Solving & Logika (0–175)</label>
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
                  <label className="label" style={{ color: 'var(--purple-light)' }}>Kualitas Eksekusi (0–225)</label>
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
                <label className="label">Catatan Refleksi & Evaluasi (Opsional)</label>
                <input
                  type="text"
                  value={toNotes}
                  onChange={e => setToNotes(e.target.value)}
                  className="inp"
                  placeholder="Contoh: Fokus 90m tercapai tanpa interupsi, eksekusi modul lancar..."
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
                      <span className={`tag ${twkPass ? 'tag-green' : 'tag-dim'}`}>Fokus: {toTwk} (≥65)</span>
                      <span className={`tag ${tiuPass ? 'tag-green' : 'tag-dim'}`}>Logika: {toTiu} (≥80)</span>
                      <span className={`tag ${tkpPass ? 'tag-green' : 'tag-dim'}`}>Eksekusi: {toTkp} (≥166)</span>
                    </div>

                    <button type="submit" className="btn btn-dual" style={{ padding: '8px 18px', fontWeight: 700 }}>
                      Simpan Hasil Evaluasi
                    </button>
                  </div>
                );
              })()}
            </form>
          </div>

          {/* Evaluation History */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
              Riwayat Skor Benchmark ({activeTryouts.length})
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
                            <div style={{ fontSize: 10, fontWeight: 900, color: passed ? (total >= 450 ? 'var(--cyan)' : total >= 400 ? 'var(--green)' : 'var(--blue-hover)') : 'var(--red)' }}>
                              {passed ? (total >= 450 ? '🔥 OVERKILL: PERFORMA PUNCAK' : total >= 400 ? '★ DISIPLIN SOLID (SKOR 400+)' : '✓ MEMENUHI BENCHMARK') : '✗ BELUM MEMENUHI'}
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
                        <span className={`tag ${twkOk ? 'tag-green' : 'tag-dim'}`}>Fokus: {tr.twk} / 150</span>
                        <span className={`tag ${tiuOk ? 'tag-green' : 'tag-dim'}`}>Logika: {tr.tiu} / 175</span>
                        <span className={`tag ${tkpOk ? 'tag-green' : 'tag-dim'}`}>Eksekusi: {tr.tkp} / 225</span>
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
              <div className="card" style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text3)' }}>
                Belum ada catatan evaluasi benchmark.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: WEEKLY SCHEDULE */}
      {view === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setSelDay(d)}
                className={`day-btn${selDay === d ? ' on' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="card card-p">
            <div className="between" style={{ marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase' }}>
                  Jadwal Hari {selDay}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
                  {viewSched.type}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
                  Fokus Misi: {viewSched.focus}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {viewTasks.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>{t.detail}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 700, background: 'rgba(56, 189, 248, 0.1)', padding: '3px 8px', borderRadius: 6 }}>
                    {t.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for detail Phase item list */}
      {activeRoadmap && (
        <Modal
          open={!!activeRoadmap}
          onClose={() => setToeflPhase(null)}
          title={`Detail Modul: ${activeRoadmap.title}`}
          wide
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
              {activeRoadmap.desc}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(activeRoadmap.items || []).map((it, idx) => {
                const checked = !!safeToeflProg[it.id];
                return (
                  <div
                    key={it.id || idx}
                    onClick={() => toggleToeflProg(it.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--surface2)',
                      border: `1px solid ${checked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border)'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `2px solid ${checked ? 'var(--green)' : 'var(--border)'}`,
                        background: checked ? 'var(--green)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        flexShrink: 0
                      }}
                    >
                      {checked && <Icon name="check" size={12} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: checked ? 'var(--text3)' : 'var(--text)',
                          textDecoration: checked ? 'line-through' : 'none'
                        }}
                      >
                        {it.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
