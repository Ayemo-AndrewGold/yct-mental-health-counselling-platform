'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Cookies from 'js-cookie'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import toast, { Toast } from "react-hot-toast"

const SLIDES = [
  { src: '/health1.jpg', alt: 'Mental health support' },
  { src: '/health2.jpg', alt: 'Counselling session' },
  { src: '/health3.jpg', alt: 'Student wellbeing' },
  { src: '/health4.jpg', alt: 'Group support' },
  { src: '/health9.png', alt: 'Yabatech campus' },
  { src: '/health5.jpg', alt: 'Safe space' },
]

const TRUST_ITEMS = [
  'Secure student login system',
  'Encrypted counselling records',
  'Anonymous support available',
  'Free for all Yabatech students',
]

export default function StudentLoginPage() {
  const router = useRouter()

  const [identifier,   setIdentifier]   = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)
  const [anonLoading,  setAnonLoading]  = useState(false)
  const [current,      setCurrent]      = useState(0)

  /* ── Slider ── */
  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1), 4500)
    return () => clearInterval(t)
  }, [current, goTo])

  /* ── Login ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!identifier.trim() || !password) {
      toast.error('Please fill in both fields.')
      return
    }
    setLoading(true)
    try {
      const res  = await fetch('https://yct-mental-health-counselling-platform.onrender.com/api/auth/login/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: identifier, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Invalid credentials.'); return }
      if (data.user.role !== 'student') {
        toast.error('Access denied. Student accounts only.')
        return
      }
      Cookies.set('access',  data.tokens.access,          { expires: 1 })
      Cookies.set('refresh', data.tokens.refresh,         { expires: 7 })
      Cookies.set('user',    JSON.stringify(data.user),   { expires: 1 })
      
      toast.success(
        data.message || 'Login successful'
      )

      setTimeout(() => {
        router.push('/dashboard/student')
      })
      
    } catch {
      toast.error('Unable to connect to the server. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Anonymous ── */
  async function handleAnonymous() {
    setAnonLoading(true)
    try {
      Cookies.set('user', JSON.stringify({ role: 'anonymous' }), { expires: 1 })
      router.push('/anonymous')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setAnonLoading(false)
    }
  }

  const inputCls =
    'w-full h-11 border border-[#e2e8f0] rounded-[9px] px-3 text-[0.88rem] text-[#0e2318] bg-white ' +
    'placeholder:text-[#b0bec5] outline-none transition-all duration-200 ' +
    'focus:border-[#166534] focus:shadow-[0_0_0_3px_rgba(22,101,52,0.08)]'

  return (
    <div className="flex min-h-screen bg-white">

      {/* ══════════════════════════════════════
          LEFT PANEL — Image Slider (desktop)
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex w-[50%] flex-shrink-0 relative overflow-hidden bg-[#071a0f]">

        {/* Sliding images */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a0ff2] via-[#0e3320d5] to-[#071a0fec]" />

        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-10 w-full">

          {/* Top */}
          <div>
            <Link href="/" className="flex items-center gap-[10px] no-underline mb-12">
              <div
                className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-green-800 to-green-400 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                <Image src="/favicon.png" width={55} height={55} alt="Logo" className="rounded-[9px]" />
              </div>
              <div>
                <span className="block text-[1.3rem] font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  MindBridge
                </span>
                <span className="block text-[0.95rem] text-white/60">Yabatech Mental Health Platform</span>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] text-yellow-300 text-[0.80rem] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
              <span className="w-[5px] h-[5px] rounded-full bg-yellow-400 animate-pulse flex-shrink-0" />
              Welcome back
            </div>

            <h2
              className="text-[2.5rem] font-extrabold text-white leading-[1.2] tracking-tight mb-4"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Your{' '}
              <span className="text-yellow-400">wellbeing</span>
              <br />journey continues.
            </h2>

            <p className="text-[0.95rem] text-white/50 leading-[1.75] mb-10 max-w-xs">
              Sign in to access counselling, track your progress, and get the support you deserve.
            </p>

            {/* Trust list */}
            <div className="flex flex-col gap-4">
              {TRUST_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-[7px] h-[7px] rounded-full bg-yellow-400/70 flex-shrink-0" />
                  <span className="text-white/65 text-[0.95rem]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — dots + copyright */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-[8px]">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-[3px] rounded-full border-none cursor-pointer transition-all duration-300 ${
                    i === current ? 'bg-yellow-400 w-6' : 'bg-white/25 w-3'
                  }`}
                />
              ))}
            </div>
            <p className="text-[0.85rem] text-white/25">© 2026 MindBridge · Yaba College of Technology</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 sm:px-10 bg-white">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-[10px] mb-8 lg:hidden">
            <div
              className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-green-800 to-green-400 flex items-center justify-center text-white font-extrabold text-[15px] flex-shrink-0"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              <Image src="/favicon.png" width={55} height={55} alt="Logo" className="rounded-[9px]" />
            </div>
            <div>
              <span className="block text-[1.3rem] font-bold text-[#0e2318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                MindBridge
              </span>
              <span className="block text-[0.90rem] text-[#7a9c8a]">Yabatech Mental Health Platform</span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-[6px] bg-green-50 border border-green-200 text-green-800 text-[0.77rem] font-semibold px-3 py-1 rounded-full mb-4">
            <span className="w-[5px] h-[5px] rounded-full bg-green-700 flex-shrink-0" />
            Student Portal
          </div>

          <h1
            className="text-[2.2rem] font-extrabold text-[#0e2318] mb-1 tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Log in
          </h1>
          <p className="text-[0.95rem] text-[#7a9c8a] mb-6">
            Access your counselling dashboard
          </p>

          {/* Error */}
          {/* {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[0.77rem] rounded-[10px] px-3 py-[10px] mb-4">
              <span className="w-[6px] h-[6px] rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )} */}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-3">

            {/* Identifier */}
            <div className="flex flex-col gap-[5px]">
              <label className="text-[0.95rem] font-medium text-[#4b7060]">
                Matric number or email
              </label>
              <input
                className={inputCls}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setError('') }}
                placeholder="P/ND/23/3210083 or you@yabatech.edu.ng"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[5px]">
              <div className="flex items-center justify-between">
                <label className="text-[0.95rem] font-medium text-[#4b7060]">Password</label>
                <Link href="/forgot-password" className="text-[0.80rem] text-[#166534] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={inputCls + ' pr-10'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0bec5] hover:text-[#4b7060] transition-colors bg-transparent border-none cursor-pointer p-0"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff size={16} strokeWidth={1.75} />
                    : <Eye     size={16} strokeWidth={1.75} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0e2318] text-white text-[1rem] font-bold rounded-[11px] border-none cursor-pointer mt-1
                         hover:bg-[#1a3d29] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(14,35,24,0.2)]
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-[#f1f5f9] flex-1" />
            <div className="h-px bg-[#f1f5f9] flex-1" />
          </div>


          {/* Footer links */}
          <p className="text-center text-[0.9rem] text-[#7a9c8a] mt-6">
            No account?{' '}
            <Link href="/register" className="text-[#166534] font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}