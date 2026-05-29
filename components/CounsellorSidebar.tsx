'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const NAV_GROUPS = [
  {
    section: 'Main',
    items: [
      {
        label: 'Overview', href: '/dashboard/counsellor',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
      },
      {
        label: 'My Appointments', href: '/dashboard/counsellor/appointments',
        badge: '5',
        badgeStyle: 'bg-yellow-400/20 text-yellow-300',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      },
      {
        label: 'My Students', href: '/dashboard/counsellor/students',
        badge: '24',
        badgeStyle: 'bg-blue-400/20 text-blue-300',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      },
      {
        label: 'Cases', href: '/dashboard/counsellor/cases',
        badge: '3',
        badgeStyle: 'bg-red-500/20 text-red-400',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
      },
      {
        label: 'Messages', href: '/dashboard/counsellor/messages',
        badge: '7',
        badgeStyle: 'bg-green-400/20 text-green-300',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
      },
    ],
  },
  {
    section: 'Tools',
    items: [
      {
        label: 'Session Notes', href: '/dashboard/counsellor/notes',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      },
      {
        label: 'Resources', href: '/dashboard/counsellor/resources',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
      },
    ],
  },
  {
    section: 'Account',
    items: [
      {
        label: 'My Profile', href: '/dashboard/counsellor/profile',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
      },
      {
        label: 'Settings', href: '/dashboard/counsellor/settings',
        icon: <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
      },
    ],
  },
];

export default function CounsellorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    Cookies.remove('access');
    Cookies.remove('refresh');
    Cookies.remove('user');
    router.push('/login/counsellor');
  }

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col bg-teal-800 overflow-hidden">

      {/* HEADER */}
      <div className="px-4 pt-[18px] pb-[14px] border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Image src="/favicon.png" width={40} height={40} alt="Logo" />
          <div className="leading-tight">
            <p className="text-base font-semibold text-white">MindBridge</p>
            <p className="text-xs text-white/40">Counsellor Portal</p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:hidden">
        {NAV_GROUPS.map(({ section, items }) => (
          <div key={section} className="mb-1">
            <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-white/25 uppercase tracking-[0.10em]">
              {section}
            </p>
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-[10px] mx-2.5 px-3 py-2.5 rounded-md transition-all duration-150 my-1
                    ${isActive ? 'bg-white/[0.12]' : 'hover:bg-white/[0.07]'}`}
                >
                  {isActive && (
                    <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-teal-300 rounded-r-full" />
                  )}
                  <span className={`transition-opacity ${isActive ? 'opacity-100 [&_svg]:stroke-white' : 'opacity-[0.55] [&_svg]:stroke-white'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[13px] font-medium transition-all flex-1 ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-bold px-[6px] py-[2px] rounded-full ${item.badgeStyle}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
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
        <span className="text-[9.5px] text-white/20">v1.0.0</span>
      </div>
    </aside>
  );
}