'use client';

import { useState, useEffect } from 'react';
import { getCounsellorAppointments, updateAppointmentStatus } from '@/lib/api';

type SessionType       = 'Physical' | 'Video' | 'Chat';
type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

interface Appointment {
  id: number;
  student_name: string;
  session_type: SessionType;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  note?: string;
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
    pageBg:        'transparent',
    cardBg:        dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    cardBorder:    dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
    rowHover:      dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    divider:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    theadBg:       dark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    inputText:     dark ? '#ffffff'                : '#111827',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    expandedBg:    dark ? 'rgba(0,135,81,0.10)'    : '#f0fdf4',
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
}

function TypeBadge({ type, t }: { type: SessionType; t: ReturnType<typeof useTheme> }) {
  const map: Record<SessionType, { bg: string; text: string }> = {
    Physical: { bg: t.greenBg,                               text: t.greenText                          },
    Video:    { bg: t.dark ? 'rgba(139,92,246,0.18)':'#f5f3ff', text: t.dark ? '#c4b5fd':'#6d28d9' },
    Chat:     { bg: t.dark ? 'rgba(59,130,246,0.18)' :'#eff6ff', text: t.dark ? '#93c5fd':'#1d4ed8' },
  };
  const c = map[type];
  return (
    <span className="text-[13px] font-medium px-3 py-1 rounded-md font-[lexend]"
      style={{ background: c.bg, color: c.text }}>{type}</span>
  );
}

function StatusBadge({ status, t }: { status: AppointmentStatus; t: ReturnType<typeof useTheme> }) {
  const map: Record<AppointmentStatus, { bg: string; text: string }> = {
    Confirmed: { bg: t.dark ? 'rgba(34,197,94,0.18)'  :'#f0fdf4', text: t.dark ? '#86efac':'#15803d' },
    Pending:   { bg: t.dark ? 'rgba(251,191,36,0.18)' :'#fffbeb', text: t.dark ? '#fde68a':'#b45309' },
    Completed: { bg: t.dark ? 'rgba(59,130,246,0.18)' :'#eff6ff', text: t.dark ? '#93c5fd':'#1d4ed8' },
    Cancelled: { bg: t.dark ? 'rgba(239,68,68,0.18)'  :'#fef2f2', text: t.dark ? '#fca5a5':'#b91c1c' },
  };
  const c = map[status];
  return (
    <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
      style={{ background: c.bg, color: c.text }}>{status}</span>
  );
}

