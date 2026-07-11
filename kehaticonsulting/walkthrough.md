# 📑 Panduan Lengkap & Walkthrough Fitur KEHATI

Dokumen ini berisi rangkuman seluruh fitur baru dan perbaikan interaktivitas yang telah kita tambahkan ke dalam sistem **KEHATI (Kesehatan Hati - Polda Jabar)**, lengkap dengan panduan demonstrasi alur kerja multi-peran.

---

## 🛠️ Ringkasan Fitur yang Ditambahkan

Berikut adalah daftar 13 fitur utama dan optimasi yang telah diimplementasikan:

### 1. Triage Pengajuan Jadwal Otomatis
- **Fungsi**: Secara cerdas mengarahkan pengajuan jadwal konseling personel berdasarkan hasil skrining DASS-21 terbaru.
- **Aturan**:
  - **Risiko Rendah / Sedang**: Status diatur ke `Review Psikolog` (`pending_psikolog`). Harus ditinjau & disetujui Psikolog terlebih dahulu sebelum masuk ke Admin.
  - **Risiko Tinggi (Parah)**: Status diatur ke `Verifikasi Admin` (`pending_admin`) secara otomatis. Melewati psikolog agar Admin segera memberikan surat rujukan dan tindakan klinis cepat.

### 2. Dashboard Mandiri Psikolog (`/psikolog/dashboard`)
- **Fungsi**: Area kerja psikolog dengan desain brutalisme minimalis yang bersih dan rapi (mirip layout admin).
- **Pembatasan Akses**: Psikolog hanya memiliki akses ke menu *Review Pengajuan* dan *Jadwal Saya*. Menu *Kelola Berita* dan *Kelola User* disembunyikan dan dikunci sepenuhnya.
- **Realtime**: Halaman melakukan polling data ke penyimpanan lokal setiap 3 detik.

### 3. Dashboard Admin (`/admin/dashboard`)
- **Fungsi**: Area kerja Admin Polda untuk verifikasi akhir jadwal konseling, kelola berita, dan kelola user.
- **Realtime**: Polling data setiap 3 detik untuk memantau pengajuan masuk secara instan.

### 4. Form Detail Konseling untuk Psikolog & Admin
- **Fungsi**: Saat meninjau pengajuan jadwal, baik Psikolog maupun Admin dapat mengedit detail pelaksanaan sesi konseling (Jam Mulai, Jam Selesai, serta Link Zoom/Google Meet untuk daring, atau Nama Ruang Rapat untuk luring).
- **Integrasi**: Detail ini disimpan langsung ke dalam slot pemesanan dan otomatis dilampirkan ke pesan Mailbox personel ketika sesi disetujui.

### 5. Skenario Penolakan Jadwal (`rejected`)
- **Fungsi**: Menolak pengajuan jadwal konseling dengan rapi.
- **Integrasi**: Jika jadwal ditolak, sistem otomatis mengirim pesan Mailbox dengan tipe `info` bertajuk `Jadwal Konseling Ditolak (TKT-XXXX)`. Detail box tiket kosong disembunyikan untuk menjaga tampilan kotak masuk tetap bersih.

### 6. CRUD Portal Berita & Informasi SDM
- **Fungsi**: Admin memiliki kontrol penuh atas berita edukasi kesehatan mental.
- **Kemampuan**:
  - **Create**: Membuat berita baru lengkap dengan judul, kategori, konten, status (Draft/Published), dan URL thumbnail.
  - **Read & Update**: Mengubah isi konten/judul atau toggle status berita langsung dari baris tabel.
  - **Delete**: Menghapus berita secara permanen.
- **Integrasi**: Perubahan berita disimpan ke `LocalStorage` dan langsung ter-publish ke portal berita personel secara dinamis.

### 7. Integrasi Toast Sonner
- **Fungsi**: Menggantikan dialog native browser (`alert()`) yang kaku dengan animasi toast notifikasi dari library `sonner` di pojok kanan atas layar.

### 8. Ikon Mailbox Mandiri di Navbar
- **Fungsi**: Menambahkan ikon amplop surat (`mail`) terpisah di Navbar utama untuk mempermudah personel langsung melompat ke kotak masuk mereka tanpa melewati menu dropdown lonceng.
- **Badge**: Menampilkan angka jumlah pesan yang belum dibaca secara realtime.

