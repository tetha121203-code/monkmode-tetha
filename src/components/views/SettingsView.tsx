import React, { useState } from 'react';
import { DEFAULT_ROADMAP, DEFAULT_WORKOUT, DEFAULT_TOEFL_SCHEDULE, DAYS } from '../../data/defaults';
import { DiaryEntry, HabitLog, ExerciseLog, RoadmapPhase, RoadmapProgress, ToeflProgress, ToeflSchedule, WorkoutSchedule } from '../../types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';

interface SettingsViewProps {
  open: boolean;
  onClose: () => void;
  tab: string;
  setTab: (tab: string) => void;
  roadmap: RoadmapPhase[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapPhase[]>>;
  workout: WorkoutSchedule;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutSchedule>>;
  toeflSched: ToeflSchedule;
  setToeflSched: React.Dispatch<React.SetStateAction<ToeflSchedule>>;
  setRprog: React.Dispatch<React.SetStateAction<RoadmapProgress>>;
  setExDone: React.Dispatch<React.SetStateAction<ExerciseLog>>;
  setHabitLog: React.Dispatch<React.SetStateAction<HabitLog>>;
  setDiary: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setToeflProg: React.Dispatch<React.SetStateAction<ToeflProgress>>;
}

export const SettingsModal: React.FC<SettingsViewProps> = ({
  open,
  onClose,
  tab,
  setTab,
  roadmap,
  setRoadmap,
  workout,
  setWorkout,
  toeflSched,
  setToeflSched,
  setRprog,
  setExDone,
  setHabitLog,
  setDiary,
  setToeflProg
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Settings & Protocols" wide>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: '6px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflowX: 'auto' }}>
        {[
          { id: 'roadmap', l: 'Modul Data Analyst' },
          { id: 'workout', l: 'Fisik' },
          { id: 'toefl', l: 'Jadwal CPNS' },
          { id: 'reset', l: 'Erase Data' }
        ].map(t => (
          <button
            key={t.id}
            className={`stab${tab === t.id ? ' on' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setTab(t.id)}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'roadmap' && <RoadmapMgr roadmap={roadmap} setRoadmap={setRoadmap} />}
      {tab === 'workout' && <WorkoutMgr workout={workout} setWorkout={setWorkout} />}
      {tab === 'toefl' && <ToeflMgr toeflSched={toeflSched} setToeflSched={setToeflSched} />}
      {tab === 'reset' && (
        <ResetPanel
          setRprog={setRprog}
          setExDone={setExDone}
          setHabitLog={setHabitLog}
          setDiary={setDiary}
          setToeflProg={setToeflProg}
        />
      )}
    </Modal>
  );
};

const ResetPanel: React.FC<{
  setRprog: React.Dispatch<React.SetStateAction<RoadmapProgress>>;
  setExDone: React.Dispatch<React.SetStateAction<ExerciseLog>>;
  setHabitLog: React.Dispatch<React.SetStateAction<HabitLog>>;
  setDiary: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setToeflProg: React.Dispatch<React.SetStateAction<ToeflProgress>>;
}> = ({ setRprog, setExDone, setHabitLog, setDiary, setToeflProg }) => {
  const [confirm, setConfirm] = useState<any>(null);

  const resets = [
    { id: 'rprog', label: 'Progress Data Analyst', desc: 'Hapus semua checklist modul data analyst', icon: 'map', color: 'var(--blue)', fn: () => setRprog({}) },
    { id: 'toeflprog', label: 'Progress CPNS', desc: 'Hapus semua checklist modul materi CPNS', icon: 'book', color: 'var(--purple)', fn: () => setToeflProg({}) },
    { id: 'habits', label: 'Daily Habits', desc: 'Hapus riwayat aktivitas harian', icon: 'habits', color: 'var(--green)', fn: () => setHabitLog({}) },
    { id: 'exdone', label: 'Riwayat Fisik', desc: 'Hapus riwayat penyelesaian latihan fisik', icon: 'fitness', color: 'var(--amber)', fn: () => setExDone({}) },
    { id: 'diary', label: 'Audit & AI History', desc: 'Hapus permanen semua evaluasi diri', icon: 'diary', color: 'var(--red)', fn: () => setDiary([]) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(225,29,72,0.4)', background: 'rgba(225,29,72,0.1)', fontSize: 13, color: 'var(--red)', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, fontWeight: 600 }}>
        <Icon name="warn" size={16} />
        <span>Semua aksi di bawah bersifat merusak secara permanen. Pastikan kesadaran penuh sebelum mengeksekusi penghapusan.</span>
      </div>

      {resets.map(r => (
        <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--surface2)', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${r.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: r.color }}>
              <Icon name={r.icon} size={20} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4, textTransform: 'uppercase' }}>{r.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5, fontWeight: 500 }}>{r.desc}</div>
            </div>
          </div>
          <button className="btn btn-red" style={{ fontSize: 13, flexShrink: 0 }} onClick={() => setConfirm(r)}>HANCURKAN</button>
        </div>
      ))}

      {confirm && (
        <Modal open={!!confirm} onClose={() => setConfirm(null)} title={`Hancurkan ${confirm.label}?`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: '16px', background: 'rgba(225,29,72,0.1)', borderRadius: 12, fontSize: 14, color: 'var(--red)', lineHeight: 1.6, fontWeight: 600 }}>
              {confirm.desc}.<br /><br />
              <strong>Apakah Anda yakin akan membuang pengorbanan ini?</strong>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirm(null)}>Kembali</button>
              <button className="btn btn-red" style={{ flex: 1 }} onClick={() => { confirm.fn(); setConfirm(null); }}>Eksekusi</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const RoadmapMgr: React.FC<{ roadmap: RoadmapPhase[]; setRoadmap: React.Dispatch<React.SetStateAction<RoadmapPhase[]>> }> = ({ roadmap, setRoadmap }) => {
  const [sel, setSel] = useState<string | null>(null);
  const [editPhase, setEditPhase] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<any>(null);

  const safeRM = Array.isArray(roadmap) ? roadmap : DEFAULT_ROADMAP;
  const phase = safeRM.find(p => p.id === sel);

  const savePhase = (d: any) => {
    if (d.isNew) {
      const np: RoadmapPhase = {
        id: `ph_${Date.now()}`,
        title: d.title,
        week: d.week,
        desc: d.desc,
        color: d.color || '#3b82f6',
        targetDeadline: d.targetDeadline || '',
        pl: d.pl,
        videos: [],
        casestudies: []
      };
      setRoadmap(p => [...(Array.isArray(p) ? p : DEFAULT_ROADMAP), np]);
    } else {
      setRoadmap(p => (Array.isArray(p) ? p : DEFAULT_ROADMAP).map(x => (x.id === d.id ? { ...x, ...d } : x)));
    }
    setEditPhase(null);
  };

  const delPhase = (id: string) => {
    setConfirmDialog({ type: 'delete_phase', id, title: 'Hapus Modul?', desc: 'Modul ini akan dihapus secara permanen.' });
  };

  const execDelPhase = (id: string) => {
    setRoadmap(p => (Array.isArray(p) ? p : DEFAULT_ROADMAP).filter(x => x.id !== id));
    if (sel === id) setSel(null);
    setConfirmDialog(null);
  };

  const movePhase = (idx: number, direction: number) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= safeRM.length) return;
    setRoadmap(p => {
      const arr = Array.isArray(p) ? [...p] : [...DEFAULT_ROADMAP];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const onDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIdx(idx);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    setRoadmap(p => {
      const arr = Array.isArray(p) ? [...p] : [...DEFAULT_ROADMAP];
      const [item] = arr.splice(draggedIdx, 1);
      arr.splice(targetIdx, 0, item);
      return arr;
    });
    setDraggedIdx(null);
  };

  const saveItem = (data: any) => {
    setRoadmap(p =>
      (Array.isArray(p) ? p : DEFAULT_ROADMAP).map(ph => {
        if (ph.id !== sel) return ph;

        if (data.isBulk) {
          const newVideos: any[] = [];
          const newCases: any[] = [];
          (data.bulkItems || []).forEach((item: any) => {
            const id = `${item.type === 'video' ? 'v' : 'cs'}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            if (item.type === 'video') newVideos.push({ id, title: item.title || 'Video Tanpa Judul', url: item.url || '' });
            else newCases.push({ id, title: item.title || 'Project Tanpa Judul', desc: item.desc || '' });
          });
          return { ...ph, videos: [...(ph.videos || []), ...newVideos], casestudies: [...(ph.casestudies || []), ...newCases] };
        }

        const key = data.type === 'video' ? 'videos' : 'casestudies';
        const list = [...(ph[key] || [])];
        const item = data.type === 'video' ? { id: data.id || `v_${Date.now()}`, title: data.title, url: data.url || '' } : { id: data.id || `cs_${Date.now()}`, title: data.title, desc: data.desc || '' };
        if (data.isNew) list.push(item);
        else list[data.index] = item;
        return { ...ph, [key]: list };
      })
    );
    setEditItem(null);
  };

  const delItem = (type: string, index: number) => {
    setConfirmDialog({ type: 'delete_item', itemType: type, index, title: 'Hapus Item?', desc: 'Item ini akan dihapus secara permanen.' });
  };

  const execDelItem = (type: string, index: number) => {
    setRoadmap(p =>
      (Array.isArray(p) ? p : DEFAULT_ROADMAP).map(ph => {
        if (ph.id !== sel) return ph;
        const key = type === 'video' ? 'videos' : 'casestudies';
        const list = [...(ph[key] || [])];
        list.splice(index, 1);
        return { ...ph, [key]: list };
      })
    );
    setConfirmDialog(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: sel ? '240px 1fr' : '1fr', gap: 20, minHeight: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Modul IT
          </span>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditPhase({ isNew: true, title: '', week: '', desc: '', color: '#3b82f6', pl: '' })}>
            + Tambah
          </button>
        </div>

        {safeRM.map((p, i) => (
          <div
            key={p.id}
            draggable
            onDragStart={e => onDragStart(e, i)}
            onDragOver={onDragOver}
            onDrop={e => onDrop(e, i)}
            onClick={() => setSel(p.id === sel ? null : p.id)}
            style={{
              padding: '12px',
              borderRadius: 10,
              border: `1px solid ${sel === p.id ? 'var(--blue-border)' : 'var(--border)'}`,
              background: sel === p.id ? 'var(--blue-dim)' : draggedIdx === i ? 'var(--blue-dim)' : 'var(--surface2)',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              opacity: draggedIdx === i ? 0.6 : 1
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${p.color || '#3b82f6'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: p.color || '#3b82f6', flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontWeight: 600 }}>{(p.videos || []).length}v · {(p.casestudies || []).length}cs</div>
            </div>
            <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0, opacity: i > 0 ? 1 : 0.3 }} onClick={e => { e.stopPropagation(); movePhase(i, -1); }} disabled={i === 0} title="Pindah ke atas">
              <Icon name="chL" />
            </button>
            <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0, opacity: i < safeRM.length - 1 ? 1 : 0.3 }} onClick={e => { e.stopPropagation(); movePhase(i, 1); }} disabled={i === safeRM.length - 1} title="Pindah ke bawah">
              <Icon name="chR" />
            </button>
            <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={e => { e.stopPropagation(); setEditPhase({ ...p }); }}>
              <Icon name="pencil" />
            </button>
            <button className="icon-btn red" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={e => { e.stopPropagation(); delPhase(p.id); }} title="Hapus">
              <Icon name="trash" />
            </button>
          </div>
        ))}
      </div>

      {sel && phase && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', maxHeight: 500, paddingRight: 8 }}>
          <div className="between" style={{ paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{phase.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4, fontWeight: 600 }}>Week {phase.week}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-blue" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditItem({ isNew: true, isBulk: true })}>
                <Icon name="sparkles" size={14} /> AI Bulk
              </button>
              <button className="icon-btn" onClick={() => setEditPhase({ ...phase })}><Icon name="pencil" /></button>
              <button className="icon-btn red" onClick={() => delPhase(phase.id)} title="Hapus Modul"><Icon name="trash" /></button>
              <button className="icon-btn" onClick={() => setSel(null)}><Icon name="x" /></button>
            </div>
          </div>

          <div>
            <div className="between" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Video ({(phase.videos || []).length})
              </span>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditItem({ isNew: true, type: 'video', title: '', url: '' })}>+ Tambah</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(phase.videos || []).map((v, i) => (
                <div key={v.id} style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 700, width: 20, flexShrink: 0 }}>{i + 1}</span>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{v.title}</div>
                  {v.url && (
                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <Icon name="play" />
                    </a>
                  )}
                  <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={() => setEditItem({ isNew: false, type: 'video', index: i, id: v.id, title: v.title, url: v.url || '' })}>
                    <Icon name="pencil" />
                  </button>
                  <button className="icon-btn red" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={() => delItem('video', i)}>
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="between" style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Projects ({(phase.casestudies || []).length})
              </span>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditItem({ isNew: true, type: 'case', title: '', desc: '' })}>+ Tambah</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(phase.casestudies || []).map((cs, i) => (
                <div key={cs.id} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{cs.title}</div>
                    {cs.desc && <div style={{ fontSize: 13, color: 'var(--text3)' }}>{cs.desc}</div>}
                  </div>
                  <button className="icon-btn" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={() => setEditItem({ isNew: false, type: 'case', index: i, id: cs.id, title: cs.title, desc: cs.desc || '' })}>
                    <Icon name="pencil" />
                  </button>
                  <button className="icon-btn red" style={{ width: 28, height: 28, flexShrink: 0 }} onClick={() => delItem('case', i)}>
                    <Icon name="trash" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editPhase && (
        <Modal open={!!editPhase} onClose={() => setEditPhase(null)} title={editPhase.isNew ? 'Tambah Modul' : 'Edit Modul'}>
          <PhaseForm init={editPhase} onSave={savePhase} onClose={() => setEditPhase(null)} />
        </Modal>
      )}

      {editItem && (
        <Modal
          open={!!editItem}
          onClose={() => setEditItem(null)}
          title={
            editItem.isBulk
              ? 'AI Bulk Import (Video & Tugas)'
              : editItem.isNew
              ? editItem.type === 'video' ? 'Tambah Video' : 'Tambah Project'
              : editItem.type === 'video' ? 'Edit Video' : 'Edit Project'
          }
        >
          {editItem.isBulk ? (
            <BulkItemForm init={editItem} onSave={saveItem} onClose={() => setEditItem(null)} />
          ) : (
            <ItemForm init={editItem} onSave={saveItem} onClose={() => setEditItem(null)} />
          )}
        </Modal>
      )}

      {confirmDialog && (
        <Modal open={!!confirmDialog} onClose={() => setConfirmDialog(null)} title={confirmDialog.title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: '16px', background: 'rgba(225,29,72,0.1)', borderRadius: 12, fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{confirmDialog.desc}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDialog(null)}>Batal</button>
              <button
                className="btn btn-red"
                style={{ flex: 1 }}
                onClick={() => {
                  if (confirmDialog.type === 'delete_phase') execDelPhase(confirmDialog.id);
                  else if (confirmDialog.type === 'delete_item') execDelItem(confirmDialog.itemType, confirmDialog.index);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const BulkItemForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
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
        body: JSON.stringify({ text, type: 'roadmap' })
      });
      if (!res.ok) throw new Error('Failed to bulk parse roadmap');
      const data = await res.json();
      onSave({ ...init, bulkItems: data.result || [], isBulk: true });
    } catch (e: any) {
      setErr('Gagal diproses AI. Pastikan format teks tidak terlalu ambigu.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {err && <div style={{ color: 'var(--red)', fontSize: 13, background: 'rgba(225,29,72,0.1)', padding: 12, borderRadius: 8 }}>{err}</div>}
      <div>
        <span className="label">Paste Daftar Tugas/Materi Mentah</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
          Friday AI akan otomatis membedah judul, merangkum requirement, dan membaginya jadi <strong style={{ color: 'var(--blue-hover)' }}>Video</strong> atau <strong style={{ color: 'var(--blue-hover)' }}>Project</strong>.
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="inp"
          style={{ minHeight: 220, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
          placeholder="Contoh:&#10;1. Sistem Manajemen Perpustakaan CLI&#10;Fitur Wajib: Tambah buku, Lihat semua...&#10;&#10;2. Pengenalan Pandas Fundamental"
          required
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }} disabled={loading}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }} disabled={loading}>
          {loading ? <span className="spin-it"><Icon name="loader" /></span> : <Icon name="sparkles" />}
          {loading ? ' Friday Menganalisis...' : ' AI Eksekusi Import'}
        </button>
      </div>
    </form>
  );
};

const ItemForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
  const [title, setTitle] = useState(init.title || '');
  const [url, setUrl] = useState(init.url || '');
  const [desc, setDesc] = useState(init.desc || '');

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...init, title, url, desc });
  };

  return (
    <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span className="label">Judul</span>
        <input value={title} onChange={e => setTitle(e.target.value)} className="inp" required placeholder={init.type === 'video' ? '#01 — Intro Python...' : 'Project: Data Analysis...'} />
      </div>
      {init.type === 'video' && (
        <div>
          <span className="label">YouTube URL (opsional)</span>
          <input value={url} onChange={e => setUrl(e.target.value)} className="inp" placeholder="https://youtube.com/..." />
        </div>
      )}
      {init.type === 'case' && (
        <div>
          <span className="label">Deskripsi Project</span>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} className="inp" style={{ minHeight: 90 }} placeholder="Buat analisis data..." />
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }}>Simpan</button>
      </div>
    </form>
  );
};

const PhaseForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
  const [title, setTitle] = useState(init.title || '');
  const [week, setWeek] = useState(init.week || '');
  const [desc, setDesc] = useState(init.desc || '');
  const [color, setColor] = useState(init.color || '#3b82f6');
  const [targetDeadline, setTargetDeadline] = useState(init.targetDeadline || '');
  const [pl, setPl] = useState(init.pl || '');

  const cols = ['#3b82f6', '#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#e11d48', '#8b5cf6'];

  return (
    <form onSubmit={e => { e.preventDefault(); onSave({ ...init, title, week, desc, color, targetDeadline, pl }); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span className="label">Nama Modul</span>
        <input value={title} onChange={e => setTitle(e.target.value)} className="inp" required />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <span className="label">Week</span>
          <input value={week} onChange={e => setWeek(e.target.value)} className="inp" placeholder="1–2" />
        </div>
        <div>
          <span className="label">Target Deadline</span>
          <input type="date" value={targetDeadline} onChange={e => setTargetDeadline(e.target.value)} className="inp" style={{ colorScheme: 'dark' }} />
        </div>
        <div>
          <span className="label">Playlist URL</span>
          <input value={pl} onChange={e => setPl(e.target.value)} className="inp" />
        </div>
      </div>
      <div>
        <span className="label">Deskripsi</span>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} className="inp" style={{ minHeight: 80 }} />
      </div>
      <div>
        <span className="label">Warna Tema</span>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {cols.map(c => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: c,
                cursor: 'pointer',
                border: `2px solid ${color === c ? '#fff' : 'transparent'}`,
                transform: color === c ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.2s',
                boxShadow: color === c ? `0 0 10px ${c}` : 'none'
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }}>Simpan</button>
      </div>
    </form>
  );
};

