import React, { useState } from 'react';
import { DEFAULT_WORKOUT, DEFAULT_TOEFL, DEFAULT_TOEFL_SCHEDULE, DAYS } from '../../data/defaults';
import { DiaryEntry, HabitLog, ExerciseLog, ToeflPhase, ToeflItem, ToeflProgress, ToeflSchedule, WorkoutSchedule } from '../../types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';

interface SettingsViewProps {
  open: boolean;
  onClose: () => void;
  tab: string;
  setTab: (tab: string) => void;
  toeflData: ToeflPhase[];
  setToeflData: React.Dispatch<React.SetStateAction<ToeflPhase[]>>;
  workout: WorkoutSchedule;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutSchedule>>;
  toeflSched: ToeflSchedule;
  setToeflSched: React.Dispatch<React.SetStateAction<ToeflSchedule>>;
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
  toeflData,
  setToeflData,
  workout,
  setWorkout,
  toeflSched,
  setToeflSched,
  setExDone,
  setHabitLog,
  setDiary,
  setToeflProg
}) => {
  return (
    <Modal open={open} onClose={onClose} title="Settings & Protocols" wide>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, padding: '6px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflowX: 'auto' }}>
        {[
          { id: 'toefl', l: 'Jadwal Harian CPNS' },
          { id: 'cpns_silabus', l: 'Silabus & Materi CPNS' },
          { id: 'workout', l: 'Latihan Fisik' },
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

      {tab === 'toefl' && <ToeflMgr toeflSched={toeflSched} setToeflSched={setToeflSched} />}
      {tab === 'cpns_silabus' && <CpnsSilabusMgr toeflData={toeflData} setToeflData={setToeflData} />}
      {tab === 'workout' && <WorkoutMgr workout={workout} setWorkout={setWorkout} />}
      {tab === 'reset' && (
        <ResetPanel
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
  setExDone: React.Dispatch<React.SetStateAction<ExerciseLog>>;
  setHabitLog: React.Dispatch<React.SetStateAction<HabitLog>>;
  setDiary: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  setToeflProg: React.Dispatch<React.SetStateAction<ToeflProgress>>;
}> = ({ setExDone, setHabitLog, setDiary, setToeflProg }) => {
  const [confirm, setConfirm] = useState<any>(null);

  const resets = [
    { id: 'toeflprog', label: 'Progress Materi CPNS', desc: 'Hapus semua checklist modul & materi SKD CPNS', icon: 'book', color: 'var(--purple)', fn: () => setToeflProg({}) },
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

const CpnsSilabusMgr: React.FC<{ toeflData: ToeflPhase[]; setToeflData: React.Dispatch<React.SetStateAction<ToeflPhase[]>> }> = ({ toeflData, setToeflData }) => {
  const [sel, setSel] = useState<string | null>(null);
  const [editPhase, setEditPhase] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState<any>(null);

  const safeData = Array.isArray(toeflData) ? toeflData : DEFAULT_TOEFL;
  const phase = safeData.find(p => p.id === sel);

  const savePhase = (d: any) => {
    if (d.isNew) {
      const np: ToeflPhase = {
        id: `cpns_${Date.now()}`,
        title: d.title,
        category: d.category || 'TWK',
        desc: d.desc || '',
        color: d.color || '#a855f7',
        items: []
      };
      setToeflData(p => [...(Array.isArray(p) ? p : DEFAULT_TOEFL), np]);
    } else {
      setToeflData(p => (Array.isArray(p) ? p : DEFAULT_TOEFL).map(x => (x.id === d.id ? { ...x, ...d } : x)));
    }
    setEditPhase(null);
  };

  const delPhase = (id: string) => {
    setConfirmDialog({ type: 'delete_phase', id, title: 'Hapus Modul CPNS?', desc: 'Modul materi ini akan dihapus secara permanen.' });
  };

  const execDelPhase = (id: string) => {
    setToeflData(p => (Array.isArray(p) ? p : DEFAULT_TOEFL).filter(x => x.id !== id));
    if (sel === id) setSel(null);
    setConfirmDialog(null);
  };

  const saveItem = (d: any) => {
    if (!sel) return;
    setToeflData(p =>
      (Array.isArray(p) ? p : DEFAULT_TOEFL).map(ph => {
        if (ph.id !== sel) return ph;
        const items = ph.items || [];
        if (d.isNew) {
          const newItem: ToeflItem = {
            id: `item_${Date.now()}`,
            title: d.title,
            duration: d.duration || '30m',
            source: d.source || '',
            notes: d.notes || '',
            url: d.url || ''
          };
          return { ...ph, items: [...items, newItem] };
        } else {
          return {
            ...ph,
            items: items.map(it => (it.id === d.id ? { ...it, ...d } : it))
          };
        }
      })
    );
    setEditItem(null);
  };

  const delItem = (itemId: string) => {
    setConfirmDialog({ type: 'delete_item', itemId, title: 'Hapus Sub-Materi?', desc: 'Sub-materi ini akan dihapus.' });
  };

  const execDelItem = (itemId: string) => {
    if (!sel) return;
    setToeflData(p =>
      (Array.isArray(p) ? p : DEFAULT_TOEFL).map(ph => {
        if (ph.id !== sel) return ph;
        return { ...ph, items: (ph.items || []).filter(i => i.id !== itemId) };
      })
    );
    setConfirmDialog(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="between">
        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Daftar Modul & Silabus SKD CPNS
        </span>
        <button
          className="btn btn-purple"
          style={{ padding: '6px 14px', fontSize: 12 }}
          onClick={() => setEditPhase({ isNew: true, title: '', category: 'TWK', desc: '', color: '#a855f7' })}
        >
          + Tambah Modul
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {safeData.map(ph => (
          <div
            key={ph.id}
            onClick={() => setSel(sel === ph.id ? null : ph.id)}
            style={{
              padding: '14px',
              borderRadius: 12,
              background: sel === ph.id ? 'var(--surface)' : 'var(--surface2)',
              border: `1px solid ${sel === ph.id ? ph.color : 'var(--border)'}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}
          >
            <div className="between">
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: `${ph.color}20`,
                  color: ph.color,
                  textTransform: 'uppercase'
                }}
              >
                {ph.category}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>
                {(ph.items || []).length} Sub-Materi
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{ph.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.4 }}>{ph.desc}</div>
          </div>
        ))}
      </div>

      {phase && (
        <div style={{ marginTop: 12, padding: '16px', borderRadius: 12, background: 'var(--surface)', border: `1px solid ${phase.color}40`, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="between" style={{ flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: phase.color, textTransform: 'uppercase' }}>{phase.category}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)' }}>{phase.title}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditPhase({ isNew: false, ...phase })}>
                <Icon name="pencil" size={14} /> Edit Modul
              </button>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--purple)' }} onClick={() => setEditItem({ isNew: true, title: '', duration: '30m', source: '', notes: '', url: '' })}>
                + Tambah Sub-Materi
              </button>
              <button className="btn btn-red" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => delPhase(phase.id)}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(phase.items || []).map((it, idx) => (
              <div
                key={it.id || idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 6, background: `${phase.color}15`, color: phase.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{it.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                    {it.duration && <span>⏱ {it.duration}</span>}
                    {it.source && <span>📚 {it.source}</span>}
                    {it.notes && <span>💡 {it.notes}</span>}
                  </div>
                </div>
                {it.url && (
                  <a href={it.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-hover)', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="ext" size={12} />
                  </a>
                )}
                <button className="icon-btn" onClick={() => setEditItem({ isNew: false, ...it })}>
                  <Icon name="pencil" size={14} />
                </button>
                <button className="icon-btn red" onClick={() => delItem(it.id)}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {editPhase && (
        <Modal open={!!editPhase} onClose={() => setEditPhase(null)} title={editPhase.isNew ? 'Tambah Modul CPNS' : 'Edit Modul CPNS'}>
          <form
            onSubmit={e => {
              e.preventDefault();
              savePhase(editPhase);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div>
              <span className="label">Kategori SKD</span>
              <select
                value={editPhase.category || 'TWK'}
                onChange={e => setEditPhase({ ...editPhase, category: e.target.value })}
                className="inp"
              >
                <option value="TWK">TWK (Tes Wawasan Kebangsaan)</option>
                <option value="TIU">TIU (Tes Inteligensia Umum)</option>
                <option value="TKP">TKP (Tes Karakteristik Pribadi)</option>
                <option value="STRATEGY">Strategi & Manajemen Waktu</option>
                <option value="TRYOUT">Simulasi & Tryout SKD</option>
              </select>
            </div>
            <div>
              <span className="label">Judul Modul</span>
              <input
                value={editPhase.title || ''}
                onChange={e => setEditPhase({ ...editPhase, title: e.target.value })}
                className="inp"
                required
                placeholder="Contoh: TWK - Pilar Negara & UUD 1945"
              />
            </div>
            <div>
              <span className="label">Deskripsi Ringkas</span>
              <textarea
                value={editPhase.desc || ''}
                onChange={e => setEditPhase({ ...editPhase, desc: e.target.value })}
                className="inp"
                rows={2}
                placeholder="Penjelasan cakupan materi dan tips penting..."
              />
            </div>
            <div>
              <span className="label">Warna Aksen</span>
              <input
                type="color"
                value={editPhase.color || '#a855f7'}
                onChange={e => setEditPhase({ ...editPhase, color: e.target.value })}
                style={{ width: '100%', height: 38, borderRadius: 8, background: 'transparent', cursor: 'pointer', border: '1px solid var(--border)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setEditPhase(null)} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
              <button type="submit" className="btn btn-purple" style={{ flex: 2 }}>Simpan Modul</button>
            </div>
          </form>
        </Modal>
      )}

      {editItem && (
        <Modal open={!!editItem} onClose={() => setEditItem(null)} title={editItem.isNew ? 'Tambah Sub-Materi' : 'Edit Sub-Materi'}>
          <form
            onSubmit={e => {
              e.preventDefault();
              saveItem(editItem);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div>
              <span className="label">Judul Sub-Materi / Topik Soal</span>
              <input
                value={editItem.title || ''}
                onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                className="inp"
                required
                placeholder="Contoh: Silogisme & Penarikan Kesimpulan (Modus Ponens/Tollens)"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <span className="label">Estimasi Waktu</span>
                <input
                  value={editItem.duration || ''}
                  onChange={e => setEditItem({ ...editItem, duration: e.target.value })}
                  className="inp"
                  placeholder="30m / 45m"
                />
              </div>
              <div>
                <span className="label">Sumber / Tipe</span>
                <input
                  value={editItem.source || ''}
                  onChange={e => setEditItem({ ...editItem, source: e.target.value })}
                  className="inp"
                  placeholder="Video / Bank Soal / PDF"
                />
              </div>
            </div>
            <div>
              <span className="label">Catatan / Kunci Hafalan</span>
              <input
                value={editItem.notes || ''}
                onChange={e => setEditItem({ ...editItem, notes: e.target.value })}
                className="inp"
                placeholder="Tips trik cepat, rumus praktis, dll"
              />
            </div>
            <div>
              <span className="label">URL Materi / YouTube / Tryout Link (Opsional)</span>
              <input
                value={editItem.url || ''}
                onChange={e => setEditItem({ ...editItem, url: e.target.value })}
                className="inp"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setEditItem(null)} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
              <button type="submit" className="btn btn-purple" style={{ flex: 2 }}>Simpan Sub-Materi</button>
            </div>
          </form>
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
                  if (confirmDialog.type === 'delete_item') execDelItem(confirmDialog.itemId);
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
        const newItems = (data.bulkItems || []).map((b: any) => ({
          name: b.name || 'Gerakan Fisik',
          detail: b.detail || '3 x 10',
          target: b.target || day.focus || 'Fisik',
          category: 'primary'
        }));
        return { ...s, [activeDay]: { ...d, exercises: [...list, ...newItems] } };
      }

      if (data.isNew) return { ...s, [activeDay]: { ...d, exercises: [...list, { name: data.name, detail: data.detail, target: data.target, category: 'primary' }] } };
      return { ...s, [activeDay]: { ...d, exercises: list.map((e, i) => (i === data.index ? { name: data.name, detail: data.detail, target: data.target, category: 'primary' } : e)) } };
    });
    setEditEx(null);
  };

  const delEx = (i: number) => {
    setConfirmDialog({ index: i, title: 'Hapus Gerakan?', desc: 'Gerakan latihan ini akan dihapus dari jadwal fisik.' });
  };

  const execDelEx = (i: number) => {
    setWorkout(p => {
      const s = typeof p === 'object' && !Array.isArray(p) ? p : DEFAULT_WORKOUT;
      const d = s[activeDay] || { exercises: [] };
      const list = [...(d.exercises || [])];
      list.splice(i, 1);
      return { ...s, [activeDay]: { ...d, exercises: list } };
    });
    setConfirmDialog(null);
  };

  const exercises = day.exercises || [];

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
          <input value={day.type || ''} onChange={e => saveMeta('type', e.target.value)} className="inp" placeholder="PULL DAY..." />
        </div>
        <div>
          <span className="label">Fokus Otot / Latihan</span>
          <input value={day.focus || ''} onChange={e => saveMeta('focus', e.target.value)} className="inp" placeholder="Back & Biceps..." />
        </div>
      </div>

      <div className="between" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Gerakan Utama ({exercises.length})
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
        {exercises.map((ex, i) => (
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
        <Modal open={!!editEx} onClose={() => setEditEx(null)} title={editEx.isBulk ? `AI Bulk Import Fisik — ${activeDay}` : editEx.isNew ? `Tambah Gerakan — ${activeDay}` : 'Edit Gerakan'}>
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
          <span className="label">Fokus Belajar CPNS</span>
          <input value={day.type || ''} onChange={e => saveMeta('type', e.target.value)} className="inp" placeholder="TWK & TIU..." />
        </div>
        <div>
          <span className="label">Detail Sub-Fokus</span>
          <input value={day.focus || ''} onChange={e => saveMeta('focus', e.target.value)} className="inp" placeholder="Pancasila & Deret Angka..." />
        </div>
      </div>

      <div className="between" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Misi Belajar ({tasks.length})
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '6px 10px', fontSize: 11, color: 'var(--red)' }}
            onClick={() => {
              if (window.confirm('Reset seluruh jadwal CPNS ke Protokol Ekstrem (Target 450+)?')) {
                setToeflSched(DEFAULT_TOEFL_SCHEDULE);
              }
            }}
          >
            ⚡ Template Ekstrem 450+
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12, color: 'var(--purple)' }} onClick={() => setEditTask({ isNew: true, isBulk: true, dayKey: activeDay })}>
            <Icon name="sparkles" size={14} /> AI Bulk Import
          </button>
          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setEditTask({ isNew: true, index: -1, name: '', detail: '', time: '' })}>
            + Tambah Misi
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
        <Modal open={!!editTask} onClose={() => setEditTask(null)} title={editTask.isBulk ? `AI Bulk Import CPNS — ${activeDay}` : editTask.isNew ? `Tambah Misi CPNS — ${activeDay}` : 'Edit Misi Belajar'}>
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
      if (!res.ok) throw new Error('Failed to bulk parse CPNS task');
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
        <span className="label">Paste Daftar Misi Belajar CPNS Mentah</span>
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
        <button type="submit" className="btn btn-purple" style={{ flex: 2 }} disabled={loading}>
          {loading ? <span className="spin-it"><Icon name="loader" /></span> : <Icon name="sparkles" />}
          {loading ? ' Memproses Jadwal CPNS...' : ' AI Eksekusi Import'}
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
        <span className="label">Nama Misi Belajar</span>
        <input value={name} onChange={e => setName(e.target.value)} className="inp" required placeholder="Latihan 30 Soal TIU Berhitung Cepat..." />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <span className="label">Instruksi / Catatan</span>
          <input value={detail} onChange={e => setDetail(e.target.value)} className="inp" required placeholder="Gunakan trik penyederhanaan pecahan..." />
        </div>
        <div>
          <span className="label">Durasi Waktu</span>
          <input value={time} onChange={e => setTime(e.target.value)} className="inp" required placeholder="30m" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>Batal</button>
        <button type="submit" className="btn btn-purple" style={{ flex: 2 }}>Simpan</button>
      </div>
    </form>
  );
};
