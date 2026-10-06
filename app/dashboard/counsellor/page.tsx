'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { getCounsellorStats, getCounsellorAppointments, getMessages, getCounsellorCases } from '@/lib/api';

interface User        { full_name: string; email: string }
interface Stats {
  total_appointments: number;
  pending_appointments: number;
  confirmed_appointments: number;
  completed_appointments: number;
  total_students: number;
  // weekly stats — returned by some backends
  weekly_sessions_completed?: number;
  weekly_sessions_total?: number;
  weekly_cases_resolved?: number;
  weekly_cases_total?: number;
  weekly_messages_replied?: number;
  weekly_messages_total?: number;
  weekly_notes_written?: number;
  weekly_notes_total?: number;
  // monthly insight
  satisfaction_rating?: number;
  avg_response_time_min?: number;
  cases_resolved_pct?: number;
  review_count?: number;
}
interface Appointment { id: number; student_name: string; session_type: string; date: string; time: string; status: string; duration: number }
interface Conversation { user_id: number; full_name: string; last_message: string; last_time: string; unread: number }
interface CaseItem    { id: string | number; student_name?: string; studentName?: string; issue_type?: string; issueType?: string; case_id?: string; caseId?: string; phq9_score?: number; phq9?: number; is_anonymous?: boolean; isAnonymous?: boolean; severity?: string; status?: string }

// ─── Dark-mode token hook ─────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDark(saved === 'dark');
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ isDarkMode: boolean }>;
      if (ev.detail?.isDarkMode !== undefined) setDark(ev.detail.isDarkMode);
    };
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);
  return {
    dark,
    cardBg:         dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    cardBorder:     dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
    cardHover:      dark ? 'rgba(255,255,255,0.09)' : '#f9fafb',
    divider:        dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    textPrimary:    dark ? '#ffffff'                : '#111827',
    textSecondary:  dark ? 'rgba(255,255,255,0.70)' : '#374151',
    textMuted:      dark ? 'rgba(255,255,255,0.45)' : '#6b7280',
    barBg:          dark ? 'rgba(255,255,255,0.10)' : '#f3f4f6',
    greenBg:        dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:    dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:      dark ? '#86efac'                : '#1a5c2a',
    todayBadgeBg:   dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    todayBadgeText: dark ? '#86efac'                : '#1a5c2a',
  };
}

function StatCard({ label, value, sub, accent, t }: {
  label: string; value: string; sub: string; accent: string; t: ReturnType<typeof useTheme>;
}) {
  return (
    <div className="relative rounded-2xl p-6 overflow-hidden hover:shadow-md transition-all duration-200"
      style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      <div className={`absolute top-0 left-0 right-0 h-[4px] rounded-t-2xl ${accent}`} />
      <p className="text-[42px] font-bold leading-none tracking-tight font-[syne]"
        style={{ color: t.textPrimary }}>{value}</p>
      <p className="text-[15px] font-semibold mt-2 font-[lexend]" style={{ color: t.textSecondary }}>{label}</p>
      <p className="text-[13px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>{sub}</p>
    </div>
  );
}

