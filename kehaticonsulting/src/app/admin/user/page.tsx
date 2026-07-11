'use client';

import { useState } from 'react';
import { mockUsers, pangkatOptions, satkerOptions } from '@/lib/mockData';
import { User } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [confirmStatusUser, setConfirmStatusUser] = useState<User | null>(null);
  const [confirmRoleData, setConfirmRoleData] = useState<{ user: User; newRole: string } | null>(null);

  // Form State for Adding User
  const [addForm, setAddForm] = useState({
    nrp: '',
    nama_lengkap: '',
    pangkat: pangkatOptions[0],
    satker: satkerOptions[0],
    unit: '',
    password: '',
    role: 'psikolog' as 'admin' | 'psikolog',
  });

  const filtered = users
    .filter(u => filterRole === 'semua' || u.role === filterRole)
    .filter(u =>
      u.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
      u.nrp.includes(search) ||
      u.satker.toLowerCase().includes(search.toLowerCase())
    );

  const handleRoleChangeRequest = (user: User, newRole: string) => {
    setConfirmRoleData({ user, newRole });
  };

  const handleConfirmRoleChange = () => {
    if (!confirmRoleData) return;
    const { user, newRole } = confirmRoleData;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole as any } : u));
    toast.success(`Peran ${user.nama_lengkap} berhasil diubah menjadi ${newRole.toUpperCase()}`);
    setConfirmRoleData(null);
  };

  const handleToggleActiveRequest = (user: User) => {
    setConfirmStatusUser(user);
  };

  const handleConfirmToggleActive = () => {
    if (!confirmStatusUser) return;
    const user = confirmStatusUser;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    toast.success(`Akun ${user.nama_lengkap} berhasil ${user.is_active ? 'dinonaktifkan' : 'diaktifkan'}`);
    setConfirmStatusUser(null);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.nrp || !addForm.nama_lengkap || !addForm.password) {
      toast.error('NRP, Nama Lengkap, dan Password wajib diisi');
      return;
    }

    const newUser: User = {
      id: `usr_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      nrp: addForm.nrp,
      nama_lengkap: addForm.nama_lengkap,
      pangkat: addForm.pangkat,
      satker: addForm.satker,
      unit: addForm.unit || undefined,
      role: addForm.role,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setUsers(prev => [newUser, ...prev]);
    toast.success(`User ${newUser.role.toUpperCase()} baru berhasil didaftarkan`);
    setShowAddModal(false);
    setAddForm({
      nrp: '',
      nama_lengkap: '',
      pangkat: pangkatOptions[0],
      satker: satkerOptions[0],
      unit: '',
      password: '',
      role: 'psikolog',
    });
  };

  const roleColor: Record<string, string> = {
    personel:  'bg-blue-100 text-blue-700',
    admin:     'bg-purple-100 text-purple-700',
    psikolog:  'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#111318]">Kelola User</h1>
          <p className="text-[#616f89] text-sm mt-1">Lihat daftar semua pengguna, ubah role, dan status akun.</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all hover:shadow-md">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Tambah Admin/Psikolog
        </button>
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
                    <select value={u.role} onChange={e => handleRoleChangeRequest(u, e.target.value)}
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
                      <button onClick={() => setDetailUser(u)}
                        className="p-1.5 rounded-lg text-[#616f89] hover:text-[#135bec] hover:bg-[#ebf1fd] transition-colors"
                        title="Lihat Detail User">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => handleToggleActiveRequest(u)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.is_active
                            ? 'text-[#616f89] hover:text-red-600 hover:bg-red-50'
                            : 'text-[#616f89] hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={u.is_active ? "Nonaktifkan Akun" : "Aktifkan Akun"}>
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

      {/* MODAL: TAMBAH USER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleAddUserSubmit} className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#dbdfe6]">
              <h3 className="font-bold text-[#111318]">Tambah Akun Baru</h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-[#616f89] hover:text-[#111318]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">NRP *</label>
                <input type="text" value={addForm.nrp} onChange={e => setAddForm(f => ({ ...f, nrp: e.target.value }))}
                  placeholder="Masukkan NRP..."
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]" required />
              </div>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Nama Lengkap *</label>
                <input type="text" value={addForm.nama_lengkap} onChange={e => setAddForm(f => ({ ...f, nama_lengkap: e.target.value }))}
                  placeholder="Nama Lengkap beserta gelar..."
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Pangkat</label>
                  <select value={addForm.pangkat} onChange={e => setAddForm(f => ({ ...f, pangkat: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]">
                    {pangkatOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Role Peran</label>
                  <select value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value as any }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]">
                    <option value="psikolog">Psikolog</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Satuan Kerja (Satker)</label>
                <select value={addForm.satker} onChange={e => setAddForm(f => ({ ...f, satker: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]">
                  {satkerOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Unit (opsional)</label>
                <input type="text" value={addForm.unit} onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}
                  placeholder="Misal: Bag Psikologi, Reskrim..."
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Password Baru *</label>
                <input type="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Masukkan password akun..."
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white text-[#111318]" required />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-[#dbdfe6] bg-[#f6f6f8]">
              <button type="submit"
                className="flex-1 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Simpan Akun
              </button>
              <button type="button" onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-[#dbdfe6] text-[#616f89] rounded-xl text-sm font-semibold hover:bg-white bg-white">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: DETAIL USER */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#dbdfe6] bg-[#ebf1fd]">
              <h3 className="font-bold text-[#135bec] flex items-center gap-1.5">
                <span className="material-symbols-outlined">account_box</span>
                Profil Pengguna
              </h3>
              <button onClick={() => setDetailUser(null)} className="text-[#616f89] hover:text-[#111318]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-[#dbdfe6]">
                <div className="w-12 h-12 rounded-full bg-[#135bec] text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {detailUser.nama_lengkap.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#111318] text-base">{detailUser.nama_lengkap}</h4>
                  <p className="text-xs text-[#616f89]">{detailUser.pangkat}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                <div>
                  <p className="text-xs text-[#616f89]">NRP</p>
                  <p className="font-bold text-[#111318]">{detailUser.nrp}</p>
                </div>
                <div>
                  <p className="text-xs text-[#616f89]">Peran / Role</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5 ${roleColor[detailUser.role]}`}>
                    {detailUser.role}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#616f89]">Satuan Kerja (Satker)</p>
                  <p className="font-bold text-[#111318]">{detailUser.satker}</p>
                </div>
                <div>
                  <p className="text-xs text-[#616f89]">Unit</p>
                  <p className="font-bold text-[#111318]">{detailUser.unit || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#616f89]">Status Akun</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 ${detailUser.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {detailUser.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-[#616f89]">Terdaftar Pada</p>
                  <p className="font-semibold text-[#616f89]">{new Date(detailUser.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-[#f6f6f8] border-t border-[#dbdfe6] text-right">
              <button onClick={() => setDetailUser(null)} className="px-5 py-2 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold text-xs rounded-lg transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI STATUS AKUN */}
      {confirmStatusUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in overflow-hidden">
            <div className="p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-yellow-500 mb-2">warning</span>
              <h3 className="font-bold text-[#111318] text-base mb-1">Ubah Status Akun?</h3>
              <p className="text-xs text-[#616f89] leading-relaxed">
                Apakah Anda yakin ingin {confirmStatusUser.is_active ? 'menonaktifkan' : 'mengaktifkan'} akun <strong>{confirmStatusUser.nama_lengkap}</strong>?
              </p>
            </div>
            <div className="flex gap-2 p-4 bg-[#f6f6f8] border-t border-[#dbdfe6]">
              <button onClick={handleConfirmToggleActive} className="flex-1 py-2 rounded-lg text-white font-bold bg-[#135bec] hover:bg-[#0e45b5] text-xs transition-colors">
                Ya, Ubah Status
              </button>
              <button onClick={() => setConfirmStatusUser(null)} className="flex-1 py-2 rounded-lg border border-[#dbdfe6] text-[#616f89] font-bold bg-white hover:bg-gray-50 text-xs transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: KONFIRMASI ROLE AKUN */}
      {confirmRoleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm animate-fade-in overflow-hidden">
            <div className="p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-purple-500 mb-2">swap_horiz</span>
              <h3 className="font-bold text-[#111318] text-base mb-1">Ubah Peran Pengguna?</h3>
              <p className="text-xs text-[#616f89] leading-relaxed">
                Apakah Anda yakin ingin mengubah peran <strong>{confirmRoleData.user.nama_lengkap}</strong> menjadi <strong className="text-purple-700">{confirmRoleData.newRole.toUpperCase()}</strong>?
              </p>
            </div>
            <div className="flex gap-2 p-4 bg-[#f6f6f8] border-t border-[#dbdfe6]">
              <button onClick={handleConfirmRoleChange} className="flex-1 py-2 rounded-lg text-white font-bold bg-[#135bec] hover:bg-[#0e45b5] text-xs transition-colors">
                Ya, Ubah Peran
              </button>
              <button onClick={() => setConfirmRoleData(null)} className="flex-1 py-2 rounded-lg border border-[#dbdfe6] text-[#616f89] font-bold bg-white hover:bg-gray-50 text-xs transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
