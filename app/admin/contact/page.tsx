'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  }

  const inputCls = 'w-full h-11 border border-gray-200 rounded-xl px-3.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white transition focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10';

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1a5c2a] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">MindBridge</p>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {[['/', 'Home'], ['/resources', 'Resources'], ['/about', 'About'], ['/contact', 'Contact']].map(([href, label]) => (
              <Link key={label} href={href} className={`text-sm transition-colors ${href === '/contact' ? 'text-[#1a5c2a] font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>{label}</Link>
            ))}
          </nav>
          <Link href="/login" className="text-sm font-medium bg-[#1a5c2a] text-white px-4 py-2 rounded-lg hover:bg-[#154d23] transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="py-16 px-6 border-b border-gray-100 bg-[#f8faf8]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c2a] mb-3">Get in touch</p>
          <h1 className="font-display text-5xl text-gray-900 mb-4">We&apos;re here to help</h1>
          <p className="text-gray-500 text-lg font-light">
            Have a question, feedback, or need to reach the counselling team? Send us a message — we typically respond within one working day.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div>
            <h2 className="font-display text-3xl text-gray-900 mb-6">Contact information</h2>

            <div className="space-y-5 mb-10">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
                  label: 'Address',
                  value: 'Wellness Centre, Main Campus\nYaba College of Technology\nOtto/Ijora, Lagos State',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.77a16 16 0 006.29 6.29l1.25-1.24a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>,
                  label: 'Phone',
                  value: '+234 816 000 0000\n(Mon–Fri, 8am–5pm)',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                  label: 'Email',
                  value: 'mindbridge@yabatech.edu.ng',
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f9f3] text-[#1a5c2a] flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-[#f8faf8] rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Counselling hours</h3>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Friday', hours: '8:00 AM – 5:00 PM' },
                  { day: 'Saturday', hours: '10:00 AM – 2:00 PM' },
                  { day: 'Sunday & Public Holidays', hours: 'Closed (use anonymous chat)' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{day}</span>
                    <span className="font-medium text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-500">Anonymous chat available 24/7</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-[#f0f9f3] border border-[#1a5c2a]/15 flex items-center justify-center mb-5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl text-gray-900 mb-2">Message sent!</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Thanks for reaching out. We&apos;ll get back to you within one working day.
                </p>
                <button onClick={() => setSent(false)} className="text-sm font-medium text-[#1a5c2a] hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl text-gray-900 mb-6">Send a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Your name</label>
                      <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                        placeholder="Andrew Ayemo" required className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address</label>
                      <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                        placeholder="student@yabatech.edu.ng" required className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject</label>
                    <select value={form.subject} onChange={(e) => update('subject', e.target.value)}
                      required className={inputCls}>
                      <option value="">Select a subject</option>
                      <option>General enquiry</option>
                      <option>Book a session</option>
                      <option>Technical issue with platform</option>
                      <option>Privacy concern</option>
                      <option>Feedback or suggestion</option>
                      <option>Urgent support needed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Tell us how we can help..."
                      required
                      rows={5}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white transition focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 resize-none"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex items-start gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <p className="text-xs text-amber-700">
                      <strong>Need urgent help?</strong> Don&apos;t wait for a reply. Use our{' '}
                      <Link href="/anonymous" className="font-semibold underline">anonymous chat</Link>{' '}
                      to speak with a counsellor right now.
                    </p>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full h-11 bg-[#1a5c2a] hover:bg-[#154d23] disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Sending...
                      </>
                    ) : 'Send message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}