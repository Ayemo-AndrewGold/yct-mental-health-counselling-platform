'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function CounsellorHeader() {
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.full_name?.split(' ')[0] ?? 'Counsellor';

  return (
    <header className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0">

      {/* LEFT */}
      <div>
        <h1 className="text-[14px] font-semibold text-gray-900 tracking-[-0.2px]">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-[11px] text-gray-400 mt-px">{dateStr} · Yaba College of Technology</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Availability status */}
        <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
          <span className="w-[6px] h-[6px] rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[11px] font-medium text-teal-700">Available</span>
        </div>

        {/* Notification bell */}
        <button className="relative w-8 h-8 border border-gray-100 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
          <svg className="w-[14px] h-[14px] text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="absolute top-[7px] right-[7px] w-[6px] h-[6px] rounded-full bg-red-500 border-[1.5px] border-white" />
        </button>

        {/* Profile chip */}
        <div className="flex items-center gap-2 border border-gray-100 rounded-full pl-[6px] pr-3 py-[4px]">
          <div className="w-[22px] h-[22px] rounded-full bg-teal-700 flex items-center justify-center text-white text-[8px] font-bold">
            {firstName.charAt(0)}
          </div>
          <span className="text-[12px] font-medium text-gray-700">{firstName}</span>
        </div>
      </div>
    </header>
  );
}