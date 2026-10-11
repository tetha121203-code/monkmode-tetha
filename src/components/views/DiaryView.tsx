import React, { useState } from 'react';
import { HABITS, MOODS } from '../../data/defaults';
import { DiaryEntry, HabitLog, WeeklyAnalysis } from '../../types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';

interface DiaryViewProps {
  diary: DiaryEntry[];
  setDiary: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  dateKey: string;
  fmtDate: string;
  safeHL: HabitLog;
  today: Date;
  weeklyAnalysis: WeeklyAnalysis[];
  setWeeklyAnalysis: React.Dispatch<React.SetStateAction<WeeklyAnalysis[]>>;
  studyDone: number;
  totalStudy: number;
}

const formatAIResponse = (text: string | null) => {
  if (!text) return null;
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
};

export const DiaryView: React.FC<DiaryViewProps> = ({
  diary,
  setDiary,
  dateKey,
  fmtDate,
  safeHL,
  today,
  weeklyAnalysis,
  setWeeklyAnalysis,
  studyDone,
  totalStudy,
}) => {
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState('');
  const [mood, setMood] = useState<'good' | 'neutral' | 'bad'>('neutral');
  const [editId, setEditId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [viewTab, setViewTab] = useState<'daily' | 'weekly'>('daily');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDailyDraft, setAiDailyDraft] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; title: string; desc: string } | null>(null);

  const todayEntry = diary.find(e => e.date === dateKey);

  const openNew = () => {
    if (todayEntry) {
      setEditId(todayEntry.id);
      setText(todayEntry.text);
      setMood(todayEntry.mood || 'neutral');
      setAiDailyDraft(todayEntry.aiAnalysis || null);
    } else {
      setText('');
      setMood('neutral');
      setEditId(null);
      setAiDailyDraft(null);
    }
    setWriting(true);
  };

  const save = () => {
    if (!text.trim()) return;
    if (editId) {
      setDiary(p => (Array.isArray(p) ? p.map(e => (e.id === editId ? { ...e, text: text.trim(), mood, aiAnalysis: aiDailyDraft } : e)) : []));
    } else {
      const entry: DiaryEntry = {
        id: Date.now(),
        date: dateKey,
        dateLabel: fmtDate,
        text: text.trim(),
        mood,
        aiAnalysis: aiDailyDraft
      };
      setDiary(p => (Array.isArray(p) ? [...p, entry] : [entry]));
    }
    setWriting(false);
    setText('');
    setEditId(null);
    setAiDailyDraft(null);
  };

  const deleteEntry = (id: number) => {
    setConfirmDialog({ id, title: 'Hapus Entri?', desc: 'Entri diary ini akan dihapus secara permanen.' });
  };

  const execDeleteEntry = (id: number) => {
    setDiary(p => (Array.isArray(p) ? p.filter(e => e.id !== id) : []));
    setConfirmDialog(null);
  };

  const callFridayAPI = async (prompt: string, systemInstruction?: string) => {
    try {
      const res = await fetch('/api/friday-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      return data.result || 'Friday AI tidak dapat merespon saat ini.';
    } catch (e: any) {
      console.error('Friday AI Fetch Error:', e);
      return `Koneksi terputus. Tetap jalankan protokol. (Error: ${e.message})`;
    }
  };

  const askFridayDaily = async () => {
    if (!text.trim()) {
      alert('Tulis sesuatu dulu agar Friday bisa menganalisisnya.');
      return;
    }
    setAiLoading(true);
    const prompt = `Ini adalah tulisan diary saya hari ini: "${text}". Mood saya: ${mood}. Progres hari ini: Penguasaan Silabus Belajar & Deep Work (${studyDone}/${totalStudy} materi tuntas). Tolong baca dan pahami isi diary saya, lalu berikan tanggapan layaknya AI Asisten Monk Mode bernama "Friday". Fokus saya adalah "Brutal Transformation" selama 81 hari (12 Oktober - 31 Desember 2026) hingga Akhir Tahun 2026 dengan target mutlak Penguasaan Skill Tingkat Tinggi, Disiplin Deep Work, dan Kebugaran Fisik Maksimal. Jangan memanjakan saya, bersikaplah logis, disiplin, namun tetap solutif. Buatkan juga tabel HTML sederhana (gunakan <table>, <tr>, <th>, <td>) yang merangkum 'Kelemahan Hari Ini' dan 'Tindakan Besok'.`;
    const sysIns = "Kamu adalah Friday, AI asisten personal Monk Mode yang dingin, analitis, logis, dan menjunjung tinggi disiplin ekstrem (Brutal Transformation). Output HANYA boleh dalam format HTML murni (<b>, <i>, <p>, <table>, <ul>, dsb). DILARANG KERAS menggunakan format Markdown seperti **, ###, atau asteris. Gunakan bahasa Indonesia yang formal, tegas, tajam namun tetap membangun.";
    
    const response = await callFridayAPI(prompt, sysIns);
    setAiDailyDraft(response);
    setAiLoading(false);
  };

  const generateWeeklyAnalysis = async () => {
    setAiLoading(true);
    let reportData = "Data 7 Hari Terakhir (Fokus: Brutal Transformation hingga Akhir Tahun 2026):\n\n";
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = d.toISOString().split('T')[0];
      const dayHabits = safeHL[k] ? HABITS.filter(h => safeHL[k][h.id]).length : 0;
      const diaryEn = diary.find(e => e.date === k);
      const moodText = diaryEn ? diaryEn.mood : 'Tidak ada catatan mood';
      const diaryText = diaryEn ? diaryEn.text : 'Tidak ada tulisan diary hari ini';
      reportData += `- Tanggal: ${k} | Habits (${HABITS.map(h => h.label).join(', ')}): ${dayHabits}/${HABITS.length} | Mood: ${moodText} | Isi Diary: "${diaryText}"\n`;
    }
    reportData += `\nProgres Keseluruhan Silabus Belajar & Deep Work: ${studyDone} dari ${totalStudy} materi telah diselesaikan.\n\n`;
    reportData += "Tolong evaluasi secara ketat dan tanpa basa-basi data jurnal saya di atas. Apakah saya sudah layak disebut menjalankan Monk Mode level tertinggi? Buat laporan mingguan menggunakan tabel HTML (wajib ada <table>, <tr>, <th>, <td>) untuk merangkum performa per hari. Berikan insight mendalam mengenai pola tulisan diary saya, kelemahan disiplin, konsistensi habit utama, progres belajar & deep work, dan tren emosi saya di bawah tabel tersebut. Ingat, hanya gunakan tag HTML murni, JANGAN gunakan Markdown sama sekali.";

    const sysIns = "Kamu adalah Friday, AI asisten Monk Mode. Kamu pandai menganalisa kelemahan dan memberikan teguran serta feedback rasional untuk Brutal Transformation. Output WAJIB dalam format HTML murni. DILARANG menggunakan Markdown (seperti **, ###). Gunakan tabel HTML untuk menampilkan data agar terstruktur dan profesional.";

    const response = await callFridayAPI(reportData, sysIns);
    const newAnalysis: WeeklyAnalysis = { id: Date.now(), date: dateKey, text: response };
    setWeeklyAnalysis(p => (Array.isArray(p) ? [newAnalysis, ...p] : [newAnalysis]));
    setAiLoading(false);
  };

  const sorted = [...diary].reverse();
  const visible = showAll ? sorted : sorted.slice(0, 10);
  const moodColors = { good: 'var(--green)', neutral: 'var(--blue-hover)', bad: 'var(--red)' };
  const moodLabel = { good: 'Tak Terkalahkan', neutral: 'Disiplin', bad: 'Berdarah-darah' };

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800, margin: '0 auto' }}>
      <div className="between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            Diary & Friday AI <Icon name="sparkles" size={24} style={{ color: 'var(--red)' }} />
          </div>
          <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>Refleksi Brutal & Analisis Cerdas</div>
        </div>
        <div style={{ display: 'flex', gap: 0, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {[
            { id: 'daily', l: 'Catatan Harian' },
            { id: 'weekly', l: 'Analisis Mingguan' }
          ].map((v, vi) => (
            <button
              key={v.id}
              onClick={() => setViewTab(v.id as any)}
              style={{
                padding: '10px 18px',
                border: 'none',
                borderRight: vi === 0 ? '1px solid var(--border)' : 'none',
                background: viewTab === v.id ? 'var(--blue-dim)' : 'transparent',
                color: viewTab === v.id ? 'var(--blue-hover)' : 'var(--text2)',
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

      {viewTab === 'daily' && (
        <>
          <div className="between">
            <div style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 700 }}>{diary.length} Entri Tersimpan</div>
            <button className="btn btn-red" onClick={openNew}>
              <Icon name="pencil" />
              {todayEntry ? 'Edit Hari Ini' : 'Tulis Hari Ini'}
            </button>
          </div>

          {!todayEntry && (
            <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '40px 20px', background: 'var(--surface2)' }}>
              <Icon name="diary" size={40} style={{ color: 'var(--text3)', marginBottom: 16 }} />
              <div style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 16, fontWeight: 600 }}>
                Belum ada refleksi untuk hari ini. Jangan lari dari evaluasi.
              </div>
              <button className="btn btn-red" onClick={openNew}>
                <Icon name="pencil" />
                Mulai Evaluasi Diri
              </button>
            </div>
          )}

          {visible.map(e => (
            <div key={e.id} className="diary-entry">
              <div className="between" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="diary-date" style={{ marginBottom: 0, fontSize: 14 }}>{e.dateLabel || e.date}</span>
                  {e.date === dateKey && <span className="tag tag-blue">Hari ini</span>}
                  {e.mood && (
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        background: `${moodColors[e.mood]}15`,
                        color: moodColors[e.mood],
                        border: `1px solid ${moodColors[e.mood]}30`
                      }}
                    >
                      {moodLabel[e.mood]}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setEditId(e.id);
                      setText(e.text);
                      setMood(e.mood || 'neutral');
                      setAiDailyDraft(e.aiAnalysis || null);
                      setWriting(true);
                    }}
                  >
                    <Icon name="pencil" />
                  </button>
                  <button className="icon-btn red" onClick={() => deleteEntry(e.id)}>
                    <Icon name="trash" />
                  </button>
                </div>
              </div>

              <div className="diary-text">{e.text}</div>

              {e.aiAnalysis && (
                <div className="ai-box">
                  <div className="ai-header">
                    <Icon name="cpu" size={16} /> Friday's Brutal Insight
                  </div>
                  <div className="ai-content">{formatAIResponse(e.aiAnalysis)}</div>
                </div>
              )}
            </div>
          ))}

          {diary.length > 10 && !showAll && (
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setShowAll(true)}>
              Tampilkan Semua Entri
            </button>
          )}
        </>
      )}

      {viewTab === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card card-p" style={{ textAlign: 'center', background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(30, 41, 59, 0.2))' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <Icon name="cpu" size={48} style={{ color: 'var(--red)' }} className="pulse-glow red-glow" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, textTransform: 'uppercase' }}>
              Evaluasi Brutal Mingguan
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px', fontWeight: 500 }}>
              Friday akan membongkar data aktivitas, kemalasan, dan konsistensi Anda selama 7 hari terakhir. Tidak ada tempat untuk alasan.
            </p>
            <button className="btn btn-red btn-lg" onClick={generateWeeklyAnalysis} disabled={aiLoading}>
              {aiLoading ? (
                <>
                  <span className="spin-it"><Icon name="loader" /></span> Mengumpulkan Bukti...
                </>
              ) : (
                <>
                  <Icon name="sparkles" /> Hasilkan Laporan Mingguan
                </>
              )}
            </button>
          </div>

          {weeklyAnalysis.map((wa) => (
            <div key={wa.id} className="card card-p" style={{ borderColor: 'var(--red-dim)' }}>
              <div className="between" style={{ marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--red)', fontWeight: 800, fontSize: 16, textTransform: 'uppercase' }}>
                  <Icon name="cpu" size={20} /> Laporan Audit: {wa.date}
                </div>
              </div>
              <div className="ai-content" style={{ fontSize: 15 }}>{formatAIResponse(wa.text)}</div>
            </div>
          ))}

          {weeklyAnalysis.length === 0 && !aiLoading && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontWeight: 600 }}>
              Belum ada laporan mingguan. Buktikan Anda pantas dievaluasi.
            </div>
          )}
        </div>
      )}

      <Modal open={writing} onClose={() => setWriting(false)} title={editId ? 'Edit Audit' : 'Refleksi Diri (Audit Harian)'} wide>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {fmtDate}
          </div>

          <div>
            <span className="label">Bagaimana performa disiplinmu hari ini?</span>
            <div style={{ display: 'flex', gap: 12 }}>
              {MOODS.map(m => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 12,
                    border: `2px solid ${mood === m.key ? m.color : 'var(--border)'}`,
                    background: mood === m.key ? m.color + '15' : 'var(--surface2)',
                    color: mood === m.key ? m.color : 'var(--text2)',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="inp"
            style={{ minHeight: 220, fontSize: 15, lineHeight: 1.7 }}
            placeholder="Jangan berbohong pada diri sendiri. Tulis di mana kamu gagal, apa yang sudah kamu kerjakan (Deep Work/Proyek/Workout), dan apa kendalamu..."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />

          {aiDailyDraft && (
            <div className="ai-box">
              <div className="ai-header">
                <Icon name="cpu" size={16} /> Friday's Brutal Insight
              </div>
              <div className="ai-content">{formatAIResponse(aiDailyDraft)}</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn btn-ghost" style={{ padding: '12px' }} onClick={askFridayDaily} disabled={aiLoading || !text.trim()}>
              {aiLoading ? (
                <>
                  <span className="spin-it"><Icon name="loader" /></span> Memproses...
                </>
              ) : (
                <>
                  <Icon name="sparkles" /> Audit dengan Friday
                </>
              )}
            </button>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-ghost" onClick={() => setWriting(false)}>Batal</button>
            <button className="btn btn-red" onClick={save} disabled={!text.trim() || aiLoading}>Simpan Audit</button>
          </div>
        </div>
      </Modal>

      {confirmDialog && (
        <Modal open={!!confirmDialog} onClose={() => setConfirmDialog(null)} title={confirmDialog.title}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ padding: '16px', background: 'rgba(225,29,72,0.1)', borderRadius: 12, fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
              {confirmDialog.desc}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmDialog(null)}>Batal</button>
              <button className="btn btn-red" style={{ flex: 1 }} onClick={() => execDeleteEntry(confirmDialog.id)}>Hapus</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
