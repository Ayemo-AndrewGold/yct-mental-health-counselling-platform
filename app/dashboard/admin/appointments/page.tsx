'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type SessionType        = 'Chat' | 'Physical' | 'Video';
type AppointmentStatus  = 'Confirmed' | 'Pending' | 'Upcoming' | 'Completed' | 'Cancelled';

interface Appointment {
  id: string;
  time: string;
  period: 'AM' | 'PM';
  studentName: string;
  isAnonymous: boolean;
  initials: string;
  avatarStyle: string;
  counsellor: string;
  sessionType: SessionType;
  status: AppointmentStatus;
  date: string;
  duration: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const APPOINTMENTS: Appointment[] = [
  { id: '1', time: '10:00', period: 'AM', studentName: 'Nwosu Tochukwu',    isAnonymous: false, initials: 'NT', avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a] border-[#b6dfc0]',  counsellor: 'Mr. Alomaja', sessionType: 'Chat',     status: 'Confirmed',  date: 'Today, Apr 21', duration: '45 min' },
  { id: '2', time: '11:30', period: 'AM', studentName: 'Fatima Abdullahi',  isAnonymous: false, initials: 'FA', avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',         counsellor: 'Mr. Alomaja', sessionType: 'Physical', status: 'Confirmed',  date: 'Today, Apr 21', duration: '60 min' },
  { id: '3', time: '01:00', period: 'PM', studentName: 'Eze Chidera',        isAnonymous: false, initials: 'EC', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100',  counsellor: 'Dr. Fashola', sessionType: 'Video',    status: 'Pending',    date: 'Today, Apr 21', duration: '50 min' },
  { id: '4', time: '02:30', period: 'PM', studentName: 'Oluwaseun Adeyemi', isAnonymous: false, initials: 'OA', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',      counsellor: 'Mrs. Bello',  sessionType: 'Chat',     status: 'Upcoming',   date: 'Today, Apr 21', duration: '45 min' },
  { id: '5', time: '04:00', period: 'PM', studentName: 'Yusuf Musa',         isAnonymous: false, initials: 'YM', avatarStyle: 'bg-green-50 text-green-700 border-green-100',    counsellor: 'Miss Okafor', sessionType: 'Physical', status: 'Upcoming',   date: 'Today, Apr 21', duration: '30 min' },
  { id: '6', time: '09:00', period: 'AM', studentName: 'ANON-48392',          isAnonymous: true,  initials: 'AN', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',  counsellor: 'Mrs. Bello',  sessionType: 'Chat',     status: 'Confirmed',  date: 'Apr 22',        duration: '45 min' },
  { id: '7', time: '10:30', period: 'AM', studentName: 'Adewale Funmilayo',  isAnonymous: false, initials: 'AF', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100', counsellor: 'Mr. Alomaja', sessionType: 'Video',    status: 'Confirmed',  date: 'Apr 22',        duration: '60 min' },
  { id: '8', time: '02:00', period: 'PM', studentName: 'Balogun Ifeoluwa',   isAnonymous: false, initials: 'BI', avatarStyle: 'bg-green-50 text-green-700 border-green-100',  counsellor: 'Miss Okafor', sessionType: 'Physical', status: 'Cancelled',  date: 'Apr 20',        duration: '45 min' },
];

// April 2026: days with appointments
const APPT_DAYS = new Set([2, 4, 7, 9, 10, 14, 16, 18, 21, 22, 23, 25, 28]);
const TODAY = 21;

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function SessionBadge({ type }: { type: SessionType }) {
  const map: Record<SessionType, string> = {
    Chat:     'bg-blue-50 text-blue-700',
    Physical: 'bg-green-50 text-green-700',
    Video:    'bg-amber-50 text-amber-700',
  };
  return <span className={`text-[10px] font-medium px-1.5 py-[1.5px] rounded-[5px] ${map[type]}`}>{type}</span>;
}

function ApptStatusBadge({ status }: { status: AppointmentStatus }) {
  const map: Record<AppointmentStatus, string> = {
    Confirmed:  'bg-green-50 text-green-700',
    Pending:    'bg-amber-50 text-amber-700',
    Upcoming:   'bg-gray-100 text-gray-500',
    Completed:  'bg-blue-50 text-blue-700',
    Cancelled:  'bg-red-50 text-red-600',
  };
  return <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>{status}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// MINI CALENDAR
// ─────────────────────────────────────────────────────────────────────────────
function MiniCalendar({ selectedDay, onSelect }: { selectedDay: number | null; onSelect: (d: number) => void }) {
  const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  // April 2026 starts on Wednesday (index 2)
  const startOffset = 2;
  const totalDays = 30;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-semibold text-gray-900">April 2026</p>
        <div className="flex gap-1">
          <button className="w-6 h-6 rounded-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="w-6 h-6 rounded-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9.5px] font-semibold text-gray-400 uppercase py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Day cells */}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const hasAppt   = APPT_DAYS.has(day);
          const isToday   = day === TODAY;
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
                <span className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full ${isSelected ? 'bg-[#1a5c2a]' : 'bg-[#1a5c2a]/40'}`} />
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
  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatus]   = useState('All Status');
  const [selectedDay, setSelectedDay] = useState<number | null>(TODAY);

  const filtered = APPOINTMENTS.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.studentName.toLowerCase().includes(q) || a.counsellor.toLowerCase().includes(q);
    const matchType   = typeFilter   === 'All Types'  || a.sessionType === typeFilter;
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] transition';

  const statCards = [
    { label: 'Today',       value: String(APPOINTMENTS.filter(a => a.date.startsWith('Today')).length), accent: 'bg-[#1a5c2a]' },
    { label: 'This Week',   value: '19',  accent: 'bg-[#f5a623]' },
    { label: 'This Month',  value: '47',  accent: 'bg-blue-500'  },
    { label: 'Cancelled',   value: String(APPOINTMENTS.filter(a => a.status === 'Cancelled').length), accent: 'bg-red-500' },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Appointments</h2>
          <p className="text-[12px] text-gray-500 mt-1">April 2026 · {APPOINTMENTS.length} total appointments this month</p>
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
        <MiniCalendar selectedDay={selectedDay} onSelect={setSelectedDay} />

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col">
          {/* Table filters */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-50 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search appointments..." className={`${inputCls} w-full pl-8`} />
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={inputCls}>
              {['All Types', 'Chat', 'Physical', 'Video'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              {['All Status', 'Confirmed', 'Pending', 'Upcoming', 'Completed', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Time', 'Student', 'Counsellor', 'Type', 'Duration', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-center inline-block min-w-[54px]">
                      <p className="text-[12px] font-bold text-[#1a5c2a] leading-none font-mono">{a.time}</p>
                      <p className="text-[9.5px] text-gray-400 mt-0.5 font-medium">{a.period}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9.5px] font-bold shrink-0 border-[1.5px] ${a.avatarStyle}`}>
                        {a.initials}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-gray-900">{a.studentName}</p>
                        {a.isAnonymous && <p className="text-[10px] text-gray-400">Anonymous</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-600">{a.counsellor}</td>
                  <td className="px-4 py-3"><SessionBadge type={a.sessionType} /></td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{a.duration}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-500">{a.date}</td>
                  <td className="px-4 py-3"><ApptStatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">View</button>
                      {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                        <button className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
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