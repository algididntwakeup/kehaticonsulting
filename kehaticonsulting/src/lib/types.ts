// TypeScript Types — KEHATI Platform
// Berdasarkan Data Models di PRD v1.0

export type Role = 'personel' | 'admin' | 'psikolog';

export type RisikoLevel = 'rendah' | 'sedang' | 'tinggi';

export type ValidationStatus = 'pending' | 'approved' | 'referred' | 'rejected';

export type SlotStatus = 'available' | 'booked' | 'cancelled' | 'completed';

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export type ArticleStatus = 'draft' | 'published';

export type MetodeKonseling = 'daring' | 'luring';

// ─── User ───────────────────────────────────────────
export interface User {
  id: string;
  nrp: string;
  nama_lengkap: string;
  pangkat: string;
  satker: string;
  unit?: string;
  email?: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  avatar?: string;
}

// ─── Screening ───────────────────────────────────────
export interface AnswerItem {
  nomor: number;
  skor: number;
}

export interface Screening {
  id: string;
  user_id: string;
  user?: User;
  instrument_version: string;
  jawaban: AnswerItem[];
  skor_total: number;
  level_risiko: RisikoLevel;
  dapat_booking: boolean;
  validation_status: ValidationStatus;
  catatan_admin?: string;
  validated_by?: string;
  validated_at?: string;
  submitted_at: string;
  rekomendasi?: string;
}

// ─── Psikolog ────────────────────────────────────────
export interface Psikolog {
  id: string;
  nama: string;
  spesialis?: string;
  avatar?: string;
}

// ─── Slot ────────────────────────────────────────────
export interface Slot {
  id: string;
  psikolog: Psikolog;
  tanggal: string;     // YYYY-MM-DD
  jam_mulai: string;   // HH:mm
  jam_selesai: string; // HH:mm
  metode: MetodeKonseling;
  kapasitas: number;
  lokasi: string;
  status: SlotStatus;
}

// ─── Booking ─────────────────────────────────────────
export interface Booking {
  id: string;
  tiket_id: string;
  user_id: string;
  user?: User;
  slot: Slot;
  screening_id: string;
  catatan_tambahan?: string;
  status: BookingStatus;
  cancelled_at?: string;
  cancel_reason?: string;
  created_at: string;
}

// ─── Article ─────────────────────────────────────────
export interface Article {
  id: string;
  judul: string;
  konten: string;
  kategori: string;
  thumbnail_url?: string;
  status: ArticleStatus;
  author_id: string;
  author?: User;
  published_at?: string;
  created_at: string;
  read_time?: number; // dalam menit
}

// ─── Dashboard Stats (Admin) ──────────────────────────
export interface AdminStats {
  total_skrining_hari_ini: number;
  antrian_booking: number;
  distribusi_risiko: {
    rendah: number;
    sedang: number;
    tinggi: number;
  };
  total_user: number;
}

// ─── DASS-21 Question ─────────────────────────────────
export interface DassQuestion {
  nomor: number;
  text: string;
  kategori: 'depression' | 'anxiety' | 'stress';
}

// ─── Auth State ──────────────────────────────────────
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  nrp: string;
  password: string;
}

export interface RegisterPayload {
  nrp: string;
  nama_lengkap: string;
  pangkat: string;
  satker: string;
  unit?: string;
  password: string;
}
