'use client';

import Link from 'next/link';
import { mockAdminStats, mockScreenings, mockBookings, getRisikoColor, getValidationColor, formatDateShort } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

const statCards = [
  { label: 'Skrining Hari Ini', value: '12', icon: 'psychology', color: 'bg-blue-100 text-[#135bec]', trend: '+3 dari kemarin' },
  { label: 'Antrian Booking', value: '5', icon: 'calendar_month', color: 'bg-orange-100 text-orange-600', trend: '2 mendesak' },
  { label: 'Risiko Tinggi', value: '17%', icon: 'warning', color: 'bg-red-100 text-red-600', trend: 'Perlu perhatian' },
  { label: 'Total Pengguna', value: '248', icon: 'group', color: 'bg-green-100 text-green-600', trend: '+12 bulan ini' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111318]">Dashboard Admin</h1>
          <p className="text-[#616f89] mt-1 text-sm">Selamat datang, {user?.nama_lengkap?.split(' ').slice(0, 2).join(' ')} — Pantau dan kelola layanan KEHATI.</p>
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
            </div>
            <p className="text-3xl font-black text-[#111318]">{card.value}</p>
            <p className="text-xs font-semibold text-[#616f89] mt-1">{card.label}</p>
            <p className="text-xs text-[#135bec] mt-1">{card.trend}</p>
          </div>
        ))}
      </div>

      {/* Distribusi Risiko */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#dbdfe6] p-5">
          <h3 className="font-bold text-[#111318] mb-5">Distribusi Risiko</h3>
          {[
            { level: 'rendah', pct: 45, color: 'bg-green-500', label: 'Rendah' },
            { level: 'sedang', pct: 38, color: 'bg-yellow-500', label: 'Sedang' },
            { level: 'tinggi', pct: 17, color: 'bg-red-500', label: 'Tinggi' },
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
            <p className="text-xs text-[#616f89]">Total skrining bulan ini: <strong className="text-[#111318]">248</strong></p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#dbdfe6] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-[#111318]">Skrining Terbaru (Pending)</h3>
            <Link href="/admin/skrining" className="text-xs font-semibold text-[#135bec] hover:underline flex items-center gap-1">
              Lihat Semua <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {mockScreenings.slice(0, 3).map(sk => (
              <div key={sk.id} className="flex items-center gap-4 p-3 rounded-lg bg-[#f6f6f8] hover:bg-[#ebf1fd] transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-black ${
                  sk.level_risiko === 'tinggi' ? 'bg-red-100 text-red-700' :
                  sk.level_risiko === 'sedang' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {sk.user?.nama_lengkap?.charAt(0) ?? 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#111318] truncate">{sk.user?.nama_lengkap ?? 'Personel'}</p>
                  <p className="text-xs text-[#616f89]">{sk.user?.satker} · {formatDateShort(sk.submitted_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRisikoColor(sk.level_risiko)}`}>
                    {sk.level_risiko.charAt(0).toUpperCase() + sk.level_risiko.slice(1)}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getValidationColor(sk.validation_status)}`}>
                    {sk.validation_status.charAt(0).toUpperCase() + sk.validation_status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/skrining', icon: 'psychology', label: 'Validasi Skrining', badge: '3 Pending', badgeColor: 'bg-red-100 text-red-700' },
          { href: '/admin/jadwal', icon: 'calendar_month', label: 'Kelola Jadwal', badge: '6 Slot Aktif', badgeColor: 'bg-blue-100 text-blue-700' },
          { href: '/admin/berita', icon: 'article', label: 'Kelola Berita', badge: '1 Draft', badgeColor: 'bg-yellow-100 text-yellow-700' },
          { href: '/admin/user', icon: 'manage_accounts', label: 'Kelola User', badge: '248 User', badgeColor: 'bg-green-100 text-green-700' },
        ].map(item => {
          const isRestricted = user?.role === 'psikolog' && (item.label === 'Kelola Berita' || item.label === 'Kelola User');

          if (isRestricted) {
            return (
              <div key={item.href} title="Akses Khusus Admin" className="bg-[#f6f6f8] rounded-xl border border-[#dbdfe6] p-5 opacity-60 cursor-not-allowed relative">
                <div className="absolute top-4 right-4 text-[#dbdfe6]">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white text-[#616f89] border border-[#dbdfe6] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <p className="font-bold text-[#616f89] text-sm">{item.label}</p>
                <span className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                  Terkunci
                </span>
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-xl border border-[#dbdfe6] p-5 hover:shadow-md hover:border-[#135bec]/40 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-[#ebf1fd] text-[#135bec] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                </div>
                <p className="font-bold text-[#111318] text-sm">{item.label}</p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
