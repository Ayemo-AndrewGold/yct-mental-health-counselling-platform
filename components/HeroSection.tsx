'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

const slides = [
  { src: '/health1.jpg', alt: 'Mental health support' },
  { src: '/health2.jpg', alt: 'Counselling session' },
  { src: '/health3.jpg', alt: 'Student wellbeing' },
  { src: '/health4.jpg', alt: 'Group support' },
  { src: '/health5.jpg', alt: 'Safe space' },
]

const stats = [
  { num: '2,400+', label: 'Students Helped' },
  { num: '98%',    label: 'Confidential' },
  { num: '24/7',   label: 'Available' },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(timer)
  }, [current, goTo])

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex flex-col bg-[#071a0f]">

      {/* ── Image Slider ── */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#071a0fef] via-[#0e3320d0] to-[#071a0fea]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Arrow Controls ── */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-5 z-20 pointer-events-none">
        {(['prev', 'next'] as const).map((dir) => (
          <button
            key={dir}
            aria-label={dir === 'prev' ? 'Previous slide' : 'Next slide'}
            onClick={() => goTo(dir === 'prev' ? current - 1 : current + 1)}
            className="pointer-events-auto w-11 h-11 rounded-full bg-white/[0.08] border border-white/15 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/[0.18] transition"
          >
            {dir === 'prev' ? '←' : '→'}
          </button>
        ))}
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md border border-white/15 text-yellow-300 px-5 py-2 rounded-full text-sm font-medium tracking-wide mb-8">
          <span className="w-[7px] h-[7px] bg-yellow-400 rounded-full animate-pulse" />
          Yabatech Mental Health Platform
        </div>

        {/* Heading */}
        <h1 className="font-extrabold text-white leading-[1.08] tracking-tight mb-6 max-w-[820px]"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)' }}>
          Your Mental Health
          <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Matters Here.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-white/75 max-w-[540px] mb-10 font-light leading-7"
           style={{ fontSize: '1.1rem' }}>
          Access counselling, track your wellbeing, and get support — all in one safe,
          confidential space built for you.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <a href="/register">
            <button className="bg-yellow-400 text-[#071a0f] px-8 py-[14px] rounded-xl text-base font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(251,191,36,0.4)] transition-all duration-200">
              Get Started Free
            </button>
          </a>
          <a href="/anonymous">
            <button className="bg-transparent text-white px-8 py-[14px] rounded-xl text-base border border-white/30 hover:bg-white/10 backdrop-blur-md transition-all duration-200">
              Anonymous Help
            </button>
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          {stats.map(({ num, label }) => (
            <div key={label} className="text-center">
              <span className="block text-yellow-400 font-extrabold text-[1.7rem] leading-none font-syne">
                {num}
              </span>
              <span className="text-white/50 text-xs uppercase tracking-widest mt-1 block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dot Navigation ── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-[10px] z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer ${
              i === current
                ? 'bg-yellow-400 w-6'
                : 'bg-white/30 w-2'
            }`}
          />
        ))}
      </div>
    </section>
  )
}