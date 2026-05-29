'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from 'js-cookie'

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('All fields are required for admin access.');
      return;
    }

    setLoading(true);
   try {
    const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ email, password}),
    });
    const data = await res.json();
    if (!res.ok) {setError(data.error || 'Invalid credentials'); return}
    // Block non-admin
    if (data.user.role !== 'admin'){
      setError('Access denied. Admin accounts only.');
      return;
    }
    Cookies.set('access', data.tokens.access);
    Cookies.set('refresh', data.tokens.refresh);
    Cookies.set('user', JSON.stringify(data.user));
    router.push('/dashboard/admin');
   } catch {
    setError('Something went wrong. Please try again.');
   } finally {
    setLoading(false)
   }
  }

  const inputClass =
    'w-full h-12 border border-slate-700 rounded-xl px-4 text-base text-white placeholder:text-slate-500 bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition';

  return (
    <div className="h-screen overflow-hidden flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        .admin-gradient { background: radial-gradient(ellipse at 20% 50%, #1e293b 0%, #0f172a 60%, #020617 100%); }
        .shield-glow { box-shadow: 0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.05); }
        .amber-ring { border: 1px solid rgba(245,158,11,0.3); }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); }
      `}</style>

      {/* ───────── LEFT PANEL – Dark Command Center ───────── */}
      <div className="hidden lg:flex w-[48%] relative flex-col justify-between px-14 py-14 admin-gradient grid-bg">

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-tr-full pointer-events-none" />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 amber-ring flex items-center justify-center">
              <Image src="/favicon.png" width={32} height={32} alt="Logo" />
            </div>
            <div>
              <p className="text-white text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>MindBridge</p>
              <p className="text-slate-500 text-xs tracking-widest uppercase">Admin Console</p>
            </div>
          </Link>

          {/* Shield icon */}
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 amber-ring shield-glow flex items-center justify-center mb-8">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3.5 6.5V11C3.5 16.25 7.17 21.11 12 22.5C16.83 21.11 20.5 16.25 20.5 11V6.5L12 2Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(245,158,11,0.1)" />
              <path d="M9 12L11 14L15 10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Control<br />
            <span className="text-amber-400">Center</span>
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm">
            Restricted access. Only authorized platform administrators may proceed. All sessions are logged and monitored.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { label: 'Students', value: '4,200+' },
              { label: 'Counsellors', value: '18' },
              { label: 'Sessions', value: '1,340' },
            ].map((s) => (
              <div key={s.label} className="stat-card rounded-xl p-4 text-center">
                <p className="text-amber-400 text-lg font-bold">{s.value}</p>
                <p className="text-slate-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              'Full platform oversight',
              'Manage counsellors & students',
              'View analytics & reports',
              'Configure system settings',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-600">
          © 2026 MindBridge · Yabatech · Admin Access Only
        </p>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="flex-1 flex items-center justify-center bg-slate-950 px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile header */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 amber-ring flex items-center justify-center">
              <Image src="/favicon.png" width={26} height={26} alt="Logo" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">MindBridge</p>
              <p className="text-xs text-slate-500">Admin Console</p>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Administrator Portal
          </div>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Sign In
          </h1>
          <p className="text-slate-400 mb-8 text-sm">
            Restricted to authorized personnel only
          </p>

          {error && (
            <div className="bg-red-950/40 border border-red-800/50 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin email address"
              type="email"
            />

            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            {/* <div className="relative">
              <input
                className={inputClass}
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Admin access code"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-500">
                  <path d="M12 2L3.5 6.5V11C3.5 16.25 7.17 21.11 12 22.5C16.83 21.11 20.5 16.25 20.5 11V6.5L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div> */}

            <button
              disabled={loading}
              className="w-full h-12 bg-amber-500 text-slate-950 rounded-xl text-base font-semibold hover:bg-amber-400 transition disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Access Admin Dashboard'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              🔒 All admin sessions are recorded for security purposes.
              Unauthorized access attempts are reported.
            </p>
          </div>

          <p className="text-center text-sm text-slate-600 mt-6">
            Not an admin?{' '}
            <Link href="/login/student" className="text-amber-500 font-medium hover:underline">
              Student login
            </Link>
            {' · '}
            <Link href="/login/counsellor" className="text-amber-500 font-medium hover:underline">
              Counsellor login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}