// Mock Data — KEHATI Platform
// Data dummy untuk demonstrasi front-end

import { User, Screening, Slot, Booking, Article, DassQuestion, AdminStats } from './types';

// ─── Users ───────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'usr_01HXYZ',
    nrp: '82110001',
    nama_lengkap: 'Bripda Agus Santoso',
    pangkat: 'Bripda',
    satker: 'Polrestabes Bandung',
    unit: 'Reskrim',
    email: 'agus.santoso@polri.go.id',
    role: 'personel',
    is_active: true,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr_admin01',
    nrp: '70000001',
    nama_lengkap: 'Kompol Sari Dewi, S.Psi',
    pangkat: 'Kompol',
    satker: 'Biro SDM Polda Jabar',
    unit: 'Bagian Psikologi',
    role: 'admin',
    is_active: true,
    created_at: '2025-06-01T08:00:00Z',
  },
  {
    id: 'usr_psi01',
    nrp: '70000002',
    nama_lengkap: 'dr. Andini Putri, M.Psi',
    pangkat: 'Psikolog',
    satker: 'Biro SDM Polda Jabar',
    unit: 'Bagian Psikologi',
    role: 'psikolog',
    is_active: true,
    created_at: '2025-06-01T08:00:00Z',
  },
];

export const currentUser = mockUsers[0];
export const adminUser = mockUsers[1];

// ─── DASS-21 Questions ────────────────────────────────
export const dass21Questions: DassQuestion[] = [
  { nomor: 1,  text: 'Saya merasa sulit untuk bersantai',                                          kategori: 'stress' },
  { nomor: 2,  text: 'Saya menyadari diri saya mengalami mulut kering',                            kategori: 'anxiety' },
  { nomor: 3,  text: 'Saya tidak dapat merasakan perasaan positif sama sekali',                    kategori: 'depression' },
  { nomor: 4,  text: 'Saya mengalami kesulitan bernapas (misalnya sesak napas) tanpa berolahraga', kategori: 'anxiety' },
  { nomor: 5,  text: 'Saya merasa sulit untuk memulai melakukan sesuatu',                          kategori: 'depression' },
  { nomor: 6,  text: 'Saya cenderung bereaksi berlebihan terhadap suatu situasi',                  kategori: 'stress' },
  { nomor: 7,  text: 'Saya mengalami gemetar (misalnya di tangan)',                                kategori: 'anxiety' },
  { nomor: 8,  text: 'Saya merasa menggunakan banyak energi untuk merasa cemas',                   kategori: 'stress' },
  { nomor: 9,  text: 'Saya khawatir tentang situasi di mana saya mungkin panik dan mempermalukan diri sendiri', kategori: 'anxiety' },
  { nomor: 10, text: 'Saya merasa tidak ada yang bisa saya harapkan ke depan',                     kategori: 'depression' },
  { nomor: 11, text: 'Saya merasa mudah marah',                                                    kategori: 'stress' },
  { nomor: 12, text: 'Saya merasa banyak menguras tenaga',                                         kategori: 'depression' },
  { nomor: 13, text: 'Saya merasa sedih dan tertekan',                                             kategori: 'depression' },
  { nomor: 14, text: 'Saya merasa tidak sabar ketika tertunda (mis. lift, lampu merah)',            kategori: 'stress' },
  { nomor: 15, text: 'Saya merasa sudah hampir panik',                                             kategori: 'anxiety' },
  { nomor: 16, text: 'Saya tidak dapat antusias terhadap hal apapun',                              kategori: 'depression' },
  { nomor: 17, text: 'Saya merasa diri saya tidak berharga sebagai manusia',                       kategori: 'depression' },
  { nomor: 18, text: 'Saya merasa mudah tersinggung',                                              kategori: 'stress' },
  { nomor: 19, text: 'Saya merasakan detak jantung saya tanpa melakukan aktivitas fisik',          kategori: 'anxiety' },
  { nomor: 20, text: 'Saya merasa takut tanpa alasan yang jelas',                                  kategori: 'anxiety' },
  { nomor: 21, text: 'Saya merasa hidup ini tidak ada artinya',                                    kategori: 'depression' },
];

