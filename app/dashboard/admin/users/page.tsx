'use client';

import { useState, useEffect } from 'react';
import { getAdminUsers, toggleUserStatus } from '@/lib/api';

interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'student' | 'counsellor' | 'admin';
  date_joined: string;
  is_active: boolean;
  department?: string;
  matric_number?: string;
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
    amberBg:       dark ? 'rgba(245,166,35,0.18)'  : '#fffbeb',
    amberText:     dark ? '#fde68a'                : '#92400e',
  };
}

function RoleBadge({ role, dark }: { role: string; dark: boolean }) {
  const map: Record<string, { bg: string; text: string }> = {
    student:    { bg: dark ? 'rgba(59,130,246,0.18)'  :'#eff6ff', text: dark ? '#93c5fd':'#1d4ed8'  },
    counsellor: { bg: dark ? 'rgba(245,166,35,0.18)'  :'#fffbeb', text: dark ? '#fde68a':'#92400e'  },
    admin:      { bg: dark ? 'rgba(139,92,246,0.18)'  :'#f5f3ff', text: dark ? '#c4b5fd':'#6d28d9'  },
  };
  const { bg, text } = map[role] ?? map['student'];
  return (
    <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend] capitalize"
      style={{ background: bg, color: text }}>{role}</span>
  );
}

function StatusBadge({ active, dark }: { active: boolean; dark: boolean }) {
  return (
    <span
      className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
      style={active
        ? { background: dark ? 'rgba(34,197,94,0.18)':'#f0fdf4', color: dark ? '#86efac':'#15803d' }
        : { background: dark ? 'rgba(255,255,255,0.08)':'#f3f4f6', color: dark ? 'rgba(255,255,255,0.45)':'#6b7280' }
      }
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

export default function AdminUsersPage() {
  const t = useTheme();
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [search,   setSearch]   = useState('');
  const [roleFilter,   setRole]   = useState('All Roles');
  const [statusFilter, setStatus] = useState('All Status');
  const [error,    setError]    = useState('');

  useEffect(() => {
    getAdminUsers()
      .then(data => { setUsers(Array.isArray(data) ? data : []); })
      .catch(() => setError('Could not load users.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(user: User) {
    setToggling(user.id);
    try {
      const res = await toggleUserStatus(user.id, !user.is_active);
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      } else {
        setError('Failed to update user status.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setToggling(null);
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (!q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      && (roleFilter   === 'All Roles'   || u.role === roleFilter.toLowerCase())
      && (statusFilter === 'All Status'  || (statusFilter === 'Active' ? u.is_active : !u.is_active))
    );
  });

  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* Header */}
      <div>
        <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
          User Management
        </h2>
        <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
          {users.length} total users · manage access and roles
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',  value: String(users.length),                                          accent: 'bg-[#1a5c2a]' },
          { label: 'Students',     value: String(users.filter(u => u.role === 'student').length),        accent: 'bg-blue-500'  },
          { label: 'Counsellors',  value: String(users.filter(u => u.role === 'counsellor').length),     accent: 'bg-amber-400' },
          { label: 'Active',       value: String(users.filter(u => u.is_active).length),                 accent: 'bg-green-500' },
        ].map(s => (
          <div key={s.label} className="relative rounded-2xl p-6 overflow-hidden"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <div className={`absolute top-0 left-0 right-0 h-[4px] rounded-t-2xl ${s.accent}`} />
            <p className="text-[42px] font-bold leading-none font-[syne]" style={{ color: t.textPrimary }}>{s.value}</p>
            <p className="text-[15px] font-semibold mt-2" style={{ color: t.textSecondary }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.textMuted }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className={`${inputCls} w-full pl-10`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={roleFilter} onChange={e => setRole(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Roles','Student','Counsellor','Admin'].map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Status','Active','Inactive'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl px-5 py-4 text-[14px] font-[lexend]"
          style={{ background: t.dark ? 'rgba(239,68,68,0.15)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c', border:`1px solid ${t.dark ? 'rgba(239,68,68,0.30)':'#fecaca'}` }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                {['User','Email','Role','Joined','Status',''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider font-[lexend]"
                    style={{ color: t.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                    <td colSpan={6} className="px-5 py-4">
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>No users found</p>
                    <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>Try adjusting your filters</p>
                  </td>
                </tr>
              ) : filtered.map(u => {
                const initials = u.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const roleColor = u.role === 'admin' ? '#a855f7' : u.role === 'counsellor' ? '#f5a623' : '#1a5c2a';
                const roleBg    = u.role === 'admin'
                  ? (t.dark ? 'rgba(139,92,246,0.18)':'#f5f3ff')
                  : u.role === 'counsellor'
                  ? (t.dark ? 'rgba(245,166,35,0.18)':'#fffbeb')
                  : (t.dark ? 'rgba(0,135,81,0.18)':'#e8f5ec');
                return (
                  <tr key={u.id}
                    style={{ borderBottom: `1px solid ${t.divider}` }}
                    className="group transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                          style={{ background: roleBg, color: roleColor, border: `1px solid ${roleColor}30` }}>
                          {initials}
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                            {u.full_name}
                          </p>
                          {u.matric_number && (
                            <p className="text-[12px] font-mono mt-0.5" style={{ color: t.textMuted }}>
                              {u.matric_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>{u.email}</span>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-4"><RoleBadge role={u.role} dark={t.dark} /></td>
                    {/* Joined */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>
                        {u.date_joined
                          ? new Date(u.date_joined).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
                          : '—'}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4"><StatusBadge active={u.is_active} dark={t.dark} /></td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggle(u)}
                          disabled={toggling === u.id}
                          className="h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors disabled:opacity-50"
                          style={u.is_active
                            ? { background: t.dark ? 'rgba(239,68,68,0.18)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c' }
                            : { background: t.dark ? 'rgba(34,197,94,0.18)':'#f0fdf4', color: t.dark ? '#86efac':'#15803d' }
                          }
                        >
                          {toggling === u.id ? '…' : u.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
