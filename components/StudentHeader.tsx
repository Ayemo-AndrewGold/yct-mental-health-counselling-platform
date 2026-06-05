'use client'

import React, { useEffect, useState } from 'react'
import { getMe, getMessages } from '@/lib/api'
import Cookies from 'js-cookie'
import { Bell, Search, ChevronDown, Sun, Moon, X } from 'lucide-react'
import Link from 'next/link'

interface User {
  full_name:     string
  email:         string
  role:          string
  matric_number: string
  department:    string
}

function getGreeting(hour: number): { text: string; emoji: string } {
  if (hour < 12) return { text: 'Good morning',   emoji: '☀️'  }
  if (hour < 17) return { text: 'Good afternoon',  emoji: '🌤️' }
  return              { text: 'Good evening',     emoji: '🌙'  }
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

const WELLBEING_MAP: Record<string, { label: string; dot: string; bg: string; border: string; text: string }> = {
  Good: { label: 'Wellbeing: Good', dot: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  Fair: { label: 'Wellbeing: Fair', dot: '#f59e0b', bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
  Low:  { label: 'Wellbeing: Low',  dot: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
}

export default function StudentHeader() {
  const [user,        setUser]        = useState<User | null>(null)
  const [dateStr,     setDateStr]     = useState('')
  const [hour,        setHour]        = useState(new Date().getHours())
  const [isDarkMode,  setIsDarkMode]  = useState(false)
  const [showSearch,  setShowSearch]  = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const wellbeingKey = 'Good' as keyof typeof WELLBEING_MAP
  const wb = WELLBEING_MAP[wellbeingKey]
  const [notifCount, setNotifCount] = useState(0)
  const [showNotif, setShowNotif] = useState(false)
  const [unreadConvs, setUnreadConvs] = useState<{user_id: number; full_name: string; last_message: string; last_time: string; unread: number}[]>([])

 useEffect(() => {
  const now = new Date()
  setHour(now.getHours())
  setDateStr(
    now.toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }) + ' · Yaba College of Technology'
  )
  const stored = Cookies.get('user')
  if (stored) setUser(JSON.parse(stored))

  getMe().then((data) => {
    if (data) {
      setUser(data)
      Cookies.set('user', JSON.stringify(data), { expires: 1 })
    }
  })

    function fetchUnread() {
      getMessages().then((data: { user_id: number; full_name: string; last_message: string; last_time: string; unread: number }[]) => {
        if (!Array.isArray(data)) return
        const total = data.reduce((sum, c) => sum + (c.unread || 0), 0)
        setNotifCount(total)
        setUnreadConvs(data.filter(c => c.unread > 0))
      }).catch(() => {})
    }

  // Wait for token to be ready then fetch
  setTimeout(fetchUnread, 1000)

  const interval = setInterval(fetchUnread, 10000)
  return () => clearInterval(interval)
}, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') setIsDarkMode(true)
    }

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isDarkMode: boolean }>
      setIsDarkMode(customEvent.detail.isDarkMode)
    }
    window.addEventListener('themeToggle', handleThemeChange)
    return () => window.removeEventListener('themeToggle', handleThemeChange)
  }, [])

  useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.closest('[data-notif]')) setShowNotif(false)
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

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

  const { text: greetText, emoji } = getGreeting(hour)
  const firstName = user?.full_name?.split(' ')[0] ?? 'Student'
  const initials  = user?.full_name ? getInitials(user.full_name) : 'ST'

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const headerBorder  = isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.09)'
  const pillBg        = isDarkMode ? 'rgba(255,255,255,0.08)'           : 'rgba(0,0,0,0.05)'
  const pillBorder    = isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.10)'
  const pillHover     = isDarkMode ? 'hover:bg-white/[0.14]'            : 'hover:bg-black/[0.07]'
  const iconColor     = isDarkMode ? 'rgba(255,255,255,0.75)'           : 'rgba(0,0,0,0.55)'
  const searchText    = isDarkMode ? 'rgba(255,255,255,0.4)'            : 'rgba(0,0,0,0.38)'
  const dividerColor  = isDarkMode ? 'rgba(255,255,255,0.10)'           : 'rgba(0,0,0,0.10)'
  const notifBorder   = isDarkMode ? 'rgba(0,40,20,1)'                  : '#ffffff'
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
      <header
        className="sticky top-0 z-50 h-[4.79rem] flex items-center justify-between flex-shrink-0 font-[lexend] px-3 sm:px-5 md:px-6 gap-2 sm:gap-4 backdrop-blur-md"
        style={{ borderBottom: headerBorder }}
      >

        {/* ── Background layers ── */}
        {isDarkMode ? (
          <>
            {/* Photo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80')" }}
            />
            {/* Dark-green overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(105deg, rgba(0,40,20,0.96) 0%, rgba(0,65,35,0.92) 40%, rgba(0,80,40,0.85) 100%)' }}
            />
          </>
        ) : (
          /* Clean white/light-gray */
          <div className="absolute inset-0 bg-white" />
        )}

        {/* ── Content ── */}
        <div className="relative flex items-center justify-between w-full gap-2 sm:gap-4">

          {/* LEFT — Greeting */}
          <div className="min-w-0 flex-1">
            <h1
              className="flex items-center gap-1.5 leading-tight truncate font-bold"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '18px',
                color: isDarkMode ? '#ffffff' : '#111827',
              }}
            >
              <span className="shrink-0">{emoji}</span>
              <span className="hidden sm:inline truncate">{greetText}, {firstName}</span>
              <span className="sm:hidden truncate">Hi, {firstName}</span>
            </h1>
            <p
              className="mt-px truncate"
              style={{ fontSize: '13px', color: isDarkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.42)' }}
            >
              <span className="hidden md:inline">{dateStr}</span>
              <span className="md:hidden">Yaba College of Technology</span>
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

            {/* Desktop search */}
            <div
              className={`hidden lg:flex items-center gap-2 rounded-full px-4 py-[7px] cursor-text transition-all duration-200 ${pillHover}`}
              style={{ background: pillBg, border: pillBorder }}
            >
              <Search size={14} style={{ color: searchText }} strokeWidth={2} />
              <span className="whitespace-nowrap" style={{ fontSize: '13px', color: searchText }}>
                Search resources…
              </span>
              <kbd
                className="rounded px-[5px] py-[1px] ml-1"
                style={{ fontSize: '11px', background: pillBg, border: pillBorder, color: searchText }}
              >
                ⌘K
              </kbd>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`lg:hidden w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-200 ${pillHover}`}
              style={{ background: pillBg, border: pillBorder }}
              aria-label="Toggle search"
            >
              <Search size={17} style={{ color: iconColor }} />
            </button>

            {/* Wellbeing pill */}
            <div
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] cursor-pointer transition-all duration-200"
              style={{
                background: isDarkMode ? 'rgba(0,135,81,0.2)'  : 'rgba(0,135,81,0.10)',
                border:     isDarkMode ? '1px solid rgba(0,135,81,0.35)' : '1px solid rgba(0,135,81,0.30)',
              }}
            >
              <span className="w-[7px] h-[7px] rounded-full bg-green-500 animate-pulse shrink-0" />
              <span
                className="font-semibold whitespace-nowrap"
                style={{ fontSize: '12px', color: isDarkMode ? '#86efac' : '#15803d' }}
              >
                {wb.label}
              </span>
            </div>

            {/* Notification bell */}
          <div className="relative">
            <div
              onClick={() => setShowNotif(prev => !prev)}
              className={`relative w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${pillHover}`}
              style={{ background: pillBg, border: pillBorder }}
            >
              <Bell size={17} style={{ color: iconColor }} strokeWidth={1.8} />
              {notifCount > 0 && (
                <div
                  className="absolute -top-[2px] -right-[2px] w-[16px] h-[16px] rounded-full bg-red-500 flex items-center justify-center"
                  style={{ border: `2px solid ${notifBorder}` }}
                >
                  <span className="text-white font-bold" style={{ fontSize: '8px' }}>
                    {notifCount > 9 ? '9+' : notifCount}
                  </span>
                </div>
              )}
            </div>

            {/* Dropdown */}
            {showNotif && (
              <div
                className="absolute right-0 top-[44px] w-[300px] rounded-2xl overflow-hidden shadow-xl z-50"
                style={{
                  background: isDarkMode ? '#0d1f14' : '#fff',
                  border: `1px solid ${isDarkMode ? 'rgba(0,135,81,0.25)' : '#b6e6cc'}`,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: `1px solid ${isDarkMode ? 'rgba(0,135,81,0.2)' : '#b6e6cc'}` }}>
                  <p className="text-[15px] font-bold" style={{ color: isDarkMode ? '#fff' : '#1a3d1f' }}>
                    Notifications
                  </p>
                  {notifCount > 0 && (
                    <span className="text-[9px] font-bold px-2 py-[2px] rounded-full bg-red-100 text-red-600">
                      {notifCount} unread
                    </span>
                  )}
                </div>

                {/* List */}
                <div className="max-h-[280px] overflow-y-auto">
                  {unreadConvs.length === 0 ? (
                    <div className="px-4 py-6 text-center">
                      <p className="text-[13px]" style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#3B6D11' }}>
                        No new notifications
                      </p>
                    </div>
                  ) : (
                    unreadConvs.map(conv => (
                      <Link
                        key={conv.user_id}
                        href="/dashboard/student/messages"
                        onClick={() => setShowNotif(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-opacity-80"
                        style={{
                          borderBottom: `1px solid ${isDarkMode ? 'rgba(0,135,81,0.1)' : '#f0faf4'}`,
                          background: isDarkMode ? 'rgba(0,135,81,0.08)' : 'rgba(0,135,81,0.04)',
                        }}
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-[#008751] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {conv.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12px] font-bold truncate" style={{ color: isDarkMode ? '#fff' : '#1a3d1f' }}>
                              {conv.full_name}
                            </p>
                            <span className="text-[9px] shrink-0" style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : '#3B6D11' }}>
                              {conv.last_time}
                            </span>
                          </div>
                          <p className="text-[11px] truncate mt-0.5" style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#3B6D11' }}>
                            {conv.last_message}
                          </p>
                          <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-[1px] rounded-full bg-red-100 text-red-600">
                            {conv.unread} new
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                {/* Footer */}
                <Link
                  href="/dashboard/student/messages"
                  onClick={() => setShowNotif(false)}
                  className="flex items-center justify-center py-3 text-[13px] font-bold transition-colors hover:opacity-80"
                  style={{
                    borderTop: `1px solid ${isDarkMode ? 'rgba(0,135,81,0.2)' : '#b6e6cc'}`,
                    color: '#008751',
                  }}
                >
                  View all messages →
                </Link>
              </div>
            )}
          </div>

            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="hidden sm:flex items-center rounded-full p-[3px] gap-0.5 transition-all duration-300"
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

            {/* Divider */}
            <div
              className="hidden md:block w-px h-[24px]"
              style={{ background: dividerColor }}
            />

            {/* Profile chip */}
            <div
              className={`flex items-center gap-2 rounded-full pl-1 pr-1 sm:pr-3 py-1 cursor-pointer transition-all duration-200 ${pillHover}`}
              style={{ background: pillBg, border: pillBorder }}
            >
              <div
                className="w-[30px] h-[30px] rounded-full bg-[#008751] flex items-center justify-center text-white font-bold shrink-0"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '11px',
                  border: isDarkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,135,81,0.3)',
                }}
              >
                {initials}
              </div>
              <span
                className="font-semibold hidden sm:block"
                style={{ fontSize: '14px', color: isDarkMode ? '#ffffff' : '#111827' }}
              >
                {firstName}
              </span>
              <ChevronDown
                size={13}
                style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}
                strokeWidth={2.5}
                className="hidden sm:block"
              />
            </div>

          </div>
        </div>
      </header>

      {/* Mobile search dropdown */}
      {showSearch && (
        <div
          className="lg:hidden relative z-20 px-3 py-3 transition-all duration-200"
          style={{
            background: isDarkMode ? 'rgba(0,40,20,0.97)' : '#ffffff',
            borderBottom: headerBorder,
          }}
        >
          <div
            className="flex items-center gap-2 rounded-full px-4 py-2"
            style={{ background: pillBg, border: pillBorder }}
          >
            <Search size={15} style={{ color: searchText }} className="shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search resources…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
              className="flex-1 bg-transparent focus:outline-none"
              style={{
                fontSize: '14px',
                color: isDarkMode ? '#ffffff' : '#111827',
              }}
            />
            <button
              onClick={() => { setShowSearch(false); setSearchQuery('') }}
              aria-label="Close search"
            >
              <X size={16} style={{ color: searchText }} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}