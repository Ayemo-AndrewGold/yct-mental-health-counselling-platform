'use client';

import { useEffect, useState } from 'react'; 
import Link from 'next/link';
import Cookies from 'js-cookie'
import { getMe, getAppointments } from '@/lib/api';

//---------------- TYPES----------------
interface User {
  full_name: string;
  email: string;
  role: string;
  matric_number?: string;
  department?: string;
}

interface Appointment {
  id: number;
  counsellor_name: string;
  session_type: string;
  date: string;
  time: string;
  status: string;
  duration?: number;
}

// -----------QUICK ACTION CARD----------------
function QuickAction({
   icon, label, desc, href, color
}: {
  icon: React.ReactNode;
  label: string;
  desc: string
  href: string;
  color: string;
})  {
  return (
    <Link href={href} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all duration-200 group flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold text-gray-900 group-hover:text-[#1a5c2a] transition-colors">{label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{desc}</p>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-[#1a5c2a] font-medium mt-auto">
        Get started
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </Link>
  );
}

// ---------------------------------STAT CARD-------------------

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accent}`} />
      <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">{value}</p>
      <p className="text-[12px] font-medium text-gray-700 mt-1">{label}</p>
      <p className="text-[10.5px] text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

//---------------------------WELLSEING SCORE RING----------
function WellbeingRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e8f5ec" strokeWidth="8"/>
        <circle
          cx="48" cy="48" r={radius} fill="none"
          stroke="#1a5c2a" strokeWidth="8"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="53" textAnchor="middle" className="text-2xl font-bold" fill="#1a5c2a" fontSize="20" fontWeight="700">
          {score}
        </text>
      </svg>
      <p className="text-[11px] text-gray-500 mt-1">Wellbeing Score</p>
    </div>
  );
}

// -----------------MAIN PAGE-------------------
export default function OverviewPage(){
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

useEffect(()=> {
 //Load from cookies first 
 const stored = Cookies.get('user');
 if (stored) setUser(JSON.parse(stored));

 //Then fetch fresh from backend
 getMe().then((data) =>{
  if (data) {
    setUser(data);
    Cookies.set('user', JSON.stringify(data), { expires: 1 });
  }
 });

 getAppointments().then((data) => {
  setAppointments(data)
 });
}, []);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

const upcomingAppointments = appointments.filter(
  a => a.status === 'Confirmed' || a.status === 'Pending'
);

const nextAppointment = upcomingAppointments[0] ?? null;

const firstName = user?.full_name?.split(' ')[0] ?? 'Student';


  return (
    <div className="px-6 py-5 space-y-5">

      {/* PAGE TITLE */}
      <div>
        <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
          Your Dashboard
        </h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Here's an overview of your mental health journey at Yabatech
        </p>
      </div>

      {/* WELCOME BANNER */}
      <div className="bg-[#1a5c2a] rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.08em] mb-1">
            Welcome back
          </p>
          <h3 className="text-[16px] font-semibold text-white leading-snug mb-1">
            Hi {firstName}, how are you feeling today?
          </h3>
          <p className="text-[12px] text-white/60 max-w-sm">
            Your wellbeing matters. Take a quick assessment or book a session with a counsellor.
          </p>
        </div>
        <div className="hidden md:block">
          <WellbeingRing score={72} />
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Sessions Attended"
          value={String(appointments.filter(a => a.status === 'Completed').length)}
          sub="Total completed sessions"
          accent="bg-[#1a5c2a]"
        />
        <StatCard
          label="Assessments Taken"
          value="0"
          sub="No assessments yet"
          accent="bg-yellow-400"
        />
        <StatCard
          label="Upcoming Appointments"
          value={String(upcomingAppointments.length)}
          sub={nextAppointment ? formatDate(nextAppointment.date) : 'No upcoming sessions'}
          accent="bg-blue-400"
        />
        <StatCard
          label="Cancelled"
          value={String(appointments.filter(a => a.status === 'Cancelled').length)}
          sub="Total canceled sessions"
          accent="bg-red-400"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-[13px] font-semibold text-gray-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <QuickAction
            href="/dashboard/student/assessment"
            color="bg-[#e8f5ec]"
            label="Wellbeing Check"
            desc="Take PHQ-9, GAD-7 or PSS assessment"
            icon={
              <svg className="w-5 h-5 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <path d="M12 21C12 21 3 15.5 3 9.5C3 7.01 4.99 5 7.5 5C9.14 5 10.61 5.83 11.5 7.09C12.39 5.83 13.86 5 15.5 5C18.01 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z"/>
              </svg>
            }
          />
          <QuickAction
            href="/dashboard/student/book"
            color="bg-blue-50"
            label="Book a Session"
            desc="Schedule time with an available counsellor"
            icon={
              <svg className="w-5 h-5 stroke-blue-600" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
          />
          <QuickAction
            href="/dashboard/student/messages"
            color="bg-purple-50"
            label="Message Counsellor"
            desc="Send a secure message to your counsellor"
            icon={
              <svg className="w-5 h-5 stroke-purple-600" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            }
          />
          <QuickAction
            href="/dashboard/student/anonymous"
            color="bg-orange-50"
            label="Anonymous Chat"
            desc="Talk without revealing your identity"
            icon={
              <svg className="w-5 h-5 stroke-orange-500" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            }
          />
        </div>
      </div>

      {/* BOTTOM ROW — UPCOMING + RESOURCES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Upcoming appointment */}
        <div className="px-5 py-4">
          {nextAppointment ? (
            <div className="flex items-start gap-4 p-4 bg-[#e8f5ec] border border-[#b6dfc0] rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-[#1a5c2a] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                {new Date(nextAppointment.date).getDate()}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-gray-900">
                  Session with {nextAppointment.counsellor_name}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.time)}
                </p>
                <p className="text-[11px] text-gray-500">
                  {nextAppointment.session_type} · {nextAppointment.duration ?? 45} min
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 bg-[#1a5c2a] text-white rounded-full">
                {nextAppointment.status}
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[12px] text-gray-400">No upcoming appointments.</p>
              <Link href="/dashboard/student/book" className="text-[12px] text-[#1a5c2a] hover:underline mt-1 inline-block">
                Book one →
              </Link>
            </div>
          )}
          {upcomingAppointments.length > 1 && (
            <p className="text-[11px] text-gray-400 mt-3 text-center">
              +{upcomingAppointments.length - 1} more upcoming.{' '}
              <Link href="/dashboard/student/sessions" className="text-[#1a5c2a] hover:underline">
                View all
              </Link>
            </p>
          )}
        </div>

        {/* Mental health resources */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-[13px] font-semibold text-gray-900">Mental Health Resources</h2>
            <Link href="/dashboard/student/resources" className="text-[11.5px] text-[#1a5c2a] font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="px-5 divide-y divide-gray-50">
            {[
              { title: 'Managing Exam Anxiety', tag: 'Anxiety', color: 'bg-blue-50 text-blue-700' },
              { title: 'Understanding Depression', tag: 'Depression', color: 'bg-purple-50 text-purple-700' },
              { title: 'Sleep & Mental Health', tag: 'Wellness', color: 'bg-green-50 text-green-700' },
              { title: 'Stress Management Tips', tag: 'Stress', color: 'bg-orange-50 text-orange-700' },
            ].map((r) => (
              <div key={r.title} className="flex items-center justify-between py-3 group">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#e8f5ec] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
                    </svg>
                  </div>
                  <p className="text-[12px] font-medium text-gray-800 group-hover:text-[#1a5c2a] transition-colors">
                    {r.title}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${r.color}`}>
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}