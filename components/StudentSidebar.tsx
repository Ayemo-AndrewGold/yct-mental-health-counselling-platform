'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { FiMenu, FiX } from 'react-icons/fi'
import {
  LayoutGrid, HeartPulse, MessageSquare, CalendarCheck2,
  BookOpen, User, Settings, LogOut, ChevronLeft, Sun, Moon, ChevronRight,
} from 'lucide-react'
import Image from 'next/image'

/* ── Nav structure ── */
const NAV_GROUPS = [
  {
    section: 'Main',
    items: [
      { label: 'Overview',        href: '/dashboard/student',              icon: LayoutGrid },
      { label: 'Wellbeing Check', href: '/dashboard/student/assessment',   icon: HeartPulse,    badge: 'New' },
      { label: 'Book',        href: '/dashboard/student/book',     icon: MessageSquare},
      { label: 'Messages',        href: '/dashboard/student/messages',     icon: MessageSquare, badge: '3' },
      { label: 'Appointments',    href: '/dashboard/student/sessions', icon: CalendarCheck2 },
      { label: 'Resources',       href: '/dashboard/student/resources',    icon: BookOpen },
    ],
  },
  {
    section: 'Account',
    items: [
      // { label: 'Profile',  href: '/dashboard/student/profile',  icon: User },
      { label: 'Settings', href: '/dashboard/student/settings', icon: Settings },
    ],
  },
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

export default function StudentSidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  const [isCollapsed,  setIsCollapsed]  = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDarkMode,   setIsDarkMode]   = useState(false)
  const [user, setUser] = useState<{ full_name: string; department?: string; level?: string } | null>(null)


    // Dark mode feature 
    const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      // Defer the event so it fires after this render cycle completes
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('themeToggle', { detail: { isDarkMode: next } }))
      }, 0)
      return next
    })
  }

  useEffect(() => {
  const saved = localStorage.getItem('theme')

  if (saved === 'dark') {
    setIsDarkMode(true)
  } else {
    setIsDarkMode(false)
  }
}, [])

  /* Load user from cookie */
  useEffect(() => {
    const stored = Cookies.get('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  /* Sync collapsed state + broadcast event */
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

   // ─── Theme tokens ──────────────────────────────────────────────────────────
  const headerBorder  = isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.09)'
  const pillBg        = isDarkMode ? 'rgba(255,255,255,0.08)'           : 'rgba(0,0,0,0.05)'
  const pillBorder    = isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.10)'
  const pillHover     = isDarkMode ? 'hover:bg-white/[0.14]'            : 'hover:bg-black/[0.07]'
  const iconColor     = isDarkMode ? 'rgba(255,255,255,0.75)'           : 'rgba(0,0,0,0.55)'
  const searchText    = isDarkMode ? 'rgba(255,255,255,0.4)'            : 'rgba(0,0,0,0.38)'
  const dividerColor  = isDarkMode ? 'rgba(255,255,255,0.10)'           : 'rgba(0,0,0,0.10)'
  const notifBorder   = isDarkMode ? 'rgba(0,40,20,1)'                  : '#ffffff'
  // ─

  /* Listen for dark mode toggle from header */
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    setIsDarkMode(saved === 'dark')

    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ isDarkMode: boolean }>
      if (custom.detail?.isDarkMode !== undefined) {
        setIsDarkMode(custom.detail.isDarkMode)
      }
    }

    window.addEventListener('themeToggle', handler)
    return () => window.removeEventListener('themeToggle', handler)
  }, [])

  /* Close mobile drawer on navigation */
  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {

    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileOpen])

  function handleLogout() {
    Cookies.remove('access')
    Cookies.remove('refresh')
    Cookies.remove('user')
    router.push('/login')
  }

  const firstName = user?.full_name?.split(' ')[0] ?? 'Student'
  const initials  = user?.full_name ? getInitials(user.full_name) : 'ST'
  const deptLabel = user?.department
    ? `${user.department}${user.level ? ', ' + user.level : ''}`
    : 'Yabatech Student'

  // ─── Theme tokens ───────────────────────────────────────────────────────────
  // Text
  const textPrimary   = isDarkMode ? '#ffffff'                   : '#111827'
  const textSecondary = isDarkMode ? 'rgba(255,255,255,0.45)'    : 'rgba(0,0,0,0.45)'
  const textMuted     = isDarkMode ? 'rgba(255,255,255,0.28)'    : 'rgba(0,0,0,0.30)'

  // Surfaces
  const sectionDivider = isDarkMode ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.07)'
  const cardBg         = isDarkMode ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.04)'
  const cardBorder     = isDarkMode ? 'rgba(255,255,255,0.10)'   : 'rgba(0,0,0,0.09)'
  const topBorder      = isDarkMode ? 'rgba(255,255,255,0.08)'   : 'rgba(0,0,0,0.08)'

  // Nav item — active
  const activeItemBg     = isDarkMode ? 'rgba(0,135,81,0.30)'    : 'rgba(0,135,81,0.12)'
  const activeItemBorder = isDarkMode ? 'rgba(0,135,81,0.40)'    : 'rgba(0,135,81,0.35)'
  const activeIconBg     = '#008751'
  const activeIconColor  = '#ffffff'
  const activeLabelColor = isDarkMode ? '#ffffff'                 : '#004d2e'

  // Nav item — idle
  const idleIconBg    = isDarkMode ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.05)'
  const idleIconColor = isDarkMode ? 'rgba(255,255,255,0.55)'    : 'rgba(0,0,0,0.50)'
  const idleLabelColor= isDarkMode ? 'rgba(255,255,255,0.70)'    : 'rgba(0,0,0,0.65)'
  const hoverBg       = isDarkMode ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.05)'

  // Wellbeing card
  const wbTitle  = isDarkMode ? '#86efac'                        : '#15803d'
  const wbBarBg  = isDarkMode ? 'rgba(255,255,255,0.10)'         : 'rgba(0,0,0,0.08)'

  // Logout
  const logoutHoverBg = 'rgba(239,68,68,0.10)'
  // ──────────────────────────────────────────────────────────────────────────

  const SidebarBody = () => (
    <div className="flex flex-col h-full">

      {/* ── Background layers ── */}
      {isDarkMode ? (
        <>
          <div className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80')" }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(160deg, rgba(0,40,20,0.97) 0%, rgba(0,60,30,0.95) 40%, rgba(0,80,40,0.90) 70%, rgba(0,55,25,0.96) 100%)' }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-white" />
      )}

      {/* All content above layers */}
      <div className="relative flex flex-col h-full">

        {/* ── Brand ── */}
        <div
          className={`flex items-center gap-2.5 px-5 py-[22px] pb-4 shrink-0 ${isCollapsed ? 'lg:justify-center' : ''}`}
          style={{ borderBottom: `1px solid ${topBorder}` }}
        >
          {!isCollapsed && (
            <>
              <div
                className="w-9 h-9 flex items-center justify-center text-white text-[13px] font-bold shrink-0"
              >
                <Image src="/favicon.png" width={40} height={40} alt="Logo" />
              </div>
              <div>
                <p className="text-[16px] font-bold leading-tight" style={{ color: textPrimary, fontFamily: 'Syne, sans-serif' }}>
                  MindBridge
                </p>
                <p className="text-[11px] tracking-wide mt-px" style={{ color: textSecondary }}>
                  Student Portal
                </p>
              </div>
            </>
          )}
          {isCollapsed && (
            <div
              className="hidden lg:flex w-9 h-9 rounded-[10px] bg-[#008751] items-center justify-center text-white font-bold"
            >
              <Image src="/favicon.png" width={40} height={40} alt="Logo" />
            </div>
          )}
        </div>

        {/* ── Desktop collapse toggle ── */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 items-center justify-center w-6 h-6 rounded-full bg-[#008751] text-white shadow-lg hover:scale-110 transition-all duration-200 z-50"
          style={{ border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,135,81,0.4)'}` }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* ── User card ── */}
        {!isCollapsed && (
          <div
            className="mx-3 mt-3 mb-1.5 rounded-[14px] px-3.5 py-3 flex items-center gap-2.5"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-[#008751]"
              style={{ border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,135,81,0.3)'}` }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold truncate" style={{ color: textPrimary }}>{firstName}</p>
              <p className="text-[11px] truncate mt-px" style={{ color: textSecondary }}>{deptLabel}</p>
            </div>
            <div
              className="flex items-center gap-1 shrink-0 px-2 py-[3px] rounded-full text-[9px] font-bold tracking-wide"
              style={{
                background: 'rgba(0,135,81,0.18)',
                border: '1px solid rgba(0,135,81,0.35)',
                color: isDarkMode ? '#86efac' : '#15803d',
              }}
            >
              <span className="w-[5px] h-[5px] rounded-full bg-green-500 animate-pulse" />
              Active
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="hidden lg:flex justify-center mt-3 mb-1.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold bg-[#008751]"
              style={{ border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,135,81,0.3)'}` }}
            >
              {initials}
            </div>
          </div>
        )}

        {/* ── Nav ── */}
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

              {group.items.map(({ href, label, icon: Icon, badge }) => {
                const active = pathname === href
                const isNum  = badge && badge !== 'New'
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
                    {/* Icon */}
                    <span
                      className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center shrink-0 transition-all"
                      style={{ background: active ? activeIconBg : idleIconBg }}
                    >
                      <Icon
                        size={16}
                        style={{ color: active ? activeIconColor : idleIconColor }}
                        strokeWidth={1.8}
                      />
                    </span>

                    {/* Label */}
                    <span
                      className={`whitespace-nowrap flex-1 font-medium transition-all duration-300
                        ${isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}
                      style={{
                        fontSize: '15px',
                        fontWeight: active ? 600 : 500,
                        color: active ? activeLabelColor : idleLabelColor,
                      }}
                    >
                      {label}
                    </span>

                    {/* Badge */}
                    {badge && !isCollapsed && (
                      <span
                        className={`text-[10px] font-bold px-[7px] py-[2px] rounded-full`}
                        style={isNum
                          ? { background: 'rgba(239,68,68,0.18)', color: '#f87171', border: '1px solid rgba(239,68,68,0.28)' }
                          : { background: 'rgba(250,204,21,0.15)', color: '#fbbf24', border: '1px solid rgba(250,204,21,0.28)' }
                        }
                      >
                        {badge}
                      </span>
                    )}

                    {/* Collapsed tooltip */}
                    {isCollapsed && (
                      <span className="hidden lg:block absolute left-full ml-4 px-3 py-2 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg"
                        style={{
                          background: isDarkMode ? '#1f2937' : '#111827',
                          color: '#ffffff',
                        }}
                      >
                        {label}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex lg:hidden w-fit self-start mt-2 items-center rounded-full p-[3px] gap-0.5 transition-all duration-300"
          style={{ background: pillBg, border: pillBorder }}
          aria-label="Toggle dark mode"
        >
          <span
            className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200 ${
              !isDarkMode
                ? 'bg-[#008751] text-white shadow-sm'
                : isDarkMode ? 'text-white/40' : 'text-black/30'
            }`}
          >
            <Sun size={15} />
          </span>
          <span
            className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200 ${
              isDarkMode
                ? 'bg-white/15 text-white'
                : 'text-black/30'
            }`}
          >
            <Moon size={15} />
          </span>
        </button>
        </nav>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2.5 mx-3 mb-4 mt-1 px-2.5 py-2 rounded-[12px] transition-all duration-200 group
            ${isCollapsed ? 'lg:justify-center' : ''}`}
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.background = logoutHoverBg }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <span
            className="w-[32px] h-[32px] rounded-[9px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.20)' }}
          >
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
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              color: textSecondary,
            }}
          >
            Close Menu
          </button>
        </div>

      </div>
    </div>
  )

  return (
    <>
        {/* Mobile view hamberChevron */}
        <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-2 left-1 z-[200] lg:hidden p-[5px] rounded-full shadow-lg text-white"
        style={{ background: '#003d1f' }}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
      </button>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[90] lg:hidden backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

        <aside className={`
          fixed left-0 top-0 h-screen shadow-2xl font-[lexend]
          transition-all duration-300 ease-in-out z-[100] overflow-visible
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-72
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
          style={{
          borderRight: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: isDarkMode
            ? '4px 0 24px rgba(0,0,0,0.4)'
            : '4px 0 24px rgba(0,0,0,0.07)',
        }}
      >
        <SidebarBody />
      </aside>
    </>
  )
}