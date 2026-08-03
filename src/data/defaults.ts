import { HabitDefinition, RoadmapPhase, ToeflPhase, ToeflSchedule, WorkoutSchedule, Exercise } from '../types';

export const HABITS: HabitDefinition[] = [
  { id: 'nojunkfood', label: 'No Junkfood', color: '#10b981', iconName: 'warn', description: 'Bersih dari makanan olahan & gula berlebih' },
  { id: 'coding', label: 'Belajar Data Analyst', color: '#a855f7', iconName: 'laptop', description: 'Minimal 1-2 jam perhari tuntas modul Data Analytics' },
  { id: 'toefl', label: 'Belajar TOEFL', color: '#8b5cf6', iconName: 'book', description: 'Latihan Listening, Reading, Speaking, Writing' },
  { id: 'workout', label: 'Workout', color: '#f59e0b', iconName: 'fitness', description: 'Disiplin penderitaan fisik & terapi scapular' },
  { id: 'nofap', label: 'NoFap', color: '#0ea5e9', iconName: 'lock', description: 'Fokus energi & retensi vitalitas penuh' },
];

export const DEFAULT_ROADMAP: RoadmapPhase[] = [
  {
    id: 'excel_data_analytics',
    title: 'Excel Data Analytics Mastery',
    week: '1–5',
    targetDeadline: '2026-08-31',
    desc: 'Penguasaan 5 Sub-Modul Utama Excel: Intermediate, Advanced, Data Manipulation, Forecasting & Statistics, serta Real-World Portfolio Project.',
    color: '#a855f7',
    pl: 'https://www.youtube.com/results?search_query=excel+data+analytics+mastery',
    videos: [
      { id: 'ex_mod_1', title: '1. Microsoft Excel Intermediate (Lookup, Formulas, Validation)', url: '' },
      { id: 'ex_mod_2', title: '2. Microsoft Excel Advanced (Power Query, Dynamic Arrays, Pivot)', url: '' },
      { id: 'ex_mod_3', title: '3. Data Manipulation (Text Parsing, Date/Time, Data Cleaning)', url: '' },
      { id: 'ex_mod_4', title: '4. Forecasting, Regression and Statistic in Excel', url: '' },
      { id: 'ex_mod_5', title: '5. Portfolio in Microsoft Excel (Executive Dashboard & Report)', url: '' }
    ],
    casestudies: [
      { id: 'ex_cs_1', title: 'Project 1: Sales Data Cleaning & Lookup System', desc: 'Olah dan bersihkan data transaksi penjualan dengan formula VLOOKUP/XLOOKUP & kriteria ganda.' },
      { id: 'ex_cs_2', title: 'Project 2: Power Query & Advanced Interactive Executive Dashboard', desc: 'Rancang dashboard eksekutif otomatis yang dapat di-refresh dengan sekali klik.' },
      { id: 'ex_cs_3', title: 'Project 3: Multi-Source Data Transformation & Standardization', desc: 'Transformasikan data pelanggan berformat tidak terstruktur menjadi format siap analisis.' },
      { id: 'ex_cs_4', title: 'Project 4: Financial Revenue & Demand Growth Projection', desc: 'Proyeksikan tren pendapatan dan permintaan produk kuartal berikutnya berbasis statistik & regresi.' },
      { id: 'ex_cs_5', title: 'Project 5: End-to-End Excel Analytics Portfolio Showcase', desc: 'Projek komprehensif siap pamer ke recruiter dengan laporan bisnis dan visualisasi profesional.' }
    ]
  }
];

