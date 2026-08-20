import React, { useState, useEffect } from 'react';
import { AuthGate } from './components/AuthGate';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MobileNav } from './components/MobileNav';
import { Modal } from './components/Modal';
import { ProgressBar } from './components/ProgressBar';
import { Icon } from './components/Icon';
import { DashboardView } from './components/views/DashboardView';
import { HabitsView } from './components/views/HabitsView';
import { DiaryView } from './components/views/DiaryView';
import { FitnessView } from './components/views/FitnessView';
import { ToeflView } from './components/views/ToeflView';
import { SettingsModal } from './components/views/SettingsView';

import { useSync } from './hooks/useSync';
import {
  DEFAULT_WORKOUT,
  DEFAULT_TOEFL,
  DEFAULT_TOEFL_SCHEDULE,
  DEFAULT_TRYOUTS,
  SCAPULAR,
  PROGRAM_START_DATE,
  TOTAL_DAYS
} from './data/defaults';
import {
  WeightData,
  ExerciseLog,
  WorkoutSchedule,
  DiaryEntry,
  HabitLog,
  WeeklyAnalysis,
  ToeflPhase,
  ToeflProgress,
  ToeflSchedule,
  ToeflDailyProgress,
  TryoutRecord
} from './types';

const NAV_ITEMS = [
  { id: 'dashboard', n: 'home', l: 'Overview' },
  { id: 'toefl', n: 'book', l: 'Belajar CPNS SKD' },
  { id: 'habits', n: 'habits', l: 'Daily Activity' },
  { id: 'diary', n: 'diary', l: 'Diary & AI' },
  { id: 'fitness', n: 'fitness', l: 'Fitness' }
];

