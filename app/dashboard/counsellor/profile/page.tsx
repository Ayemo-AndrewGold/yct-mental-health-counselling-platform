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
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CounsellorProfilePage() {
  const [user, setUser]     = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);
const [error, setError]     = useState('');

  const [form, setForm] = useState({
    full_name:       '',
    email:           '',
    title:           '',
    specialisation:  '',
    phone:           '',
    office:          '',
    bio:             '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

useEffect(() => {
  getMe().then((data) => {
    if (data) {
      setUser(data);
      setForm((prev) => ({
        ...prev,
        full_name: data.full_name ?? '',
        email:     data.email     ?? '',
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
    const payload: {
      full_name?: string;
      current_password?: string;
      new_password?: string;
    } = {
      full_name: form.full_name,
    };

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
    : 'CN';

  const inputCls = (editable: boolean) =>
    `w-full h-10 border rounded-xl px-3 text-[12px] text-gray-800 transition
    ${editable
      ? 'border-gray-200 bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
      : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'}`;

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">My Profile</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">Manage your counsellor profile</p>
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
              className="h-9 px-4 bg-teal-700 text-white rounded-xl text-[12px] font-semibold hover:bg-teal-600 disabled:opacity-60 transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-[12px] rounded-xl px-4 py-3 mb-4">
          <svg className="w-4 h-4 stroke-teal-600 shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth="2">
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

        {/* LEFT — Avatar + stats */}
        <div className="space-y-4">

          {/* Avatar card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-teal-700 flex items-center justify-center text-white text-[24px] font-bold mb-3">
              {initials}
            </div>
            <p className="text-[14px] font-semibold text-gray-900">{form.full_name || 'Counsellor'}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{form.email}</p>
            <p className="text-[11px] text-teal-700 mt-1 font-medium">{form.title || 'Counsellor'}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-gray-500">Available</span>
            </div>
          </div>

          {/* Performance stats */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Performance
            </p>
            <div className="space-y-3">
              {[
                { label: 'Active Cases',       value: '24'   },
                { label: 'Sessions This Month', value: '38'   },
                { label: 'Student Rating',      value: '4.8★' },
                { label: 'Cases Resolved',      value: '91%'  },
                { label: 'Avg. Response Time',  value: '18min'},
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">{item.label}</p>
                  <p className="text-[11px] font-semibold text-gray-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specialisations */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Specialisations
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Anxiety & Stress',
                'Depression',
                'Academic Stress',
                'Crisis Intervention',
              ].map((s) => (
                <span key={s} className="text-[10px] font-medium px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Confidentiality notice */}
          <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 stroke-teal-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <p className="text-[11px] font-semibold text-teal-700 mb-0.5">Data Protection</p>
                <p className="text-[10.5px] text-teal-700/70 leading-relaxed">
                  Your profile data is protected under NDPR 2019 and only visible to administrators.
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
                  className={inputCls(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className={inputCls(false)}
                />
                <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. Senior Counsellor"
                  className={inputCls(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. 08012345678"
                  className={inputCls(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Specialisation</label>
                <input
                  type="text"
                  value={form.specialisation}
                  onChange={(e) => update('specialisation', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. Anxiety & Stress Management"
                  className={inputCls(editing)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Office Location</label>
                <input
                  type="text"
                  value={form.office}
                  onChange={(e) => update('office', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. Student Affairs Building, Room 12"
                  className={inputCls(editing)}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
                disabled={!editing}
                placeholder="Write a short bio visible to students when booking..."
                rows={3}
                className={`w-full border rounded-xl px-3 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 resize-none transition
                  ${editing
                    ? 'border-gray-200 bg-white focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'
                    : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'}`}
              />
            </div>
          </div>

          {/* Change password */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[12px] font-semibold text-gray-700 mb-4">Change Password</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Current Password', 'New Password', 'Confirm Password'].map((label) => (
                <div key={label}>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{label}</label>
                  <input
                    type="password"
                    disabled={!editing}
                    placeholder="••••••••"
                    className={inputCls(editing)}
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

          {/* Availability settings */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-[12px] font-semibold text-gray-700 mb-4">Availability</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { day: 'Monday',    hours: '8:00 AM – 4:00 PM' },
                { day: 'Tuesday',   hours: '8:00 AM – 4:00 PM' },
                { day: 'Wednesday', hours: '8:00 AM – 12:00 PM' },
                { day: 'Thursday',  hours: '8:00 AM – 4:00 PM' },
                { day: 'Friday',    hours: '8:00 AM – 2:00 PM' },
                { day: 'Saturday',  hours: 'Not available' },
              ].map((item) => (
                <div key={item.day} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                  <p className="text-[11px] font-medium text-gray-700">{item.day}</p>
                  <p className={`text-[10.5px] ${item.hours === 'Not available' ? 'text-gray-400' : 'text-teal-700 font-medium'}`}>
                    {item.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white border border-red-100 rounded-2xl p-5">
            <p className="text-[12px] font-semibold text-red-600 mb-1">Danger Zone</p>
            <p className="text-[11px] text-gray-500 mb-3">
              Contact your administrator to deactivate or remove your account.
            </p>
            <button className="h-9 px-4 border border-red-200 text-red-600 rounded-xl text-[12px] font-medium hover:bg-red-50 transition">
              Request Account Deactivation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}