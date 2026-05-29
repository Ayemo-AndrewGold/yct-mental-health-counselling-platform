'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { getCounsellorStats, getCounsellorAppointments } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface User {
  full_name: string;
  email: string;
}

interface Stats {
  total_appointments: number;
  pending_appointments: number;
  confirmed_appointments: number;
  completed_appointments: number;
  total_students: number;
}

interface Appointment {
  id: number;
  student_name: string;
  session_type: string;
  date: string;
  time: string;
  status: string;
  duration: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accent}`} />
      <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">{value}</p>
      <p className="text-[12px] font-medium text-gray-700 mt-1">{label}</p>
      <p className="text-[10.5px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TODAY'S APPOINTMENT CARD
// ─────────────────────────────────────────────────────────────────────────────
function AppointmentCard({ time, name, type, status, isAnon }: {
  time: string; name: string; type: string; status: string; isAnon?: boolean;
}) {
  const statusMap: Record<string, string> = {
    Confirmed:  'bg-green-50 text-green-700',
    Pending:    'bg-amber-50 text-amber-700',
    Upcoming:   'bg-gray-100 text-gray-500',
  };
  const typeMap: Record<string, string> = {
    Physical: 'bg-[#e0f2f1] text-teal-700',
    Video:    'bg-purple-50 text-purple-700',
    Chat:     'bg-blue-50 text-blue-700',
  };
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 group">
      <div className="text-center shrink-0 w-14">
        <p className="text-[13px] font-bold text-teal-700 font-mono">{time}</p>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
        ${isAnon ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
        {isAnon ? 'AN' : name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-gray-900 truncate">{name}</p>
        {isAnon && <p className="text-[10px] text-gray-400">Anonymous session</p>}
      </div>
      <span className={`text-[10px] font-medium px-2 py-[2px] rounded-md ${typeMap[type]}`}>{type}</span>
      <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${statusMap[status]}`}>{status}</span>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-teal-700 font-medium hover:underline shrink-0">
        View →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// URGENT CASE CARD
