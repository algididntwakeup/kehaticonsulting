'use client';

import Link from 'next/link';
import { getLocalBookings, cancelLocalBooking } from '@/lib/dataStore';
import { Booking } from '@/lib/types';
import { useEffect, useState, use } from 'react';
import { toast } from 'sonner';

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

export default function TiketPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const local = getLocalBookings();
    setBooking(local.find(b => b.id === id) ?? local[0]);
  }, [id]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const isCancelDisabled = () => {
    if (!booking) return true;
    const todayStr = new Date().toISOString().split('T')[0];
    const slotDateStr = booking.slot.tanggal;
    return slotDateStr <= todayStr;
  };

  const handleCancelBooking = () => {
    if (!booking) return;
    cancelLocalBooking(booking.id);
    const local = getLocalBookings();
    setBooking(local.find(b => b.id === id) ?? null);
    toast.success('Jadwal konseling berhasil dibatalkan');
    setShowCancelModal(false);
  };

  const handleDownloadPDF = () => {
    if (!booking) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Gagal membuka jendela cetak. Pastikan pop-up blocker Anda dinonaktifkan.');
      return;
    }
    const content = `
      <html>
        <head>
          <title>TIKET KONSELING - ${booking.tiket_id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #111318; background-color: #fff; }
            .ticket { border: 2px solid #dbdfe6; padding: 30px; border-radius: 0px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px dashed #dbdfe6; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { margin: 5px 0; color: #135bec; font-size: 28px; }
            .header p { margin: 0; color: #616f89; font-size: 14px; }
            .section { margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f6f6f8; }
            .label { color: #616f89; font-size: 14px; }
            .value { font-weight: bold; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #616f89; }
            .qr { border: 1px solid #dbdfe6; padding: 10px; width: 100px; height: 100px; display: inline-block; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <p>POLDA JAWA BARAT - BIRO SDM</p>
              <h1>TIKET KONSELING KEHATI</h1>
              <p>NRP Tiket: ${booking.tiket_id}</p>
            </div>
            <div class="section">
              <div class="row"><span class="label">Nama Personel</span><span class="value">${booking.user?.nama_lengkap}</span></div>
              <div class="row"><span class="label">NRP</span><span class="value">${booking.user?.nrp}</span></div>
              <div class="row"><span class="label">Psikolog</span><span class="value">${booking.slot.psikolog.nama}</span></div>
              <div class="row"><span class="label">Hari / Tanggal</span><span class="value">${formatDate(booking.slot.tanggal)}</span></div>
              <div class="row"><span class="label">Waktu Sesi</span><span class="value">${booking.slot.jam_mulai} - ${booking.slot.jam_selesai} WIB</span></div>
              <div class="row"><span class="label">Metode</span><span class="value" style="text-transform: capitalize;">${booking.slot.metode}</span></div>
              <div class="row"><span class="label">Lokasi / Link Meet</span><span class="value">${booking.slot.lokasi}</span></div>
            </div>
            <div class="footer">
              <p>Harap hadir/bergabung 10 menit sebelum jadwal konseling dimulai.</p>
              <div style="font-family: monospace; font-size: 10px; border: 1px solid #616f89; display: inline-block; padding: 8px; margin-top: 10px;">
                [QR CODE VALIDASI KEHATI]
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(content);
    printWindow.document.close();
  };

  if (!booking) return <div className="p-10 text-center">Loading...</div>;

  const statusConfig: Record<string, {label: string, color: string}> = {
    confirmed:  { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200' },
    pending_psikolog: { label: 'Review Psikolog', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    pending_admin: { label: 'Verifikasi Admin', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    completed:  { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    rejected:   { label: 'Ditolak', color: 'bg-red-100 text-red-800 border-red-200' },
    cancelled:  { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
  };
  const status = statusConfig[booking.status] || statusConfig['pending_psikolog'];

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
        {(booking.status === 'confirmed' || booking.status === 'pending_psikolog' || booking.status === 'pending_admin') && (
          <button
            onClick={() => {
              if (isCancelDisabled()) {
                toast.error('Pembatalan tidak dapat dilakukan pada hari H atau setelah jadwal sesi dimulai.');
                return;
              }
              setShowCancelModal(true);
            }}
            disabled={isCancelDisabled()}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 font-semibold text-sm transition-all ${
              isCancelDisabled()
                ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
            title={isCancelDisabled() ? "Pembatalan dinonaktifkan pada hari H" : "Batalkan Booking"}
          >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
            Batalkan Booking
          </button>
        )}
        <button onClick={handleDownloadPDF}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#dbdfe6] text-[#616f89] font-semibold hover:bg-[#f6f6f8] transition-all text-sm">
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

      {/* MODAL: KONFIRMASI BATAL BOOKING */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in overflow-hidden">
            <div className="p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-red-500 mb-2">warning</span>
              <h3 className="font-bold text-[#111318] text-base mb-1">Batalkan Konseling?</h3>
              <p className="text-xs text-[#616f89] leading-relaxed">
                Apakah Anda yakin ingin membatalkan jadwal konseling ini secara permanen? Sesi yang dibatalkan tidak dapat dikembalikan.
              </p>
            </div>
            <div className="flex gap-2 p-4 bg-[#f6f6f8] border-t border-[#dbdfe6]">
              <button onClick={handleCancelBooking} className="flex-1 py-2 rounded-lg text-white font-bold bg-red-600 hover:bg-red-700 text-xs transition-colors">
                Ya, Batalkan Sesi
              </button>
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2 rounded-lg border border-[#dbdfe6] text-[#616f89] font-bold bg-white hover:bg-gray-50 text-xs transition-colors">
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
