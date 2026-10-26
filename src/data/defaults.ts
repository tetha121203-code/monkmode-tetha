import { HabitDefinition, RoadmapPhase, ToeflPhase, ToeflSchedule, WorkoutSchedule, Exercise, TryoutRecord } from '../types';

export const HABITS: HabitDefinition[] = [
  { id: 'nojunkfood', label: 'No Junkfood', color: '#10b981', iconName: 'warn', description: 'Bersih dari makanan olahan & gula berlebih' },
  { id: 'toefl', label: 'Deep Work & Study', color: '#8b5cf6', iconName: 'book', description: 'Protokol Ekstrem: 4–6 Jam Deep Work, High-Income Skills & Problem Solving' },
  { id: 'workout', label: 'Workout', color: '#f59e0b', iconName: 'fitness', description: 'Disiplin latihan fisik & terapi scapular' },
  { id: 'nofap', label: 'NoFap', color: '#0ea5e9', iconName: 'lock', description: 'Fokus energi & retensi vitalitas penuh' },
];

export const DEFAULT_ROADMAP: RoadmapPhase[] = [];

export const DEFAULT_TOEFL: ToeflPhase[] = [
  {
    id: 'deep_work_foundations',
    title: 'Fondasi Deep Work & Arsitektur Fokus',
    week: '1–4',
    desc: 'Penguasaan protokol fokus tanpa distraksi, time-boxing 90 menit, dopamine reset, dan peningkatan kapasitas kognitif harian.',
    color: '#8b5cf6',
    items: [
      { id: 'fw_01', title: 'Protokol Deep Work 90 Menit: Eliminasi Distraksi Kontekstual & Monotasking Ketat' },
      { id: 'fw_02', title: 'Dopamine Reset & Pengendalian Impuls Notifikasi dan Scrolling Digital' },
      { id: 'fw_03', title: 'Arsitektur Second Brain & Sistem Catatan Zettelkasten untuk Retensi Informasi' },
      { id: 'fw_04', title: 'Metode Feynman: Dekonstruksi Konsep Rumit Menjadi Bahasa Sederhana' },
      { id: 'fw_05', title: 'Optimalisasi Ritme Sirkadian, Kualitas Tidur & Energi Mental untuk Belajar' },
      { id: 'fw_06', title: 'Speed Reading & Ekstraksi Intisari Buku dan Literatur Teknis' }
    ]
  },
  {
    id: 'analytical_mastery',
    title: 'Penalaran Analitis & Problem Solving',
    week: '5–8',
    desc: 'Pengembangan logika tajam, pemikiran prinsip pertama (first principles), matematika intuitif, dan dekonstruksi masalah kompleks.',
    color: '#3b82f6',
    items: [
      { id: 'an_01', title: 'First Principles Thinking: Mengurai Masalah ke Elemen Paling Mendasar' },
      { id: 'an_02', title: 'Logika Formal & Penalaran Kritis: Deduktif, Induktif & Deteksi Bias Kognitif' },
      { id: 'an_03', title: 'Intuisi Matematika Cepat: Estimasi Kasus & Perhitungan Probabilitas Praktis' },
      { id: 'an_04', title: 'Struktur Pemecahan Masalah 5-Whys dan Analisis Akar Masalah (Root Cause)' },
      { id: 'an_05', title: 'Analisis Data & Interpretasi Pola: Mengubah Angka Menjadi Keputusan Strategis' },
      { id: 'an_06', title: 'Model Mental Pengambilan Keputusan: Pareto 80/20, Inversi, & Second-Order Thinking' }
    ]
  },
  {
    id: 'technical_execution',
    title: 'Eksekusi Teknis & High-Income Skills',
    week: '9–14',
    desc: 'Penguasaan keterampilan teknis bernilai tinggi, otomatisasi alur kerja, penguasaan tools modern, dan arsitektur sistem.',
    color: '#10b981',
    items: [
      { id: 'tc_01', title: 'Penguasaan Core Technology Stack & Algoritma Efisien' },
      { id: 'tc_02', title: 'Automasi Alur Kerja Berulang & Scripting Efisiensi Tinggi' },
      { id: 'tc_03', title: 'Prinsip Arsitektur Modular, Clean Code & Desain Sistem Skalabel' },
      { id: 'tc_04', title: 'Version Control, Git Best Practices & Manajemen Siklus Proyek' },
      { id: 'tc_05', title: 'Troubleshooting & Root Cause Analysis Terstruktur di Bawah Tekanan' },
      { id: 'tc_06', title: 'Refactoring & Optimalisasi Performa Eksekusi Sistem' }
    ]
  },
  {
    id: 'strategic_output',
    title: 'Komunikasi Strategis & Sintesis Output',
    week: '15–18',
    desc: 'Kemampuan mengartikulasikan ide kompleks, penulisan teknis tajam, dokumentasi berkualitas tinggi, dan kepemimpinan strategis.',
    color: '#f59e0b',
    items: [
      { id: 'st_01', title: 'High-Impact Technical Writing: Penulisan Jelas, Padat & Berorientasi Solusi' },
      { id: 'st_02', title: 'Sintesis Pengetahuan & Penyusunan Dokumen Ringkas Tingkat Eksekutif' },
      { id: 'st_03', title: 'Penyampaian Presentasi & Artikulasi Ide Tanpa Catatan' },
      { id: 'st_04', title: 'Negosiasi, Manajemen Ekspektasi & Komunikasi Tim Efektif' },
      { id: 'st_05', title: 'Penyusunan Spesifikasi Solusi Teknis & Action Plan Terukur' }
    ]
  },
  {
    id: 'capstone_mastery',
    title: 'Proyek Flagship & Audit Capstone 2026',
    week: '19–22',
    desc: 'Pembangunan proyek nyata skala penuh, simulasi beban kerja realistis, benchmark performa, dan evaluasi pencapaian akhir tahun 2026.',
    color: '#ec4899',
    items: [
      { id: 'cp_01', title: 'Perancangan & Eksekusi Proyek Flagship Tahap 1: Arsitektur & Prototype' },
      { id: 'cp_02', title: 'Implementasi Intensif, Integrasi Modul & Pengetesan Menyeluruh' },
      { id: 'cp_03', title: 'Simulasi Marathon Deep Work Penuh & Penanganan Tantangan Ekstrem' },
      { id: 'cp_04', title: 'Finalisasi Proyek Flagship, Dokumentasi Lengkap & Refleksi Protokol 2026' }
    ]
  }
];

