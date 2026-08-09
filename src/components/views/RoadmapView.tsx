import React, { useState } from 'react';
import { RoadmapPhase, RoadmapProgress } from '../../types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';
import { ProgressBar } from '../ProgressBar';

interface RoadmapViewProps {
  safeRM: RoadmapPhase[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapPhase[]>>;
  safeRprog: RoadmapProgress;
  toggleRprog: (id: string) => void;
  roadPhase: string | null;
  setRoadPhase: (id: string | null) => void;
  setSettTab: (tab: string) => void;
  setSettOpen: (open: boolean) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  safeRM,
  setRoadmap,
  safeRprog,
  toggleRprog,
  roadPhase,
  setRoadPhase,
  setSettTab,
  setSettOpen,
}) => {
  const active = safeRM.find(p => p.id === roadPhase);
  const totalAll = safeRM.reduce((a, p) => a + (p.videos || []).length + (p.casestudies || []).length, 0);
  const totalDone = Object.keys(safeRprog).filter(k => safeRprog[k]).length;

  const [editingDeadline, setEditingDeadline] = useState<{ phaseId: string; title: string; currentDate: string } | null>(null);
  const [newDateVal, setNewDateVal] = useState<string>('');

  const formatDeadlineText = (dStr?: string) => {
    if (!dStr) return 'Belum diatur';
    // If YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dStr)) {
      const [y, m, d] = dStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    return dStr;
  };

  const saveDeadline = () => {
    if (!editingDeadline) return;
    setRoadmap(prev =>
      prev.map(p => (p.id === editingDeadline.phaseId ? { ...p, targetDeadline: newDateVal || p.targetDeadline } : p))
    );
    setEditingDeadline(null);
  };

  return (
    <div className="fade-up">
      <div className="between" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Data Analyst Mastery Roadmap
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
            Master Excel, SQL, Power BI, Python & Real-World Projects · Target Deadline Customizable
          </div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => {
            setSettTab('roadmap');
            setSettOpen(true);
          }}
        >
          <Icon name="settings" /> Kelola Modul
        </button>
      </div>

      <div className="card card-p" style={{ marginBottom: 24, border: '1px solid rgba(168, 85, 247, 0.3)', background: 'linear-gradient(135deg, rgba(7, 12, 30, 0.95) 0%, rgba(14, 23, 50, 0.88) 100%)' }}>
        <div className="between" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Penguasaan Materi Data Analyst
          </span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8', textShadow: '0 0 12px rgba(56, 189, 248, 0.5)' }}>
            {Math.round((totalDone / Math.max(totalAll, 1)) * 100)}%
          </span>
        </div>
        <ProgressBar cur={totalDone} tot={totalAll} />
      </div>

      <div className="grid2">
        {safeRM.map((p, idx) => {
          const all = [...(p.videos || []).map(v => v.id), ...(p.casestudies || []).map(c => c.id)];
          const done = all.filter(id => safeRprog[id]).length;
          const pct = Math.round((done / (all.length || 1)) * 100);
          return (
            <div
              key={p.id}
              className="card"
              style={{
                cursor: 'pointer',
                position: 'relative',
                border: `1px solid ${p.color ? p.color + '40' : 'rgba(168, 85, 247, 0.25)'}`,
                transition: 'all 0.25s ease'
              }}
              onClick={() => setRoadPhase(p.id)}
            >
              <div className="between" style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: `${p.color || '#a855f7'}18`,
                      border: `1px solid ${p.color || '#a855f7'}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      fontWeight: 900,
                      color: p.color || '#a855f7',
                      flexShrink: 0,
                      boxShadow: `0 0 12px ${p.color || '#a855f7'}30`
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                      Week {p.week} · {(p.videos || []).length} video · {(p.casestudies || []).length} project
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: 20, fontWeight: 900, color: pct === 100 ? '#22c55e' : '#38bdf8' }}>
                  {pct}%
                </span>
              </div>

              <ProgressBar cur={done} tot={all.length} />

              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12, fontWeight: 500, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800, color: '#ffffff' }}>{done}/{all.length} selesai</span> — {p.desc}
              </div>

              {/* Target Deadline Badge & Customize Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  paddingTop: 10,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 800,
                    color: p.targetDeadline ? '#a855f7' : '#64748b',
                    background: p.targetDeadline ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: `1px solid ${p.targetDeadline ? 'rgba(168, 85, 247, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`
                  }}
                >
                  <Icon name="calendar" size={13} style={{ color: p.targetDeadline ? '#a855f7' : '#64748b' }} />
                  <span>Target Deadline: {formatDeadlineText(p.targetDeadline)}</span>
                </div>

                <button
                  className="icon-btn"
                  title="Atur / Customize Target Deadline"
                  style={{ width: 28, height: 28, borderRadius: 6 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDeadline({
                      phaseId: p.id,
                      title: p.title,
                      currentDate: p.targetDeadline || ''
                    });
                    setNewDateVal(p.targetDeadline || '');
                  }}
                >
                  <Icon name="edit" size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Deadline Customizer Modal */}
      <Modal
        open={!!editingDeadline}
        onClose={() => setEditingDeadline(null)}
        title={`Customize Target Deadline — ${editingDeadline?.title || ''}`}
      >
        {editingDeadline && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
              Tentukan target tanggal batas penguasaan materi <b style={{ color: '#ffffff' }}>{editingDeadline.title}</b>.
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', width: '100%', fontWeight: 700 }}>Quick Preset:</span>
              {[
                { label: '16 Agt 2026', val: '2026-08-16' },
                { label: '30 Agt 2026', val: '2026-08-30' },
                { label: '13 Sep 2026', val: '2026-09-13' },
                { label: '27 Sep 2026', val: '2026-09-27' },
                { label: '18 Okt 2026', val: '2026-10-18' }
              ].map(p => (
                <button
                  key={p.val}
                  type="button"
                  className="btn btn-ghost"
                  style={{ padding: '4px 10px', fontSize: 11, borderRadius: 6, border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc' }}
                  onClick={() => setNewDateVal(p.val)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div>
              <label className="label">Pilih Tanggal Target Deadline</label>
              <input
                type="date"
                className="inp"
                value={newDateVal}
                onChange={e => setNewDateVal(e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="label">Atau Ketik Format Bebas (misal: "15 Agustus 2026")</label>
              <input
                type="text"
                className="inp"
                placeholder="misal: 15 Agustus 2026"
                value={newDateVal}
                onChange={e => setNewDateVal(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button className="btn btn-ghost" onClick={() => setEditingDeadline(null)}>
                Batal
              </button>
              <button className="btn btn-blue" onClick={saveDeadline}>
                Simpan Target Deadline
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!active} onClose={() => setRoadPhase(null)} title={active?.title || ''} wide>
        {active && (() => {
          const pvids = active.videos || [];
          const pcases = active.casestudies || [];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {active.pl && (
                <a
                  href={active.pl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: '#0e1732',
                    border: `1px solid ${active.color || '#38bdf8'}50`,
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: '#ffffff',
                    transition: 'all 0.2s',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff' }}>
                      BUKA PLAYLIST EKSEKUSI DATA ANALYST
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4, fontWeight: 600 }}>
                      {pvids.length} video · {pcases.length} project
                    </div>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `${active.color || '#38bdf8'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active.color || '#38bdf8' }}>
                    <Icon name="play" size={18} />
                  </div>
                </a>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, flex: 1 }}>{active.desc}</p>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: 'rgba(168, 85, 247, 0.15)',
                    color: '#a855f7',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setEditingDeadline({
                      phaseId: active.id,
                      title: active.title,
                      currentDate: active.targetDeadline || ''
                    });
                    setNewDateVal(active.targetDeadline || '');
                  }}
                >
                  <Icon name="calendar" size={14} />
                  <span>Target Deadline: {formatDeadlineText(active.targetDeadline)}</span>
                  <Icon name="edit" size={12} style={{ color: '#38bdf8' }} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                  VIDEO MODUL ({pvids.filter(v => safeRprog[v.id]).length}/{pvids.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                  {pvids.map((v, i) => {
                    const done = safeRprog[v.id];
                    return (
                      <div
                        key={v.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          borderRadius: 8,
                          border: `1px solid ${done ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                          background: done ? 'rgba(56, 189, 248, 0.1)' : '#0e1732',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => toggleRprog(v.id)}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 5,
                            border: `1px solid ${done ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)'}`,
                            background: done ? '#38bdf8' : '#070c1e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {done && <Icon name="check" size={12} style={{ color: '#070c1e' }} />}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            fontSize: 13,
                            fontWeight: 700,
                            color: done ? '#64748b' : '#ffffff',
                            textDecoration: done ? 'line-through' : 'none'
                          }}
                        >
                          {i + 1}. {v.title}
                        </div>
                        {v.url && (
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn"
                            style={{ width: 28, height: 28, flexShrink: 0 }}
                            onClick={e => e.stopPropagation()}
                          >
                            <Icon name="play" size={14} />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {pcases.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    REAL-WORLD PROJECTS ({pcases.filter(c => safeRprog[c.id]).length}/{pcases.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {pcases.map(cs => {
                      const done = safeRprog[cs.id];
                      return (
                        <div
                          key={cs.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '12px 16px',
                            borderRadius: 8,
                            border: `1px solid ${done ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                            background: done ? 'rgba(34, 197, 94, 0.1)' : '#0e1732',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => toggleRprog(cs.id)}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 5,
                              border: `1px solid ${done ? '#22c55e' : 'rgba(255, 255, 255, 0.2)'}`,
                              background: done ? '#22c55e' : '#070c1e',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: 2
                            }}
                          >
                            {done && <Icon name="check" size={12} style={{ color: '#070c1e' }} />}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: done ? '#64748b' : '#ffffff',
                                textDecoration: done ? 'line-through' : 'none',
                                marginBottom: 4
                              }}
                            >
                              {cs.title}
                            </div>
                            {cs.desc && <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{cs.desc}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
};
