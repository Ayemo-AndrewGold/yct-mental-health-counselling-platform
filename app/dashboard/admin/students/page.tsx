'use client';

import { useState, useEffect } from 'react';
import { getAdminStudents, toggleUserStatus } from '@/lib/api';

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
  };
}

function StatusBadge({ active, dark }: { active: boolean; dark: boolean }) {
  return (
    <span
      className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
      style={active
        ? { background: dark ? 'rgba(34,197,94,0.18)' : '#f0fdf4', color: dark ? '#86efac' : '#15803d' }
        : { background: dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', color: dark ? 'rgba(255,255,255,0.45)' : '#6b7280' }
      }
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminStudentsPage() {
  const t = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [search,   setSearch]   = useState('');
  const [dept,     setDept]     = useState('All Departments');
  const [level,    setLevel]    = useState('All Levels');
  const [status,   setStatus]   = useState('All Status');

  useEffect(() => {
    getAdminStudents().then(data => { setStudents(data); setLoading(false); });
  }, []);

  async function handleToggle(student: Student) {
    setToggling(student.id);
    const res = await toggleUserStatus(student.id, !student.is_active);
    if (res.ok) {
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, is_active: !s.is_active } : s));
    }
    setToggling(null);
  }

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (!q || s.full_name.toLowerCase().includes(q) || (s.matric_number ?? '').toLowerCase().includes(q))
      && (dept   === 'All Departments' || s.department === dept)
      && (level  === 'All Levels'      || s.level === level)
      && (status === 'All Status'      || (status === 'Active' ? s.is_active : !s.is_active))
    );
  });

  const LEVEL_OPTIONS  = ['All Levels', 'ND1', 'ND2', 'HND1', 'HND2'];
  const STATUS_OPTIONS = ['All Status', 'Active', 'Inactive'];
  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            Students
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
            {filtered.length} of {students.length} students shown
          </p>
        </div>
        <button
          className="flex items-center gap-2 h-11 px-5 rounded-xl text-[14px] font-semibold transition"
          style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.cardBg }}
        >
          Export CSV
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Registered', value: String(students.length),                          accent: 'bg-[#1a5c2a]' },
          { label: 'Active',           value: String(students.filter(s => s.is_active).length),  accent: 'bg-amber-400' },
          { label: 'Inactive',         value: String(students.filter(s => !s.is_active).length), accent: 'bg-blue-500'  },
          { label: 'Showing',          value: String(filtered.length),                           accent: 'bg-red-500'   },
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
            placeholder="Search by name or matric number..."
            className={`${inputCls} w-full pl-10`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={dept}   onChange={e => setDept(e.target.value)}   className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={level}  onChange={e => setLevel(e.target.value)}  className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {LEVEL_OPTIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                {['Student', 'Email', 'Matric No.', 'Department', 'Level', 'Joined', 'Status', ''].map(h => (
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
              ) : filtered.map(s => {
                const initials = s.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={s.id}
                    style={{ borderBottom: `1px solid ${t.divider}` }}
                    className="group transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                          style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                          {initials}
                        </div>
                        <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                          {s.full_name}
                        </p>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{s.email}</span>
                    </td>
                    {/* Matric */}
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-mono" style={{ color: t.textMuted }}>{s.matric_number ?? '—'}</span>
                    </td>
                    {/* Department */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>{s.department ?? '—'}</span>
                    </td>
                    {/* Level */}
                    <td className="px-5 py-4">
                      {s.level ? (
                        <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
                          style={{ background: t.dark ? 'rgba(59,130,246,0.18)' : '#eff6ff', color: t.dark ? '#93c5fd' : '#1d4ed8' }}>
                          {s.level}
                        </span>
                      ) : <span style={{ color: t.textMuted }}>—</span>}
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{s.date_joined}</span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge active={s.is_active} dark={t.dark} />
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggle(s)}
                          disabled={toggling === s.id}
                          className="h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors disabled:opacity-50"
                          style={s.is_active
                            ? { background: t.dark ? 'rgba(239,68,68,0.18)' : '#fef2f2', color: t.dark ? '#fca5a5' : '#b91c1c' }
                            : { background: t.dark ? 'rgba(34,197,94,0.18)' : '#f0fdf4', color: t.dark ? '#86efac' : '#15803d' }
                          }
                        >
                          {toggling === s.id ? '…' : s.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                      No students found
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
  );
}
