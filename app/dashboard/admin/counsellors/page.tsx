'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type CounsellorStatus       = 'Active' | 'Inactive';
type CounsellorAvailability = 'Available' | 'In Session' | 'Offline';

interface Counsellor {
  id: string;
  name: string;
  title: string;
  initials: string;
  avatarStyle: string;
  specialisation: string;
  activeCases: number;
  monthSessions: number;
  rating: number;
  utilisation: number;
  availability: CounsellorAvailability;
  status: CounsellorStatus;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const COUNSELLORS: Counsellor[] = [
  { id: '1', name: 'Mr. Victor Alomaja',  title: 'Senior Counsellor',   initials: 'VA', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-200',    specialisation: 'Anxiety & Stress Management', activeCases: 24, monthSessions: 38, rating: 4.8, utilisation: 90, availability: 'Available',   status: 'Active'   },
  { id: '2', name: 'Mrs. Amaka Bello',    title: 'Clinical Counsellor', initials: 'AB', avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',         specialisation: 'Depression & Grief',          activeCases: 18, monthSessions: 29, rating: 4.6, utilisation: 72, availability: 'In Session',  status: 'Active'   },
  { id: '3', name: 'Dr. Dele Fashola',    title: 'Lead Psychologist',   initials: 'DF', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100',   specialisation: 'Trauma & PTSD',               activeCases: 11, monthSessions: 22, rating: 4.9, utilisation: 55, availability: 'Available',   status: 'Active'   },
  { id: '4', name: 'Miss Ruth Okafor',    title: 'Student Counsellor',  initials: 'RO', avatarStyle: 'bg-green-50 text-green-700 border-green-100',      specialisation: 'Academic Stress',             activeCases: 9,  monthSessions: 14, rating: 4.4, utilisation: 45, availability: 'Offline',     status: 'Inactive' },
  { id: '5', name: 'Mr. Chidi Eze',       title: 'Counsellor',          initials: 'CE', avatarStyle: 'bg-red-50 text-red-700 border-red-100',            specialisation: 'Addiction & Substance',        activeCases: 7,  monthSessions: 11, rating: 4.2, utilisation: 35, availability: 'Available',   status: 'Active'   },
  { id: '6', name: 'Mrs. Ngozi Adeyemi',  title: 'Senior Counsellor',   initials: 'NA', avatarStyle: 'bg-pink-50 text-pink-700 border-pink-100',         specialisation: 'Relationship & Family',        activeCases: 14, monthSessions: 19, rating: 4.7, utilisation: 70, availability: 'In Session',  status: 'Active'   },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function AvailabilityBadge({ avail }: { avail: CounsellorAvailability }) {
  const map: Record<CounsellorAvailability, string> = {
    'Available':  'bg-green-50 text-green-700',
    'In Session': 'bg-amber-50 text-amber-700',
    'Offline':    'bg-gray-100 text-gray-500',
  };
  return <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[avail]}`}>{avail}</span>;
}

function UtilBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-[#1a5c2a]';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10.5px] font-semibold text-gray-600 w-8 text-right">{pct}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminCounsellorsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [specFilter, setSpecFilter]     = useState('All Specialisations');

  const filtered = COUNSELLORS.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.specialisation.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All Status' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] transition';

  return (
    <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Counsellors</h2>
          <p className="text-[12px] text-gray-500 mt-1">{COUNSELLORS.filter(c => c.status === 'Active').length} active · {COUNSELLORS.length} total registered</p>
        </div>
        <button className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors">
          + Add Counsellor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Counsellors',    value: String(COUNSELLORS.length), accent: 'bg-[#1a5c2a]' },
          { label: 'Active Today',          value: String(COUNSELLORS.filter(c => c.availability !== 'Offline').length), accent: 'bg-[#f5a623]' },
          { label: 'Avg. Utilisation',      value: `${Math.round(COUNSELLORS.reduce((a, c) => a + c.utilisation, 0) / COUNSELLORS.length)}%`, accent: 'bg-blue-500' },
          { label: 'Avg. Session Length',   value: '42 min', accent: 'bg-red-500' },
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search counsellors..." className={`${inputCls} w-full pl-8`} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls}>
          {['All Status', 'Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className={inputCls}>
          {['All Specialisations', 'Anxiety & Stress Management', 'Depression & Grief', 'Trauma & PTSD', 'Academic Stress'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Counsellor', 'Specialisation', 'Active Cases', 'Sessions (Month)', 'Rating', 'Utilisation', 'Availability', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-[1.5px] ${c.avatarStyle}`}>
                      {c.initials}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-gray-900">{c.name}</p>
                      <p className="text-[10.5px] text-gray-400">{c.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-600 max-w-[160px] truncate">{c.specialisation}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-gray-900">{c.activeCases}</td>
                <td className="px-4 py-3 text-[12px] text-gray-600">{c.monthSessions}</td>
                <td className="px-4 py-3">
                  <span className="text-[12px] font-semibold text-gray-900">⭐ {c.rating}</span>
                </td>
                <td className="px-4 py-3 min-w-[120px]"><UtilBar pct={c.utilisation} /></td>
                <td className="px-4 py-3"><AvailabilityBadge avail={c.availability} /></td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${c.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">Profile</button>
                    <button className="h-6 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10.5px] font-medium rounded-md transition-colors">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}