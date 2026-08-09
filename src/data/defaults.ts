import { HabitDefinition, RoadmapPhase, ToeflPhase, ToeflSchedule, WorkoutSchedule, Exercise } from '../types';

export const HABITS: HabitDefinition[] = [
  { id: 'nojunkfood', label: 'No Junkfood', color: '#10b981', iconName: 'warn', description: 'Bersih dari makanan olahan & gula berlebih' },
  { id: 'coding', label: 'Belajar Data Analyst', color: '#a855f7', iconName: 'laptop', description: 'Minimal 1-2 jam per hari tuntas modul Data Analyst' },
  { id: 'toefl', label: 'Belajar CPNS', color: '#8b5cf6', iconName: 'book', description: 'Latihan TWK, TIU, TKP, & Tryout SKD CPNS' },
  { id: 'workout', label: 'Workout', color: '#f59e0b', iconName: 'fitness', description: 'Disiplin penderitaan fisik & terapi scapular' },
  { id: 'nofap', label: 'NoFap', color: '#0ea5e9', iconName: 'lock', description: 'Fokus energi & retensi vitalitas penuh' },
];

export const DEFAULT_ROADMAP: RoadmapPhase[] = [
  {
    id: 'da_excel',
    title: '1. Microsoft Excel for Data Analytics',
    week: '1–2',
    targetDeadline: '2026-08-15',
    desc: 'Penguasaan VLOOKUP/XLOOKUP, Power Query, Dynamic Arrays, Pivot Tables, & Visualisasi Executive Dashboard.',
    color: '#10b981',
    pl: 'https://www.youtube.com/results?search_query=belajar+excel+data+analyst+indonesia',
    videos: [
      { id: 'ex_mod_1', title: '1. Formula Intermediate & Advanced (XLOOKUP, INDEX/MATCH, Nested IF)', url: '' },
      { id: 'ex_mod_2', title: '2. Data Cleaning & Text Functions (TRIM, CONCAT, Text to Columns)', url: '' },
      { id: 'ex_mod_3', title: '3. Power Query & ETL Data Transformation', url: '' },
      { id: 'ex_mod_4', title: '4. Dynamic Pivot Tables, Slicers & Calculated Fields', url: '' },
      { id: 'ex_mod_5', title: '5. Building Interactive Executive Business Dashboard in Excel', url: '' }
    ],
    casestudies: [
      { id: 'ex_cs_1', title: 'Project 1: Sales Transaction Cleaning & Standardization', desc: 'Olah dan bersihkan data transaksi penjualan dengan formula XLOOKUP & kriteria ganda.' },
      { id: 'ex_cs_2', title: 'Project 2: Interactive Executive Sales Dashboard in Excel', desc: 'Rancang dashboard eksekutif otomatis yang dapat di-refresh dengan sekali klik.' }
    ]
  },
  {
    id: 'da_sql',
    title: '2. SQL & Relational Database Querying',
    week: '3–4',
    targetDeadline: '2026-08-31',
    desc: 'Mastering SQL queries: SELECT, WHERE, JOINs, Aggregations, GROUP BY, Subqueries, CTEs, & Window Functions di PostgreSQL/MySQL.',
    color: '#3b82f6',
    pl: 'https://www.youtube.com/results?search_query=belajar+sql+data+analyst+indonesia',
    videos: [
      { id: 'sql_mod_1', title: '1. SQL Fundamentals: SELECT, WHERE, ORDER BY, & Operators', url: '' },
      { id: 'sql_mod_2', title: '2. Data Aggregations & Grouping (COUNT, SUM, AVG, GROUP BY, HAVING)', url: '' },
      { id: 'sql_mod_3', title: '3. Relational Joins (INNER, LEFT, RIGHT, FULL OUTER JOIN)', url: '' },
      { id: 'sql_mod_4', title: '4. Subqueries & CTEs (Common Table Expressions)', url: '' },
      { id: 'sql_mod_5', title: '5. Advanced Window Functions (RANK, DENSE_RANK, ROW_NUMBER, LAG/LEAD)', url: '' }
    ],
    casestudies: [
      { id: 'sql_cs_1', title: 'Project 1: E-Commerce Customer Cohort & Retention Analysis in SQL', desc: 'Ekstrak metrik retensi dan kelompok pelanggan menggunakan SQL CTE & Window Functions.' },
      { id: 'sql_cs_2', title: 'Project 2: Monthly Revenue & Product Growth Analytics', desc: 'Hitung pertumbuhan pendapatan bulanan (MoM) dan produk terlaris dengan SQL Aggregations.' }
    ]
  },
  {
    id: 'da_powerbi',
    title: '3. Power BI & Business Intelligence',
    week: '5–6',
    targetDeadline: '2026-09-15',
    desc: 'Desain dashboard bisnis interaktif, data modeling Star Schema, DAX measures (CALCULATE, SUMX), dan visual storytelling.',
    color: '#f59e0b',
    pl: 'https://www.youtube.com/results?search_query=belajar+power+bi+indonesia',
    videos: [
      { id: 'pbi_mod_1', title: '1. Introduction to Power BI Desktop & Importing Data', url: '' },
      { id: 'pbi_mod_2', title: '2. Data Modeling & Star Schema Relationships', url: '' },
      { id: 'pbi_mod_3', title: '3. DAX Formulas Essentials (CALCULATE, ALL, RELATED, SUMX)', url: '' },
      { id: 'pbi_mod_4', title: '4. Designing Interactive Reports & Custom Visuals', url: '' },
      { id: 'pbi_mod_5', title: '5. Publishing Reports & Managing Power BI Workspaces', url: '' }
    ],
    casestudies: [
      { id: 'pbi_cs_1', title: 'Project 1: Executive KPI Dashboard & Financial Overview', desc: 'Rancang dashboard eksekutif real-time dengan filter interaktif dan laporan performa.' },
      { id: 'pbi_cs_2', title: 'Project 2: Customer Churn & HR Analytics BI Report', desc: 'Visualisasikan tingkat churn pelanggan dan analisis turnover karyawan secara interaktif.' }
    ]
  },
  {
    id: 'da_python',
    title: '4. Python for Data Analysis (Pandas & NumPy)',
    week: '7–8',
    targetDeadline: '2026-09-30',
    desc: 'Exploratory Data Analysis (EDA) menggunakan Python, Pandas untuk manipulasi dataframe, NumPy, dan visualisasi Matplotlib/Seaborn.',
    color: '#8b5cf6',
    pl: 'https://www.youtube.com/results?search_query=belajar+python+data+analyst+indonesia',
    videos: [
      { id: 'py_mod_1', title: '1. Python Basics & Jupyter Notebook Environment', url: '' },
      { id: 'py_mod_2', title: '2. NumPy Arrays & Vectorized Operations', url: '' },
      { id: 'py_mod_3', title: '3. Pandas DataFrames: Cleaning, Filtering & GroupBy', url: '' },
      { id: 'py_mod_4', title: '4. Data Visualization with Matplotlib & Seaborn', url: '' },
      { id: 'py_mod_5', title: '5. Exploratory Data Analysis (EDA) Workflow on Real Datasets', url: '' }
    ],
    casestudies: [
      { id: 'py_cs_1', title: 'Project 1: Exploratory Data Analysis (EDA) on Hotel Booking Dataset', desc: 'Lakukan pembersihan data, statistik deskriptif, dan visualisasi distribusi data menggunakan Python.' },
      { id: 'py_cs_2', title: 'Project 2: Customer Segmentation & Statistical Analysis with Python', desc: 'Analisis segmen pelanggan berbasis perilaku pembelian menggunakan Pandas & Seaborn.' }
    ]
  },
  {
    id: 'da_portfolio',
    title: '5. Portfolio Showcase & Business Storytelling',
    week: '9–10',
    targetDeadline: '2026-10-15',
    desc: 'Penyusunan portofolio profesional di GitHub/LinkedIn/Notion, teknik presentasi bisnis, dan persiapan wawancara Data Analyst.',
    color: '#ec4899',
    pl: 'https://www.youtube.com/results?search_query=portofolio+data+analyst+siap+kerja',
    videos: [
      { id: 'pf_mod_1', title: '1. Structuring a High-Impact Data Analyst Portfolio', url: '' },
      { id: 'pf_mod_2', title: '2. Data Storytelling & Executive Presentation Skills', url: '' },
      { id: 'pf_mod_3', title: '3. Building a Personal Portfolio Website / GitHub Readme', url: '' }
    ],
    casestudies: [
      { id: 'pf_cs_1', title: 'Project 1: End-to-End Business Case Study Portfolio Presentation', desc: 'Projek komprehensif siap pamer ke recruiter dengan laporan analisis bisnis dan visualisasi profesional.' }
    ]
  }
];

