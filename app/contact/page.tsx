'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';


export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    setLoading(false);
    setSent(true);
  }

  const input =
    'w-full h-12 border border-gray-200 rounded-xl px-4 text-sm bg-white outline-none focus:ring-2 focus:ring-green-900/10 focus:border-green-900 transition';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-br from-green-950 via-green-800 to-green-900 text-white px-6 py-20 relative overflow-hidden">
            {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/health5.jpg"
          alt="Mental health support"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/70 to-green-950/70" />
      {/* Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-400/20 blur-[120px] rounded-full" />
        
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-yellow-400 mb-4">
            Contact MindBridge
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            We are here <br />
            <span className="text-yellow-400">to support you</span>
          </h1>

          <p className="text-white/80 text-lg leading-relaxed">
            Whether you need help, want to ask a question, or give feedback —
            we respond with care and confidentiality.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">

          {/* LEFT SIDE */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">

              {[
                {
                  label: 'Address',
                  value:
                    'Wellness Centre\nYaba College of Technology\nLagos, Nigeria',
                },
                {
                  label: 'Phone',
                  value: '+234 816 000 0000',
                },
                {
                  label: 'Email',
                  value: 'mindbridge@yabatech.edu.ng',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-green-50/30"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-900 text-white flex items-center justify-center text-sm font-bold">
                    {item.label[0]}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-sm whitespace-pre-line text-gray-700">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* HOURS */}
            <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Counselling Hours</h3>

              <div className="space-y-2 text-sm">
                <p>Mon – Fri: 8:00 AM – 5:00 PM</p>
                <p>Saturday: 10:00 AM – 2:00 PM</p>
                <p className="text-gray-500">
                  Sunday: Use anonymous support
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (FORM) */}
          <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8">

            {!sent ? (
              <>
                <h2 className="text-2xl font-bold mb-6">
                  Send a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                  <input
                    className={input}
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                  />

                  <input
                    className={input}
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                  />

                  <select
                    className={input}
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                    required
                  >
                    <option value="">Select Subject</option>
                    <option>General enquiry</option>
                    <option>Book session</option>
                    <option>Technical issue</option>
                    <option>Privacy concern</option>
                  </select>

                  <textarea
                    className="w-full h-32 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-green-900/10 focus:border-green-900 outline-none"
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    required
                  />

                  <button
                    disabled={loading}
                    className="w-full h-12 bg-green-900 text-white rounded-xl font-semibold hover:bg-green-800 transition flex items-center justify-center"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>

                <p className="text-xs text-gray-500 mt-4">
                  Urgent help? Use{' '}
                  <Link href="/anonymous" className="text-green-900 font-semibold">
                    anonymous chat
                  </Link>
                </p>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent</h3>
                <p className="text-gray-500 mb-6">
                  We’ll get back to you shortly.
                </p>

                <button
                  onClick={() => setSent(false)}
                  className="text-green-900 font-semibold"
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* ── MAP STRIP (FULL WIDTH) ── */}
      <section className="w-full pb-0">
        <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] overflow-hidden">

          {/* Google Map - Yaba College of Technology */}
          <iframe
            src="https://www.google.com/maps?q=Yaba+College+of+Technology+Lagos&output=embed"
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Dark overlay for premium look */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Floating Info Card */}
          <div className="absolute bottom-6 left-6 bg-[#0d1510]/90 backdrop-blur-md border border-white/10 rounded-xl px-5 py-4 max-w-sm">

            <p className="text-[13px] font-semibold text-white">
              Yaba College of Technology
            </p>

            <p className="text-[12px] text-white/60 mt-1">
              Otto / Ijora, Lagos State, Nigeria
            </p>

            <a
              href="https://www.google.com/maps?q=Yaba+College+of+Technology+Lagos"
              target="_blank"
              className="inline-flex items-center gap-1 text-[12px] text-[#00c97a] mt-3 hover:underline"
            >
              Open in Google Maps →
            </a>

          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}