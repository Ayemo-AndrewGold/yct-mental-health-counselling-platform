'use client';

import { useState, useEffect } from 'react';
import { getAdminAppointments } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

// April 2026: days with appointments
const TODAY = new Date().getDate();
const CURRENT_MONTH = new Date().getMonth();
const CURRENT_YEAR = new Date().getFullYear();

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert to Mon=0 format
}

//Helper function
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function SessionBadge({ type }: { type: SessionType }) {
  const map: Record<SessionType, string> = {
    Physical: 'bg-green-50 text-green-700',
    Video:    'bg-purple-50 text-purple-700',
    Chat:     'bg-blue-50 text-blue-700',
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-[1.5px] rounded-[5px] ${map[type]}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, string> = {
    Confirmed: 'bg-green-50 text-green-700',
    Pending:   'bg-amber-50 text-amber-700',
    Completed: 'bg-blue-50 text-blue-700',
    Cancelled: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI CALENDAR
// ─────────────────────────────────────────────────────────────────────────────
function MiniCalendar({
  selectedDay,
  onSelect,
  appointmentDates,
}: {
  selectedDay: number | null;
  onSelect: (d: number) => void;
  appointmentDates: Set<number>;
}) {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear]   = useState(CURRENT_YEAR);

    const DAYS      = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const totalDays = getDaysInMonth(month, year);
  const startOffset = getFirstDayOfMonth(month, year);

   const monthName = new Date(year, month, 1).toLocaleDateString('en-GB', {
    month: 'long', year: 'numeric',
  });

    function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

    function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }



return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-gray-900">{monthName}</p>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="w-6 h-6 rounded-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="w-6 h-6 rounded-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9.5px] font-semibold text-gray-400 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const hasAppt    = appointmentDates.has(day);
          const isToday    = day === TODAY &&
            month === CURRENT_MONTH && year === CURRENT_YEAR;
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              onClick={() => onSelect(day)}
              className={`relative h-8 rounded-lg flex items-center justify-center text-[11.5px] font-medium transition-all
                ${isToday    ? 'bg-[#1a5c2a] text-white font-bold'
                : isSelected ? 'bg-[#e8f5ec] text-[#1a5c2a] font-semibold border border-[#1a5c2a]/20'
                : hasAppt    ? 'text-gray-900 hover:bg-gray-50'
                             : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {day}
              {hasAppt && !isToday && (
                <span className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full
                  ${isSelected ? 'bg-[#1a5c2a]' : 'bg-[#1a5c2a]/40'}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1a5c2a]" />
          <span className="text-[10px] text-gray-400">Has appointments</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-[#1a5c2a] flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">T</span>
          </div>
          <span className="text-[10px] text-gray-400">Today</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setType] = useState('All Types');
  const [statusFilter, setStatus]  = useState('All Status');
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY);

    useEffect(() => {
    getAdminAppointments().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);
  
  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.student_name.toLowerCase().includes(q) ||
      a.counsellor_name.toLowerCase().includes(q);
   const matchType   = typeFilter   === 'All Types'  || a.session_type === typeFilter;
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] transition';

    const counts = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const appointmentDates = new Set(
  appointments.map(a => new Date(a.date).getDate())
);

const statCards = [
  { label: 'Total',     value: String(counts.total),     accent: 'bg-[#1a5c2a]' },
  { label: 'Pending',   value: String(counts.pending),   accent: 'bg-[#f5a623]' },
  { label: 'Confirmed', value: String(counts.confirmed), accent: 'bg-blue-500'  },
  { label: 'Cancelled', value: String(counts.cancelled), accent: 'bg-red-500'   },
];

  return (
    <main className="px-6 py-5 space-y-5 pb-10">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Appointments</h2>
          <p className="text-[12px] text-gray-500 mt-1">{appointments.length} total appointments</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[12px] text-gray-500 font-medium transition-colors">Month View</button>
          <button className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors">+ Schedule</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
            <p className="text-[24px] font-bold text-gray-900 tracking-tight leading-none mt-1">{s.value}</p>
            <p className="text-[11.5px] text-gray-500 mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Calendar + Table */}
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-4">
        <MiniCalendar     selectedDay={selectedDay}
    onSelect={setSelectedDay}
    appointmentDates={appointmentDates} />

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col">
          {/* Table filters */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-50 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointments..." className={`${inputCls} w-full pl-8`} />
            </div>
            <select value={typeFilter} onChange={(e) => setType(e.target.value)} className={inputCls}>
              {['All Types', 'Chat', 'Physical', 'Video'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              {['All Status', 'Confirmed', 'Pending', 'Upcoming', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Student', 'Counsellor', 'Type', 'Date', 'Time', 'Duration', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={8} className="px-4 py-3">
                    <div className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                        <div className="h-2.5 w-48 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : filtered.map((a) => {
              const initials = a.student_name
                .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#e8f5ec] text-[#1a5c2a] border border-[#b6dfc0] flex items-center justify-center text-[9.5px] font-bold shrink-0">
                        {initials}
                      </div>
                      <p className="text-[12px] font-semibold text-gray-900">{a.student_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-600">{a.counsellor_name}</td>
                  <td className="px-4 py-3"><SessionBadge type={a.session_type} /></td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{formatDate(a.date)}</td>
                  <td className="px-4 py-3 text-[12px] font-mono text-gray-500">{formatTime(a.time)}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{a.duration} min</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">
                        View
                      </button>
                      {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                        <button className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">
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
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="text-[12px] font-medium text-gray-500">No appointments found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </main>
  );
}