export const DEFAULT_TOEFL: ToeflPhase[] = [
  {
    id: 'cpns_twk', title: 'TWK (Tes Wawasan Kebangsaan)', week: '1-2',
    desc: 'Pemahaman santai Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, & Integritas.',
    color: '#8b5cf6',
    items: [
      { id: 'twk_01', title: 'Rangkuman Santai Pancasila & Pengamalan Sila' },
      { id: 'twk_02', title: 'Highlight Pasal-Pasal Penting UUD 1945' },
      { id: 'twk_03', title: 'Poin Kunci Sejarah & Integrasi NKRI' },
      { id: 'twk_04', title: 'Konsep Dasar Bela Negara & Integritas' }
    ]
  },
  {
    id: 'cpns_tiu', title: 'TIU (Tes Inteligensia Umum)', week: '3-4',
    desc: 'Latihan ringan Verbal (Analogi/Silogisme) & Numerik Trik Cepat.',
    color: '#3b82f6',
    items: [
      { id: 'tiu_01', title: 'Trik Singkat Analogi Kata & Silogisme' },
      { id: 'tiu_02', title: 'Rumus Cepat Deret Angka & Pecahan' },
      { id: 'tiu_03', title: 'Pola Mudah Soal Cerita Matematika' },
      { id: 'tiu_04', title: 'Latihan Visual Figural Ringan' }
    ]
  },
  {
    id: 'cpns_tkp', title: 'TKP (Tes Karakteristik Pribadi)', week: '5-6',
    desc: 'Mindset kunci opsi nilai 5 untuk Pelayanan Publik & Profesionalisme.',
    color: '#10b981',
    items: [
      { id: 'tkp_01', title: 'Kata Kunci Opsi Nilai 5 Pelayanan Publik' },
      { id: 'tkp_02', title: 'Mindset Profesionalisme & Jejaring Kerja' },
      { id: 'tkp_03', title: 'Pemahaman Ringan TIK & Radikalisme' }
    ]
  },
  {
    id: 'cpns_review', title: 'Review & Quiz Santai SKD', week: '7-8',
    desc: 'Latihan santai 10-15 soal tanpa tekanan timer berat.',
    color: '#f59e0b',
    items: [
      { id: 'str_01', title: 'Tips & Trik Mengatasi Soal Jebakan SKD' },
      { id: 'str_02', title: 'Quiz Ringan 15 Soal Mix SKD' },
      { id: 'str_03', title: 'Review Pembahasan Kunci Jawaban' }
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
    type: 'TWK Santai', focus: 'Rangkuman UUD 1945 & Pancasila',
    tasks: [
      { name: 'Baca 5 Pasal Penting UUD 1945', detail: 'Fokus pasal amandemen secara santai', time: '10m' },
      { name: 'Latihan 10 Soal TWK Ringan', detail: 'Soal pengamalan Pancasila', time: '10m' }
    ]
  },
  'Selasa': {
    type: 'TIU Verbal Ringan', focus: 'Silogisme & Analogi',
    tasks: [
      { name: 'Trik Cepat Silogisme', detail: 'Pahami logika dasar tanpa rumus rumit', time: '10m' },
      { name: 'Latihan 10 Soal TIU Verbal', detail: 'Analogi kata & logika sederhana', time: '10m' }
    ]
  },
  'Rabu': {
    type: 'TIU Numerik Santai', focus: 'Deret & Hitung Cepat',
    tasks: [
      { name: 'Latihan 10 Soal Deret Angka', detail: 'Pola deret aritmatika & geometri', time: '10m' },
      { name: 'Review Trik Hitung Cepat', detail: 'Persentase & pecahan sederhana', time: '10m' }
    ]
  },
  'Kamis': {
    type: 'TKP Santai', focus: 'Kata Kunci Opsi Nilai 5',
    tasks: [
      { name: 'Latihan 10 Soal TKP', detail: 'Fokus Pelayanan Publik & Integritas', time: '10m' },
      { name: 'Cek Kunci Opsi Nilai 5', detail: 'Pahami pola jawaban positif', time: '10m' }
    ]
  },
  'Jumat': {
    type: 'Quiz Santai', focus: 'Mix Soal SKD Ringan',
    tasks: [
      { name: 'Quiz Ringan 15 Soal (TWK+TIU+TKP)', detail: 'Tanpa batasan timer ketat', time: '15m' }
    ]
  },
  'Sabtu': {
    type: 'Review Ringan', focus: 'Pembahasan Soal',
    tasks: [
      { name: 'Review 10 Soal yang Belum Dipahami', detail: 'Cukup baca pembahasan kunci jawaban', time: '15m' }
    ]
  },
  'Minggu': {
    type: 'Rest & Santai', focus: 'Istirahat Penuh',
    tasks: [
      { name: 'Review Rangkuman Singkat (Opsional)', detail: 'Baca kilas rangkuman TWK', time: '10m' }
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
