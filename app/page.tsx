'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Testimony from '@/components/Testimony';


export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-gray-900">

      <Header />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 py-28">

        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/health1.jpg"
            alt="Mental health support"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/85 to-green-950/95" />

        {/* Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-400/20 blur-[120px] rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 px-5 py-2 rounded-full text-sm mb-8">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Yabatech Mental Health Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
            Your Mental Health
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Matters Here.
            </span>
          </h1>

          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10">
            Access counselling, track your wellbeing, and get support — all in one safe space.
          </p>

          <div className="flex justify-center gap-5 flex-wrap mb-12">
            <a href="/register">
              <button className="bg-yellow-400 text-green-900 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition">
                Get Started Free
              </button>
            </a>

            <a href="/anonymous">
              <button className="border border-white/40 text-white px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition">
                Anonymous Help
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          
          <h2 className="text-4xl font-bold mb-10">
            Everything you need, in one place
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {[
              'Self-Assessment',
              'Book Appointments',
              'Secure Messaging',
              'Anonymous Mode',
              'Resource Library',
              'Early Intervention',
            ].map((title) => (
              <div
                key={title}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition"
              >
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  Designed to help you manage your mental health easily.
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20 bg-green-50">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-12">How it works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {['Create account', 'Check wellbeing', 'Get support'].map((step, i) => (
              <div key={step} className="bg-white p-6 rounded-2xl shadow">
                <div className="w-12 h-12 mx-auto bg-green-900 text-white rounded-full flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <p className="text-lg">{step}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── ANONYMOUS ── */}
      <section className="px-6 py-20">
        <div className="bg-green-900 text-white p-10 rounded-3xl max-w-5xl mx-auto">

          <h2 className="text-3xl font-bold mb-4">
            Not ready to share your identity?
          </h2>

          <p className="mb-6 text-white/80">
            You can still get help anonymously.
          </p>

          <a href="/anonymous">
            <button className="bg-yellow-400 text-green-900 px-8 py-4 rounded-xl text-lg">
              Start anonymous session
            </button>
          </a>

        </div>
      </section>

      <Testimony />

      {/* ── CTA WITH IMAGE ── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center relative">

          {/* CTA CARD */}
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-300 rounded-3xl p-12 shadow-lg relative z-10">

            <h2 className="text-4xl font-bold text-green-900 mb-4">
              Ready to take the first step?
            </h2>

            <p className="text-lg text-yellow-900 mb-8">
              Start your journey to better mental health today.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <a href="/register">
                <button className="bg-green-900 text-white px-8 py-4 rounded-xl text-lg hover:shadow-lg hover:-translate-y-1 transition">
                  Create Account
                </button>
              </a>

              <a href="/anonymous">
                <button className="border-2 border-green-900 text-green-900 px-8 py-4 rounded-xl text-lg hover:bg-green-900 hover:text-white transition">
                  Anonymous Help
                </button>
              </a>
            </div>

          </div>


          <div className="relative -mt-2">

          {/* IMAGE BELOW (PROFESSIONAL LAYERED STYLE) */}
            <div className="relative -mt-6">

            {/* IMAGE BELOW (FULL WIDTH BACKGROUND STYLE) */}
            <div className="relative -mt-10 w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">

              {/* Background Image */}
              <Image
                src="/health3.jpg"
                alt="Counselling support"
                fill
                className="object-cover"
              />

              {/* DARK OVERLAY (controls opacity) */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Optional soft gradient for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}