'use client'

import React from 'react'
import { useEffect, useState } from 'react';
import { getMe } from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  full_name : string;
  email: string;
  role: string;
  matric_number: string;
  department: string;
}


export default function StudentHeader() {
  const [user, setUser] = useState<{full_name: string; eail: string } | null>(null);

  useEffect(() => {
   // First load from cookie instantly
   const stored = Cookies.get('user');
   if (stored) setUser(JSON.parse(stored));

   //Then fetch frsh data from backend
   getMe().then((data) => {
    if (data) {
      setUser(data);
      //Update cookie with fresh data
      Cookies.set('user', JSON.stringify(data), { expires: 1});
    }
   })
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.full_name?.split(' ')[0] ?? 'Student';

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

        {/* Wellbeing status */}
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1">
          <span className="w-[6px] h-[6px] rounded-full bg-green-500" />
          <span className="text-[11px] font-medium text-green-700">Wellbeing: Good</span>
        </div>

        {/* Profile chip */}
        <div className="flex items-center gap-2 border border-gray-100 rounded-full pl-[6px] pr-3 py-[4px]">
          <div className="w-[22px] h-[22px] rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[8px] font-bold">
            {firstName.charAt(0)}
          </div>
          <span className="text-[12px] font-medium text-gray-700">{firstName}</span>
        </div>
      </div>
    </header>
  );
}