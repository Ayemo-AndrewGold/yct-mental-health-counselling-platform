'use client';

import { useState, useEffect } from 'react';
import { getAdminCounsellors, fetchWithAuth } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type CounsellorStatus       = 'Active' | 'Inactive';
type CounsellorAvailability = 'Available' | 'In Session' | 'Offline';

interface Counsellor {
  id: number;
  full_name: string;
  email: string;
  date_joined: string;
  is_active: boolean;
}



// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminCounsellorsPage() {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatus]     = useState('All Status');
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({
    full_name: '', email: '', password: '',
  });
  const [creating, setCreating]       = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

   useEffect(() => {
    getAdminCounsellors().then((data) => {
      setCounsellors(data);
      setLoading(false);
    });
  }, []);

  const filtered = counsellors.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All Status' ||
      (statusFilter === 'Active' ? c.is_active : !c.is_active);
    return matchSearch && matchStatus;
  });

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
          body: JSON.stringify({
            full_name: form.full_name,
            email: form.email,
            password: form.password,
            role: 'counsellor',
          }),
        });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || 'Failed to create counsellor.');
        return;
      }
      setCreateSuccess(`${form.full_name} created. Share these credentials: Email: ${form.email} · Password: ${generatedPassword}`);
      setForm({ full_name: '', email: '', password: '' });
      setShowModal(false);
      // Refresh list
      getAdminCounsellors().then(setCounsellors);
      setTimeout(() => setCreateSuccess(''), 3000);
    } catch {
      setCreateError('Something went wrong.');
    } finally {
      setCreating(false);
    }
  }

  function generatePassword() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

function openModal() {
  const pwd = generatePassword();
  setForm({ full_name: '', email: '', password: pwd });
  setGeneratedPassword(pwd);
  setShowModal(true);
}

const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-1 focus:ring-[#1a5c2a]/10 transition';
const modalInputCls = 'w-full h-10 border border-gray-200 rounded-xl px-3 text-[12px] text-gray-800 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition';

  return (
    <main className="px-6 py-5 space-y-5 pb-10">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Counsellors</h2>
          <p className="text-[12px] text-gray-500 mt-1">{counsellors.filter(c => c.is_active).length} active .{counsellors.length} total</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors"
        >
          + Add Counsellor
        </button>
      </div>

            {/* Success message */}
        {createSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[12px] rounded-xl px-4 py-3">
            <svg className="w-4 h-4 stroke-green-600 shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {createSuccess}
          </div>
        )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: String(counsellors.length), accent: 'bg-[#1a5c2a]'},
          { label: 'Active', value: String(counsellors.filter(c => c.is_active).length), accent: 'bg-[#f5a623]'},
          { label: 'Inactive', value: String(counsellors.filter(c => !c.is_active).length), accent: 'bg-blue-500'},
          { label: 'Showing', value: String(filtered.length), accent: 'bg-red-500'},
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
        <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {['All Status', 'Active', 'Inactive'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Counsellor', 'Email', 'Joined', 'Status', ''].map((h) => (
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
                  <td colSpan={5} className="px-4 py-3">
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
            ) : filtered.map((c) => {
              const initials = c.full_name
                .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              return (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {initials}
                      </div>
                      <p className="text-[12px] font-semibold text-gray-900">{c.full_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-[12px] text-gray-400">{c.date_joined}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full
                      ${c.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-6 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10.5px] font-medium rounded-md transition-colors">
                        Edit
                      </button>
                      <button className="h-6 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-medium rounded-md transition-colors">
                        {c.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="text-[12px] font-medium text-gray-500">No counsellors found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters or add a new counsellor</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

{/* Add Counsellor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-[14px] font-semibold text-gray-900">Add New Counsellor</h3>
              <button
                onClick={() => { setShowModal(false); setCreateError(''); setGeneratedPassword(''); }}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl px-4 py-3">
                  {createError}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Full Name</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="e.g. Mr. Victor Alomaja"
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. counsellor@yabatech.edu.ng"
                  className={modalInputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                  Generated Password
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                    className={modalInputCls}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const pwd = generatePassword();
                      setForm(prev => ({ ...prev, password: pwd }));
                      setGeneratedPassword(pwd);
                    }}
                    className="h-10 px-3 border border-gray-200 rounded-xl text-[11px] text-gray-600 hover:bg-gray-50 transition shrink-0"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Share this password with the counsellor so they can login.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => { setShowModal(false); setCreateError(''); }}
                className="h-9 px-4 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="h-9 px-4 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold hover:bg-[#2d7a3e] disabled:opacity-60 transition"
              >
                {creating ? 'Creating...' : 'Create Counsellor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}