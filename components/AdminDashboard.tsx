'use client';

import { useState, useEffect } from 'react';
import { getAdminStats, getAdminStudents, getAdminAppointments } from '@/lib/api';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────
interface Stats {
  total_students: number;
  total_counsellors: number;
  total_appointments: number;
  pending_appointments: number;
  confirmed_appointments: number;
  completed_appointments: number;
}
interface Student {
  id: number; full_name: string; email: string;
  matric_number: string; department: string;
  date_joined: string; is_active: boolean;
}
interface AdminAppointment {
  id: number; student_name: string; counsellor_name: string;
  session_type: string; date: string; time: string;
  status: string; duration: number;
}
type AlertType = 'critical' | 'warning' | 'info';
interface SystemAlert { id: string; type: AlertType; title: string; description: string; time: string }

// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE HOOK  (amber accent for admin)
// ─────────────────────────────────────────────────────────────────────────────
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
    cardBg:        dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    cardBorder:    dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
    cardHover:     dark ? 'rgba(255,255,255,0.09)' : '#f9fafb',
    innerCard:     dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    innerBorder:   dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    divider:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.70)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.42)' : '#9ca3af',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    amberBg:       dark ? 'rgba(245,166,35,0.20)'  : '#fffbeb',
    amberBorder:   dark ? 'rgba(245,166,35,0.35)'  : '#fde68a',
    amberText:     dark ? '#fde68a'                : '#92400e',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD SHELL
