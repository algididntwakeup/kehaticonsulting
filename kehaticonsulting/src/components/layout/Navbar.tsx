'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard',   icon: 'dashboard' },
  { href: '/riwayat',   label: 'Riwayat',     icon: 'history' },
  { href: '/berita',    label: 'Berita SDM',  icon: 'article' },
  { href: '/profil',    label: 'Profil',       icon: 'person' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dbdfe6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-[#616f89] hover:text-[#135bec] rounded-lg hover:bg-[#f6f6f8] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#135bec] text-white">
                <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#135bec] hidden sm:block">KEHATI</span>
            </Link>
          </div>

          {/* Center: Nav Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-[#135bec]'
                    : 'text-[#616f89] hover:text-[#135bec]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link href="/skrining">
              <button className="hidden sm:flex items-center gap-2 bg-[#135bec] hover:bg-[#0e45b5] text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                Mulai Skrining
              </button>
            </Link>

            <button className="relative p-2 text-[#616f89] hover:text-[#135bec] transition-colors rounded-lg hover:bg-[#f6f6f8]">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-[#dbdfe6] hidden sm:block"></div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-1 focus:outline-none group"
              >
                <span className="hidden md:block text-right">
                  <span className="block text-sm font-semibold text-[#111318] leading-none">{user?.nama_lengkap?.split(' ').slice(0, 2).join(' ')}</span>
                  <span className="text-xs text-[#616f89] leading-none mt-0.5 block">{user?.satker?.split(' ').slice(0, 2).join(' ')}</span>
                </span>
                <div className="w-9 h-9 rounded-full bg-[#135bec] text-white flex items-center justify-center font-bold text-sm border-2 border-[#ebf1fd] group-hover:border-[#135bec] transition-colors">
                  {user?.nama_lengkap?.charAt(0) ?? 'U'}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#dbdfe6] py-1 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b border-[#dbdfe6]">
                    <p className="text-sm font-bold text-[#111318]">{user?.nama_lengkap}</p>
                    <p className="text-xs text-[#616f89]">NRP: {user?.nrp}</p>
                  </div>
                  <Link href="/profil" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#111318] hover:bg-[#f6f6f8] transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-[#616f89]">person</span>
                    Profil Saya
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin/dashboard" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#111318] hover:bg-[#f6f6f8] transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-[#616f89]">admin_panel_settings</span>
                      Panel Admin
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#dbdfe6] bg-white animate-fade-in">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'bg-[#ebf1fd] text-[#135bec]'
                    : 'text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#135bec]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <Link href="/skrining" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-bold bg-[#135bec] text-white">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              Mulai Skrining
            </Link>
          </nav>
        </div>
      )}

      {/* Click outside to close */}
      {(profileOpen || mobileOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setMobileOpen(false); }} />
      )}
    </header>
  );
}
