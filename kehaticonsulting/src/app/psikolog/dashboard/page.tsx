'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { getRisikoColor, formatDateShort, getBookingStatusColor } from '@/lib/mockData';
import { getLocalScreenings, getLocalBookings } from '@/lib/dataStore';
import { useAuth } from '@/context/AuthContext';
import { Screening, Booking } from '@/lib/types';

export default function PsikologDashboardPage() {
  const { user } = useAuth();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refreshData = useCallback(() => {
    setScreenings(getLocalScreenings());
    setBookings(getLocalBookings());
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Stats khusus psikolog
  const pendingReview = bookings.filter(b => b.status === 'pending_psikolog').length;
  const pendingAdmin = bookings.filter(b => b.status === 'pending_admin').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const risikoTinggi = screenings.filter(s => s.level_risiko === 'tinggi').length;
  const totalSkrining = screenings.length;

  const distribusi = {
    rendah: screenings.filter(s => s.level_risiko === 'rendah').length,
    sedang: screenings.filter(s => s.level_risiko === 'sedang').length,
    tinggi: risikoTinggi,
  };
  const totalDist = distribusi.rendah + distribusi.sedang + distribusi.tinggi || 1;

  const statCards = [
    { label: 'Menunggu Review', value: pendingReview.toString(), icon: 'pending_actions', color: 'bg-purple-100 text-purple-600', trend: 'Perlu ditinjau segera' },
    { label: 'Diteruskan ke Admin', value: pendingAdmin.toString(), icon: 'forward_to_inbox', color: 'bg-orange-100 text-orange-600', trend: 'Menunggu verifikasi' },
    { label: 'Risiko Tinggi', value: `${risikoTinggi} Orang`, icon: 'warning', color: 'bg-red-100 text-red-600', trend: 'Perlu perhatian khusus' },
    { label: 'Sesi Terkonfirmasi', value: confirmed.toString(), icon: 'event_available', color: 'bg-green-100 text-green-600', trend: `Total skrining: ${totalSkrining}` },
  ];

  // Booking pending psikolog untuk di-list
  const pendingBookings = bookings.filter(b => b.status === 'pending_psikolog');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111318]">Dashboard Psikolog</h1>
          <p className="text-[#616f89] mt-1 text-sm">Selamat datang, {user?.nama_lengkap?.split(' ').slice(0, 2).join(' ')} — Tinjau dan kelola konseling personel.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#616f89] bg-white border border-[#dbdfe6] px-3 py-2 rounded-lg">
          <span className="material-symbols-outlined text-[16px] text-[#135bec]">schedule</span>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-[#dbdfe6] p-5 hover:shadow-sm transition-all animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
              </div>
              {card.label === 'Menunggu Review' && pendingReview > 0 && (
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <p className="text-3xl font-black text-[#111318]">{card.value}</p>
            <p className="text-xs font-semibold text-[#616f89] mt-1">{card.label}</p>
            <p className="text-xs text-[#135bec] mt-1">{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Distribusi Risiko + Pending List */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#dbdfe6] p-5">
          <h3 className="font-bold text-[#111318] mb-5">Distribusi Risiko</h3>
          {[
            { level: 'rendah', pct: Math.round((distribusi.rendah / totalDist) * 100), color: 'bg-green-500', label: 'Rendah' },
            { level: 'sedang', pct: Math.round((distribusi.sedang / totalDist) * 100), color: 'bg-yellow-500', label: 'Sedang' },
            { level: 'tinggi', pct: Math.round((distribusi.tinggi / totalDist) * 100), color: 'bg-red-500', label: 'Tinggi' },
          ].map(item => (
            <div key={item.level} className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold text-[#111318]">{item.label}</span>
                <span className="font-bold text-[#111318]">{item.pct}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#f6f6f8] rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }}></div>
              </div>
            </div>
          ))}
          <div className="mt-5 pt-4 border-t border-[#f6f6f8]">
            <p className="text-xs text-[#616f89]">Total skrining: <strong className="text-[#111318]">{totalSkrining}</strong></p>
          </div>
        </div>

        {/* Pending Review List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#dbdfe6] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#111318] flex items-center gap-2">
              Pengajuan Menunggu Review
              {pendingReview > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">{pendingReview} baru</span>
              )}
            </h3>
            <Link href="/admin/skrining" className="text-xs font-semibold text-[#135bec] hover:underline flex items-center gap-1">
              Lihat Semua <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {pendingBookings.length === 0 ? (
              <div className="text-center py-8 text-[#616f89]">
                <span className="material-symbols-outlined text-[40px] text-[#dbdfe6] mb-2 block">inbox</span>
                <p className="text-sm">Tidak ada pengajuan yang perlu ditinjau saat ini.</p>
              </div>
            ) : (
              pendingBookings.slice(0, 5).map(bkg => {
                const sk = screenings.find(s => s.user_id === bkg.user_id);
                return (
                  <div key={bkg.id} className="flex items-center gap-4 p-3 rounded-lg bg-[#f6f6f8] hover:bg-[#ebf1fd] transition-colors">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-black bg-purple-100 text-purple-700">
                      {bkg.user?.nama_lengkap?.charAt(0) ?? 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#111318] truncate">{bkg.user?.nama_lengkap ?? 'Personel'}</p>
                      <p className="text-xs text-[#616f89]">{bkg.slot.psikolog.nama} · {formatDateShort(bkg.slot.tanggal)} · {bkg.slot.jam_mulai}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {sk && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRisikoColor(sk.level_risiko)}`}>
                          {sk.level_risiko.toUpperCase()}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bkg.slot.metode === 'daring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {bkg.slot.metode.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBookingStatusColor(bkg.status)}`}>
                        {bkg.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: '/admin/skrining', icon: 'psychology', label: 'Review Pengajuan', desc: 'Tinjau hasil skrining & jadwal personel', badge: `${pendingReview} Pending`, badgeColor: 'bg-red-100 text-red-700' },
          { href: '/admin/jadwal', icon: 'calendar_month', label: 'Jadwal Konseling', desc: 'Kelola slot jadwal konseling Anda', badge: `${confirmed} Terkonfirmasi`, badgeColor: 'bg-green-100 text-green-700' },
          { href: '/dashboard', icon: 'home', label: 'Beranda Personel', desc: 'Kembali ke dashboard personel', badge: 'Lihat', badgeColor: 'bg-blue-100 text-blue-700' },
        ].map(item => (
          <Link key={item.href} href={item.href}>
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-5 hover:shadow-md hover:border-[#135bec]/40 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-[#ebf1fd] text-[#135bec] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
              <p className="font-bold text-[#111318] text-sm">{item.label}</p>
              <p className="text-xs text-[#616f89] mt-0.5 mb-2">{item.desc}</p>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
