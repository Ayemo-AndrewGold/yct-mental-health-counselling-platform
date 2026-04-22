'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `relative text-base transition-colors duration-300 ${
      isActive(path)
        ? 'text-yellow-400'
        : 'text-white/80 hover:text-yellow-300'
    }`;

  return (
    <header className="bg-green-900 text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

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

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">

          {[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' },
          ].map((item) => (
            <Link key={item.path} href={item.path} className={linkClass(item.path)}>
              <span className="relative">
                {item.name}

                {/* Active underline animation */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-400 transition-all duration-300 ${
                    isActive(item.path) ? 'w-full' : 'w-0'
                  }`}
                />
              </span>
            </Link>
          ))}

          <Link href="/login">
            <button className="bg-yellow-400 text-green-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Login
            </button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1"
        >
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
          <span className="w-6 h-[2px] bg-white"></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-green-950 border-t border-white/10 px-6 py-4 space-y-4">

          {[
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Contact', path: '/contact' },
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setOpen(false)}
              className={`block text-base transition ${
                isActive(item.path)
                  ? 'text-yellow-400 font-semibold'
                  : 'text-white/80'
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Link href="/login" onClick={() => setOpen(false)}>
            <button className="w-full bg-yellow-400 text-green-900 py-3 rounded-lg font-semibold">
              Login
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;