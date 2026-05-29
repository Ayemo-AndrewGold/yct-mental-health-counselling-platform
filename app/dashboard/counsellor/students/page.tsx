'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCounsellorStudents, getAppointments } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Student {
  id: number;
  full_name: string;
  email: string;
  matric_number: string;
  department: string;
  level: string;
  is_active: boolean;
}

interface Appointment {
  id: number;
  student: number;
  student_name: string;
  session_type: string;
  date: string;
  time: string;
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const diff = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT ROW
// ─────────────────────────────────────────────────────────────────────────────
function StudentRow({
  student,
  appointments,
}: {
  student: Student;
  appointments: Appointment[];
}) {
  const [expanded, setExpanded] = useState(false);

  const studentAppts = appointments.filter(a => a.student === student.id);
  const completedSessions = studentAppts.filter(a => a.status === 'Completed').length;
  const lastAppt = studentAppts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  const nextAppt = studentAppts
    .filter(a => (a.status === 'Confirmed' || a.status === 'Pending') &&
      new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const initials = student.full_name
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors group">

        {/* Student */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center text-[10px] font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-900">{student.full_name}</p>
              <p className="text-[10.5px] text-gray-400 font-mono">{student.matric_number ?? '—'}</p>
            </div>
          </div>
        </td>

        {/* Department */}
        <td className="px-4 py-3 text-[12px] text-gray-600">{student.department ?? '—'}</td>

        {/* Level */}
        <td className="px-4 py-3">
          {student.level ? (
            <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-[2px] rounded-full">
              {student.level}
            </span>
          ) : '—'}
        </td>

        {/* Sessions */}
        <td className="px-4 py-3 text-[12px] font-semibold text-gray-900">
          {completedSessions}
        </td>

        {/* Last seen */}
        <td className="px-4 py-3 text-[12px] text-gray-500">
          {lastAppt ? formatDate(lastAppt.date) : 'Never'}
        </td>

        {/* Next session */}
        <td className="px-4 py-3 text-[11px] text-teal-700 font-medium">
          {nextAppt
            ? `${formatDate(nextAppt.date)} ${formatTime(nextAppt.time)}`
            : '—'}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full
            ${student.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {student.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setExpanded(!expanded)}
              className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors"
            >
              {expanded ? 'Hide' : 'View'}
            </button>
            <Link
              href="/dashboard/counsellor/messages"
              className="h-6 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10.5px] font-medium rounded-md transition-colors flex items-center"
            >
              Message
            </Link>
          </div>
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr className="bg-teal-50/30">
          <td colSpan={8} className="px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Full Name',        value: student.full_name                    },
                { label: 'Email',            value: student.email                        },
                { label: 'Matric No.',       value: student.matric_number ?? '—'         },
                { label: 'Department',       value: student.department ?? '—'            },
                { label: 'Level',            value: student.level ?? '—'                 },
                { label: 'Sessions Done',    value: String(completedSessions)            },
                { label: 'Last Seen',        value: lastAppt ? formatDate(lastAppt.date) : 'Never' },
                { label: 'Next Session',     value: nextAppt ? `${formatDate(nextAppt.date)} ${formatTime(nextAppt.time)}` : 'Not scheduled' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-[12px] font-semibold text-gray-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CounsellorStudentsPage() {
  const [students, setStudents]         = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [status, setStatus]             = useState('All Status');

  useEffect(() => {
    Promise.all([
      getCounsellorStudents(),
      getAppointments(),
    ]).then(([studentsData, apptData]) => {
      setStudents(studentsData);
      setAppointments(apptData);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.full_name.toLowerCase().includes(q) ||
      (s.matric_number ?? '').toLowerCase().includes(q);
    const matchStatus = status === 'All Status' ||
      (status === 'Active' ? s.is_active : !s.is_active);
    return matchSearch && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-teal-600 transition';

  return (
    <div className="px-6 py-5 pb-10 space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
          My Students
        </h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          {students.length} assigned students
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total',    value: String(students.length),                             accent: 'bg-teal-600'  },
          { label: 'Active',   value: String(students.filter(s => s.is_active).length),    accent: 'bg-green-500' },
          { label: 'Inactive', value: String(students.filter(s => !s.is_active).length),   accent: 'bg-gray-400'  },
          { label: 'Showing',  value: String(filtered.length),                             accent: 'bg-amber-400' },
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
            placeholder="Search by name or matric number..."
            className={`${inputCls} w-full pl-8`}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {['All Status', 'Active', 'Inactive'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Student', 'Department', 'Level', 'Sessions', 'Last Seen', 'Next Session', 'Status', ''].map((h) => (
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
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="text-[12px] font-medium text-gray-500">No students found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Students will appear here once they book a session with you
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <StudentRow
                  key={s.id}
                  student={s}
                  appointments={appointments}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}