'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  badgeStyle?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const NAV_GROUPS: { section: string; items: NavItem[] }[] = [
  {
    section: 'Platform',
    items: [
      {
        label: 'Overview', href: '/dashboard/admin',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="18" y="18" width="7" height="7" rx="1"/><rect x="3" y="18" width="7" height="7" rx="1"/></svg>,
      },
      {
        label: 'Students', href: '/dashboard/admin/students',
        badge: 1248,
        badgeStyle: 'bg-[#f5a623]/20 text-[#f5a623]',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      },
      {
        label: 'Counsellors', href: '/dashboard/admin/counsellors',
        badge: 8,
        badgeStyle: 'bg-green-400/20 text-green-400',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
      },
      {
        label: 'Cases', href: '/dashboard/admin/cases',
        badge: 142,
        badgeStyle: 'bg-red-500/20 text-red-400',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
      },
      {
        label: 'Appointments', href: '/dashboard/admin/appointments',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      },
      {
        label: 'Resources', href: '/dashboard/admin/resources',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
      },
    ],
  },
  {
    section: 'Analytics',
    items: [
      {
        label: 'Reports', href: '/dashboard/admin/reports',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      },
      {
        label: 'Insights', href: '/dashboard/admin/insights',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        label: 'User Management', href: '/dashboard/admin/users',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
      },
      {
        label: 'Audit Logs', href: '/dashboard/admin/logs',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
      },
      {
        label: 'Settings', href: '/dashboard/admin/settings',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65  0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09a1.65 1.65 0 00-1-1.51A1.65 1.65 0 003.6 15a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51z"/></svg>,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-[#1a5c2a] overflow-hidden">

      {/* ── HEADER ── */}
      <div className="px-4 pt-[18px] pb-[14px] border-b border-white/[0.07]">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <Image src="/favicon.png" width={44} height={44} alt="Logo" />
          <div className="leading-tight">
            <p className="text-base font-semibold text-white">MindBridge</p>
            <p className="text-xs tracking-wide text-white/40">Admin Portal</p>
          </div>
        </div>

        {/* Admin user card */}
        <div className="flex items-center gap-2.5 bg-white/[0.07] border border-white/[0.10] rounded-xl px-3 py-2.5">
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#f5a623]/40 to-[#f5a623]/15 border-[1.5px] border-[#f5a623]/50 flex items-center justify-center text-[#f5a623] text-[15px] font-bold shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[14px] font-semibold text-white truncate">System Admin</p>
            <p className="text-[12px] text-white/40">Super Administrator</p>
          </div>
          {/* Admin shield badge */}
          <div className="w-[18px] h-[18px] rounded-md bg-[#f5a623]/20 border border-[#f5a623]/30 flex items-center justify-center shrink-0">
            <svg className="w-[10px] h-[10px]" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden">
        {NAV_GROUPS.map(({ section, items }) => (
          <div key={section} className="mb-1">
            <p className="px-4 pt-3 pb-1 text-[13px] font-semibold text-white/25 uppercase tracking-[0.10em]">
              {section}
            </p>
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-[10px] mx-2.5 px-3 py-3 rounded-md transition-all duration-150 my-2.5 font-bold
                    ${isActive ? 'bg-white/[0.12] font-bold' :  'hover:bg-white/[0.07] '}`}
                >
                  {isActive && (
                    <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-[3px] h-[18px] font-bold bg-[#f5a623] rounded-r-full" />
                  )}
                  <span className={`transition-opacity ${isActive ? 'opacity-100 [&_svg]:stroke-white font-bold' : 'opacity-[0.55]  [&_svg]:stroke-white'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[16px] font-bold transition-all flex-1 ${isActive ? 'text-white font-medium font-bold' : 'text-white/60 font-bold'}`}>
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className={`text-[12px] font-bold px-[7px] py-[3px] rounded-full leading-[1.4] ${item.badgeStyle}`}>
                      {item.badge.toLocaleString()}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── FOOTER ── */}
      <div className="px-4 py-3 border-t border-white/[0.07] flex items-center justify-between">
        <button
          onClick={handleLogout}
          className="flex items-center gap-[6px] px-2 py-1.5 -mx-2 rounded-md hover:bg-white/[0.07] transition-colors"
        >
          <svg className="w-[13px] h-[13px] stroke-white/35" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="text-[11px] text-white/35">Sign out</span>
        </button>
        <span className="text-[9.5px] text-white/20">v2.1.0</span>
      </div>
    </aside>
  );
}