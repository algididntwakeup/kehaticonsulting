import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#f6f6f8] overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 page-enter">
          {children}
        </main>
        <footer className="py-3 px-6 text-xs text-[#616f89] border-t border-[#dbdfe6] bg-white">
          © 2026 KEHATI Admin Panel — Biro SDM Polda Jawa Barat
        </footer>
      </div>
    </div>
  );
}
