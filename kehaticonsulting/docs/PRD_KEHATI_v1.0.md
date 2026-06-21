# Product Requirements Document (PRD)
## KEHATI — Aplikasi Konseling Online SDM Polda Jabar
**Versi:** 1.0  
**Tanggal:** 13 Mei 2026  
**Author:** Muhammad Al Ghifari (NPM 22.304.0001)  
**Status:** Draft — untuk handoff ke tim Backend/Fullstack  
**Studi Kasus:** Biro SDM Kepolisian Daerah Jawa Barat (Polda Jabar)

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Latar Belakang & Problem Statement](#2-latar-belakang--problem-statement)
3. [Tujuan Produk & Success Metrics](#3-tujuan-produk--success-metrics)
4. [Scope & Batasan](#4-scope--batasan)
5. [Aktor & Roles](#5-aktor--roles)
6. [User Stories](#6-user-stories)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [API Specification](#9-api-specification)
10. [Data Models](#10-data-models)
11. [UI/UX Flow](#11-uiux-flow)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [Tech Stack Rekomendasi](#13-tech-stack-rekomendasi)
14. [Glossary](#14-glossary)

---

## 1. Executive Summary

**KEHATI** (Kesehatan Hati) adalah platform konseling online berbasis web yang dirancang untuk Biro Sumber Daya Manusia (SDM) Polda Jawa Barat. Sistem ini mendigitalisasi seluruh alur layanan psikologi — dari pendaftaran mandiri, skrining kesehatan mental, pemilihan metode konseling, hingga penjadwalan sesi — menggantikan sistem administrasi manual (buku tamu + formulir kertas) yang saat ini digunakan.

**Masalah inti yang diselesaikan:**
- Rasio konselor:personel yang tidak seimbang (5 konselor vs >10.000 personel)
- Isu privasi: personel enggan antre di ruang terbuka karena takut diketahui rekan sejawat
- Tidak ada sistem penjadwalan otomatis → antrian menumpuk

**Front-end** sudah selesai dibangun menggunakan Next.js + React + Tailwind CSS. PRD ini berfokus pada **kebutuhan backend/fullstack** yang perlu diimplementasikan untuk menjadikan sistem ini production-ready.

---

## 2. Latar Belakang & Problem Statement

### 2.1 Kondisi Saat Ini (As-Is)

| Aspek | Kondisi Manual Saat Ini |
|-------|------------------------|
| Pendaftaran | Hadir fisik ke ruang Bagian Psikologi |
| Pencatatan | Buku register + formulir kertas |
| Penjadwalan | Dilakukan oleh petugas, rawan konflik slot |
| Riwayat | Disimpan dalam arsip fisik, sulit dilacak |
| Privasi | Sangat lemah — identitas terekspos di ruang terbuka |
| Rasio SDM | 5 psikolog vs ±10.000 personel |

### 2.2 Root Cause Analysis

Berdasarkan analisis Fishbone Diagram:

- **Manusia:** Rasio konselor tidak seimbang, beban kerja ganda pada pejabat Satker
- **Metode:** Pendaftaran manual, tidak ada skrining digital, penjadwalan konvensional
- **Material:** Pencatatan berbasis kertas, arsip tidak terintegrasi, keamanan fisik lemah
- **Lingkungan:** Stigma sosial, trust issue, aksesibilitas terbatas bagi personel lapangan

### 2.3 Dampak Bisnis

- Penanganan kasus psikologis terhambat karena waiting list yang panjang
- Personel tidak melaporkan kondisi psikologis karena kekhawatiran privasi
- Tidak ada data historis yang terstruktur untuk evaluasi program kesehatan mental institusi

---

## 3. Tujuan Produk & Success Metrics

### 3.1 Tujuan Produk

1. Menyediakan antarmuka self-service yang memungkinkan personel mendaftar, skrining, dan booking jadwal tanpa tatap muka fisik
2. Menjamin kerahasiaan data psikologis melalui autentikasi berbasis role (RBAC)
3. Mengefisiensikan pengelolaan jadwal konseling melalui sistem booking otomatis

### 3.2 Success Metrics (KPI)

| Metrik | Baseline (Manual) | Target (Sistem) |
|--------|-------------------|-----------------|
| Waktu pendaftaran rata-rata | >30 menit | <5 menit |
| Jumlah personel yang mengakses layanan/bulan | <50 | >200 |
| Tingkat kepuasan pengguna (SUS Score) | - | ≥75 (Good) |
| Waiting list rata-rata | >7 hari | <3 hari |
| Kebocoran data privasi | Tidak termonitor | 0 insiden |

---

## 4. Scope & Batasan

### 4.1 In-Scope (V1.0)

- Autentikasi & manajemen akun (login, register, logout)
- Portal berita/informasi dari Biro SDM (CRUD oleh Admin)
- Skrining kesehatan mental mandiri (self-assessment berbasis DASS-21)
- Sistem triase otomatis: klasifikasi risiko Rendah / Sedang / Tinggi
- Booking jadwal konseling (daring/luring) berdasarkan slot yang tersedia
- Riwayat konseling & tiket digital
- Dashboard Admin/Konselor: validasi skrining, kelola jadwal, kelola user
- Role-Based Access Control: Personel | Admin/Konselor | Psikolog

### 4.2 Out-of-Scope (V1.0 — untuk versi berikutnya)

- Sesi konseling video call real-time (WebRTC/Zoom integration)
- Notifikasi push / SMS reminder
- Enkripsi database tingkat lanjut (at-rest encryption)
- Integrasi SIMPOLRI atau sistem HR Polri eksisting
- Mobile native app (iOS/Android)
- Laporan analitik lanjutan (BI dashboard)

---

## 5. Aktor & Roles

### 5.1 Definisi Aktor

| Role | Deskripsi | Akses Utama |
|------|-----------|-------------|
| **Personel (User)** | Anggota Polri/PNS yang membutuhkan layanan konseling | Skrining, Booking, Riwayat, Berita |
| **Admin / Konselor** | Petugas Biro SDM yang mengelola sistem | Semua fitur Personel + Kelola Jadwal, Validasi Skrining, Kelola Berita, Kelola User |
| **Psikolog** | Tenaga profesional yang menerima pasien | Lihat Jadwal, Terima Pendaftaran, Input Catatan Sesi |

### 5.2 Permission Matrix

| Fitur | Personel | Admin/Konselor | Psikolog |
|-------|----------|----------------|----------|
| Register/Login | ✅ | ✅ | ✅ |
| Isi Skrining | ✅ | ✅ | ✅ |
| Booking Jadwal | ✅ | ❌ | ❌ |
| Lihat Riwayat Sendiri | ✅ | ❌ | ❌ |
| Kelola Berita | ❌ | ✅ | ❌ |
| Validasi Skrining | ❌ | ✅ | ✅ |
| Kelola Jadwal | ❌ | ✅ | ✅ |
| Lihat Semua Riwayat | ❌ | ✅ | ✅ |
| Kelola User | ❌ | ✅ | ❌ |
| Cetak Surat Rujukan | ❌ | ✅ | ✅ |

---

## 6. User Stories

### 6.1 Personel (User)

**US-01 — Registrasi Akun**
> Sebagai personel baru, saya ingin mendaftarkan akun dengan NRP, nama, satuan, dan pangkat saya, agar sistem dapat memverifikasi keanggotaan saya sebelum menggunakan layanan.

**US-02 — Login Aman**
> Sebagai personel, saya ingin login menggunakan NRP dan kata sandi, agar hanya saya yang dapat mengakses data psikologis saya.

**US-03 — Skrining Mandiri**
> Sebagai personel, saya ingin mengisi kuesioner kesehatan mental secara mandiri dari perangkat saya, agar saya tidak perlu hadir fisik dan identitas saya terjaga.

**US-04 — Melihat Hasil Triase**
> Sebagai personel, setelah mengisi skrining, saya ingin langsung melihat hasil klasifikasi risiko saya (Rendah/Sedang/Tinggi) beserta rekomendasi tindak lanjutnya.

**US-05 — Booking Jadwal Konseling**
> Sebagai personel dengan hasil skrining Rendah/Sedang, saya ingin memilih slot jadwal konseling yang tersedia (daring/luring), agar saya dapat merencanakan sesi sesuai waktu saya.

**US-06 — Melihat Tiket & Riwayat**
> Sebagai personel, saya ingin melihat tiket booking aktif dan riwayat konseling saya, agar saya dapat memantau status layanan yang saya gunakan.

**US-07 — Membaca Berita & Artikel**
> Sebagai personel, saya ingin membaca artikel kesehatan mental dan informasi dari Biro SDM, agar saya tetap mendapat informasi yang relevan tentang kesehatan mental.

**US-08 — Logout Aman**
> Sebagai personel, saya ingin dapat logout dari aplikasi, agar sesi saya berakhir dan data saya tidak dapat diakses orang lain dari perangkat yang sama.

### 6.2 Admin / Konselor

**US-09 — Dashboard Monitoring**
> Sebagai Admin, saya ingin melihat daftar hasil skrining personel beserta level risikonya, agar saya dapat memprioritaskan penanganan kasus risiko tinggi.

**US-10 — Validasi & Tindak Lanjut Skrining**
> Sebagai Admin/Konselor, saya ingin meninjau hasil skrining personel dan memberikan rekomendasi (booking disetujui, surat rujukan, atau perintah menghadap), agar tindak lanjut yang tepat dapat diberikan.

**US-11 — Kelola Slot Jadwal**
> Sebagai Admin/Psikolog, saya ingin menambahkan, mengubah, atau menghapus slot waktu ketersediaan konselor, agar personel dapat booking jadwal yang akurat.

**US-12 — Kelola Konten Berita**
> Sebagai Admin, saya ingin membuat, mengedit, dan menghapus artikel/berita di portal, agar personel selalu mendapat informasi terbaru.

**US-13 — Manajemen User**
> Sebagai Admin, saya ingin melihat daftar seluruh user yang terdaftar dan mengubah role-nya jika diperlukan, agar hak akses sistem terjaga dengan baik.

**US-14 — Cetak Surat Rujukan**
> Sebagai Admin/Psikolog, saya ingin mencetak atau mengekspor surat rekomendasi/rujukan untuk personel dengan risiko tinggi, agar dokumen formal dapat diterbitkan.

---

## 7. Functional Requirements

### F-01 — Registrasi & Autentikasi

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-01.1 | Sistem menyediakan form registrasi dengan field: Nama Lengkap, NRP, Pangkat, Satuan Kerja (Satker), Unit, Email (opsional), Password | P0 |
| F-01.2 | Password disimpan dengan hashing bcrypt (minimum cost factor 12) | P0 |
| F-01.3 | Login menggunakan NRP + Password | P0 |
| F-01.4 | Sistem menerbitkan JWT token saat login berhasil (access token: 1 jam, refresh token: 7 hari) | P0 |
| F-01.5 | Sistem membatasi percobaan login gagal: max 5x dalam 15 menit (rate limiting) | P1 |
| F-01.6 | Sistem mendukung logout yang menginvalidasi token sesi aktif | P0 |
| F-01.7 | Role default saat registrasi adalah "Personel"; perubahan role hanya bisa dilakukan Admin | P0 |

### F-02 — Portal Berita

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-02.1 | Sistem menampilkan daftar artikel/berita dalam format feed (card-based) | P0 |
| F-02.2 | Artikel mendukung field: Judul, Konten (rich text), Thumbnail, Kategori, Tanggal Publikasi, Status (Draft/Published) | P1 |
| F-02.3 | Admin dapat membuat, mengedit, dan menghapus artikel (CRUD) | P0 |
| F-02.4 | Personel hanya dapat membaca artikel yang berstatus Published | P0 |
| F-02.5 | Sistem mendukung pencarian artikel berdasarkan judul | P2 |

### F-03 — Skrining Kesehatan Mental (E-Kuesioner)

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-03.1 | Sistem menampilkan kuesioner multi-step berdasarkan instrumen DASS-21 (21 pertanyaan, skala 0–3) | P0 |
| F-03.2 | Sistem menyimpan jawaban sementara (draft) per step agar pengguna tidak kehilangan progress jika ada gangguan koneksi | P1 |
| F-03.3 | Sistem menghitung skor total dan mengklasifikasikan ke 3 kategori risiko berdasarkan threshold DASS-21: Rendah (<15), Sedang (15–28), Tinggi (>28) | P0 |
| F-03.4 | Hasil skrining yang sudah disubmit berstatus **read-only** bagi pengguna (tidak dapat diubah) | P0 |
| F-03.5 | Personel hanya dapat mengisi skrining baru setelah skrining sebelumnya divalidasi atau melewati periode 30 hari | P1 |
| F-03.6 | Hasil skrining tersimpan dengan timestamp dan versi instrumen yang digunakan | P1 |

### F-04 — Triase & Routing Otomatis

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-04.1 | Setelah submit skrining, sistem otomatis menampilkan halaman yang sesuai: Risiko Rendah/Sedang → redirect ke Booking; Risiko Tinggi → tampilkan halaman Rekomendasi Khusus (tidak ke Booking) | P0 |
| F-04.2 | Untuk kasus Risiko Tinggi, sistem mengirim notifikasi internal (in-app alert) kepada Admin/Konselor yang bertugas | P1 |
| F-04.3 | Admin dapat mengoverride hasil triase dan secara manual mengizinkan/menolak akses ke Booking | P1 |

### F-05 — Booking & Penjadwalan

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-05.1 | Sistem menampilkan kalender slot waktu yang tersedia dari Admin/Psikolog | P0 |
| F-05.2 | Personel dapat memilih metode konseling: Daring (online) atau Luring (tatap muka) | P0 |
| F-05.3 | Setiap slot hanya dapat dipesan oleh satu personel (atomic booking, mencegah double booking) | P0 |
| F-05.4 | Setelah booking berhasil, sistem menerbitkan tiket digital berisi: ID Tiket, Nama Personel, Tanggal/Jam, Metode, Nama Konselor | P0 |
| F-05.5 | Personel dapat membatalkan booking maksimal 24 jam sebelum jadwal (status slot kembali Available) | P1 |
| F-05.6 | Admin dapat menambah/mengedit/menghapus slot jadwal | P0 |
| F-05.7 | Status slot: Available / Booked / Cancelled / Completed | P0 |

### F-06 — Riwayat & Tiket

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-06.1 | Personel dapat melihat daftar riwayat seluruh skrining dan booking yang pernah dilakukan | P0 |
| F-06.2 | Personel dapat melihat detail tiket aktif | P0 |
| F-06.3 | Admin dapat melihat riwayat seluruh personel dengan filter by Satker, tanggal, status, level risiko | P1 |
| F-06.4 | Sistem mendukung ekspor riwayat dalam format PDF (surat rujukan) untuk kasus risiko tinggi | P1 |

### F-07 — Dashboard Admin

| Kode | Kebutuhan | Prioritas |
|------|-----------|-----------|
| F-07.1 | Dashboard menampilkan statistik ringkas: total skrining hari ini, antrian booking, distribusi level risiko | P1 |
| F-07.2 | Admin dapat melihat daftar hasil skrining yang belum divalidasi | P0 |
| F-07.3 | Admin dapat mengubah status validasi skrining: Pending / Approved / Referred | P0 |
| F-07.4 | Admin dapat melihat dan mengelola daftar semua user | P1 |

---

## 8. Non-Functional Requirements

| Kode | Parameter | Kebutuhan | Prioritas |
|------|-----------|-----------|-----------|
| NF-01 | **Keamanan Auth** | Autentikasi wajib menggunakan JWT. Refresh token disimpan di HttpOnly cookie untuk mencegah XSS. | P0 |
| NF-02 | **Enkripsi Transit** | Seluruh komunikasi menggunakan HTTPS/TLS 1.2+ | P0 |
| NF-03 | **Privasi Data** | Data hasil skrining hanya dapat diakses oleh pemilik (Personel yang bersangkutan) dan Admin/Psikolog. Endpoint API wajib melakukan validasi kepemilikan resource | P0 |
| NF-04 | **Ketersediaan** | Sistem harus tersedia 24/7 dengan uptime ≥99% | P1 |
| NF-05 | **Performa** | Response time API ≤500ms untuk operasi CRUD standar pada kondisi beban normal | P1 |
| NF-06 | **Responsivitas UI** | Front-end wajib responsif pada viewport: Mobile (≥375px), Tablet (≥768px), Desktop (≥1280px) | P0 |
| NF-07 | **Integritas Data Skrining** | Hasil skrining yang sudah disubmit tidak dapat dimodifikasi (immutable record). Hanya boleh ada penambahan catatan (append-only notes) oleh Admin | P0 |
| NF-08 | **Rate Limiting** | API auth endpoint dibatasi 5 request/15 menit per IP. API umum dibatasi 100 request/menit per user | P1 |
| NF-09 | **Audit Log** | Seluruh aksi Admin (validasi skrining, ubah jadwal, ubah role user) dicatat dengan timestamp + actor | P1 |
| NF-10 | **Kompatibilitas Browser** | Mendukung Chrome 110+, Firefox 110+, Safari 16+, Edge 110+ | P2 |

---

## 9. API Specification

**Base URL:** `https://api.kehati.polda-jabar.go.id/v1`  
**Format:** JSON  
**Auth:** Bearer Token (JWT) di header `Authorization`

### 9.1 Auth

#### POST `/auth/register`
Mendaftarkan akun personel baru.

**Request Body:**
```json
{
  "nama_lengkap": "Budi Santoso",
  "nrp": "82110001",
  "pangkat": "Brigadir",
  "satker": "Polrestabes Bandung",
  "unit": "Reskrim",
  "password": "Rahasia123!",
  "password_confirmation": "Rahasia123!"
}
```

**Response 201:**
```json
{
  "status": "success",
  "message": "Akun berhasil didaftarkan.",
  "data": {
    "id": "usr_01HXYZ",
    "nrp": "82110001",
    "nama_lengkap": "Budi Santoso",
    "role": "personel"
  }
}
```

**Response 422 (Validation Error):**
```json
{
  "status": "error",
  "message": "Validasi gagal.",
  "errors": {
    "nrp": ["NRP sudah terdaftar."],
    "password": ["Password minimal 8 karakter."]
  }
}
```

---

#### POST `/auth/login`
Login dengan NRP dan password.

**Request Body:**
```json
{
  "nrp": "82110001",
  "password": "Rahasia123!"
}
```

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "usr_01HXYZ",
      "nama_lengkap": "Budi Santoso",
      "nrp": "82110001",
      "pangkat": "Brigadir",
      "role": "personel"
    }
  }
}
```

> Refresh token dikirim via HttpOnly cookie (`kehati_refresh_token`, expires 7 hari).

---

#### POST `/auth/refresh`
Memperbarui access token menggunakan refresh token dari cookie.

**Response 200:**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGci...",
    "expires_in": 3600
  }
}
```

---

#### POST `/auth/logout`
Mengakhiri sesi dan menginvalidasi refresh token.

**Response 200:**
```json
{ "status": "success", "message": "Logout berhasil." }
```

---

### 9.2 Skrining

#### POST `/screening`
Mengirimkan hasil pengisian kuesioner skrining.

**Auth:** Bearer Token (role: personel)

**Request Body:**
```json
{
  "instrument_version": "DASS-21-v1",
  "jawaban": [
    { "nomor": 1, "skor": 2 },
    { "nomor": 2, "skor": 1 },
    ...
    { "nomor": 21, "skor": 3 }
  ]
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "id": "skr_01HABC",
    "user_id": "usr_01HXYZ",
    "skor_total": 22,
    "level_risiko": "sedang",
    "dapat_booking": true,
    "rekomendasi": "Disarankan untuk melakukan konseling reguler. Anda dapat memilih jadwal pada halaman booking.",
    "submitted_at": "2026-05-13T09:00:00Z",
    "validation_status": "pending"
  }
}
```

---

#### GET `/screening/me`
Mengambil riwayat skrining milik personel yang sedang login.

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "skr_01HABC",
      "skor_total": 22,
      "level_risiko": "sedang",
      "validation_status": "approved",
      "submitted_at": "2026-05-13T09:00:00Z"
    }
  ]
}
```

---

#### GET `/screening` _(Admin only)_
Mengambil semua hasil skrining. Mendukung filter query param: `?status=pending`, `?level_risiko=tinggi`, `?satker=Polrestabes Bandung`, `?date_from=2026-01-01&date_to=2026-05-13`.

---

#### PATCH `/screening/:id/validate` _(Admin only)_
Memvalidasi hasil skrining dan memberikan status tindak lanjut.

**Request Body:**
```json
{
  "validation_status": "approved",
  "catatan_admin": "Personel diizinkan melanjutkan ke booking jadwal rutin.",
  "override_booking": true
}
```

Nilai `validation_status`: `approved` | `referred` | `rejected`

---

### 9.3 Jadwal (Slots)

#### GET `/slots`
Mengambil daftar slot jadwal yang tersedia.

**Query Params:** `?date=2026-05-20`, `?method=daring`, `?psikolog_id=psi_01`

**Response 200:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "slot_01HDEF",
      "psikolog": {
        "id": "psi_01",
        "nama": "dr. Andini Putri, M.Psi"
      },
      "tanggal": "2026-05-20",
      "jam_mulai": "09:00",
      "jam_selesai": "10:00",
      "metode": "daring",
      "status": "available",
      "lokasi": "Google Meet (link diberikan setelah konfirmasi)"
    }
  ]
}
```

---

#### POST `/slots` _(Admin/Psikolog only)_
Membuat slot jadwal baru.

**Request Body:**
```json
{
  "psikolog_id": "psi_01",
  "tanggal": "2026-05-20",
  "jam_mulai": "09:00",
  "jam_selesai": "10:00",
  "metode": "daring",
  "kapasitas": 1,
  "lokasi": "Google Meet"
}
```

---

#### PATCH `/slots/:id` _(Admin/Psikolog only)_
Mengubah detail slot jadwal.

#### DELETE `/slots/:id` _(Admin only)_
Menghapus slot jadwal (hanya jika status masih `available`).

---

### 9.4 Booking

#### POST `/bookings`
Membuat booking jadwal konseling.

**Auth:** Bearer Token (role: personel dengan skrining valid + dapat_booking: true)

**Request Body:**
```json
{
  "slot_id": "slot_01HDEF",
  "screening_id": "skr_01HABC",
  "catatan_tambahan": "Saya ingin membahas masalah tekanan kerja shift malam."
}
```

**Response 201:**
```json
{
  "status": "success",
  "data": {
    "tiket_id": "TKT-2026-00123",
    "slot": {
      "tanggal": "2026-05-20",
      "jam_mulai": "09:00",
      "metode": "daring",
      "psikolog": "dr. Andini Putri, M.Psi"
    },
    "status": "confirmed",
    "created_at": "2026-05-13T09:15:00Z"
  }
}
```

**Response 409 (Double Booking):**
```json
{
  "status": "error",
  "message": "Slot ini sudah dipesan oleh pengguna lain. Silakan pilih slot lain."
}
```

---

#### GET `/bookings/me`
Mengambil riwayat booking milik personel yang sedang login.

---

#### DELETE `/bookings/:id`
Membatalkan booking (min. 24 jam sebelum jadwal).

**Response 200:**
```json
{
  "status": "success",
  "message": "Booking berhasil dibatalkan. Slot jadwal telah dikembalikan."
}
```

---

### 9.5 Berita (Articles)

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/articles` | Public | List artikel published |
| GET | `/articles/:id` | Public | Detail artikel |
| POST | `/articles` | Admin | Buat artikel baru |
| PATCH | `/articles/:id` | Admin | Edit artikel |
| DELETE | `/articles/:id` | Admin | Hapus artikel |

**Request Body POST `/articles`:**
```json
{
  "judul": "Mengelola Stres di Lingkungan Kerja Kepolisian",
  "konten": "<p>Isi artikel...</p>",
  "kategori": "tips-kesehatan-mental",
  "thumbnail_url": "https://cdn.kehati.id/img/artikel-stres.jpg",
  "status": "published"
}
```

---

### 9.6 User Management _(Admin only)_

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/users` | List semua user |
| GET | `/users/:id` | Detail user |
| PATCH | `/users/:id/role` | Ubah role user |
| DELETE | `/users/:id` | Nonaktifkan user |

---

### 9.7 Surat Rujukan _(Admin/Psikolog only)_

#### GET `/screening/:id/rujukan`
Menghasilkan surat rujukan dalam format PDF untuk kasus risiko tinggi.

**Response:** `application/pdf` — file diunduh langsung.

---

## 10. Data Models

### 10.1 User

```
users
├── id               VARCHAR(26) PRIMARY KEY   -- ULID
├── nrp              VARCHAR(20) UNIQUE NOT NULL
├── nama_lengkap     VARCHAR(100) NOT NULL
├── pangkat          VARCHAR(50) NOT NULL
├── satker           VARCHAR(100) NOT NULL
├── unit             VARCHAR(100)
├── email            VARCHAR(100) UNIQUE
├── password_hash    VARCHAR(255) NOT NULL
├── role             ENUM('personel','admin','psikolog') DEFAULT 'personel'
├── is_active        BOOLEAN DEFAULT TRUE
├── created_at       TIMESTAMP DEFAULT NOW()
└── updated_at       TIMESTAMP
```

### 10.2 Screening

```
screenings
├── id                  VARCHAR(26) PRIMARY KEY
├── user_id             VARCHAR(26) FK → users.id
├── instrument_version  VARCHAR(20) NOT NULL
├── jawaban             JSONB NOT NULL           -- [{nomor, skor}]
├── skor_total          INTEGER NOT NULL
├── level_risiko        ENUM('rendah','sedang','tinggi') NOT NULL
├── dapat_booking       BOOLEAN NOT NULL
├── validation_status   ENUM('pending','approved','referred','rejected') DEFAULT 'pending'
├── catatan_admin       TEXT
├── validated_by        VARCHAR(26) FK → users.id
├── validated_at        TIMESTAMP
├── submitted_at        TIMESTAMP DEFAULT NOW()
└── created_at          TIMESTAMP DEFAULT NOW()
```

### 10.3 Slot Jadwal

```
slots
├── id          VARCHAR(26) PRIMARY KEY
├── psikolog_id VARCHAR(26) FK → users.id
├── tanggal     DATE NOT NULL
├── jam_mulai   TIME NOT NULL
├── jam_selesai TIME NOT NULL
├── metode      ENUM('daring','luring') NOT NULL
├── kapasitas   INTEGER DEFAULT 1
├── lokasi      VARCHAR(200)
├── status      ENUM('available','booked','cancelled','completed') DEFAULT 'available'
├── created_by  VARCHAR(26) FK → users.id
├── created_at  TIMESTAMP DEFAULT NOW()
└── updated_at  TIMESTAMP
```

### 10.4 Booking

```
bookings
├── id                VARCHAR(26) PRIMARY KEY
├── tiket_id          VARCHAR(20) UNIQUE NOT NULL  -- TKT-YYYY-NNNNN
├── user_id           VARCHAR(26) FK → users.id
├── slot_id           VARCHAR(26) FK → slots.id
├── screening_id      VARCHAR(26) FK → screenings.id
├── catatan_tambahan  TEXT
├── status            ENUM('confirmed','cancelled','completed') DEFAULT 'confirmed'
├── cancelled_at      TIMESTAMP
├── cancel_reason     TEXT
├── created_at        TIMESTAMP DEFAULT NOW()
└── updated_at        TIMESTAMP
```

### 10.5 Article

```
articles
├── id            VARCHAR(26) PRIMARY KEY
├── judul         VARCHAR(255) NOT NULL
├── konten        TEXT NOT NULL                 -- HTML/Markdown
├── kategori      VARCHAR(50)
├── thumbnail_url VARCHAR(500)
├── status        ENUM('draft','published') DEFAULT 'draft'
├── author_id     VARCHAR(26) FK → users.id
├── published_at  TIMESTAMP
├── created_at    TIMESTAMP DEFAULT NOW()
└── updated_at    TIMESTAMP
```

### 10.6 Audit Log

```
audit_logs
├── id          VARCHAR(26) PRIMARY KEY
├── actor_id    VARCHAR(26) FK → users.id
├── action      VARCHAR(100) NOT NULL    -- e.g. 'screening.validate', 'slot.delete'
├── resource    VARCHAR(50)              -- e.g. 'screening', 'slot'
├── resource_id VARCHAR(26)
├── payload     JSONB                    -- data sebelum/sesudah perubahan
└── created_at  TIMESTAMP DEFAULT NOW()
```

---

## 11. UI/UX Flow

### 11.1 Alur Personel (Happy Path)

```
Halaman Login
    ↓ (login berhasil)
Dashboard Utama
    ├── [Lihat Berita] → Feed Artikel
    ├── [Riwayat & Tiket] → Daftar Booking + Status
    └── [Mulai Konseling]
            ↓
        Skrining Mental (DASS-21, step 1–21)
            ↓ (submit)
        Hasil Triase
            ├── [Risiko TINGGI] → Halaman Rekomendasi Khusus → Surat Rujukan
            └── [Risiko RENDAH/SEDANG] → Halaman Booking Jadwal
                    ↓ (pilih slot)
                Konfirmasi Booking
                    ↓
                Tiket Digital
```

### 11.2 Alur Admin

```
Login Admin
    ↓
Dashboard Admin
    ├── Daftar Skrining Pending → Validasi → Set Status (Approved/Referred)
    ├── Kelola Jadwal → Tambah/Edit/Hapus Slot
    ├── Kelola Berita → CRUD Artikel
    └── Kelola User → Lihat/Edit Role
```

### 11.3 Halaman Utama Aplikasi

| No | Nama Halaman | Route | Aktor |
|----|-------------|-------|-------|
| 1 | Login | `/login` | Semua |
| 2 | Register | `/register` | Calon Personel |
| 3 | Dashboard | `/dashboard` | Semua |
| 4 | Feed Berita | `/berita` | Semua |
| 5 | Detail Artikel | `/berita/:id` | Semua |
| 6 | Skrining Mental | `/skrining` | Personel |
| 7 | Hasil Skrining | `/skrining/hasil` | Personel |
| 8 | Booking Jadwal | `/booking` | Personel |
| 9 | Konfirmasi Booking | `/booking/konfirmasi` | Personel |
| 10 | Tiket Digital | `/tiket/:id` | Personel |
| 11 | Riwayat | `/riwayat` | Personel |
| 12 | Admin: Dashboard | `/admin/dashboard` | Admin |
| 13 | Admin: Skrining | `/admin/skrining` | Admin |
| 14 | Admin: Jadwal | `/admin/jadwal` | Admin |
| 15 | Admin: Berita | `/admin/berita` | Admin |
| 16 | Admin: User | `/admin/user` | Admin |
| 17 | Profil | `/profil` | Semua |

---

## 12. Acceptance Criteria

### AC-01: Registrasi

- [ ] User dapat mendaftarkan akun dengan data lengkap (Nama, NRP, Pangkat, Satker, Password)
- [ ] Sistem menolak registrasi jika NRP sudah terdaftar dengan pesan error yang jelas
- [ ] Password disimpan dalam bentuk hash (bukan plaintext)
- [ ] Role default setelah registrasi adalah "personel"

### AC-02: Login & Sesi

- [ ] User berhasil login dengan NRP + Password yang benar
- [ ] JWT access token diterima dan disimpan
- [ ] Login dengan kredensial salah menampilkan error tanpa menyebutkan field mana yang salah
- [ ] Setelah 5x login gagal dalam 15 menit, akun dikunci sementara
- [ ] Setelah logout, token lama tidak dapat digunakan kembali

### AC-03: Skrining

- [ ] Kuesioner DASS-21 ditampilkan lengkap (21 pertanyaan, skala 0–3)
- [ ] Progress tidak hilang jika pengguna tidak sengaja refresh di tengah pengisian
- [ ] Setelah submit, skor dihitung otomatis dan level risiko ditampilkan segera
- [ ] Data skrining yang sudah disubmit tidak dapat diedit oleh personel
- [ ] Personel dengan risiko Tinggi tidak dapat mengakses halaman Booking

### AC-04: Booking

- [ ] Hanya slot dengan status "available" yang ditampilkan
- [ ] Dua personel tidak dapat memesan slot yang sama secara bersamaan (atomic)
- [ ] Tiket digital diterbitkan segera setelah booking berhasil
- [ ] Personel dapat membatalkan booking lebih dari 24 jam sebelum jadwal
- [ ] Pembatalan kurang dari 24 jam ditolak dengan pesan error

### AC-05: Admin Dashboard

- [ ] Admin dapat melihat daftar skrining yang berstatus "pending"
- [ ] Admin dapat memvalidasi skrining dan mengubah statusnya
- [ ] Admin dapat menambah, mengedit, dan menghapus slot jadwal
- [ ] Admin dapat membuat, mempublikasikan, dan menghapus artikel berita
- [ ] Semua aksi Admin tercatat di audit log

### AC-06: Keamanan & Privasi

- [ ] Endpoint API mengembalikan 401 untuk request tanpa token valid
- [ ] Personel A tidak dapat mengakses data skrining Personel B
- [ ] Seluruh komunikasi menggunakan HTTPS
- [ ] Refresh token tersimpan di HttpOnly cookie (tidak accessible via JS)

---

## 13. Tech Stack Rekomendasi

### Frontend (Sudah Dibangun)
| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Animation | Framer Motion |
| Deployment | Vercel |

### Backend (Perlu Dibangun)

| Layer | Rekomendasi | Alternatif |
|-------|-------------|------------|
| Runtime | Node.js 20 LTS | Bun |
| Framework | Express.js / Hono | Fastify, NestJS |
| ORM | Prisma | Drizzle ORM |
| Database | PostgreSQL 15+ | MySQL 8 |
| Auth | JWT + bcrypt | Lucia Auth |
| File Storage | Vercel Blob / Supabase Storage | AWS S3 |
| PDF Generation | puppeteer / @react-pdf/renderer | PDFKit |
| Deployment | Railway / Render | Fly.io, VPS |

### Infrastruktur

| Komponen | Rekomendasi |
|----------|-------------|
| Reverse Proxy | Nginx |
| SSL | Let's Encrypt (Certbot) |
| Environment | .env dengan secret manager |
| API Docs | Swagger / OpenAPI 3.0 |

---

## 14. Glossary

| Istilah | Definisi |
|---------|----------|
| **Burnout** | Kelelahan emosional dan fisik akibat beban kerja berlebih |
| **DASS-21** | Depression Anxiety Stress Scales — instrumen asesmen mandiri 21 pertanyaan |
| **E-Counseling** | Layanan konseling yang dilakukan secara virtual melalui internet |
| **Front-end** | Bagian antarmuka aplikasi yang berinteraksi langsung dengan pengguna |
| **KEHATI** | Kesehatan Hati — nama aplikasi konseling online SDM Polda Jabar |
| **NRP** | Nomor Registrasi Pokok — ID unik anggota Polri |
| **RBAC** | Role-Based Access Control — sistem pembatasan akses berdasarkan peran |
| **Satker** | Satuan Kerja — unit organisasi dalam Polri |
| **Skrining** | Proses asesmen awal mandiri untuk mengukur kondisi psikologis |
| **SUS** | System Usability Scale — metode pengukuran kemudahan penggunaan sistem |
| **Telepsychology** | Pemberian layanan psikologis menggunakan teknologi komunikasi jarak jauh |
| **Triase** | Klasifikasi tingkat keparahan/risiko untuk menentukan prioritas penanganan |
| **Trust Issue** | Isu kepercayaan — kekhawatiran personel terhadap kerahasiaan data mereka |
| **ULID** | Universally Unique Lexicographically Sortable Identifier — format ID unik |

---

*Dokumen ini diperbarui terakhir: 13 Mei 2026*  
*Versi berikutnya (PRD v1.1) akan mencakup spesifikasi integrasi notifikasi dan modul laporan analitik.*
