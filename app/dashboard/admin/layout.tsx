import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT
// Wraps every page under /dashboard/admin/
// Sidebar stays fixed; header stays fixed; only <children> scrolls.
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#f7f8f9]">

      {/* Fixed left sidebar — never scrolls */}
      <AdminSidebar />

      {/* Right column — header pinned, content scrolls */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        {children}
      </div>

    </div>
  );
}