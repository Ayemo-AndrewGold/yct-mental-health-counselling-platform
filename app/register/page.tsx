'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const DEPARTMENTS = [
  'Computer Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Accountancy',
  'Mass Communication',
  'Food Technology',
  'Science Laboratory Technology',
  'Other',
]

const LEVELS = [
  'ND 1FT', 'ND 2FT', 'ND 1PT', 'ND 2PT', 'ND 3PT',
  'HND 1FT', 'HND 2FT', 'HND 1PT', 'HND 2PT', 'HND 3PT',
]

const SLIDES = [
  { src: '/health1.jpg', alt: 'Mental health support' },
  { src: '/health2.jpg', alt: 'Counselling session' },
  { src: '/health3.jpg', alt: 'Student wellbeing' },
  { src: '/health4.jpg', alt: 'Group support' },
  { src: '/health5.jpg', alt: 'Safe space' },
  { src: '/health8.jpg', alt: 'Yabatech campus' },
]

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const map = [
    { label: '',       color: '#e2e8f0' },
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f59e0b' },
    { label: 'Good',   color: '#3b82f6' },
    { label: 'Strong', color: '#166534' },
  ]
  return { score, ...map[score] }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[0.75rem] font-medium text-[#4b7060]">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full h-10 border border-[#e2e8f0] rounded-[9px] px-3 text-[0.85rem] text-[#0e2318] bg-white ' +
  'placeholder:text-[#b0bec5] outline-none transition-all duration-200 ' +
  'focus:border-[#166534] focus:shadow-[0_0_0_3px_rgba(22,101,52,0.08)]'

const sectionLabel =
  'text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-[#b0bec5] ' +
  'flex items-center gap-2'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '', lastName: '', matricNumber: '', email: '',
    department: '', level: '', password: '', confirmPassword: '', agreed: false,
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)

  const strength          = getStrength(form.password)
  const passwordsMatch    = form.confirmPassword !== '' && form.password === form.confirmPassword
  const passwordsMismatch = form.confirmPassword !== '' && form.password !== form.confirmPassword

  /* ── Slider auto-play ── */
  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1), 4500)
    return () => clearInterval(t)
  }, [current, goTo])

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  function validate(): string {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Please enter your full name.'
    if (!form.matricNumber.trim())                        return 'Please enter your matric number.'
    if (!form.email.trim() || !form.email.includes('@'))  return 'Please enter a valid email address.'
    if (!form.department)                                 return 'Please select your department.'
    if (!form.level)                                      return 'Please select your level.'
    if (form.password.length < 8)                         return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword)           return 'Passwords do not match.'
    if (!form.agreed)                                     return 'Please agree to the Privacy Policy and Terms of Service.'
    return ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:     `${form.firstName} ${form.lastName}`,
          email:         form.email,
          password:      form.password,
          role:          'student',
          matric_number: form.matricNumber,
          department:    form.department,
          level:         form.level,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Registration failed. Please try again.'); return }
      router.push('/login')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white">

      {/* ══════════════════════════════════════
          LEFT PANEL — Image Slider (desktop)
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex w-[50%] flex-shrink-0 flex-col justify-between relative overflow-hidden bg-[#071a0f]">

        {/* ── Slider images ── */}
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

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#071a0ff0] via-[#0e3320d8] to-[#071a0fe8]" />

        {/* Grain texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col justify-between h-full px-9 py-10">

          {/* Top: logo + copy */}
          <div>
            <Link href="/" className="flex items-center gap-[10px] no-underline mb-10">
              <div
                className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-green-800 to-green-400 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                <Image src="/favicon.png" width={36} height={36} alt="Logo" className="rounded-[9px]" />
              </div>
          
              <div>
                <span className="block text-[1.3rem] font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  MindBridge
                </span>
                <span className="block text-[0.85rem] text-white/60">Yabatech Mental Health Platform</span>
              </div>
            </Link>

            <h2
              className="text-[2.5rem] font-extrabold text-white leading-[1.2] tracking-tight mb-3"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Your journey to{' '}
              <span className="text-yellow-400">better wellbeing</span>{' '}
              starts here.
            </h2>

            <p className="text-[0.90rem] text-white/60 leading-[1.7] mb-8 ">
              Join thousands of Yabatech students accessing safe, private and professional mental health support.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-[1.1rem] mb-5">
              {[
                { n: '1', title: 'Create account', desc: 'Register with your school details' },
                { n: '2', title: 'Get assessed',    desc: 'Understand your mental wellbeing' },
                { n: '3', title: 'Get support',     desc: 'Book or chat with counsellors' },
              ].map(({ n, title, desc }) => (
                <div key={n} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full bg-yellow-400/[0.12] border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-[18px] font-bold flex-shrink-0"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {n}
                  </div>
                  <div>
                    <p className="text-white text-[1.2rem] font-semibold">{title}</p>
                    <p className="text-white/60 text-[0.85rem] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 ">
              {['100% Confidential', 'NDPR Compliant', 'Encrypted'].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-[5px] bg-white/[0.05] border border-white/[0.08] text-white/45 text-[0.8rem] px-[10px] py-1 rounded-full"
                >
                  <span className="w-[5px] h-[5px] rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom: slide dots + copyright */}
          <div className="flex flex-col gap-4">
            {/* Dot navigation */}
            <div className="flex gap-[8px]">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={`h-[3px] rounded-full border-none cursor-pointer transition-all duration-300 ${
                    i === current
                      ? 'bg-yellow-400 w-6'
                      : 'bg-white/25 w-3'
                  }`}
                />
              ))}
            </div>
            <p className="text-[0.82rem] text-white/25">© 2026 MindBridge — Yabatech</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Scrollable form
      ══════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-10">
        <div className="w-full max-w-[600px] mx-auto">

          {/* Mobile logo (hidden on desktop) */}
          <div className="flex items-center gap-[10px] mb-6 lg:hidden">
            <div
              className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-green-800 to-green-400 flex items-center justify-center text-white font-extrabold text-[15px] flex-shrink-0"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              <Image src="/favicon.png" width={55} height={55} alt="Logo" />
            </div>
            <div>
              <span className="block text-[1rem] font-bold text-[#0e2318]" style={{ fontFamily: 'Syne, sans-serif' }}>
                MindBridge
              </span>
              <span className="block text-[0.95rem] text-[#7a9c8a]">Yabatech Mental Health Platform</span>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-[6px] bg-green-50 border border-green-200 text-green-800 text-[0.80rem] font-semibold px-3 py-1 rounded-full mb-3">
            <span className="w-[5px] h-[5px] rounded-full bg-green-700 flex-shrink-0" />
            Student Registration
          </div>

          <h1
            className="text-[2.2rem] font-extrabold text-[#0e2318] mb-[3px]"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Create your account
          </h1>
          <p className="text-[0.82rem] text-[#7a9c8a] mb-5">
            Already have one?{' '}
            <Link href="/login" className="text-[#166534] font-medium hover:underline">Sign in here</Link>
          </p>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[0.8rem] rounded-[10px] px-3 py-[10px] mb-4">
              <span className="w-[6px] h-[6px] rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">

            {/* ── Personal info ── */}
            <p className={sectionLabel}>
              Personal info
              <span className="flex-1 h-px bg-[#e7ebf0]" />
            </p>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="First name">
                <input className={inputCls} type="text" placeholder="Andrew"
                  value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
              </Field>
              <Field label="Last name">
                <input className={inputCls} type="text" placeholder="Ayemo"
                  value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Matric number">
                <input className={inputCls} type="text" placeholder="P/ND/23/3210083"
                  value={form.matricNumber} onChange={(e) => update('matricNumber', e.target.value)} />
              </Field>
              <Field label="Institutional email">
                <input className={inputCls} type="email" placeholder="you@yabatech.edu.ng"
                  value={form.email} onChange={(e) => update('email', e.target.value)} />
              </Field>
            </div>

            {/* ── Academic info ── */}
            <p className={sectionLabel}>
              Academic info
              <span className="flex-1 h-px bg-[#f1f5f9]" />
            </p>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Department">
                <select className={inputCls} value={form.department} onChange={(e) => update('department', e.target.value)}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Level">
                <select className={inputCls} value={form.level} onChange={(e) => update('level', e.target.value)}>
                  <option value="">Select level</option>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </div>

            {/* ── Security ── */}
            <p className={sectionLabel}>
              Security
              <span className="flex-1 h-px bg-[#f1f5f9]" />
            </p>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              <Field label="Password">
                <input className={inputCls} type="password" placeholder="Min. 8 characters"
                  value={form.password} onChange={(e) => update('password', e.target.value)} />
                {form.password && (
                  <div className="mt-[5px]">
                    <div className="h-[3px] w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
                      />
                    </div>
                    {strength.label && (
                      <p className="text-[0.68rem] text-[#94a3b8] mt-1">{strength.label}</p>
                    )}
                  </div>
                )}
              </Field>
              <Field label="Confirm password">
                <input className={inputCls} type="password" placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                {passwordsMatch    && <p className="text-[0.68rem] text-[#166534] mt-1">✓ Passwords match</p>}
                {passwordsMismatch && <p className="text-[0.68rem] text-red-500 mt-1">Passwords do not match</p>}
              </Field>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="agree" type="checkbox" checked={form.agreed}
                onChange={(e) => update('agreed', e.target.checked)}
                className="w-[14px] h-[14px] mt-[1px] accent-[#166534] flex-shrink-0 cursor-pointer"
              />
              <label htmlFor="agree" className="text-[0.79rem] text-[#7a9c8a] leading-[1.55] cursor-pointer">
                I agree to the{' '}
                <Link href="/privacy" className="text-[#166534] font-medium hover:underline">Privacy Policy</Link>
                {' '}and{' '}
                <Link href="/terms" className="text-[#166534] font-medium hover:underline">Terms of Service</Link>.
                {' '}My data will be handled in accordance with NDPR 2019.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#0e2318] text-white text-[0.92rem] font-bold rounded-[11px] border-none cursor-pointer
                         hover:bg-[#1a3d29] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(14,35,24,0.2)]
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-200"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              {loading ? 'Creating account…' : 'Create my account'}
            </button>
          </form>

          <p className="text-center text-[0.8rem] text-[#7a9c8a] mt-3">
            Already have an account?{' '}
            <Link href="/login" className="text-[#166534] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}