'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const sidebarLinks = [
  { href: '/admin/dashboard', label: 'Dashboard',    icon: 'dashboard' },
  { href: '/admin/skrining',  label: 'Skrining',     icon: 'psychology' },
  { href: '/admin/jadwal',    label: 'Jadwal',        icon: 'calendar_month' },
  { href: '/admin/berita',    label: 'Berita',        icon: 'article' },
  { href: '/admin/user',      label: 'Kelola User',  icon: 'manage_accounts' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className={`flex flex-col h-screen sticky top-0 bg-white border-r border-[#dbdfe6] transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[#dbdfe6]">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#135bec] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
            </div>
            <span className="text-base font-bold text-[#135bec]">KEHATI</span>
            <span className="text-xs font-semibold text-[#616f89] bg-[#f6f6f8] px-1.5 py-0.5 rounded">Admin</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#135bec] transition-colors ml-auto"
        >
          <span className="material-symbols-outlined text-[20px]">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {sidebarLinks.map(link => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                active
                  ? 'bg-[#ebf1fd] text-[#135bec]'
                  : 'text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#111318]'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <span className={`material-symbols-outlined text-[20px] shrink-0 ${active ? '' : ''}`}>
                {link.icon}
              </span>
              {!collapsed && <span className="truncate">{link.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#135bec]"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-4 pb-2">
        <div className="border-t border-[#dbdfe6] pt-4">
          {/* Back to main app */}
          <Link href="/dashboard" title="Kembali ke Aplikasi"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#111318] transition-colors mb-1 ${collapsed ? 'justify-center' : ''}`}>
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            {!collapsed && 'Kembali'}
          </Link>

          {/* User info */}
          {!collapsed && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f6f6f8] mb-2">
              <div className="w-8 h-8 rounded-full bg-[#135bec] text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user?.nama_lengkap?.charAt(0) ?? 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#111318] truncate">{user?.nama_lengkap?.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-[10px] text-[#616f89] capitalize">{user?.role}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Keluar"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {!collapsed && 'Keluar'}
          </button>
        </div>
      </div>
    </aside>
  );
}
