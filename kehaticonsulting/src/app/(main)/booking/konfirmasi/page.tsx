'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockSlots } from '@/lib/mockData';

export default function KonfirmasiBookingPage() {
  const router = useRouter();
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Demo: ambil slot pertama sebagai contoh
  const slot = mockSlots[0];

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    router.push('/tiket/bkg_01HXYZ');
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#616f89] mb-6">
        <Link href="/booking" className="hover:text-[#135bec]">Booking</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-[#111318] font-medium">Konfirmasi</span>
      </nav>

      <h1 className="text-2xl font-bold text-[#111318] mb-6">Konfirmasi Booking</h1>

      {/* Slot Detail Card */}
      <div className="bg-white rounded-2xl border border-[#dbdfe6] shadow-sm overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#135bec] to-[#0e45b5] p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
            <div>
              <p className="text-blue-100 text-xs">Psikolog</p>
              <p className="font-bold text-lg">{slot.psikolog.nama}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 text-xs mb-1">Tanggal</p>
              <p className="font-bold text-sm">{formatDate(slot.tanggal)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs mb-1">Waktu</p>
              <p className="font-bold text-sm">{slot.jam_mulai} – {slot.jam_selesai} WIB</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between py-3 border-b border-[#f6f6f8]">
            <div className="flex items-center gap-2 text-sm text-[#616f89]">
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              Metode Konseling
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
              slot.metode === 'daring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
            }`}>
              {slot.metode.charAt(0).toUpperCase() + slot.metode.slice(1)}
            </span>
          </div>
          <div className="flex items-start justify-between py-3 border-b border-[#f6f6f8] gap-4">
            <div className="flex items-center gap-2 text-sm text-[#616f89] shrink-0">
              <span className="material-symbols-outlined text-[18px]">place</span>
              Lokasi
            </div>
            <p className="text-sm font-semibold text-[#111318] text-right">{slot.lokasi}</p>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-sm text-[#616f89]">
              <span className="material-symbols-outlined text-[18px]">timer</span>
              Durasi Sesi
            </div>
            <p className="text-sm font-semibold text-[#111318]">60 Menit</p>
          </div>
        </div>
      </div>

      {/* Catatan Tambahan */}
      <div className="bg-white rounded-2xl border border-[#dbdfe6] p-6 mb-6">
        <label className="block text-sm font-bold text-[#111318] mb-2">
          Catatan Tambahan <span className="text-[#616f89] font-normal">(opsional)</span>
        </label>
        <textarea
          value={catatan}
          onChange={e => setCatatan(e.target.value)}
          rows={4}
          placeholder="Ceritakan secara singkat apa yang ingin Anda bahas dalam sesi konseling ini. Informasi ini akan membantu konselor mempersiapkan sesi yang lebih efektif."
          className="w-full rounded-xl border border-[#dbdfe6] bg-[#f6f6f8] text-[#111318] text-sm p-4 placeholder:text-[#616f89] focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 resize-none transition-all"
        />
        <p className="text-xs text-[#616f89] mt-2">{catatan.length}/500 karakter</p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-[#ebf1fd] border border-[#135bec]/20 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 accent-[#135bec] h-4 w-4 cursor-pointer" />
          <label htmlFor="agree" className="text-sm text-[#616f89] cursor-pointer leading-relaxed">
            Saya memahami bahwa sesi konseling ini bersifat <strong className="text-[#111318]">rahasia</strong> dan data saya dilindungi sesuai kebijakan privasi KEHATI. Saya bersedia hadir tepat waktu atau melakukan pembatalan minimal <strong className="text-[#111318]">24 jam sebelum jadwal</strong>.
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button onClick={handleConfirm} disabled={!agreed || loading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all ${
            agreed && !loading
              ? 'bg-[#135bec] hover:bg-[#0e45b5] shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[0.98]'
              : 'bg-[#dbdfe6] cursor-not-allowed'
          }`}>
          {loading ? (
            <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Memproses Booking...</>
          ) : (
            <><span className="material-symbols-outlined text-[20px]">check_circle</span> Konfirmasi Booking</>
          )}
        </button>
        <Link href="/booking">
          <button className="w-full py-3.5 rounded-xl border border-[#dbdfe6] text-[#616f89] font-semibold hover:bg-[#f6f6f8] transition-all text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Pilih Jadwal
          </button>
        </Link>
      </div>
    </div>
  );
}
