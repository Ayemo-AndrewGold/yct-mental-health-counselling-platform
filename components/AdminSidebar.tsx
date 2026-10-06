'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import Image from 'next/image'
import {
  LayoutGrid, Users, UserCheck, ClipboardList,
  CalendarCheck2, BookOpen, BarChart2, TrendingUp,
  UserCog, FileText, Settings, LogOut,
  ChevronLeft, ChevronRight, Sun, Moon, Shield, Database,
} from 'lucide-react'
import { getAdminStats } from '@/lib/api'

// ─── Static nav structure (badges come from API) ──────────────────────────────
const NAV_GROUPS = [
  {
    section: 'Platform',
    items: [
      { label: 'Overview',     href: '/dashboard/admin',              icon: LayoutGrid,     statsKey: null            },
      { label: 'Students',     href: '/dashboard/admin/students',     icon: Users,          statsKey: 'total_students',    badgeStyle: 'bg-amber-400/20 text-amber-300' },
      { label: 'Counsellors',  href: '/dashboard/admin/counsellors',  icon: UserCheck,      statsKey: 'total_counsellors', badgeStyle: 'bg-green-400/20 text-green-300' },
      { label: 'Cases',        href: '/dashboard/admin/cases',        icon: ClipboardList,  statsKey: null,                badge: '—', badgeStyle: 'bg-red-400/20 text-red-300' },
      { label: 'Appointments', href: '/dashboard/admin/appointments', icon: CalendarCheck2, statsKey: 'total_appointments', badgeStyle: 'bg-blue-400/20 text-blue-300' },
      { label: 'Resources',    href: '/dashboard/admin/resources',    icon: BookOpen,       statsKey: null            },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { label: 'Reports',  href: '/dashboard/admin/reports',  icon: BarChart2,  statsKey: null },
      { label: 'Insights', href: '/dashboard/admin/insights', icon: TrendingUp, statsKey: null },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'User Management', href: '/dashboard/admin/users',     icon: UserCog,  statsKey: null },
      { label: 'Seed Demo Data',  href: '/dashboard/admin/seed',      icon: Database, statsKey: null, badge: 'NEW', badgeStyle: 'bg-amber-400/20 text-amber-300' },
      { label: 'Audit Logs',      href: '/dashboard/admin/logs',      icon: FileText, statsKey: null },
      { label: 'Settings',        href: '/dashboard/admin/settings',  icon: Settings, statsKey: null },
    ],
  },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

