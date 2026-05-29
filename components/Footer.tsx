import React from 'react'
import Link from 'next/link'

const platformLinks = [
  { label: 'Self-Assessment',  href: '/assessment' },
  { label: 'Book Appointment', href: '/book' },
  { label: 'Resource Library', href: '/resources' },
  { label: 'Anonymous Help',   href: '/anonymous' },
  { label: 'Secure Messaging', href: '/messages' },
]

const supportLinks = [
  { label: 'Contact Counsellors', href: '/contact' },
  { label: 'Crisis Helpline',     href: '/crisis' },
  { label: 'FAQs',                href: '/faq' },
  { label: 'Student Guide',       href: '/guide' },
  { label: 'Feedback',            href: '/feedback' },
]

const aboutLinks = [
  { label: 'About the Project', href: '/about' },
  { label: 'Privacy Policy',    href: '/privacy' },
  { label: 'Terms of Use',      href: '/terms' },
  { label: 'Accessibility',     href: '/accessibility' },
]

const socials = [
  { label: 'Twitter',    href: '#', icon: '𝕏' },
  { label: 'Instagram',  href: '#', icon: '◎' },
  { label: 'WhatsApp',   href: '#', icon: '✆' },
  { label: 'Email',      href: 'mailto:mindbridge@yabatech.edu.ng', icon: '✉' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a1f12] text-white/65">

      {/* ── Main grid ── */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand col */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-5 no-underline">
            {/* Swap the inner content for your real <Image> logo if preferred */}
            <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-green-800 to-green-400 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0"
                 style={{ fontFamily: 'Syne, sans-serif' }}>
              M
            </div>
            <div>
              <span className="block text-[1.05rem] font-bold text-white leading-tight"
                    style={{ fontFamily: 'Syne, sans-serif' }}>
                MindBridge
              </span>
              <span className="block text-[0.7rem] text-white/40 mt-0.5">
                Yabatech Mental Health Platform
              </span>
            </div>
          </Link>

          <p className="text-[0.84rem] text-white/40 leading-[1.7] mb-5 max-w-[220px]">
            A safe, confidential space for Yabatech students to access mental health
            support, counselling, and resources.
          </p>

          {/* Social icons */}
          <div className="flex gap-[10px]">
            {socials.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-[34px] h-[34px] rounded-lg bg-white/[0.06] border border-white/[0.08]
                           flex items-center justify-center text-[13px] text-white/50 no-underline
                           hover:bg-yellow-400/10 hover:border-yellow-400/25 hover:text-yellow-400 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-[0.78rem] font-bold text-white uppercase tracking-[0.1em] mb-5"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            Platform
          </h4>
          <ul className="flex flex-col gap-[10px] list-none">
            {platformLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}
                      className="text-[0.875rem] text-white/45 no-underline hover:text-yellow-300 transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-[0.78rem] font-bold text-white uppercase tracking-[0.1em] mb-5"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            Support
          </h4>
          <ul className="flex flex-col gap-[10px] list-none">
            {supportLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}
                      className="text-[0.875rem] text-white/45 no-underline hover:text-yellow-300 transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="text-[0.78rem] font-bold text-white uppercase tracking-[0.1em] mb-5"
              style={{ fontFamily: 'Syne, sans-serif' }}>
            About
          </h4>
          <ul className="flex flex-col gap-[10px] list-none">
            {aboutLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href}
                      className="text-[0.875rem] text-white/45 no-underline hover:text-yellow-300 transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.78rem] text-white/30">
            © 2026 MindBridge — Student Mental Health Platform, Yabatech. All rights reserved.
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            {/* Live status badge */}
            <span className="inline-flex items-center gap-[6px] text-[0.7rem] text-green-400
                             bg-green-400/[0.08] border border-green-400/15 px-3 py-1 rounded-full">
              <span className="w-[5px] h-[5px] bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </span>

            <div className="flex gap-5">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`}
                      className="text-[0.78rem] text-white/30 no-underline hover:text-white/70 transition-colors duration-200">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}