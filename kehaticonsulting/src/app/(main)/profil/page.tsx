'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProfilPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    email: user?.email ?? '',
    unit: user?.unit ?? '',
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const infoItems = [
    { label: 'NRP', value: user?.nrp, icon: 'badge' },
    { label: 'Nama Lengkap', value: user?.nama_lengkap, icon: 'person' },
    { label: 'Pangkat', value: user?.pangkat, icon: 'stars' },
    { label: 'Satuan Kerja', value: user?.satker, icon: 'local_police' },
    { label: 'Unit', value: user?.unit || '-', icon: 'business' },
    { label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '-', icon: 'shield' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#111318]">Profil Saya</h1>
        <p className="text-[#616f89] mt-2">Kelola informasi akun dan pengaturan privasi Anda.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Avatar + Quick Actions */}
        <div className="flex flex-col gap-5 animate-fade-in">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-[#dbdfe6] p-6 text-center shadow-sm">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#135bec] to-[#0e45b5] text-white flex items-center justify-center text-4xl font-black mx-auto shadow-lg shadow-blue-500/20">
                {user?.nama_lengkap?.charAt(0) ?? 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-[#dbdfe6] rounded-full flex items-center justify-center hover:border-[#135bec] transition-colors">
                <span className="material-symbols-outlined text-[14px] text-[#616f89]">edit</span>
              </button>
            </div>
            <h2 className="font-bold text-[#111318] text-base">{user?.nama_lengkap}</h2>
            <p className="text-[#616f89] text-sm mt-0.5">{user?.pangkat}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#ebf1fd] text-[#135bec] rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-[#dbdfe6] p-5">
            <h3 className="font-bold text-[#111318] mb-3 text-sm">Menu Cepat</h3>
            <div className="flex flex-col gap-1">
              {[
                { icon: 'psychology', label: 'Skrining Baru', href: '/skrining', color: 'text-[#135bec]' },
                { icon: 'history', label: 'Riwayat Saya', href: '/riwayat', color: 'text-[#616f89]' },
                { icon: 'confirmation_number', label: 'Tiket Aktif', href: '/riwayat', color: 'text-green-600' },
              ].map(item => (
                <a key={item.label} href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#111318] transition-colors">
                  <span className={`material-symbols-outlined text-[18px] ${item.color}`}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-5">
            <h3 className="font-bold text-red-700 mb-3 text-sm">Keluar</h3>
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Keluar dari KEHATI
            </button>
          </div>
        </div>

        {/* Right: Info + Edit */}
        <div className="lg:col-span-2 flex flex-col gap-6 animate-slide-in">
          {/* Profile Info */}
          <div className="bg-white rounded-2xl border border-[#dbdfe6] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#111318]">Informasi Akun</h3>
              <button onClick={() => setEditing(!editing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  editing ? 'bg-[#f6f6f8] text-[#616f89]' : 'bg-[#ebf1fd] text-[#135bec] hover:bg-[#135bec] hover:text-white'
                }`}>
                <span className="material-symbols-outlined text-[16px]">{editing ? 'close' : 'edit'}</span>
                {editing ? 'Batal' : 'Edit Profil'}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {infoItems.map(item => (
                <div key={item.label}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#616f89] mb-1.5">
                    <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                    {item.label}
                  </label>
                  <p className="text-sm font-semibold text-[#111318] bg-[#f6f6f8] px-3 py-2.5 rounded-lg">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Editable fields */}
            <div className="grid sm:grid-cols-2 gap-5 mt-5 pt-5 border-t border-[#f6f6f8]">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#616f89] mb-1.5">
                  <span className="material-symbols-outlined text-[14px]">email</span>
                  Email (opsional)
                </label>
                {editing ? (
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@polri.go.id"
                    className="w-full text-sm text-[#111318] bg-white border border-[#dbdfe6] px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#135bec] transition-all" />
                ) : (
                  <p className="text-sm font-semibold text-[#111318] bg-[#f6f6f8] px-3 py-2.5 rounded-lg">{form.email || '-'}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm shadow-blue-500/20 hover:shadow-md flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan Perubahan
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-[#dbdfe6] rounded-xl text-sm font-semibold text-[#616f89] hover:bg-[#f6f6f8] transition-all">
                  Batal
                </button>
              </div>
            )}
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-[#dbdfe6] p-6 shadow-sm">
            <h3 className="font-bold text-[#111318] mb-5">Ganti Password</h3>
            <div className="flex flex-col gap-4">
              {['Password Lama', 'Password Baru', 'Konfirmasi Password Baru'].map(label => (
                <div key={label}>
                  <label className="text-xs font-semibold text-[#616f89] mb-1.5 block">{label}</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••"
                      className="w-full text-sm text-[#111318] bg-[#f6f6f8] border border-[#dbdfe6] pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:border-[#135bec] focus:bg-white transition-all" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616f89] hover:text-[#111318]">
                      <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2">
                <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                Ganti Password
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-[#ebf1fd] border border-[#135bec]/20 rounded-xl p-4 text-sm text-[#616f89]">
            <p className="font-bold text-[#135bec] mb-1.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">privacy_tip</span>
              Privasi & Keamanan Data
            </p>
            <p className="text-xs leading-relaxed">
              Data pribadi dan hasil skrining Anda dilindungi sesuai kebijakan kerahasiaan KEHATI. Informasi Anda hanya dapat diakses oleh konselor yang bertugas dan tidak dibagikan kepada pihak ketiga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
