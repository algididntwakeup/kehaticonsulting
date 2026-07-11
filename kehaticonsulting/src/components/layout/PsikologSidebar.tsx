'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const sidebarLinks = [
  { href: '/psikolog/dashboard', label: 'Dashboard',    icon: 'dashboard' },
  { href: '/admin/skrining',     label: 'Review Jadwal', icon: 'psychology' },
  { href: '/admin/jadwal',       label: 'Jadwal Saya',   icon: 'calendar_month' },
];

export default function PsikologSidebar() {
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
          <Link href="/psikolog/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#135bec] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
            </div>
            <span className="text-base font-bold text-[#135bec]">KEHATI</span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Psikolog</span>
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
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {sidebarLinks.map(link => {
          const isActive = pathname === link.href || (link.href !== '/psikolog/dashboard' && pathname.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#ebf1fd] text-[#135bec]'
                    : 'text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#135bec]'
                }`}
                title={collapsed ? link.label : ''}
              >
                <span className={`material-symbols-outlined text-[20px] transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {link.icon}
                </span>
                {!collapsed && link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#dbdfe6] p-3">
        <Link href="/dashboard">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#616f89] hover:bg-[#f6f6f8] hover:text-[#135bec] transition-colors font-medium" title={collapsed ? 'Beranda' : ''}>
            <span className="material-symbols-outlined text-[20px]">home</span>
            {!collapsed && 'Beranda Personel'}
          </div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium mt-1"
          title={collapsed ? 'Keluar' : ''}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          {!collapsed && 'Keluar'}
        </button>
        {!collapsed && (
          <div className="px-3 mt-3">
            <p className="text-xs font-semibold text-[#111318] truncate">{user?.nama_lengkap}</p>
            <p className="text-[10px] text-[#616f89]">NRP: {user?.nrp}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
