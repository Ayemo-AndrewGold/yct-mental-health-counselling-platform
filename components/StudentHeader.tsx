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
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('theme', next ? 'dark' : 'light')
      window.dispatchEvent(new CustomEvent('themeToggle', { detail: { isDarkMode: next } }))
      return next
    })
  }

  const { text: greetText, emoji } = getGreeting(hour)
  const firstName = user?.full_name?.split(' ')[0] ?? 'Student'
  const initials  = user?.full_name ? getInitials(user.full_name) : 'ST'

  return (
    <>
      <header
        className={`h-16 border-b shadow-md flex items-center justify-between flex-shrink-0 font-[lexend] transition-all duration-300 px-3 sm:px-5 md:px-6 gap-2 sm:gap-4
          ${isDarkMode
            ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-gray-700'
            : 'bg-gradient-to-r from-blue-100 via-white to-purple-200 border-gray-200'
          }`}
      >

        {/* ── LEFT: Greeting — truncates gracefully ── */}
        <div className="min-w-0 flex-1">
          <h1
            className={`flex items-center gap-[5px] text-[0.85rem] sm:text-[0.95rem] font-bold leading-tight truncate ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            <span className="flex-shrink-0">{emoji}</span>
            {/* Full greeting on sm+, short on xs */}
            <span className="hidden sm:inline truncate">{greetText}, {firstName}</span>
            <span className="sm:hidden truncate">Hi, {firstName}</span>
          </h1>
          <p className={`text-[0.65rem] sm:text-[0.72rem] mt-[2px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            {/* Hide institution on very small screens */}
            <span className="hidden md:inline">{dateStr}</span>
            <span className="md:hidden">Yaba College of Technology</span>
          </p>
        </div>

        {/* ── RIGHT ── */}
        <div className="flex items-center gap-2 sm:gap-[10px] flex-shrink-0">

          {/* Desktop search bar — hidden on mobile */}
          <div
            className={`hidden lg:flex items-center gap-[7px] rounded-full border px-4 py-2 cursor-text shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:border-transparent ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 focus-within:ring-blue-500'
                : 'bg-white border-gray-300 focus-within:ring-blue-400'
            }`}
          >
            <Search size={14} className="text-gray-400" strokeWidth={2} />
            <span className={`text-[0.78rem] whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              Search resources…
            </span>
            <kbd className={`text-[0.62rem] rounded-[4px] px-[5px] py-[1px] font-sans ml-1 border ${
              isDarkMode ? 'bg-gray-600 text-gray-400 border-gray-500' : 'bg-gray-100 text-gray-400 border-gray-200'
            }`}>
              ⌘K
            </kbd>
          </div>

          {/* Mobile search toggle — visible below lg */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`lg:hidden p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
            }`}
            aria-label="Toggle search"
          >
            <Search size={17} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
          </button>

          {/* Wellbeing pill — label hidden on xs */}
          <div
            className="inline-flex items-center gap-[6px] rounded-full px-2 sm:px-3 py-[5px] cursor-pointer border transition-all duration-200 flex-shrink-0"
            style={{ background: wb.bg, borderColor: wb.border }}
          >
            <span
              className="w-[7px] h-[7px] rounded-full flex-shrink-0 animate-pulse"
              style={{ background: wb.dot }}
            />
            {/* Hide label text on very small screens — dot alone signals status */}
            <span
              className="hidden sm:inline text-[0.75rem] font-semibold whitespace-nowrap"
              style={{ color: wb.text }}
            >
              {wb.label}
            </span>
          </div>

          {/* Notification bell */}
          <div
            className={`relative p-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex-shrink-0 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Bell size={17} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} strokeWidth={1.8} />
            {notifCount > 0 && (
              <div className="absolute -top-[3px] -right-[3px] w-[15px] h-[15px] rounded-full bg-red-500 border-2 border-white flex items-center justify-center">
                <span className="text-white font-bold" style={{ fontSize: '0.5rem' }}>
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              </div>
            )}
          </div>

          {/* Dark mode toggle — hidden on xs, shown on sm+ */}
          <button
            onClick={toggleDarkMode}
            className={`hidden sm:flex relative items-center p-0.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex-shrink-0 ${
              isDarkMode
                ? 'bg-gradient-to-r from-gray-600 to-gray-700'
                : 'bg-gradient-to-r from-gray-200 to-gray-300'
            }`}
            aria-label="Toggle dark mode"
          >
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
            <Sun
              size={20}
              className={`p-0.5 z-10 transition-colors duration-300 ${!isDarkMode ? 'text-yellow-500' : 'text-gray-400'}`}
            />
            <Moon
              size={20}
              className={`p-0.5 z-10 transition-colors duration-300 ${isDarkMode ? 'text-indigo-400' : 'text-gray-400'}`}
            />
          </button>

          {/* Divider — only on md+ */}
          <div className={`w-px h-[22px] hidden md:block flex-shrink-0 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />

          {/* Profile chip */}
          <div
            className={`flex items-center gap-2 border rounded-full pl-1 py-1 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }
            pr-1 sm:pr-3
            `}
          >
            <div
              className="w-7 h-7 rounded-full bg-gradient-to-br from-green-800 to-green-400 flex items-center justify-center text-white font-bold flex-shrink-0 ring-2 ring-blue-200"
              style={{ fontFamily: 'Syne, sans-serif', fontSize: '10px' }}
            >
              {initials}
            </div>
            {/* Name + chevron only on sm+ */}
            <span className={`text-[0.8rem] font-semibold hidden sm:block ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {firstName}
            </span>
            <ChevronDown size={12} className={`hidden sm:block ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} strokeWidth={2.5} />
          </div>

        </div>
      </header>

      {/* ── Mobile search dropdown ── */}
      {showSearch && (
        <div className={`lg:hidden border-b shadow-md px-3 py-3 transition-all duration-200 z-20 relative ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white/95 border-gray-200 backdrop-blur-sm'
        }`}>
          <div className={`flex items-center gap-2 rounded-full border px-4 py-2 focus-within:ring-2 focus-within:border-transparent transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 focus-within:ring-blue-500'
              : 'bg-gray-50 border-gray-300 focus-within:ring-blue-400'
          }`}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search resources…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
              className={`flex-1 text-[0.85rem] bg-transparent focus:outline-none ${
                isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
              }`}
            />
            <button onClick={() => { setShowSearch(false); setSearchQuery('') }} aria-label="Close search">
              <X size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}