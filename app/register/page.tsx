'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
];

const LEVELS = ['ND 1FT', 'ND 2FT', 'ND 1PT', 'ND 2PT', 'ND 3PT', 'HND 1FT', 'HND 2FT', 'HND 1PT', 'HND 2PT', 'HND 3PT'];

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = [
    { label: '', color: 'bg-gray-200' },
    { label: 'Weak', color: 'bg-red-500' },
    { label: 'Fair', color: 'bg-yellow-500' },
    { label: 'Good', color: 'bg-blue-500' },
    { label: 'Strong', color: 'bg-[#1a5c2a]' },
  ];
  return { score, ...map[score] };
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    matricNumber: '',
    email: '',
    department: '',
    level: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);
  const passwordsMatch = form.confirmPassword !== '' && form.password === form.confirmPassword;
  const passwordsMismatch = form.confirmPassword !== '' && form.password !== form.confirmPassword;

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
  }

  function validate(): string {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'Please enter your full name.';
    if (!form.matricNumber.trim()) return 'Please enter your matric number.';
    if (!form.email.trim() || !form.email.includes('@')) return 'Please enter a valid email address.';
    if (!form.department) return 'Please select your department.';
    if (!form.level) return 'Please select your level.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.agreed) return 'Please agree to the Privacy Policy and Terms of Service.';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          matricNumber: form.matricNumber,
          email: form.email,
          department: form.department,
          level: form.level,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Registration failed. Please try again.'); return; }
      router.push('/dashboard/student');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full h-10 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition bg-white';

  return (
    /*
     * KEY LAYOUT TRICK (used by Notion, Linear, Vercel):
     * — Outer shell: h-screen overflow-hidden (clips everything to viewport)
     * — Left panel:  fixed height, no overflow (never scrolls)
     * — Right panel: overflow-y-auto (only the form area scrolls)
     * Result: left stays anchored, right scrolls independently if needed.
     * On most desktop screens the form fits without any scrolling at all.
     */
    <div className="h-screen overflow-hidden flex">

 {/* ───────── LEFT PANEL (NOW PREMIUM BACKGROUND) ───────── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between px-8 py-8">

        {/* Background Image */}
        <Image
          src="/health8.jpg"
          alt="Yabatech Campus"
          fill
          className="object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-green-950/85" />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <Image src="/favicon.png" width={55} height={55} alt="Logo" />
            <div>
              <p className="text-white text-xl font-semibold">MindBridge</p>
              <p className="text-white/60 text-sm">Yabatech Mental Health Platform</p>
            </div>
          </Link>

          <h2 className="text-4xl font-bold text-white leading-tight mb-5">
            Your journey to <span className="text-yellow-400">better wellbeing</span> starts here.
          </h2>

          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-md">
            Join thousands of students accessing safe, private and professional mental health support.
          </p>

          <div className="space-y-6">
            {[
              { n: '1', t: 'Create account', d: 'Register with your school details' },
              { n: '2', t: 'Get assessed', d: 'Understand your mental wellbeing' },
              { n: '3', t: 'Get support', d: 'Book or chat with counsellors' },
            ].map((i) => (
              <div key={i.n} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-400 text-green-900 flex items-center justify-center text-xs font-bold">
                  {i.n}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{i.t}</p>
                  <p className="text-white/60 text-xs">{i.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © 2025 MindBridge — Yabatech
        </p>
      </div>

      {/* ── RIGHT PANEL — scrollable form area ── */}
      <div className="flex-1 overflow-y-auto bg-white  py-8 lg:px-2">
        <div className="w-full max-w-md mx-auto">

          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/favicon.png" width={52} height={52} alt="Logo" />

              <div className="leading-tight">
                <p className="text-lg font-semibold">MindBridge</p>
                <p className="text-xs text-white/60">
                  Yabatech Mental Health Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e8f5ec] border border-[#b6dfc0] text-[#1a5c2a] text-xs font-medium px-3 py-1 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a5c2a]" />
            Student Registration
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">Create your account</h1>
          <p className="text-sm text-gray-500 mb-5">
            Already have one?{' '}
            <Link href="/login" className="text-[#1a5c2a] font-medium hover:underline">Sign in here</Link>
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-3 py-2.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Andrew"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Ayemo"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Matric + Email row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Matric number</label>
                <input
                  type="text"
                  value={form.matricNumber}
                  onChange={(e) => update('matricNumber', e.target.value)}
                  placeholder="P/ND/23/3210083"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Institutional email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="student@yabatech.edu.ng"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Department + Level row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => update('department', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => update('level', e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select level</option>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Password + Confirm row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={inputClass}
                />
                {form.password && (
                  <div className="mt-1.5">
                    <div className="h-0.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      />
                    </div>
                    {strength.label && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{strength.label}</p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className={inputClass}
                />
                {passwordsMatch && (
                  <p className="text-[10px] text-[#1a5c2a] mt-1">✓ Passwords match</p>
                )}
                {passwordsMismatch && (
                  <p className="text-[10px] text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="agree"
                checked={form.agreed}
                onChange={(e) => update('agreed', e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 accent-[#1a5c2a] shrink-0 cursor-pointer"
              />
              <label htmlFor="agree" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link href="/privacy" className="text-[#1a5c2a] font-medium hover:underline">Privacy Policy</Link>
                {' '}and{' '}
                <Link href="/terms" className="text-[#1a5c2a] font-medium hover:underline">Terms of Service</Link>.
                My data will be handled in accordance with NDPR 2019.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a5c2a] hover:bg-[#2d7a3e] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
            >
              {loading ? 'Creating account...' : 'Create my account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1a5c2a] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}