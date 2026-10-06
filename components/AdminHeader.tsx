'use client'

import React, { useEffect, useState } from 'react'
import { getMe } from '@/lib/api'
import Cookies from 'js-cookie'
import { Bell, Search, ChevronDown, Sun, Moon, X, Shield } from 'lucide-react'
import Link from 'next/link'

interface User { full_name: string; email: string; role: string }

function getGreeting(hour: number) {
  if (hour < 12) return { text: 'Good morning',  emoji: '☀️'  }
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' }
  return              { text: 'Good evening',    emoji: '🌙'  }
}
function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const NOTIFS = [
  { title: 'High-severity case unattended', sub: 'ANON-48392 · 2 min ago',  dot: 'bg-red-500'   },
  { title: 'Counsellor capacity at 90%',    sub: 'Mr. Alomaja · 1 hr ago',  dot: 'bg-amber-400' },
  { title: 'Monthly report ready',          sub: 'April 2026 · 3 hrs ago',  dot: 'bg-blue-400'  },
]

export default function AdminHeader() {
  const [user,        setUser]       = useState<User | null>(null)
  const [dateStr,     setDateStr]    = useState('')
  const [hour,        setHour]       = useState(new Date().getHours())
  const [isDarkMode,  setIsDarkMode] = useState(false)
  const [showSearch,  setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery]= useState('')
  const [showNotif,   setShowNotif]  = useState(false)

  useEffect(() => {
    const now = new Date()
    setHour(now.getHours())
    setDateStr(
      now.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
      + ' · Yaba College of Technology'
    )
    const stored = Cookies.get('user')
    if (stored) setUser(JSON.parse(stored))
    getMe().then(data => {
      if (data) { setUser(data); Cookies.set('user', JSON.stringify(data), { expires: 1 }) }
    })
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') setIsDarkMode(true)
    }
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ isDarkMode: boolean }>
      setIsDarkMode(ev.detail.isDarkMode)
    }
    window.addEventListener('themeToggle', handler)
    return () => window.removeEventListener('themeToggle', handler)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-notif]')) setShowNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const { text: greetText, emoji } = getGreeting(hour)
  const firstName = user?.full_name?.split(' ')[0] ?? 'Admin'
  const initials  = user?.full_name ? getInitials(user.full_name) : 'SA'

  /* Theme tokens */
  const headerBorder = isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.09)'
  const pillBg       = isDarkMode ? 'rgba(255,255,255,0.08)'           : 'rgba(0,0,0,0.05)'
  const pillBorder   = isDarkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.10)'
  const pillHover    = isDarkMode ? 'hover:bg-white/[0.14]'            : 'hover:bg-black/[0.07]'
  const iconColor    = isDarkMode ? 'rgba(255,255,255,0.75)'           : 'rgba(0,0,0,0.55)'
  const searchText   = isDarkMode ? 'rgba(255,255,255,0.4)'            : 'rgba(0,0,0,0.38)'
  const dividerColor = isDarkMode ? 'rgba(255,255,255,0.10)'           : 'rgba(0,0,0,0.10)'
  const notifBorder  = isDarkMode ? 'rgba(10,20,10,1)'                 : '#ffffff'
  /* Amber admin accent */
  const amberBg      = isDarkMode ? 'rgba(245,166,35,0.18)' : 'rgba(245,166,35,0.12)'
  const amberBorder  = isDarkMode ? '1px solid rgba(245,166,35,0.35)' : '1px solid rgba(245,166,35,0.30)'
  const amberText    = isDarkMode ? '#fde68a' : '#92400e'

  return (
    <>
      <header
        className="sticky top-0 z-50 h-[4.79rem] flex items-center justify-between flex-shrink-0 font-[lexend] px-3 sm:px-5 md:px-6 gap-2 sm:gap-4 backdrop-blur-md"
        style={{ borderBottom: headerBorder }}
      >
        {/* Background */}
        {isDarkMode ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80')" }} />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(105deg, rgba(10,20,10,0.97) 0%, rgba(20,45,15,0.93) 40%, rgba(15,35,10,0.90) 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0 bg-white" />
        )}

        <div className="relative flex items-center justify-between w-full gap-2 sm:gap-4">

          {/* LEFT — Greeting */}
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-1.5 leading-tight truncate font-bold"
              style={{ fontFamily:'Syne, sans-serif', fontSize:'18px', color: isDarkMode ? '#ffffff' : '#111827' }}>
              <span className="shrink-0">{emoji}</span>
              <span className="hidden sm:inline truncate">{greetText}, {firstName}</span>
              <span className="sm:hidden truncate">Hi, {firstName}</span>
            </h1>
            <p className="mt-px truncate"
              style={{ fontSize:'13px', color: isDarkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.42)' }}>
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
              <span className="whitespace-nowrap" style={{ fontSize:'13px', color: searchText }}>Search platform…</span>
              <kbd className="rounded px-[5px] py-[1px] ml-1"
                style={{ fontSize:'11px', background: pillBg, border: pillBorder, color: searchText }}>⌘K</kbd>
            </div>

            {/* Mobile search */}
            <button onClick={() => setShowSearch(!showSearch)}
              className={`lg:hidden w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-200 ${pillHover}`}
              style={{ background: pillBg, border: pillBorder }}>
              <Search size={17} style={{ color: iconColor }} />
            </button>

            {/* Admin status pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-[5px]"
              style={{ background: amberBg, border: amberBorder }}>
              <Shield size={12} style={{ color: amberText }} />
              <span className="font-semibold whitespace-nowrap" style={{ fontSize:'12px', color: amberText }}>
                System Admin
              </span>
            </div>

            {/* Notification bell */}
            <div className="relative" data-notif>
              <div
                onClick={() => setShowNotif(p => !p)}
                className={`relative w-[36px] h-[36px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${pillHover}`}
                style={{ background: pillBg, border: pillBorder }}
              >
                <Bell size={17} style={{ color: iconColor }} strokeWidth={1.8} />
                <div className="absolute -top-[2px] -right-[2px] w-[16px] h-[16px] rounded-full bg-red-500 flex items-center justify-center"
                  style={{ border: `2px solid ${notifBorder}` }}>
                  <span className="text-white font-bold" style={{ fontSize:'8px' }}>3</span>
                </div>
              </div>

              {showNotif && (
                <div className="absolute right-0 top-[44px] w-[300px] rounded-2xl overflow-hidden shadow-xl z-50"
                  style={{
                    background: isDarkMode ? '#0d1f0d' : '#fff',
                    border: `1px solid ${isDarkMode ? 'rgba(245,166,35,0.25)' : '#fde68a'}`,
                  }}>
                  <div className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: `1px solid ${isDarkMode ? 'rgba(245,166,35,0.20)' : '#fef3c7'}` }}>
                    <p className="text-[15px] font-bold" style={{ color: isDarkMode ? '#fff' : '#111827' }}>
                      Notifications
                    </p>
                    <span className="text-[9px] font-bold px-2 py-[2px] rounded-full bg-red-100 text-red-600">3 new</span>
                  </div>
                  <div className="max-h-[260px] overflow-y-auto">
                    {NOTIFS.map((n, i) => (
                      <div key={i}
                        className="flex items-start gap-3 px-4 py-3 transition-colors"
                        style={{ borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#fafafa'}` }}>
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: isDarkMode ? '#fff' : '#111827' }}>
                            {n.title}
                          </p>
                          <p className="text-[11px] mt-0.5" style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)':'#9ca3af' }}>
                            {n.sub}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/admin/logs"
                    onClick={() => setShowNotif(false)}
                    className="flex items-center justify-center py-3 text-[13px] font-bold transition-colors hover:opacity-80"
                    style={{ borderTop: `1px solid ${isDarkMode ? 'rgba(245,166,35,0.20)' : '#fef3c7'}`, color: '#f5a623' }}>
                    View all notifications →
                  </Link>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button onClick={toggleDarkMode}
              className="hidden sm:flex items-center rounded-full p-[3px] gap-0.5 transition-all duration-300"
              style={{ background: pillBg, border: pillBorder }}>
              <span className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200 ${!isDarkMode ? 'text-white shadow-sm' : 'text-white/40'}`}
                style={{ background: !isDarkMode ? '#f5a623' : 'transparent' }}>
                <Sun size={15} />
              </span>
              <span className={`w-[28px] h-[28px] rounded-full flex items-center justify-center transition-all duration-200 ${isDarkMode ? 'bg-white/15 text-white' : 'text-black/30'}`}>
                <Moon size={15} />
              </span>
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-[24px]" style={{ background: dividerColor }} />

            {/* Profile chip */}
            <div
              className={`flex items-center gap-2 rounded-full pl-1 pr-1 sm:pr-3 py-1 cursor-pointer transition-all duration-200 ${pillHover}`}
              style={{ background: pillBg, border: pillBorder }}
            >
              <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white font-bold shrink-0"
                style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '11px',
                  background: 'linear-gradient(135deg, #f5a623, #d97706)',
                  border: isDarkMode ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(245,166,35,0.4)',
                }}>
                {initials}
              </div>
              <span className="font-semibold hidden sm:block"
                style={{ fontSize:'14px', color: isDarkMode ? '#ffffff' : '#111827' }}>
                {firstName}
              </span>
              <ChevronDown size={13}
                style={{ color: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)' }}
                strokeWidth={2.5} className="hidden sm:block" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search */}
      {showSearch && (
        <div className="lg:hidden relative z-20 px-3 py-3 transition-all duration-200"
          style={{ background: isDarkMode ? 'rgba(10,20,10,0.97)' : '#ffffff', borderBottom: headerBorder }}>
          <div className="flex items-center gap-2 rounded-full px-4 py-2"
            style={{ background: pillBg, border: pillBorder }}>
            <Search size={15} style={{ color: searchText }} className="shrink-0" />
            <input autoFocus type="text" placeholder="Search platform…"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setShowSearch(false)}
              className="flex-1 bg-transparent focus:outline-none"
              style={{ fontSize:'14px', color: isDarkMode ? '#ffffff' : '#111827' }} />
            <button onClick={() => { setShowSearch(false); setSearchQuery('') }}>
              <X size={16} style={{ color: searchText }} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