export const DEFAULT_TOEFL: ToeflPhase[] = [
  {
    id: 'toefl_reading', title: 'Reading Comprehension', week: '1-2',
    desc: 'Fokus pada vocab, skimming, scanning, dan inference questions.',
    color: '#8b5cf6',
    items: [
      { id: 'tr_01', title: 'Vocab Builder: Academic Words 1-100' },
      { id: 'tr_02', title: 'Strategy: Skimming & Scanning' },
      { id: 'tr_03', title: 'Practice: Factual Information Questions' },
      { id: 'tr_04', title: 'Practice: Inference & Rhetorical' }
    ]
  },
  {
    id: 'toefl_listening', title: 'Listening Comprehension', week: '3-4',
    desc: 'Memahami main idea, details, function, dan attitude dari percakapan akademik.',
    color: '#3b82f6',
    items: [
      { id: 'tl_01', title: 'Note-taking Strategies' },
      { id: 'tl_02', title: 'Practice: Campus Conversations' },
      { id: 'tl_03', title: 'Practice: Academic Lectures (Science)' },
      { id: 'tl_04', title: 'Practice: Academic Lectures (Arts/History)' }
    ]
  },
  {
    id: 'toefl_speaking', title: 'Speaking Section', week: '5-6',
    desc: 'Independent & Integrated Speaking practice.',
    color: '#10b981',
    items: [
      { id: 'ts_01', title: 'Task 1: Independent Speaking (Templates)' },
      { id: 'ts_02', title: 'Task 2: Campus Situation' },
      { id: 'ts_03', title: 'Task 3: Academic Reading & Listening' },
      { id: 'ts_04', title: 'Task 4: Academic Lecture Summary' }
    ]
  },
  {
    id: 'toefl_writing', title: 'Writing Section', week: '7-8',
    desc: 'Integrated & Academic Discussion (New Format).',
    color: '#f59e0b',
    items: [
      { id: 'tw_01', title: 'Integrated Writing: Structuring the Essay' },
      { id: 'tw_02', title: 'Integrated Writing: Practice Test' },
      { id: 'tw_03', title: 'Academic Discussion: Expressing Opinion' },
      { id: 'tw_04', title: 'Full Practice Test: Writing Section' }
    ]
  },
  {
    id: 'toefl_full', title: 'Full Practice Tests', week: '9-10',
    desc: 'Simulasi ujian lengkap TOEFL iBT.',
    color: '#f43f5e',
    items: [
      { id: 'tf_01', title: 'Full Mock Test 1 & Review' },
      { id: 'tf_02', title: 'Full Mock Test 2 & Review' },
      { id: 'tf_03', title: 'Target Score Evaluation' }
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
    type: 'Push Day', focus: 'Dada, Bahu, Trisep',
    exercises: [
      { name: 'Incline Dumbbell Press', detail: '3 x 10–12', target: 'Dada Atas', category: 'primary' },
      { name: 'Pec Fly Machine', detail: '2 x 15', target: 'Dada', category: 'primary' },
      { name: 'Shoulder Press DB', detail: '3 x 10–12', target: 'Bahu', category: 'primary' },
      { name: 'Tricep Pushdown', detail: '3 x 12', target: 'Trisep', category: 'primary' },
      { name: 'Cable Row', detail: '3 x 12-15', target: 'Punggung', category: 'primary' },
      { name: 'Seated Cable Serratus Punches', detail: '2 x 15', target: 'Serratus', category: 'primary' },
      { name: 'Face Pulls', detail: '2 x 10', target: 'Bahu Belakang', category: 'primary' }
    ]
  },
  'Selasa': {
    type: 'Core', focus: 'Otot Inti & Stabilitas',
    exercises: [
      { name: 'Dead Bug', detail: '3 x 10–12', target: 'Deep Core', category: 'primary' },
      { name: 'Bird Dog', detail: '3 x 10', target: 'Stabilitas', category: 'primary' },
      { name: 'Plank Siku', detail: '3 x 30–45 detik', target: 'Core', category: 'primary' }
    ]
  },
  'Rabu': {
    type: 'Leg Day', focus: 'Paha & Gluteus',
    exercises: [
      { name: 'Goblet Squat', detail: '3 x 10–12', target: 'Paha', category: 'primary' },
      { name: 'Bulgarian Split Squat', detail: '3 x 8–10', target: 'Kaki', category: 'primary' },
      { name: 'Leg Curl Machine', detail: '3 x 12', target: 'Paha Belakang', category: 'primary' },
      { name: 'Leg Extension', detail: '3 x 12', target: 'Paha Depan', category: 'primary' },
      { name: 'Cable Row', detail: '3 x 12-15', target: 'Scapular', category: 'primary' },
      { name: 'Seated Cable Punch', detail: '3 x 15', target: 'Scapular', category: 'primary' },
      { name: 'Cable Seated Puch Serratus', detail: '3 x 15', target: 'Scapular', category: 'primary' },
      { name: 'Face Pulls', detail: '3 x 15', target: 'Scapular', category: 'primary' }
    ]
  },
  'Kamis': {
    type: 'Core', focus: 'Otot Inti & Stabilitas',
    exercises: [
      { name: 'Dead Bug', detail: '3 x 10–12', target: 'Deep Core', category: 'primary' },
      { name: 'Bird Dog', detail: '3 x 10', target: 'Stabilitas', category: 'primary' }
    ]
  },
  'Jumat': {
    type: 'Pull Day', focus: 'Punggung & Bisep',
    exercises: [
      { name: 'Lat Pulldown', detail: '3 x 10–12', target: 'Lats', category: 'primary' },
      { name: 'Seated Cable Row', detail: '3 x 10–12', target: 'Punggung Tengah', category: 'primary' },
      { name: 'One Arm DB Row', detail: '3 x 10', target: 'Punggung', category: 'primary' },
      { name: 'Hammer Curl', detail: '3 x 12', target: 'Bisep', category: 'primary' },
      { name: 'Seated Cable Punch Serratus', detail: '3 x 15', target: 'Scapular', category: 'primary' },
      { name: 'Face Pulls', detail: '3 x 15', target: 'Scapular', category: 'primary' }
    ]
  },
  'Sabtu': {
    type: 'Core', focus: 'Otot Inti & Abs',
    exercises: [
      { name: 'Dead Bug', detail: '3 x 10–12', target: 'Core', category: 'primary' },
      { name: 'Plank Siku', detail: '3 x 40–60 detik', target: 'Core', category: 'primary' }
    ]
  },
  'Minggu': {
    type: 'Rest Day', focus: 'Pemulihan',
    exercises: [
      { name: 'Full Sleep', detail: '9 jam', target: 'Pemulihan', category: 'primary' }
    ]
  },
};

export const DEFAULT_TOEFL_SCHEDULE: ToeflSchedule = {
  'Senin': {
    type: 'Reading Focus', focus: 'Membaca Cepat & Analisa',
    tasks: [
      { name: 'Hafal 20 Vocab Baru', detail: 'Gunakan Anki/Quizlet', time: '15m' },
      { name: '1 Academic Passage', detail: 'Simulasi tes (18 menit)', time: '20m' },
      { name: 'Evaluasi Jawaban', detail: 'Analisis letak kesalahan', time: '15m' }
    ]
  },
  'Selasa': {
    type: 'Listening Focus', focus: 'Note-taking & Pemahaman',
    tasks: [
      { name: '1 Conversation + 1 Lecture', detail: 'Dengar & catat poin penting', time: '20m' },
      { name: 'Shadowing Latihan', detail: 'Tirukan intonasi speaker native', time: '15m' },
      { name: 'Review Script', detail: 'Cari vocab yang tidak dikenali', time: '15m' }
    ]
  },
  'Rabu': {
    type: 'Speaking Focus', focus: 'Pronunciation & Struktur',
    tasks: [
      { name: 'Task 1 (Independent)', detail: 'Latihan 2 topik, rekam suara', time: '15m' },
      { name: 'Task 2/3 (Integrated)', detail: 'Latihan baca-dengar-bicara', time: '20m' },
      { name: 'Self-Evaluation', detail: 'Dengarkan ulang dan kritik rekaman', time: '10m' }
    ]
  },
  'Kamis': {
    type: 'Writing Focus', focus: 'Grammar & Kecepatan Ngetik',
    tasks: [
      { name: 'Academic Discussion', detail: 'Tulis 100+ kata dalam 10 menit', time: '15m' },
      { name: 'Integrated Writing Outline', detail: 'Latihan membuat kerangka essay', time: '20m' },
      { name: 'Grammar Review', detail: 'Perbaiki sentence structure di Grammarly', time: '15m' }
    ]
  },
  'Jumat': {
    type: 'Mixed Practice', focus: 'Target Kelemahan',
    tasks: [
      { name: 'Mini Test Bebas', detail: 'Gabungan bagian yang paling lemah', time: '30m' },
      { name: 'Review Total Mingguan', detail: 'Evaluasi progress belajar minggu ini', time: '20m' }
    ]
  },
  'Sabtu': {
    type: 'Simulation', focus: 'Endurance Building',
    tasks: [
      { name: 'Full Section Test', detail: 'Kerjakan 1 section penuh secara intens', time: '60m' }
    ]
  },
  'Minggu': {
    type: 'Passive Immersion', focus: 'Rest & Enjoyment',
    tasks: [
      { name: 'Podcast/Movie (No Subtitle)', detail: 'Minimal 30 menit fokus mendengar', time: '30m' },
      { name: 'Light Reading', detail: 'Artikel/Berita bahasa Inggris kesukaan', time: '15m' }
    ]
  },
};

export const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

// MULAI 3 AGUSTUS 2026 - 7 NOVEMBER 2026 (97 HARI)
export const TOTAL_DAYS = 97;
export const PROGRAM_START_DATE = new Date(2026, 7, 3); // 3 August 2026

export const MOODS = [
  { key: 'good' as const, label: 'Tak Terkalahkan', color: 'var(--green)' },
  { key: 'neutral' as const, label: 'Disiplin', color: 'var(--blue-hover)' },
  { key: 'bad' as const, label: 'Berdarah-darah', color: 'var(--red)' }
];