export const dassOptions = [
  { value: 0, label: 'Tidak pernah' },
  { value: 1, label: 'Kadang-kadang' },
  { value: 2, label: 'Sering' },
  { value: 3, label: 'Hampir selalu' },
];

// ─── Screenings ───────────────────────────────────────
export const mockScreenings: Screening[] = [
  {
    id: 'skr_01HABC',
    user_id: 'usr_01HXYZ',
    user: mockUsers[0],
    instrument_version: 'DASS-21-v1',
    jawaban: dass21Questions.map((q, i) => ({ nomor: q.nomor, skor: i % 4 === 0 ? 2 : i % 3 === 0 ? 1 : 0 })),
    skor_total: 18,
    level_risiko: 'sedang',
    dapat_booking: true,
    validation_status: 'approved',
    catatan_admin: 'Personel diizinkan melanjutkan ke booking jadwal rutin.',
    submitted_at: '2026-05-13T09:00:00Z',
    rekomendasi: 'Disarankan untuk melakukan konseling reguler.',
  },
  {
    id: 'skr_02HDEF',
    user_id: 'usr_01HXYZ',
    user: mockUsers[0],
    instrument_version: 'DASS-21-v1',
    jawaban: dass21Questions.map(q => ({ nomor: q.nomor, skor: 1 })),
    skor_total: 8,
    level_risiko: 'rendah',
    dapat_booking: true,
    validation_status: 'approved',
    submitted_at: '2026-03-01T10:00:00Z',
    rekomendasi: 'Kondisi Anda baik. Tetap jaga kesehatan mental.',
  },
  {
    id: 'skr_03HPQR',
    user_id: 'usr_01HXYZ',
    user: mockUsers[1],
    instrument_version: 'DASS-21-v1',
    jawaban: dass21Questions.map(q => ({ nomor: q.nomor, skor: 2 })),
    skor_total: 35,
    level_risiko: 'tinggi',
    dapat_booking: false,
    validation_status: 'pending',
    submitted_at: '2026-06-15T14:30:00Z',
  },
];

// ─── Psikolog ─────────────────────────────────────────
export const mockPsikolog = [
  { id: 'psi_01', nama: 'dr. Andini Putri, M.Psi', spesialis: 'Psikologi Klinis' },
  { id: 'psi_02', nama: 'Drs. Rudi Hartono, M.Si', spesialis: 'Psikologi Industri' },
  { id: 'psi_03', nama: 'Siti Rahayu, S.Psi., M.Psi', spesialis: 'Konseling' },
];

// ─── Slots ────────────────────────────────────────────
export const mockSlots: Slot[] = [
  {
    id: 'slot_01HDEF',
    psikolog: mockPsikolog[0],
    tanggal: '2026-07-01',
    jam_mulai: '09:00',
    jam_selesai: '10:00',
    metode: 'daring',
    kapasitas: 1,
    lokasi: 'Google Meet (link diberikan setelah konfirmasi)',
    status: 'available',
  },
  {
    id: 'slot_02HGHI',
    psikolog: mockPsikolog[0],
    tanggal: '2026-07-01',
    jam_mulai: '10:30',
    jam_selesai: '11:30',
    metode: 'luring',
    kapasitas: 1,
    lokasi: 'Ruang Konseling Lt.2, Gedung Biro SDM',
    status: 'available',
  },
  {
    id: 'slot_03HJKL',
    psikolog: mockPsikolog[1],
    tanggal: '2026-07-02',
    jam_mulai: '13:00',
    jam_selesai: '14:00',
    metode: 'daring',
    kapasitas: 1,
    lokasi: 'Zoom Meeting (link diberikan setelah konfirmasi)',
    status: 'available',
  },
  {
    id: 'slot_04HMNO',
    psikolog: mockPsikolog[2],
    tanggal: '2026-07-03',
    jam_mulai: '08:00',
    jam_selesai: '09:00',
    metode: 'luring',
    kapasitas: 1,
    lokasi: 'Ruang Konseling Lt.1, Gedung Biro SDM',
    status: 'booked',
  },
  {
    id: 'slot_05HPQR',
    psikolog: mockPsikolog[0],
    tanggal: '2026-07-03',
    jam_mulai: '14:00',
    jam_selesai: '15:00',
    metode: 'daring',
    kapasitas: 1,
    lokasi: 'Google Meet',
    status: 'available',
  },
  {
    id: 'slot_06HSTU',
    psikolog: mockPsikolog[1],
    tanggal: '2026-07-04',
    jam_mulai: '09:00',
    jam_selesai: '10:00',
    metode: 'daring',
    kapasitas: 1,
    lokasi: 'Teams Meeting',
    status: 'available',
  },
];