function AppointmentCard({ time, name, type, status, isAnon, t }: {
  time: string; name: string; type: string; status: string; isAnon?: boolean; t: ReturnType<typeof useTheme>;
}) {
  const statusMap: Record<string, { bg: string; text: string }> = {
    Confirmed: { bg: t.dark ? 'rgba(34,197,94,0.15)'   : '#f0fdf4', text: t.dark ? '#86efac' : '#15803d' },
    Pending:   { bg: t.dark ? 'rgba(251,191,36,0.15)'  : '#fffbeb', text: t.dark ? '#fde68a' : '#b45309' },
    Upcoming:  { bg: t.dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', text: t.dark ? 'rgba(255,255,255,0.50)' : '#6b7280' },
  };
  const typeMap: Record<string, { bg: string; text: string }> = {
    Physical: { bg: t.greenBg, text: t.greenText },
    Video:    { bg: t.dark ? 'rgba(139,92,246,0.15)' : '#f5f3ff', text: t.dark ? '#c4b5fd' : '#6d28d9' },
    Chat:     { bg: t.dark ? 'rgba(59,130,246,0.15)'  : '#eff6ff', text: t.dark ? '#93c5fd' : '#1d4ed8' },
  };
  const st = statusMap[status] ?? statusMap['Upcoming'];
  const tt = typeMap[type]     ?? typeMap['Chat'];
  return (
    <div className="flex items-center gap-4 py-4 last:border-0 group"
      style={{ borderBottom: `1px solid ${t.divider}` }}>
      <div className="text-center shrink-0 w-[68px]">
        <p className="text-[15px] font-bold font-mono" style={{ color: t.greenText }}>{time}</p>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
        style={isAnon
          ? { background: t.dark ? 'rgba(251,191,36,0.15)' : '#fffbeb', color: t.dark ? '#fde68a' : '#b45309', border: `1px solid ${t.dark ? 'rgba(251,191,36,0.30)' : '#fde68a'}` }
          : { background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }
        }>
        {isAnon ? 'AN' : name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold truncate font-[lexend]" style={{ color: t.textPrimary }}>{name}</p>
        {isAnon && <p className="text-[12px] font-[lexend]" style={{ color: t.textMuted }}>Anonymous session</p>}
      </div>
      <span className="text-[12px] font-medium px-3 py-1 rounded-md font-[lexend]"
        style={{ background: tt.bg, color: tt.text }}>{type}</span>
      <span className="text-[12px] font-semibold px-3 py-1 rounded-full font-[lexend]"
        style={{ background: st.bg, color: st.text }}>{status}</span>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[13px] font-medium hover:underline shrink-0 font-[lexend]"
        style={{ color: t.greenText }}>View →</button>
    </div>
  );
}

function UrgentCaseRow({ c, t }: { c: CaseItem; t: ReturnType<typeof useTheme> }) {
  const name   = c.student_name ?? c.studentName ?? 'Unknown';
  const issue  = c.issue_type   ?? c.issueType   ?? 'General';
  const caseId = c.case_id      ?? c.caseId      ?? `#CASE-${c.id}`;
  const phq9   = c.phq9_score   ?? c.phq9        ?? 0;
  const isAnon = c.is_anonymous ?? c.isAnonymous ?? false;
  return (
    <div className="flex items-start gap-4 py-4 last:border-0"
      style={{ borderBottom: `1px solid ${t.divider}` }}>
      <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>{name}</p>
          <span className="text-[12px] font-mono" style={{ color: t.textMuted }}>{caseId}</span>
        </div>
        <p className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>{issue}</p>
        {isAnon && <p className="text-[12px] mt-0.5 font-[lexend]" style={{ color: t.dark ? '#fde68a' : '#b45309' }}>Anonymous session</p>}
      </div>
      {phq9 > 0 && (
        <span className="text-[14px] font-bold shrink-0 font-[lexend]"
          style={{ color: phq9 >= 20 ? '#ef4444' : (t.dark ? '#fde68a' : '#b45309') }}>
          PHQ-9: {phq9}
        </span>
      )}
    </div>
  );
}

function Card({ t, className = '', children }: { t: ReturnType<typeof useTheme>; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}
      style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      {children}
    </div>
  );
}

function CardHeader({ t, children }: { t: ReturnType<typeof useTheme>; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: `1px solid ${t.divider}` }}>
      {children}
    </div>
  );
}

