'use client';

import { useState } from 'react';
import { mockScreenings, getRisikoColor, getValidationColor, formatDateShort } from '@/lib/mockData';
import { Screening } from '@/lib/types';

export default function AdminSkriningPage() {
  const [filter, setFilter] = useState<string>('semua');
  const [selected, setSelected] = useState<Screening | null>(null);
  const [catatan, setCatatan] = useState('');

  const filtered = filter === 'semua'
    ? mockScreenings
    : mockScreenings.filter(s => s.validation_status === filter || s.level_risiko === filter);

  const handleValidate = (status: string) => {
    alert(`Skrining divalidasi: ${status}\nCatatan: ${catatan}`);
    setSelected(null);
    setCatatan('');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111318]">Kelola Skrining</h1>
        <p className="text-[#616f89] text-sm mt-1">Validasi dan tindak lanjut hasil skrining personel.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['semua', 'pending', 'approved', 'referred', 'rendah', 'sedang', 'tinggi'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === f
                ? 'bg-[#135bec] text-white'
                : 'bg-white border border-[#dbdfe6] text-[#616f89] hover:border-[#135bec]/40 hover:text-[#135bec]'
            }`}>
            {f === 'semua' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#dbdfe6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#dbdfe6] bg-[#f6f6f8]">
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Personel</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Skor</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Risiko</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Tanggal</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(sk => (
                    <tr key={sk.id} className={`border-b border-[#f6f6f8] hover:bg-[#f6f6f8] transition-colors ${selected?.id === sk.id ? 'bg-[#ebf1fd]' : ''}`}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-bold text-[#111318] text-sm">{sk.user?.nama_lengkap ?? 'Personel'}</p>
                          <p className="text-xs text-[#616f89]">NRP: {sk.user?.nrp} · {sk.user?.satker?.split(' ').slice(0, 2).join(' ')}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-black text-[#111318]">{sk.skor_total}</span>
                        <span className="text-xs text-[#616f89]">/63</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getRisikoColor(sk.level_risiko)}`}>
                          {sk.level_risiko.charAt(0).toUpperCase() + sk.level_risiko.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getValidationColor(sk.validation_status)}`}>
                          {sk.validation_status.charAt(0).toUpperCase() + sk.validation_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#616f89]">{formatDateShort(sk.submitted_at)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setSelected(sk); setCatatan(''); }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#ebf1fd] text-[#135bec] rounded-lg text-xs font-bold hover:bg-[#135bec] hover:text-white transition-all">
                          <span className="material-symbols-outlined text-[14px]">rate_review</span>
                          Tinjau
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Validation Panel */}
        <div>
          {selected ? (
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-5 sticky top-6 animate-fade-in">
              <h3 className="font-bold text-[#111318] mb-4 flex items-center justify-between">
                Validasi Skrining
                <button onClick={() => setSelected(null)} className="text-[#616f89] hover:text-[#111318]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </h3>

              <div className="p-3 bg-[#f6f6f8] rounded-lg mb-4">
                <p className="font-bold text-[#111318] text-sm">{selected.user?.nama_lengkap}</p>
                <p className="text-xs text-[#616f89]">NRP: {selected.user?.nrp}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getRisikoColor(selected.level_risiko)}`}>
                    Risiko {selected.level_risiko.charAt(0).toUpperCase() + selected.level_risiko.slice(1)}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ebf1fd] text-[#135bec]">
                    Skor: {selected.skor_total}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Catatan Admin</label>
                <textarea value={catatan} onChange={e => setCatatan(e.target.value)} rows={3}
                  placeholder="Tambahkan catatan untuk personel..."
                  className="w-full rounded-lg border border-[#dbdfe6] bg-[#f6f6f8] text-[#111318] text-sm p-3 resize-none focus:outline-none focus:border-[#135bec] transition-all" />
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => handleValidate('approved')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Approved — Izinkan Booking
                </button>
                <button onClick={() => handleValidate('referred')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">forward</span>
                  Referred — Surat Rujukan
                </button>
                <button onClick={() => handleValidate('rejected')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  Rejected
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#dbdfe6] p-6 text-center">
              <span className="material-symbols-outlined text-[48px] text-[#dbdfe6] mb-3 block">touch_app</span>
              <p className="text-sm text-[#616f89]">Pilih skrining untuk ditinjau dan divalidasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