export const SCAPULAR: Exercise[] = [
  { name: "Child's Pose", detail: '2 x 30–45 detik', target: 'Thoracic Mobility', category: 'scapular' },
  { name: "Scapular Y in Child's Pose", detail: '2 x 8–10 reps', target: 'Lower Trapezius', category: 'scapular' },
  { name: 'Serratus Punch (Berbaring)', detail: '3 x 12–15 reps', target: 'Serratus Anterior', category: 'scapular' },
  { name: 'Push Up Plus', detail: '3 x 10–12 reps', target: 'Serratus Anterior', category: 'scapular' },
  { name: 'Plank to Downward Dog', detail: '3 x 8–10 reps', target: 'Serratus & Core', category: 'scapular' },
  { name: 'Standing Serratus Punches', detail: '3 x 12–15 reps', target: 'Serratus Anterior', category: 'scapular' },
  { name: 'YTW Prone', detail: '2 x 8 reps per huruf', target: 'Lower & Mid Trap', category: 'scapular' },
];

export const DEFAULT_WORKOUT: WorkoutSchedule = {
  'Senin': {
    type: 'Gym: Back + Chest',
    location: 'Gym',
    focus: 'Back + Chest (Lat Pulldown, Row, Incline Press, Face Pull)',
    targetTime: '45–55 menit',
    notes: 'Gym workout: fokus pada form terkontrol, tarik lat pulldown ke dada bagian atas, jaga stabilitas belikat saat row dan shoulder raises.',
    exercises: [
      { name: 'Lat Pulldown', detail: '3 × 10–12 reps', target: 'Latissimus Dorsi', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Chest-Supported Row', detail: '3 × 10–12 reps', target: 'Rhomboids & Mid Back', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Lateral Raises', detail: '3 × 10–12 reps', target: 'Lateral Deltoid (Bahu Samping)', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Incline Chest Press Machine', detail: '3 × 10–12 reps', target: 'Upper Chest (Dada Atas)', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Face Pull', detail: '3 × 12–15 reps', target: 'Rear Delts & Rotator Cuff', sets: 3, reps: '12–15', category: 'primary' },
      { name: 'Seated Cable Row', detail: '3 × 10–12 reps', target: 'Punggung Tengah / Lats', sets: 3, reps: '10–12', category: 'primary' }
    ]
  },
  'Selasa': {
    type: 'Home: Core + Glute Stability',
    location: 'Home',
    focus: 'Core & Glute Stability (Dead Bug, Planks, Bird Dog, Glute Bridge)',
    targetTime: '30–40 menit',
    notes: 'Home workout: aktivasi postur, deep core, dan pinggul. Tahan setiap posisi dengan tenang tanpa melengkungkan pinggang secara berlebih.',
    exercises: [
      { name: 'Dead Bug', detail: '3 × 8 per sisi', target: 'Deep Core & Anti-Extension', sets: 3, reps: '8 per sisi', category: 'primary' },
      { name: 'Forearm Plank', detail: '3 × 20–30 detik', target: 'Anterior Core & Transverse', sets: 3, reps: '20–30 detik', category: 'primary' },
      { name: 'Bird Dog', detail: '2 × 8 per sisi', target: 'Lumbar & Cross Posterior Stability', sets: 2, reps: '8 per sisi', category: 'primary' },
      { name: 'Glute Bridge', detail: '2 × 12–15 reps', target: 'Gluteus Maximus & Pinggul', sets: 2, reps: '12–15', category: 'primary' },
      { name: 'Plank', detail: '3 × 30 detik', target: 'Core Stability & Scapular Hold', sets: 3, reps: '30 detik', category: 'primary' }
    ]
  },
  'Rabu': {
    type: 'Gym: Back + Legs',
    location: 'Gym',
    focus: 'Back + Legs (Lat Pulldown, Row, Leg Press, Leg Curl/Ext)',
    targetTime: '45–55 menit',
    notes: 'Gym workout: kombinasi tarikan punggung dan latihan kaki mesin. Pastikan punggung menempel aman di sandaran Leg Press.',
    exercises: [
      { name: 'Lat Pulldown', detail: '3 × 10–12 reps', target: 'Latissimus Dorsi', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Seated Cable Row', detail: '3 × 10–12 reps', target: 'Mid-Back & Rhomboids', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Leg Press', detail: '3 × 10–12 reps', target: 'Quadriceps & Glutes', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Seated Leg Curl', detail: '3 × 12–15 reps', target: 'Hamstrings', sets: 3, reps: '12–15', category: 'primary' },
      { name: 'Leg Extension', detail: '3 × 12–15 reps', target: 'Quadriceps Isolasi', sets: 3, reps: '12–15', category: 'primary' },
      { name: 'Lat Pulldown', detail: '3 × 10–12 reps', target: 'Lats Finisher & Scapular Control', sets: 3, reps: '10–12', category: 'primary' }
    ]
  },
  'Kamis': {
    type: 'Rest & Active Recovery',
    location: 'Rest',
    focus: 'Pemulihan Otot & Mobilitas Sendi',
    targetTime: '20–30 menit santai',
    notes: 'Hari istirahat aktif untuk adaptasi sistem saraf dan serat otot sebelum sesi stabilitas dan gym berikutnya. Lakukan peregangan ringan dan hidrasi cukup.',
    exercises: [
      { name: 'Mobilitas Panggul & Hamstring', detail: '10–15 menit peregangan lembut', target: 'Fleksibilitas Sendi', category: 'primary' },
      { name: 'Jalan Kaki Santai (Brisk Walk)', detail: '15–20 menit intensitas ringan', target: 'Sirkulasi Darah Aktif', category: 'primary' }
    ]
  },
  'Jumat': {
    type: 'Home: Core + Lower Back Stability',
    location: 'Home',
    focus: 'Core & Lower Back Stability (Cat Cow, Side Plank, Back Extension)',
    targetTime: '30–40 menit',
    notes: 'Home workout: dekompresi tulang belakang, mobilitas thoraks, dan stabilitas punggung bawah untuk mencegah ketegangan belikat.',
    exercises: [
      { name: 'Cat Cow', detail: '3 × 30 detik', target: 'Spinal Articulation & Thoracic Mobility', sets: 3, reps: '30 detik', category: 'primary' },
      { name: 'Plank', detail: '3 × 30 detik per sisi', target: 'Side Plank / Lateral Core Stability', sets: 3, reps: '30 detik per sisi', category: 'primary' },
      { name: 'Bird Dog', detail: '2 × 8 per sisi', target: 'Multifidus & Lumbar Stability', sets: 2, reps: '8 per sisi', category: 'primary' },
      { name: 'Glute Bridge', detail: '3 × 12–15 reps', target: 'Gluteus Maximus & Pelvic Floor', sets: 3, reps: '12–15', category: 'primary' },
      { name: 'Dead Bug', detail: '3 × 8 per sisi', target: 'Deep Transverse Abdominis', sets: 3, reps: '8 per sisi', category: 'primary' },
      { name: 'Prone Back Extension Hold', detail: '2 × 10–15 detik', target: 'Erector Spinae & Lower Back', sets: 2, reps: '10–15 detik', category: 'primary' }
    ]
  },
  'Sabtu': {
    type: 'Gym: Back + Shoulder',
    location: 'Gym',
    focus: 'Back + Shoulder (Lat Pulldown, Row, Shoulder Press, Lateral Raise, Hammer Curl)',
    targetTime: '45–55 menit',
    notes: 'Gym workout: penguatan upper body menyeluruh. Kendalikan tempo gerakan, jangan menyentak beban pada lateral raise dan hammer curl.',
    exercises: [
      { name: 'Lat Pulldown', detail: '3 × 10–12 reps', target: 'Latissimus Dorsi', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Chest-Supported Row', detail: '3 × 10–12 reps', target: 'Mid-Back & Scapular Stability', sets: 3, reps: '10–12', category: 'primary' },
      { name: 'Seated Shoulder Press Machine', detail: '2 × 10–12 reps', target: 'Anterior & Medial Deltoids', sets: 2, reps: '10–12', category: 'primary' },
      { name: 'Dumbbell Lateral Raise', detail: '3 × 12–15 reps', target: 'Bahu Samping (Lateral Delt)', sets: 3, reps: '12–15', category: 'primary' },
      { name: 'Reverse Pec Deck', detail: '2 × 12–15 reps', target: 'Rear Deltoid & Postur Belikat', sets: 2, reps: '12–15', category: 'primary' },
      { name: 'Dumbbell Hammer Curl', detail: '2 × 10–12 reps', target: 'Brachialis & Biceps', sets: 2, reps: '10–12', category: 'primary' }
    ]
  },
  'Minggu': {
    type: 'Rest Day',
    location: 'Rest',
    focus: 'Pemulihan Total & Deep Sleep',
    targetTime: 'Sepanjang Hari',
    notes: 'Hari pemulihan total tanpa beban. Optimalkan tidur malam minimal 8–9 jam untuk regenerasi otot dan stabilitas tubuh.',
    exercises: [
      { name: 'Deep Sleep & Istirahat Total', detail: '8–9 jam tidur lelap', target: 'Regenerasi Jaringan & Hormon', category: 'primary' }
    ]
  },
};

export const DEFAULT_TOEFL_SCHEDULE: ToeflSchedule = {
  'Senin': {
    type: 'Deep Work: Core Systems & Arsitektur Fondasi',
    focus: 'Fokus Blok Pagi — Deep Dive Konsep Inti & Implementasi Dasar',
    tasks: [
      { name: 'Deep Work Blok #1 (90 Menit Tanpa Interupsi)', detail: 'Pelajari konsep inti dan catat intisari ke dalam Second Brain', time: '90m' },
      { name: 'Hands-on Problem Solving & Coding Sprint', detail: 'Terapkan konsep ke dalam problem set nyata atau proyek', time: '45m' },
      { name: 'Review Harian & Ekstraksi Intisari Pengetahuan', detail: 'Tulis ringkasan 3 insight penting hasil belajar hari ini', time: '20m' }
    ]
  },
  'Selasa': {
    type: 'Problem Solving & Logika Analitis',
    focus: 'Penalaran First Principles & Dekonstruksi Masalah Kompleks',
    tasks: [
      { name: 'Drill 5 Studi Kasus Problem Solving Terstruktur', detail: 'Latihan dekonstruksi masalah dengan metode 5-Whys dan logika formal', time: '60m' },
      { name: 'Bedah Logika Algoritma & Second-Order Thinking', detail: 'Analisis skenario terburuk dan uji efisiensi alur pemecahan', time: '45m' },
      { name: 'Refactoring Solusi untuk Efisiensi Eksekusi', detail: 'Optimasi cara penyelesaian agar lebih terstruktur dan reusable', time: '30m' }
    ]
  },
  'Rabu': {
    type: 'Eksekusi Proyek & Technical Building',
    focus: 'Pembangunan Proyek Nyata & Penguasaan Tools Bernilai Tinggi',
    tasks: [
      { name: 'Sesi Building Blok Utama Proyek (90 Menit)', detail: 'Fokus pada penyelesaian modul inti dan fitur prioritas tinggi', time: '90m' },
      { name: 'Testing, Debugging & Root Cause Analysis', detail: 'Identifikasi celah kelemahan sistem dan eliminasi bottleneck', time: '45m' },
      { name: 'Dokumentasi Arsitektur & Git Commit Terstruktur', detail: 'Dokumentasikan keputusan arsitektur dan push milestone harian', time: '20m' }
    ]
  },
  'Kamis': {
    type: 'Sintesis Pengetahuan & Penulisan Strategis',
    focus: 'Dokumentasi Berkualitas Tinggi, Artikulasi Ide & Komunikasi',
    tasks: [
      { name: 'Penyusunan Esai Teknis / Executive Summary', detail: 'Tulis sintesis komprehensif tentang sistem yang sedang dipelajari', time: '60m' },
      { name: 'Uji Pemahaman Metode Feynman', detail: 'Jelaskan konsep rumit dengan bahasa sederhana tanpa jargon bertele-tele', time: '35m' },
      { name: 'Deep Reading: Literatur Teknis & Best Practices', detail: 'Pelajari referensi standar industri dari sumber primer', time: '40m' }
    ]
  },
  'Jumat': {
    type: 'Sprint Audit Kualitas & Eliminasi Kelemahan',
    focus: 'Review Output Mingguan & Penguatan Topik Paling Menantang',
    tasks: [
      { name: 'Audit Kelemahan & Topik Tersulit Pekan Ini', detail: 'Ulangi bagian materi atau kode yang masih belum dikuasai 100%', time: '60m' },
      { name: 'Speed Sprint: Penyelesaian 3 Masalah Kompleks', detail: 'Uji ketahanan mental dan kecepatan berpikir di bawah batas waktu', time: '50m' }
    ]
  },
  'Sabtu': {
    type: 'Deep Work Marathon (Simulasi Eksekusi Penuh)',
    focus: 'Simulasi Kerja Nyata Skala Penuh — Ketahanan Mental & Fokus Ekstrem',
    tasks: [
      { name: 'Sesi Marathon Fokus Tanpa Distraksi (2.5 Jam)', detail: 'Selesaikan milestone besar proyek atau integrasi sistem menyeluruh', time: '150m' },
      { name: 'Evaluasi Output & Benchmark Hasil Akhir', detail: 'Ukur efektivitas kerja berdasarkan standar kualitas tertinggi', time: '30m' }
    ]
  },
  'Minggu': {
    type: 'Retrospektif Mingguan & Pemulihan Strategis',
    focus: 'Audit Progres 7 Hari, Penataan Target Pekan Depan & Recovery Mental',
    tasks: [
      { name: 'Review Jurnal Belajar & Flashcard Ringkasan', detail: 'Perkuat retensi memori jangka panjang dengan spaced repetition', time: '30m' },
      { name: 'Perencanaan 3 Prioritas Mutlak Pekan Depan', detail: 'Tetapkan blok waktu dan deliverable konkret untuk minggu depan', time: '20m' },
      { name: 'Mental Reset & Pemulihan Kognitif Penuh', detail: 'Istirahat berkualitas untuk mengembalikan kejernihan pikiran', time: '20m' }
    ]
  },
};

export const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// MULAI 12 OKTOBER 2026 - 31 DESEMBER 2026 (81 HARI)
// TENGGAT WAKTU: AKHIR TAHUN 2026
export const TOTAL_DAYS = 81;
export const PROGRAM_START_DATE = new Date(2026, 9, 12); // 12 October 2026
export const PROGRAM_END_DATE = new Date(2026, 11, 31); // 31 December 2026 (Akhir Tahun 2026)

export const MOODS = [
  { key: 'good' as const, label: 'Tak Terkalahkan', color: 'var(--green)' },
  { key: 'neutral' as const, label: 'Disiplin', color: 'var(--blue-hover)' },
  { key: 'bad' as const, label: 'Berdarah-darah', color: 'var(--red)' }
];

export const DEFAULT_TRYOUTS: TryoutRecord[] = [];

