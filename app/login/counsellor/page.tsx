'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie'

export default function CounsellorLoginPage() {
  const router = useRouter();

  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!staffId.trim() || !password) {
      setError('Please enter your Staff ID and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://yct-mental-health-counselling-platform.onrender.com/api/auth/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ email: staffId, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Invalid credentials.'); 
        return;}

        //Block non-counsellors 
        if (data.user.role !== 'counsellor'){
          setError('Access denied. Counsellor account only');
          return;
        }
       Cookies.set('access',  data.tokens.access,        { expires: 1, sameSite: 'lax' })
      Cookies.set('refresh', data.tokens.refresh,       { expires: 7, sameSite: 'lax' })
      Cookies.set('user',    JSON.stringify(data.user), { expires: 1, sameSite: 'lax' })
        router.push('/dashboard/counsellor');
    } catch {
      setError('something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full h-12 border border-teal-900/60 rounded-xl px-4 text-base text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/15 focus:border-teal-600 transition';

  return (
    <div className="h-screen overflow-hidden flex" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Lora:wght@600;700&display=swap');
        .counsellor-bg { background: linear-gradient(135deg, #0d9488 0%, #0f766e 40%, #134e4a 100%); }
        .blob-1 { background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%); }
        .blob-2 { background: radial-gradient(circle, rgba(204,251,241,0.15) 0%, transparent 70%); }
        .card-soft { background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.18); }
        .heart-pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .right-panel { background: linear-gradient(160deg, #f0fdfa 0%, #ffffff 50%, #f5f3ff 100%); }
      `}</style>

      {/* ───────── LEFT PANEL – Warm & Human ───────── */}
      <div className="hidden lg:flex w-[46%] relative flex-col justify-between px-12 py-14 counsellor-bg overflow-hidden">

        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 blob-1 rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-72 h-72 blob-2 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blob-1 rounded-full pointer-events-none opacity-30" />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Image src="/favicon.png" width={32} height={32} alt="Logo" />
            </div>
            <div>
              <p className="text-white text-xl font-bold" style={{ fontFamily: "'Lora', serif" }}>MindBridge</p>
              <p className="text-teal-200/70 text-xs tracking-wide">Counsellor Portal</p>
            </div>
          </Link>

          {/* Heart icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mb-8 heart-pulse">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 15.5 3 9.5C3 7.01 4.99 5 7.5 5C9.14 5 10.61 5.83 11.5 7.09C12.39 5.83 13.86 5 15.5 5C18.01 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z"
                stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.2)" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Lora', serif" }}>
            Hello,<br />
            <span className="text-teal-200">Counsellor 🤝</span>
          </h2>

          <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-sm">
            Your work transforms lives. Sign in to manage your student sessions,
            review referrals, and track wellbeing progress.
          </p>

          {/* Feature cards */}
          <div className="space-y-3">
            {[
              { icon: '📅', title: 'Session Manager', desc: 'View & schedule appointments' },
              { icon: '📋', title: 'Case Notes', desc: 'Secure, encrypted records' },
              { icon: '📊', title: 'Student Progress', desc: 'Wellbeing analytics at a glance' },
            ].map((card) => (
              <div key={card.title} className="card-soft rounded-xl px-4 py-3 flex items-center gap-4">
                <span className="text-2xl">{card.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{card.title}</p>
                  <p className="text-white/60 text-xs">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/30">
          © 2026 MindBridge · Confidential Counsellor Access
        </p>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="flex-1 flex items-center justify-center right-panel px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile header */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
              <Image src="/favicon.png" width={26} height={26} alt="Logo" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">MindBridge</p>
              <p className="text-xs text-slate-500">Counsellor Portal</p>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs px-3 py-1.5 rounded-full mb-6">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 15.5 3 9.5C3 7.01 4.99 5 7.5 5C9.14 5 10.61 5.83 11.5 7.09C12.39 5.83 13.86 5 15.5 5C18.01 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z"
                stroke="currentColor" strokeWidth="1.8" fill="none" />
            </svg>
            Counsellor Portal
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Lora', serif" }}>
            Welcome back
          </h1>
          <p className="text-slate-500 mb-8 text-sm">
            Sign in to your counselling dashboard
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                className={inputClass}
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Staff ID or email"
              />
            </div>

            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input type="checkbox" className="accent-teal-600 w-4 h-4 rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-teal-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full h-12 bg-teal-700 text-white rounded-xl text-base font-semibold hover:bg-teal-600 transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Info note */}
          <div className="mt-6 p-4 rounded-xl bg-teal-50 border border-teal-100 flex gap-3">
            <span className="text-teal-600 flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <p className="text-xs text-teal-700 leading-relaxed">
              Your account is created by a YCT MindBridge administrator. Contact IT support if you don't have access yet.
            </p>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Not a counsellor?{' '}
            <Link href="/login/student" className="text-teal-700 font-semibold hover:underline">
              Student login
            </Link>
            {' · '}
            <Link href="/login/admin" className="text-teal-700 font-semibold hover:underline">
              Admin login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}