// ─── Bookings ─────────────────────────────────────────
export const mockBookings: Booking[] = [
  {
    id: 'bkg_01HXYZ',
    tiket_id: 'TKT-2026-00123',
    user_id: 'usr_01HXYZ',
    slot: mockSlots[0],
    screening_id: 'skr_01HABC',
    catatan_tambahan: 'Saya ingin membahas masalah tekanan kerja shift malam.',
    status: 'confirmed',
    created_at: '2026-05-13T09:15:00Z',
  },
  {
    id: 'bkg_02HABC',
    tiket_id: 'TKT-2026-00098',
    user_id: 'usr_01HXYZ',
    slot: { ...mockSlots[1], tanggal: '2026-04-15', status: 'completed' },
    screening_id: 'skr_02HDEF',
    status: 'completed',
    created_at: '2026-04-10T10:00:00Z',
  },
];

// ─── Articles ─────────────────────────────────────────
export const mockArticles: Article[] = [
  {
    id: 'art_01',
    judul: 'Tips Menjaga Kesehatan Mental Saat Bertugas di Lapangan',
    konten: '<p>Menjaga kesehatan mental saat bertugas di lapangan merupakan hal yang sangat penting bagi anggota Polri...</p><p>Berikut beberapa tips yang dapat diterapkan sehari-hari...</p>',
    kategori: 'Kesehatan',
    thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    status: 'published',
    author_id: 'usr_admin01',
    published_at: '2026-05-10T08:00:00Z',
    created_at: '2026-05-09T14:00:00Z',
    read_time: 5,
  },
  {
    id: 'art_02',
    judul: 'Program Konseling Gratis untuk Anggota dan Keluarga Polri',
    konten: '<p>Biro SDM Polda Jawa Barat dengan bangga mengumumkan program konseling gratis...</p>',
    kategori: 'Program SDM',
    thumbnail_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
    status: 'published',
    author_id: 'usr_admin01',
    published_at: '2026-05-08T08:00:00Z',
    created_at: '2026-05-07T14:00:00Z',
    read_time: 3,
  },
  {
    id: 'art_03',
    judul: 'Seminar Manajemen Stres Kerja di Lingkungan Polri',
    konten: '<p>Pada tanggal 5 Mei 2026, Biro SDM Polda Jabar menyelenggarakan seminar...</p>',
    kategori: 'Kegiatan',
    thumbnail_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    status: 'published',
    author_id: 'usr_admin01',
    published_at: '2026-05-05T08:00:00Z',
    created_at: '2026-05-04T14:00:00Z',
    read_time: 4,
  },
  {
    id: 'art_04',
    judul: 'Pentingnya Self-Care bagi Personel Kepolisian',
    konten: '<p>Self-care bukan berarti egois. Justru dengan merawat diri sendiri...</p>',
    kategori: 'Kesehatan',
    thumbnail_url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
    status: 'published',
    author_id: 'usr_admin01',
    published_at: '2026-04-28T08:00:00Z',
    created_at: '2026-04-27T14:00:00Z',
    read_time: 6,
  },
  {
    id: 'art_05',
    judul: 'Mengenal Gejala Burnout dan Cara Mengatasinya',
    konten: '<p>Burnout adalah kondisi kelelahan emosional dan fisik akibat beban kerja berlebih...</p>',
    kategori: 'Edukasi',
    thumbnail_url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
    status: 'published',
    author_id: 'usr_admin01',
    published_at: '2026-04-20T08:00:00Z',
    created_at: '2026-04-19T14:00:00Z',
    read_time: 7,
  },
  {
    id: 'art_06',
    judul: 'Draft: Pedoman Penggunaan Aplikasi KEHATI',
    konten: '<p>Panduan lengkap penggunaan aplikasi KEHATI untuk personel...</p>',
    kategori: 'Panduan',
    status: 'draft',
    author_id: 'usr_admin01',
    created_at: '2026-06-15T10:00:00Z',
    read_time: 10,
  },
];

