'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const LEVELS = ['ND 1', 'ND 2', 'HND 1', 'HND 2'];

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

      {/* ── LEFT PANEL — fixed, never scrolls ── */}
      <div className="hidden lg:flex w-75 xl:w-150 shrink-0 flex-col justify-between bg-[#1a5c2a] px-8  py-10">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-full bg-[#f5b829] flex items-center justify-center text-[#1a5c2a] text-xs font-bold shrink-0">
              YCT
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">MindBridge</p>
              <p className="text-[10px] text-white/55">Yabatech Mental Health Platform</p>
            </div>
          </div>

          <h2 className="text-2xl pt-15 font-bold text-white leading-snug mb-3">
            Your journey to{' '}
            <span className="text-[#f5b829]">better wellbeing</span>{' '}
            starts here.
          </h2>

          <p className="text-xs text-white/65 leading-relaxed mb-7">
            Create your free account and get immediate access to mental health
            support designed for Yabatech students.
          </p>

          <div className="space-y-4">
            {[
              { n: '1', title: 'Create your account', desc: 'Register with your matric number and email.' },
              { n: '2', title: 'Take a quick assessment', desc: 'Understand your mental health status in minutes.' },
              { n: '3', title: 'Connect with support', desc: 'Book a session or chat with a counsellor securely.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-[#f5b829]/20 border border-[#f5b829]/45 text-[#f5b829] text-[11px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                  {n}
                </div>
                <div>
                  <p className="text-xs font-medium text-white">{title}</p>
                  <p className="text-[11px] text-white/55 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-[10px] text-white/30">
            © 2025 MindBridge · Dept. of Computer Technology, Yaba College of Technology
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — scrollable form area ── */}
      <div className="flex-1 overflow-y-auto bg-white px-2 py-8 lg:px-2">
        <div className="w-full max-w-md mx-auto">

          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-xs font-bold">
              YCT
            </div>
            <p className="text-sm font-medium text-[#1a5c2a]">MindBridge</p>
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