'use client';

import { useState } from 'react';
import { mockSlots, mockPsikolog } from '@/lib/mockData';
import { Slot } from '@/lib/types';

export default function AdminJadwalPage() {
  const [showModal, setShowModal] = useState(false);
  const [slots, setSlots] = useState(mockSlots);
  const [form, setForm] = useState({
    psikolog_id: '', tanggal: '', jam_mulai: '', jam_selesai: '', metode: 'daring', lokasi: '',
  });

  const statusColor: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    booked:    'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-gray-100 text-gray-700',
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short'
  });

  const handleAddSlot = () => {
    if (!form.psikolog_id || !form.tanggal || !form.jam_mulai || !form.jam_selesai) return;
    const psikolog = mockPsikolog.find(p => p.id === form.psikolog_id)!;
    const newSlot: Slot = {
      id: `slot_new_${Date.now()}`,
      psikolog,
      tanggal: form.tanggal,
      jam_mulai: form.jam_mulai,
      jam_selesai: form.jam_selesai,
      metode: form.metode as 'daring' | 'luring',
      kapasitas: 1,
      lokasi: form.lokasi,
      status: 'available',
    };
    setSlots(prev => [...prev, newSlot]);
    setShowModal(false);
    setForm({ psikolog_id: '', tanggal: '', jam_mulai: '', jam_selesai: '', metode: 'daring', lokasi: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus slot ini?')) setSlots(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111318]">Kelola Jadwal</h1>
          <p className="text-[#616f89] text-sm mt-1">Tambah, edit, atau hapus slot jadwal konseling.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all hover:shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Slot
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Slot', value: slots.length, color: 'text-[#135bec]' },
          { label: 'Available', value: slots.filter(s => s.status === 'available').length, color: 'text-green-600' },
          { label: 'Booked', value: slots.filter(s => s.status === 'booked').length, color: 'text-blue-600' },
          { label: 'Completed', value: slots.filter(s => s.status === 'completed').length, color: 'text-gray-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#dbdfe6] p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[#616f89] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#dbdfe6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f6f8] border-b border-[#dbdfe6]">
                {['Psikolog', 'Tanggal', 'Waktu', 'Metode', 'Lokasi', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot.id} className="border-b border-[#f6f6f8] hover:bg-[#f6f6f8] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#111318] text-sm">{slot.psikolog.nama}</p>
                    <p className="text-xs text-[#616f89]">{slot.psikolog.spesialis}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#111318] font-medium">{formatDate(slot.tanggal)}</td>
                  <td className="px-4 py-3 text-sm font-bold text-[#111318]">{slot.jam_mulai} – {slot.jam_selesai}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${slot.metode === 'daring' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {slot.metode.charAt(0).toUpperCase() + slot.metode.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#616f89] max-w-[160px] truncate">{slot.lokasi}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor[slot.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg text-[#616f89] hover:text-[#135bec] hover:bg-[#ebf1fd] transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      {slot.status === 'available' && (
                        <button onClick={() => handleDelete(slot.id)}
                          className="p-1.5 rounded-lg text-[#616f89] hover:text-red-600 hover:bg-red-50 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-[#dbdfe6]">
              <h3 className="font-bold text-[#111318]">Tambah Slot Jadwal</h3>
              <button onClick={() => setShowModal(false)} className="text-[#616f89] hover:text-[#111318]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Psikolog</label>
                <select value={form.psikolog_id} onChange={e => setForm(f => ({ ...f, psikolog_id: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white">
                  <option value="">Pilih Psikolog</option>
                  {mockPsikolog.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm(f => ({ ...f, tanggal: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Metode</label>
                  <select value={form.metode} onChange={e => setForm(f => ({ ...f, metode: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white">
                    <option value="daring">Daring</option>
                    <option value="luring">Luring</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Jam Mulai</label>
                  <input type="time" value={form.jam_mulai} onChange={e => setForm(f => ({ ...f, jam_mulai: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Jam Selesai</label>
                  <input type="time" value={form.jam_selesai} onChange={e => setForm(f => ({ ...f, jam_selesai: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Lokasi / Link</label>
                <input type="text" value={form.lokasi} onChange={e => setForm(f => ({ ...f, lokasi: e.target.value }))}
                  placeholder="Google Meet / Ruang Konseling Lt.2"
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec]" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={handleAddSlot}
                className="flex-1 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Simpan Slot
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-[#dbdfe6] text-[#616f89] rounded-xl text-sm font-semibold hover:bg-[#f6f6f8] transition-all">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
