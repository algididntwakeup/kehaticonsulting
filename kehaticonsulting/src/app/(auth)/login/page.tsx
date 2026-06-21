'use client';

import type { Metadata } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [nrp, setNrp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nrp.trim() || !password.trim()) {
      setError('NRP dan password wajib diisi.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await login(nrp, password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'admin' || result.user?.role === 'psikolog') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(result.error ?? 'Login gagal. Periksa NRP dan password Anda.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#135bec]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#dbdfe6] bg-white/80 backdrop-blur-md px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#135bec] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
          </div>
          <h2 className="text-xl font-bold text-[#135bec] tracking-tight">KEHATI</h2>
        </div>
        <p className="text-sm text-[#616f89] hidden sm:block">
          Platform Konseling SDM Polda Jabar
        </p>
      </header>

      {/* Content */}
      <div className="flex flex-1 justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#dbdfe6] overflow-hidden animate-fade-in">

          {/* Hero */}
          <div className="relative h-44 bg-gradient-to-br from-[#135bec] to-[#0e45b5] overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/30 to-transparent">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-white text-[32px]">psychology</span>
              </div>
              <h1 className="text-white text-2xl font-bold drop-shadow-sm">Selamat Datang Kembali</h1>
              <p className="text-blue-100 text-sm mt-1">Layanan konseling rahasia untuk personel Polda Jabar</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-[#111318] text-lg font-bold mb-1">Masuk ke Akun Anda</h2>
              <p className="text-[#616f89] text-sm">Masukkan NRP dan password untuk mengakses portal.</p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            {/* Demo hint */}
            <div className="mb-4 p-3 bg-[#ebf1fd] border border-[#135bec]/20 rounded-lg">
              <p className="text-xs text-[#135bec] font-medium leading-relaxed">💡 Demo: Gunakan NRP <strong>82110001</strong> (Personel), <strong>70000001</strong> (Admin), atau <strong>70000002</strong> (Psikolog) dengan password apapun.</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* NRP */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#111318] text-sm font-semibold" htmlFor="nrp">NRP</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616f89]">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </span>
                  <input
                    id="nrp"
                    type="text"
                    value={nrp}
                    onChange={e => setNrp(e.target.value)}
                    placeholder="Masukkan NRP Anda"
                    className="block w-full rounded-lg border border-[#dbdfe6] bg-[#f6f6f8] text-[#111318] placeholder:text-[#616f89] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#111318] text-sm font-semibold flex justify-between" htmlFor="password">
                  <span>Password</span>
                  <a href="#" className="text-[#135bec] text-xs font-medium hover:underline">Lupa Password?</a>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#616f89]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-lg border border-[#dbdfe6] bg-[#f6f6f8] text-[#111318] placeholder:text-[#616f89] pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#616f89] hover:text-[#111318] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full bg-[#135bec] hover:bg-[#0e45b5] disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#616f89] text-sm">
                Belum punya akun?{' '}
                <Link href="/register" className="text-[#135bec] font-semibold hover:underline decoration-2 underline-offset-2">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#616f89]">
        © 2026 KEHATI — Biro SDM Polda Jawa Barat. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
