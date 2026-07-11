'use client';

import { useState, useEffect } from 'react';
import { getBookingStatusColor, getRisikoColor, formatDateShort, mockPsikolog } from '@/lib/mockData';
import { getLocalScreenings, getLocalBookings, saveBooking, saveMailboxMessage, generateId } from '@/lib/dataStore';
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
      const isRujukan = pesan.toLowerCase().includes('rujukan');
      const mailboxMsg: MailboxMessage = {
        id: generateId('msg'),
        user_id: selected.user_id,
        tipe: isRujukan ? 'rujukan' : 'tiket',
        judul: isRujukan ? `Surat Rujukan - Tiket ${selected.tiket_id}` : `Pembaruan Jadwal Konseling (${selected.tiket_id})`,
        konten: pesan,
        is_read: false,
        created_at: new Date().toISOString(),
        action_url: isRujukan ? undefined : `/tiket/${selected.id}`,
        tiket_id: selected.tiket_id,
        psikolog_nama: selected.slot.psikolog.nama,
        tanggal: selected.slot.tanggal,
        waktu: `${updatedSlot.jam_mulai} – ${updatedSlot.jam_selesai} WIB`,
        metode: selected.slot.metode,
        lokasi_link: updatedSlot.lokasi,
        booking_id: selected.id
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
          <div className="bg-white rounded-xl border border-[#dbdfe6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#dbdfe6] bg-[#f6f6f8]">
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
                <label className="text-xs font-bold text-[#616f89] mb-1 block">Pesan ke Personel (Mailbox)</label>
                <div className="flex gap-1 mb-2">
                  <button onClick={() => setPesan('Mohon maaf, jadwal yang Anda pilih sudah terisi penuh. Silakan pilih jadwal lain.')} className="text-[10px] bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Ditolak</button>
                  <button onClick={() => setPesan('Jadwal Anda telah dikonfirmasi. Harap hadir 10 menit sebelumnya.')} className="text-[10px] bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Dikonfirmasi</button>
                  <button onClick={() => setPesan('Berdasarkan hasil skrining, kami merujuk Anda untuk penanganan klinis lanjutan. Surat rujukan dapat diunduh.')} className="text-[10px] bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">Rujukan Khusus</button>
                </div>
                <textarea value={pesan} onChange={e => setPesan(e.target.value)} rows={3}
                  placeholder="Kirim pesan pemberitahuan ke kotak masuk personel..."
                  className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] text-sm p-3 resize-none focus:outline-none focus:border-[#135bec] transition-all" />
              </div>

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
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#dbdfe6] mb-3 block">touch_app</span>
              <p className="text-sm text-[#616f89]">Pilih jadwal untuk ditinjau dan divalidasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
