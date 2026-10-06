'use client';

import { useState, useEffect } from 'react';
import { getAdminAppointments } from '@/lib/api';

type SessionType       = 'Physical' | 'Video' | 'Chat';
type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';

interface Appointment {
  id: number;
  student_name: string;
  counsellor_name: string;
  session_type: SessionType;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  note?: string;
}

const TODAY         = new Date().getDate();
const CURRENT_MONTH = new Date().getMonth();
const CURRENT_YEAR  = new Date().getFullYear();

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(month: number, year: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}
function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${display}:${m} ${ampm}`;
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
    divider:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    theadBg:       dark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    rowHover:      dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    inputText:     dark ? '#ffffff'                : '#111827',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    calTodayBg:    '#1a5c2a',
    calSelectedBg: dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
  };
}

function SessionBadge({ type, dark }: { type: SessionType; dark: boolean }) {
  const map: Record<SessionType, { bg: string; text: string }> = {
    Physical: { bg: dark ? 'rgba(0,135,81,0.18)'  : '#e8f5ec', text: dark ? '#86efac' : '#1a5c2a' },
    Video:    { bg: dark ? 'rgba(139,92,246,0.18)' : '#f5f3ff', text: dark ? '#c4b5fd' : '#6d28d9' },
    Chat:     { bg: dark ? 'rgba(59,130,246,0.18)' : '#eff6ff', text: dark ? '#93c5fd' : '#1d4ed8' },
  };
  const { bg, text } = map[type];
  return (
    <span className="text-[13px] font-medium px-3 py-1 rounded-md font-[lexend]"
      style={{ background: bg, color: text }}>{type}</span>
  );
}

function StatusBadge({ status, dark }: { status: AppointmentStatus; dark: boolean }) {
  const map: Record<AppointmentStatus, { bg: string; text: string }> = {
    Confirmed: { bg: dark ? 'rgba(34,197,94,0.18)'  : '#f0fdf4', text: dark ? '#86efac' : '#15803d' },
    Pending:   { bg: dark ? 'rgba(251,191,36,0.18)' : '#fffbeb', text: dark ? '#fde68a' : '#b45309' },
    Completed: { bg: dark ? 'rgba(59,130,246,0.18)' : '#eff6ff', text: dark ? '#93c5fd' : '#1d4ed8' },
    Cancelled: { bg: dark ? 'rgba(239,68,68,0.18)'  : '#fef2f2', text: dark ? '#fca5a5' : '#b91c1c' },
  };
  const { bg, text } = map[status];
  return (
    <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
      style={{ background: bg, color: text }}>{status}</span>
  );
}

// ─── Mini calendar ────────────────────────────────────────────────────────────
function MiniCalendar({ selectedDay, onSelect, appointmentDates, t }: {
  selectedDay: number | null;
  onSelect: (d: number) => void;
  appointmentDates: Set<number>;
  t: ReturnType<typeof useTheme>;
}) {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year,  setYear]  = useState(CURRENT_YEAR);

  const DAYS        = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const totalDays   = getDaysInMonth(month, year);
  const startOffset = getFirstDayOfMonth(month, year);
  const monthName   = new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  return (
    <div className="rounded-2xl p-5" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[15px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>{monthName}</p>
        <div className="flex gap-1">
          {[prevMonth, nextMonth].map((fn, i) => (
            <button key={i} onClick={fn}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ border: `1px solid ${t.cardBorder}` }}
              onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg className="w-3.5 h-3.5" style={{ color: t.textMuted }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points={i === 0 ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold uppercase py-1 font-[lexend]"
            style={{ color: t.textMuted }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
          const hasAppt    = appointmentDates.has(day);
          const isToday    = day === TODAY && month === CURRENT_MONTH && year === CURRENT_YEAR;
          const isSelected = day === selectedDay;
          return (
            <button key={day} onClick={() => onSelect(day)}
              className="relative h-9 rounded-xl flex items-center justify-center text-[13px] font-medium transition-all font-[lexend]"
              style={{
                background:  isToday ? t.calTodayBg : isSelected ? t.calSelectedBg : 'transparent',
                color:       isToday ? '#ffffff' : isSelected ? t.greenText : hasAppt ? t.textPrimary : t.textMuted,
                fontWeight:  (isToday || isSelected) ? 700 : 500,
              }}
              onMouseEnter={e => { if (!isToday && !isSelected) e.currentTarget.style.background = t.rowHover; }}
              onMouseLeave={e => { if (!isToday && !isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              {day}
              {hasAppt && !isToday && (
                <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
                  style={{ background: isSelected ? t.greenText : t.greenText + '80' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: `1px solid ${t.divider}` }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: t.greenText }} />
          <span className="text-[12px] font-[lexend]" style={{ color: t.textMuted }}>Has appointments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: t.calTodayBg }}>
            <span className="text-[9px] text-white font-bold">T</span>
          </div>
          <span className="text-[12px] font-[lexend]" style={{ color: t.textMuted }}>Today</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminAppointmentsPage() {
  const t = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setType]         = useState('All Types');
  const [statusFilter, setStatus]       = useState('All Status');
  const [selectedDay,  setSelectedDay]  = useState<number | null>(TODAY);

  useEffect(() => {
    getAdminAppointments().then(data => { setAppointments(data); setLoading(false); });
  }, []);

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    return (
      (!q || a.student_name.toLowerCase().includes(q) || a.counsellor_name.toLowerCase().includes(q))
      && (typeFilter   === 'All Types'  || a.session_type === typeFilter)
      && (statusFilter === 'All Status' || a.status === statusFilter)
    );
  });

  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;
  const counts = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };
  const appointmentDates = new Set(appointments.map(a => new Date(a.date).getDate()));

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            Appointments
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
            {appointments.length} total appointments
          </p>
        </div>
        <div className="flex gap-2">
          <button className="h-11 px-5 rounded-xl text-[14px] font-semibold transition font-[lexend]"
            style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.cardBg }}>
            Month View
          </button>
          <button className="h-11 px-5 rounded-xl text-[14px] font-semibold transition font-[lexend]"
            style={{ background: '#1a5c2a', color: '#ffffff' }}>
            + Schedule
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total',     value: String(counts.total),     accent: 'bg-[#1a5c2a]' },
          { label: 'Pending',   value: String(counts.pending),   accent: 'bg-amber-400' },
          { label: 'Confirmed', value: String(counts.confirmed), accent: 'bg-blue-500'  },
          { label: 'Cancelled', value: String(counts.cancelled), accent: 'bg-red-500'   },
        ].map(s => (
          <div key={s.label} className="relative rounded-2xl p-6 overflow-hidden"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <div className={`absolute top-0 left-0 right-0 h-[4px] rounded-t-2xl ${s.accent}`} />
            <p className="text-[42px] font-bold leading-none font-[syne]" style={{ color: t.textPrimary }}>{s.value}</p>
            <p className="text-[15px] font-semibold mt-2" style={{ color: t.textSecondary }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Calendar + Table ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-5">
        <MiniCalendar
          selectedDay={selectedDay}
          onSelect={setSelectedDay}
          appointmentDates={appointmentDates}
          t={t}
        />

        <div className="rounded-2xl overflow-hidden flex flex-col"
          style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>

          {/* Filters */}
          <div className="flex items-center gap-3 p-4 flex-wrap"
            style={{ borderBottom: `1px solid ${t.divider}` }}>
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.textMuted }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search appointments..." className={`${inputCls} w-full pl-10`}
                style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
            </div>
            <select value={typeFilter} onChange={e => setType(e.target.value)} className={inputCls}
              style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
              {['All Types', 'Chat', 'Physical', 'Video'].map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatus(e.target.value)} className={inputCls}
              style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
              {['All Status', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                  {['Student', 'Counsellor', 'Type', 'Date', 'Time', 'Duration', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider font-[lexend]"
                      style={{ color: t.textMuted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
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
                ) : filtered.map(a => {
                  const initials = a.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={a.id}
                      style={{ borderBottom: `1px solid ${t.divider}` }}
                      className="group transition-colors"
                      onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                            style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                            {initials}
                          </div>
                          <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                            {a.student_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>{a.counsellor_name}</span>
                      </td>
                      <td className="px-5 py-4"><SessionBadge type={a.session_type} dark={t.dark} /></td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{formatDate(a.date)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] font-mono" style={{ color: t.textMuted }}>{formatTime(a.time)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{a.duration} min</span>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={a.status} dark={t.dark} /></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors"
                            style={{ background: t.dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', color: t.textSecondary }}>
                            View
                          </button>
                          {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                            <button className="h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors"
                              style={{ background: t.dark ? 'rgba(239,68,68,0.18)' : '#fef2f2', color: t.dark ? '#fca5a5' : '#b91c1c' }}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                        No appointments found
                      </p>
                      <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                        Try adjusting your filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
