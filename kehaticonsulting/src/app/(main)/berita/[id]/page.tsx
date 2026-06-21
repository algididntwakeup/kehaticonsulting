'use client';

import Link from 'next/link';
import { mockArticles, formatDate } from '@/lib/mockData';
import { notFound } from 'next/navigation';

export default function BeritaDetailPage({ params }: { params: { id: string } }) {
  const article = mockArticles.find(a => a.id === params.id && a.status === 'published');
  if (!article) notFound();

  const related = mockArticles.filter(a => a.id !== article.id && a.status === 'published').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Article Content */}
        <div className="lg:col-span-2 animate-fade-in">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#616f89] mb-6">
            <Link href="/berita" className="hover:text-[#135bec] transition-colors">Berita</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#111318] font-medium line-clamp-1">{article.judul}</span>
          </nav>

          {/* Thumbnail */}
          {article.thumbnail_url && (
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#f6f6f8] mb-6">
              <img src={article.thumbnail_url} alt={article.judul} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-bold text-[#135bec] bg-[#ebf1fd] px-3 py-1 rounded-full uppercase tracking-wider">{article.kategori}</span>
            <span className="flex items-center gap-1 text-xs text-[#616f89]">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              {article.published_at ? formatDate(article.published_at) : '-'}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#616f89]">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {article.read_time} menit baca
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111318] mb-6 leading-tight">{article.judul}</h1>

          {/* Content */}
          <div
            className="prose prose-blue max-w-none text-[#111318] text-base leading-relaxed [&>p]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4"
            dangerouslySetInnerHTML={{ __html: article.konten + `
              <p>Dalam menjalankan tugas sehari-hari, personel Polri menghadapi berbagai tekanan yang dapat mempengaruhi kesehatan mental. Penting bagi setiap anggota untuk mengenali tanda-tanda masalah psikologis sejak dini.</p>
              <h2>Langkah-Langkah yang Dapat Dilakukan</h2>
              <ul>
                <li>Lakukan skrining kesehatan mental secara rutin melalui aplikasi KEHATI</li>
                <li>Manfaatkan layanan konseling yang tersedia di Biro SDM Polda Jabar</li>
                <li>Bangun komunikasi yang terbuka dengan rekan dan atasan yang dipercaya</li>
                <li>Jaga keseimbangan antara pekerjaan dan kehidupan pribadi</li>
                <li>Istirahat yang cukup dan menjaga pola makan yang sehat</li>
              </ul>
              <p>Untuk informasi lebih lanjut dan pendaftaran layanan konseling, silakan akses menu Skrining di aplikasi KEHATI atau hubungi Biro SDM Polda Jawa Barat.</p>
            ` }}
          />

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-[#dbdfe6] flex items-center gap-4">
            <span className="text-sm font-semibold text-[#616f89]">Bagikan:</span>
            {['share', 'content_copy'].map(icon => (
              <button key={icon} className="p-2 rounded-lg border border-[#dbdfe6] text-[#616f89] hover:border-[#135bec] hover:text-[#135bec] transition-colors">
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
              </button>
            ))}
          </div>

          {/* Back */}
          <div className="mt-6">
            <Link href="/berita">
              <button className="flex items-center gap-2 text-sm font-semibold text-[#135bec] hover:underline">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Kembali ke Daftar Berita
              </button>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* CTA Skrining */}
          <div className="bg-gradient-to-br from-[#135bec] to-[#0e45b5] rounded-xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-[40px] mb-3 block">psychology</span>
              <h3 className="font-bold text-lg mb-2">Butuh Dukungan?</h3>
              <p className="text-blue-100 text-sm mb-4">Mulai skrining kesehatan mental atau booking sesi konseling sekarang.</p>
              <Link href="/skrining">
                <button className="w-full bg-white text-[#135bec] font-bold py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                  Mulai Skrining
                </button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          </div>

          {/* Related Articles */}
          <div className="bg-white rounded-xl border border-[#dbdfe6] p-5">
            <h3 className="font-bold text-[#111318] mb-4">Artikel Terkait</h3>
            <div className="flex flex-col gap-4">
              {related.map(a => (
                <Link key={a.id} href={`/berita/${a.id}`}>
                  <div className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-14 rounded-lg overflow-hidden bg-[#f6f6f8] shrink-0">
                      {a.thumbnail_url ? (
                        <img src={a.thumbnail_url} alt={a.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#dbdfe6]">
                          <span className="material-symbols-outlined">article</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#135bec] mb-1 uppercase">{a.kategori}</p>
                      <h4 className="text-sm font-semibold text-[#111318] line-clamp-2 group-hover:text-[#135bec] transition-colors leading-snug">{a.judul}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
