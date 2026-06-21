import Navbar from '@/components/layout/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f6f8] flex flex-col">
      <Navbar />
      <main className="flex-1 page-enter">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-[#616f89] border-t border-[#dbdfe6] bg-white mt-8">
        © 2026 KEHATI — Biro SDM Polda Jawa Barat. Semua data bersifat rahasia dan dilindungi.
      </footer>
    </div>
  );
}
