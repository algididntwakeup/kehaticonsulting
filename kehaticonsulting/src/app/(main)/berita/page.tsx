'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mockArticles, formatDateShort } from '@/lib/mockData';

const kategoriList = ['Semua', 'Kesehatan', 'Program SDM', 'Kegiatan', 'Edukasi', 'Panduan'];

export default function BeritaPage() {
  const [query, setQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  const articles = mockArticles
    .filter(a => a.status === 'published')
    .filter(a => selectedKategori === 'Semua' || a.kategori === selectedKategori)
    .filter(a => a.judul.toLowerCase().includes(query.toLowerCase()));

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#111318]">Berita & Informasi SDM</h1>
        <p className="text-[#616f89] mt-2">Informasi terkini seputar kesehatan mental dan pengembangan SDM Polda Jawa Barat.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">search</span>
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Cari artikel berdasarkan judul..."
            className="w-full h-11 pl-11 pr-4 rounded-lg border border-[#dbdfe6] bg-white text-sm text-[#111318] placeholder:text-[#616f89] focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all"
          />
        </div>
      </div>

      {/* Kategori Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {kategoriList.map(k => (
          <button key={k} onClick={() => setSelectedKategori(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedKategori === k
                ? 'bg-[#135bec] text-white shadow-sm shadow-blue-500/20'
                : 'bg-white border border-[#dbdfe6] text-[#616f89] hover:border-[#135bec]/40 hover:text-[#135bec]'
            }`}>
            {k}
          </button>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center animate-fade-in">
          <span className="material-symbols-outlined text-[60px] text-[#dbdfe6] mb-4">article</span>
          <p className="text-[#616f89] text-lg font-medium">Tidak ada artikel ditemukan</p>
          <p className="text-[#616f89] text-sm mt-1">Coba ubah kata kunci atau kategori pencarian.</p>
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featured && (
            <Link href={`/berita/${featured.id}`}>
              <article className="group mb-8 bg-white rounded-2xl border border-[#dbdfe6] overflow-hidden hover:shadow-md hover:border-[#135bec]/30 transition-all animate-fade-in cursor-pointer">
                <div className="relative h-64 sm:h-80 overflow-hidden bg-[#f6f6f8]">
                  {featured.thumbnail_url && (
                    <img src={featured.thumbnail_url} alt={featured.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider bg-[#135bec] px-2 py-1 rounded-full w-fit mb-3">{featured.kategori}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-100 transition-colors">{featured.judul}</h2>
                    <div className="flex items-center gap-4 text-xs text-white/70">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{featured.published_at ? formatDateShort(featured.published_at) : '-'}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span>{featured.read_time} menit</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Article Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article, i) => (
              <Link key={article.id} href={`/berita/${article.id}`}>
                <article
                  className="group bg-white rounded-xl border border-[#dbdfe6] overflow-hidden hover:shadow-md hover:border-[#135bec]/30 transition-all h-full animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="h-44 overflow-hidden bg-[#f6f6f8]">
                    {article.thumbnail_url ? (
                      <img src={article.thumbnail_url} alt={article.judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[48px] text-[#dbdfe6]">article</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-bold text-[#135bec] uppercase tracking-wider">{article.kategori}</span>
                    <h3 className="text-base font-bold text-[#111318] mt-2 mb-3 leading-snug line-clamp-2 group-hover:text-[#135bec] transition-colors">{article.judul}</h3>
                    <div className="flex items-center gap-4 text-xs text-[#616f89]">
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{article.published_at ? formatDateShort(article.published_at) : '-'}</span>
                      <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">timer</span>{article.read_time} mnt</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
