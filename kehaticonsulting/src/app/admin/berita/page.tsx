'use client';

import { useState } from 'react';
import { mockArticles, formatDateShort } from '@/lib/mockData';
import { Article } from '@/lib/types';

export default function AdminBeritaPage() {
  const [articles, setArticles] = useState(mockArticles);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ judul: '', konten: '', kategori: '', status: 'draft' });

  const handleDelete = (id: string) => {
    if (confirm('Hapus artikel ini?')) setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleToggle = (id: string) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'published' ? 'draft' : 'published' as any } : a
    ));
  };

  const handleAdd = () => {
    const newArticle: Article = {
      id: `art_${Date.now()}`,
      judul: form.judul,
      konten: form.konten,
      kategori: form.kategori,
      status: form.status as 'draft' | 'published',
      author_id: 'usr_admin01',
      created_at: new Date().toISOString(),
      read_time: Math.ceil(form.konten.split(' ').length / 200) || 3,
    };
    setArticles(prev => [newArticle, ...prev]);
    setShowModal(false);
    setForm({ judul: '', konten: '', kategori: '', status: 'draft' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111318]">Kelola Berita</h1>
          <p className="text-[#616f89] text-sm mt-1">Buat, edit, dan kelola konten artikel portal KEHATI.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-all hover:shadow-md">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Artikel Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Artikel', value: articles.length, icon: 'article', color: 'text-[#135bec]' },
          { label: 'Published', value: articles.filter(a => a.status === 'published').length, icon: 'public', color: 'text-green-600' },
          { label: 'Draft', value: articles.filter(a => a.status === 'draft').length, icon: 'edit_note', color: 'text-yellow-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#dbdfe6] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f6f6f8] flex items-center justify-center">
              <span className={`material-symbols-outlined text-[22px] ${s.color}`}>{s.icon}</span>
            </div>
            <div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#616f89]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-[#dbdfe6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f6f8] border-b border-[#dbdfe6]">
                {['Judul', 'Kategori', 'Status', 'Tanggal', 'Baca', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#616f89] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b border-[#f6f6f8] hover:bg-[#f6f6f8] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {article.thumbnail_url && (
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#f6f6f8] shrink-0">
                          <img src={article.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <p className="font-semibold text-[#111318] line-clamp-2 text-sm">{article.judul}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 bg-[#ebf1fd] text-[#135bec] rounded-full">{article.kategori}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(article.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}>
                      <span className="material-symbols-outlined text-[12px]">{article.status === 'published' ? 'public' : 'edit_note'}</span>
                      {article.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#616f89]">
                    {article.published_at ? formatDateShort(article.published_at) : formatDateShort(article.created_at)}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#616f89]">{article.read_time} mnt</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-[#616f89] hover:text-[#135bec] hover:bg-[#ebf1fd] transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(article.id)}
                        className="p-1.5 rounded-lg text-[#616f89] hover:text-red-600 hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-[#dbdfe6]">
              <h3 className="font-bold text-[#111318]">Artikel Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-[#616f89] hover:text-[#111318]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Judul *</label>
                <input type="text" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))}
                  placeholder="Judul artikel"
                  className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Kategori</label>
                  <input type="text" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))}
                    placeholder="Kesehatan, Kegiatan..."
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#616f89] mb-1.5 block">Konten *</label>
                <textarea value={form.konten} onChange={e => setForm(f => ({ ...f, konten: e.target.value }))}
                  rows={5} placeholder="Isi konten artikel..."
                  className="w-full px-3 py-2 rounded-lg border border-[#dbdfe6] text-sm focus:outline-none focus:border-[#135bec] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={handleAdd}
                className="flex-1 bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Simpan Artikel
              </button>
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-[#dbdfe6] text-[#616f89] rounded-xl text-sm font-semibold hover:bg-[#f6f6f8]">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
