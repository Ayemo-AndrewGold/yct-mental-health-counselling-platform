'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type StudentStatus = 'Active' | 'Inactive' | 'Flagged' | 'Suspended';
type Severity      = 'High' | 'Medium' | 'Low' | 'Minimal' | 'Severe' | 'Moderate';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  avatarStyle: string;
  matricNo: string;
  department: string;
  level: string;
  cases: number;
  phq9Score: number;
  phq9Label: string;
  phqSeverity: 'high' | 'medium' | 'low';
  status: StudentStatus;
  joinedDate: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const STUDENTS: Student[] = [
  { id: '1', firstName: 'Okonkwo', lastName: 'Chukwuemeka', initials: 'OC', avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a] border-[#b6dfc0]',    matricNo: 'P/ND/23/3210045',  department: 'Computer Technology',    level: 'ND2',  cases: 2, phq9Score: 14, phq9Label: 'Mod-Severe', phqSeverity: 'high',   status: 'Active',   joinedDate: 'Apr 21, 2026' },
  { id: '2', firstName: 'Fatima',  lastName: 'Abdullahi',    initials: 'FA', avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',           matricNo: 'P/ND/24/3210128',  department: 'Mass Communication',     level: 'HND1', cases: 1, phq9Score: 8,  phq9Label: 'Moderate',   phqSeverity: 'medium', status: 'Active',   joinedDate: 'Apr 20, 2026' },
  { id: '3', firstName: 'Adewale', lastName: 'Funmilayo',    initials: 'AF', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100',     matricNo: 'P/HND/22/3210391', department: 'Electrical Engineering', level: 'HND1', cases: 3, phq9Score: 18, phq9Label: 'Severe',     phqSeverity: 'high',   status: 'Active',   joinedDate: 'Apr 20, 2026' },
  { id: '4', firstName: 'Balogun', lastName: 'Ifeoluwa',     initials: 'BI', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',        matricNo: 'P/ND/24/3210083',  department: 'Business Administration',level: 'ND1',  cases: 0, phq9Score: 4,  phq9Label: 'Minimal',    phqSeverity: 'low',    status: 'Inactive', joinedDate: 'Apr 18, 2026' },
  { id: '5', firstName: 'Nwosu',   lastName: 'Tochukwu',     initials: 'NT', avatarStyle: 'bg-red-50 text-red-700 border-red-100',             matricNo: 'P/ND/23/3210328',  department: 'Computer Technology',    level: 'ND2',  cases: 4, phq9Score: 16, phq9Label: 'Severe',     phqSeverity: 'high',   status: 'Flagged',  joinedDate: 'Mar 15, 2026' },
  { id: '6', firstName: 'Yusuf',   lastName: 'Musa',         initials: 'YM', avatarStyle: 'bg-green-50 text-green-700 border-green-100',       matricNo: 'P/ND/23/3210512',  department: 'Science Lab Technology', level: 'ND2',  cases: 1, phq9Score: 6,  phq9Label: 'Mild',       phqSeverity: 'low',    status: 'Active',   joinedDate: 'Mar 10, 2026' },
];

const DEPARTMENTS = ['All Departments', 'Computer Technology', 'Electrical Engineering', 'Mass Communication', 'Business Administration', 'Food Technology', 'Science Lab Technology'];
const LEVELS  = ['All Levels', 'ND1', 'ND2', 'HND1', 'HND2'];
const STATUSES = ['All Status', 'Active', 'Inactive', 'Flagged', 'Suspended'];

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: StudentStatus }) {
  const map: Record<StudentStatus, string> = {
    Active:    'bg-green-50 text-green-700',
    Inactive:  'bg-gray-100 text-gray-500',
    Flagged:   'bg-red-50 text-red-600',
    Suspended: 'bg-orange-50 text-orange-600',
  };
  return <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>{status}</span>;
}

function PHQ9Badge({ score, label, severity }: { score: number; label: string; severity: 'high' | 'medium' | 'low' }) {
  const map = { high: 'bg-red-50 text-red-700', medium: 'bg-amber-50 text-amber-700', low: 'bg-green-50 text-green-700' };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-[3px] rounded-md ${map[severity]}`}>
      <span className="font-bold">{score}</span> · {label}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  return <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-[2px] rounded-full">{level}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminStudentsPage() {
  const [search, setSearch]   = useState('');
  const [dept, setDept]       = useState('All Departments');
  const [level, setLevel]     = useState('All Levels');
  const [status, setStatus]   = useState('All Status');

  const filtered = STUDENTS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || s.matricNo.toLowerCase().includes(q);
    const matchDept   = dept   === 'All Departments' || s.department === dept;
    const matchLevel  = level  === 'All Levels'      || s.level === level;
    const matchStatus = status === 'All Status'      || s.status === status;
    return matchSearch && matchDept && matchLevel && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-1 focus:ring-[#1a5c2a]/10 transition';

  return (
    <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">

      {/* Page header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Students</h2>
          <p className="text-[12px] text-gray-500 mt-1">{filtered.length} of {STUDENTS.length} students shown</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[12px] text-gray-500 font-medium transition-colors">
            Export CSV
          </button>
          <button className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors">
            + Add Student
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Registered', value: '1,248', accent: 'bg-[#1a5c2a]', bg: 'bg-[#e8f5ec]', color: '#1a5c2a' },
          { label: 'Active Cases',     value: '142',   accent: 'bg-[#f5a623]', bg: 'bg-[#fdf3dc]', color: '#d97706' },
          { label: 'Assessments Done', value: '891',   accent: 'bg-blue-500',  bg: 'bg-blue-50',   color: '#2563eb' },
          { label: 'High Severity',    value: '23',    accent: 'bg-red-500',   bg: 'bg-red-50',    color: '#ef4444' },
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
        <select value={level}  onChange={(e) => setLevel(e.target.value)}  className={inputCls}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Student', 'Matric No.', 'Department', 'Level', 'Cases', 'PHQ-9 Score', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-[1.5px] ${s.avatarStyle}`}>
                      {s.initials}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-gray-900">{s.firstName} {s.lastName}</p>
                      <p className="text-[10.5px] text-gray-400">Joined {s.joinedDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11px] text-gray-400">{s.matricNo}</td>
                <td className="px-4 py-3 text-[12px] text-gray-600">{s.department}</td>
                <td className="px-4 py-3"><LevelBadge level={s.level} /></td>
                <td className="px-4 py-3 text-[12px] font-semibold text-gray-900">{s.cases}</td>
                <td className="px-4 py-3"><PHQ9Badge score={s.phq9Score} label={s.phq9Label} severity={s.phqSeverity} /></td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">View</button>
                    <button className="h-6 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10.5px] font-medium rounded-md transition-colors">Message</button>
                    <button className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
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