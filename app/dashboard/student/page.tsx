'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { getMe, getAppointments } from '@/lib/api';
import {
  HeartPulse, CalendarDays, MessageSquare, UserRound,
  ChevronRight, ArrowRight, BookOpen, Sparkles,
  CheckCircle2, Clock, XCircle, BarChart3,
  TrendingUp, TrendingDown, Brain, CloudRain, Moon, Flame, Video
} from 'lucide-react';

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

/* ─────────────────────────────────────────
   WELLBEING RING
───────────────────────────────────────────── */
function WellbeingRing({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={radius} fill="none" stroke="#fff" strokeWidth="8"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round" transform="rotate(-90 48 48)"
        />
        <text x="48" y="46" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">{score}</text>
        <text x="48" y="60" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">/ 100</text>
      </svg>
      <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mt-1">Wellbeing score</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   THEME-AWARE ACCENT TOKENS
───────────────────────────────────────────── */
const ACCENT_LIGHT = {
  green: { bg: '#f0faf4', border: '#b6e6cc', icon: '#008751', label: '#3B6D11', value: '#1a3d1f', bar: '#b6e6cc', fill: '#008751' },
  blue:  { bg: '#eef5fd', border: '#b3d3f5', icon: '#378ADD', label: '#185FA5', value: '#0c2f52', bar: '#b3d3f5', fill: '#378ADD' },
  amber: { bg: '#fdf6e8', border: '#f0d08a', icon: '#BA7517', label: '#854F0B', value: '#412402', bar: '#f0d08a', fill: '#BA7517' },
  red:   { bg: '#fdf0f0', border: '#f5bebe', icon: '#E24B4A', label: '#A32D2D', value: '#501313', bar: '#f5bebe', fill: '#E24B4A' },
} as const;

const ACCENT_DARK = {
  green: { bg: 'rgba(0,135,81,0.15)',  border: 'rgba(0,135,81,0.30)',  icon: '#00a86b', label: '#86efac', value: '#bbf7d0', bar: 'rgba(0,135,81,0.25)', fill: '#00a86b' },
  blue:  { bg: 'rgba(55,138,221,0.12)', border: 'rgba(55,138,221,0.28)', icon: '#60a5fa', label: '#93c5fd', value: '#bfdbfe', bar: 'rgba(55,138,221,0.20)', fill: '#60a5fa' },
  amber: { bg: 'rgba(186,117,23,0.12)', border: 'rgba(186,117,23,0.28)', icon: '#fbbf24', label: '#fde68a', value: '#fef3c7', bar: 'rgba(186,117,23,0.20)', fill: '#fbbf24' },
  red:   { bg: 'rgba(226,75,74,0.12)',  border: 'rgba(226,75,74,0.28)',  icon: '#f87171', label: '#fca5a5', value: '#fee2e2', bar: 'rgba(226,75,74,0.20)',  fill: '#f87171' },
} as const;

type AccentKey = keyof typeof ACCENT_LIGHT;

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, progressValue, accentKey, badge, badgeVariant = 'positive', isDarkMode }: {
  label: string; value: string; sub?: string; icon: React.ElementType;
  progressValue: number; accentKey: AccentKey; badge?: string;
  badgeVariant?: 'positive' | 'negative'; isDarkMode: boolean;
}) {
  const a = isDarkMode ? ACCENT_DARK[accentKey] : ACCENT_LIGHT[accentKey];
  return (
    <div
      className="relative rounded-[20px] p-5 flex flex-col gap-0 overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-[3px]"
      style={{ background: a.bg, border: `1px solid ${a.border}` }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 12px 32px ${a.fill}33`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div className="absolute bottom-[-18px] right-[-18px] w-[72px] h-[72px] rounded-full opacity-[0.08]"
        style={{ background: a.fill }} />

      <div className="flex items-center justify-between mb-[18px]">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: a.label }}>{label}</span>
        <span className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white"
          style={{ background: a.icon }}>
          <Icon size={16} />
        </span>
      </div>

      <p className="text-[38px] font-bold leading-none mb-[6px]" style={{ color: a.value }}>{value}</p>

      <div className="flex items-center gap-2 mb-4">
        {badge ? (
          <span className="flex items-center gap-1 text-[12px] font-semibold px-2 py-[3px] rounded-full text-white"
            style={{ background: badgeVariant === 'positive' ? '#008751' : '#E24B4A' }}>
            {badgeVariant === 'positive' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {badge}
          </span>
        ) : sub ? (
          <span className="text-[13px] font-medium" style={{ color: a.label }}>{sub}</span>
        ) : null}
      </div>

      <div className="h-[5px] rounded-full overflow-hidden mt-auto" style={{ background: a.bar }}>
        <div className="h-full rounded-full" style={{ width: `${progressValue}%`, background: a.fill }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   QUICK ACTION ACCENT TOKENS
───────────────────────────────────────────── */
const QA_LIGHT = {
  green:  { bg: '#f0faf4', border: '#b6e6cc', icon: '#008751', label: '#1a3d1f', desc: '#3B6D11', cta: '#008751' },
  blue:   { bg: '#eef5fd', border: '#b3d3f5', icon: '#378ADD', label: '#0c2f52', desc: '#185FA5', cta: '#378ADD' },
  purple: { bg: '#f3f1fe', border: '#c9c4f4', icon: '#7F77DD', label: '#26215C', desc: '#534AB7', cta: '#7F77DD' },
  amber:  { bg: '#fdf6e8', border: '#f0d08a', icon: '#BA7517', label: '#412402', desc: '#854F0B', cta: '#BA7517' },
} as const;

const QA_DARK = {
  green:  { bg: 'rgba(0,135,81,0.13)',   border: 'rgba(0,135,81,0.28)',   icon: '#00a86b', label: '#bbf7d0', desc: '#86efac', cta: '#00a86b' },
  blue:   { bg: 'rgba(55,138,221,0.10)', border: 'rgba(55,138,221,0.25)', icon: '#60a5fa', label: '#bfdbfe', desc: '#93c5fd', cta: '#60a5fa' },
  purple: { bg: 'rgba(127,119,221,0.10)',border: 'rgba(127,119,221,0.25)',icon: '#a5b4fc', label: '#e0e7ff', desc: '#c7d2fe', cta: '#a5b4fc' },
  amber:  { bg: 'rgba(186,117,23,0.10)', border: 'rgba(186,117,23,0.25)', icon: '#fbbf24', label: '#fef3c7', desc: '#fde68a', cta: '#fbbf24' },
} as const;

type QAAccentKey = keyof typeof QA_LIGHT;

/* ─────────────────────────────────────────
   QUICK ACTION CARD
───────────────────────────────────────────── */
function QuickAction({ href, label, desc, icon: Icon, accentKey, isDarkMode }: {
  href: string; label: string; desc: string;
  icon: React.ElementType; accentKey: QAAccentKey; isDarkMode: boolean;
}) {
  const a = isDarkMode ? QA_DARK[accentKey] : QA_LIGHT[accentKey];
  return (
    <Link
      href={href}
      className="relative rounded-[20px] p-5 flex flex-col gap-0 overflow-hidden transition-all duration-200 hover:-translate-y-[3px]"
      style={{ background: a.bg, border: `1px solid ${a.border}` }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 12px 32px ${a.icon}33`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div className="absolute bottom-[-20px] right-[-20px] w-[80px] h-[80px] rounded-full opacity-[0.07]"
        style={{ background: a.icon }} />

      <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center mb-4 text-white"
        style={{ background: a.icon }}>
        <Icon size={20} />
      </div>

      <p className="text-[14px] font-bold mb-1.5" style={{ color: a.label }}>{label}</p>
      <p className="text-[12px] leading-relaxed mb-5" style={{ color: a.desc }}>{desc}</p>

      <div className="flex items-center gap-2 mt-auto" style={{ color: a.cta }}>
        <span className="text-[12px] font-bold">Get started</span>
        <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white"
          style={{ background: a.cta }}>
          <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  /* ── Dark mode sync (matches sidebar/header pattern) ── */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDarkMode(saved === 'dark');

    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ isDarkMode: boolean }>;
      if (custom.detail?.isDarkMode !== undefined) {
        setIsDarkMode(custom.detail.isDarkMode);
      }
    };
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) setUser(JSON.parse(stored));

    getMe().then((data) => {
      if (data) {
        setUser(data);
        Cookies.set('user', JSON.stringify(data), { expires: 1 });
      }
    });

    getAppointments().then((data) => {
      setAppointments(data);
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
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  );
  const nextAppointment = upcomingAppointments[0] ?? null;
  const firstName = user?.full_name?.split(' ')[0] ?? 'Student';

  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;
  const totalCount = appointments.length || 1;

  // ─── Theme tokens ────────────────────────────────────────────────────────
  const pageBreadcrumb   = isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.40)';
  const pageTitle        = isDarkMode ? '#ffffff'                : '#111827';
  const pageSubtitle     = isDarkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.50)';

  // Appointment / Resources card
  const apptBg           = isDarkMode ? 'rgba(0,135,81,0.13)'   : '#f0faf4';
  const apptBorder       = isDarkMode ? 'rgba(0,135,81,0.28)'   : '#b6e6cc';
  const apptTitle        = isDarkMode ? '#bbf7d0'                : '#1a3d1f';
  const apptBody         = isDarkMode ? '#86efac'                : '#3B6D11';
  const apptDivider      = isDarkMode ? 'rgba(0,135,81,0.25)'   : '#b6e6cc';
  const apptHover        = isDarkMode ? 'rgba(0,135,81,0.12)'   : 'rgba(0,135,81,0.07)';

  // Resource row icons — dark overrides where needed
  const resourceIconMap = isDarkMode ? [
    { iconCls: 'bg-[rgba(55,138,221,0.15)] text-[#60a5fa]',   tagCls: 'bg-[rgba(55,138,221,0.15)] text-[#93c5fd]' },
    { iconCls: 'bg-[rgba(127,119,221,0.15)] text-[#a5b4fc]',  tagCls: 'bg-[rgba(127,119,221,0.15)] text-[#c7d2fe]' },
    { iconCls: 'bg-[#008751] text-white',                      tagCls: 'bg-[#008751] text-white' },
    { iconCls: 'bg-[rgba(186,117,23,0.15)] text-[#fbbf24]',   tagCls: 'bg-[rgba(186,117,23,0.15)] text-[#fde68a]' },
  ] : [
    { iconCls: 'bg-[#eef5fd] text-[#378ADD]',  tagCls: 'bg-[#eef5fd] text-[#185FA5]' },
    { iconCls: 'bg-[#f3f1fe] text-[#7F77DD]',  tagCls: 'bg-[#f3f1fe] text-[#534AB7]' },
    { iconCls: 'bg-[#008751] text-white',       tagCls: 'bg-[#008751] text-white' },
    { iconCls: 'bg-[#fdf6e8] text-[#BA7517]',  tagCls: 'bg-[#fdf6e8] text-[#854F0B] border border-[#f0d08a]' },
  ];
  // ─────────────────────────────────────────────────────────────────────────

  const resourceItems = [
    { title: 'Managing Exam Anxiety',    sub: '5 min read', tag: 'Anxiety',    icon: Brain     },
    { title: 'Understanding Depression', sub: '8 min read', tag: 'Depression', icon: CloudRain },
    { title: 'Sleep & Mental Health',    sub: '6 min read', tag: 'Wellness',   icon: Moon      },
    { title: 'Stress Management Tips',   sub: '4 min read', tag: 'Stress',     icon: Flame     },
  ];

  return (
    <div
      className="flex flex-col gap-6 px-6 pt-3 max-w-400 mx-auto min-h-screen transition-colors duration-300"
      style={{ background: isDarkMode ? 'rgba(0,20,10,0.0)' : 'transparent' }}
    >

      {/* ── Page Header ── */}
      <div>
        <div className="flex items-center gap-2 text-[14px] mb-1" style={{ color: pageBreadcrumb }}>
          <span>Portal</span>
          <ChevronRight size={12} />
          <span className="text-[18px] font-medium" style={{ color: pageSubtitle }}>Dashboard</span>
        </div>
        <h1 className="text-[30px] font-bold" style={{ color: pageTitle }}>Overview</h1>
        <p className="text-[16px] mt-1" style={{ color: pageSubtitle }}>
          Here's your mental health journey at Yabatech.
        </p>
      </div>

      {/* ── Welcome Banner ── */}
      <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 200 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://camhs.huhs.harvard.edu/files/2025/04/homepage-2.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDarkMode
              ? 'linear-gradient(105deg, rgba(0,20,10,0.97) 0%, rgba(0,55,30,0.90) 55%, rgba(0,80,40,0.60) 100%)'
              : 'linear-gradient(105deg, rgba(0,55,30,0.93) 0%, rgba(0,87,51,0.82) 55%, rgba(0,87,51,0.55) 100%)',
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-7 py-8">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={17} className="text-yellow-300" />
              <p className="text-[16px] font-bold text-yellow-300 uppercase tracking-[0.12em]">Welcome back</p>
            </div>
            <h2 className="text-[23px] font-bold text-white leading-snug mb-2">
              Hi {firstName}, how are you feeling today?
            </h2>
            <p className="text-[15px] text-white/60 max-w-sm leading-relaxed">
              Your wellbeing matters. Take a quick assessment or book a session with a counsellor.
            </p>
            <Link
              href="/dashboard/student/assessment"
              className="inline-flex items-center gap-1.5 mt-5 px-5 py-2.5 rounded-xl
                         bg-white text-[#008751] text-[15px] font-bold
                         hover:bg-white/90 transition-colors shadow-lg shadow-black/20"
            >
              Take assessment <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hidden sm:block">
            <WellbeingRing score={72} />
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Sessions attended"
          value={String(completedCount).padStart(2, '0')}
          sub="Total completed sessions"
          icon={CheckCircle2}
          accentKey="green"
          progressValue={Math.round((completedCount / totalCount) * 100)}
          badge="+2 this month"
          badgeVariant="positive"
          isDarkMode={isDarkMode}
        />
        <StatCard
          label="Assessments taken"
          value="00"
          sub="No assessments yet"
          icon={BarChart3}
          accentKey="blue"
          progressValue={0}
          isDarkMode={isDarkMode}
        />
        <StatCard
          label="Upcoming sessions"
          value={String(upcomingAppointments.length).padStart(2, '0')}
          sub={nextAppointment ? formatDate(nextAppointment.date) : 'No upcoming sessions'}
          icon={Clock}
          accentKey="amber"
          progressValue={upcomingAppointments.length > 0 ? 40 : 0}
          isDarkMode={isDarkMode}
        />
        <StatCard
          label="Cancelled"
          value={String(cancelledCount).padStart(2, '0')}
          sub="Total cancelled sessions"
          icon={XCircle}
          accentKey="red"
          progressValue={Math.round((cancelledCount / totalCount) * 100)}
          badge={cancelledCount > 0 ? 'Needs review' : undefined}
          badgeVariant="negative"
          isDarkMode={isDarkMode}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p
          className="text-[15px] font-bold uppercase tracking-widest mb-3"
          style={{ color: isDarkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.40)' }}
        >
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <QuickAction href="/dashboard/student/assessment" label="Wellbeing Check"
            desc="Take PHQ-9, GAD-7 or PSS assessment" icon={HeartPulse} accentKey="green" isDarkMode={isDarkMode} />
          <QuickAction href="/dashboard/student/book" label="Book a Session"
            desc="Schedule time with an available counsellor" icon={CalendarDays} accentKey="blue" isDarkMode={isDarkMode} />
          <QuickAction href="/dashboard/student/messages" label="Message Counsellor"
            desc="Send a secure message to your counsellor" icon={MessageSquare} accentKey="purple" isDarkMode={isDarkMode} />
          <QuickAction href="/dashboard/student/anonymous" label="Anonymous Chat"
            desc="Talk without revealing your identity" icon={UserRound} accentKey="amber" isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 pb-6">

        {/* Next Appointment */}
        <div
          className="relative rounded-[20px] p-6 overflow-hidden transition-colors duration-300"
          style={{ background: apptBg, border: `1px solid ${apptBorder}` }}
        >
          <div className="absolute bottom-[-28px] right-[-28px] w-[110px] h-[110px] rounded-full opacity-[0.06]"
            style={{ background: '#008751' }} />
          <div className="absolute top-[-20px] right-[60px] w-[60px] h-[60px] rounded-full opacity-[0.04]"
            style={{ background: '#008751' }} />

          <div className="flex items-center justify-between mb-5 relative">
            <h2 className="text-[18px] font-bold" style={{ color: apptTitle }}>Next Appointment</h2>
            <Link href="/dashboard/student/appointments"
              className="flex items-center gap-1 text-[12px] font-bold"
              style={{ color: '#008751' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {nextAppointment ? (
            <>
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-16 rounded-[14px] flex flex-col items-center justify-center text-white shrink-0"
                  style={{ background: '#008751' }}>
                  <span className="text-[26px] font-bold leading-none">
                    {new Date(nextAppointment.date).getDate()}
                  </span>
                  <span className="text-[16px] font-semibold uppercase tracking-wider opacity-75 mt-0.5">
                    {new Date(nextAppointment.date).toLocaleString('en', { month: 'short' })}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold truncate mb-1" style={{ color: apptTitle }}>
                    Session with {nextAppointment.counsellor_name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[13px] mb-1" style={{ color: apptBody }}>
                    <Clock size={15} />
                    {formatDate(nextAppointment.date)} · {formatTime(nextAppointment.time)}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px]" style={{ color: apptBody }}>
                    <Video size={15} />
                    {nextAppointment.session_type} · {nextAppointment.duration ?? 45} min
                  </div>
                </div>

                <span
                  className="shrink-0 text-[15px] font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={nextAppointment.status === 'Confirmed'
                    ? { background: '#008751', color: '#fff' }
                    : { background: isDarkMode ? 'rgba(186,117,23,0.20)' : '#fdf6e8', border: `1px solid ${isDarkMode ? 'rgba(186,117,23,0.35)' : '#f0d08a'}`, color: isDarkMode ? '#fde68a' : '#854F0B' }
                  }
                >
                  {nextAppointment.status}
                </span>
              </div>

              {upcomingAppointments.length > 1 && (
                <>
                  <div className="h-px my-[20px]" style={{ background: apptDivider }} />
                  <p className="text-center text-[15px]" style={{ color: apptBody }}>
                    +{upcomingAppointments.length - 1} more upcoming.{' '}
                    <Link href="/dashboard/student/appointments"
                      className="font-bold text-[14px]" style={{ color: '#008751' }}>
                      View all
                    </Link>
                  </p>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-7 text-center relative">
              <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-white mb-4"
                style={{ background: '#008751' }}>
                <CalendarDays size={22} />
              </div>
              <p className="text-[20px] font-bold mb-1.5" style={{ color: apptTitle }}>No upcoming appointments</p>
              <p className="text-[16px] mb-5" style={{ color: apptBody }}>Schedule a session with a counsellor</p>
              <Link href="/dashboard/student/book"
                className="inline-flex items-center gap-2 text-white text-[12px] font-bold px-5 py-2.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: '#008751' }}>
                Book a session <ArrowRight size={12} />
              </Link>
            </div>
          )}
        </div>

        {/* Resources */}
        <div
          className="relative rounded-[20px] overflow-hidden transition-colors duration-300"
          style={{ background: apptBg, border: `1px solid ${apptBorder}` }}
        >
          <div className="absolute bottom-[-28px] right-[-28px] w-[100px] h-[100px] rounded-full opacity-[0.05] pointer-events-none"
            style={{ background: '#008751' }} />

          <div className="flex items-center justify-between px-[22px] pt-5 pb-4">
            <h2 className="text-[15px] font-bold" style={{ color: apptTitle }}>Resources</h2>
            <Link href="/dashboard/student/resources"
              className="flex items-center gap-1 text-[13px] font-bold"
              style={{ color: '#008751' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="px-3 pb-3 flex flex-col gap-1.5">
            {resourceItems.map((r, i) => {
              const cls = resourceIconMap[i];
              return (
                <Link
                  key={r.title}
                  href="/dashboard/student/resources"
                  className="flex items-center justify-between px-2.5 py-[11px] rounded-[14px] transition-colors group"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = apptHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0 ${cls.iconCls}`}>
                      <r.icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold truncate" style={{ color: apptTitle }}>{r.title}</p>
                      <p className="text-[13px] mt-px" style={{ color: apptBody }}>{r.sub}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 ml-2 text-[12px] font-bold px-2.5 py-[3px] rounded-full uppercase tracking-wide ${cls.tagCls}`}>
                    {r.tag}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}