### 9. Sinkronisasi Dropdown Notifikasi Lonceng
- **Fungsi**: Menampilkan daftar 5 pesan Mailbox terbaru secara dinamis.
- **Redireksi Pintar**: Mengklik salah satu notifikasi di lonceng akan mengarahkan personel ke `/mailbox?id=msg_id`, menandai pesan tersebut sebagai dibaca (`is_read: true`), dan memperbarui badge unread di Navbar seketika.

### 10. Tanggal Slot Dinamis (Hari Kerja Aktual)
- **Fungsi**: Menggantikan tanggal statis dummy (tahun 2026) dengan generator tanggal hari kerja aktual (Senin s.d Jumat) terhitung sejak hari ini berdasarkan waktu sistem lokal.

### 11. GMeet/Zoom Link Clickable di Tab Baru
- **Fungsi**: Memastikan semua link meeting daring yang dikirimkan oleh konselor ke Mailbox personel diformat dengan protokol `https://` yang aman dan dapat diklik untuk langsung membuka tab baru.

### 12. Hapus Riwayat Skrining Personel
- **Fungsi**: Memberikan tombol **Hapus** (ikon tempat sampah) pada halaman *Riwayat & Tiket* di tab *Skrining*.
- **Aturan**: Hanya riwayat skrining yang telah divalidasi/diproses (`validation_status !== 'pending'`) yang dapat dihapus agar tidak merusak antrean aktif.

### 13. Kompatibilitas Next.js 16 (Sync Dynamic APIs)
- **Fungsi**: Memperbaiki peringatan asinkron parameter dynamic routing dengan menggunakan React Hook `use(params)` pada halaman tiket detail.

---

## 🚀 Panduan Skenario Demonstrasi

Gunakan akun-akun di bawah ini untuk mensimulasikan alur kerja:
- **Personel**: NRP `82110001` (Password bebas)
- **Psikolog**: NRP `70000002` (Password bebas)
- **Admin**: NRP `70000001` (Password bebas)

### Skenario A: Risiko Rendah/Sedang (Alur Berjenjang)
1. **[Personel]** Login → Masuk menu **Skrining** → Pilih opsi jawaban sedang/ringan → Setelah selesai, pilih **Booking Konseling** → Pilih tanggal & psikolog → Tulis catatan → Konfirmasi.
2. **[Psikolog]** Login → Masuk ke **Dashboard Psikolog** → Buka menu **Review Pengajuan** → Klik **Tinjau** → Masukkan jam & link GMeet → Klik **Setuju & Teruskan**.
3. **[Admin]** Login → Masuk ke **Dashboard Admin** → Buka menu **Review** → Klik **Tinjau** → Klik **Konfirmasi Jadwal**.
4. **[Personel]** Login kembali → Cek lonceng notifikasi & **Mailbox** → Detail link GMeet dapat langsung diklik dan membuka tab baru.

### Skenario B: Risiko Tinggi / Parah (Bypass ke Admin & Surat Rujukan)
1. **[Personel]** Lakukan **Skrining** → Pilih opsi jawaban parah (risiko tinggi) → Lakukan **Booking Jadwal**.
2. **[Admin]** Login → Masuk ke **Dashboard Admin** → Pengajuan tadi langsung masuk ke antrean Admin (`pending_admin`) bypass Psikolog → Klik **Tinjau** → Masukkan detail rujukan → Klik **Konfirmasi Jadwal** (Kirim pesan template "Rujukan Khusus").
3. **[Personel]** Login kembali → Cek **Mailbox** → Surat rujukan khusus beserta link download PDF rujukan siap digunakan.

### Skenario C: Jadwal Ditolak & Pengajuan Ulang
1. **[Personel]** Buat pengajuan booking jadwal.
2. **[Psikolog / Admin]** Login → Masuk menu **Review** → Pilih template pesan "Ditolak" → Klik **Tolak / Beri Saran Ulang** (atau **Tolak Jadwal** di Admin).
3. **[Personel]** Login kembali → Lonceng notifikasi berbunyi → Masuk Mailbox → Detail box tiket kosong disembunyikan, menyisakan teks penjelasan penolakan jadwal. Personel dapat mengajukan jadwal ulang dengan masuk kembali ke menu Booking.

### Skenario D: Manajemen Berita Realtime
1. **[Admin]** Login → Masuk ke menu **Kelola Berita** → Klik **Artikel Baru** → Isi konten dan status *Published* → Klik **Simpan**.
2. **[Personel]** Login → Klik menu **Berita SDM** → Berita baru yang dibuat oleh admin langsung ter-publish dan dapat dibaca.
