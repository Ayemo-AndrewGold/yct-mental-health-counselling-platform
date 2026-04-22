'use client';

import Link from 'next/link';

const TEAM = [
  { name: 'Dr. Oluwaseun Adeyemi', role: 'Head Counsellor, Yabatech Wellness Centre', initials: 'OA' },
  { name: 'Engr. Babatunde Okafor', role: 'Project Supervisor, Dept. of Computer Technology', initials: 'BO' },
  { name: 'Chidinma Eze', role: 'Lead Developer, Final Year Project', initials: 'CE' },
  { name: 'Musa Ibrahim', role: 'Backend & Systems Developer', initials: 'MI' },
];

const VALUES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Privacy First',
    desc: 'Every feature is built with privacy as the default, not an afterthought. We are NDPR 2019 compliant.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    ),
    title: 'Student-Centred',
    desc: 'Built by students, for students. We understand the pressures of Nigerian polytechnic education.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: 'Evidence-Based',
    desc: 'Our assessment tools (PHQ-9, GAD-7) are validated clinical instruments used worldwide.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Accessible to All',
    desc: 'Free for every registered Yabatech student. Anonymous mode ensures no one is left behind.',
  },
];

export default function AboutPage() {
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
              <Link key={label} href={href} className={`text-sm transition-colors ${href === '/about' ? 'text-[#1a5c2a] font-semibold' : 'text-gray-600 hover:text-gray-900'}`}>{label}</Link>
            ))}
          </nav>
          <Link href="/login" className="text-sm font-medium bg-[#1a5c2a] text-white px-4 py-2 rounded-lg hover:bg-[#154d23] transition-colors">
            Sign in
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c2a] mb-4">About MindBridge</p>
          <h1 className="font-display text-5xl md:text-6xl text-gray-900 leading-tight mb-6">
            Built with purpose,<br />
            <em className="not-italic text-[#1a5c2a]">designed with care.</em>
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed max-w-2xl">
            MindBridge is a student mental health platform developed as a final year Computer Technology project at Yaba College of Technology, Lagos — with a genuine commitment to student wellbeing.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c2a] mb-4">Our mission</p>
            <h2 className="font-display text-4xl text-gray-900 mb-5">
              Mental health support should be accessible to every student
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-5 font-light">
              In Nigerian higher education, mental health is still widely stigmatised. Many students suffer in silence — afraid to seek help, unsure where to go, or simply unable to access the right support.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-8 font-light">
              MindBridge exists to change that. We built a platform that removes every barrier: the fear of judgment, the lack of privacy, the inconvenience of booking appointments. Every feature is designed to make seeking help feel as normal and safe as possible.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 bg-[#1a5c2a] text-white font-medium text-sm px-5 py-3 rounded-xl hover:bg-[#154d23] transition-all">
                Get started free
              </Link>
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Contact us →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '500+', label: 'Students served', sub: 'Across all departments' },
              { n: '4.8/5', label: 'Satisfaction score', sub: 'From session feedback' },
              { n: '100%', label: 'Confidential', sub: 'NDPR compliant' },
              { n: '24/7', label: 'Resource access', sub: 'Always available' },
            ].map(({ n, label, sub }) => (
              <div key={label} className="bg-[#f8faf8] rounded-2xl p-5 border border-gray-100">
                <p className="font-display text-3xl text-[#1a5c2a] mb-1">{n}</p>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 px-6 bg-[#f8faf8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c2a] mb-3">What we stand for</p>
            <h2 className="font-display text-4xl text-gray-900">Our values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f0f9f3] text-[#1a5c2a] flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c2a] mb-3">The team</p>
            <h2 className="font-display text-4xl text-gray-900">The people behind MindBridge</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map(({ name, role, initials }) => (
              <div key={name} className="text-center p-6 bg-[#f8faf8] rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-[#1a5c2a] text-white text-lg font-semibold flex items-center justify-center mx-auto mb-4">
                  {initials}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{name}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1a5c2a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl text-white mb-4">Ready to take the first step?</h2>
          <p className="text-white/70 text-lg mb-8 font-light">
            Join the growing community of Yabatech students prioritising their mental wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="w-full sm:w-auto bg-[#f5a623] text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-[#e09520] transition-all text-center">
              Create your free account
            </Link>
            <Link href="/anonymous" className="w-full sm:w-auto bg-white/10 border border-white/20 text-white font-medium text-sm px-6 py-3.5 rounded-xl hover:bg-white/20 transition-all text-center">
              Try anonymously
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}