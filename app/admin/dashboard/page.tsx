import AdminDashboard from "@/components/admin/AdminDashboard";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// Route: /dashboard/admin
// Layout is applied automatically by layout.tsx in the same folder.
// This file is intentionally thin — all content lives in AdminDashboard.tsx.



// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  return <AdminDashboard />;
}