export default function App() {
  const [uid, setUid] = useState<string | null>(() => localStorage.getItem('monk_mode_uid') || null);
  const [tab, setTab] = useState('dashboard');
  const [mob, setMob] = useState(window.innerWidth < 768);
  const [slim, setSlim] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [wtOpen, setWtOpen] = useState(false);
  const [settOpen, setSettOpen] = useState(false);
  const [settTab, setSettTab] = useState('toefl');

  const [toeflPhase, setToeflPhase] = useState<string | null>(null);

  // Firestore Real-time Sync Hooks
  const [weight, setWeight, r2] = useSync<WeightData>('weight', { start: 78, current: 78, target: 63 }, uid);
  const [exDone, setExDone, r3] = useSync<ExerciseLog>('exercises', {}, uid);
  const [workout, setWorkout, r6] = useSync<WorkoutSchedule>('workout_schedule_v2', DEFAULT_WORKOUT, uid);
  const [streakNF, , r7] = useSync<Record<string, boolean>>('streak_nofap', {}, uid);
  const [streakNJ, , r8] = useSync<Record<string, boolean>>('streak_nojunkfood', {}, uid);
  const [diary, setDiary, r9] = useSync<DiaryEntry[]>('diary', [], uid);
  const [habitLog, setHabitLog, r10] = useSync<HabitLog>('habit_log', {}, uid);
  const [weeklyAnalysis, setWeeklyAnalysis, r13] = useSync<WeeklyAnalysis[]>('weekly_analysis', [], uid);
  const [toeflData, setToeflData, r14] = useSync<ToeflPhase[]>('cpns_data_v1', DEFAULT_TOEFL, uid);
  const [toeflProg, setToeflProg, r15] = useSync<ToeflProgress>('cpns_prog_v1', {}, uid);
  const [toeflSched, setToeflSched, r16] = useSync<ToeflSchedule>('cpns_sched_v2', DEFAULT_TOEFL_SCHEDULE, uid);
  const [toeflDaily, setToeflDaily, r17] = useSync<ToeflDailyProgress>('cpns_daily_v1', {}, uid);
  const [quickNote, setQuickNote, r18] = useSync<string>('quick_notes_v1', '', uid);
  const [tryouts, setTryouts, r19] = useSync<TryoutRecord[]>('cpns_tryouts_v1', DEFAULT_TRYOUTS, uid);

  const isReady = r2 && r3 && r6 && r7 && r8 && r9 && r10 && r13 && r14 && r15 && r16 && r17 && r18 && r19;

  useEffect(() => {
    if (uid) {
      localStorage.setItem('monk_mode_uid', uid);
    } else {
      localStorage.removeItem('monk_mode_uid');
    }
  }, [uid]);

  useEffect(() => {
    const handleResize = () => setMob(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const today = new Date();
  const diffDays = Math.floor((today.getTime() - PROGRAM_START_DATE.getTime()) / 86400000);
  const dayN = Math.max(0, Math.min(TOTAL_DAYS, diffDays + 1));
  const pct = Math.round((dayN / TOTAL_DAYS) * 100);

  const end = new Date(PROGRAM_START_DATE);
  end.setDate(PROGRAM_START_DATE.getDate() + TOTAL_DAYS - 1);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = dayNames[today.getDay()];
  const dateKey = today.toISOString().split('T')[0];
  const fmtDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const safeWO = typeof workout === 'object' && !Array.isArray(workout) ? workout : DEFAULT_WORKOUT;
  const safeExDone = exDone || {};
  const safeDiary = Array.isArray(diary) ? diary : [];
  const safeNF = streakNF || {};
  const safeNJ = streakNJ || {};
  const safeHL = habitLog || {};
  const safeWeeklyAnalysis = Array.isArray(weeklyAnalysis) ? weeklyAnalysis : [];

  const safeToefl = Array.isArray(toeflData) ? toeflData : DEFAULT_TOEFL;
  const safeToeflProg = toeflProg || {};
  const safeToeflSched = typeof toeflSched === 'object' && !Array.isArray(toeflSched) ? toeflSched : DEFAULT_TOEFL_SCHEDULE;
  const safeToeflDaily = toeflDaily || {};
  const safeTryouts = Array.isArray(tryouts) ? tryouts : DEFAULT_TRYOUTS;

  const handleAddTryout = (record: TryoutRecord) => {
    setTryouts(prev => [record, ...(Array.isArray(prev) ? prev : DEFAULT_TRYOUTS)]);
  };

  const ws = safeWO[dayName] || { type: 'Rest', focus: '-', exercises: [] };
  const exKey = (ex: any) => `${dateKey}-${dayName}-${ex.name}`;
  const isExDone = (ex: any) => !!safeExDone[exKey(ex)];

  const toggleEx = (ex: any) =>
    setExDone(p => {
      const s = p || {};
      return { ...s, [exKey(ex)]: !s[exKey(ex)] };
    });

  const priEx = (ws.exercises || []).filter(e => e.category === 'primary');
  const fp = (() => {
    const all = [...priEx, ...SCAPULAR];
    return { done: all.filter(e => isExDone(e)).length, total: all.length };
  })();

  const allToeflItems = safeToefl.flatMap(p => (p.items || []).map(i => i.id));
  const toeflDone = allToeflItems.filter(id => safeToeflProg[id]).length;
  const toggleToeflProg = (id: string) => setToeflProg(p => ({ ...(p || {}), [id]: !p?.[id] }));

  const countStreak = (obj: Record<string, boolean>) => {
    let n = 0;
    const d = new Date(today);
    while (true) {
      const k = d.toISOString().split('T')[0];
      if (!obj[k]) break;
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  };

  const nfStreak = countStreak(safeNF);
  const njStreak = countStreak(safeNJ);

  if (!uid) {
    return <AuthGate onLogin={setUid} />;
  }

  if (!isReady) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg)' }}>
        <div className="spin-it red-glow" style={{ borderRadius: '50%' }}>
          <Icon name="loader" size={32} style={{ color: 'var(--red)' }} />
        </div>
        <span style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 700, letterSpacing: '0.1em' }}>
          MENGINISIASI PROTOKOL FIRESTORE...
        </span>
      </div>
    );
  }

  const currentTabObj = NAV_ITEMS.find(n => n.id === tab);

  return (
    <div className="shell">
      {!mob && (
        <Sidebar
          tab={tab}
          setTab={setTab}
          slim={slim}
          setSlim={setSlim}
          onOpenSettings={() => {
            setSettTab('toefl');
            setSettOpen(true);
          }}
          onLogout={() => setUid(null)}
          navItems={NAV_ITEMS}
        />
      )}

      <div className="main">
        <Topbar
          currentTabLabel={currentTabObj?.l || 'Monk Mode'}
          fmtDate={fmtDate}
          dayN={dayN}
          totalDays={TOTAL_DAYS}
          pct={pct}
          weight={weight}
          isMobile={mob}
          onOpenCalendar={() => setCalOpen(true)}
          onOpenWeight={() => setWtOpen(true)}
          onOpenSettings={() => {
            setSettTab('toefl');
            setSettOpen(true);
          }}
        />

        <div className="page">
          {tab === 'dashboard' && (
            <DashboardView
              dayN={dayN}
              pct={pct}
              weight={weight}
              fp={fp}
              nfStreak={nfStreak}
              njStreak={njStreak}
              setTab={setTab}
              ws={ws}
              priEx={priEx}
              isExDone={isExDone}
              toggleEx={toggleEx}
              dayName={dayName}
              safeDiary={safeDiary}
              safeHL={safeHL}
              setHabitLog={setHabitLog}
              dateKey={dateKey}
              toeflDone={toeflDone}
              allToeflLength={allToeflItems.length}
              safeToefl={safeToefl}
              safeToeflProg={safeToeflProg}
              toeflSched={safeToeflSched}
              toeflDaily={safeToeflDaily}
              setToeflDaily={setToeflDaily}
              quickNote={quickNote || ''}
              setQuickNote={setQuickNote}
              tryouts={safeTryouts}
              onAddTryout={handleAddTryout}
              onCopyToDiary={(textText) => {
                if (!textText) return;
                const newEntry: DiaryEntry = {
                  id: Date.now(),
                  date: dateKey,
                  dateLabel: fmtDate,
                  text: `[Quick Note - Deep Study CPNS]\n${textText}`,
                  mood: 'good',
                  aiAnalysis: null
                };
                setDiary(prev => [...(prev || []), newEntry]);
                alert('Catatan Quick Note berhasil ditambahkan ke Diary!');
              }}
            />
          )}

          {tab === 'toefl' && (
            <ToeflView
              safeToefl={safeToefl}
              safeToeflProg={safeToeflProg}
              toggleToeflProg={toggleToeflProg}
              toeflPhase={toeflPhase}
              setToeflPhase={setToeflPhase}
              toeflSched={safeToeflSched}
              setToeflSched={setToeflSched}
              toeflDaily={safeToeflDaily}
              setToeflDaily={setToeflDaily}
              tryoutHistory={safeTryouts}
              setTryoutHistory={setTryouts}
              dayName={dayName}
              dateKey={dateKey}
              setSettTab={setSettTab}
              setSettOpen={setSettOpen}
            />
          )}

          {tab === 'habits' && (
            <HabitsView
              habitLog={safeHL}
              setHabitLog={setHabitLog}
              today={today}
              dateKey={dateKey}
              fmtDate={fmtDate}
            />
          )}

          {tab === 'diary' && (
            <DiaryView
              diary={safeDiary}
              setDiary={setDiary}
              dateKey={dateKey}
              fmtDate={fmtDate}
              safeHL={safeHL}
              today={today}
              weeklyAnalysis={safeWeeklyAnalysis}
              setWeeklyAnalysis={setWeeklyAnalysis}
              cpnsDone={toeflDone}
              totalCpns={allToeflItems.length}
            />
          )}

          {tab === 'fitness' && (
            <FitnessView
              safeWO={safeWO}
              setWorkout={setWorkout}
              dayName={dayName}
              dateKey={dateKey}
              safeExDone={safeExDone}
              setExDone={setExDone}
              ws={ws}
              fp={fp}
              priEx={priEx}
              isExDone={isExDone}
              toggleEx={toggleEx}
            />
          )}
        </div>
      </div>

      {mob && <MobileNav tab={tab} setTab={setTab} navItems={NAV_ITEMS} />}

      {/* Calendar Timeline Modal */}
      <Modal open={calOpen} onClose={() => setCalOpen(false)} title={`Timeline — ${TOTAL_DAYS} Hari Protocol`}>
        <div style={{ marginBottom: 20, display: 'flex', gap: 16, fontSize: 13, color: 'var(--text2)', flexWrap: 'wrap' }}>
          <span>Mulai: <b style={{ color: 'var(--text)' }}>3 Agustus 2026</b></span>
          <span>Selesai: <b style={{ color: 'var(--text)' }}>{end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</b></span>
          <span>Hari ini: <b style={{ color: 'var(--red)' }}>Day {dayN}</b></span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: 8 }}>
          {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
            const d = i + 1;
            const past = d < dayN;
            const cur = d === dayN;
            const dt = new Date(PROGRAM_START_DATE);
            dt.setDate(PROGRAM_START_DATE.getDate() + i);
            return (
              <div
                key={i}
                title={`Day ${d} — ${dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`}
                style={{
                  aspectRatio: '1',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  background: cur ? 'var(--red)' : past ? 'var(--blue-dim)' : 'var(--surface2)',
                  color: cur ? '#fff' : past ? 'var(--blue-hover)' : 'var(--text3)',
                  boxShadow: cur ? '0 0 10px rgba(225,29,72,0.5)' : 'none'
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Weight Modal */}
      <Modal open={wtOpen} onClose={() => setWtOpen(false)} title="Update Berat Badan">
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: 'var(--text)', lineHeight: 1, marginBottom: 8 }}>
            {weight.current}<span style={{ fontSize: 20, color: 'var(--text3)', fontWeight: 500, marginLeft: 4 }}>kg</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
            Target {weight.target}kg — sudah turun <strong style={{ color: 'var(--green)' }}>{(weight.start - weight.current).toFixed(1)}kg</strong> dari {weight.start}kg
          </div>
          <ProgressBar cur={weight.start - weight.current} tot={weight.start - weight.target} cls="g" />
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const val = parseFloat((form.elements.namedItem('w') as HTMLInputElement).value);
            if (!isNaN(val)) {
              setWeight(p => ({ ...p, current: val }));
            }
            setWtOpen(false);
          }}
          style={{ display: 'flex', gap: 12 }}
        >
          <input
            name="w"
            type="number"
            step="0.1"
            placeholder={String(weight.current)}
            className="inp"
            style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
            required
          />
          <button className="btn btn-red" type="submit" style={{ padding: '0 24px' }}>Update</button>
        </form>
      </Modal>

      {/* Settings Modal */}
      <SettingsModal
        open={settOpen}
        onClose={() => setSettOpen(false)}
        tab={settTab}
        setTab={setSettTab}
        toeflData={safeToefl}
        setToeflData={setToeflData}
        workout={safeWO}
        setWorkout={setWorkout}
        toeflSched={safeToeflSched}
        setToeflSched={setToeflSched}
        setExDone={setExDone}
        setHabitLog={setHabitLog}
        setDiary={setDiary}
        setToeflProg={setToeflProg}
      />

      {/* Mobile Bottom Navigation */}
      {mob && (
        <MobileNav
          tab={tab}
          setTab={setTab}
          navItems={NAV_ITEMS}
        />
      )}
    </div>
  );
}
