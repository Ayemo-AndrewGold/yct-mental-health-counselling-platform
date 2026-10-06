'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMe, updateProfile, getCounsellorStats } from '@/lib/api';

interface User  { full_name: string; email: string }
interface Stats {
  total_students: number;
  total_appointments: number;
  completed_appointments: number;
  satisfaction_rating?: number;
  cases_resolved_pct?: number;
  avg_response_time_min?: number;
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
    pageBg:        'transparent',
    cardBg:        dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    cardBorder:    dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
    divider:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBgDis:    dark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    inputText:     dark ? '#ffffff'                : '#111827',
    inputTextDis:  dark ? 'rgba(255,255,255,0.35)' : '#9ca3af',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    noticeBg:      dark ? 'rgba(0,135,81,0.12)'    : '#f0fdf4',
    noticeBorder:  dark ? 'rgba(0,135,81,0.30)'    : '#bbf7d0',
    noticeText:    dark ? '#86efac'                : '#15803d',
    dangerBg:      dark ? 'rgba(239,68,68,0.08)'   : '#fff5f5',
    dangerBorder:  dark ? 'rgba(239,68,68,0.25)'   : '#fecaca',
  };
}

export default function CounsellorProfilePage() {
  const t = useTheme();

  const [user,    setUser]    = useState<User | null>(null);
  const [stats,   setStats]   = useState<Stats | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

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
    // Load user profile and stats in parallel
    Promise.all([getMe(), getCounsellorStats()]).then(([userData, statsData]) => {
      if (userData) {
        setUser(userData);
        setForm(prev => ({
          ...prev,
          full_name:      userData.full_name ?? '',
          email:          userData.email     ?? '',
          title:          userData.title     ?? '',
          specialisation: userData.specialisation ?? '',
          phone:          userData.phone     ?? '',
          office:         userData.office    ?? '',
          bio:            userData.bio       ?? '',
        }));
      }
      if (statsData) setStats(statsData);
    });
  }, []);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setLoading(true);
    setError('');
    try {
      const payload: Record<string, string | undefined> = {
        full_name:      form.full_name,
        title:          form.title      || undefined,
        specialisation: form.specialisation || undefined,
        phone:          form.phone      || undefined,
        office:         form.office     || undefined,
        bio:            form.bio        || undefined,
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

      const res  = await updateProfile(payload);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.detail || 'Update failed. Please try again.');
        return;
      }

      Cookies.set('user', JSON.stringify(data.user ?? data), { expires: 1 });
      setSaved(true);
      setEditing(false);
      setForm(prev => ({ ...prev, currentPassword:'', newPassword:'', confirmPassword:'' }));
      setTimeout(() => setSaved(false), 3500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const initials = form.full_name
    ? form.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CN';

  // Derive performance values from live stats
  const activeCases     = stats?.total_students         ?? null;
  const sessionCount    = stats?.total_appointments     ?? null;
  const rating          = stats?.satisfaction_rating    ?? null;
  const resolvedPct     = stats?.cases_resolved_pct     ?? null;
  const avgResponse     = stats?.avg_response_time_min  ?? null;

  const perfItems = [
    { label: 'Active Cases',        value: activeCases   != null ? String(activeCases)         : '—' },
    { label: 'Sessions This Month', value: sessionCount  != null ? String(sessionCount)         : '—' },
    { label: 'Student Rating',      value: rating        != null ? `${rating}★`                : '—' },
    { label: 'Cases Resolved',      value: resolvedPct   != null ? `${resolvedPct}%`            : '—' },
    { label: 'Avg. Response Time',  value: avgResponse   != null ? `${avgResponse}min`          : '—' },
  ];

  const inputCls = (editable: boolean) =>
    `w-full h-12 rounded-xl px-4 text-[15px] font-[lexend] transition focus:outline-none`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 font-[lexend]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            My Profile
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>Manage your counsellor profile</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 h-11 px-5 rounded-xl text-[15px] font-semibold transition"
            style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.cardBg }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setError(''); }}
              className="h-11 px-5 rounded-xl text-[15px] font-semibold transition"
              style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.cardBg }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              className="h-11 px-5 rounded-xl text-[15px] font-semibold transition disabled:opacity-60"
              style={{ background: '#008751', color: '#ffffff' }}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Toasts */}
      {saved && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-5 text-[14px] font-[lexend]"
          style={{ background: t.noticeBg, border: `1px solid ${t.noticeBorder}`, color: t.noticeText }}>
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Profile updated successfully.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-5 text-[14px] font-[lexend]"
          style={{ background: t.dangerBg, border: `1px solid ${t.dangerBorder}`, color: t.dark ? '#fca5a5' : '#b91c1c' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-5">

        {/* ── LEFT panel ── */}
        <div className="space-y-4">

          {/* Avatar card */}
          <div className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-[26px] font-bold mb-4"
              style={{ background: 'linear-gradient(135deg, #1a5c2a, #008751)' }}>
              {initials}
            </div>
            <p className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>
              {form.full_name || 'Counsellor'}
            </p>
            <p className="text-[14px] mt-0.5" style={{ color: t.textMuted }}>{form.email}</p>
            <p className="text-[14px] mt-1 font-medium" style={{ color: t.greenText }}>
              {form.title || 'YCT Counsellor'}
            </p>
            <div className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full"
              style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[13px] font-medium" style={{ color: t.greenText }}>Available</span>
            </div>
          </div>

          {/* Performance stats — from real API */}
          <div className="rounded-2xl p-5"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[12px] font-bold uppercase tracking-wider mb-4 font-[lexend]"
              style={{ color: t.textMuted }}>Performance</p>
            <div className="space-y-3">
              {perfItems.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{item.label}</p>
                  <p className="text-[15px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specialisations */}
          <div className="rounded-2xl p-5" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[12px] font-bold uppercase tracking-wider mb-4 font-[lexend]"
              style={{ color: t.textMuted }}>Specialisations</p>
            <div className="flex flex-wrap gap-2">
              {(form.specialisation
                ? form.specialisation.split(',').map(s => s.trim()).filter(Boolean)
                : ['Anxiety & Stress', 'Depression', 'Academic Stress', 'Crisis Intervention']
              ).map(s => (
                <span key={s} className="text-[13px] font-medium px-3 py-1 rounded-full font-[lexend]"
                  style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Data protection notice */}
          <div className="rounded-2xl p-5 flex items-start gap-3"
            style={{ background: t.noticeBg, border: `1px solid ${t.noticeBorder}` }}>
            <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: t.noticeText }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div>
              <p className="text-[14px] font-semibold mb-1 font-[lexend]" style={{ color: t.noticeText }}>Data Protection</p>
              <p className="text-[13px] leading-relaxed font-[lexend]" style={{ color: t.noticeText }}>
                Your profile data is protected under NDPR 2019 and only visible to administrators.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT panel ── */}
        <div className="space-y-5">

          {/* Personal info */}
          <div className="rounded-2xl p-6" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[15px] font-bold mb-5 font-[syne]" style={{ color: t.textPrimary }}>Personal Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {[
                { label: 'Full Name',       field: 'full_name',      type: 'text',  ph: '',                             editable: true  },
                { label: 'Email Address',   field: 'email',          type: 'email', ph: '',                             editable: false, note: 'Email cannot be changed' },
                { label: 'Job Title',       field: 'title',          type: 'text',  ph: 'e.g. Senior Counsellor',       editable: true  },
                { label: 'Phone Number',    field: 'phone',          type: 'tel',   ph: 'e.g. 08012345678',             editable: true  },
                { label: 'Specialisation',  field: 'specialisation', type: 'text',  ph: 'Comma-separated, e.g. Anxiety, Stress', editable: true },
                { label: 'Office Location', field: 'office',         type: 'text',  ph: 'e.g. Student Affairs, Room 12',editable: true  },
              ].map(({ label, field, type, ph, editable, note }) => (
                <div key={field}>
                  <label className="block text-[13px] font-semibold mb-2 font-[lexend]"
                    style={{ color: t.textSecondary }}>{label}</label>
                  <input
                    type={type}
                    value={(form as Record<string, string>)[field]}
                    onChange={e => update(field, e.target.value)}
                    disabled={!editing || !editable}
                    placeholder={ph}
                    className={inputCls(editing && editable)}
                    style={{
                      background:  (!editing || !editable) ? t.inputBgDis : t.inputBg,
                      border:      `1px solid ${t.inputBorder}`,
                      color:       (!editing || !editable) ? t.inputTextDis : t.inputText,
                      cursor:      (!editing || !editable) ? 'not-allowed' : 'text',
                    }}
                  />
                  {note && (
                    <p className="text-[12px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>{note}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Bio */}
            <div className="mt-5">
              <label className="block text-[13px] font-semibold mb-2 font-[lexend]"
                style={{ color: t.textSecondary }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => update('bio', e.target.value)}
                disabled={!editing}
                placeholder="Write a short bio visible to students when booking..."
                rows={3}
                className="w-full rounded-xl px-4 py-3.5 text-[15px] font-[lexend] focus:outline-none resize-none transition"
                style={{
                  background: !editing ? t.inputBgDis : t.inputBg,
                  border:     `1px solid ${t.inputBorder}`,
                  color:      !editing ? t.inputTextDis : t.inputText,
                  cursor:     !editing ? 'not-allowed' : 'text',
                }}
              />
            </div>
          </div>

          {/* Change password */}
          <div className="rounded-2xl p-6" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[15px] font-bold mb-5 font-[syne]" style={{ color: t.textPrimary }}>Change Password</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: 'Current Password', field: 'currentPassword' },
                { label: 'New Password',     field: 'newPassword'     },
                { label: 'Confirm Password', field: 'confirmPassword' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className="block text-[13px] font-semibold mb-2 font-[lexend]"
                    style={{ color: t.textSecondary }}>{label}</label>
                  <input
                    type="password"
                    value={(form as Record<string, string>)[field]}
                    onChange={e => update(field, e.target.value)}
                    disabled={!editing}
                    placeholder="••••••••"
                    className={inputCls(editing)}
                    style={{
                      background: !editing ? t.inputBgDis : t.inputBg,
                      border:     `1px solid ${t.inputBorder}`,
                      color:      !editing ? t.inputTextDis : t.inputText,
                      cursor:     !editing ? 'not-allowed' : 'text',
                    }}
                  />
                </div>
              ))}
            </div>
            {editing && (
              <p className="text-[13px] mt-3 font-[lexend]" style={{ color: t.textMuted }}>
                Leave password fields empty to keep your current password.
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="rounded-2xl p-6" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[15px] font-bold mb-5 font-[syne]" style={{ color: t.textPrimary }}>Availability</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { day: 'Monday',    hours: '8:00 AM – 4:00 PM'  },
                { day: 'Tuesday',   hours: '8:00 AM – 4:00 PM'  },
                { day: 'Wednesday', hours: '8:00 AM – 12:00 PM' },
                { day: 'Thursday',  hours: '8:00 AM – 4:00 PM'  },
                { day: 'Friday',    hours: '8:00 AM – 2:00 PM'  },
                { day: 'Saturday',  hours: 'Not available'       },
              ].map(item => (
                <div key={item.day} className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: t.dark ? 'rgba(255,255,255,0.04)' : '#f9fafb', border: `1px solid ${t.cardBorder}` }}>
                  <p className="text-[14px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>{item.day}</p>
                  <p className="text-[13px] font-medium font-[lexend]"
                    style={{ color: item.hours === 'Not available' ? t.textMuted : t.greenText }}>
                    {item.hours}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl p-6"
            style={{ background: t.dangerBg, border: `1px solid ${t.dangerBorder}` }}>
            <p className="text-[15px] font-bold mb-1 font-[syne]"
              style={{ color: t.dark ? '#fca5a5' : '#b91c1c' }}>Danger Zone</p>
            <p className="text-[14px] mb-4 font-[lexend]" style={{ color: t.textMuted }}>
              Contact your administrator to deactivate or remove your account.
            </p>
            <button className="h-11 px-5 rounded-xl text-[14px] font-semibold font-[lexend] transition"
              style={{ border: `1px solid ${t.dangerBorder}`, color: t.dark ? '#fca5a5' : '#b91c1c', background: 'transparent' }}>
              Request Account Deactivation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
