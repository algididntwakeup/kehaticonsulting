# KEHATI — Kesehatan Hati | Polda Jawa Barat

Platform Konseling & Skrining Kesehatan Mental Online untuk Personel Polda Jawa Barat.

---

> [!NOTE]
> **Arsitektur Simulasi (Frontend-Only)**:  
> Aplikasi ini dikembangkan sebagai demonstrasi interaktif frontend menggunakan **Next.js (App Router)** dan **TypeScript**. Seluruh penyimpanan data bersifat sementara dan disimpan secara lokal di dalam web browser Anda menggunakan **LocalStorage** (melalui layer `dataStore.ts`). 
> 
> Aksi yang Anda lakukan (mengisi skrining, memesan jadwal, menyetujui tiket, mengirim pesan mailbox, atau mengelola berita) akan tersimpan secara instan dan dapat disimulasikan antar-peran (Personel ↔ Psikolog ↔ Admin) pada browser yang sama tanpa membutuhkan database eksternal.

---

## 🌟 Fitur Utama

1. **Skrining Kesehatan Mental (DASS-21)**:
   - Tes penilaian mandiri yang menghitung tingkat kecemasan, depresi, dan stres secara instan.
   - Hasil skrining dikategorikan menjadi **Rendah (Hijau)**, **Sedang (Kuning)**, dan **Tinggi (Merah)**.

2. **Booking Jadwal Konseling & Triage Otomatis**:
   - Personel dapat memilih metode konseling (daring/luring), psikolog, tanggal kerja aktual (Senin-Jumat), jam slot, serta menyertakan catatan keluhan.
   - **Triage Berdasarkan Risiko**:
     - *Risiko Rendah / Sedang* masuk ke antrean Psikolog (`pending_psikolog`).
     - *Risiko Tinggi / Parah* langsung bypass masuk ke antrean Admin (`pending_admin`) demi penanganan darurat/rujukan cepat.

3. **Dashboard Psikolog**:
   - Menampilkan statistik penugasan, distribusi tingkat risiko skrining, dan daftar pengajuan jadwal konseling yang memerlukan review.
   - Psikolog dapat mengisi jam pelaksanaan aktual, memberikan link meeting (Google Meet/Zoom) / lokasi luring, memberikan catatan internal, serta menyetujui tiket untuk diteruskan ke Admin.

4. **Dashboard Admin**:
   - Menampilkan status antrean konseling, statistik total pengguna, dan diagram risiko.
   - Admin bertindak sebagai validator akhir untuk mengubah status jadwal menjadi `Confirmed`.

5. **Sistem Pesan (Mailbox) & Notifikasi Lonceng**:
   - Psikolog dan Admin dapat mengirim pesan langsung ke kotak masuk (Mailbox) personel.
   - Dilengkapi template pesan otomatis (Jadwal Ditolak, Jadwal Dikonfirmasi, dan Rujukan Khusus).
   - Notifikasi lonceng di Navbar personel menyala secara realtime. Ketika diklik, notifikasi langsung membuka detail pesan di mailbox, menandainya sebagai dibaca, dan membuka link meeting GMeet secara aman di tab baru.

6. **Portal Berita & CRUD Artikel**:
   - Halaman edukasi kesehatan mental untuk personel.
   - Dashboard Admin memiliki kontrol penuh (CRUD) untuk menambah, mengedit status/kategori, mengubah thumbnail, mengedit konten, serta menghapus artikel. Artikel yang disimpan akan langsung ter-publish ke portal berita personel.

---

## 👥 Panduan Penggunaan & Akun Simulasi

Untuk mensimulasikan alur kerja interaktif, gunakan akun-akun di bawah ini:

| Peran | NRP | Password | Akses Menu |
| :--- | :--- | :--- | :--- |
| **Personel** | `82110001` | *password sembarang* | Skrining DASS-21, Booking Jadwal, Riwayat Tiket, Portal Berita, Mailbox |
| **Psikolog** | `70000002` | *password sembarang* | Dashboard Psikolog, Review Skrining (`pending_psikolog`), Jadwal Saya |
| **Admin** | `70000001` | *password sembarang* | Dashboard Admin, Konfirmasi Akhir (`pending_admin`), Kelola Berita (CRUD), Kelola User |

---

## 🚀 Alur Simulasi Interaktif (Demo Skenario)

### Skenario 1: Kasus Ringan/Sedang (Alur Berjenjang)
1. Login sebagai **Personel** (`82110001`) → Ikuti **Skrining** → Pilih jawaban sedang/ringan → Masuk ke **Booking Jadwal** → Pilih slot tanggal kerja → Isi catatan tambahan → Konfirmasi.
2. Logout dan Login sebagai **Psikolog** (`70000002`) → Masuk ke **Dashboard Psikolog** → Buka menu **Review Jadwal** → Klik **Tinjau** pada tiket personel tadi → Isi Jam Mulai/Selesai & Link Google Meet → Klik **Setuju & Teruskan ke Admin**.
3. Logout dan Login sebagai **Admin** (`70000001`) → Buka **Dashboard Admin** → Masuk ke menu **Review** → Klik **Tinjau** pada tiket yang sudah diteruskan → Klik **Konfirmasi Jadwal** (Anda juga bisa mengirim pesan mailbox dari form ini).
4. Login kembali sebagai **Personel** → Cek lonceng notifikasi & **Mailbox** → Detail link Google Meet dan jadwal konseling terlihat jelas di Mailbox, link tersebut clickable dan siap digunakan.

### Skenario 2: Kasus Parah (Bypass Review)
1. Login sebagai **Personel** → Ikuti **Skrining** → Pilih opsi jawaban parah (tinggi) → Lakukan **Booking Jadwal**.
2. Logout dan Login sebagai **Admin** → Buka **Dashboard Admin** → Tiket dari personel tersebut akan langsung masuk ke antrean Admin (`pending_admin`) bypass Psikolog.
3. Klik **Tinjau** → Kirim pesan dengan template **Rujukan Khusus** → Klik **Konfirmasi Jadwal**.
4. Login kembali sebagai **Personel** → Notifikasi rujukan akan masuk ke lonceng dan mailbox Anda beserta rujukan klinis.

---

## 🛠️ Cara Menjalankan Project

1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Akses aplikasi melalui browser pada alamat [http://localhost:3000](http://localhost:3000).
