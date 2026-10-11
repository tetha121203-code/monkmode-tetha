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

  // Form State for quick evaluation logging
  const [toName, setToName] = useState('');
  const [toTwk, setToTwk] = useState<number>(85);
  const [toTiu, setToTiu] = useState<number>(115);
  const [toTkp, setToTkp] = useState<number>(185);
  const [toNotes, setToNotes] = useState('');

  // Process and sort evaluations by date / chronological order
  const sortedTryouts = [...tryouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = sortedTryouts.map((t, index) => {
    const total = t.twk + t.tiu + t.tkp;
    const twkPassed = t.twk >= 65;
    const tiuPassed = t.tiu >= 80;
    const tkpPassed = t.tkp >= 166;
    const allPassed = twkPassed && tiuPassed && tkpPassed;

    // Formatting date label (e.g., "04 Agu" or "BM #1")
    const d = new Date(t.date);
    const dateFormatted = isNaN(d.getTime())
      ? t.date
      : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    return {
      id: t.id,
      name: t.name,
      shortName: `BM #${index + 1}`,
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
      name: toName.trim() || `Evaluasi Benchmark #${chartData.length + 1}`,
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
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          id="benchmark-chart-tooltip"
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
            <span style={{ fontSize: 16, fontWeight: 900, color: data.allPassed ? 'var(--green-hover)' : 'var(--red-hover)' }}>
              {data.total} / 550
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--cyan)' }}>• Fokus & Disiplin:</span>
              <span style={{ fontWeight: 700 }}>{data.twk} (Min 65)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--blue-hover)' }}>• Problem Solving & Logika:</span>
              <span style={{ fontWeight: 700 }}>{data.tiu} (Min 80)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--purple-light)' }}>• Kualitas Eksekusi:</span>
              <span style={{ fontWeight: 700 }}>{data.tkp} (Min 166)</span>
            </div>
          </div>

          {data.notes && (
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px dashed var(--border)', fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>
              "{data.notes}"
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card glow-card-dual" style={{ display: 'flex', flexDirection: 'column', gap: 18, background: 'linear-gradient(135deg, rgba(9, 16, 36, 0.85) 0%, rgba(20, 13, 44, 0.85) 100%)' }}>
      {/* Top Header & Actions */}
      <div className="between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="glow-dot" style={{ background: 'var(--cyan)' }} />
              PERFORMANCE ANALYTICS 2026
            </div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cyan)', fontWeight: 800, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              LIVE BENCHMARK
            </span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', marginTop: 2 }}>
            Tren Evaluasi & Benchmark Performa 2026
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
            Tracking berkala metrik Fokus, Problem Solving, dan Kualitas Eksekusi hingga Akhir Tahun 2026
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {onAddTryout && (
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-dual"
              style={{ fontSize: 12, padding: '7px 14px', fontWeight: 800 }}
            >
              <Icon name="pencil" size={14} /> + Catat Benchmark
            </button>
          )}

          {onNavigateToCockpit && (
            <button
              onClick={onNavigateToCockpit}
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '7px 14px' }}
              title="Buka Modul Belajar & Framework"
            >
              Deep Work & Study →
            </button>
          )}
        </div>
      </div>

      {/* Metric Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>
        <div style={{ background: 'rgba(14, 23, 53, 0.8)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Skor Terkini
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: latest?.allPassed ? (latest.total >= 400 ? 'var(--green-hover)' : 'var(--cyan)') : 'var(--red-hover)', marginTop: 2 }}>
            {latest ? latest.total : 0} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
          </div>
          <div style={{ fontSize: 10, color: scoreDiff >= 0 ? 'var(--green-hover)' : 'var(--red-hover)', fontWeight: 800, marginTop: 3 }}>
            {scoreDiff > 0 ? `+${scoreDiff} vs sebelumnya` : scoreDiff < 0 ? `${scoreDiff} vs sebelumnya` : 'Evaluasi baseline'}
          </div>
        </div>

        <div style={{ background: 'rgba(14, 23, 53, 0.8)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Skor Tertinggi
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--purple-light)', marginTop: 2, textShadow: '0 0 12px rgba(168, 85, 247, 0.4)' }}>
            {highestTotal} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
          </div>
          <div style={{ fontSize: 10, color: highestTotal >= 400 ? 'var(--green-hover)' : 'var(--cyan)', fontWeight: 800, marginTop: 3 }}>
            {highestTotal >= 400 ? '★ Performa Puncak' : 'Menuju Target 400+'}
          </div>
        </div>

        <div style={{ background: 'rgba(14, 23, 53, 0.8)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Rata-Rata Skor
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
            {avgTotal} <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500 }}>/ 550</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, fontWeight: 600 }}>
            {chartData.length} Evaluasi tercatat
          </div>
        </div>

        <div style={{ background: 'rgba(14, 23, 53, 0.8)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Status Standar Monk Mode
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: latest?.allPassed ? 'var(--green-hover)' : 'var(--red-hover)', marginTop: 4 }}>
            {latest?.allPassed ? (latest.total >= 400 ? '✓ DISIPLIN TERTINGGI' : '✓ MEMENUHI BENCHMARK') : '✗ BELUM MEMENUHI'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>
            Ambang Batas: Fokus 65, Logika 80, Eksekusi 166
          </div>
        </div>
      </div>

      {/* Mode Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {[
          { id: 'all', label: 'Semua Metrik (Total & Rincian)' },
          { id: 'total', label: 'Total Skor (Target 400+)' },
          { id: 'twk', label: 'Fokus & Disiplin (Min 65)' },
          { id: 'tiu', label: 'Problem Solving & Logika (Min 80)' },
          { id: 'tkp', label: 'Kualitas Eksekusi (Min 166)' }
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
                      value: 'Target Puncak (400)',
                      fill: '#10b981',
                      fontSize: 10,
                      position: 'insideTopRight',
                      fontWeight: 700
                    }}
                  />
                </>
              )}

              {/* Lines rendering depending on viewMode */}
              {(viewMode === 'all' || viewMode === 'total') && (
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Skor Total"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#38bdf8', strokeWidth: 2, stroke: '#040714' }}
                  activeDot={{ r: 7, fill: '#38bdf8', strokeWidth: 3, stroke: '#ffffff' }}
                />
              )}

              {(viewMode === 'all' || viewMode === 'twk') && (
                <Line
                  type="monotone"
                  dataKey="twk"
                  name="Fokus & Disiplin"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  strokeDasharray={viewMode === 'all' ? '4 4' : undefined}
                  dot={{ r: 3, fill: '#60a5fa' }}
                />
              )}

              {(viewMode === 'all' || viewMode === 'tiu') && (
                <Line
                  type="monotone"
                  dataKey="tiu"
                  name="Problem Solving & Logika"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray={viewMode === 'all' ? '4 4' : undefined}
                  dot={{ r: 3, fill: '#a855f7' }}
                />
              )}

              {(viewMode === 'all' || viewMode === 'tkp') && (
                <Line
                  type="monotone"
                  dataKey="tkp"
                  name="Kualitas Eksekusi"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray={viewMode === 'all' ? '4 4' : undefined}
                  dot={{ r: 3, fill: '#10b981' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13, border: '1px dashed var(--border)', borderRadius: 10 }}>
            Belum ada data evaluasi. Klik "+ Catat Benchmark" untuk mulai memetakan grafik performa.
          </div>
        )}
      </div>

      {/* Quick Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Catat Hasil Benchmark Performa">
        <form onSubmit={handleQuickAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Nama Sesi Evaluasi</label>
            <input
              type="text"
              value={toName}
              onChange={e => setToName(e.target.value)}
              className="inp"
              placeholder={`Contoh: Benchmark Mandiri #${chartData.length + 1}`}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
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
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>Target: ≥ 65</span>
            </div>

            <div>
              <label className="label" style={{ color: 'var(--blue-hover)' }}>Logika (0–175)</label>
              <input
                type="number"
                min={0}
                max={175}
                value={toTiu}
                onChange={e => setToTiu(Number(e.target.value))}
                className="inp"
                required
              />
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>Target: ≥ 80</span>
            </div>

            <div>
              <label className="label" style={{ color: 'var(--purple-light)' }}>Eksekusi (0–225)</label>
              <input
                type="number"
                min={0}
                max={225}
                value={toTkp}
                onChange={e => setToTkp(Number(e.target.value))}
                className="inp"
                required
              />
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>Target: ≥ 166</span>
            </div>
          </div>

          {/* Quick Preview Total */}
          <div className="between" style={{ background: 'var(--surface2)', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Perhitungan Total Skor:</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: (Number(toTwk) + Number(toTiu) + Number(toTkp)) >= 400 ? 'var(--green-hover)' : 'var(--cyan)' }}>
              {Number(toTwk || 0) + Number(toTiu || 0) + Number(toTkp || 0)} / 550
            </span>
          </div>

          <div>
            <label className="label">Catatan Refleksi (Opsional)</label>
            <input
              type="text"
              value={toNotes}
              onChange={e => setToNotes(e.target.value)}
              className="inp"
              placeholder="Contoh: Fokus 90m tercapai tanpa interupsi, eksekusi modul lancar..."
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>
              Batal
            </button>
            <button type="submit" className="btn btn-dual" style={{ flex: 1 }}>
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
