import React from 'react'
import {
  ClipboardCheck,
  CalendarCheck,
  Lock,
  EyeOff,
  BookOpen,
  BellRing,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: ClipboardCheck,
    title: 'Self-Assessment',
    description:
      'Understand your mental state with evidence-based check-ins designed to spot early warning signs before they escalate.',
  },
  {
    icon: CalendarCheck,
    title: 'Book Appointments',
    description:
      'Schedule sessions with certified counsellors in just a few taps — no awkward phone calls, no waiting in queues.',
  },
  {
    icon: Lock,
    title: 'Secure Messaging',
    description:
      'Talk to your counsellor between sessions through an end-to-end encrypted chat channel. Private, always.',
  },
  {
    icon: EyeOff,
    title: 'Anonymous Mode',
    description:
      'Share your concerns without revealing your identity. We protect your privacy completely, no questions asked.',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description:
      'Browse curated articles, guided exercises, and tools to build resilience at your own pace, anytime.',
  },
  {
    icon: BellRing,
    title: 'Early Intervention',
    description:
      'Smart alerts flag potential concerns early so you can get help before things escalate into a crisis.',
  },
]

export default function FeatureSection() {
  return (
    <section className="px-6 py-28 bg-[#f7f6f2]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-green-800 bg-green-100 px-4 py-1.5 rounded-full mb-4">
            What we offer
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0e2318] tracking-tight leading-[1.1] mb-4">
            Everything you need,<br className="hidden md:block" /> in one place
          </h2>
          <p className="text-[#4b7060] max-w-md mx-auto text-base">
            Designed for Yabatech students — private, safe, and always available.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-white rounded-2xl p-7 border border-[#e5e7e0] overflow-hidden
                         hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(14,35,24,0.1)] transition-all duration-300"
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-800 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center mb-5 text-green-800">
                <Icon size={22} strokeWidth={1.75} />
              </div>

              <h3 className="text-lg font-bold text-[#0e2318] mb-2">{title}</h3>
              <p className="text-sm text-[#5a7268] leading-[1.7]">{description}</p>

              <div className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-green-800 cursor-pointer">
                Learn more <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}