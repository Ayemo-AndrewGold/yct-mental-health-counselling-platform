'use client';

import { useState, useEffect } from 'react';
import { getAdminStats, getAdminStudents, getAdminAppointments } from '@/lib/api';
import Link from 'next/link';
import {
  STAT_CARDS, RECENT_USERS, RECENT_SESSIONS,
  SYSTEM_ALERTS, DEPT_INSIGHTS,
  type Severity, type SessionType, type UserStatus, type UserRole, type Trend,
  type RecentUser, type RecentSession, type SystemAlert, type DeptInsight,
  type StatCardData,
} from '../app/dashboard/admin/types';


//Interface 
interface Stats {
  total_students: number;
  total_counsellors: number;
  total_appointments: number;
  pending_appointments: number;
  confirmed_appointments: number;
  completed_appointments: number;
}

interface Student {
  id: number;
  full_name: string;
  email: string;
  matric_number: string;
  department: string;
  level: string;
  date_joined: string;
  is_active: boolean;
}

interface AdminAppointment {
  id: number;
  student_name: string;
  counsellor_name: string;
  session_type: string;
  date: string;
  time: string;
  status: string;
  duration: number;
}
// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function ChevronRight() {
  return (
    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function Panel({
  title, badge, badgeCls, action, actionHref, children, className = '',
}: {
  title: string; badge?: string; badgeCls?: string;
  action?: string; actionHref?: string;
  children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-semibold text-gray-900">{title}</h2>
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${badgeCls}`}>{badge}</span>
          )}
        </div>
        {action && actionHref && (
          <Link href={actionHref} className="flex items-center gap-1 text-[11.5px] text-[#1a5c2a] font-medium hover:underline">
            {action} <ChevronRight />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD ICONS
// ─────────────────────────────────────────────────────────────────────────────
const STAT_ICONS: Record<string, (color: string) => React.ReactNode> = {
  users: (c) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  briefcase: (c) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  headset: (c) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  clock: (c) => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.75">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({ card }: { card: StatCardData }) {
  const trendStyles: Record<Trend, string> = {
    up:      'bg-green-50 text-green-700',
    down:    'bg-red-50 text-red-600',
    neutral: 'bg-gray-100 text-gray-500',
  };
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${card.accentClass}`} />
      <div className="flex items-start justify-between mb-[14px]">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
          {STAT_ICONS[card.iconKey]?.(card.iconColor)}
        </div>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-[3px] rounded-full ${trendStyles[card.trend]}`}>
          {card.trendLabel}
        </span>
      </div>
      <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">{card.value}</p>
      <p className="text-[11.5px] text-gray-500 mt-1">{card.label}</p>
      <div className="h-px bg-gray-50 my-[14px]" />
      <p className="text-[10.5px] text-gray-400">{card.sub}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SEVERITY BADGE
// ─────────────────────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { cls: string; dot: string }> = {
    High:   { cls: 'bg-red-50 text-red-700',    dot: 'bg-red-600'   },
    Medium: { cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
    Low:    { cls: 'bg-green-50 text-green-700', dot: 'bg-green-600' },
  };
  const { cls, dot } = map[severity];
  return (
    <span className={`inline-flex items-center gap-[5px] text-[10px] font-semibold px-2 py-[3px] rounded-md ${cls}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${dot}`} />
      {severity}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, string> = {
    Active:    'bg-green-50 text-green-700',
    Inactive:  'bg-gray-100 text-gray-500',
    Suspended: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROLE BADGE
// ─────────────────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, string> = {
    Student:    'bg-blue-50 text-blue-700',
    Counsellor: 'bg-[#fdf3dc] text-[#b45309]',
    Admin:      'bg-purple-50 text-purple-700',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[role]}`}>
      {role}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION TYPE BADGE
// ─────────────────────────────────────────────────────────────────────────────
function SessionTypeBadge({ type }: { type: SessionType }) {
  const map: Record<SessionType, string> = {
    Chat:     'bg-blue-50 text-blue-700',
    Physical: 'bg-green-50 text-green-700',
    Video:    'bg-[#fdf3dc] text-[#b45309]',
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-[1.5px] rounded-[5px] ${map[type]}`}>
      {type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM ALERT ROW
// ─────────────────────────────────────────────────────────────────────────────
function AlertRow({ alert }: { alert: SystemAlert }) {
  const map = {
    critical: { bar: 'bg-red-500',   icon: 'bg-red-50',    dot: 'bg-red-500',   text: 'text-red-700'   },
    warning:  { bar: 'bg-amber-400', icon: 'bg-amber-50',  dot: 'bg-amber-400', text: 'text-amber-700' },
    info:     { bar: 'bg-blue-400',  icon: 'bg-blue-50',   dot: 'bg-blue-400',  text: 'text-blue-700'  },
  };
  const s = map[alert.type];
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`relative w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${s.icon}`}>
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        {alert.type === 'critical' && (
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-ping opacity-75" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[11.5px] font-semibold ${s.text}`}>{alert.title}</p>
        <p className="text-[10.5px] text-gray-500 mt-0.5 leading-snug">{alert.description}</p>
        <p className="text-[10px] text-gray-400 mt-1">{alert.time}</p>
      </div>
      <button className="text-[10px] text-gray-400 hover:text-gray-600 font-medium flex-shrink-0 mt-0.5 transition-colors">
        Dismiss
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPT INSIGHT BAR
// ─────────────────────────────────────────────────────────────────────────────
function DeptBar({ dept }: { dept: DeptInsight }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <p className="text-[11px] text-gray-700 font-medium w-40 shrink-0 truncate">{dept.dept}</p>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full ${dept.color}`} style={{ width: `${dept.pct}%` }} />
      </div>
      <p className="text-[11px] font-semibold text-gray-900 w-6 text-right shrink-0">{dept.cases}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT USERS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function RecentUsersTable({ users }: { users: RecentUser[] }) {
  return (
    <div className="px-5 divide-y divide-gray-50">
      {users.map((user) => (
        <div key={user.id} className="flex items-center gap-3 py-3 group">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-[1.5px] ${user.avatarStyle}`}>
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-[10.5px] text-gray-400 mt-px">
              {user.department}{user.level !== '—' ? ` · ${user.level}` : ''} · Joined {user.joinedDate}
            </p>
          </div>
          <RoleBadge role={user.role} />
          <StatusBadge status={user.status} />
          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#1a5c2a] font-medium hover:underline ml-1">
            View →
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT SESSIONS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function RecentSessionsTable({ sessions }: { sessions: RecentSession[] }) {
  return (
    <div className="px-5 divide-y divide-gray-50">
      {sessions.map((session) => (
        <div key={session.id} className="flex items-center gap-3 py-3 group">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${session.avatarStyle}`}>
            {session.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-gray-900 truncate">{session.studentName}</p>
            <p className="text-[10.5px] text-gray-400 mt-px">
              {session.counsellor} · {session.duration} · {session.date}
            </p>
          </div>
          <SessionTypeBadge type={session.sessionType} />
          <SeverityBadge severity={session.severity} />
          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#1a5c2a] font-medium hover:underline ml-1">
            View →
          </button>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM METRICS
// ─────────────────────────────────────────────────────────────────────────────
function PlatformMetrics() {
  const metrics = [
    { label: 'Avg. Session Duration', value: '42 min',  sub: '↑ 4 min from last month' },
    { label: 'Counsellor Utilisation', value: '78%',    sub: '6 of 8 counsellors active' },
    { label: 'Avg. Response Time',    value: '18 min',  sub: '↓ 6 min improvement'       },
    { label: 'Student Retention',     value: '91%',     sub: 'Return within 30 days'      },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 px-5 py-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
          <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1">{m.label}</p>
          <p className="text-[18px] font-bold text-gray-900 tracking-tight leading-none">{m.value}</p>
          <p className="text-[10px] text-gray-500 mt-1.5">{m.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS);
  const [stats, setStats] = useState<Stats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    Promise.all([
      getAdminStats(),
      getAdminStudents(),
      getAdminAppointments(),
    ]).then(([statsData, studentsData, appointmentsData]) => {
      if (statsData) setStats(statsData);
      setStudents(studentsData);
      setAppointments(appointmentsData);
      setLoading(false);
    });
  }, []);


    const criticalCount = alerts.filter((a) => a.type === 'critical').length;

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




  return (
    <main className="px-6 py-5 space-y-5 pb-10">

      {/* PAGE TITLE */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">
            Platform Overview
          </h2>
          <p className="text-[12px] text-gray-500 mt-1">
            Real-time summary of the MindBridge student mental health platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[11px] text-gray-500 font-medium transition-colors">
            <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
              <line x1="4" y1="18" x2="16" y2="18"/>
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
{loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            {
              label: 'Total Students',
              value: String(stats?.total_students ?? 0),
              sub: 'Registered on platform',
              accent: 'bg-[#1a5c2a]',
              iconBg: 'bg-[#e8f5ec]',
              iconColor: '#1a5c2a',
              iconKey: 'users',
              trend: 'up' as const,
              trendLabel: 'Active',
            },
            {
              label: 'Counsellors',
              value: String(stats?.total_counsellors ?? 0),
              sub: 'Available counsellors',
              accent: 'bg-[#f5a623]',
              iconBg: 'bg-[#fdf3dc]',
              iconColor: '#d97706',
              iconKey: 'briefcase',
              trend: 'neutral' as const,
              trendLabel: 'Staff',
            },
            {
              label: 'Total Sessions',
              value: String(stats?.total_appointments ?? 0),
              sub: `${stats?.completed_appointments ?? 0} completed`,
              accent: 'bg-blue-500',
              iconBg: 'bg-blue-50',
              iconColor: '#2563eb',
              iconKey: 'headset',
              trend: 'up' as const,
              trendLabel: 'Sessions',
            },
            {
              label: 'Pending Sessions',
              value: String(stats?.pending_appointments ?? 0),
              sub: 'Awaiting confirmation',
              accent: 'bg-red-500',
              iconBg: 'bg-red-50',
              iconColor: '#ef4444',
              iconKey: 'clock',
              trend: 'down' as const,
              trendLabel: 'Pending',
            },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${card.accent}`} />
            <div className="flex items-start justify-between mb-[14px]">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                {STAT_ICONS[card.iconKey]?.(card.iconColor)}
              </div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-[3px] rounded-full
                ${card.trend === 'up' ? 'bg-green-50 text-green-700' :
                  card.trend === 'down' ? 'bg-red-50 text-red-600' :
                  'bg-gray-100 text-gray-500'}`}>
                {card.trendLabel}
              </span>
            </div>
            <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">{card.value}</p>
            <p className="text-[11.5px] text-gray-500 mt-1">{card.label}</p>
            <div className="h-px bg-gray-50 my-[14px]" />
            <p className="text-[10.5px] text-gray-400">{card.sub}</p>
          </div>
          ))}
        </div>
      )}

      {/* ROW 2 — RECENT USERS + SYSTEM ALERTS */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">

        <Panel
          title="Recent Registrations"
          badge={`${students.slice(0, 5).length} shown`}
          badgeCls="bg-blue-50 text-blue-700"
          action="Manage all users"
          actionHref="/dashboard/admin/students"
        >
          {loading ? (
            <div className="px-5 py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2.5 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[12px] text-gray-400">No students registered yet.</p>
            </div>
          ) : (
            <div className="px-5 divide-y divide-gray-50">
              {students.slice(0, 5).map((student) => {
                const initials = student.full_name
                  .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <div key={student.id} className="flex items-center gap-3 py-3 group">
                    <div className="w-8 h-8 rounded-full bg-[#e8f5ec] text-[#1a5c2a] border border-[#b6dfc0] flex items-center justify-center text-[10px] font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-900 truncate">
                        {student.full_name}
                      </p>
                      <p className="text-[10.5px] text-gray-400 mt-px">
                        {student.department ?? 'No department'} · Joined {student.date_joined}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full bg-blue-50 text-blue-700">
                      Student
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full
                      ${student.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {student.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel
          title="System Alerts"
          badge={criticalCount > 0 ? `${criticalCount} critical` : undefined}
          badgeCls="bg-red-50 text-red-600"
          action="View logs"
          actionHref="/dashboard/admin/logs"
        >
          <div className="px-5">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center mb-2.5">
                  <svg className="w-4 h-4 stroke-green-500" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="text-[12px] font-medium text-gray-500">No active alerts</p>
                <p className="text-[11px] text-gray-400 mt-0.5">All systems running normally</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                />
              ))
            )}
          </div>
        </Panel>
      </div>

      {/* ROW 3 — RECENT SESSIONS + DEPT INSIGHTS + PLATFORM METRICS */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">

        <Panel
          title="Recent Counselling Sessions"
          badge="4 today"
          badgeCls="bg-[#e8f5ec] text-[#1a5c2a]"
          action="View all sessions"
          actionHref="/dashboard/admin/appointments"
        >
          {loading ? (
            <div className="px-5 py-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 bg-gray-200 rounded" />
                    <div className="h-2.5 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-[12px] text-gray-400">No appointments yet.</p>
            </div>
          ) : (
            <div className="px-5 divide-y divide-gray-50">
              {appointments.slice(0, 5).map((appt) => {
                const initials = appt.student_name
                  .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                const statusMap: Record<string, string> = {
                  Pending:   'bg-amber-50 text-amber-700',
                  Confirmed: 'bg-green-50 text-green-700',
                  Completed: 'bg-blue-50 text-blue-700',
                  Cancelled: 'bg-red-50 text-red-600',
                };
                return (
                  <div key={appt.id} className="flex items-center gap-3 py-3 group">
                    <div className="w-8 h-8 rounded-full bg-[#e8f5ec] text-[#1a5c2a] border border-[#b6dfc0] flex items-center justify-center text-[10px] font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-gray-900 truncate">
                        {appt.student_name}
                      </p>
                      <p className="text-[10.5px] text-gray-400 mt-px">
                        {appt.counsellor_name} · {formatDate(appt.date)} · {formatTime(appt.time)}
                      </p>
                    </div>
                    <span className={`text-[10px] font-medium px-1.5 py-[1.5px] rounded-[5px]
                      ${appt.session_type === 'Physical' ? 'bg-green-50 text-green-700' :
                        appt.session_type === 'Video' ? 'bg-purple-50 text-purple-700' :
                        'bg-blue-50 text-blue-700'}`}>
                      {appt.session_type}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${statusMap[appt.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {appt.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

<div className="flex flex-col gap-4">
          <Panel title="Platform Metrics" action="Full report" actionHref="/dashboard/admin/reports">
            <div className="grid grid-cols-2 gap-3 px-5 py-4">
              {[
                { label: 'Total Sessions',    value: String(stats?.total_appointments ?? 0),  sub: 'All time'            },
                { label: 'Completed',          value: String(stats?.completed_appointments ?? 0), sub: 'Successfully done' },
                { label: 'Pending',            value: String(stats?.pending_appointments ?? 0),   sub: 'Awaiting action'   },
                { label: 'Confirmed',          value: String(stats?.confirmed_appointments ?? 0), sub: 'Ready to go'       },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="text-[9.5px] font-semibold text-gray-400 uppercase tracking-[0.06em] mb-1">
                    {m.label}
                  </p>
                  <p className="text-[18px] font-bold text-gray-900 tracking-tight leading-none">
                    {m.value}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1.5">{m.sub}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ROW 4 — HEALTH HIGHLIGHTS */}
      <div className="bg-[#1a5c2a] rounded-2xl px-6 py-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-[#f5a623] uppercase tracking-[0.08em] mb-1">Admin Insight</p>
            <h3 className="text-[15px] font-semibold text-white leading-snug">
              Platform is live — monitor student activity closely
            </h3>
          </div>
          <Link
            href="/dashboard/admin/reports"
            className="flex items-center gap-1 text-[11px] text-[#f5a623] font-semibold hover:underline flex-shrink-0 mt-1"
          >
            View report <ChevronRight />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Students',    value: String(stats?.total_students ?? 0),    sub: 'Registered users'      },
            { label: 'Total Counsellors', value: String(stats?.total_counsellors ?? 0), sub: 'Available for sessions' },
            { label: 'Total Sessions',    value: String(stats?.total_appointments ?? 0), sub: 'Booked so far'         },
          ].map((m) => (
            <div key={m.label} className="bg-white/[0.08] border border-white/[0.12] rounded-xl px-4 py-3">
              <p className="text-[9.5px] text-white/45 uppercase tracking-[0.06em] mb-1">{m.label}</p>
              <p className="text-[18px] font-bold text-[#f5a623] leading-none tracking-tight">{m.value}</p>
              <p className="text-[10.5px] text-white/55 mt-1.5">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}