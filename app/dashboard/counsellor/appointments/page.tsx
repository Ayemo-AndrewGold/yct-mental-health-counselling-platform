'use client';

import { useState, useEffect } from 'react';
import { getCounsellorAppointments, updateAppointmentStatus } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-GB', {
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
// BADGES
// ─────────────────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: SessionType }) {
  const map: Record<SessionType, string> = {
    Physical: 'bg-[#e0f2f1] text-teal-700',
    Video:    'bg-purple-50 text-purple-700',
    Chat:     'bg-blue-50 text-blue-700',
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-[2px] rounded-md ${map[type]}`}>
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
// APPOINTMENT ROW
// ─────────────────────────────────────────────────────────────────────────────
function AppointmentRow({
  appt,
  onStatusChange,
}: {
  appt: Appointment;
  onStatusChange: (id: number, status: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatus(newStatus: string) {
    setUpdating(true);
    await onStatusChange(appt.id, newStatus);
    setUpdating(false);
  }

  const initials = appt.student_name
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors group">

        {/* Time */}
        <td className="px-4 py-3">
          <div className="bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 text-center inline-block min-w-[64px]">
            <p className="text-[12px] font-bold text-teal-700 leading-none font-mono">
              {formatTime(appt.time)}
            </p>
          </div>
        </td>

        {/* Student */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center text-[10px] font-bold shrink-0">
              {initials}
            </div>
            <p className="text-[12px] font-semibold text-gray-900">{appt.student_name}</p>
          </div>
        </td>

        {/* Type */}
        <td className="px-4 py-3"><TypeBadge type={appt.session_type} /></td>

        {/* Duration */}
        <td className="px-4 py-3 text-[12px] text-gray-500">{appt.duration} min</td>

        {/* Date */}
        <td className="px-4 py-3 text-[12px] text-gray-500">{formatDate(appt.date)}</td>

        {/* Status */}
        <td className="px-4 py-3"><StatusBadge status={appt.status} /></td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex gap-1.5">
            {appt.note && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors"
              >
                {expanded ? 'Hide' : 'Note'}
              </button>
            )}
            {appt.status === 'Pending' && (
              <button
                onClick={() => handleStatus('Confirmed')}
                disabled={updating}
                className="h-6 px-2.5 bg-green-50 hover:bg-green-100 text-green-700 text-[10.5px] font-medium rounded-md transition-colors disabled:opacity-50"
              >
                Accept
              </button>
            )}
            {(appt.status === 'Confirmed') && (
              <>
                <button
                  onClick={() => handleStatus('Completed')}
                  disabled={updating}
                  className="h-6 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10.5px] font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleStatus('Cancelled')}
                  disabled={updating}
                  className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}
            {appt.status === 'Completed' && (
              <span className="text-[10px] text-gray-400 italic">Done</span>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded note */}
      {expanded && appt.note && (
        <tr className="bg-teal-50/30">
          <td colSpan={7} className="px-4 py-3">
            <p className="text-[11px] font-semibold text-teal-700 mb-0.5">Student Note:</p>
            <p className="text-[11.5px] text-gray-600 leading-relaxed">{appt.note}</p>
          </td>
        </tr>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CounsellorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [typeFilter, setType]           = useState('All Types');
  const [statusFilter, setStatus]       = useState('All Status');

  useEffect(() => {
    getCounsellorAppointments().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  async function handleStatusChange(id: number, newStatus: string) {
    const res = await updateAppointmentStatus(id, newStatus);
    if (res.ok) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: newStatus as AppointmentStatus } : a
        )
      );
    }
  }

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.student_name.toLowerCase().includes(q);
    const matchType   = typeFilter   === 'All Types'  || a.session_type === typeFilter;
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const counts = {
    today:     appointments.filter(a => a.date === todayStr).length,
    pending:   appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
  };

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-teal-600 transition';

  return (
    <div className="px-6 py-5 pb-10 space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
            My Appointments
          </h2>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {counts.today} today · {appointments.length} total
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Today',     value: String(counts.today),     accent: 'bg-teal-600'  },
          { label: 'Pending',   value: String(counts.pending),   accent: 'bg-amber-400' },
          { label: 'Confirmed', value: String(counts.confirmed), accent: 'bg-blue-500'  },
          { label: 'Completed', value: String(counts.completed), accent: 'bg-green-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
            <p className="text-[24px] font-bold text-gray-900 tracking-tight leading-none mt-1">
              {s.value}
            </p>
            <p className="text-[11.5px] text-gray-500 mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name..."
            className={`${inputCls} w-full pl-8`}
          />
        </div>
        <select value={typeFilter} onChange={(e) => setType(e.target.value)} className={inputCls}>
          {['All Types', 'Physical', 'Video', 'Chat'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {['All Status', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Time', 'Student', 'Type', 'Duration', 'Date', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7} className="px-4 py-3">
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
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <p className="text-[12px] font-medium text-gray-500">No appointments found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters</p>
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appt={a}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}