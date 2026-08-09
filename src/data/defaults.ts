import { HabitDefinition, RoadmapPhase, ToeflPhase, ToeflSchedule, WorkoutSchedule, Exercise } from '../types';

export const HABITS: HabitDefinition[] = [
  { id: 'nojunkfood', label: 'No Junkfood', color: '#10b981', iconName: 'warn', description: 'Bersih dari makanan olahan & gula berlebih' },
  { id: 'coding', label: 'Belajar Coding', color: '#a855f7', iconName: 'laptop', description: 'Minimal 1-2 jam per hari tuntas modul Coding' },
  { id: 'toefl', label: 'Belajar CPNS', color: '#8b5cf6', iconName: 'book', description: 'Latihan TWK, TIU, TKP, & Tryout SKD CPNS' },
  { id: 'workout', label: 'Workout', color: '#f59e0b', iconName: 'fitness', description: 'Disiplin penderitaan fisik & terapi scapular' },
  { id: 'nofap', label: 'NoFap', color: '#0ea5e9', iconName: 'lock', description: 'Fokus energi & retensi vitalitas penuh' },
];

export const DEFAULT_ROADMAP: RoadmapPhase[] = [
  {
    id: 'coding_mastery',
    title: 'Full-Stack Coding: JS, PHP & Laravel',
    week: '1–5',
    targetDeadline: '2026-08-31',
    desc: 'Fokus Utama Coding Mastery: Penguasaan Modern JavaScript (ES6+), Fundamentals & OOP PHP, serta Laravel Framework (MVC, REST API, Database & Blade/SPA).',
    color: '#a855f7',
    pl: 'https://www.youtube.com/results?search_query=belajar+javascript+php+laravel+indonesia',
    videos: [
      { id: 'cd_mod_1', title: '1. Modern JavaScript Essentials (DOM, ES6+, Async/Await & Fetch)', url: '' },
      { id: 'cd_mod_2', title: '2. PHP Fundamentals & Object Oriented Programming (OOP PHP)', url: '' },
      { id: 'cd_mod_3', title: '3. Laravel Core Concepts (Routing, Controller, Eloquent ORM & Blade)', url: '' },
      { id: 'cd_mod_4', title: '4. Laravel REST API Development, Authentication (Sanctum) & MySQL', url: '' },
      { id: 'cd_mod_5', title: '5. Full-Stack Portfolio: Building & Deploying Web App (Laravel + JS)', url: '' }
    ],
    casestudies: [
      { id: 'cd_cs_1', title: 'Project 1: Interactive Web App with Modern JavaScript', desc: 'Bangun fitur interaktif berbasis DOM, Event Listeners, Async API calls, dan Local Storage.' },
      { id: 'cd_cs_2', title: 'Project 2: PHP OOP & Database CRUD System', desc: 'Rancang sistem backend dasar menggunakan sintaks OOP PHP murni dan koneksi MySQL.' },
      { id: 'cd_cs_3', title: 'Project 3: Laravel Web Application & Management System', desc: 'Kembangkan aplikasi web utuh menggunakan arsitektur MVC Laravel dan Eloquent ORM.' },
      { id: 'cd_cs_4', title: 'Project 4: Laravel RESTful API Backend Service', desc: 'Buat endpoint API backend secure dengan autentikasi token Sanctum dan validasi data.' },
      { id: 'cd_cs_5', title: 'Project 5: End-to-End Laravel + JS Full-Stack Portfolio Showcase', desc: 'Projek komprehensif siap pamer ke recruiter dengan fitur auth, database, API, dan visualisasi rapi.' }
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
