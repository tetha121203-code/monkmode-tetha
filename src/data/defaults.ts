import { HabitDefinition, RoadmapPhase, ToeflPhase, ToeflSchedule, WorkoutSchedule, Exercise, TryoutRecord } from '../types';

export const HABITS: HabitDefinition[] = [
  { id: 'nojunkfood', label: 'No Junkfood', color: '#10b981', iconName: 'warn', description: 'Bersih dari makanan olahan & gula berlebih' },
  { id: 'toefl', label: 'Belajar CPNS (SKD)', color: '#8b5cf6', iconName: 'book', description: 'Protokol Ekstrem: Target Skor 450+, Drill 50-80 Soal/Hari, Speed TIU & Mindset TKP 200+' },
  { id: 'workout', label: 'Workout', color: '#f59e0b', iconName: 'fitness', description: 'Disiplin latihan fisik & terapi scapular' },
  { id: 'nofap', label: 'NoFap', color: '#0ea5e9', iconName: 'lock', description: 'Fokus energi & retensi vitalitas penuh' },
];

export const DEFAULT_ROADMAP: RoadmapPhase[] = [];

export const DEFAULT_TOEFL: ToeflPhase[] = [
  {
    id: 'cpns_twk',
    title: 'TWK (Tes Wawasan Kebangsaan)',
    week: '1–2',
    desc: 'Penguasaan 30 Soal TWK (Target Ekstrem 110–125/150): Bedah 45 Butir Pancasila, UUD 1945 Amandemen I–IV, Tata Negara, Sejarah Tokoh Bangsa, Bela Negara HOTS, Integritas ASN, & PUEBI.',
    color: '#8b5cf6',
    items: [
      { id: 'twk_01', title: 'Pancasila: Sejarah BPUPKI/PPKI, Piagam Jakarta, Kedudukan Dasar Negara & 45 Butir Pengamalan Sila I–V (TAP MPR I/2003)' },
      { id: 'twk_02', title: 'UUD NRI 1945: Struktur Pembukaan, Batang Tubuh, Pasal Kunci & Hasil Amandemen I (1999) s/d IV (2002)' },
      { id: 'twk_03', title: 'Lembaga Negara & Sistem Tata Negara: Wewenang MPR, DPR, DPD, Presiden, BPK, MA, MK, KY' },
      { id: 'twk_04', title: 'NKRI & Wawasan Nusantara: Batas Wilayah, Deklarasi Djuanda, Geopolitik & Tokoh Pahlawan Nasional' },
      { id: 'twk_05', title: 'Bhinneka Tunggal Ika: Asal Usul Kitab Sutasoma, Integrasi Nasional & Manajemen Konflik Sosial Budaya' },
      { id: 'twk_06', title: 'Bela Negara & Nasionalisme HOTS: Unsur Dasar Bela Negara, Patriotisme, & Penerapan di Era Modern' },
      { id: 'twk_07', title: 'Integritas ASN, Core Values BerAKHLAK, Gratifikasi, Delik Korupsi & Penegakan Hukum KPK' },
      { id: 'twk_08', title: 'Bahasa Indonesia SKD: PUEBI, Kalimat Efektif, Paragraf Deduktif/Induktif & Penarikan Gagasan Pokok' }
    ]
  },
  {
    id: 'cpns_tiu',
    title: 'TIU (Tes Inteligensia Umum)',
    week: '3–4',
    desc: 'Penguasaan 35 Soal TIU (Target Ekstrem 150–165/175): Speed Hitung Cepat < 40 Detik/Soal, Deret Angka Multitingkat, Silogisme Negasi Kompleks, Logika Posisi, Soal Cerita Aljabar & Figural 9 Kotak.',
    color: '#3b82f6',
    items: [
      { id: 'tiu_01', title: 'Kemampuan Verbal: Analogi Kata Tingkat Lanjut, Hubungan Semantik Kompleks & Antonim/Sinonim' },
      { id: 'tiu_02', title: 'Kemampuan Verbal: Silogisme Tingkat Lanjut (Semua/Sebagian, Premis Implisit, Modus Ponens/Tollens & Negasi)' },
      { id: 'tiu_03', title: 'Kemampuan Verbal: Penalaran Analitis Urutan Posisi, Pemetaan Tabel Kombinasi & Rute Transit' },
      { id: 'tiu_04', title: 'Kemampuan Numerik: Trik Hitung Cepat Tanpa Coretan, Pecahan Istimewa, Desimal & Persentase Kilat' },
      { id: 'tiu_05', title: 'Kemampuan Numerik: Deret Angka Lompat 2-3 Tingkat, Deret Huruf & Deret Pola Fibonacci' },
      { id: 'tiu_06', title: 'Kemampuan Numerik: Soal Cerita Aljabar Jarak, Kecepatan, Waktu Berpapasan & Menyusul' },
      { id: 'tiu_07', title: 'Kemampuan Numerik: Perbandingan Senilai, Berbalik Nilai, & Rumus Pekerja Bersama/Terhenti' },
      { id: 'tiu_08', title: 'Kemampuan Numerik: Aritmatika Sosial Tingkat Lanjut (Untung/Rugi, Diskon Ganda, Bunga Tunggal & Pajak)' },
      { id: 'tiu_09', title: 'Kemampuan Figural: Analogi Bentuk, Ketidaksamaan Pola, & Serial Rotasi 9 Kotak Speed Run' }
    ]
  },
  {
    id: 'cpns_tkp',
    title: 'TKP (Tes Karakteristik Pribadi)',
    week: '5–6',
    desc: 'Penguasaan 45 Soal TKP (Target Ekstrem 210–220/225): Mindset Skor 5 Tanpa Kompromi (Zero Tolerance Skor ≤ 3) pada Pelayanan Publik, Integritas ASN, Anti-Radikalisme, & TIK Digital.',
    color: '#10b981',
    items: [
      { id: 'tkp_01', title: 'Pelayanan Publik Ekstrem: Mindset Cepat, Ramah, Solutif Tanpa Menunda, & Zero Pungli (Kunci Poin 5)' },
      { id: 'tkp_02', title: 'Jejaring Kerja & Kolaborasi: Komunikasi Efektif, Sinergi Lintas Sektoral, & Kepemimpinan Solutif' },
      { id: 'tkp_03', title: 'Sosial Budaya & Adaptasi: Menghargai Keberagaman, Inklusif, Anti Diskriminasi, & Manajemen Stres Kerja' },
      { id: 'tkp_04', title: 'Teknologi Informasi & Komunikasi (TIK): Efisiensi Digital, Inovasi Otomasi, & Adaptasi Sistem Baru' },
      { id: 'tkp_05', title: 'Profesionalisme & Integritas: Tanggung Jawab Tuntas, Memisahkan Urusan Pribadi, & Komitmen Jam Kerja ASN' },
      { id: 'tkp_06', title: 'Anti Radikalisme & Netralitas ASN: Moderasi Beragama, Deteksi Dini Intoleransi, & Kesetiaan Mutlak NKRI' }
    ]
  },
  {
    id: 'cpns_strategi',
    title: 'Strategi CAT & Fast Trik SKD',
    week: '7–8',
    desc: 'Teknik Ekstrem Manajemen Waktu 100 Menit untuk 110 Soal: Urutan TKP (45 dtk) → TWK (35 dtk) → TIU (50 dtk), Eliminasi Opsi Salah, & Skimming Cepat.',
    color: '#f59e0b',
    items: [
      { id: 'str_01', title: 'Manajemen Waktu CAT Ekstrem: 100 Menit untuk 110 Soal (Rata-rata 45-50 Detik per Butir Soal)' },
      { id: 'str_02', title: 'Protokol Urutan Eksekusi Terbaik: TKP (45 soal ~ 30m) → TWK (30 soal ~ 20m) → TIU (35 soal ~ 40m) + Sisa 10m Review' },
      { id: 'str_03', title: 'Trik Cepat Eliminasi Pilihan Pengecoh & Teknik Skimming Paragraf Panjang' },
      { id: 'str_04', title: 'Pola Mindset Poin 5 TKP: Kata Kunci Integritas, Empati Aktif & Orientasi Pelayanan Tanpa Syarat' },
      { id: 'str_05', title: 'Rumus Cepat Instan TIU: Pecahan Istimewa, Pola Deret Kilat, & Perbandingan Pekerja' }
    ]
  },
  {
    id: 'cpns_tryout',
    title: 'Simulasi CAT & Tryout SKD Mandiri',
    week: '9–10',
    desc: 'Simulasi Real 110 Soal Timer 100 Menit dengan Target Ekstrem Lolos Ranking 1 Formasi (Skor Aman 450+).',
    color: '#ec4899',
    items: [
      { id: 'try_01', title: 'Tryout Mandiri SKD Paket 1 (110 Soal) & Evaluasi Passing Grade Ketat' },
      { id: 'try_02', title: 'Tryout Mandiri SKD Paket 2 (110 Soal) & Analisis Kelemahan Sub-Tes' },
      { id: 'try_03', title: 'Tryout CAT SKD Paket 3 & Simulasi Realistis Waktu 100 Menit Standar BKN' },
      { id: 'try_04', title: 'Review Mendalam Bank Soal Error & Pemantapan Mental Juara 1 Formasi' }
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
    type: 'TWK Hardcore & Penalaran HOTS',
    focus: 'Target TWK 110+ — UUD 1945 Amandemen I–IV & 45 Butir Pancasila',
    tasks: [
      { name: 'Bedah 45 Butir Pancasila & Pasal Kunci UUD 1945', detail: 'Hafalan pasal amandemen, lembaga negara, & butir TAP MPR I/2003', time: '25m' },
      { name: 'Speed Drill 30 Soal TWK HOTS (Timer 20 Menit)', detail: 'Soal penalaran bela negara, integritas ASN & sejarah perjuangan bangsa', time: '25m' },
      { name: 'Analisis Soal Jebakan & Pembuatan Flashcard', detail: 'Catat opsi pengecoh & bedah undang-undang yang sering salah', time: '20m' }
    ]
  },
  'Selasa': {
    type: 'TIU Extreme Numerik & Speed Run',
    focus: 'Target TIU 150+ — Hitung Cepat < 40 Detik & Deret Angka Multitingkat',
    tasks: [
      { name: 'Drill 35 Soal Hitung Cepat & Pecahan Istimewa', detail: 'Trik eliminasi tanpa coretan panjang, batas maksimal 40 detik/soal', time: '35m' },
      { name: 'Drill 25 Soal Deret Angka Lompat 2-3 Tingkat', detail: 'Pola aritmatika bertingkat, geometri & kombinasi huruf/Fibonacci', time: '25m' },
      { name: 'Soal Cerita Aljabar: Kecepatan, Debit & Pekerja', detail: 'Rumus cepat berpapasan, menyusul, & efisiensi pekerja bersama', time: '25m' }
    ]
  },
  'Rabu': {
    type: 'TIU Extreme Logika & Figural Serial',
    focus: 'Target TIU 150+ — Silogisme Kompleks, Penalaran Analitis & 9 Kotak',
    tasks: [
      { name: 'Drill 30 Soal Silogisme Negasi & Premis Implisit', detail: 'Hukum semua/sebagian, modus ponens, tollens & silogisme bersyarat', time: '30m' },
      { name: 'Drill 20 Soal Penalaran Analitis Urutan & Posisi', detail: 'Trik tabel eliminasi posisi, perankingan & kombinasi rute transit', time: '25m' },
      { name: 'Speed Run 15 Soal Figural Serial 9 Kotak', detail: 'Rotasi, pencerminan, & pergeseran elemen gambar waktu < 30 detik', time: '20m' }
    ]
  },
  'Kamis': {
    type: 'TKP Extreme Mindset Skor 5 (Zero Tolerance ≤ 3)',
    focus: 'Target TKP 210+ — Pelayanan Publik, Anti Radikalisme & TIK Digital',
    tasks: [
      { name: 'Drill 45 Soal TKP HOTS Standar Timer 35 Menit', detail: 'Simulasi realistik pengerjaan cepat 45-50 detik per soal', time: '35m' },
      { name: 'Bedah Kunci Opsi Poin 5 vs Poin 4', detail: 'Eliminasi total opsi bernilai 1-3, kuasai kata kunci inisiatif & empati', time: '25m' },
      { name: 'Pendalaman Modul Anti Radikalisme & Moderasi', detail: 'Pola jawaban kesetiaan NKRI, toleransi & netralitas ASN mutlak', time: '20m' }
    ]
  },
  'Jumat': {
    type: 'SKD Speed Sprint & Bank Soal Error',
    focus: 'Sprint Campuran 65 Soal & Re-Drill Soal Terlemah',
    tasks: [
      { name: 'Speed Sprint 65 Soal Campuran TWK+TIU+TKP', detail: 'Timer 55 menit non-stop untuk melatih stamina dan konsentrasi CAT', time: '55m' },
      { name: 'Bedah Total Kesalahan & Re-drill Bank Soal Salah', detail: 'Ulangi setiap butir soal salah hingga mencapai akurasi 100%', time: '30m' }
    ]
  },
  'Sabtu': {
    type: 'Full CAT Marathon 110 Soal (Real 100 Menit)',
    focus: 'Simulasi Standar BKN — Target Skor Ekstrem 450+ / 550',
    tasks: [
      { name: 'Simulasi Akbar CAT SKD 110 Soal (Timer 100 Menit)', detail: 'Eksekusi urutan: TKP (45 soal) → TWK (30 soal) → TIU (35 soal)', time: '100m' },
      { name: 'Evaluasi Passing Grade & Input Skor Target 450+', detail: 'Breakdown capaian sub-tes dan catat analisis gap di riwayat tryout', time: '30m' }
    ]
  },
  'Minggu': {
    type: 'Weekly Retrospective & Flashcard Mastery',
    focus: 'Audit Progres Mingguan & Penguatan Sub-Tes Terlemah',
    tasks: [
      { name: 'Review Rangkuman Formula Cepat & Flashcard TWK', detail: 'Ulas rumus pekerja, pecahan, tabel wewenang lembaga & hak DPR', time: '30m' },
      { name: 'Drill 30 Soal Remedial Sub-Tes Terlemah Pekan Ini', detail: 'Targetkan penguasaan materi yang paling sering keliru', time: '30m' },
      { name: 'Perencanaan Target Ekstrem Pekan Depan & Recovery', detail: 'Evaluasi metrik belajar dan siapkan disiplin Monk Mode penuh', time: '15m' }
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

export const DEFAULT_TRYOUTS: TryoutRecord[] = [
  { id: 'to_1', name: 'Simulasi Baseline #1', date: '2026-08-04', twk: 60, tiu: 75, tkp: 162, notes: 'Evaluasi awal: TWK dan TIU masih di bawah passing grade.' },
  { id: 'to_2', name: 'Tryout Mandiri #2', date: '2026-08-08', twk: 70, tiu: 85, tkp: 168, notes: 'Peningkatan di TWK UUD 1945. Lolos passing grade tipis total 323.' },
  { id: 'to_3', name: 'Simulasi CAT Akbar #3', date: '2026-08-12', twk: 80, tiu: 105, tkp: 178, notes: 'TIU deret angka mulai lancar, total 363.' },
  { id: 'to_4', name: 'Tryout Intensif #4', date: '2026-08-16', twk: 85, tiu: 115, tkp: 186, notes: 'TKP tembus 186 dengan mindset opsi 5, total 386 mendekati target 400.' },
  { id: 'to_5', name: 'Simulasi CAT Nasional #5', date: '2026-08-19', twk: 95, tiu: 130, tkp: 194, notes: 'Total skor 419! Lolos aman passing grade & masuk zona ranking formasi.' }
];
