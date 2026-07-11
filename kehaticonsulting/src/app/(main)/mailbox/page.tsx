'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getLocalMailbox, markMailboxMessageAsRead } from '@/lib/dataStore';
import { MailboxMessage } from '@/lib/types';

function MailboxContent() {
  const [messages, setMessages] = useState<MailboxMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const queryId = searchParams.get('id');

  useEffect(() => {
    const msgs = getLocalMailbox();
    setMessages(msgs);
    if (queryId && msgs.some(m => m.id === queryId)) {
      setSelectedId(queryId);
      markMailboxMessageAsRead(queryId);
      // Update read status in state
      setMessages(prev => prev.map(m => m.id === queryId ? { ...m, is_read: true } : m));
    } else if (msgs.length > 0) {
      setSelectedId(msgs[0].id);
    }
  }, [queryId]);

  const selectedMsg = messages.find(m => m.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    markMailboxMessageAsRead(id);
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, is_read: true } : m))
    );
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = (type: string) => {
    if (type === 'tiket') return 'confirmation_number';
    if (type === 'rujukan') return 'description';
    return 'mail';
  };

  const getIconColor = (type: string) => {
    if (type === 'tiket') return 'bg-blue-100 text-blue-600';
    if (type === 'rujukan') return 'bg-red-100 text-red-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#135bec] text-white flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[20px]">inbox</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111318]">Kotak Masuk</h1>
          <p className="text-[#616f89] text-sm">Pemberitahuan tiket konseling dan surat rujukan Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dbdfe6] shadow-sm flex flex-col md:flex-row h-[700px] overflow-hidden">
        
        {/* Left Side: Message List */}
        <div className="w-full md:w-1/3 lg:w-2/5 border-b md:border-b-0 md:border-r border-[#dbdfe6] flex flex-col bg-[#fcfcfd]">
          <div className="p-4 border-b border-[#dbdfe6] bg-white shrink-0">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#616f89] text-[18px]">search</span>
              <input
                type="text"
                placeholder="Cari pesan..."
                className="w-full pl-10 pr-4 py-2 bg-[#f6f6f8] border border-[#dbdfe6] rounded-lg text-sm focus:outline-none focus:border-[#135bec] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-[#616f89]">
                <span className="material-symbols-outlined text-[40px] mb-2 text-[#dbdfe6]">inbox</span>
                <p className="text-sm">Kotak masuk kosong.</p>
              </div>
            ) : (
              messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  className={`w-full text-left p-4 border-b border-[#dbdfe6] hover:bg-[#f6f6f8] transition-colors flex gap-3 items-start relative ${
                    selectedId === msg.id ? 'bg-[#ebf1fd]/50 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#135bec]' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconColor(msg.tipe)}`}>
                    <span className="material-symbols-outlined text-[20px]">{getIcon(msg.tipe)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm truncate pr-2 ${!msg.is_read ? 'font-bold text-[#111318]' : 'font-semibold text-[#111318]'}`}>
                        {msg.judul}
                      </p>
                      <span className="text-[10px] text-[#616f89] shrink-0 font-medium">{formatDate(msg.created_at)}</span>
                    </div>
                    <p className={`text-xs line-clamp-2 ${!msg.is_read ? 'text-[#111318] font-medium' : 'text-[#616f89]'}`}>
                      {msg.konten}
                    </p>
                  </div>
                  {!msg.is_read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#135bec] shrink-0 mt-1.5 shadow-sm"></div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Message Detail */}
        <div className="w-full md:w-2/3 lg:w-3/5 flex flex-col bg-white">
          {selectedMsg ? (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/50 ${getIconColor(selectedMsg.tipe)}`}>
                  <span className="material-symbols-outlined text-[24px]">{getIcon(selectedMsg.tipe)}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#111318]">{selectedMsg.judul}</h2>
                  <p className="text-xs font-semibold text-[#616f89] mt-0.5">{formatDate(selectedMsg.created_at)}</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-[#111318] mb-8 leading-relaxed">
                <p>{selectedMsg.konten}</p>
              </div>

              {/* TIKET DETAIL */}
              {selectedMsg.tipe === 'tiket' && (
                <div className="bg-[#fcfcfd] rounded-2xl border border-[#dbdfe6] overflow-hidden">
                  <div className="bg-[#135bec] p-4 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                      <span className="font-bold">Tiket Konseling</span>
                    </div>
                    <span className="text-sm font-black tracking-wider bg-white/20 px-2 py-0.5 rounded">{selectedMsg.tiket_id}</span>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#616f89] mb-1">Psikolog</p>
                      <p className="text-sm font-bold text-[#111318] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#135bec]">psychology</span>
                        {selectedMsg.psikolog_nama}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#616f89] mb-1">Jadwal</p>
                      <p className="text-sm font-bold text-[#111318] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#135bec]">schedule</span>
                        {selectedMsg.tanggal} | {selectedMsg.waktu}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#616f89] mb-1">Metode</p>
                      <p className="text-sm font-bold text-[#111318] flex items-center gap-1.5 capitalize">
                        <span className="material-symbols-outlined text-[16px] text-[#135bec]">{selectedMsg.metode === 'daring' ? 'videocam' : 'groups'}</span>
                        {selectedMsg.metode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#616f89] mb-1">{selectedMsg.metode === 'daring' ? 'Link Meeting' : 'Lokasi'}</p>
                      {selectedMsg.metode === 'daring' ? (
                        <a href={selectedMsg.lokasi_link?.startsWith('http') ? selectedMsg.lokasi_link : `https://${selectedMsg.lokasi_link}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#135bec] hover:underline flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[16px]">link</span>
                          {selectedMsg.lokasi_link}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-[#111318] flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#135bec]">place</span>
                          {selectedMsg.lokasi_link}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-[#dbdfe6] bg-white flex gap-3">
                    {selectedMsg.action_url && (
                      <Link href={selectedMsg.action_url} className="flex-1">
                        <button className="w-full py-2.5 rounded-xl bg-[#135bec] hover:bg-[#0e45b5] text-white font-bold text-sm transition-colors shadow-sm">
                          Lihat Detail Tiket
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* SURAT RUJUKAN */}
              {selectedMsg.tipe === 'rujukan' && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 mb-4 shadow-sm">
                    <span className="material-symbols-outlined text-[32px]">assignment_late</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">Surat Rujukan Penanganan Lanjutan</h3>
                  <p className="text-sm text-red-600 mb-6 max-w-sm">Surat rujukan resmi dari tim Psikologi SDM telah diterbitkan berdasarkan hasil skrining Anda.</p>
                  
                  <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    Unduh PDF Rujukan
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#616f89] p-8">
              <span className="material-symbols-outlined text-[60px] text-[#dbdfe6] mb-4">mail</span>
              <p className="text-lg font-bold text-[#111318]">Pilih Pesan</p>
              <p className="text-sm mt-1 text-center">Pilih pesan di daftar sebelah kiri untuk membaca isinya.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MailboxPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-[#616f89]">Memuat kotak masuk...</div>}>
      <MailboxContent />
    </Suspense>
  );
}
