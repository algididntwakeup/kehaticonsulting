'use client';

import { useState } from 'react';
import { mockUsers } from '@/lib/mockData';
import { User } from '@/lib/types';

export default function AdminUserPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');

  const filtered = users
    .filter(u => filterRole === 'semua' || u.role === filterRole)
    .filter(u =>
      u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      u.nrp.includes(search) ||
      u.satker.toLowerCase().includes(search.toLowerCase())
    );

  const handleRoleChange = (id: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole as any } : u));
  };

  const handleToggleActive = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  const roleColor: Record<string, string> = {
    personel:  'bg-blue-100 text-blue-700',
    admin:     'bg-purple-100 text-purple-700',
    psikolog:  'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111318]">Kelola User</h1>
        <p className="text-[#616f89] text-sm mt-1">Lihat daftar semua pengguna, ubah role, dan status akun.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total User', value: users.length, color: 'text-[#135bec]' },
          { label: 'Personel', value: users.filter(u => u.role === 'personel').length, color: 'text-blue-600' },
          { label: 'Admin', value: users.filter(u => u.role === 'admin').length, color: 'text-purple-600' },
          { label: 'Psikolog', value: users.filter(u => u.role === 'psikolog').length, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#dbdfe6] p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#616f89] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[18px]">search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, NRP, atau satker..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#dbdfe6] text-sm text-[#111318] focus:outline-none focus:border-[#135bec] bg-white" />
        </div>
        <div className="flex gap-2">
          {['semua', 'personel', 'admin', 'psikolog'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                filterRole === r
                  ? 'bg-[#135bec] text-white'
                  : 'bg-white border border-[#dbdfe6] text-[#616f89] hover:text-[#135bec] hover:border-[#135bec]/40'
              }`}>
              {r === 'semua' ? 'Semua' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#dbdfe6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f6f8] border-b border-[#dbdfe6]">
                {['Pengguna', 'NRP', 'Satker', 'Role', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-[#f6f6f8] hover:bg-[#f6f6f8] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'psikolog' ? 'bg-green-100 text-green-700' :
                        'bg-[#ebf1fd] text-[#135bec]'
                      }`}>
                        {u.nama_lengkap.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[#111318] text-sm">{u.nama_lengkap}</p>
                        <p className="text-xs text-[#616f89]">{u.pangkat}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-[#616f89]">{u.nrp}</td>
                  <td className="px-4 py-3 text-sm text-[#616f89] max-w-[160px] truncate">{u.satker}</td>
                  <td className="px-4 py-3">
                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-lg border-0 cursor-pointer ${roleColor[u.role]}`}>
                      <option value="personel">Personel</option>
                      <option value="admin">Admin</option>
                      <option value="psikolog">Psikolog</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-[#616f89] hover:text-[#135bec] hover:bg-[#ebf1fd] transition-colors">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => handleToggleActive(u.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.is_active
                            ? 'text-[#616f89] hover:text-red-600 hover:bg-red-50'
                            : 'text-[#616f89] hover:text-green-600 hover:bg-green-50'
                        }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {u.is_active ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#f6f6f8] text-xs text-[#616f89]">
          Menampilkan {filtered.length} dari {users.length} pengguna
        </div>
      </div>
    </div>
  );
}