// ─── Admin Stats ──────────────────────────────────────
export const mockAdminStats: AdminStats = {
  total_skrining_hari_ini: 12,
  antrian_booking: 5,
  distribusi_risiko: { rendah: 45, sedang: 38, tinggi: 17 },
  total_user: 248,
};

// ─── Pangkat Options ──────────────────────────────────
export const pangkatOptions = [
  'Bhayangkara Dua (Bharada)',
  'Bhayangkara Satu (Bharatu)',
  'Bhayangkara Kepala (Bhakapolsek)',
  'Brigadir Polisi Dua (Bripda)',
  'Brigadir Polisi Satu (Briptu)',
  'Brigadir Polisi (Brigpol)',
  'Brigadir Polisi Kepala (Bripka)',
  'Ajun Inspektur Polisi Dua (Aipda)',
  'Ajun Inspektur Polisi Satu (Aiptu)',
  'Inspektur Polisi Dua (Ipda)',
  'Inspektur Polisi Satu (Iptu)',
  'Ajun Komisaris Polisi (AKP)',
  'Komisaris Polisi (Kompol)',
  'Ajun Komisaris Besar Polisi (AKBP)',
  'Komisaris Besar Polisi (Kombes)',
  'Brigadir Jenderal Polisi (Brigjen)',
];

export const satkerOptions = [
  'Polrestabes Bandung',
  'Polres Bandung',
  'Polres Bandung Barat',
  'Polres Cimahi',
  'Polres Bogor',
  'Polres Depok',
  'Polres Bekasi',
  'Polres Karawang',
  'Polres Purwakarta',
  'Polres Subang',
  'Polres Sumedang',
  'Polres Garut',
  'Polres Tasikmalaya',
  'Polres Ciamis',
  'Polres Kuningan',
  'Polres Cirebon',
  'Polres Majalengka',
  'Polres Indramayu',
  'Polrestabes Cirebon',
  'Biro SDM Polda Jabar',
  'Ditlantas Polda Jabar',
  'Ditreskrimum Polda Jabar',
];

// ─── Helper Functions ─────────────────────────────────
export function getRisikoColor(level: string): string {
  switch (level) {
    case 'rendah':  return 'text-green-700 bg-green-100';
    case 'sedang':  return 'text-yellow-700 bg-yellow-100';
    case 'tinggi':  return 'text-red-700 bg-red-100';
    default:        return 'text-gray-700 bg-gray-100';
  }
}

export function getValidationColor(status: string): string {
  switch (status) {
    case 'approved':  return 'text-green-700 bg-green-100';
    case 'referred':  return 'text-blue-700 bg-blue-100';
    case 'rejected':  return 'text-red-700 bg-red-100';
    case 'pending':   return 'text-yellow-700 bg-yellow-100';
    default:          return 'text-gray-700 bg-gray-100';
  }
}

export function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':  return 'text-green-700 bg-green-100';
    case 'completed':  return 'text-blue-700 bg-blue-100';
    case 'cancelled':  return 'text-red-700 bg-red-100';
    default:           return 'text-gray-700 bg-gray-100';
  }
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}
