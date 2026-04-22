'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard/student');
    }, 1200);
  }

  async function handleAnonymous() {
    setAnonLoading(true);
    setTimeout(() => {
      setAnonLoading(false);
      router.push('/anonymous');
    }, 1000);
  }

  const inputClass =
    'w-full h-12 border border-gray-200 rounded-xl px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/10 focus:border-green-700 transition';

  return (
    <div className="h-screen overflow-hidden flex">

      {/* ───────── LEFT PANEL (NOW PREMIUM) ───────── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between px-12 py-14">

        {/* Background Image */}
        <Image
          src="/health9.png"
          alt="Yabatech Campus"
          fill
          className="object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/70 to-black/80" />

        {/* Content */}
        <div className="relative z-10">

          <Link href="/" className="flex items-center gap-3 mb-14">
            <Image src="/favicon.png" width={56} height={56} alt="Logo" />
            <div>
              <p className="text-white text-xl font-semibold">MindBridge</p>
              <p className="text-white/60 text-sm">
                Yabatech Mental Health Platform
              </p>
            </div>
          </Link>

          <h2 className="text-4xl font-bold text-white leading-tight mb-5">
            Welcome back 👋<br />
            Your <span className="text-yellow-400">wellbeing</span> matters.
          </h2>

          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-md">
            Sign in to continue your mental health journey, access counselling,
            and track your wellbeing progress.
          </p>

          <div className="space-y-6">
            {[
              'Secure student login system',
              'Encrypted counselling records',
              'Anonymous support available',
              'Free for all Yabatech students',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © 2026 MindBridge · Yaba College of Technology
        </p>
      </div>

      {/* ───────── RIGHT PANEL ───────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile header */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Image src="/favicon.png" width={45} height={45} alt="Logo" />
            <div>
              <p className="text-lg font-semibold">MindBridge</p>
              <p className="text-xs text-gray-500">Yabatech Platform</p>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full mb-5">
            Student Portal
          </div>

          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-500 mb-8 text-base">
            Access your counselling dashboard
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              className={inputClass}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Matric number or email"
            />

            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <button
              disabled={loading}
              className="w-full h-12 bg-green-800 text-white rounded-xl text-base font-semibold hover:bg-green-700 transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <button
            onClick={handleAnonymous}
            disabled={anonLoading}
            className="w-full h-12 border border-green-700 text-green-700 rounded-xl text-base font-medium hover:bg-green-50 transition"
          >
            {anonLoading ? 'Starting...' : 'Continue anonymously'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{' '}
            <Link href="/register" className="text-green-700 font-medium hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}