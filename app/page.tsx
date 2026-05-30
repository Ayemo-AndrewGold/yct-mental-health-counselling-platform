'use client';

import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Testimony from '@/components/Testimony';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import HowItWorkSection from '@/components/HowItWorkSection';
import CTASection from '@/components/CTASection';
import AnonymousSection from '@/components/AnonymousSection';


export default function LandingPage() {
  return (
    <div className="font-sans bg-white text-gray-900">

      <Header />

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── FEATURES ── */}
      <FeatureSection />

      {/* ── HOW IT WORKS ── */}
      <HowItWorkSection />

      {/* ── ANONYMOUS ── */}
      <AnonymousSection />

      {/* ── TESTIMONY ── */}
      <Testimony />

      {/* ── CTA WITH IMAGE ── */}
      <CTASection />

      <Footer />
    </div>
  );
}