const WorkoutMgr: React.FC<{ workout: WorkoutSchedule; setWorkout: React.Dispatch<React.SetStateAction<WorkoutSchedule>> }> = ({ workout, setWorkout }) => {
  const [activeDay, setActiveDay] = useState<string>('Senin');
  const [editEx, setEditEx] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<any>(null);

  const safeWO = typeof workout === 'object' && !Array.isArray(workout) ? workout : DEFAULT_WORKOUT;
  const day = safeWO[activeDay] || { type: '', focus: '', exercises: [] };

  const saveMeta = (f: string, v: string) =>
    setWorkout(p => ({ ...(typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT), [activeDay]: { ...day, [f]: v } }));

  const saveEx = (data: any) => {
    setWorkout(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT;
      const d = s[activeDay] || { exercises: [] };
      const list = d.exercises || [];

      if (data.isBulk) {
        const newExs = (data.bulkItems || []).map((e: any) => ({ name: e.name || 'Gerakan Tanpa Nama', detail: e.detail || '', target: e.target || '', category: 'primary' }));
        return { ...s, [activeDay]: { ...d, exercises: [...list, ...newExs] } };
      }

      if (data.isNew) return { ...s, [activeDay]: { ...d, exercises: [...list, { name: data.name, detail: data.detail, target: data.target, category: 'primary' }] } };
      return { ...s, [activeDay]: { ...d, exercises: list.map((e, i) => (i === data.index ? { name: data.name, detail: data.detail, target: data.target, category: e.category } : e)) } };
    });
    setEditEx(null);
  };

  const delEx = (i: number) => {
    setConfirmDialog({ index: i, title: 'Hapus Gerakan?', desc: 'Latihan ini akan dihapus dari jadwal.' });
  };

  const execDelEx = (i: number) => {
    setWorkout(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT;
      const d = s[activeDay] || { exercises: [] };
      const list = [...(d.exercises || [])].filter(e => e.category === 'primary');
      list.splice(i, 1);
      return { ...s, [activeDay]: { ...d, exercises: list } };
    });
    setConfirmDialog(null);
  };

  const priEx = (day.exercises || []).filter(e => e.category === 'primary');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {DAYS.map(d => (
          <button key={d} className={`day-btn${activeDay === d ? ' on' : ''}`} onClick={() => setActiveDay(d)}>
            {d}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <span className="label">Tipe Sesi</span>
          <input value={day.type || ''} onChange={e => saveMeta('type', e.target.value)} className="inp" placeholder="Push Day..." />
        </div>
        <div>
          <span className="label">Fokus</span>
          <input value={day.focus || ''} onChange={e => saveMeta('focus', e.target.value)} className="inp" placeholder="Dada, Bahu..." />
        </div>
      </div>

      <div className="between" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Latihan ({priEx.length})
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--blue-hover)' }} onClick={() => setEditEx({ isNew: true, isBulk: true, dayKey: activeDay })}>
            <Icon name="sparkles" size={14} /> AI Bulk Import
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditEx({ isNew: true, index: -1, name: '', detail: '', target: '' })}>
            + Tambah
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {priEx.map((ex, i) => (
          <div key={i} style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{ex.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>{ex.detail} — {ex.target}</div>
            </div>
            <button className="icon-btn" onClick={() => setEditEx({ isNew: false, index: i, ...ex })}>
              <Icon name="pencil" />
            </button>
            <button className="icon-btn red" onClick={() => delEx(i)}>
              <Icon name="trash" />
            </button>
          </div>
        ))}
      </div>

      {editEx && (
        <Modal open={!!editEx} onClose={() => setEditEx(null)} title={editEx.isBulk ? `AI Bulk Import Latihan — ${activeDay}` : editEx.isNew ? `Tambah Gerakan — ${activeDay}` : 'Edit Gerakan'}>
          {editEx.isBulk ? (
            <BulkExForm init={editEx} onSave={saveEx} onClose={() => setEditEx(null)} />
          ) : (
            <ExForm init={editEx} onSave={saveEx} onClose={() => setEditEx(null)} />
          )}
        </Modal>
      )}

      {confirmDialog && (
        <Modal open={!!confirmDialog} onClose={() => setConfirmDialog(null)} title={confirmDialog.title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: '16px', background: 'rgba(225,29,72,0.1)', borderRadius: 12, fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{confirmDialog.desc}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDialog(null)}>Batal</button>
              <button className="btn btn-red" style={{ flex: 1 }} onClick={() => execDelEx(confirmDialog.index)}>Hapus</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const BulkExForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
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
      if (!res.ok) throw new Error('Failed to parse AI workout schedule');
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
          Friday akan otomatis mendeteksi nama gerakan, set/repetisi, dan mengkategorikan target otot.
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

const ExForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
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

const ToeflMgr: React.FC<{ toeflSched: ToeflSchedule; setToeflSched: React.Dispatch<React.SetStateAction<ToeflSchedule>> }> = ({ toeflSched, setToeflSched }) => {
  const [activeDay, setActiveDay] = useState<string>('Senin');
  const [editTask, setEditTask] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<any>(null);

  const safeSched = typeof toeflSched === 'object' && !Array.isArray(toeflSched) ? toeflSched : DEFAULT_TOEFL_SCHEDULE;
  const day = safeSched[activeDay] || { type: '', focus: '', tasks: [] };

  const saveMeta = (f: string, v: string) =>
    setToeflSched(p => ({ ...(typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_TOEFL_SCHEDULE), [activeDay]: { ...day, [f]: v } }));

  const saveTask = (data: any) => {
    setToeflSched(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_TOEFL_SCHEDULE;
      const d = s[activeDay] || { tasks: [] };
      const list = d.tasks || [];

      if (data.isBulk) {
        const newTasks = (data.bulkItems || []).map((t: any) => ({ name: t.name || 'Task Tanpa Nama', detail: t.detail || '', time: t.time || '15m' }));
        return { ...s, [activeDay]: { ...d, tasks: [...list, ...newTasks] } };
      }

      if (data.isNew) return { ...s, [activeDay]: { ...d, tasks: [...list, { name: data.name, detail: data.detail, time: data.time }] } };
      return { ...s, [activeDay]: { ...d, tasks: list.map((t, i) => (i === data.index ? { name: data.name, detail: data.detail, time: data.time } : t)) } };
    });
    setEditTask(null);
  };

  const delTask = (i: number) => {
    setConfirmDialog({ index: i, title: 'Hapus Task?', desc: 'Task belajar ini akan dihapus dari jadwal CPNS.' });
  };

  const execDelTask = (i: number) => {
    setToeflSched(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_TOEFL_SCHEDULE;
      const d = s[activeDay] || { tasks: [] };
      const list = [...(d.tasks || [])];
      list.splice(i, 1);
      return { ...s, [activeDay]: { ...d, tasks: list } };
    });
    setConfirmDialog(null);
  };

  const tasks = day.tasks || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {DAYS.map(d => (
          <button key={d} className={`day-btn${activeDay === d ? ' on' : ''}`} onClick={() => setActiveDay(d)}>
            {d}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <span className="label">Fokus Section</span>
          <input value={day.type || ''} onChange={e => saveMeta('type', e.target.value)} className="inp" placeholder="Listening Focus..." />
        </div>
        <div>
          <span className="label">Detail Sub-Fokus</span>
          <input value={day.focus || ''} onChange={e => saveMeta('focus', e.target.value)} className="inp" placeholder="Note-taking..." />
        </div>
      </div>

      <div className="between" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Task Belajar ({tasks.length})
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--blue-hover)' }} onClick={() => setEditTask({ isNew: true, isBulk: true, dayKey: activeDay })}>
            <Icon name="sparkles" size={14} /> AI Bulk Import
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditTask({ isNew: true, index: -1, name: '', detail: '', time: '' })}>
            + Tambah
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
        {tasks.map((t, i) => (
          <div key={i} style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>{t.detail} — {t.time}</div>
            </div>
            <button className="icon-btn" onClick={() => setEditTask({ isNew: false, index: i, ...t })}>
              <Icon name="pencil" />
            </button>
            <button className="icon-btn red" onClick={() => delTask(i)}>
              <Icon name="trash" />
            </button>
          </div>
        ))}
      </div>

      {editTask && (
        <Modal open={!!editTask} onClose={() => setEditTask(null)} title={editTask.isBulk ? `AI Bulk Import CPNS — ${activeDay}` : editTask.isNew ? `Tambah Task CPNS — ${activeDay}` : 'Edit Task'}>
          {editTask.isBulk ? (
            <BulkToeflTaskForm init={editTask} onSave={saveTask} onClose={() => setEditTask(null)} />
          ) : (
            <ToeflTaskForm init={editTask} onSave={saveTask} onClose={() => setEditTask(null)} />
          )}
        </Modal>
      )}

      {confirmDialog && (
        <Modal open={!!confirmDialog} onClose={() => setConfirmDialog(null)} title={confirmDialog.title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: '16px', background: 'rgba(225,29,72,0.1)', borderRadius: 12, fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{confirmDialog.desc}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDialog(null)}>Batal</button>
              <button className="btn btn-red" style={{ flex: 1 }} onClick={() => execDelTask(confirmDialog.index)}>Hapus</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const BulkToeflTaskForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
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
        body: JSON.stringify({ text, type: 'toefl' })
      });
      if (!res.ok) throw new Error('Failed to bulk parse TOEFL task');
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
        <span className="label">Paste Daftar Task CPNS Mentah</span>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
          Friday akan mengurai jadwal belajarmu menjadi Nama Tugas, Instruksi Spesifik, dan Estimasi Durasi (misal: 15m, 30m).
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="inp"
          style={{ minHeight: 220, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
          placeholder="Contoh:&#10;Latihan 30 Soal TWK Pancasila (20 menit)&#10;Hafal 10 Pasal UUD 1945&#10;Kerjakan 25 Soal TIU Silogisme"
          required
        />
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }} disabled={loading}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }} disabled={loading}>
          {loading ? <span className="spin-it"><Icon name="loader" /></span> : <Icon name="sparkles" />}
          {loading ? ' Memproses Jadwal Akademik...' : ' AI Eksekusi Import'}
        </button>
      </div>
    </form>
  );
};

const ToeflTaskForm: React.FC<{ init: any; onSave: (data: any) => void; onClose: () => void }> = ({ init, onSave, onClose }) => {
  const [name, setName] = useState(init.name || '');
  const [detail, setDetail] = useState(init.detail || '');
  const [time, setTime] = useState(init.time || '');

  const sub = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...init, name, detail, time });
  };

  return (
    <form onSubmit={sub} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <span className="label">Nama Task</span>
        <input value={name} onChange={e => setName(e.target.value)} className="inp" required placeholder="Shadowing Latihan..." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <span className="label">Instruksi</span>
          <input value={detail} onChange={e => setDetail(e.target.value)} className="inp" required placeholder="Tirukan intonasi..." />
        </div>
        <div>
          <span className="label">Durasi Waktu</span>
          <input value={time} onChange={e => setTime(e.target.value)} className="inp" required placeholder="15m" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
        <button type="submit" className="btn btn-blue" style={{ flex: 2 }}>Simpan</button>
      </div>
    </form>
  );
};
