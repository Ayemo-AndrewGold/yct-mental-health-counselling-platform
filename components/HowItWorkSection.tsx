import React from 'react'
import { UserPlus, HeartPulse, MessageCircle } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create your account',
    description:
      'Sign up in under two minutes using your Yabatech email. Your data stays private and fully encrypted from day one.',
  },
  {
    num: '02',
    icon: HeartPulse,
    title: 'Check your wellbeing',
    description:
      'Complete a short self-assessment to understand where you are and what kind of support fits you best right now.',
  },
  {
    num: '03',
    icon: MessageCircle,
    title: 'Get real support',
    description:
      'Connect with a counsellor, access resources, or use anonymous help — on your own terms, at your own pace.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="px-6 py-28 bg-[#0e2318] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto relative">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-yellow-300 bg-white/[0.08] px-4 py-1.5 rounded-full mb-4">
            Simple process
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
            How it works
          </h2>
          <p className="text-white/45 max-w-sm mx-auto text-base">
            Three steps to better mental health — no complicated process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ num, icon: Icon, title, description }) => (
            <div
              key={num}
              className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-left
                         hover:bg-white/[0.07] hover:border-yellow-400/25 transition-all duration-300"
            >
              {/* Big faded number */}
              <p className="font-extrabold text-yellow-400/[0.12] leading-none mb-4"
                 style={{ fontSize: '3.5rem', fontFamily: 'inherit' }}>
                {num}
              </p>

              {/* Icon ring */}
              <div className="w-[52px] h-[52px] rounded-[14px] bg-yellow-400/10 border border-yellow-400/20
                              flex items-center justify-center text-yellow-400 mb-5">
                <Icon size={22} strokeWidth={1.75} />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-[1.7]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}