// ─── Stats interface ──────────────────────────────────────────────────────────
interface Stats {
  total_students: number;
  total_counsellors: number;
  total_appointments: number;
  pending_appointments: number;
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const [isCollapsed,  setIsCollapsed]  = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDarkMode,   setIsDarkMode]   = useState(false)
  const [user,  setUser]  = useState<{ full_name: string; email?: string } | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  // ── Dark mode ──────────────────────────────────────────────────────────────
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('themeToggle', { detail: { isDarkMode: next } }))
      }, 0)
      return next
    })
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setIsDarkMode(saved === 'dark')
  }, [])

  // ── User cookie ────────────────────────────────────────────────────────────
  useEffect(() => {
    const stored = Cookies.get('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  // ── Fetch live stats for badges ────────────────────────────────────────────
  useEffect(() => {
    getAdminStats().then(data => { if (data) setStats(data) })
    // Refresh every 30 s so badges update after seeding
    const interval = setInterval(() => {
      getAdminStats().then(data => { if (data) setStats(data) })
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  // ── Sidebar collapsed sync ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isCollapsed } }))
      localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed')
      if (saved) setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // ── Theme listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ isDarkMode: boolean }>
      if (ev.detail?.isDarkMode !== undefined) setIsDarkMode(ev.detail.isDarkMode)
    }
    window.addEventListener('themeToggle', handler)
    return () => window.removeEventListener('themeToggle', handler)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileOpen])

  function handleLogout() {
    Cookies.remove('access')
    Cookies.remove('refresh')
    Cookies.remove('user')
    router.push('/login/admin')
  }

  // ── Derive badge value from live stats ────────────────────────────────────
  function getBadge(item: any): string | undefined {
    if (item.statsKey && stats) {
      const val = (stats as any)[item.statsKey]
      if (val !== undefined && val !== null) {
        return Number(val).toLocaleString()
      }
    }
    return item.badge
  }

  const firstName = user?.full_name?.split(' ')[0] ?? 'Admin'
  const initials  = user?.full_name ? getInitials(user.full_name) : 'SA'

  // ── Colour tokens ──────────────────────────────────────────────────────────
  const textPrimary    = isDarkMode ? '#ffffff'                 : '#111827'
  const textSecondary  = isDarkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'
  const textMuted      = isDarkMode ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.30)'
  const sectionDivider = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const cardBg         = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)'
  const cardBorder     = isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.09)'
  const topBorder      = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const activeItemBg     = isDarkMode ? 'rgba(245,166,35,0.18)' : 'rgba(245,166,35,0.10)'
  const activeItemBorder = isDarkMode ? 'rgba(245,166,35,0.40)' : 'rgba(245,166,35,0.35)'
  const activeIconBg     = '#f5a623'
  const activeIconColor  = '#ffffff'
  const activeLabelColor = isDarkMode ? '#ffffff'                : '#7c3d00'
  const idleIconBg     = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const idleIconColor  = isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.50)'
  const idleLabelColor = isDarkMode ? 'rgba(255,255,255,0.70)' : 'rgba(0,0,0,0.65)'
  const hoverBg        = isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'
  const pillBg         = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
  const pillBorder     = isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.10)'
  const logoutHoverBg  = 'rgba(239,68,68,0.10)'

  const SidebarBody = () => (
    <div className="flex flex-col h-full">
      {/* Background */}
      {isDarkMode ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80')" }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(10,25,10,0.97) 0%, rgba(20,45,15,0.95) 40%, rgba(15,35,10,0.96) 100%)' }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-white" />
      )}

      <div className="relative flex flex-col h-full">

        {/* Brand */}
        <div
          className={`flex items-center gap-2.5 px-5 py-[22px] pb-4 shrink-0 ${isCollapsed ? 'lg:justify-center' : ''}`}
          style={{ borderBottom: `1px solid ${topBorder}` }}
        >
          {!isCollapsed && (
            <>
              <Image src="/favicon.png" width={40} height={40} alt="Logo" />
              <div>
                <p className="text-[16px] font-bold leading-tight" style={{ color: textPrimary, fontFamily: 'Syne, sans-serif' }}>
                  MindBridge
                </p>
                <p className="text-[11px] tracking-wide mt-px" style={{ color: textSecondary }}>Admin Portal</p>
              </div>
            </>
          )}
          {isCollapsed && (
            <div className="hidden lg:flex w-9 h-9 rounded-[10px] items-center justify-center">
              <Image src="/favicon.png" width={40} height={40} alt="Logo" />
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 items-center justify-center w-6 h-6 rounded-full text-white shadow-lg hover:scale-110 transition-all duration-200 z-50"
          style={{ background: '#f5a623', border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(245,166,35,0.4)'}` }}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* User card */}
        {!isCollapsed && (
          <div
            className="mx-3 mt-3 mb-1.5 rounded-[14px] px-3.5 py-3 flex items-center gap-2.5"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #f5a623, #d97706)', border: '2px solid rgba(245,166,35,0.40)' }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold truncate" style={{ color: textPrimary }}>{firstName}</p>
              <p className="text-[11px] truncate mt-px" style={{ color: textSecondary }}>Super Administrator</p>
            </div>
            <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0"
              style={{ background: 'rgba(245,166,35,0.18)', border: '1px solid rgba(245,166,35,0.35)' }}>
              <Shield size={11} style={{ color: '#f5a623' }} />
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="hidden lg:flex justify-center mt-3 mb-1.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
              style={{ background: 'linear-gradient(135deg, #f5a623, #d97706)', border: '2px solid rgba(245,166,35,0.40)' }}>
              {initials}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex flex-col flex-1 overflow-y-auto px-3 pb-2 mt-1 gap-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.section}>
              {!isCollapsed && (
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2 mb-1 ${gi > 0 ? 'mt-4' : 'mt-2'}`}
                  style={{ color: textMuted }}
                >
                  {group.section}
                </p>
              )}
              {isCollapsed && gi > 0 && (
                <div className="h-px mx-2 my-3" style={{ background: sectionDivider }} />
              )}

              {group.items.map((item: any) => {
                const { href, label, icon: Icon, badgeStyle } = item
                const active = pathname === href
                const badge  = getBadge(item)

                return (
                  <Link
                    key={href}
                    href={href}
                    title={isCollapsed ? label : ''}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[12px] transition-all duration-200 group relative mb-[2px]
                      ${isCollapsed ? 'lg:justify-center' : ''}`}
                    style={active
                      ? { background: activeItemBg, border: `1px solid ${activeItemBorder}` }
                      : { border: '1px solid transparent' }
                    }
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span
                      className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center shrink-0 transition-all"
                      style={{ background: active ? activeIconBg : idleIconBg }}
                    >
                      <Icon size={16} style={{ color: active ? activeIconColor : idleIconColor }} strokeWidth={1.8} />
                    </span>
                    <span
                      className={`whitespace-nowrap flex-1 font-medium transition-all duration-300
                        ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}
                      style={{ fontSize: '15px', fontWeight: active ? 600 : 500, color: active ? activeLabelColor : idleLabelColor }}
                    >
                      {label}
                    </span>
                    {badge && !isCollapsed && (
                      <span className={`text-[10px] font-bold px-[6px] py-[2px] rounded-full shrink-0 ${badgeStyle ?? ''}`}>
                        {badge}
                      </span>
                    )}
                    {isCollapsed && (
                      <span
                        className="hidden lg:block absolute left-full ml-4 px-3 py-2 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg"
                        style={{ background: isDarkMode ? '#1f2937' : '#111827', color: '#ffffff' }}
                      >
                        {label}
                        {badge ? ` (${badge})` : ''}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}

          {/* Theme toggle (mobile only) */}
          <button
            onClick={toggleDarkMode}
            className="flex lg:hidden w-fit self-start mt-2 items-center rounded-full p-[3px] gap-0.5 transition-all duration-300"
            style={{ background: pillBg, border: pillBorder }}
          >
            <span className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200 ${!isDarkMode ? 'text-white shadow-sm' : 'text-white/40'}`}
              style={{ background: !isDarkMode ? '#f5a623' : 'transparent' }}>
              <Sun size={15} />
            </span>
            <span className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200 ${isDarkMode ? 'bg-white/15 text-white' : 'text-black/30'}`}>
              <Moon size={15} />
            </span>
          </button>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 mx-3 mb-4 mt-1 px-2.5 py-2 rounded-[12px] transition-all duration-200 group
            ${isCollapsed ? 'lg:justify-center' : ''}`}
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = logoutHoverBg }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <span className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.20)' }}>
            <LogOut size={16} style={{ color: '#f87171' }} strokeWidth={1.8} />
          </span>
          <span
            className={`whitespace-nowrap font-medium transition-all duration-300
              ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}
            style={{ fontSize: '14px', color: '#f87171' }}
          >
            Sign out
          </span>
        </button>

        {/* Mobile close */}
        <div className="px-3 pb-4 lg:hidden shrink-0">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-full py-3 rounded-2xl text-sm font-medium transition-all"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: textSecondary }}
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-3 left-1 z-[200] lg:hidden p-[3px] rounded-full shadow-lg"
        style={{ background: '#7c3d00', color: '#f5a623' }}
      >
        {isMobileOpen ? <ChevronLeft size={25} /> : <ChevronRight size={25} />}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[90] lg:hidden backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen shadow-2xl font-[lexend]
          transition-all duration-300 ease-in-out z-[100] overflow-visible
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-72
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: isDarkMode ? '4px 0 24px rgba(0,0,0,0.4)' : '4px 0 24px rgba(0,0,0,0.07)',
        }}
      >
        <SidebarBody />
      </aside>
    </>
  )
}
