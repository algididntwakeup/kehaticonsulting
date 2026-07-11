# Perbaikan Interaktivitas Alur Personel ↔ Psikolog ↔ Admin

## Ringkasan Perubahan

Ada **6 komponen utama** yang perlu dibenahi agar alur demo berjalan end-to-end secara jelas.

---

## 1. Fix MailboxMessage Type Mismatch (Root Cause Bug)

> [!IMPORTANT]
> Ini penyebab utama banyak bug. Tipe `MailboxMessage` di `types.ts` menggunakan `type`/`title`/`content`, sementara `dataStore.ts` dan semua halaman baru menggunakan `tipe`/`judul`/`konten`. Perlu distandarkan ke satu konvensi.

#### [MODIFY] [types.ts](file:///c:/TA/kehaticonsulting/src/lib/types.ts)
- Ubah field `type` → `tipe`, `title` → `judul`, `content` → `konten` di interface `MailboxMessage`
- Tambah field `user_id` untuk tracking penerima pesan

#### [MODIFY] [mockData.ts](file:///c:/TA/kehaticonsulting/src/lib/mockData.ts)
- Update `mockMailbox` agar menggunakan field name baru (`tipe`, `judul`, `konten`)

---

## 2. Psikolog Dashboard — Layout Rapi + Realtime Data

#### [MODIFY] [psikolog/dashboard/page.tsx](file:///c:/TA/kehaticonsulting/src/app/psikolog/dashboard/page.tsx)
- **Full rewrite** halaman dashboard psikolog
- Layout sama persis seperti `admin/dashboard` (stats grid, distribusi risiko, list pending)
- Stat cards khusus psikolog: Skrining Masuk, Antrian Review, Risiko Tinggi, Sesi Bulan Ini
- List booking hanya menampilkan yang berstatus `pending_psikolog`
- Quick actions: **Review Pengajuan** + **Jadwal Saya** (tanpa Kelola Berita/User)
- **Polling data** setiap 3 detik via `setInterval` + `getLocalBookings()` agar perubahan dari personel langsung muncul tanpa refresh manual

---

## 3. Tanggal Dinamis pada Booking Slots

#### [MODIFY] [mockData.ts](file:///c:/TA/kehaticonsulting/src/lib/mockData.ts)
- Ganti tanggal hardcoded (`2026-07-01`, dst.) dengan **fungsi yang menghitung Senin-Jumat minggu ini** berdasarkan `new Date()`
- Helper function `getNextWeekdays(count)` yang generate tanggal hari kerja dari hari ini

---

## 4. Navbar — Fix Notifikasi + Tambah Ikon Mailbox Terpisah

#### [MODIFY] [Navbar.tsx](file:///c:/TA/kehaticonsulting/src/components/layout/Navbar.tsx)
- **Notifikasi dropdown**: gunakan field `judul`/`konten`/`tipe` (sudah sebagian, perlu konsisten)
- **Tambah ikon mailbox baru** `mail` di samping bell icon → redirect langsung ke `/mailbox`
- Polling mailbox setiap 5 detik via `setInterval` agar notifikasi personel muncul secara "realtime"

---

## 5. Admin Berita CRUD → Sinkron ke Halaman Publik

#### [MODIFY] [dataStore.ts](file:///c:/TA/kehaticonsulting/src/lib/dataStore.ts)
- Tambah `getLocalArticles()` dan `saveArticle()` dan `deleteArticle()` functions

#### [MODIFY] [admin/berita/page.tsx](file:///c:/TA/kehaticonsulting/src/app/admin/berita/page.tsx)
- Gunakan `getLocalArticles()` / `saveArticle()` / `deleteArticle()` dari dataStore
- Tambah fungsi **Edit** yang sekarang masih dummy button
- Gunakan `toast` dari sonner untuk feedback CRUD
- Artikel yang di-add/edit/delete harus **persist ke localStorage**

#### [MODIFY] Halaman berita publik (personel)
- Update untuk membaca dari `getLocalArticles()` sehingga perubahan dari admin langsung terlihat

---

## 6. Admin Dashboard — Stat yang Akurat + Realtime

#### [MODIFY] [admin/dashboard/page.tsx](file:///c:/TA/kehaticonsulting/src/app/admin/dashboard/page.tsx)  
- Polling data via `setInterval` 3 detik
- Stat "Antrian Booking" dihitung dari `pending_psikolog` + `pending_admin`
- Link "Review Pengajuan" badge harus menampilkan jumlah booking pending yang benar

---

## Verification Plan

### Manual Verification
1. **Personel** login → Skrining → Booking → Data muncul di dashboard Psikolog secara realtime
2. **Psikolog** login → Dashboard menampilkan data terbaru → Review pengajuan → Isi link Meet/lokasi → Setuju → Pesan terkirim ke Mailbox personel
3. **Admin** login → Dashboard akurat → Konfirmasi jadwal → Kelola Berita (tambah/edit/delete) → Perubahan muncul di halaman berita publik
4. **Personel** login → Lonceng notifikasi menampilkan pesan → Ikon mailbox redirect ke kotak masuk → Isi pesan lengkap
5. Tanggal booking menggunakan tanggal hari kerja aktual (Senin-Jumat minggu ini)
