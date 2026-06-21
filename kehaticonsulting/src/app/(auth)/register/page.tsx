'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { pangkatOptions, satkerOptions } from '@/lib/mockData';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({
    nrp: '', nama_lengkap: '', pangkat: '', satker: '', unit: '', password: '',
  });
  const [error, setError] = useState('');

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nrp || !form.nama_lengkap || !form.pangkat || !form.satker || !form.password) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (!agreed) {
      setError('Anda harus menyetujui syarat dan ketentuan.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    router.push('/login?registered=1');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#dbdfe6] bg-white/80 backdrop-blur-md px-4 md:px-10 py-3 sticky top-0 z-50">
        <Link href="/login" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#135bec] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
          </div>
          <span className="text-base font-bold text-[#135bec]">KEHATI</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-[#616f89]">Sudah punya akun?</span>
          <Link href="/login">
            <button className="flex items-center justify-center h-9 px-5 bg-[#f6f6f8] border border-[#dbdfe6] text-[#111318] hover:bg-[#ebf1fd] hover:border-[#135bec] hover:text-[#135bec] transition-all rounded-lg text-sm font-bold">
              Masuk
            </button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10 items-start">

          {/* Left Hero */}
          <div className="hidden md:flex flex-1 flex-col justify-start h-full pt-4 sticky top-24">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#135bec] to-[#0e45b5] aspect-[4/3] shadow-xl mb-6 group">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-6 right-6 w-40 h-40 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-24 h-24 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-white rounded-full"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10 bg-gradient-to-t from-black/50 to-transparent">
                <span className="material-symbols-outlined text-5xl mb-3 block">psychology</span>
                <h3 className="text-2xl font-bold mb-2">Dukungan Psikologis Terpercaya</h3>
                <p className="text-blue-100 text-sm leading-relaxed">Layanan konseling rahasia dan profesional, eksklusif untuk personel Polda Jawa Barat.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm text-[#616f89]">
              {[
                ['lock', 'Aman & Rahasia'],
                ['verified_user', 'Khusus Personel Terverifikasi'],
                ['psychology', 'Psikolog Profesional Bersertifikat'],
                ['schedule', 'Jadwal Fleksibel Daring & Luring'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#135bec]">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="w-full md:max-w-[480px] bg-white rounded-2xl shadow-sm border border-[#dbdfe6] p-6 sm:p-8 animate-fade-in">
            <div className="mb-6">
              <h1 className="text-[#111318] text-2xl font-black tracking-tight">Buat Akun Baru</h1>
              <p className="text-[#616f89] text-sm mt-1">Bergabung dengan KEHATI untuk dukungan kesehatan mental yang lebih baik.</p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* NRP */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111318]" htmlFor="nrp">
                  NRP <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">badge</span>
                  <input id="nrp" type="text" value={form.nrp} onChange={e => update('nrp', e.target.value)}
                    placeholder="Nomor Registrasi Pokok"
                    className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] h-12 pl-11 pr-4 text-sm placeholder:text-[#616f89] focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all" />
                </div>
              </div>

              {/* Nama */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111318]" htmlFor="nama">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">person</span>
                  <input id="nama" type="text" value={form.nama_lengkap} onChange={e => update('nama_lengkap', e.target.value)}
                    placeholder="Nama lengkap sesuai dokumen"
                    className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] h-12 pl-11 pr-4 text-sm placeholder:text-[#616f89] focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all" />
                </div>
              </div>

              {/* Pangkat + Satker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#111318]" htmlFor="pangkat">
                    Pangkat <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">stars</span>
                    <select id="pangkat" value={form.pangkat} onChange={e => update('pangkat', e.target.value)}
                      className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] h-12 pl-11 pr-8 text-sm focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all appearance-none cursor-pointer">
                      <option value="">Pilih Pangkat</option>
                      {pangkatOptions.map(p => <option key={p} value={p}>{p.split('(')[1]?.replace(')', '') ?? p}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616f89] pointer-events-none material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#111318]" htmlFor="satker">
                    Satker <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">local_police</span>
                    <select id="satker" value={form.satker} onChange={e => update('satker', e.target.value)}
                      className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] h-12 pl-11 pr-8 text-sm focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all appearance-none cursor-pointer">
                      <option value="">Pilih Satker</option>
                      {satkerOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616f89] pointer-events-none material-symbols-outlined text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Unit */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111318]" htmlFor="unit">Unit / Bagian</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">business</span>
                  <input id="unit" type="text" value={form.unit} onChange={e => update('unit', e.target.value)}
                    placeholder="Contoh: Reskrim, Lantas, Intelkam"
                    className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] h-12 pl-11 pr-4 text-sm placeholder:text-[#616f89] focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all" />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#111318]" htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#616f89] material-symbols-outlined text-[20px]">lock_open</span>
                  <input id="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                    placeholder="Min. 8 karakter"
                    className="w-full rounded-lg border border-[#dbdfe6] bg-white text-[#111318] h-12 pl-11 pr-12 text-sm placeholder:text-[#616f89] focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616f89] hover:text-[#111318] transition-colors">
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#616f89] pl-1">Minimal 8 karakter dengan kombinasi huruf, angka, dan simbol.</p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 mt-1">
                <input id="terms" type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#dbdfe6] text-[#135bec] cursor-pointer accent-[#135bec]" />
                <label htmlFor="terms" className="text-sm text-[#616f89] cursor-pointer leading-relaxed">
                  Saya menyetujui <a href="#" className="text-[#135bec] hover:underline font-medium">Syarat & Ketentuan</a> dan{' '}
                  <a href="#" className="text-[#135bec] hover:underline font-medium">Kebijakan Privasi</a> KEHATI.
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center h-12 rounded-lg bg-[#135bec] hover:bg-[#0e45b5] disabled:opacity-60 text-white text-base font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] gap-2">
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Mendaftarkan...</>
                  ) : (
                    <><span className="material-symbols-outlined text-[20px]">person_add</span> Daftar Sekarang</>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#dbdfe6] text-center">
              <p className="text-sm text-[#616f89]">Butuh bantuan? <a href="mailto:kehati@polda-jabar.go.id" className="text-[#135bec] font-medium hover:underline">Hubungi Support</a></p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-[#616f89]">
        © 2026 KEHATI — Biro SDM Polda Jawa Barat.
      </footer>
    </div>
  );
}
