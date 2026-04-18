'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role: 'student' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid credentials. Please try again.');
        return;
      }

      router.push('/dashboard/student');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAnonymous() {
    setAnonLoading(true);
    try {
      const res = await fetch('/api/auth/anonymous', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        router.push(`/anonymous/session?id=${data.sessionId}`);
      } else {
        setError('Could not start anonymous session. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setAnonLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between bg-[#1a5c2a] px-10 py-12">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-[#f5b829] flex items-center justify-center text-[#1a5c2a] text-xs font-bold shrink-0">
              YCT
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">MindBridge</p>
              <p className="text-[10px] text-white/60">Yabatech Mental Health Platform</p>
            </div>
          </div>

          <h2 className="text-[1.9rem] font-bold text-white leading-snug mb-4">
            Welcome back.<br />
            Your{' '}
            <span className="text-[#f5b829]">wellbeing</span>
            <br />
            is our priority.
          </h2>

          <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-xs">
            Log in to access your counselling dashboard, track your mental health,
            and connect with professional support — right here at Yabatech.
          </p>

          <ul className="space-y-3">
            {[
              'End-to-end encrypted sessions',
              'NDPR compliant data handling',
              'Anonymous access available',
              'Free for all Yabatech students',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#f5b829] shrink-0" />
                <span className="text-sm text-white/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-[11px] text-white/35">
            © 2025 MindBridge · Dept. of Computer Technology, Yaba College of Technology
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-col justify-center bg-white px-6 py-12 lg:px-10">
        <div className="w-full max-w-sm mx-auto">

          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-xs font-bold">
              YCT
            </div>
            <p className="text-sm font-medium text-[#1a5c2a]">MindBridge</p>
          </div>

          {/* Student badge */}
          <div className="inline-flex items-center gap-2 bg-[#e8f5ec] border border-[#b6dfc0] text-[#1a5c2a] text-xs font-medium px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a5c2a]" />
            Student Portal
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-7">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#1a5c2a] font-medium hover:underline">
              Create one free
            </Link>
          </p>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-3 py-2.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Matric number or email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. P/ND/23/3210083"
                className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-gray-600">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#1a5c2a] font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#1a5c2a] hover:bg-[#2d7a3e] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
            >
              {loading ? 'Signing in...' : 'Sign in to MindBridge'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <span className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <span className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Anonymous button */}
          <button
            onClick={handleAnonymous}
            disabled={anonLoading}
            className="w-full h-10 flex items-center justify-center gap-2 border-[1.5px] border-[#1a5c2a] text-[#1a5c2a] text-sm font-medium rounded-lg hover:bg-[#e8f5ec] disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {anonLoading ? 'Starting session...' : 'Continue anonymously — no login needed'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to MindBridge?{' '}
            <Link href="/register" className="text-[#1a5c2a] font-medium hover:underline">
              Create your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}