function AppointmentRow({ appt, onStatusChange, t }: {
  appt: Appointment;
  onStatusChange: (id: number, status: string) => void;
  t: ReturnType<typeof useTheme>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatus(newStatus: string) {
    setUpdating(true);
    await onStatusChange(appt.id, newStatus);
    setUpdating(false);
  }

  const initials = appt.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const btnBase = 'h-8 px-4 rounded-lg text-[13px] font-semibold font-[lexend] transition-colors disabled:opacity-50';

  return (
    <>
      <tr className="transition-colors group"
        style={{ borderBottom: `1px solid ${t.divider}` }}
        onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Time */}
        <td className="px-5 py-4">
          <div className="rounded-xl px-3 py-2 text-center inline-block min-w-[72px]"
            style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
            <p className="text-[14px] font-bold font-mono" style={{ color: t.greenText }}>
              {formatTime(appt.time)}
            </p>
          </div>
        </td>

        {/* Student */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
              style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
              {initials}
            </div>
            <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
              {appt.student_name}
            </p>
          </div>
        </td>

        {/* Type */}
        <td className="px-5 py-4"><TypeBadge type={appt.session_type} t={t} /></td>

        {/* Duration */}
        <td className="px-5 py-4">
          <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>
            {appt.duration} min
          </span>
        </td>

        {/* Date */}
        <td className="px-5 py-4">
          <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>
            {formatDate(appt.date)}
          </span>
        </td>

        {/* Status */}
        <td className="px-5 py-4"><StatusBadge status={appt.status} t={t} /></td>

        {/* Actions */}
        <td className="px-5 py-4">
          <div className="flex gap-2 flex-wrap">
            {appt.note && (
              <button onClick={() => setExpanded(!expanded)}
                className={btnBase}
                style={{ background: t.dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', color: t.textSecondary }}>
                {expanded ? 'Hide' : 'Note'}
              </button>
            )}
            {appt.status === 'Pending' && (
              <button onClick={() => handleStatus('Confirmed')} disabled={updating}
                className={btnBase}
                style={{ background: t.dark ? 'rgba(34,197,94,0.18)':'#f0fdf4', color: t.dark ? '#86efac':'#15803d' }}>
                Accept
              </button>
            )}
            {appt.status === 'Confirmed' && (
              <>
                <button onClick={() => handleStatus('Completed')} disabled={updating}
                  className={btnBase}
                  style={{ background: t.greenBg, color: t.greenText }}>
                  Complete
                </button>
                <button onClick={() => handleStatus('Cancelled')} disabled={updating}
                  className={btnBase}
                  style={{ background: t.dark ? 'rgba(239,68,68,0.18)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c' }}>
                  Cancel
                </button>
              </>
            )}
            {appt.status === 'Completed' && (
              <span className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>Done ✓</span>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded note */}
      {expanded && appt.note && (
        <tr style={{ background: t.expandedBg, borderBottom: `1px solid ${t.divider}` }}>
          <td colSpan={7} className="px-5 py-4">
            <p className="text-[13px] font-semibold mb-1 font-[lexend]" style={{ color: t.greenText }}>
              Student Note:
            </p>
            <p className="text-[14px] leading-relaxed font-[lexend]" style={{ color: t.textSecondary }}>
              {appt.note}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CounsellorAppointmentsPage() {
  const t = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [typeFilter, setType]           = useState('All Types');
  const [statusFilter, setStatus]       = useState('All Status');

  useEffect(() => {
    getCounsellorAppointments().then((data) => { setAppointments(data); setLoading(false); });
  }, []);

  async function handleStatusChange(id: number, newStatus: string) {
    const res = await updateAppointmentStatus(id, newStatus);
    if (res.ok) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as AppointmentStatus } : a));
    }
  }

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.student_name.toLowerCase().includes(q))
      && (typeFilter   === 'All Types'  || a.session_type === typeFilter)
      && (statusFilter === 'All Status' || a.status === statusFilter);
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const counts = {
    today:     appointments.filter(a => a.date === todayStr).length,
    pending:   appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
  };

  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Header ── */}
      <div>
        <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
          My Appointments
        </h2>
        <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
          {counts.today} today · {appointments.length} total
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Today',     value: String(counts.today),     accent: 'bg-[#008751]' },
          { label: 'Pending',   value: String(counts.pending),   accent: 'bg-amber-400' },
          { label: 'Confirmed', value: String(counts.confirmed), accent: 'bg-blue-500'  },
          { label: 'Completed', value: String(counts.completed), accent: 'bg-green-500' },
        ].map(s => (
          <div key={s.label} className="relative rounded-2xl p-6 overflow-hidden"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <div className={`absolute top-0 left-0 right-0 h-[4px] rounded-t-2xl ${s.accent}`} />
            <p className="text-[42px] font-bold leading-none font-[syne]" style={{ color: t.textPrimary }}>{s.value}</p>
            <p className="text-[15px] font-semibold mt-2" style={{ color: t.textSecondary }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.textMuted }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by student name..."
            className={`${inputCls} w-full pl-10 border`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={typeFilter} onChange={e => setType(e.target.value)}
          className={`${inputCls} px-4 border`}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Types','Physical','Video','Chat'].map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
          className={`${inputCls} px-4 border`}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Status','Confirmed','Pending','Completed','Cancelled'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                {['Time','Student','Type','Duration','Date','Status','Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider font-[lexend]"
                    style={{ color: t.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                    <td colSpan={7} className="px-5 py-4">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-gray-300/30" />
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
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                      No appointments found
                    </p>
                    <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                      Try adjusting your filters
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(a => (
                  <AppointmentRow key={a.id} appt={a} onStatusChange={handleStatusChange} t={t} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