// ─────────────────────────────────────────────────────────────────────────────
function Card({ t, children, className = '' }: {
  t: ReturnType<typeof useTheme>; children: React.ReactNode; className?: string;
}) {
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

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
const STAT_ICONS: Record<string, (color: string) => React.ReactNode> = {
  users: c => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  briefcase: c => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  headset: c => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  clock: c => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

function StatCard({ label, value, sub, accentClass, iconKey, iconBg, iconColor, trend, trendLabel, t }: {
  label: string; value: string; sub: string; accentClass: string;
  iconKey: string; iconBg: string; iconColor: string;
  trend: 'up' | 'down' | 'neutral'; trendLabel: string;
  t: ReturnType<typeof useTheme>;
}) {
  const trendStyle = {
    up:      { bg: t.dark ? 'rgba(34,197,94,0.18)'  : '#f0fdf4', text: t.dark ? '#86efac' : '#15803d' },
    down:    { bg: t.dark ? 'rgba(239,68,68,0.18)'  : '#fef2f2', text: t.dark ? '#fca5a5' : '#b91c1c' },
    neutral: { bg: t.dark ? 'rgba(255,255,255,0.08)': '#f3f4f6', text: t.textMuted },
  }[trend];

  return (
    <div className={`relative rounded-2xl p-6 overflow-hidden hover:shadow-md transition-all duration-200`}
      style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      <div className={`absolute top-0 left-0 right-0 h-[4px] rounded-t-2xl ${accentClass}`} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}>
          {STAT_ICONS[iconKey]?.(iconColor)}
        </div>
        <span className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full font-[lexend]"
          style={{ background: trendStyle.bg, color: trendStyle.text }}>
          {trendLabel}
        </span>
      </div>
      <p className="text-[40px] font-bold leading-none tracking-tight font-[syne]"
        style={{ color: t.textPrimary }}>{value}</p>
      <p className="text-[15px] font-semibold mt-2 font-[lexend]" style={{ color: t.textSecondary }}>{label}</p>
      <div className="h-px my-4" style={{ background: t.divider }} />
      <p className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>{sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALERT ROW
// ─────────────────────────────────────────────────────────────────────────────
function AlertRow({ alert, onDismiss, t }: {
  alert: SystemAlert; onDismiss: (id: string) => void;
  t: ReturnType<typeof useTheme>;
}) {
  const styles = {
    critical: {
      dot:  t.dark ? '#fca5a5' : '#ef4444',
      bg:   t.dark ? 'rgba(239,68,68,0.15)'  : '#fef2f2',
      text: t.dark ? '#fca5a5' : '#b91c1c',
      ping: true,
    },
    warning: {
      dot:  t.dark ? '#fde68a' : '#f59e0b',
      bg:   t.dark ? 'rgba(251,191,36,0.15)' : '#fffbeb',
      text: t.dark ? '#fde68a' : '#92400e',
      ping: false,
    },
    info: {
      dot:  t.dark ? '#93c5fd' : '#3b82f6',
      bg:   t.dark ? 'rgba(59,130,246,0.15)' : '#eff6ff',
      text: t.dark ? '#93c5fd' : '#1d4ed8',
      ping: false,
    },
  }[alert.type];

  return (
    <div className="flex items-start gap-3 py-4 last:border-0"
      style={{ borderBottom: `1px solid ${t.divider}` }}>
      <div className="relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: styles.bg }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: styles.dot }} />
        {styles.ping && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full animate-ping opacity-75"
            style={{ background: styles.dot }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold font-[lexend]" style={{ color: styles.text }}>
          {alert.title}
        </p>
        <p className="text-[13px] mt-0.5 leading-snug font-[lexend]" style={{ color: t.textMuted }}>
          {alert.description}
        </p>
        <p className="text-[12px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>{alert.time}</p>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="text-[12px] font-medium shrink-0 mt-0.5 font-[lexend] hover:underline"
        style={{ color: t.textMuted }}>
        Dismiss
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const t = useTheme();

  const [stats,        setStats]        = useState<Stats | null>(null);
  const [students,     setStudents]     = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [alerts,       setAlerts]       = useState<SystemAlert[]>([
    { id:'a1', type:'critical', title:'High-severity case unattended', description:'ANON-48392 has a PHQ-9 of 21 and no follow-up scheduled.', time:'2 min ago' },
    { id:'a2', type:'warning',  title:'Counsellor capacity at 90%',    description:'Mr. Alomaja is at 9/10 active cases this week.',           time:'1 hr ago'  },
    { id:'a3', type:'info',     title:'Monthly report ready',           description:'April 2026 platform report is available to download.',     time:'3 hrs ago' },
  ]);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminStudents(), getAdminAppointments()])
      .then(([statsData, studentsData, appointmentsData]) => {
        if (statsData) setStats(statsData);
        setStudents(studentsData);
        setAppointments(appointmentsData);
        setLoading(false);
      });
  }, []);

  function dismissAlert(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  // ── Stat card definitions ──────────────────────────────────────────────────
  const statCards = [
    {
      label: 'Total Students', value: String(stats?.total_students ?? 0),
      sub: 'Registered on platform', accentClass: 'bg-[#1a5c2a]',
      iconKey: 'users', iconBg: t.greenBg, iconColor: t.greenText,
      trend: 'up' as const, trendLabel: 'Active',
    },
    {
      label: 'Counsellors', value: String(stats?.total_counsellors ?? 0),
      sub: 'Available for sessions', accentClass: 'bg-amber-400',
      iconKey: 'briefcase', iconBg: t.amberBg, iconColor: t.amberText,
      trend: 'neutral' as const, trendLabel: 'Staff',
    },
    {
      label: 'Total Sessions', value: String(stats?.total_appointments ?? 0),
      sub: `${stats?.completed_appointments ?? 0} completed`, accentClass: 'bg-blue-500',
      iconKey: 'headset',
      iconBg:    t.dark ? 'rgba(59,130,246,0.20)' : '#eff6ff',
      iconColor: t.dark ? '#93c5fd' : '#1d4ed8',
      trend: 'up' as const, trendLabel: 'Sessions',
    },
    {
      label: 'Pending Sessions', value: String(stats?.pending_appointments ?? 0),
      sub: 'Awaiting confirmation', accentClass: 'bg-red-500',
      iconKey: 'clock',
      iconBg:    t.dark ? 'rgba(239,68,68,0.20)' : '#fef2f2',
      iconColor: t.dark ? '#fca5a5' : '#b91c1c',
      trend: 'down' as const, trendLabel: 'Pending',
    },
  ];

  // ── Session type badge ─────────────────────────────────────────────────────
  function sessionTypeBg(type: string) {
    if (type === 'Physical') return { bg: t.greenBg, text: t.greenText };
    if (type === 'Video')    return { bg: t.dark ? 'rgba(139,92,246,0.18)':'#f5f3ff', text: t.dark ? '#c4b5fd':'#6d28d9' };
    return                          { bg: t.dark ? 'rgba(59,130,246,0.18)' :'#eff6ff', text: t.dark ? '#93c5fd':'#1d4ed8' };
  }
  function statusBg(status: string) {
    if (status === 'Confirmed') return { bg: t.dark ? 'rgba(34,197,94,0.18)'  :'#f0fdf4', text: t.dark ? '#86efac':'#15803d' };
    if (status === 'Pending')   return { bg: t.dark ? 'rgba(251,191,36,0.18)' :'#fffbeb', text: t.dark ? '#fde68a':'#b45309' };
    if (status === 'Completed') return { bg: t.dark ? 'rgba(59,130,246,0.18)' :'#eff6ff', text: t.dark ? '#93c5fd':'#1d4ed8' };
    return                             { bg: t.dark ? 'rgba(239,68,68,0.18)'  :'#fef2f2', text: t.dark ? '#fca5a5':'#b91c1c' };
  }

  // ── Platform metrics (from real stats) ────────────────────────────────────
  const metrics = [
    { label: 'Total Sessions',  value: String(stats?.total_appointments ?? 0),     sub: 'All time'             },
    { label: 'Completed',       value: String(stats?.completed_appointments ?? 0),  sub: 'Successfully done'    },
    { label: 'Pending',         value: String(stats?.pending_appointments ?? 0),    sub: 'Awaiting action'      },
    { label: 'Confirmed',       value: String(stats?.confirmed_appointments ?? 0),  sub: 'Ready to go'          },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Page heading ── */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            Platform Overview
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
            Real-time summary of the MindBridge counselling platform
          </p>
        </div>
        <button className="h-11 px-5 rounded-xl text-[14px] font-semibold transition font-[lexend]"
          style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.cardBg }}>
          Filter
        </button>
      </div>

      {/* ── Stat cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl p-6 animate-pulse"
              style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
              <div className="h-11 w-11 rounded-xl mb-4" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
              <div className="h-10 w-16 rounded mb-3"   style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
              <div className="h-4 w-28 rounded"          style={{ background: t.dark ? 'rgba(255,255,255,0.07)':'#f3f4f6' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(c => <StatCard key={c.label} {...c} t={t} />)}
        </div>
      )}

      {/* ── Row 2: Recent registrations + System alerts ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">

        {/* Recent registrations */}
        <Card t={t}>
          <CardHeader t={t}>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>
                Recent Registrations
              </h2>
              <span className="text-[12px] font-bold px-3 py-1 rounded-full font-[lexend]"
                style={{ background: t.dark ? 'rgba(59,130,246,0.18)':'#eff6ff', color: t.dark ? '#93c5fd':'#1d4ed8' }}>
                {students.slice(0, 5).length} shown
              </span>
            </div>
            <Link href="/dashboard/admin/students"
              className="text-[14px] font-medium hover:underline font-[lexend]"
              style={{ color: t.greenText }}>
              Manage all users →
            </Link>
          </CardHeader>

          <div className="px-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-4 animate-pulse"
                  style={{ borderBottom: `1px solid ${t.divider}` }}>
                  <div className="w-11 h-11 rounded-full shrink-0" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
                    <div className="h-3 w-52 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.07)':'#f3f4f6' }} />
                  </div>
                </div>
              ))
            ) : students.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[15px] font-[lexend]" style={{ color: t.textMuted }}>No students registered yet.</p>
              </div>
            ) : students.slice(0, 5).map(student => {
              const initials = student.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={student.id}
                  className="flex items-center gap-4 py-4 cursor-pointer -mx-6 px-6 transition-colors"
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                    style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold truncate font-[lexend]" style={{ color: t.textPrimary }}>
                      {student.full_name}
                    </p>
                    <p className="text-[13px] truncate mt-0.5 font-[lexend]" style={{ color: t.textMuted }}>
                      {student.department ?? 'No department'} · Joined {student.date_joined}
                    </p>
                  </div>
                  <span className="text-[12px] font-semibold px-3 py-1 rounded-full font-[lexend] shrink-0"
                    style={{ background: t.dark ? 'rgba(59,130,246,0.18)':'#eff6ff', color: t.dark ? '#93c5fd':'#1d4ed8' }}>
                    Student
                  </span>
                  <span className="text-[12px] font-semibold px-3 py-1 rounded-full font-[lexend] shrink-0"
                    style={student.is_active
                      ? { background: t.dark ? 'rgba(34,197,94,0.18)':'#f0fdf4', color: t.dark ? '#86efac':'#15803d' }
                      : { background: t.dark ? 'rgba(255,255,255,0.08)':'#f3f4f6', color: t.textMuted }
                    }>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* System alerts */}
        <Card t={t}>
          <CardHeader t={t}>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>
                System Alerts
              </h2>
              {criticalCount > 0 && (
                <span className="text-[12px] font-bold px-3 py-1 rounded-full font-[lexend]"
                  style={{ background: t.dark ? 'rgba(239,68,68,0.18)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c' }}>
                  {criticalCount} critical
                </span>
              )}
            </div>
            <Link href="/dashboard/admin/logs"
              className="text-[14px] font-medium hover:underline font-[lexend]"
              style={{ color: t.greenText }}>
              View logs →
            </Link>
          </CardHeader>
          <div className="px-6">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: t.dark ? 'rgba(34,197,94,0.18)':'#f0fdf4' }}>
                  <svg className="w-5 h-5" style={{ color: t.dark ? '#86efac':'#15803d' }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                  No active alerts
                </p>
                <p className="text-[13px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                  All systems running normally
                </p>
              </div>
            ) : alerts.map(alert => (
              <AlertRow key={alert.id} alert={alert} onDismiss={dismissAlert} t={t} />
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 3: Recent sessions + Platform metrics ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-5">

        {/* Recent sessions */}
        <Card t={t}>
          <CardHeader t={t}>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>
                Recent Counselling Sessions
              </h2>
              <span className="text-[12px] font-bold px-3 py-1 rounded-full font-[lexend]"
                style={{ background: t.greenBg, color: t.greenText }}>
                Live
              </span>
            </div>
            <Link href="/dashboard/admin/appointments"
              className="text-[14px] font-medium hover:underline font-[lexend]"
              style={{ color: t.greenText }}>
              View all →
            </Link>
          </CardHeader>
          <div className="px-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-4 animate-pulse"
                  style={{ borderBottom: `1px solid ${t.divider}` }}>
                  <div className="w-11 h-11 rounded-full shrink-0" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
                    <div className="h-3 w-52 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.07)':'#f3f4f6' }} />
                  </div>
                </div>
              ))
            ) : appointments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[15px] font-[lexend]" style={{ color: t.textMuted }}>No appointments yet.</p>
              </div>
            ) : appointments.slice(0, 5).map(appt => {
              const initials = appt.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              const st = sessionTypeBg(appt.session_type);
              const ss = statusBg(appt.status);
              return (
                <div key={appt.id}
                  className="flex items-center gap-4 py-4 cursor-pointer -mx-6 px-6 transition-colors"
                  style={{ borderBottom: `1px solid ${t.divider}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = t.cardHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                    style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold truncate font-[lexend]" style={{ color: t.textPrimary }}>
                      {appt.student_name}
                    </p>
                    <p className="text-[13px] truncate mt-0.5 font-[lexend]" style={{ color: t.textMuted }}>
                      {appt.counsellor_name} · {formatDate(appt.date)} · {formatTime(appt.time)}
                    </p>
                  </div>
                  <span className="text-[12px] font-medium px-3 py-1 rounded-md font-[lexend] shrink-0"
                    style={{ background: st.bg, color: st.text }}>{appt.session_type}</span>
                  <span className="text-[12px] font-semibold px-3 py-1 rounded-full font-[lexend] shrink-0"
                    style={{ background: ss.bg, color: ss.text }}>{appt.status}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Platform metrics */}
        <Card t={t}>
          <CardHeader t={t}>
            <h2 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>
              Platform Metrics
            </h2>
            <Link href="/dashboard/admin/reports"
              className="text-[14px] font-medium hover:underline font-[lexend]"
              style={{ color: t.greenText }}>
              Full report →
            </Link>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4 px-6 py-5">
            {metrics.map(m => (
              <div key={m.label} className="rounded-xl p-4"
                style={{ background: t.innerCard, border: `1px solid ${t.innerBorder}` }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-2 font-[lexend]"
                  style={{ color: t.textMuted }}>{m.label}</p>
                <p className="text-[28px] font-bold leading-none tracking-tight font-[syne]"
                  style={{ color: t.textPrimary }}>{m.value}</p>
                <p className="text-[13px] mt-2 font-[lexend]" style={{ color: t.textMuted }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 4: Admin insight banner ── */}
      <div className="rounded-2xl px-7 py-6"
        style={{ background: 'linear-gradient(120deg, #1a5c2a 0%, #008751 60%, #005c38 100%)' }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[12px] font-bold text-amber-400 uppercase tracking-[0.10em] mb-2">
              Admin Insight
            </p>
            <h3 className="text-[20px] font-bold text-white font-[syne]">
              Platform is live — monitor student activity closely
            </h3>
          </div>
          <Link href="/dashboard/admin/reports"
            className="text-[14px] font-semibold text-amber-400 hover:underline shrink-0 mt-1 font-[lexend]">
            View report →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Students',    value: String(stats?.total_students    ?? 0), sub: 'Registered users'       },
            { label: 'Total Counsellors', value: String(stats?.total_counsellors ?? 0), sub: 'Available for sessions'  },
            { label: 'Total Sessions',    value: String(stats?.total_appointments ?? 0), sub: 'Booked so far'          },
          ].map(m => (
            <div key={m.label} className="rounded-xl px-5 py-4"
              style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <p className="text-[11px] uppercase tracking-[0.08em] mb-1.5"
                style={{ color: 'rgba(255,255,255,0.50)' }}>{m.label}</p>
              <p className="text-[28px] font-bold text-amber-400 leading-none tracking-tight font-[syne]">
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
