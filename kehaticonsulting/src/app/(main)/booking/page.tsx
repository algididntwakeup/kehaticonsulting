'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockSlots } from '@/lib/mockData';
import { Slot } from '@/lib/types';

type MetodeFilter = 'semua' | 'daring' | 'luring';

export default function BookingPage() {
  const router = useRouter();
  const [metodeFilter, setMetodeFilter] = useState<MetodeFilter>('semua');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedDate, setSelectedDate] = useState('');

  const availableSlots = mockSlots
    .filter(s => s.status === 'available')
    .filter(s => metodeFilter === 'semua' || s.metode === metodeFilter)
    .filter(s => !selectedDate || s.tanggal === selectedDate);

  // Group by date
  const grouped = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.tanggal]) acc[slot.tanggal] = [];
    acc[slot.tanggal].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const handleBook = () => {
    if (selectedSlot) {
      router.push(`/booking/konfirmasi?slot=${selectedSlot.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-[#616f89] mb-3">
          <Link href="/dashboard" className="hover:text-[#135bec]">Dashboard</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link href="/skrining/hasil" className="hover:text-[#135bec]">Hasil Skrining</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#111318] font-medium">Booking Jadwal</span>
        </nav>
        <h1 className="text-3xl font-bold text-[#111318]">Pilih Jadwal Konseling</h1>
        <p className="text-[#616f89] mt-2">Pilih slot yang tersedia sesuai waktu dan metode yang Anda inginkan.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Filters + Slots */}
        <div className="lg:col-span-2">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-xl border border-[#dbdfe6]">
            <div className="flex gap-2">
              {(['semua', 'daring', 'luring'] as MetodeFilter[]).map(m => (
                <button key={m} onClick={() => setMetodeFilter(m)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    metodeFilter === m
                      ? 'bg-[#135bec] text-white shadow-sm'
                      : 'bg-[#f6f6f8] text-[#616f89] hover:bg-[#ebf1fd] hover:text-[#135bec]'
                  }`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {m === 'daring' ? 'videocam' : m === 'luring' ? 'location_on' : 'apps'}
                  </span>
                  {m === 'semua' ? 'Semua Metode' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <div className="sm:ml-auto">
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm text-[#111318] focus:outline-none focus:border-[#135bec] bg-white cursor-pointer"
              />
            </div>
          </div>

          {/* Slot List */}
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center py-20 bg-white rounded-xl border border-[#dbdfe6] text-center">
              <span className="material-symbols-outlined text-[60px] text-[#dbdfe6] mb-4">event_busy</span>
              <p className="text-[#616f89] font-medium">Tidak ada slot tersedia</p>
              <p className="text-[#616f89] text-sm mt-1">Coba ubah filter atau pilih tanggal lain.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(grouped).map(([date, slots]) => (
                <div key={date} className="animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#111318]">
                      <span className="material-symbols-outlined text-[18px] text-[#135bec]">calendar_today</span>
                      {formatDate(date)}
                    </div>
                    <div className="flex-1 h-px bg-[#dbdfe6]"></div>
                    <span className="text-xs text-[#616f89]">{slots.length} slot</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {slots.map(slot => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button key={slot.id} onClick={() => setSelectedSlot(isSelected ? null : slot)}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-[#135bec] bg-[#ebf1fd]'
                              : 'border-[#dbdfe6] bg-white hover:border-[#135bec]/50 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[20px] text-[#616f89]">
                                {slot.metode === 'daring' ? 'videocam' : 'location_on'}
                              </span>
                              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                                slot.metode === 'daring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}>{slot.metode}</span>
                            </div>
                            {isSelected && (
                              <span className="material-symbols-outlined text-[20px] text-[#135bec]">check_circle</span>
                            )}
                          </div>
                          <p className="text-xl font-black text-[#111318] mb-1">
                            {slot.jam_mulai} – {slot.jam_selesai}
                          </p>
                          <p className="text-sm font-semibold text-[#616f89] mb-2">{slot.psikolog.nama}</p>
                          <p className="text-xs text-[#616f89] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              {slot.metode === 'daring' ? 'link' : 'place'}
                            </span>
                            <span className="truncate">{slot.lokasi}</span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-6 shadow-sm">
              <h3 className="font-bold text-[#111318] mb-4">Ringkasan Booking</h3>
              {selectedSlot ? (
                <div className="animate-fade-in">
                  <div className="flex flex-col gap-3 mb-6">
                    {[
                      { label: 'Psikolog', value: selectedSlot.psikolog.nama, icon: 'person' },
                      { label: 'Tanggal', value: formatDate(selectedSlot.tanggal), icon: 'calendar_today' },
                      { label: 'Waktu', value: `${selectedSlot.jam_mulai} – ${selectedSlot.jam_selesai} WIB`, icon: 'schedule' },
                      { label: 'Metode', value: selectedSlot.metode.charAt(0).toUpperCase() + selectedSlot.metode.slice(1), icon: 'videocam' },
                      { label: 'Lokasi', value: selectedSlot.lokasi, icon: 'place' },
                    ].map(item => (
                      <div key={item.label} className="flex gap-3">
                        <span className="material-symbols-outlined text-[18px] text-[#135bec] shrink-0 mt-0.5">{item.icon}</span>
                        <div>
                          <p className="text-xs text-[#616f89]">{item.label}</p>
                          <p className="text-sm font-semibold text-[#111318]">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleBook}
                    className="w-full flex items-center justify-center gap-2 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    Lanjut Konfirmasi
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center text-[#616f89]">
                  <span className="material-symbols-outlined text-[48px] text-[#dbdfe6] mb-3">touch_app</span>
                  <p className="text-sm font-medium">Pilih slot jadwal di sebelah kiri untuk melanjutkan</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-4 p-4 bg-[#ebf1fd] border border-[#135bec]/20 rounded-xl">
              <p className="text-xs font-bold text-[#135bec] mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Informasi
              </p>
              <ul className="text-xs text-[#616f89] space-y-1">
                <li>• Setiap slot hanya tersedia untuk 1 personel</li>
                <li>• Pembatalan min. 24 jam sebelum jadwal</li>
                <li>• Link/lokasi dikirim via email setelah konfirmasi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