export default function CounsellorOverviewPage() {
  const t = useTheme();

  const [user,          setUser]         = useState<User | null>(null);
  const [stats,         setStats]        = useState<Stats | null>(null);
  const [appointments,  setAppointments] = useState<Appointment[]>([]);
  const [conversations, setConversations]= useState<Conversation[]>([]);
  const [urgentCases,   setUrgentCases]  = useState<CaseItem[]>([]);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) setUser(JSON.parse(stored));

    // Load all data in parallel
    Promise.all([
      getCounsellorStats(),
      getCounsellorAppointments(),
      getMessages(),
      getCounsellorCases(),
    ]).then(([statsData, apptData, msgData, casesData]) => {
      if (statsData)             setStats(statsData);
      if (Array.isArray(apptData)) setAppointments(apptData);
      if (Array.isArray(msgData))  setConversations(msgData.slice(0, 4));
      if (Array.isArray(casesData)) {
        // Filter to urgent / high-severity cases, cap at 3
        const urgent = casesData
          .filter((c: CaseItem) => c.status === 'Urgent' || c.severity === 'High')
          .slice(0, 3);
        setUrgentCases(urgent);
      }
    });
  }, []);

  const firstName = user?.full_name?.split(' ')[0] ?? 'Counsellor';

  function formatTime(timeStr: string) {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${display}:${m} ${ampm}`;
  }

  const todayStr          = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const upcomingCount     = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length;

  // ── "This Week" bars — use backend weekly stats when available, else derive from appointments ──
  const weekCompleted = stats?.weekly_sessions_completed ?? appointments.filter(a => a.status === 'Completed').length;
  const weekTotal     = stats?.weekly_sessions_total     ?? Math.max(appointments.length, weekCompleted);
  const thisWeek = [
    { label: 'Sessions Completed', value: weekCompleted,                          total: Math.max(weekTotal, 1),          color: '#008751' },
    { label: 'Cases Resolved',      value: stats?.weekly_cases_resolved    ?? 0,  total: Math.max(stats?.weekly_cases_total    ?? 1, 1), color: '#22c55e' },
    { label: 'Messages Replied',    value: stats?.weekly_messages_replied   ?? 0,  total: Math.max(stats?.weekly_messages_total ?? 1, 1), color: '#3b82f6' },
    { label: 'Notes Written',       value: stats?.weekly_notes_written      ?? 0,  total: Math.max(stats?.weekly_notes_total    ?? 1, 1), color: '#a855f7' },
  ];

  // ── Monthly insight — use backend values when available ──
  const satisfactionRating  = stats?.satisfaction_rating     ?? null;
  const avgResponseTime     = stats?.avg_response_time_min   ?? null;
  const casesResolvedPct    = stats?.cases_resolved_pct      ?? null;
  const reviewCount         = stats?.review_count            ?? null;

  const qa = [
    { label: 'Write Session Note',  href: '/dashboard/counsellor/notes',        bg: t.greenBg, text: t.greenText, hbg: t.dark ? 'rgba(0,135,81,0.30)' : '#d4edda' },
    { label: 'View My Schedule',    href: '/dashboard/counsellor/appointments',  bg: t.dark ? 'rgba(59,130,246,0.15)'  : '#eff6ff', text: t.dark ? '#93c5fd' : '#1d4ed8',  hbg: t.dark ? 'rgba(59,130,246,0.25)'  : '#dbeafe' },
    { label: 'Message a Student',   href: '/dashboard/counsellor/messages',      bg: t.dark ? 'rgba(139,92,246,0.15)' : '#f5f3ff',  text: t.dark ? '#c4b5fd' : '#6d28d9',  hbg: t.dark ? 'rgba(139,92,246,0.25)' : '#ede9fe'  },
    { label: 'Review Urgent Cases', href: '/dashboard/counsellor/cases',         bg: t.dark ? 'rgba(239,68,68,0.15)'  : '#fef2f2',  text: t.dark ? '#fca5a5' : '#b91c1c',  hbg: t.dark ? 'rgba(239,68,68,0.25)'  : '#fee2e2'  },
    { label: 'Update My Profile',   href: '/dashboard/counsellor/profile',       bg: t.dark ? 'rgba(255,255,255,0.07)': '#f9fafb',  text: t.dark ? 'rgba(255,255,255,0.70)' : '#374151', hbg: t.dark ? 'rgba(255,255,255,0.12)' : '#f3f4f6' },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* Page heading */}
      <div>
        <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
          Your Dashboard
        </h2>
        <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>Here's your overview for today</p>
      </div>

      {/* Welcome banner */}
      <div className="rounded-2xl px-7 py-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(120deg, #1a5c2a 0%, #008751 60%, #005c38 100%)' }}>
        <div>
          <p className="text-[12px] font-bold text-yellow-400 uppercase tracking-[0.10em] mb-2">Welcome back</p>
          <h3 className="text-[22px] font-bold text-white leading-snug mb-2 font-[syne]">
            Hi {firstName}, you have {todayAppointments.length} sessions today
          </h3>
          <p className="text-[15px] text-white/70">
            {stats?.confirmed_appointments ?? 0} confirmed · {stats?.pending_appointments ?? 0} pending · {upcomingCount} upcoming total.
          </p>
        </div>
        <div className="hidden md:flex flex-col items-center justify-center rounded-2xl px-7 py-5 shrink-0"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <p className="text-[38px] font-bold text-white leading-none font-[syne]">
            {stats?.total_appointments && stats?.total_students
              ? `${Math.round((stats.completed_appointments / Math.max(stats.total_appointments, 1)) * 100)}%`
              : '—'}
          </p>
          <p className="text-[14px] text-white/60 mt-1">Completion rate</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Active Cases"        value={String(stats?.total_students ?? 0)}         sub="Students assigned"     accent="bg-[#008751]"  t={t} />
        <StatCard label="Sessions This Month" value={String(stats?.total_appointments ?? 0)}     sub="Total booked"          accent="bg-yellow-400" t={t} />
        <StatCard label="Completed"           value={String(stats?.completed_appointments ?? 0)} sub="Sessions done"         accent="bg-blue-400"   t={t} />
        <StatCard label="Pending"             value={String(stats?.pending_appointments ?? 0)}   sub="Awaiting confirmation" accent="bg-red-400"    t={t} />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">

        {/* Today's appointments */}
        <Card t={t}>
          <CardHeader t={t}>
            <div className="flex items-center gap-3">
              <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>Today's Appointments</h2>
              <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                style={{ background: t.todayBadgeBg, color: t.todayBadgeText }}>
                {todayAppointments.length} today
              </span>
            </div>
            <Link href="/dashboard/counsellor/appointments" className="text-[14px] font-medium hover:underline"
              style={{ color: t.greenText }}>View all →</Link>
          </CardHeader>
          <div className="px-6">
            {todayAppointments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[15px]" style={{ color: t.textMuted }}>No sessions scheduled for today.</p>
              </div>
            ) : (
              todayAppointments.map(a => (
                <AppointmentCard key={a.id} time={formatTime(a.time)} name={a.student_name}
                  type={a.session_type} status={a.status} t={t} />
              ))
            )}
          </div>
        </Card>

        {/* Urgent cases — REAL DATA */}
        <Card t={t}>
          <CardHeader t={t}>
            <div className="flex items-center gap-3">
              <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>Urgent Cases</h2>
              {urgentCases.length > 0 && (
                <span className="text-[12px] font-bold px-3 py-1 rounded-full"
                  style={{ background: t.dark ? 'rgba(239,68,68,0.18)' : '#fef2f2', color: t.dark ? '#fca5a5' : '#b91c1c' }}>
                  {urgentCases.length} high
                </span>
              )}
            </div>
            <Link href="/dashboard/counsellor/cases" className="text-[14px] font-medium hover:underline"
              style={{ color: t.greenText }}>View all →</Link>
          </CardHeader>
          <div className="px-6">
            {urgentCases.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[15px]" style={{ color: t.textMuted }}>No urgent cases right now.</p>
              </div>
            ) : (
              urgentCases.map(c => <UrgentCaseRow key={c.id} c={c} t={t} />)
            )}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent messages — REAL DATA */}
        <Card t={t}>
          <CardHeader t={t}>
            <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>Recent Messages</h2>
            <Link href="/dashboard/counsellor/messages" className="text-[14px] font-medium hover:underline"
              style={{ color: t.greenText }}>View all →</Link>
          </CardHeader>
          <div className="px-6">
            {conversations.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[15px]" style={{ color: t.textMuted }}>No messages yet.</p>
              </div>
            ) : (
              conversations.map(m => (
                <div key={m.user_id}
                  className="flex items-center gap-4 py-4 cursor-pointer -mx-6 px-6 transition-colors"
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                    style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                    {m.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold truncate" style={{ color: t.textPrimary }}>{m.full_name}</p>
                    <p className="text-[13px] truncate mt-0.5" style={{ color: t.textMuted }}>
                      {m.last_message || 'No messages yet'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[12px]" style={{ color: t.textMuted }}>{m.last_time}</span>
                    {m.unread > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.greenText }} />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* This week — uses real stats when available */}
        <Card t={t}>
          <CardHeader t={t}>
            <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>This Week</h2>
          </CardHeader>
          <div className="px-6 py-5 space-y-5">
            {thisWeek.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px]" style={{ color: t.textSecondary }}>{item.label}</span>
                  <span className="text-[14px] font-bold" style={{ color: t.textPrimary }}>
                    {item.value}/{item.total}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: t.barBg }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((item.value / item.total) * 100, 100)}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card t={t}>
          <CardHeader t={t}>
            <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>Quick Actions</h2>
          </CardHeader>
          <div className="px-6 py-5 space-y-3">
            {qa.map(a => (
              <Link key={a.label} href={a.href}
                className="flex items-center justify-between px-5 py-3.5 rounded-xl text-[15px] font-medium transition-colors"
                style={{ background: a.bg, color: a.text }}
                onMouseEnter={e => (e.currentTarget.style.background = a.hbg)}
                onMouseLeave={e => (e.currentTarget.style.background = a.bg)}>
                {a.label}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly insight banner — real data when available */}
      <div className="rounded-2xl px-7 py-6"
        style={{ background: 'linear-gradient(120deg, #1a5c2a 0%, #008751 60%, #005c38 100%)' }}>
        <p className="text-[13px] font-bold text-yellow-400 uppercase tracking-[0.10em] mb-2">Monthly Insight</p>
        <h3 className="text-[19px] font-bold text-white mb-5 font-[syne]">Your performance this month</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Student satisfaction',
              value: satisfactionRating != null ? `${satisfactionRating}★` : '—',
              sub:   reviewCount        != null ? `Based on ${reviewCount} reviews` : 'No reviews yet',
            },
            {
              label: 'Avg. response time',
              value: avgResponseTime != null ? `${avgResponseTime}min` : '—',
              sub:   avgResponseTime != null ? 'Average this month' : 'No data yet',
            },
            {
              label: 'Cases resolved',
              value: casesResolvedPct != null ? `${casesResolvedPct}%` : (
                stats?.total_students && stats.total_students > 0
                  ? `${Math.round(((stats.completed_appointments ?? 0) / Math.max(stats.total_appointments ?? 1, 1)) * 100)}%`
                  : '—'
              ),
              sub: 'Based on closed cases',
            },
          ].map(m => (
            <div key={m.label} className="rounded-xl px-5 py-4"
              style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-1.5"
                style={{ color: 'rgba(255,255,255,0.50)' }}>{m.label}</p>
              <p className="text-[26px] font-bold text-yellow-400 leading-none tracking-tight font-[syne]">
                {m.value}
              </p>
              <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.60)' }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
