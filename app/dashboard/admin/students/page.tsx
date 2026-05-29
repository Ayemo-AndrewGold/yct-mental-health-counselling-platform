'use client';

import { useState, useEffect  } from 'react';
import Link from 'next/link';
import { getAdminStudents } from '@/lib/api'; 

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
  date_joined: string;
  is_active: boolean;
}

const DEPARTMENTS = [
  'All Departments',
  'Computer Technology',
  'Electrical Engineering',
  'Mass Communication',
  'Business Administration',
  'Food Technology',
  'Science Lab Technology',
];


// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full
      ${active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────
export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All Departments');
  const [level, setLevel] = useState('All Levels');
  const [status, setStatus] = useState('All Status');

    useEffect(() => {
    getAdminStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      s.full_name.toLowerCase().includes(q) ||
      (s.matric_number ?? '').toLowerCase().includes(q);
    const matchDept   = dept   === 'All Departments' || s.department === dept;
    const matchLevel  = level  === 'All Levels'      || s.level === level;
    const matchStatus = status === 'All Status'      ||
      (status === 'Active' ? s.is_active : !s.is_active);
    return matchSearch && matchDept && matchLevel && matchStatus;
  });

  const LEVEL_OPTIONS  = ['All Levels', 'ND1', 'ND2', 'HND1', 'HND2'];
const STATUS_OPTIONS = ['All Status', 'Active', 'Inactive'];

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-1 focus:ring-[#1a5c2a]/10 transition';

  return (
    <main className="px-6 py-5 space-y-5 pb-10">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Students</h2>
          <p className="text-[12px] text-gray-500 mt-1">{filtered.length} of {students.length} students shown</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[12px] text-gray-500 font-medium transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Registered', value: String(students.length), accent: 'bg-[#1a5c2a]' },
          { label: 'Active', value: String(students.filter(s => s.is_active).length), accent: 'bg-[#f5a623]' },
          { label: 'Inactive', value: String(students.filter(s => !s.is_active).length), accent: 'bg-blue-500'  },
          { label: 'Showing', value: String(filtered.length),accent: 'bg-red-500'},
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.accent}`} />
            <p className="text-[24px] font-bold text-gray-900 tracking-tight leading-none mt-1">{s.value}</p>
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
        <select value={dept}   onChange={(e) => setDept(e.target.value)}   className={inputCls}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select>
        <select value={level}  onChange={(e) => setLevel(e.target.value)}  className={inputCls}>{LEVEL_OPTIONS.map((l) => <option key={l}>{l}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>{STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
 <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Student', 'Email', 'Matric No.', 'Department', 'Level', 'Joined', 'Status', ''].map((h) => (
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
            ) : filtered.map((s) => {
              const initials = s.full_name
                .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e8f5ec] text-[#1a5c2a] border border-[#b6dfc0] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {initials}
                      </div>
                      <p className="text-[12px] font-semibold text-gray-900">{s.full_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500">{s.email}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-400">
                    {s.matric_number ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-600">
                    {s.department ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    {s.level ? (
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-[2px] rounded-full">
                        {s.level}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-gray-400">{s.date_joined}</td>
                  <td className="px-4 py-3"><StatusBadge active={s.is_active} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">
                        View
                      </button>
                      <button className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">
                        {s.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <p className="text-[12px] font-medium text-gray-500">No students found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </main>
  );
}