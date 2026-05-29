import React from 'react'
import Image from 'next/image'

export default function CTASection() {
  return (
    <section className="px-6 py-24 bg-[#f7f6f2]">
      <div className="max-w-5xl mx-auto">

        <div className="bg-[#0e2318] rounded-[28px] overflow-hidden grid md:grid-cols-2 min-h-[380px]">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col justify-center px-10 py-14">

            <span className="inline-block self-start text-xs font-semibold tracking-[0.12em] uppercase
                             text-yellow-300 bg-yellow-400/[0.12] px-4 py-1.5 rounded-full mb-5">
              Take the first step
            </span>

            <h2 className="text-3xl md:text-[2.4rem] font-extrabold text-white leading-[1.15] tracking-tight mb-3">
              Ready to start<br />your journey?
            </h2>

            <p className="text-white/55 text-[0.95rem] leading-[1.7] mb-8 max-w-xs">
              Thousands of Yabatech students have already found support. You don't have to go through this alone.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="/register">
                <button className="bg-yellow-400 text-[#0e2318] px-7 py-3 rounded-xl text-[0.95rem] font-semibold
                                   hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.35)] transition-all duration-200">
                  Create Account
                </button>
              </a>
              <a href="/anonymous">
                <button className="bg-transparent text-white/75 px-7 py-3 rounded-xl text-[0.95rem]
                                   border border-white/[0.18] hover:border-white/40 hover:text-white transition-all duration-200">
                  Anonymous Help
                </button>
              </a>
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="relative hidden md:block">
            <Image
              src="/health3.jpg"
              alt="Counselling support"
              fill
              className="object-cover brightness-[0.65] saturate-[0.8]"
            />

            {/* Left-side gradient fade into dark bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e2318] via-[#0e2318]/20 to-transparent" />

            {/* Watermark text */}
            <div className="absolute bottom-8 right-6 text-right pointer-events-none select-none">
              <span className="block font-extrabold text-white/[0.12] leading-[1.1] tracking-tight"
                    style={{ fontSize: '2.5rem' }}>
                Better
              </span>
              <span className="block font-extrabold text-white/[0.12] leading-[1.1] tracking-tight"
                    style={{ fontSize: '2.5rem' }}>
                Together
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}