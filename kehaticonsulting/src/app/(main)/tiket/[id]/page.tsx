'use client';

import Link from 'next/link';
import { mockBookings } from '@/lib/mockData';

function QRCode() {
  return (
    <div className="w-36 h-36 bg-white rounded-xl border-2 border-[#dbdfe6] flex items-center justify-center mx-auto">
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {Array.from({ length: 49 }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-[1px] ${
            [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,8,15,22,29,36,12,19,26,33,40].includes(i)
              ? 'bg-[#111318]' : 'bg-white'
          }`} />
        ))}
      </div>
    </div>
  );
}

export default function TiketPage({ params }: { params: { id: string } }) {
  const booking = mockBookings.find(b => b.id === params.id) ?? mockBookings[0];

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const statusConfig = {
    confirmed:  { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200' },
    completed:  { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    cancelled:  { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
  };
  const status = statusConfig[booking.status];

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-[#616f89] mb-6">
        <Link href="/riwayat" className="hover:text-[#135bec]">Riwayat</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-[#111318] font-medium">Tiket #{booking.tiket_id}</span>
      </nav>

      {/* Ticket Card */}
      <div className="bg-white rounded-2xl border border-[#dbdfe6] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#135bec] to-[#0e45b5] p-6 text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
            </div>
            <span className="font-bold text-lg">KEHATI</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider mb-1">{booking.tiket_id}</h1>
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${status.color} bg-white/90`}>
            {status.label}
          </span>
        </div>

        {/* Dashed Divider */}
        <div className="relative">
          <div className="absolute left-0 w-6 h-6 rounded-full -ml-3 bg-[#f6f6f8]"></div>
          <div className="absolute right-0 w-6 h-6 rounded-full -mr-3 bg-[#f6f6f8]"></div>
          <div className="border-t-2 border-dashed border-[#dbdfe6] mx-4 my-0"></div>
        </div>

        {/* QR Code */}
        <div className="py-6 px-6 text-center">
          <QRCode />
          <p className="text-xs text-[#616f89] mt-3">Tunjukkan QR code ini kepada konselor saat sesi dimulai</p>
        </div>

        {/* Dashed Divider */}
        <div className="relative">
          <div className="absolute left-0 w-6 h-6 rounded-full -ml-3 bg-[#f6f6f8]"></div>
          <div className="absolute right-0 w-6 h-6 rounded-full -mr-3 bg-[#f6f6f8]"></div>
          <div className="border-t-2 border-dashed border-[#dbdfe6] mx-4 my-0"></div>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Nama Personel', value: booking.user?.nama_lengkap ?? 'Bripda Agus Santoso', icon: 'person' },
              { label: 'Psikolog', value: booking.slot.psikolog.nama, icon: 'psychology' },
              { label: 'Tanggal', value: formatDate(booking.slot.tanggal), icon: 'calendar_today' },
              { label: 'Waktu', value: `${booking.slot.jam_mulai} – ${booking.slot.jam_selesai} WIB`, icon: 'schedule' },
              { label: 'Metode', value: booking.slot.metode.charAt(0).toUpperCase() + booking.slot.metode.slice(1), icon: 'videocam' },
              { label: 'Lokasi/Link', value: booking.slot.lokasi, icon: 'place' },
            ].map(item => (
              <div key={item.label} className="min-w-0">
                <div className="flex items-center gap-1 text-xs text-[#616f89] mb-1">
                  <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                  {item.label}
                </div>
                <p className="text-sm font-bold text-[#111318] truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {booking.catatan_tambahan && (
            <div className="mt-4 p-3 bg-[#f6f6f8] rounded-lg">
              <p className="text-xs text-[#616f89] mb-1">Catatan Tambahan</p>
              <p className="text-sm text-[#111318]">{booking.catatan_tambahan}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-5">
        {booking.status === 'confirmed' && (
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-all text-sm">
            <span className="material-symbols-outlined text-[18px]">cancel</span>
            Batalkan Booking
          </button>
        )}
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#dbdfe6] text-[#616f89] font-semibold hover:bg-[#f6f6f8] transition-all text-sm">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Unduh Tiket (PDF)
        </button>
        <Link href="/riwayat">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[#135bec] font-semibold text-sm hover:underline">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Riwayat
          </button>
        </Link>
      </div>

      {/* Info */}
      {booking.status === 'confirmed' && (
        <div className="mt-4 p-4 bg-[#ebf1fd] border border-[#135bec]/20 rounded-xl text-xs text-[#616f89]">
          <span className="font-bold text-[#135bec]">ℹ️ Informasi:</span> Pembatalan hanya dapat dilakukan minimal 24 jam sebelum jadwal sesi. Setelah itu, pembatalan tidak dapat diproses.
        </div>
      )}
    </div>
  );
}
