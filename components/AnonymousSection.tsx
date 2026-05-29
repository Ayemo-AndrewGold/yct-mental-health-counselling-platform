import React from 'react'
import { ShieldCheck, CheckCircle2 } from 'lucide-react'

const features = [
  'No account or login required',
  'Your session is never stored or traced',
  'Access the same trained counsellors',
  'End-to-end encrypted conversation',
]

const stats = [
  { num: '100%', label: 'Private' },
  { num: '0',    label: 'Data stored' },
  { num: '24/7', label: 'Available' },
]

export default function AnonymousSection() {
  return (
    <section className="px-6 py-20 bg-[#f7f6f2]">
      <div className="max-w-5xl mx-auto">

        <div className="bg-[#0e2318] rounded-[28px] px-10 py-14 grid md:grid-cols-[1fr_auto] items-center gap-12 relative overflow-hidden">

          {/* Ambient glow */}
          <div className="absolute top-[-120px] right-[-120px] w-[400px] h-[400px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.07) 0%, transparent 70%)' }} />

          {/* Diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
               style={{
                 backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)',
               }} />

          {/* ── Left ── */}
          <div className="relative z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.12] text-yellow-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5">
              <span className="w-[6px] h-[6px] bg-yellow-400 rounded-full animate-pulse" />
              100% Anonymous
            </div>

            <h2 className="text-3xl md:text-[2.5rem] font-extrabold text-white leading-[1.15] tracking-tight mb-3">
              Not ready to share<br />
              your <span className="text-yellow-400">identity?</span>
            </h2>

            <p className="text-white/50 text-[0.95rem] leading-[1.7] mb-6 max-w-md">
              You still deserve support. Start a completely private session — no name,
              no student ID, no records. Just help, when you need it most.
            </p>

            {/* Feature list */}
            <ul className="flex flex-col gap-[10px] mb-8">
              {features.map((feat) => (
                <li key={feat} className="flex items-center gap-[10px] text-[0.88rem] text-white/60">
                  <span className="w-5 h-5 rounded-full bg-yellow-400/[0.12] border border-yellow-400/25 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={11} className="text-yellow-400" strokeWidth={2.5} />
                  </span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a href="/anonymous">
                <button className="inline-flex items-center gap-2 bg-yellow-400 text-[#0e2318] px-7 py-[13px] rounded-xl text-[0.95rem] font-bold border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(251,191,36,0.35)] transition-all duration-200">
                  <ShieldCheck size={17} strokeWidth={2} />
                  Start anonymous session
                </button>
              </a>
              <a href="/how-it-works">
                <button className="inline-flex items-center gap-2 bg-transparent text-white/65 px-6 py-[12px] rounded-xl text-[0.95rem] border border-white/15 cursor-pointer hover:border-white/35 hover:text-white transition-all duration-200">
                  Learn how it works
                </button>
              </a>
            </div>
          </div>

          {/* ── Right: Stats ── */}
          <div className="relative z-10 flex md:flex-col flex-row gap-3 min-w-[180px]">
            {stats.map(({ num, label }) => (
              <div
                key={label}
                className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-6 py-5 text-center
                           hover:bg-white/[0.08] hover:border-yellow-400/20 transition-all duration-200 flex-1 md:flex-none"
              >
                <span className="block font-extrabold text-yellow-400 text-[1.8rem] leading-none">
                  {num}
                </span>
                <span className="block text-white/40 text-[0.72rem] uppercase tracking-widest mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}