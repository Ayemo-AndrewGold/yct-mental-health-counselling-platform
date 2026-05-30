'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { ShieldCheck, Menu, X, ChevronRight, LogOut } from 'lucide-react'

const navLinks = [
  { name: 'Home',    path: '/' },
  { name: 'About',   path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen]   = useState(false)
  const [user, setUser]   = useState<{ full_name: string } | null>(null)

  useEffect(() => {
    const stored = Cookies.get('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    Cookies.remove('user')
    Cookies.remove('access')
    Cookies.remove('refresh')
    window.location.reload()
  }

  const isActive = (path: string) => pathname === path

  const firstName = user?.full_name?.split(' ')[0] ?? ''
  const initials  = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? ''

  return (
    <header className="bg-[#071a0f] border-b border-white/[0.06] sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-[68px]">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-[10px] no-underline group">
          {/* Swap the div below for your real <Image> if preferred */}
          <div className="w-[38px] h-[38px] rounded-[10px] bg-gradient-to-br from-green-800 to-green-400
                          flex items-center justify-center text-white font-extrabold text-base flex-shrink-0"
               style={{ fontFamily: 'Syne, sans-serif' }}>
            <Image src="/favicon.png" width={55} height={55} alt="Logo" />
          </div>
          {/* Uncomment to use your favicon instead: */}
          {/* <Image src="/favicon.png" width={38} height={38} alt="MindBridge logo" className="rounded-[10px]" /> */}
          <div className="leading-tight">
            <span className="block text-[1.05rem] font-bold text-white"
                  style={{ fontFamily: 'Syne, sans-serif' }}>
              MindBridge
            </span>
            <span className="block text-[0.68rem] text-white/35">
              Yabatech Mental Health Platform
            </span>
          </div>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              className={`relative text-[0.9rem] pb-[2px] transition-colors duration-200 no-underline
                          after:absolute after:left-0 after:-bottom-[2px] after:h-[2px] after:rounded-full
                          after:bg-yellow-400 after:transition-all after:duration-250
                          ${isActive(path)
                            ? 'text-yellow-400 after:w-full'
                            : 'text-white/65 hover:text-yellow-300 after:w-0 hover:after:w-full'
                          }`}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* ── Desktop right ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Auth: guest vs user */}
          {user ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/10
                         rounded-full pl-1 pr-4 py-1 cursor-pointer
                         hover:bg-white/[0.10] transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-800 to-green-400
                              flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                   style={{ fontFamily: 'Syne, sans-serif' }}>
                {initials}
              </div>
              <span className="text-[0.82rem] text-white/70">{firstName}</span>
              <LogOut size={13} className="text-white/30 ml-1" />
            </button>
          ) : (
            <Link href="/login">
              <button
                className="bg-yellow-400 text-[#071a0f] px-5 py-2 rounded-[9px] text-[0.88rem] font-bold
                           border-none cursor-pointer hover:-translate-y-px
                           hover:shadow-[0_4px_16px_rgba(251,191,36,0.35)] transition-all duration-200"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                Login
              </button>
            </Link>
          )}

        {/* Sign Up */}
          <Link
            href="/register"
            className="inline-flex items-center gap-[6px] bg-white/[0.06] border border-white/10
                       text-white/60 text-[0.82rem] px-[14px] py-[7px] rounded-full no-underline
                       hover:bg-white/[0.10] hover:border-white/20 hover:text-white transition-all duration-200"
          >
            <span className="w-[7px] h-[7px] bg-green-400 rounded-full animate-pulse flex-shrink-0" />
            Sign Up
          </Link>
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <X size={22} className="text-white/80" />
          ) : (
            <Menu size={22} className="text-white/80" />
          )}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="md:hidden bg-[#071a0f] border-t border-white/[0.07] px-6 pb-6 pt-2 flex flex-col gap-1">

          {navLinks.map(({ name, path }) => (
            <Link
              key={path}
              href={path}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between text-[0.95rem] py-[10px]
                          border-b border-white/[0.06] no-underline transition-colors duration-200
                          ${isActive(path) ? 'text-yellow-400' : 'text-white/65 hover:text-yellow-300'}`}
            >
              {name}
              <ChevronRight size={14} className="text-white/25" />
            </Link>
          ))}

          {/* Mobile actions */}
          <div className="flex flex-col gap-[10px] mt-4">
            <Link href="/register" onClick={() => setOpen(false)}>
              <div className="flex items-center justify-center gap-2 bg-white/[0.05] border border-white/10
                              text-white/60 text-[0.88rem] py-[11px] rounded-[10px] cursor-pointer">
                <span className="w-[5px] h-[5px] bg-green-400 rounded-full animate-pulse" />
                Sign Up
              </div>
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-white/[0.05] border border-white/10
                           text-white/65 text-[0.88rem] py-[11px] rounded-[10px] cursor-pointer w-full"
              >
                <LogOut size={15} />
                Logout ({firstName})
              </button>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>
                <button
                  className="w-full bg-yellow-400 text-[#071a0f] text-[0.95rem] font-bold
                             py-[12px] rounded-[10px] border-none cursor-pointer"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}



