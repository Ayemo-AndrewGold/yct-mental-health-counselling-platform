import React from 'react'

const testimonials = [
  {
    initials: 'AO',
    name: 'Ayomide O.',
    dept: 'Computer Technology, ND2',
    quote:
      'I was scared to walk into the counselling office. This platform helped me talk to someone from my room — without anyone knowing.',
  },
  {
    initials: 'CU',
    name: 'Chidinma U.',
    dept: 'Business Administration, ND1',
    quote:
      'The self-assessment opened my eyes. I didn\'t realise how stressed I was until I saw my score. Booking a session was incredibly easy.',
  },
  {
    initials: 'TE',
    name: 'Tobi E.',
    dept: 'Electrical Engineering, HND1',
    quote:
      'Anonymous mode was a lifesaver. I finally felt safe enough to ask for help without worrying about what others would think of me.',
  },
]

const avatarGradients = [
  'from-green-900 to-green-500',
  'from-green-800 to-teal-500',
  'from-emerald-900 to-green-400',
]

export default function Testimony() {
  return (
    <section className="px-6 py-28 bg-[#f7f6f2]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-green-800 bg-green-100 px-4 py-1.5 rounded-full mb-4">
            Student voices
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0e2318] tracking-tight leading-[1.1] mb-4">
            What students are saying
          </h2>
          <p className="text-[#4b7060] max-w-md mx-auto text-base">
            Real experiences from Yabatech students who took the first step.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ initials, name, dept, quote }, idx) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-7 border border-[#e5e7e0]
                         hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(14,35,24,0.08)] transition-all duration-300"
            >
              {/* Decorative quote mark */}
              <span className="block font-extrabold text-green-100 leading-[0.8] mb-3"
                    style={{ fontSize: '4rem' }}>
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 text-yellow-400 text-sm mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-[0.95rem] text-[#2d4a3a] leading-[1.75] italic font-light mb-6">
                {quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-[#f0f0ea] pt-5">
                <div
                  className={`w-[42px] h-[42px] rounded-full bg-gradient-to-br ${avatarGradients[idx]}
                              flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0`}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-[0.92rem] font-semibold text-[#0e2318]">{name}</p>
                  <p className="text-[0.78rem] text-[#7a9c8a]">{dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}