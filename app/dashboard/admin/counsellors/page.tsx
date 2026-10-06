'use client';

import { useState, useEffect } from 'react';
import { getAdminCounsellors, fetchWithAuth, toggleUserStatus } from '@/lib/api';

interface Counsellor {
  id: number;
  full_name: string;
  email: string;
  date_joined: string;
  is_active: boolean;
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
    modalBg:       dark ? '#0d1f0d'                : '#ffffff',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    inputText:     dark ? '#ffffff'                : '#111827',
    amberBg:       dark ? 'rgba(245,166,35,0.20)'  : '#fffbeb',
    amberBorder:   dark ? 'rgba(245,166,35,0.35)'  : '#fde68a',
    amberText:     dark ? '#fde68a'                : '#92400e',
  };
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminCounsellorsPage() {
  const t = useTheme();

  const [counsellors,       setCounsellors]       = useState<Counsellor[]>([]);
  const [loading,           setLoading]           = useState(true);
  const [toggling,          setToggling]          = useState<number | null>(null);
  const [search,            setSearch]            = useState('');
  const [statusFilter,      setStatus]            = useState('All Status');
  const [showModal,         setShowModal]         = useState(false);
  const [form,              setForm]              = useState({ full_name: '', email: '', password: '' });
  const [creating,          setCreating]          = useState(false);
  const [createError,       setCreateError]       = useState('');
  const [createSuccess,     setCreateSuccess]     = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    getAdminCounsellors().then(data => { setCounsellors(data); setLoading(false); });
  }, []);

  async function handleToggle(c: Counsellor) {
    setToggling(c.id);
    const res = await toggleUserStatus(c.id, !c.is_active);
    if (res.ok) {
      setCounsellors(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
    }
    setToggling(null);
  }

  async function handleCreate() {
    if (!form.full_name || !form.email || !form.password) {
      setCreateError('All fields are required.');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const res = await fetchWithAuth('/create-counsellor/', {
        method: 'POST',
        body: JSON.stringify({ full_name: form.full_name, email: form.email, password: form.password, role: 'counsellor' }),
      });
      const data = await res.json();
      if (!res.ok) { setCreateError(data.error || 'Failed to create counsellor.'); return; }
      setCreateSuccess(`${form.full_name} created. Share credentials — Email: ${form.email} · Password: ${generatedPassword}`);
      setForm({ full_name: '', email: '', password: '' });
      setShowModal(false);
      getAdminCounsellors().then(setCounsellors);
      setTimeout(() => setCreateSuccess(''), 5000);
    } catch {
      setCreateError('Something went wrong.');
    } finally {
      setCreating(false);
    }
  }

  function generatePassword() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  function openModal() {
    const pwd = generatePassword();
    setForm({ full_name: '', email: '', password: pwd });
    setGeneratedPassword(pwd);
    setShowModal(true);
  }

  const filtered = counsellors.filter(c => {
    const q = search.toLowerCase();
    return (
      (!q || c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      && (statusFilter === 'All Status' || (statusFilter === 'Active' ? c.is_active : !c.is_active))
    );
  });

  const inputCls  = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;
  const mInputCls = `w-full h-12 rounded-xl px-4 text-[15px] font-[lexend] focus:outline-none transition`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            Counsellors
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
            {counsellors.filter(c => c.is_active).length} active · {counsellors.length} total
          </p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 h-11 px-5 rounded-xl text-[15px] font-semibold transition"
          style={{ background: '#1a5c2a', color: '#ffffff' }}>
          + Add Counsellor
        </button>
      </div>

      {/* ── Success toast ── */}
      {createSuccess && (
        <div className="flex items-start gap-3 rounded-2xl px-5 py-4 text-[14px] font-[lexend]"
          style={{
            background: t.dark ? 'rgba(34,197,94,0.15)' : '#f0fdf4',
            border: `1px solid ${t.dark ? 'rgba(34,197,94,0.30)' : '#bbf7d0'}`,
            color: t.dark ? '#86efac' : '#15803d',
          }}>
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {createSuccess}
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: String(counsellors.length),                                 accent: 'bg-[#1a5c2a]' },
          { label: 'Active',   value: String(counsellors.filter(c => c.is_active).length),        accent: 'bg-amber-400' },
          { label: 'Inactive', value: String(counsellors.filter(c => !c.is_active).length),       accent: 'bg-blue-500'  },
          { label: 'Showing',  value: String(filtered.length),                                    accent: 'bg-red-500'   },
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
            placeholder="Search counsellors..."
            className={`${inputCls} w-full pl-10`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Status', 'Active', 'Inactive'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                {['Counsellor', 'Email', 'Joined', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider font-[lexend]"
                    style={{ color: t.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.divider}` }}>
                    <td colSpan={5} className="px-5 py-4">
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
              ) : filtered.map(c => {
                const initials = c.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={c.id}
                    style={{ borderBottom: `1px solid ${t.divider}` }}
                    className="group transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = t.rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
                          style={{ background: t.amberBg, color: t.amberText, border: `1px solid ${t.amberBorder}` }}>
                          {initials}
                        </div>
                        <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                          {c.full_name}
                        </p>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{c.email}</span>
                    </td>
                    {/* Joined */}
                    <td className="px-5 py-4">
                      <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{c.date_joined}</span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
                        style={c.is_active
                          ? { background: t.dark ? 'rgba(34,197,94,0.18)' : '#f0fdf4', color: t.dark ? '#86efac' : '#15803d' }
                          : { background: t.dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6', color: t.textMuted }
                        }>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggle(c)}
                          disabled={toggling === c.id}
                          className="h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors disabled:opacity-50"
                          style={c.is_active
                            ? { background: t.dark ? 'rgba(239,68,68,0.18)' : '#fef2f2', color: t.dark ? '#fca5a5' : '#b91c1c' }
                            : { background: t.dark ? 'rgba(34,197,94,0.18)' : '#f0fdf4', color: t.dark ? '#86efac' : '#15803d' }
                          }
                        >
                          {toggling === c.id ? '…' : c.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                      No counsellors found
                    </p>
                    <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                      Try adjusting your filters or add a new counsellor
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Counsellor Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            style={{ background: t.modalBg, border: `1px solid ${t.cardBorder}` }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: `1px solid ${t.divider}` }}>
              <h3 className="text-[18px] font-bold font-[syne]" style={{ color: t.textPrimary }}>
                Add New Counsellor
              </h3>
              <button
                onClick={() => { setShowModal(false); setCreateError(''); setGeneratedPassword(''); }}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition"
                style={{ background: t.dark ? 'rgba(255,255,255,0.08)' : '#f3f4f6' }}
              >
                <svg className="w-4 h-4" style={{ color: t.textMuted }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-5">
              {createError && (
                <div className="rounded-xl px-4 py-3 text-[14px] font-[lexend]"
                  style={{
                    background: t.dark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                    color: t.dark ? '#fca5a5' : '#b91c1c',
                    border: `1px solid ${t.dark ? 'rgba(239,68,68,0.30)' : '#fecaca'}`,
                  }}>
                  {createError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[13px] font-semibold mb-2 font-[lexend]" style={{ color: t.textSecondary }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="e.g. Mr. Victor Alomaja"
                  className={mInputCls}
                  style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold mb-2 font-[lexend]" style={{ color: t.textSecondary }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. counsellor@yabatech.edu.ng"
                  className={mInputCls}
                  style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}
                />
              </div>

              {/* Generated password */}
              <div>
                <label className="block text-[13px] font-semibold mb-2 font-[lexend]" style={{ color: t.textSecondary }}>
                  Generated Password
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    className={`${mInputCls} flex-1`}
                    style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const pwd = generatePassword();
                      setForm(prev => ({ ...prev, password: pwd }));
                      setGeneratedPassword(pwd);
                    }}
                    className="h-12 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition shrink-0"
                    style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.dark ? 'rgba(255,255,255,0.06)' : '#f9fafb' }}
                  >
                    Regen
                  </button>
                </div>
                <p className="text-[12px] mt-1.5 font-[lexend]" style={{ color: t.textMuted }}>
                  Share this password with the counsellor to allow them to login.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4"
              style={{ borderTop: `1px solid ${t.divider}` }}>
              <button
                onClick={() => { setShowModal(false); setCreateError(''); }}
                className="h-11 px-5 rounded-xl text-[14px] font-semibold font-[lexend] transition"
                style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="h-11 px-5 rounded-xl text-[14px] font-semibold font-[lexend] transition disabled:opacity-60"
                style={{ background: '#1a5c2a', color: '#ffffff' }}
              >
                {creating ? 'Creating…' : 'Create Counsellor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
