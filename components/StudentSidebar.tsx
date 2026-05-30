'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { FiMenu, FiX } from 'react-icons/fi'
import {
  LayoutGrid, HeartPulse, MessageSquare, CalendarCheck2,
  BookOpen, User, Settings, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react'

/* ── Nav structure ── */
const NAV_GROUPS = [
  {
    section: 'Main',
    items: [
      { label: 'Overview',        href: '/dashboard/student',              icon: LayoutGrid },
      { label: 'Wellbeing Check', href: '/dashboard/student/assessment',   icon: HeartPulse,    badge: 'New' },
      { label: 'Messages',        href: '/dashboard/student/messages',     icon: MessageSquare, badge: '3' },
      { label: 'Appointments',    href: '/dashboard/student/appointments', icon: CalendarCheck2 },
      { label: 'Resources',       href: '/dashboard/student/resources',    icon: BookOpen },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Profile',  href: '/dashboard/student/profile',  icon: User },
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

  const [isCollapsed,   setIsCollapsed]   = useState(false)
  const [isMobileOpen,  setIsMobileOpen]  = useState(false)
  const [isDarkMode,    setIsDarkMode]    = useState(false)
  const [user, setUser] = useState<{ full_name: string; department?: string; level?: string } | null>(null)

  /* Load user from cookie */
  useEffect(() => {
    const stored = Cookies.get('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  /* Sync collapsed state + broadcast event (for header offset) */
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

  /* Listen for dark mode toggle from header */
  useEffect(() => {
    const handler = (e: Event) => {
      setIsDarkMode((e as CustomEvent<{ isDarkMode: boolean }>).detail.isDarkMode)
    }
    window.addEventListener('themeToggle', handler)
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true)
    }
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

  /* ── Shared sidebar body ── */
  const SidebarBody = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo / Brand ── */}
      <div className={`flex items-center p-4 pb-2 shrink-0 ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100'}`}>
          {/* Replace the div below with <Image src="/logo.svg" … /> when ready */}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ring-2 ${
              isDarkMode ? 'bg-gray-700 text-blue-400 ring-gray-600' : 'bg-white text-green-600 ring-green-200'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            MB
          </div>
          <div>
            <h2
              className={`font-bold text-[1rem] leading-tight ${isDarkMode ? 'text-blue-400' : 'text-green-600'}`}
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              MindBridge
            </h2>
            <p className={`text-[0.65rem] ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              Student Portal
            </p>
          </div>
        </div>

        {/* Collapsed logo (desktop only) */}
        {isCollapsed && (
          <div className="hidden lg:flex justify-center w-full">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ring-2 ${
                isDarkMode ? 'bg-gray-700 text-blue-400 ring-gray-600' : 'bg-white text-green-600 ring-green-200'
              }`}
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              MB
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop collapse toggle ── */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-8 items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* ── User card ── */}
      {!isCollapsed && (
        <div className={`mx-3 mt-2 mb-1 rounded-2xl px-3 py-3 flex items-center gap-3 border transition-all duration-300 ${
          isDarkMode
            ? 'bg-gray-700/50 border-gray-600'
            : 'bg-white/60 border-gray-200'
        }`}>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ring-2 ${
              isDarkMode ? 'ring-gray-500' : 'ring-blue-200'
            } bg-gradient-to-br from-green-800 to-green-400`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-[0.82rem] font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {firstName}
            </p>
            <p className={`text-[0.68rem] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              {deptLabel}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-green-100 border border-green-200 text-green-700 text-[0.6rem] font-semibold px-2 py-[2px] rounded-full shrink-0">
            <span className="w-[5px] h-[5px] rounded-full bg-green-500 animate-pulse" />
            Active
          </div>
        </div>
      )}

      {/* Collapsed user avatar (desktop) */}
      {isCollapsed && (
        <div className="hidden lg:flex justify-center mt-2 mb-1">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-2 ${
              isDarkMode ? 'ring-gray-500' : 'ring-blue-200'
            } bg-gradient-to-br from-green-800 to-green-400`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {initials}
          </div>
        </div>
      )}

      {/* ── Scrollable nav ── */}
      <nav className="flex flex-col flex-1 overflow-y-auto px-3 pb-4 mt-2 gap-[2px]
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {NAV_GROUPS.map((group, gi) => (
          <div key={group.section}>

            {/* Section label */}
            {!isCollapsed && (
              <p className={`text-[0.68rem] font-semibold uppercase tracking-widest px-2 mb-1 ${
                gi > 0 ? 'mt-4' : 'mt-1'
              } ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                {group.section}
              </p>
            )}
            {isCollapsed && gi > 0 && (
              <div className={`h-px mx-2 my-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            )}

            {group.items.map(({ href, label, icon: Icon, badge }) => {
              const active = pathname === href
              const isNum  = badge && badge !== 'New'

              return (
                <Link
                  key={href}
                  href={href}
                  title={isCollapsed ? label : ''}
                  className={`
                    flex items-center gap-3 p-2 rounded-[2rem] transition-all duration-200 group relative mb-[2px]
                    ${active
                      ? isDarkMode
                        ? 'bg-gradient-to-l from-blue-900 via-blue-800 to-blue-900 text-white font-bold'
                        : 'bg-gradient-to-l from-green-500 via-green-400 to-green-500 text-white font-bold'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gradient-to-l hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 hover:font-semibold'
                        : 'text-gray-700 hover:bg-gradient-to-l hover:from-blue-100 hover:via-white hover:to-purple-200 hover:font-semibold'
                    }
                    ${isCollapsed ? 'lg:justify-center' : ''}
                  `}
                >
                  {/* Icon bubble */}
                  <span className={`border rounded-full p-[0.3rem] shrink-0 transition-all duration-200 ${
                    active
                      ? 'bg-white border-white'
                      : isDarkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-200'
                  }`}>
                    <Icon
                      size={18}
                      className={
                        active
                          ? 'text-green-500'
                          : isDarkMode
                            ? 'text-gray-300 group-hover:text-blue-400'
                            : 'text-gray-500 group-hover:text-indigo-600'
                      }
                      strokeWidth={1.8}
                    />
                  </span>

                  {/* Label */}
                  <span className={`whitespace-nowrap flex-1 text-[0.88rem] transition-all duration-300 ${
                    isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                  }`}>
                    {label}
                  </span>

                  {/* Badge */}
                  {badge && !isCollapsed && (
                    <span className={`text-[0.6rem] font-bold px-2 py-[2px] rounded-full border ${
                      isNum
                        ? 'bg-red-100 text-red-600 border-red-200'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {badge}
                    </span>
                  )}

                  {/* Tooltip when collapsed */}
                  {isCollapsed && (
                    <span className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                      {label}
                      {badge && (
                        <span className={`ml-2 text-[0.6rem] font-bold px-2 py-[1px] rounded-full ${
                          isNum ? 'bg-red-500 text-white' : 'bg-yellow-400 text-gray-900'
                        }`}>
                          {badge}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}

        {/* ── Wellbeing nudge card ── */}
        {!isCollapsed && (
          <div className={`mt-4 rounded-2xl p-4 border transition-all duration-300 ${
            isDarkMode
              ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/30 border-blue-700/40'
              : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200'
          }`}>
            <p className={`text-[0.75rem] font-semibold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-green-700'}`}>
              📊 Wellbeing Score
            </p>
            <p className={`text-[0.68rem] mb-3 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              Last check-in 3 days ago. Stay on top of your mental health.
            </p>
            <div className={`h-1.5 w-full rounded-full overflow-hidden mb-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className={`h-full w-[68%] rounded-full ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-green-400 to-blue-400'}`} />
            </div>
            <div className={`flex justify-between text-[0.62rem] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <span>68 / 100</span>
              <span>Good</span>
            </div>
          </div>
        )}

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 p-2 mt-4 rounded-[2rem] transition-all duration-200 group ${
            isDarkMode
              ? 'text-red-400 hover:bg-gradient-to-l hover:from-red-900/40 hover:via-red-800/30 hover:to-red-900/40'
              : 'text-red-500 hover:bg-gradient-to-l hover:from-red-50 hover:via-white hover:to-red-50'
          } ${isCollapsed ? 'lg:justify-center' : ''}`}
        >
          <span className={`border rounded-full p-[0.3rem] shrink-0 ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <LogOut size={18} className="text-red-500" strokeWidth={1.8} />
          </span>
          <span className={`whitespace-nowrap text-[0.88rem] font-medium transition-all duration-300 ${
            isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
          }`}>
            Sign out
          </span>
          {isCollapsed && (
            <span className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
              Sign out
            </span>
          )}
        </button>
      </nav>

      {/* ── Mobile close button ── */}
      <div className="p-4 lg:hidden shrink-0">
        <button
          onClick={() => setIsMobileOpen(false)}
          className={`w-full p-3 rounded-2xl font-semibold transition-all ${
            isDarkMode
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Close Menu
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Mobile hamburger ── */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-4 left-4 z-[60] lg:hidden p-1.5 rounded-lg shadow-lg transition-all duration-200 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* ── Mobile overlay ── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed left-0 top-0 h-screen shadow-md font-[lexend] transition-all duration-300 ease-in-out z-50
          flex flex-col
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isDarkMode
            ? 'bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 border-r border-gray-700'
            : 'bg-gradient-to-b from-blue-100 via-white to-green-100 border-r border-gray-200'
          }
          w-72
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarBody />
      </aside>
    </>
  )
}