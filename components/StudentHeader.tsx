'use client'

import React, { useEffect, useState } from 'react'
import { getMe } from '@/lib/api'
import Cookies from 'js-cookie'
import { Bell, Search, ChevronDown, Sun, Moon, X } from 'lucide-react'

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
  const notifCount = 3

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
        className="sticky top-0 z-50 h-[4.79rem] flex items-center justify-between flex-shrink-0 font-[lexend] overflow-hidden px-3 sm:px-5 md:px-6 gap-2 sm:gap-4 backdrop-blur-md"
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
            <div
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