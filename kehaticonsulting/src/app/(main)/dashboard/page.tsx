'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { mockBookings, mockArticles, formatDateShort } from '@/lib/mockData';

const quickActions = [
  {
    href: '/skrining',
    icon: 'psychology',
    iconBg: 'bg-blue-100 text-[#135bec]',
    title: 'Mulai Skrining & Konsultasi',
    desc: 'Cek kondisi kesehatan mentalmu secara berkala dan mulai booking sesi konseling.',
    badge: null,
  },
  {
    href: '/riwayat',
    icon: 'confirmation_number',
    iconBg: 'bg-orange-100 text-orange-600',
    title: 'Riwayat & Tiket',
    desc: 'Lihat status skrining dan tiket konseling aktif Anda.',
    badge: '1 Aktif',
  },
  {
    href: '/berita',
    icon: 'article',
    iconBg: 'bg-purple-100 text-purple-600',
    title: 'Berita SDM',
    desc: 'Informasi terbaru seputar pengembangan SDM dan kesehatan mental Polri.',
    badge: null,
  },
];

const moodEmojis = ['😫', '😐', '🙂', '😄', '🤩'];

export default function DashboardPage() {
  const { user } = useAuth();
  const activeBooking = mockBookings.find(b => b.status === 'confirmed');
  const latestArticles = mockArticles.filter(a => a.status === 'published').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Greeting */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-[#111318] tracking-tight">
          Halo, {user?.nama_lengkap?.split(' ').slice(0, 2).join(' ')}! 👋
        </h1>
        <p className="mt-2 text-[#616f89] text-lg">
          Bagaimana perasaanmu hari ini? Jangan lupa jaga kesehatan mentalmu.
        </p>
      </div>

      {/* Active Booking Banner */}
      {activeBooking && (
        <div className="mb-6 animate-fade-in">
          <Link href={`/tiket/${activeBooking.id}`}>
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:border-green-400 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-green-800">Tiket Aktif: {activeBooking.tiket_id}</p>
                <p className="text-xs text-green-700 mt-0.5">
                  {activeBooking.slot.tanggal} · {activeBooking.slot.jam_mulai}–{activeBooking.slot.jam_selesai} WIB · {activeBooking.slot.psikolog.nama}
                </p>
              </div>
              <span className="material-symbols-outlined text-green-600 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {quickActions.map((action, i) => (
          <Link key={action.href} href={action.href}>
            <div
              className="group relative flex flex-col p-6 bg-white rounded-xl border border-[#dbdfe6] shadow-sm hover:shadow-md hover:border-[#135bec]/40 transition-all duration-300 overflow-hidden h-full animate-fade-in cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Background icon decoration */}
              <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[120px] -mr-6 -mt-6 block">{action.icon}</span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0 ${action.iconBg}`}>
                <span className="material-symbols-outlined text-[28px]">{action.icon}</span>
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-base font-bold text-[#111318] leading-snug">{action.title}</h3>
                {action.badge && (
                  <span className="shrink-0 text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">{action.badge}</span>
                )}
              </div>
              <p className="text-sm text-[#616f89]">{action.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[#135bec] text-xs font-bold group-hover:gap-2 transition-all">
                <span>Mulai</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Latest News */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#111318]">Berita Terbaru</h2>
            <Link href="/berita" className="flex items-center gap-1 text-sm font-semibold text-[#135bec] hover:text-[#0e45b5] transition-colors">
              Lihat Semua
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {latestArticles.map((article, i) => (
              <Link key={article.id} href={`/berita/${article.id}`}>
                <article
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-[#dbdfe6] hover:border-[#135bec]/30 hover:shadow-sm transition-all cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-full sm:w-44 h-28 shrink-0 rounded-lg overflow-hidden bg-[#f6f6f8]">
                    {article.thumbnail_url ? (
                      <img src={article.thumbnail_url} alt={article.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#616f89]">
                        <span className="material-symbols-outlined text-[40px]">article</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#135bec] mb-1.5 uppercase tracking-wider">{article.kategori}</span>
                    <h3 className="text-base font-bold text-[#111318] mb-2 leading-snug group-hover:text-[#135bec] transition-colors line-clamp-2">{article.judul}</h3>
                    <div className="flex items-center gap-4 text-xs text-[#616f89] mt-auto">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {article.published_at ? formatDateShort(article.published_at) : '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        {article.read_time} menit baca
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Mood Tracker */}
          <div className="bg-gradient-to-br from-[#135bec] to-[#0e45b5] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1">Mood Hari Ini</h3>
              <p className="text-blue-100 text-sm mb-5">Bagaimana perasaanmu sekarang?</p>
              <div className="flex justify-between items-center bg-white/10 rounded-xl p-2 backdrop-blur-sm">
                {moodEmojis.map((emoji, i) => (
                  <button key={i} className={`p-2 rounded-full transition-all text-2xl ${i === 2 ? 'bg-white shadow-md scale-110' : 'hover:bg-white/20'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white rounded-xl border border-[#dbdfe6] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#111318]">Jadwal Mendatang</h3>
              <Link href="/riwayat" className="text-xs text-[#135bec] font-semibold hover:underline">Lihat Semua</Link>
            </div>
            {activeBooking ? (
              <div className="flex gap-3 items-start">
                <div className="flex flex-col items-center bg-[#ebf1fd] rounded-lg p-2 min-w-[54px]">
                  <span className="text-xs font-bold text-[#135bec] uppercase">
                    {new Date(activeBooking.slot.tanggal).toLocaleString('id-ID', { month: 'short' })}
                  </span>
                  <span className="text-xl font-extrabold text-[#111318]">
                    {new Date(activeBooking.slot.tanggal).getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111318] line-clamp-1">Konseling {activeBooking.slot.psikolog.nama.split(' ').slice(0, 2).join(' ')}</h4>
                  <p className="text-xs text-[#616f89] mt-0.5">{activeBooking.slot.jam_mulai}–{activeBooking.slot.jam_selesai} WIB</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">Confirmed</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <span className="material-symbols-outlined text-[40px] text-[#dbdfe6] mb-2">event_available</span>
                <p className="text-sm text-[#616f89]">Belum ada jadwal konseling</p>
                <Link href="/skrining">
                  <button className="mt-3 text-xs font-bold text-[#135bec] hover:underline">Buat Booking →</button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-[#dbdfe6] p-5">
            <h3 className="font-bold text-[#111318] mb-3">Info Layanan</h3>
            <div className="flex flex-col gap-3 text-sm">
              {[
                ['schedule', 'Senin – Jumat: 08.00 – 16.00 WIB'],
                ['phone', '(022) 7202-1000 ext. 5678'],
                ['email', 'konseling@poldajabar.go.id'],
                ['location_on', 'Biro SDM, Lt. 3 Mapolda Jabar'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-2 text-[#616f89]">
                  <span className="material-symbols-outlined text-[16px] text-[#135bec] mt-0.5 shrink-0">{icon}</span>
                  <span className="text-xs">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
