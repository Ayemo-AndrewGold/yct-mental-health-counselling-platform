'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0">

      {/* ── LEFT ── */}
      <div>
        <h1 className="text-[14px] font-semibold text-gray-900 tracking-[-0.2px]">
          {greeting}, Admin 👋
        </h1>
        <p className="text-[11px] text-gray-400 mt-px">{dateStr} · Yaba College of Technology</p>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex items-center gap-2">

        {/* System status pill */}
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1">
          <span className="w-[6px] h-[6px] rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-green-700">System Operational</span>
        </div>

        <div className="w-px h-5 bg-gray-100 mx-1" />

        {/* Export */}
        <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[12px] text-gray-600 font-medium transition-colors">
          <svg className="w-[12px] h-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>

        {/* Add user */}
        <button className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white border-none rounded-lg px-3 text-[12px] font-medium transition-colors">
          <svg className="w-[12px] h-[12px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add User
        </button>

        <div className="w-px h-5 bg-gray-100 mx-1" />

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative w-8 h-8 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors"
          >
            <svg className="w-[14px] h-[14px] text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-red-500 border-[1.5px] border-white" />
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-[12px] font-semibold text-gray-900">Notifications</p>
                <button className="text-[10px] text-[#1a5c2a] font-medium hover:underline">Mark all read</button>
              </div>
              {[
                { title: 'High-severity case unattended', sub: 'ANON-48392 · 2 min ago', dot: 'bg-red-500' },
                { title: 'Counsellor capacity at 90%',    sub: 'Mr. Alomaja · 1 hr ago',  dot: 'bg-amber-400' },
                { title: 'Monthly report ready',           sub: 'April 2026 · 3 hrs ago',  dot: 'bg-blue-400' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div>
                    <p className="text-[11.5px] font-medium text-gray-800">{n.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.sub}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <Link href="/dashboard/admin/logs" className="text-[11px] text-[#1a5c2a] font-medium hover:underline">
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile chip */}
        <Link
          href="/dashboard/admin/settings"
          className="flex items-center gap-2 border border-gray-100 rounded-full pl-[6px] pr-3 py-[4px] hover:bg-gray-50 transition-colors"
        >
          <div className="w-[22px] h-[22px] rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[8px] font-bold">
            SA
          </div>
          <span className="text-[12px] font-medium text-gray-700">System Admin</span>
          <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}