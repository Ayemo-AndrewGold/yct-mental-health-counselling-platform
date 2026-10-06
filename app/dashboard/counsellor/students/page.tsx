'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCounsellorStudents, getAppointments } from '@/lib/api';

interface Student {
  id: number; full_name: string; email: string;
  matric_number: string; department: string; level: string; is_active: boolean;
}
interface Appointment {
  id: number; student: number; student_name: string;
  session_type: string; date: string; time: string; status: string;
}

// ─── Dark-mode hook ───────────────────────────────────────────────────────────
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
    rowHover:      dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    divider:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    theadBg:       dark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    expandBg:      dark ? 'rgba(0,135,81,0.10)'    : '#f0fdf4',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    inputText:     dark ? '#ffffff'                : '#111827',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7)  return `${diff} days ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

function StudentRow({ student, appointments, t }: {
  student: Student; appointments: Appointment[]; t: ReturnType<typeof useTheme>;
}) {
  const [expanded, setExpanded] = useState(false);

  const studentAppts = appointments.filter(a => a.student === student.id);
  const completedSessions = studentAppts.filter(a => a.status === 'Completed').length;
  const lastAppt = studentAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const nextAppt = studentAppts
    .filter(a => (a.status === 'Confirmed' || a.status === 'Pending') && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const initials = student.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <tr className="transition-colors group"
        style={{ borderBottom: `1px solid ${t.divider}` }}
        onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Student */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
              style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
              {initials}
            </div>
            <div>
              <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                {student.full_name}
              </p>
              <p className="text-[12px] font-mono mt-0.5" style={{ color: t.textMuted }}>
                {student.matric_number ?? '—'}
              </p>
            </div>
          </div>
        </td>

        {/* Department */}
        <td className="px-5 py-4">
          <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>
            {student.department ?? '—'}
          </span>
        </td>

        {/* Level */}
        <td className="px-5 py-4">
          {student.level ? (
            <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
              style={{ background: t.dark ? 'rgba(59,130,246,0.18)':'#eff6ff', color: t.dark ? '#93c5fd':'#1d4ed8' }}>
              {student.level}
            </span>
          ) : <span style={{ color: t.textMuted }}>—</span>}
        </td>

        {/* Sessions */}
        <td className="px-5 py-4">
          <span className="text-[16px] font-bold font-[syne]" style={{ color: t.textPrimary }}>
            {completedSessions}
          </span>
        </td>

        {/* Last seen */}
        <td className="px-5 py-4">
          <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>
            {lastAppt ? formatDate(lastAppt.date) : 'Never'}
          </span>
        </td>

        {/* Next session */}
        <td className="px-5 py-4">
          <span className="text-[14px] font-medium font-[lexend]" style={{ color: t.greenText }}>
            {nextAppt ? `${formatDate(nextAppt.date)} ${formatTime(nextAppt.time)}` : '—'}
          </span>
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
            style={student.is_active
              ? { background: t.dark ? 'rgba(34,197,94,0.18)':'#f0fdf4', color: t.dark ? '#86efac':'#15803d' }
              : { background: t.dark ? 'rgba(255,255,255,0.08)':'#f3f4f6', color: t.textMuted }
            }>
            {student.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setExpanded(!expanded)}
              className="h-8 px-4 rounded-lg text-[13px] font-semibold font-[lexend] transition-colors"
              style={{ background: t.dark ? 'rgba(255,255,255,0.08)':'#f3f4f6', color: t.textSecondary }}>
              {expanded ? 'Hide' : 'View'}
            </button>
            <Link href="/dashboard/counsellor/messages"
              className="h-8 px-4 rounded-lg text-[13px] font-semibold font-[lexend] transition-colors flex items-center"
              style={{ background: t.greenBg, color: t.greenText }}>
              Message
            </Link>
          </div>
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr style={{ background: t.expandBg, borderBottom: `1px solid ${t.divider}` }}>
          <td colSpan={8} className="px-5 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { label: 'Full Name',     value: student.full_name                    },
                { label: 'Email',         value: student.email                        },
                { label: 'Matric No.',    value: student.matric_number ?? '—'         },
                { label: 'Department',    value: student.department ?? '—'            },
                { label: 'Level',         value: student.level ?? '—'                 },
                { label: 'Sessions Done', value: String(completedSessions)            },
                { label: 'Last Seen',     value: lastAppt ? formatDate(lastAppt.date) : 'Never' },
                { label: 'Next Session',  value: nextAppt ? `${formatDate(nextAppt.date)} ${formatTime(nextAppt.time)}` : 'Not scheduled' },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-[11px] font-bold uppercase tracking-wider font-[lexend]"
                    style={{ color: t.textMuted }}>{item.label}</p>
                  <p className="text-[14px] font-semibold mt-1 font-[lexend]"
                    style={{ color: t.textPrimary }}>{item.value}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CounsellorStudentsPage() {
  const t = useTheme();
  const [students,     setStudents]     = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [status,       setStatus]       = useState('All Status');

  useEffect(() => {
    Promise.all([getCounsellorStudents(), getAppointments()]).then(([sd, ad]) => {
      setStudents(sd); setAppointments(ad); setLoading(false);
    });
  }, []);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.full_name.toLowerCase().includes(q) || (s.matric_number ?? '').toLowerCase().includes(q))
      && (status === 'All Status' || (status === 'Active' ? s.is_active : !s.is_active));
  });

  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* Header */}
      <div>
        <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
          My Students
        </h2>
        <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
          {students.length} assigned students
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: String(students.length),                           accent: 'bg-[#008751]' },
          { label: 'Active',   value: String(students.filter(s => s.is_active).length),  accent: 'bg-green-500' },
          { label: 'Inactive', value: String(students.filter(s => !s.is_active).length), accent: 'bg-gray-400'  },
          { label: 'Showing',  value: String(filtered.length),                           accent: 'bg-amber-400' },
        ].map(s => (
          <div key={s.label} className="relative rounded-2xl p-6 overflow-hidden"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <div className={`absolute top-0 left-0 right-0 h-[4px] rounded-t-2xl ${s.accent}`} />
            <p className="text-[42px] font-bold leading-none font-[syne]" style={{ color: t.textPrimary }}>{s.value}</p>
            <p className="text-[15px] font-semibold mt-2" style={{ color: t.textSecondary }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.textMuted }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or matric number..."
            className={`${inputCls} w-full pl-10`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Status','Active','Inactive'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                {['Student','Department','Level','Sessions','Last Seen','Next Session','Status',''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider font-[lexend]"
                    style={{ color: t.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                    <td colSpan={8} className="px-5 py-4">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-11 h-11 rounded-full bg-gray-300/30" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-36 bg-gray-300/30 rounded" />
                          <div className="h-3 w-52 bg-gray-200/20 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                      No students found
                    </p>
                    <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                      Students appear here once they book a session with you
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(s => (
                  <StudentRow key={s.id} student={s} appointments={appointments} t={t} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
