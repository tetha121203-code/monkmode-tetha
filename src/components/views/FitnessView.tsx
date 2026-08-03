import React, { useState } from 'react';
import { DEFAULT_WORKOUT, DAYS, SCAPULAR } from '../../data/defaults';
import { Exercise, ExerciseLog, WorkoutDay, WorkoutSchedule } from '../../types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { ProgressBar } from '../ProgressBar';

interface FitnessViewProps {
  safeWO: WorkoutSchedule;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutSchedule>>;
  dayName: string;
  dateKey: string;
  safeExDone: ExerciseLog;
  setExDone: React.Dispatch<React.SetStateAction<ExerciseLog>>;
  ws: WorkoutDay;
  fp: { done: number; total: number };
  priEx: Exercise[];
  isExDone: (ex: Exercise) => boolean;
  toggleEx: (ex: Exercise) => void;
}

export const FitnessView: React.FC<FitnessViewProps> = ({
  safeWO,
  setWorkout,
  dayName,
  dateKey,
  safeExDone,
  setExDone,
  ws,
  fp,
  priEx,
  isExDone,
  toggleEx
}) => {
  const [view, setView] = useState<'today' | 'weekly'>('today');
  const [selDay, setSelDay] = useState<string>(dayName);
  const [editEx, setEditEx] = useState<any>(null);
  const [editMeta, setEditMeta] = useState<string | false>(false);

  const exKeyFor = (day: string, ex: Exercise) => `${dateKey}-${day}-${ex.name}`;
  const isDoneFor = (day: string, ex: Exercise) => !!safeExDone[exKeyFor(day, ex)];

  const toggleFor = (day: string, ex: Exercise) =>
    setExDone(p => {
      const s = p || {};
      const k = exKeyFor(day, ex);
      return { ...s, [k]: !s[k] };
    });

  const saveEx = (data: any) => {
    setWorkout(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT;
      const day = s[data.dayKey] || { type: '', focus: '', exercises: [] };
      const list = [...(day.exercises || [])].filter(e => e.category === 'primary');

      if (data.isBulk) {
        const newExs = (data.bulkItems || []).map((e: any) => ({
          name: e.name || 'Gerakan Tanpa Nama',
          detail: e.detail || '',
          target: e.target || '',
          category: 'primary' as const
        }));
        return { ...s, [data.dayKey]: { ...day, exercises: [...list, ...newExs] } };
      }

      const ne: Exercise = { name: data.name, detail: data.detail, target: data.target, category: 'primary' };
      if (data.isNew) list.push(ne);
      else list[data.index] = ne;

      return { ...s, [data.dayKey]: { ...day, exercises: list } };
    });
    setEditEx(null);
  };

  const deleteEx = (day: string, idx: number) => {
    if (!confirm('Hapus gerakan latihan ini?')) return;
    setWorkout(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT;
      const d = s[day] || { exercises: [] };
      const list = [...(d.exercises || [])].filter(e => e.category === 'primary');
      list.splice(idx, 1);
      return { ...s, [day]: { ...d, exercises: list } };
    });
  };

  const saveMeta = (day: string, f: string, v: string) =>
    setWorkout(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT;
      const d = s[day] || { exercises: [] };
      return { ...s, [day]: { ...d, [f]: v } };
    });

  const priToday = (ws.exercises || []).filter(e => e.category === 'primary');
  const priDone = priToday.filter(e => isExDone(e)).length;
  const scapDone = SCAPULAR.filter(e => isExDone(e)).length;
  const totalDone = priDone + scapDone;
  const totalTot = priToday.length + SCAPULAR.length;

  const viewWS = safeWO[view === 'today' ? dayName : selDay] || { type: 'Rest', focus: '-', exercises: [] };
  const viewPri = (viewWS.exercises || []).filter(e => e.category === 'primary');

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, margin: '0 auto' }}>
      <div className="between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Fitness Protocol
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>Penderitaan Fisik Membangun Mental Kuat</div>
        </div>

        <div style={{ display: 'flex', gap: 0, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {[
            { id: 'today', l: 'Hari Ini' },
            { id: 'weekly', l: 'Mingguan' }
          ].map((v, vi) => (
            <button
              key={v.id}
              onClick={() => setView(v.id as any)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRight: vi === 0 ? '1px solid var(--border)' : 'none',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-p">
            <div className="between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {dayName}
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
                  {ws.type} — {ws.focus}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{totalDone}</div>
                <div style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 700 }}>/ {totalTot}</div>
              </div>
            </div>

            <ProgressBar cur={totalDone} tot={totalTot} />

            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>
              <span>
                Inti: <strong style={{ color: 'var(--text)' }}>{priDone}/{priToday.length}</strong>
              </span>
              <span>
                Scapular: <strong style={{ color: 'var(--text)' }}>{scapDone}/{SCAPULAR.length}</strong>
              </span>
            </div>
          </div>

          <div className="sep">
            <div className="sep-line" />
            <div className="sep-label">Latihan Inti</div>
            <div className="sep-line" />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13, color: 'var(--blue-hover)' }}
              onClick={() => setEditEx({ isNew: true, isBulk: true, dayKey: dayName })}
            >
              <Icon name="sparkles" size={16} /> AI Bulk Import
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13 }}
              onClick={() => setEditEx({ isNew: true, dayKey: dayName, name: '', detail: '', target: '' })}
            >
              <Icon name="plus" /> Tambah Latihan
            </button>
          </div>

          {priToday.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {priToday.map((ex, i) => {
                const done = isExDone(ex);
                return (
                  <div key={i} className={`ex-card${done ? ' done' : ''}`} onClick={() => toggleEx(ex)}>
                    <div className="ex-num">{done ? <Icon name="check" size={14} /> : i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ex-title">{ex.name}</div>
                      <div className="ex-meta">{ex.detail} — {ex.target}</div>
                    </div>
                    <button
                      className="icon-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setEditEx({ isNew: false, dayKey: dayName, index: i, ...ex });
                      }}
                    >
                      <Icon name="pencil" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="sep">
            <div className="sep-line" />
            <div className="sep-label" style={{ color: 'var(--green)' }}>Terapi Scapular (Wajib)</div>
            <div className="sep-line" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SCAPULAR.map((ex, i) => {
              const done = isExDone(ex);
              return (
                <div key={i} className={`ex-card${done ? ' done' : ''}`} style={{ borderLeftColor: 'var(--green)' }} onClick={() => toggleEx(ex)}>
                  <div className="ex-num" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
                    {done ? <Icon name="check" size={14} /> : i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-title">{ex.name}</div>
                    <div className="ex-meta">{ex.detail} — {ex.target}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
            {DAYS.map(d => (
              <button key={d} className={`day-btn${selDay === d ? ' on' : ''}`} onClick={() => setSelDay(d)} style={{ flexShrink: 0, minWidth: 80 }}>
                {d} {d === dayName && <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />}
              </button>
            ))}
          </div>

          <div className="card">
            <div className="between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
                  {selDay} — {viewWS.type}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>{viewWS.focus}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {selDay === dayName && <span className="tag tag-green">Hari Ini</span>}
                <button className="icon-btn" onClick={() => setEditMeta(p => (p === selDay ? false : selDay))}>
                  <Icon name="pencil" />
                </button>
              </div>
            </div>

            {editMeta === selDay && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div>
                  <span className="label">Tipe Sesi</span>
                  <input value={viewWS.type || ''} onChange={e => saveMeta(selDay, 'type', e.target.value)} className="inp" />
                </div>
                <div>
                  <span className="label">Fokus</span>
                  <input value={viewWS.focus || ''} onChange={e => saveMeta(selDay, 'focus', e.target.value)} className="inp" />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                className="btn btn-ghost"
                style={{ padding: '8px 16px', fontSize: 13, color: 'var(--blue-hover)' }}
                onClick={() => setEditEx({ isNew: true, isBulk: true, dayKey: selDay })}
              >
                <Icon name="sparkles" size={16} /> AI Bulk Import
              </button>
              <button
                className="btn btn-ghost"
                style={{ padding: '8px 16px', fontSize: 13 }}
                onClick={() => setEditEx({ isNew: true, dayKey: selDay, name: '', detail: '', target: '' })}
              >
                <Icon name="plus" /> Tambah Latihan
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
              {viewPri.map((ex, i) => (
                <div key={i} className={`ex-card${isDoneFor(selDay, ex) ? ' done' : ''}`} onClick={() => toggleFor(selDay, ex)}>
                  <div className="ex-num">{isDoneFor(selDay, ex) ? <Icon name="check" size={14} /> : i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="ex-title">{ex.name}</div>
                    <div className="ex-meta">{ex.detail}</div>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={e => {
                      e.stopPropagation();
                      setEditEx({ isNew: false, dayKey: selDay, index: i, ...ex });
                    }}
                  >
                    <Icon name="pencil" />
                  </button>
                  <button
                    className="icon-btn red"
                    onClick={e => {
                      e.stopPropagation();
                      deleteEx(selDay, i);
                    }}
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal
        open={!!editEx}
        onClose={() => setEditEx(null)}
        title={
          editEx?.isBulk
            ? `AI Bulk Import Latihan — ${editEx?.dayKey}`
            : editEx?.isNew
            ? `Tambah Latihan — ${editEx?.dayKey}`
            : 'Edit Latihan'
        }
      >
        {editEx?.isBulk ? (
          <BulkExForm init={editEx} onSave={saveEx} onClose={() => setEditEx(null)} />
        ) : (
          editEx && <ExForm init={editEx} onSave={saveEx} onClose={() => setEditEx(null)} />
        )}
      </Modal>
    </div>
  );
};

export const BulkExForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const sub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setErr('');

    try {
      const res = await fetch('/api/friday-ai/bulk-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type: 'workout' })
      });
      if (!res.ok) throw new Error('Failed to parse AI schedule');
      const data = await res.json();
      onSave({ ...init, bulkItems: data.result || [], isBulk: true });
    } catch (e: any) {
      setErr('Gagal diproses AI. Pastikan format teks dapat dipahami.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {err && <div style={{ color: 'var(--red)', fontSize: 13, background: 'rgba(225,29,72,0.1)', padding: 12, borderRadius: 8 }}>{err}</div>}
      <div>
        <span className="label">Paste Daftar Latihan Fisik Mentah</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
          Friday akan mendeteksi nama gerakan, set/repetisi, dan mengkategorikan target otot.
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="inp"
          style={{ minHeight: 220, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
          placeholder="Contoh:&#10;Incline Dumbell Press 3x10&#10;Cable Crossover 4 set 12 rep&#10;Tricep Pushdown 3x15"
          required
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }} disabled={loading}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }} disabled={loading}>
          {loading ? <span className="spin-it"><Icon name="loader" /></span> : <Icon name="sparkles" />}
          {loading ? ' Memproses Jadwal Fisik...' : ' AI Eksekusi Import'}
        </button>
      </div>
    </form>
  );
};

export const ExForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
  const [name, setName] = useState(init.name || '');
  const [detail, setDetail] = useState(init.detail || '');
  const [target, setTarget] = useState(init.target || '');

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...init, name, detail, target, category: 'primary' });
  };

  return (
    <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span className="label">Nama Gerakan</span>
        <input value={name} onChange={e => setName(e.target.value)} className="inp" required placeholder="Bench Press..." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <span className="label">Set & Rep</span>
          <input value={detail} onChange={e => setDetail(e.target.value)} className="inp" required placeholder="3 x 10–12" />
        </div>
        <div>
          <span className="label">Target Otot</span>
          <input value={target} onChange={e => setTarget(e.target.value)} className="inp" required placeholder="Dada..." />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }}>Simpan</button>
      </div>
    </form>
  );
};