// ─────────────────────────────────────────────────────────────────────────────
function UrgentCase({ caseId, name, issue, phq9, isAnon }: {
  caseId: string; name: string; issue: string; phq9: number; isAnon?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[12px] font-semibold text-gray-900">{name}</p>
          <span className="text-[10px] text-gray-400 font-mono">{caseId}</span>
        </div>
        <p className="text-[11px] text-gray-500">{issue}</p>
        {isAnon && <p className="text-[10px] text-amber-600 mt-0.5">Anonymous session</p>}
      </div>
      <span className={`text-[11px] font-bold shrink-0 ${phq9 >= 20 ? 'text-red-600' : 'text-amber-600'}`}>
        PHQ-9: {phq9}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CounsellorOverviewPage() {
  const [user, setUser]             = useState<User | null>(null);
const [stats, setStats]           = useState<Stats | null>(null);
const [appointments, setAppointments] = useState<Appointment[]>([]);

useEffect(() => {
  const stored = Cookies.get('user');
  if (stored) setUser(JSON.parse(stored));

  Promise.all([
    getCounsellorStats(),
    getCounsellorAppointments(),
  ]).then(([statsData, apptData]) => {
    if (statsData) setStats(statsData);
    setAppointments(apptData);
  });
}, []);

  const firstName = user?.full_name?.split(' ')[0] ?? 'Counsellor';

  // Helper function 
  function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

const todayStr = new Date().toISOString().split('T')[0];
const todayAppointments = appointments.filter(a => a.date === todayStr);
const upcomingCount = appointments.filter(
  a => a.status === 'Confirmed' || a.status === 'Pending'
).length;

  return (
    <div className="px-6 py-5 pb-10 space-y-5">

      {/* Page title */}
      <div>
        <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
          Your Dashboard
        </h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Here's your overview for today
        </p>
      </div>

      {/* Welcome banner */}
      <div className="bg-teal-800 rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-teal-300 uppercase tracking-[0.08em] mb-1">
            Welcome back
          </p>
          <h3 className="text-[16px] font-semibold text-white leading-snug mb-1">
            Hi {firstName}, you have {todayAppointments.length} sessions today
          </h3>
          <p className="text-[12px] text-white/60 max-w-sm">
            {stats?.confirmed_appointments ?? 0} confirmed ·{' '}
            {stats?.pending_appointments ?? 0} pending ·{' '}
            {upcomingCount} upcoming total.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center bg-white/10 border border-white/15 rounded-2xl px-6 py-4 shrink-0">
          <p className="text-[28px] font-bold text-white leading-none">78%</p>
          <p className="text-[11px] text-white/60 mt-1">Utilisation</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Active Cases"
          value={String(stats?.total_students ?? 0)}
          sub="Students assigned"
          accent="bg-teal-600"
        />
        <StatCard
          label="Sessions This Month"
          value={String(stats?.total_appointments ?? 0)}
          sub="Total booked"
          accent="bg-yellow-400"
        />
        <StatCard
          label="Completed"
          value={String(stats?.completed_appointments ?? 0)}
          sub="Sessions done"
          accent="bg-blue-400"
        />
        <StatCard
          label="Pending"
          value={String(stats?.pending_appointments ?? 0)}
          sub="Awaiting confirmation"
          accent="bg-red-400"
        />
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">

        {/* Today's appointments */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-semibold text-gray-900">Today's Appointments</h2>
              <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full bg-teal-50 text-teal-700">
                {todayAppointments.length} today
              </span>
            </div>
            <Link href="/dashboard/counsellor/appointments"
              className="text-[11.5px] text-teal-700 font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="px-5">
            {todayAppointments.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[12px] text-gray-400">No sessions scheduled for today.</p>
              </div>
            ) : (
              todayAppointments.map((a) => (
                <AppointmentCard
                  key={a.id}
                  time={formatTime(a.time)}
                  name={a.student_name}
                  type={a.session_type}
                  status={a.status}
                />
              ))
            )}
          </div>
        </div>

        {/* Urgent cases */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-semibold text-gray-900">Urgent Cases</h2>
              <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full bg-red-50 text-red-600">
                3 high
              </span>
            </div>
            <Link href="/dashboard/counsellor/cases"
              className="text-[11.5px] text-teal-700 font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="px-5">
            <UrgentCase caseId="#CASE-0041" name="Adewale Funmilayo" issue="Severe Anxiety"    phq9={18} />
            <UrgentCase caseId="#CASE-0039" name="ANON-48392"         issue="Sleep & Depression" phq9={21} isAnon />
            <UrgentCase caseId="#CASE-0029" name="Nwosu Tochukwu"    issue="Suicidal Ideation" phq9={24} />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent messages */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-[13px] font-semibold text-gray-900">Recent Messages</h2>
            <Link href="/dashboard/counsellor/messages"
              className="text-[11.5px] text-teal-700 font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="px-5 divide-y divide-gray-50">
            {[
              { name: 'Fatima Abdullahi',  msg: 'Thank you for the session today',    time: '2m ago',   unread: true  },
              { name: 'Okonkwo C.',         msg: 'Can we reschedule to Thursday?',     time: '1h ago',   unread: true  },
              { name: 'Nwosu Tochukwu',    msg: 'I tried the breathing exercises...',  time: '3h ago',   unread: false },
              { name: 'ANON-48392',         msg: 'I have been feeling better lately',  time: 'Yesterday', unread: false },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3 py-3 group cursor-pointer hover:bg-gray-50/50 -mx-5 px-5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[10px] font-bold text-teal-700 shrink-0">
                  {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-gray-900 truncate">{m.name}</p>
                  <p className="text-[10.5px] text-gray-400 truncate">{m.msg}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-gray-400">{m.time}</span>
                  {m.unread && <span className="w-2 h-2 rounded-full bg-teal-600" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly performance */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-[13px] font-semibold text-gray-900">This Week</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            {[
              { label: 'Sessions Completed', value: 9,  total: 12, color: 'bg-teal-600'  },
              { label: 'Cases Resolved',      value: 3,  total: 8,  color: 'bg-green-500' },
              { label: 'Messages Replied',    value: 18, total: 21, color: 'bg-blue-500'  },
              { label: 'Notes Written',       value: 7,  total: 9,  color: 'bg-purple-500'},
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11.5px] text-gray-700">{item.label}</span>
                  <span className="text-[11px] font-semibold text-gray-900">{item.value}/{item.total}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-[13px] font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            {[
              { label: 'Write Session Note',    href: '/dashboard/counsellor/notes',        color: 'bg-teal-50 text-teal-700 hover:bg-teal-100'     },
              { label: 'View My Schedule',      href: '/dashboard/counsellor/appointments', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100'      },
              { label: 'Message a Student',     href: '/dashboard/counsellor/messages',     color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { label: 'Review Urgent Cases',   href: '/dashboard/counsellor/cases',        color: 'bg-red-50 text-red-700 hover:bg-red-100'         },
              { label: 'Update My Profile',     href: '/dashboard/counsellor/profile',      color: 'bg-gray-50 text-gray-700 hover:bg-gray-100'      },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[12px] font-medium transition-colors ${a.color}`}
              >
                {a.label}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Insight banner */}
      <div className="bg-teal-800 rounded-2xl px-6 py-5">
        <p className="text-[10px] font-bold text-teal-300 uppercase tracking-[0.08em] mb-2">
          Monthly Insight
        </p>
        <h3 className="text-[15px] font-semibold text-white mb-3">
          Your performance this month
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Student satisfaction',  value: '4.8★', sub: 'Based on 28 reviews'     },
            { label: 'Avg. response time',    value: '18min', sub: '↓ 6min improvement'      },
            { label: 'Cases resolved',        value: '91%',   sub: 'Above platform average'  },
          ].map((m) => (
            <div key={m.label} className="bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-3">
              <p className="text-[9.5px] text-white/45 uppercase tracking-[0.06em] mb-1">{m.label}</p>
              <p className="text-[18px] font-bold text-teal-300 leading-none tracking-tight">{m.value}</p>
              <p className="text-[10.5px] text-white/55 mt-1.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}