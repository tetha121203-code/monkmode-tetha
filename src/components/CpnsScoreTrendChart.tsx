import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { TryoutRecord } from '../types';
import { Icon } from './Icon';
import { Modal } from './Modal';

interface CpnsScoreTrendChartProps {
  tryouts: TryoutRecord[];
  onAddTryout?: (record: TryoutRecord) => void;
  onNavigateToCockpit?: () => void;
}

type ViewMode = 'all' | 'total' | 'twk' | 'tiu' | 'tkp';

export const CpnsScoreTrendChart: React.FC<CpnsScoreTrendChartProps> = ({
  tryouts,
  onAddTryout,
  onNavigateToCockpit
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State for quick tryout logging
  const [toName, setToName] = useState('');
  const [toTwk, setToTwk] = useState<number>(85);
  const [toTiu, setToTiu] = useState<number>(115);
  const [toTkp, setToTkp] = useState<number>(185);
  const [toNotes, setToNotes] = useState('');

  // Process and sort tryouts by date / chronological order
  const sortedTryouts = [...tryouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = sortedTryouts.map((t, index) => {
    const total = t.twk + t.tiu + t.tkp;
    const twkPassed = t.twk >= 65;
    const tiuPassed = t.tiu >= 80;
    const tkpPassed = t.tkp >= 166;
    const allPassed = twkPassed && tiuPassed && tkpPassed;

    // Formatting date label (e.g., "04 Agu" or "TO #1")
    const d = new Date(t.date);
    const dateFormatted = isNaN(d.getTime())
      ? t.date
      : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    return {
      id: t.id,
      name: t.name,
      shortName: `TO #${index + 1}`,
      date: t.date,
      dateFormatted,
      twk: t.twk,
      tiu: t.tiu,
      tkp: t.tkp,
      total,
      twkPassed,
      tiuPassed,
      tkpPassed,
      allPassed,
      notes: t.notes
    };
  });

  // Calculate statistics
  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const previous = chartData.length > 1 ? chartData[chartData.length - 2] : null;
  const totalScores = chartData.map(d => d.total);
  const highestTotal = totalScores.length > 0 ? Math.max(...totalScores) : 0;
  const avgTotal = totalScores.length > 0 ? Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length) : 0;
  const scoreDiff = latest && previous ? latest.total - previous.total : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddTryout) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord: TryoutRecord = {
      id: `to_${Date.now()}`,
      name: toName.trim() || `Tryout Mandiri #${chartData.length + 1}`,
      date: todayStr,
      twk: Number(toTwk) || 0,
      tiu: Number(toTiu) || 0,
      tkp: Number(toTkp) || 0,
      notes: toNotes.trim()
    };

    onAddTryout(newRecord);
    setToName('');
    setToNotes('');
    setModalOpen(false);
  };

  // Custom recharts tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          id="cpns-chart-tooltip"
          style={{
            background: 'rgba(12, 18, 32, 0.96)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(59, 130, 246, 0.15)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 12,
            color: 'var(--text)',
            minWidth: 220,
            backdropFilter: 'blur(8px)'
          }}
        >
          <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: 14, marginBottom: 2 }}>
            {data.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8, fontWeight: 500 }}>
            {data.date} ({data.shortName})
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, color: 'var(--text2)' }}>Skor Total:</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: data.allPassed ? (data.total >= 400 ? 'var(--green)' : 'var(--blue-hover)') : 'var(--red)' }}>
              {data.total} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#60a5fa' }}>
              <span>TWK (Ambang: 65):</span>
              <span style={{ fontWeight: 800 }}>
                {data.twk} <span style={{ fontSize: 10, color: data.twkPassed ? 'var(--green)' : 'var(--red)' }}>({data.twkPassed ? '✓ Lolos' : '✗ Di Bawah'})</span>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8' }}>
              <span>TIU (Ambang: 80):</span>
              <span style={{ fontWeight: 800 }}>
                {data.tiu} <span style={{ fontSize: 10, color: data.tiuPassed ? 'var(--green)' : 'var(--red)' }}>({data.tiuPassed ? '✓ Lolos' : '✗ Di Bawah'})</span>
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
              <span>TKP (Ambang: 166):</span>
              <span style={{ fontWeight: 800 }}>
                {data.tkp} <span style={{ fontSize: 10, color: data.tkpPassed ? 'var(--green)' : 'var(--red)' }}>({data.tkpPassed ? '✓ Lolos' : '✗ Di Bawah'})</span>
              </span>
            </div>
          </div>

          {data.notes && (
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text2)', fontStyle: 'italic' }}>
              "{data.notes}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, border: '1px solid var(--blue-border)' }}>
      {/* Top Header & Actions */}
      <div className="between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
            PROGRESSION & TRYOUT ANALYZER
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
            Tren Nilai Latihan SKD CPNS
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2, fontWeight: 500 }}>
            Visualisasi skor akumulatif terhadap ambang batas kelulusan (KepmenPAN-RB).
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {onAddTryout && (
            <button
              onClick={() => {
                setToName(`Tryout Mandiri #${chartData.length + 1}`);
                setModalOpen(true);
              }}
              className="btn btn-blue"
              style={{ fontSize: 12, padding: '7px 14px', fontWeight: 700 }}
            >
              <Icon name="plus" size={13} /> + Catat Tryout
            </button>
          )}

          {onNavigateToCockpit && (
            <button
              onClick={onNavigateToCockpit}
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '7px 12px' }}
              title="Buka Bank Tryout & Cheatsheet"
            >
              Cockpit Tryout →
            </button>
          )}
        </div>
      </div>

      {/* Metric Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        <div style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Skor Terkini
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: latest?.allPassed ? (latest.total >= 400 ? 'var(--green)' : 'var(--blue-hover)') : 'var(--red)', marginTop: 2 }}>
            {latest ? latest.total : 0} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
          </div>
          <div style={{ fontSize: 10, color: scoreDiff >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700, marginTop: 2 }}>
            {scoreDiff > 0 ? `+${scoreDiff} vs sebelumnya` : scoreDiff < 0 ? `${scoreDiff} vs sebelumnya` : 'Simulasi awal'}
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Skor Tertinggi
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginTop: 2 }}>
            {highestTotal} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
          </div>
          <div style={{ fontSize: 10, color: highestTotal >= 400 ? 'var(--green)' : 'var(--blue-hover)', fontWeight: 700, marginTop: 2 }}>
            {highestTotal >= 400 ? '★ Zona Lolos SKB' : 'Menuju Target 400+'}
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Rata-Rata Skor
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)', marginTop: 2 }}>
            {avgTotal} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            {chartData.length} Simulasi tercatat
          </div>
        </div>

        <div style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Status Passing Grade
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: latest?.allPassed ? 'var(--green)' : 'var(--red)', marginTop: 4 }}>
            {latest?.allPassed ? (latest.total >= 400 ? '✓ AMAN TOP RANKING' : '✓ LOLOS AMBANG BATAS') : '✗ BELUM LOLOS'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Target Minimal: TWK 65, TIU 80, TKP 166
          </div>
        </div>
      </div>

      {/* Mode Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {[
          { id: 'all', label: 'Semua Subtes (Total & Breakdowns)' },
          { id: 'total', label: 'Skor Total (Target 400+)' },
          { id: 'twk', label: 'TWK (Ambang 65)' },
          { id: 'tiu', label: 'TIU (Ambang 80)' },
          { id: 'tkp', label: 'TKP (Ambang 166)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as ViewMode)}
            className={`btn ${viewMode === tab.id ? 'btn-blue' : 'btn-ghost'}`}
            style={{ fontSize: 11, padding: '5px 12px', whiteSpace: 'nowrap', fontWeight: 700 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recharts Line Chart Container */}
      <div style={{ width: '100%', height: 290, marginTop: 4 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 12, right: 16, left: -14, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              
              <XAxis
                dataKey="dateFormatted"
                stroke="var(--text3)"
                tick={{ fill: 'var(--text3)', fontSize: 11, fontWeight: 600 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
              />

              <YAxis
                domain={
                  viewMode === 'total'
                    ? [200, 550]
                    : viewMode === 'twk'
                    ? [40, 150]
                    : viewMode === 'tiu'
                    ? [50, 175]
                    : viewMode === 'tkp'
                    ? [140, 225]
                    : [40, 550]
                }
                stroke="var(--text3)"
                tick={{ fill: 'var(--text3)', fontSize: 11 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                iconType="circle"
              />

              {/* Reference Lines for Thresholds */}
              {(viewMode === 'all' || viewMode === 'total') && (
                <>
                  <ReferenceLine
                    y={311}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Ambang Batas (311)',
                      fill: '#f59e0b',
                      fontSize: 10,
                      position: 'insideBottomRight',
                      fontWeight: 700
                    }}
                  />
                  <ReferenceLine
                    y={400}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Target Ranking SKB (400)',
                      fill: '#10b981',
                      fontSize: 10,
                      position: 'insideTopRight',
                      fontWeight: 700
                    }}
                  />
                </>
              )}

              {viewMode === 'twk' && (
                <ReferenceLine
                  y={65}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Passing Grade TWK (65)',
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideBottomRight',
                    fontWeight: 700
                  }}
                />
              )}

              {viewMode === 'tiu' && (
                <ReferenceLine
                  y={80}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Passing Grade TIU (80)',
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideBottomRight',
                    fontWeight: 700
                  }}
                />
              )}

              {viewMode === 'tkp' && (
                <ReferenceLine
                  y={166}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Passing Grade TKP (166)',
                    fill: '#ef4444',
                    fontSize: 10,
                    position: 'insideBottomRight',
                    fontWeight: 700
                  }}
                />
              )}

              {/* Dynamic Line Renderers based on Selected View Mode */}
              {(viewMode === 'all' || viewMode === 'total') && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Skor Total SKD"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#070a12' }}
                  activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {(viewMode === 'all' || viewMode === 'twk') && (
                <Line
                  type="monotone"
                  dataKey="twk"
                  name="TWK (Min: 65)"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#818cf8', strokeWidth: 1.5, stroke: '#070a12' }}
                  activeDot={{ r: 5, fill: '#a5b4fc', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {(viewMode === 'all' || viewMode === 'tiu') && (
                <Line
                  type="monotone"
                  dataKey="tiu"
                  name="TIU (Min: 80)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#38bdf8', strokeWidth: 1.5, stroke: '#070a12' }}
                  activeDot={{ r: 5, fill: '#7dd3fc', stroke: '#fff', strokeWidth: 2 }}
                />
              )}

              {(viewMode === 'all' || viewMode === 'tkp') && (
                <Line
                  type="monotone"
                  dataKey="tkp"
                  name="TKP (Min: 166)"
                  stroke="#34d399"
                  strokeWidth={2}
                  dot={{ r: 3.5, fill: '#34d399', strokeWidth: 1.5, stroke: '#070a12' }}
                  activeDot={{ r: 5, fill: '#6ee7b7', stroke: '#fff', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13, background: 'var(--surface2)', borderRadius: 10 }}>
            Belum ada data tryout. Catat simulasi pertama untuk melihat grafik tren.
          </div>
        )}
      </div>

      {/* Threshold Guide Footer */}
      <div className="between" style={{ paddingTop: 10, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 8, fontSize: 11, color: 'var(--text3)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span><span style={{ color: '#f59e0b', fontWeight: 800 }}>---</span> Ambang Batas Minimal: <b>311</b></span>
          <span><span style={{ color: '#10b981', fontWeight: 800 }}>---</span> Target Aman Ranking SKB: <b>400+</b></span>
        </div>
        <span style={{ color: 'var(--blue-hover)', fontWeight: 600 }}>
          {chartData.length} Evaluasi Berkala Terdata
        </span>
      </div>

      {/* Quick Add Tryout Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Catat Skor Tryout Baru">
        <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Nama Paket / Simulasi</label>
            <input
              type="text"
              value={toName}
              onChange={e => setToName(e.target.value)}
              className="inp"
              placeholder="Contoh: Tryout Mandiri CAT #6"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <div>
              <label className="label" style={{ color: '#818cf8' }}>TWK (Min: 65)</label>
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
              <label className="label" style={{ color: '#38bdf8' }}>TIU (Min: 80)</label>
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
              <label className="label" style={{ color: '#34d399' }}>TKP (Min: 166)</label>
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
            <label className="label">Catatan Evaluasi (Opsional)</label>
            <input
              type="text"
              value={toNotes}
              onChange={e => setToNotes(e.target.value)}
              className="inp"
              placeholder="Contoh: Kecepatan deret meningkat, TWK stabil"
            />
          </div>

          {/* Quick Total Calculation Preview */}
          {(() => {
            const tot = Number(toTwk || 0) + Number(toTiu || 0) + Number(toTkp || 0);
            const pass = Number(toTwk) >= 65 && Number(toTiu) >= 80 && Number(toTkp) >= 166;
            return (
              <div className="between" style={{ background: 'var(--surface2)', padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700 }}>PREVIEW TOTAL</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: pass ? (tot >= 400 ? 'var(--green)' : 'var(--blue-hover)') : 'var(--red)' }}>
                    {tot} <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-blue" style={{ padding: '8px 20px', fontWeight: 700 }}>
                  Simpan & Update Grafik
                </button>
              </div>
            );
          })()}
        </form>
      </Modal>
    </div>
  );
};
