'use client';

import { useState, useEffect } from 'react';
import { getBookingStatusColor, getRisikoColor, formatDateShort, mockPsikolog } from '@/lib/mockData';
import { getLocalScreenings, getLocalBookings, saveBooking, saveMailboxMessage, generateId, deleteBooking, deleteScreening } from '@/lib/dataStore';
import { Screening, Booking, MailboxMessage } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function AdminSkriningPage() {
  const { user } = useAuth();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>('semua');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [catatan, setCatatan] = useState('');
  const [pesan, setPesan] = useState('');
  
  // Selection and Bulk Actions State
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  // Complete Session Modal States
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [feedbackCatatan, setFeedbackCatatan] = useState('');
  
  // Referral PDF Upload States
  const [rujukanFileUrl, setRujukanFileUrl] = useState<string | null>(null);
  const [rujukanFileName, setRujukanFileName] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('File harus berupa PDF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }
    
    setRujukanFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = () => {
      setRujukanFileUrl(reader.result as string);
      toast.success(`File ${file.name} berhasil diunggah`);
    };
    reader.onerror = () => {
      toast.error('Gagal membaca file');
    };
    reader.readAsDataURL(file);
  };

  const handleClearFile = () => {
    setRujukanFileUrl(null);
    setRujukanFileName(null);
  };

  // States for overriding slot details
  const [lokasiOverride, setLokasiOverride] = useState('');
  const [waktuMulaiOverride, setWaktuMulaiOverride] = useState('');
  const [waktuSelesaiOverride, setWaktuSelesaiOverride] = useState('');

  useEffect(() => {
    const refresh = () => {
      setScreenings(getLocalScreenings());
      setBookings(getLocalBookings());
    };
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'semua'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getScreeningForBooking = (b: Booking) => screenings.find(s => s.id === b.screening_id);

  const handleValidate = (newStatus: string) => {
    if (!selected) return;
    
    // Override slot details jika ada perubahan
    const updatedSlot = {
      ...selected.slot,
      lokasi: lokasiOverride || selected.slot.lokasi,
      jam_mulai: waktuMulaiOverride || selected.slot.jam_mulai,
      jam_selesai: waktuSelesaiOverride || selected.slot.jam_selesai,
    };
    
    // Simulasikan update status (di aplikasi nyata, ini ke database)
    const updatedBooking = { ...selected, status: newStatus as any, slot: updatedSlot };
    saveBooking(updatedBooking); // Note: dataStore needs to handle update, wait we'll just mock it in UI state for now
    
    // Save pesan jika ada
    if (pesan) {
      const isRujukan = pesan.toLowerCase().includes('rujukan') || rujukanFileUrl !== null;
      const isDitolak = newStatus === 'rejected';
      const mailboxMsg: MailboxMessage = {
        id: generateId('msg'),
        user_id: selected.user_id,
        tipe: isDitolak ? 'info' : (isRujukan ? 'rujukan' : 'tiket'),
        judul: isDitolak 
          ? `Jadwal Konseling Ditolak (${selected.tiket_id})` 
          : (isRujukan ? `Surat Rujukan - Tiket ${selected.tiket_id}` : `Konfirmasi Jadwal Konseling (${selected.tiket_id})`),
        konten: pesan,
        is_read: false,
        created_at: new Date().toISOString(),
        action_url: isDitolak ? undefined : (isRujukan ? undefined : `/tiket/${selected.id}`),
        file_url: isRujukan && rujukanFileUrl ? rujukanFileUrl : undefined,
        // Only include ticket metadata if not rejected
        ...(isDitolak ? {} : {
          tiket_id: selected.tiket_id,
          psikolog_nama: selected.slot.psikolog.nama,
          tanggal: selected.slot.tanggal,
          waktu: `${updatedSlot.jam_mulai} – ${updatedSlot.jam_selesai} WIB`,
          metode: selected.slot.metode,
          lokasi_link: updatedSlot.lokasi,
          booking_id: selected.id
        })
      };
      saveMailboxMessage(mailboxMsg);
    }
    
    // Update local state
    setBookings(prev => prev.map(b => b.id === selected.id ? updatedBooking : b));
    
    toast.success(`Status tiket ${selected.tiket_id} diperbarui`, {
      description: `Status diubah menjadi: ${newStatus.replace('_', ' ').toUpperCase()}${pesan ? ' & Pesan terkirim ke personel' : ''}`
    });
    setSelected(null);
    setCatatan('');
    setPesan('');
    setRujukanFileUrl(null);
    setRujukanFileName(null);
  };

  const isDeletable = (status: string) => ['completed', 'rejected', 'cancelled'].includes(status);

  const toggleSelectBooking = (id: string) => {
    setSelectedBookingIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (deletableBookings: Booking[]) => {
    const deletableIds = deletableBookings.map(b => b.id);
    const allSelected = deletableIds.every(id => selectedBookingIds.includes(id));
    if (allSelected) {
      setSelectedBookingIds(prev => prev.filter(id => !deletableIds.includes(id)));
    } else {
      setSelectedBookingIds(prev => {
        const union = new Set([...prev, ...deletableIds]);
        return Array.from(union);
      });
    }
  };

  const handleBulkDelete = () => {
    if (selectedBookingIds.length === 0) return;
    selectedBookingIds.forEach(id => {
      const b = bookings.find(item => item.id === id);
      if (b) {
        deleteBooking(b.id);
        deleteScreening(b.screening_id);
      }
    });
    toast.success(`${selectedBookingIds.length} riwayat jadwal dan hasil skrining berhasil dihapus`);
    setSelectedBookingIds([]);
    setShowDeleteConfirmModal(false);
    setScreenings(getLocalScreenings());
    setBookings(getLocalBookings());
  };

  const handleCompleteSessionSubmit = () => {
    if (!selected) return;
    if (!feedbackCatatan.trim()) {
      toast.error('Catatan hasil konseling wajib diisi');
      return;
    }

    const updatedBooking = { ...selected, status: 'completed' as const, catatan_admin: feedbackCatatan };
    saveBooking(updatedBooking);

    const mailboxMsg: MailboxMessage = {
      id: generateId('msg'),
      user_id: selected.user_id,
      tipe: 'info',
      judul: `Hasil Sesi Konseling & Catatan Konselor (${selected.tiket_id})`,
      konten: `Halo ${selected.user?.nama_lengkap || 'Personel'}, sesi konseling Anda untuk tiket ${selected.tiket_id} telah dinyatakan SELESAI (COMPLETED). Berikut adalah catatan/saran dari konselor Anda:\n\n"${feedbackCatatan}"\n\nTerima kasih telah mempercayakan layanan kesehatan mental Anda kepada KEHATI Polda Jabar.`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    saveMailboxMessage(mailboxMsg);

    toast.success(`Sesi konseling ${selected.tiket_id} berhasil diselesaikan`);
    setShowCompleteModal(false);
    setFeedbackCatatan('');
    setSelected(null);
    setBookings(getLocalBookings());
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111318]">Review Jadwal & Skrining</h1>
        <p className="text-[#616f89] text-sm mt-1">Tinjau pengajuan jadwal konseling dan hasil skrining personel.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['semua', 'pending_psikolog', 'pending_admin', 'confirmed', 'rejected', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === f
                ? 'bg-[#135bec] text-white'
                : 'bg-white border border-[#dbdfe6] text-[#616f89] hover:border-[#135bec]/40 hover:text-[#135bec]'
            }`}>
            {f === 'semua' ? 'Semua' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          {selectedBookingIds.length > 0 && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-fade-in">
              <span className="text-xs font-bold text-red-700">
                Terpilih: {selectedBookingIds.length} jadwal/skrining selesai/dibatalkan/ditolak
              </span>
              <button onClick={() => setShowDeleteConfirmModal(true)}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm">
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Hapus Terpilih
              </button>
            </div>
          )}
          <div className="bg-white rounded-xl border border-[#dbdfe6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#dbdfe6] bg-[#f6f6f8]">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={
                          filtered.filter(b => isDeletable(b.status)).length > 0 &&
                          filtered.filter(b => isDeletable(b.status)).every(b => selectedBookingIds.includes(b.id))
                        }
                        onChange={() => toggleSelectAll(filtered.filter(b => isDeletable(b.status)))}
                        className="rounded accent-[#135bec] h-4 w-4 cursor-pointer align-middle"
                        title="Pilih Semua yang Dapat Dihapus"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Tiket / Personel</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Jadwal Diajukan</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Psikolog</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Risiko Skrining</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(bkg => {
                    const sk = getScreeningForBooking(bkg);
                    return (
                    <tr key={bkg.id} className={`border-b border-[#f6f6f8] hover:bg-[#f6f6f8] transition-colors ${selected?.id === bkg.id ? 'bg-[#ebf1fd]' : ''}`}>
                      <td className="px-4 py-3 text-left w-10">
                        {isDeletable(bkg.status) ? (
                          <input
                            type="checkbox"
                            checked={selectedBookingIds.includes(bkg.id)}
                            onChange={() => toggleSelectBooking(bkg.id)}
                            className="rounded accent-[#135bec] h-4 w-4 cursor-pointer align-middle"
                          />
                        ) : (
                          <span className="inline-block w-4 h-4" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-bold text-[#111318] text-sm">{bkg.tiket_id}</p>
                          <p className="text-xs text-[#616f89]">{bkg.user?.nama_lengkap ?? 'Personel'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#111318] text-sm">{formatDateShort(bkg.slot.tanggal)}</p>
                        <p className="text-xs text-[#616f89]">{bkg.slot.jam_mulai} - {bkg.slot.jam_selesai}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#111318] text-sm">{bkg.slot.psikolog.nama}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bkg.slot.metode === 'daring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {bkg.slot.metode.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {sk ? (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRisikoColor(sk.level_risiko)}`}>
                            {sk.level_risiko.charAt(0).toUpperCase() + sk.level_risiko.slice(1)} ({sk.skor_total})
                          </span>
                        ) : <span className="text-xs text-gray-500">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getBookingStatusColor(bkg.status)}`}>
                          {bkg.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => { 
                            setSelected(bkg); 
                            setCatatan(''); 
                            setPesan(''); 
                            setLokasiOverride(bkg.slot.lokasi);
                            setWaktuMulaiOverride(bkg.slot.jam_mulai);
                            setWaktuSelesaiOverride(bkg.slot.jam_selesai);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#ebf1fd] text-[#135bec] rounded-lg text-xs font-bold hover:bg-[#135bec] hover:text-white transition-all">
                          <span className="material-symbols-outlined text-[14px]">rate_review</span>
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Validation Panel */}
        <div>
          {selected ? (
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-5 sticky top-6 animate-fade-in max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-[#111318] mb-4 flex items-center justify-between">
                Review Pengajuan ({selected.tiket_id})
                <button onClick={() => setSelected(null)} className="text-[#616f89] hover:text-[#111318]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </h3>

              {selected.status === 'confirmed' ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="bg-[#ebf1fd] border border-[#135bec]/20 p-4 rounded-xl text-xs text-[#616f89] leading-relaxed">
                    <span className="font-bold text-[#135bec] block mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Jadwal Telah Dikonfirmasi
                    </span>
                    Sesi konseling ini telah dijadwalkan pada hari <strong className="text-[#111318]">{formatDateShort(selected.slot.tanggal)}</strong> pukul <strong className="text-[#111318]">{selected.slot.jam_mulai} - {selected.slot.jam_selesai} WIB</strong>. Silakan selesaikan sesi jika konseling telah terlaksana.
                  </div>
                  <button onClick={() => setShowCompleteModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#135bec] hover:bg-[#0e45b5] text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-blue-500/10">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    Selesaikan Sesi Konseling
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-[#f6f6f8] rounded-lg mb-4">
                    <p className="font-bold text-[#111318] text-sm">{selected.user?.nama_lengkap}</p>
                    <p className="text-xs text-[#616f89] mb-2">NRP: {selected.user?.nrp}</p>
                    {getScreeningForBooking(selected) && (
                      <div className="flex gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRisikoColor(getScreeningForBooking(selected)!.level_risiko)}`}>
                          Risiko {getScreeningForBooking(selected)!.level_risiko.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ebf1fd] text-[#135bec]">
                          Skor: {getScreeningForBooking(selected)!.skor_total}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#616f89] mb-1 block">Catatan dari Personel</label>
                    <div className="p-3 border border-[#dbdfe6] rounded-lg bg-yellow-50 text-sm text-[#111318]">
                      "{selected.catatan_tambahan || 'Tidak ada catatan.'}"
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Kirim Pesan / Notifikasi (Opsional)</label>
                    <div className="flex gap-1.5 mb-2 flex-wrap">
                      <button onClick={() => setPesan('Mohon maaf, jadwal yang Anda pilih sudah terisi penuh. Silakan pilih jadwal lain.')} className="text-[10px] bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Ditolak</button>
                      <button onClick={() => setPesan('Jadwal Anda telah dikonfirmasi. Harap hadir 10 menit sebelumnya.')} className="text-[10px] bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Dikonfirmasi</button>
                      <button onClick={() => setPesan('Berdasarkan hasil skrining, kami merujuk Anda untuk penanganan klinis lanjutan. Surat rujukan dapat diunduh.')} className="text-[10px] bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Rujukan Khusus</button>
                    </div>
                    <textarea value={pesan} onChange={e => setPesan(e.target.value)} rows={3}
                      placeholder="Kirim pesan pemberitahuan ke kotak masuk personel..."
                      className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] text-sm p-3 resize-none focus:outline-none focus:border-[#135bec] transition-all" />
                  </div>

                  {/* Referral PDF Uploader */}
                  {user?.role === 'admin' && (
                    <div className="mb-4 p-4 border border-red-200 bg-red-50/40 rounded-xl">
                      <label className="text-xs font-bold text-red-800 mb-1.5 block flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">assignment_late</span>
                        Lampirkan Surat Rujukan (PDF)
                      </label>
                      <p className="text-[10px] text-[#616f89] mb-3">
                        Rekomendasi untuk personel risiko tinggi. Unggah file PDF surat rujukan resmi di sini.
                      </p>
                      <div className="flex flex-col gap-2">
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#dbdfe6] rounded-xl p-3 bg-white hover:bg-gray-50 cursor-pointer transition-all">
                          <span className="material-symbols-outlined text-gray-400 text-[24px] mb-1">upload_file</span>
                          <span className="text-xs text-[#111318] font-bold truncate max-w-xs">
                            {rujukanFileName ? rujukanFileName : 'Pilih File PDF Rujukan'}
                          </span>
                          <span className="text-[9px] text-[#616f89] mt-0.5">PDF Maksimal 5MB</span>
                          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                        </label>
                        {rujukanFileUrl && (
                          <button type="button" onClick={handleClearFile} className="text-xs text-red-600 hover:text-red-700 font-bold self-end flex items-center gap-0.5 mt-1">
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            Hapus File Lampiran
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#616f89] mb-1 block">Catatan Internal (Admin/Psikolog)</label>
                    <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={2}
                      placeholder="Hanya terlihat oleh Admin & Psikolog..."
                      className="w-full rounded-lg border border-[#dbdfe6] bg-[#f6f6f8] text-[#111318] text-sm p-3 resize-none focus:outline-none focus:border-[#135bec] transition-all" />
                  </div>

                  <div className="mb-4 bg-blue-50 border border-blue-100 p-4 rounded-xl animate-fade-in">
                    <p className="text-xs font-bold text-[#135bec] mb-3">Detail Pelaksanaan Konseling</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#616f89] block mb-1">Jam Mulai</label>
                        <input type="time" value={waktuMulaiOverride} onChange={e => setWaktuMulaiOverride(e.target.value)}
                          className="w-full bg-white border border-[#dbdfe6] rounded p-1.5 text-xs focus:outline-none focus:border-[#135bec]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#616f89] block mb-1">Jam Selesai</label>
                        <input type="time" value={waktuSelesaiOverride} onChange={e => setWaktuSelesaiOverride(e.target.value)}
                          className="w-full bg-white border border-[#dbdfe6] rounded p-1.5 text-xs focus:outline-none focus:border-[#135bec]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#616f89] block mb-1">
                        {selected.slot.metode === 'daring' ? 'Link Google Meet / Zoom' : 'Lokasi Ruangan'}
                      </label>
                      <input type="text" value={lokasiOverride} onChange={e => setLokasiOverride(e.target.value)}
                        placeholder={selected.slot.metode === 'daring' ? "Masukkan link GMeet..." : "Nama ruangan/lokasi..."}
                        className="w-full bg-white border border-[#dbdfe6] rounded p-1.5 text-xs focus:outline-none focus:border-[#135bec]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {user?.role === 'psikolog' ? (
                      <>
                        <button onClick={() => handleValidate('pending_admin')}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#135bec] hover:bg-[#0e45b5] text-white text-sm font-bold rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          Setuju & Teruskan ke Admin
                        </button>
                        <button onClick={() => handleValidate('rejected')}
                          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                          Tolak / Beri Saran Ulang
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleValidate('confirmed')}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Konfirmasi Jadwal
                        </button>
                        <button onClick={() => handleValidate('rejected')}
                          className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                          Tolak Jadwal
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#dbdfe6] mb-3 block">touch_app</span>
              <p className="text-sm text-[#616f89]">Pilih jadwal untuk ditinjau dan divalidasi</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: KONFIRMASI HAPUS JADWAL & SKRINING MASAL */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in overflow-hidden">
            <div className="p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-red-500 mb-2">warning</span>
              <h3 className="font-bold text-[#111318] text-base mb-1">Hapus Riwayat Terpilih?</h3>
              <p className="text-xs text-[#616f89] leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong>{selectedBookingIds.length}</strong> jadwal dan hasil skrining terpilih secara permanen? Sesi yang dihapus tidak dapat dipulihkan.
              </p>
            </div>
            <div className="flex gap-2 p-4 bg-[#f6f6f8] border-t border-[#dbdfe6]">
              <button onClick={handleBulkDelete} className="flex-1 py-2 rounded-lg text-white font-bold bg-red-600 hover:bg-red-700 text-xs transition-colors">
                Ya, Hapus Terpilih
              </button>
              <button onClick={() => setShowDeleteConfirmModal(false)} className="flex-1 py-2 rounded-lg border border-[#dbdfe6] text-[#616f89] font-bold bg-white hover:bg-gray-50 text-xs transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SELESAIKAN SESI KONSELING */}
      {showCompleteModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#dbdfe6] bg-[#ebf1fd]">
              <h3 className="font-bold text-[#135bec] flex items-center gap-1.5">
                <span className="material-symbols-outlined">verified_user</span>
                Selesaikan Konseling ({selected.tiket_id})
              </h3>
              <button onClick={() => setShowCompleteModal(false)} className="text-[#616f89] hover:text-[#111318]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-sm">
              <p className="text-[#616f89]">
                Silakan masukkan catatan hasil konseling, diagnosis singkat, atau saran tindak lanjut untuk personel <strong>{selected.user?.nama_lengkap}</strong>. Catatan ini akan dikirimkan langsung ke kotak masuk personel.
              </p>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Catatan Hasil Konseling *</label>
                <textarea
                  value={feedbackCatatan}
                  onChange={e => setFeedbackCatatan(e.target.value)}
                  rows={4}
                  placeholder="Ketik catatan hasil konseling..."
                  className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] text-sm p-3 resize-none focus:outline-none focus:border-[#135bec] transition-all"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 p-4 bg-[#f6f6f8] border-t border-[#dbdfe6]">
              <button onClick={handleCompleteSessionSubmit}
                className="flex-1 py-2 rounded-lg text-white font-bold bg-[#135bec] hover:bg-[#0e45b5] text-xs transition-colors">
                Konfirmasi Selesai
              </button>
              <button onClick={() => setShowCompleteModal(false)}
                className="flex-1 py-2 rounded-lg border border-[#dbdfe6] text-[#616f89] font-bold bg-white hover:bg-gray-50 text-xs transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
