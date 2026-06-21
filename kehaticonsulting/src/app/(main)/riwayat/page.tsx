'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockBookings, mockScreenings, getBookingStatusColor, getValidationColor, getRisikoColor, formatDateShort } from '@/lib/mockData';

type TabType = 'booking' | 'skrining';

export default function RiwayatPage() {
  const [activeTab, setActiveTab] = useState<TabType>('booking');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#111318]">Riwayat & Tiket</h1>
        <p className="text-[#616f89] mt-2">Daftar semua skrining dan sesi konseling yang pernah Anda lakukan.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#f6f6f8] rounded-xl mb-6 w-fit">
        {(['booking', 'skrining'] as TabType[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-[#135bec] shadow-sm'
                : 'text-[#616f89] hover:text-[#111318]'
            }`}>
            {tab === 'booking' ? (
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">confirmation_number</span>Booking</span>
            ) : (
              <span className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">psychology</span>Skrining</span>
            )}
          </button>
        ))}
      </div>

      {/* Booking Tab */}
      {activeTab === 'booking' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {mockBookings.length === 0 ? (
            <div className="flex flex-col items-center py-20 bg-white rounded-xl border border-[#dbdfe6] text-center">
              <span className="material-symbols-outlined text-[60px] text-[#dbdfe6] mb-4">confirmation_number</span>
              <p className="text-[#616f89] font-medium">Belum ada riwayat booking</p>
              <Link href="/booking">
                <button className="mt-4 px-6 py-2.5 bg-[#135bec] text-white rounded-lg text-sm font-bold hover:bg-[#0e45b5] transition-colors">
                  Buat Booking
                </button>
              </Link>
            </div>
          ) : (
            mockBookings.map((booking, i) => (
              <Link key={booking.id} href={`/tiket/${booking.id}`}>
                <div
                  className="bg-white rounded-xl border border-[#dbdfe6] p-5 hover:border-[#135bec]/40 hover:shadow-sm transition-all cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#ebf1fd] text-[#135bec] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[24px]">
                          {booking.slot.metode === 'daring' ? 'videocam' : 'location_on'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-bold text-[#111318]">{booking.tiket_id}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getBookingStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-[#616f89] font-medium">{booking.slot.psikolog.nama}</p>
                        <div className="flex items-center gap-4 text-xs text-[#616f89] mt-1.5">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {formatDateShort(booking.slot.tanggal)}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {booking.slot.jam_mulai} – {booking.slot.jam_selesai} WIB
                          </span>
                          <span className="flex items-center gap-1 capitalize">
                            <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                            {booking.slot.metode}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-[#dbdfe6] group-hover:text-[#135bec] transition-colors shrink-0">arrow_forward_ios</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Skrining Tab */}
      {activeTab === 'skrining' && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {mockScreenings.length === 0 ? (
            <div className="flex flex-col items-center py-20 bg-white rounded-xl border border-[#dbdfe6] text-center">
              <span className="material-symbols-outlined text-[60px] text-[#dbdfe6] mb-4">psychology</span>
              <p className="text-[#616f89] font-medium">Belum ada riwayat skrining</p>
              <Link href="/skrining">
                <button className="mt-4 px-6 py-2.5 bg-[#135bec] text-white rounded-lg text-sm font-bold hover:bg-[#0e45b5] transition-colors">
                  Mulai Skrining
                </button>
              </Link>
            </div>
          ) : (
            mockScreenings.slice(0, 2).map((sk, i) => (
              <div
                key={sk.id}
                className="bg-white rounded-xl border border-[#dbdfe6] p-5 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      sk.level_risiko === 'tinggi' ? 'bg-red-100 text-red-600' :
                      sk.level_risiko === 'sedang' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {sk.level_risiko === 'tinggi' ? 'sentiment_very_dissatisfied' :
                         sk.level_risiko === 'sedang' ? 'sentiment_neutral' :
                         'sentiment_satisfied'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-bold text-[#111318]">Skrining #{sk.id.slice(-6)}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRisikoColor(sk.level_risiko)}`}>
                          Risiko {sk.level_risiko.charAt(0).toUpperCase() + sk.level_risiko.slice(1)}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getValidationColor(sk.validation_status)}`}>
                          {sk.validation_status.charAt(0).toUpperCase() + sk.validation_status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#616f89] mt-1.5">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {formatDateShort(sk.submitted_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">bar_chart</span>
                          Skor: <strong className="text-[#111318]">{sk.skor_total}/63</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">biotech</span>
                          {sk.instrument_version}
                        </span>
                      </div>
                      {sk.catatan_admin && (
                        <p className="mt-2 text-xs text-[#616f89] italic border-l-2 border-[#135bec] pl-2">
                          Catatan: {sk.catatan_admin}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="mt-4 text-center">
            <Link href="/skrining">
              <button className="px-6 py-3 bg-[#135bec] text-white rounded-xl text-sm font-bold hover:bg-[#0e45b5] transition-all shadow-sm shadow-blue-500/20 hover:shadow-md flex items-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Skrining Baru
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
