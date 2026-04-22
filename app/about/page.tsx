'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

const TEAM = [
  { name: 'Dr. Oluwaseun Adeyemi', role: 'Head Counsellor, Yabatech Wellness Centre', initials: 'OA' },
  { name: 'Engr. Babatunde Okafor', role: 'Project Supervisor, Dept. of Computer Technology', initials: 'BO' },
  { name: 'Chidinma Eze', role: 'Lead Developer, Final Year Project', initials: 'CE' },
  { name: 'Musa Ibrahim', role: 'Backend & Systems Developer', initials: 'MI' },
  { name: 'Tobi Adebayo', role: 'Frontend & UX Designer', initials: 'TA' },
  { name: 'AndrewGold', role: 'AI Automation Specialist', initials: 'AG' },
];

const VALUES = [
  { title: 'Privacy First', desc: 'Built with NDPR compliance and student confidentiality as priority.' },
  { title: 'Student-Centred', desc: 'Designed around real challenges faced by Nigerian students.' },
  { title: 'Evidence-Based', desc: 'Uses validated mental health assessment tools globally recognized.' },
  { title: 'Accessible', desc: 'Free and inclusive access for all students with anonymous mode.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Header />

      {/* ── HERO ── */}
      <section className="relative px-6 py-25 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white overflow-hidden ">
              {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/health4.jpg"
            alt="Mental health support"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/70 to-green-950/70" />

        <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 blur-[120px] rounded-full -top-40 -right-40" />
        {/* Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-400/20 blur-[120px] rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <p className="text-xs uppercase tracking-widest text-yellow-300 mb-4">
            About MindBridge
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Built with purpose,
            <br />
            <span className="text-yellow-300">designed with care.</span>
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            A student mental health platform built at Yaba College of Technology to make counselling accessible, private, and stigma-free.
          </p>

        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-xs uppercase tracking-widest text-green-700 mb-4">Our mission</p>

            <h2 className="text-4xl font-bold mb-6">
              Mental health support should be accessible to every student
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Many students suffer silently due to stigma and lack of access to support systems.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              MindBridge removes barriers by providing private, easy, and stigma-free counselling access.
            </p>

            <Link
              href="/register"
              className="inline-block bg-green-900 text-white px-6 py-3 rounded-xl hover:scale-105 transition"
            >
              Get Started Free
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: 'Students' },
              { n: '4.8/5', l: 'Rating' },
              { n: '100%', l: 'Private' },
              { n: '24/7', l: 'Access' },
            ].map((item) => (
              <div key={item.l} className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
                <p className="text-3xl font-bold text-green-900">{item.n}</p>
                <p className="text-sm text-gray-600">{item.l}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-green-700 mb-3">Values</p>
          <h2 className="text-4xl font-bold">What we stand for</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white p-6 rounded-2xl border hover:-translate-y-1 hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold">Meet the team</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((t) => (
            <div key={t.name} className="bg-gray-50 p-6 rounded-2xl border text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-green-900 text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                {t.initials}
              </div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 bg-green-900 text-white text-center">

        <h2 className="text-4xl font-bold mb-4">
          Ready to take the first step?
        </h2>

        <p className="text-white/70 mb-8">
          Join students already prioritizing their mental health.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register" className="bg-yellow-400 text-green-900 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
            Create Account
          </Link>

          <Link href="/anonymous" className="border border-white/30 px-6 py-3 rounded-xl hover:bg-white/10 transition">
            Anonymous Help
          </Link>
        </div>

      </section>
      <Footer />

    </div>
  );
}