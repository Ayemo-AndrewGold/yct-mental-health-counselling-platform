import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white/80 mt-16">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
                    {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/favicon.png" width={52} height={52} alt="Logo" />

          <div className="leading-tight">
            <p className="text-lg font-semibold">MindBridge</p>
            <p className="text-xs text-white/60">
              Yabatech Mental Health Platform
            </p>
          </div>
        </Link>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-base">
            {[
              'Privacy Policy',
              'About the Project',
              'Contact Counsellors',
              'Resources',
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-yellow-400 transition"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-6 text-sm text-white/60">
          © 2026 MindBridge — Student Mental Health Platform, Yabatech.
        </div>

      </div>
    </footer>
  );
};

export default Footer;