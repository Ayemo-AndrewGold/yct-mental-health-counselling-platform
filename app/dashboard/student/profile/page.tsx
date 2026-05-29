'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMe, updateProfile } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface User {
  full_name: string;
  email: string;
  role: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    department: '',
    matric_number: '',
    level: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
   getMe().then((data) => {
    if (data) {
      setUser(data);
      setForm((prev) => ({
        ...prev,
        full_name: data.full_name ?? '',
        email: data.email  ?? '',
        matric_number: data.matric_number ?? '',
        department: data.department ?? '',
        level: data.level ?? '',
      }));
    }
   });
  }, []);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError('');

    try {
      const payload:  {
        full_name?: string;
        matric_number?: string;
        department?: string;
        level?: string;
        current_password?: string;
        new_password?: string;
      } = {
        full_name: form.full_name,
        matric_number: form.matric_number,
        department: form.department,
        level: form.level,
    };
    // Only include password if filled in
    if (form.currentPassword && form.newPassword) {
      if (form.newPassword !== form.confirmPassword) {
        setError('New passwords do not match.');
        setLoading(false);
        return;
      }
      payload.current_password = form.currentPassword;
      payload.new_password     = form.newPassword;
    }

    const res = await updateProfile(payload);
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Update failed. Please try again.');
      return;
    }

        // Update cookie with new data
    Cookies.set('user', JSON.stringify(data.user), { expires: 1 });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  } catch {
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

  const initials = form.full_name
    ? form.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const inputClass = (editable: boolean) =>
    `w-full h-10 border rounded-xl px-3 text-[12px] text-gray-800 transition
    ${editable
      ? 'border-gray-200 bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10'
      : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'}`;

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">My Profile</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">Manage your personal information</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 h-9 px-4 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="h-9 px-4 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="h-9 px-4 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold hover:bg-[#2d7a3e] transition"
            >
              {loading ? 'saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[12px] rounded-xl px-4 py-3 mb-4">
          <svg className="w-4 h-4 stroke-green-600 shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Profile updated successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-[12px] rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-5">

        {/* LEFT — Avatar card */}
        <div className="space-y-4">

          {/* Avatar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[24px] font-bold mb-3">
              {initials}
            </div>
            <p className="text-[14px] font-semibold text-gray-900">{form.full_name || 'Student'}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{form.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-semibold px-2 py-[3px] rounded-full bg-[#e8f5ec] text-[#1a5c2a]">
                Student
              </span>
            </div>
          </div>

          {/* Account info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Account Info
            </p>
            <div className="space-y-3">
              {[
                { label: 'Account Status', value: 'Active', color: 'text-green-600' },
                { label: 'Member Since', value: 'May 2026' },
                { label: 'Sessions Attended', value: '3' },
                { label: 'Assessments Taken', value: '2' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">{item.label}</p>
                  <p className={`text-[11px] font-semibold ${item.color ?? 'text-gray-700'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy notice */}
          <div className="bg-[#e8f5ec] border border-[#b6dfc0] rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 stroke-[#1a5c2a] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <p className="text-[11px] font-semibold text-[#1a5c2a] mb-0.5">Data Protection</p>
                <p className="text-[10.5px] text-[#1a5c2a]/70 leading-relaxed">
                  Your data is protected under NDPR 2019. Only your assigned counsellor can access your records.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="space-y-4">

          {/* Personal info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[12px] font-semibold text-gray-700 mb-4">Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => update('full_name', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className={inputClass(false)}
                />
                <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                  Matric Number
                </label>
                <input
                  type="text"
                  value={form.matric_number}
                  onChange={(e) => update('matric_number', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. FT/ND/23/3210083"
                  className={inputClass(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. 08012345678"
                  className={inputClass(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => update('department', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. Computer Technology"
                  className={inputClass(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Level</label>
                <input
                  type="text"
                  value={form.level}
                  onChange={(e) => update('level', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. ND 1FT"
                  className={inputClass(editing)}
                />
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[12px] font-semibold text-gray-700 mb-4">Change Password</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Current Password',  field: 'currentPassword'  },
                { label: 'New Password',       field: 'newPassword'      },
                { label: 'Confirm Password',   field: 'confirmPassword'  },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">
                    {item.label}
                  </label>
                  <input
                    type="password"
                    disabled={!editing}
                    placeholder="••••••••"
                    className={inputClass(editing)}
                  />
                </div>
              ))}
            </div>
            {editing && (
              <p className="text-[10.5px] text-gray-400 mt-2">
                Leave password fields empty to keep your current password.
              </p>
            )}
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-100 rounded-2xl p-5">
            <p className="text-[12px] font-semibold text-red-600 mb-1">Danger Zone</p>
            <p className="text-[11px] text-gray-500 mb-3">
              Deleting your account is permanent and cannot be undone.
              All your session records and assessment history will be removed.
            </p>
            <button className="h-9 px-4 border border-red-200 text-red-600 rounded-xl text-[12px] font-medium hover:bg-red-50 transition">
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}