'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMe, updateProfile } from '@/lib/api';
import {
  ShieldCheck, Pencil, X, Check, AlertTriangle, Lock, User, KeyRound,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface UserData {
  full_name: string;
  email: string;
  role: string;
  matric_number?: string;
  department?: string;
  level?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Section({
  icon: Icon, title, children, isDarkMode,
}: {
  icon: React.ElementType; title: string; children: React.ReactNode; isDarkMode: boolean;
}) {
  const bg     = isDarkMode ? 'rgba(0,135,81,0.10)'  : '#f0faf4';
  const border = isDarkMode ? 'rgba(0,135,81,0.25)'  : '#b6e6cc';
  const label  = isDarkMode ? '#86efac'               : '#3B6D11';
  const iconBg = isDarkMode ? 'rgba(0,135,81,0.20)'  : 'rgba(0,135,81,0.12)';

  return (
    <div
      className="relative rounded-[20px] p-5 overflow-hidden transition-colors duration-300"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <div
        className="absolute bottom-[-24px] right-[-24px] w-[80px] h-[80px] rounded-full pointer-events-none opacity-[0.05]"
        style={{ background: '#008751' }}
      />
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
          <Icon size={14} style={{ color: '#008751' }} />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: label }}>
          {title}
        </p>
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD
// ─────────────────────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, disabled, type = 'text', placeholder, hint, isDarkMode,
}: {
  label: string; value: string;
  onChange?: (v: string) => void;
  disabled: boolean; type?: string;
  placeholder?: string; hint?: string;
  isDarkMode: boolean;
}) {
  const labelColor = isDarkMode ? '#86efac'               : '#3B6D11';
  const hintColor  = isDarkMode ? 'rgba(134,239,172,0.6)' : 'rgba(59,109,17,0.6)';

  const disabledStyle: React.CSSProperties = isDarkMode
    ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,135,81,0.25)', color: '#86efac' }
    : { background: 'rgba(0,135,81,0.05)',    border: '1px solid #b6e6cc',              color: '#3B6D11' };

  const activeStyle: React.CSSProperties = isDarkMode
    ? { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,135,81,0.35)', color: '#ffffff' }
    : { background: '#ffffff',                border: '1px solid #b6e6cc',              color: '#1a3d1f' };

  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase tracking-[0.08em] mb-1.5"
        style={{ color: labelColor }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full h-10 rounded-xl px-3.5 text-[12px] transition-all focus:outline-none"
        style={disabled ? disabledStyle : activeStyle}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = '#008751';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,135,81,0.15)';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = isDarkMode
            ? 'rgba(0,135,81,0.35)'
            : '#b6e6cc';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {hint && (
        <p className="text-[10px] mt-1" style={{ color: hintColor }}>{hint}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [user,       setUser]       = useState<UserData | null>(null);
  const [editing,    setEditing]    = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [form, setForm] = useState({
    full_name: '', email: '', department: '',
    matric_number: '', level: '', phone: '',
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  /* ── Dark mode sync ── */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDarkMode(saved === 'dark');

    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ isDarkMode: boolean }>;
      if (custom.detail?.isDarkMode !== undefined) setIsDarkMode(custom.detail.isDarkMode);
    };
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm((prev) => ({
        ...prev,
        full_name: u.full_name ?? '', email: u.email ?? '',
        matric_number: u.matric_number ?? '', department: u.department ?? '', level: u.level ?? '',
      }));
    }
    getMe().then((data) => {
      if (data) {
        setUser(data);
        setForm((prev) => ({
          ...prev,
          full_name: data.full_name ?? '', email: data.email ?? '',
          matric_number: data.matric_number ?? '', department: data.department ?? '', level: data.level ?? '',
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
      const payload: Record<string, string> = {
        full_name: form.full_name,
        matric_number: form.matric_number,
        department: form.department,
        level: form.level,
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
      if (!res.ok) { setError(data.error || 'Update failed. Please try again.'); return; }
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

  // ─── Theme tokens ────────────────────────────────────────────────────────
  const pageTitle      = isDarkMode ? '#ffffff'               : '#1a3d1f';
  const pageSubtitle   = isDarkMode ? 'rgba(255,255,255,0.50)': '#3B6D11';

  // Profile card
  const cardBg         = isDarkMode ? 'rgba(0,135,81,0.10)'  : '#f0faf4';
  const cardBorder     = isDarkMode ? 'rgba(0,135,81,0.25)'  : '#b6e6cc';
  const nameColor      = isDarkMode ? '#ffffff'               : '#1a3d1f';
  const emailColor     = isDarkMode ? '#86efac'               : '#3B6D11';
  const roleBg         = isDarkMode ? 'rgba(0,135,81,0.20)'  : 'rgba(0,135,81,0.12)';
  const roleColor      = isDarkMode ? '#4ade80'               : '#008751';
  const dividerColor   = isDarkMode ? 'rgba(0,135,81,0.22)'  : '#b6e6cc';
  const statLabelColor = isDarkMode ? '#86efac'               : '#3B6D11';
  const statValueColor = isDarkMode ? '#ffffff'               : '#1a3d1f';

  // Cancel button
  const cancelBg      = isDarkMode ? 'rgba(0,135,81,0.12)'  : '#f0faf4';
  const cancelBorder  = isDarkMode ? 'rgba(0,135,81,0.28)'  : '#b6e6cc';
  const cancelColor   = isDarkMode ? '#86efac'               : '#3B6D11';

  // Toast — success
  const toastSuccessBg     = isDarkMode ? 'rgba(0,135,81,0.15)'  : '#f0faf4';
  const toastSuccessBorder = isDarkMode ? 'rgba(0,135,81,0.30)'  : '#b6e6cc';
  const toastSuccessColor  = isDarkMode ? '#bbf7d0'               : '#1a3d1f';

  // Toast — error
  const toastErrBg     = isDarkMode ? 'rgba(226,75,74,0.15)'  : '#fdf0f0';
  const toastErrBorder = isDarkMode ? 'rgba(226,75,74,0.30)'  : '#f5bebe';
  const toastErrColor  = isDarkMode ? '#fca5a5'                : '#A32D2D';

  // Privacy notice
  const privacyBg     = isDarkMode ? 'rgba(0,135,81,0.10)'  : 'rgba(0,135,81,0.07)';
  const privacyBorder = isDarkMode ? 'rgba(0,135,81,0.22)'  : '#b6e6cc';
  const privacyTitle  = isDarkMode ? '#bbf7d0'               : '#1a3d1f';
  const privacyText   = isDarkMode ? '#86efac'               : '#3B6D11';
  const privacyIconBg = isDarkMode ? 'rgba(0,135,81,0.20)'  : 'rgba(0,135,81,0.12)';

  // Danger zone
  const dangerBg     = isDarkMode ? 'rgba(226,75,74,0.12)'  : '#fdf0f0';
  const dangerBorder = isDarkMode ? 'rgba(226,75,74,0.28)'  : '#f5bebe';
  const dangerTitle  = isDarkMode ? '#fee2e2'                : '#501313';
  const dangerText   = isDarkMode ? '#fca5a5'                : '#A32D2D';
  const dangerIconBg = isDarkMode ? 'rgba(226,75,74,0.18)'  : 'rgba(226,75,74,0.12)';
  const dangerBtnBg  = isDarkMode ? 'rgba(226,75,74,0.18)'  : 'rgba(226,75,74,0.12)';
  const dangerBtnHov = isDarkMode ? 'rgba(226,75,74,0.28)'  : 'rgba(226,75,74,0.20)';
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 py-5 pb-10 transition-colors duration-300">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[30px] font-bold" style={{ color: pageTitle }}>Settings</h2>
          <p className="text-[17px] mt-0.5" style={{ color: pageSubtitle }}>
            Manage your personal information and account preferences
          </p>
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-full text-[15px] font-bold transition-opacity hover:opacity-90"
            style={{ background: '#008751', color: '#fff' }}
          >
            <Pencil size={15} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setEditing(false); setError(''); }}
              className="h-9 px-4 rounded-full text-[15px] font-semibold transition-all"
              style={{ background: cancelBg, border: `1px solid ${cancelBorder}`, color: cancelColor }}
            >
              <X size={15} className="inline mr-1" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="h-9 px-4 rounded-full text-[15px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: '#008751' }}
            >
              {loading ? 'Saving…' : <><Check size={13} className="inline mr-1" />Save Changes</>}
            </button>
          </div>
        )}
      </div>

      {/* ── Toast — success ── */}
      {saved && (
        <div
          className="flex items-center gap-2 text-[15px] rounded-[14px] px-4 py-3 mb-4"
          style={{ background: toastSuccessBg, border: `1px solid ${toastSuccessBorder}`, color: toastSuccessColor }}
        >
          <Check size={15} style={{ color: '#008751' }} />
          Profile updated successfully.
        </div>
      )}

      {/* ── Toast — error ── */}
      {error && (
        <div
          className="flex items-center gap-2 text-[15px] rounded-[14px] px-4 py-3 mb-4"
          style={{ background: toastErrBg, border: `1px solid ${toastErrBorder}`, color: toastErrColor }}
        >
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-5">

        {/* ── LEFT — Profile card ── */}
        <div className="flex flex-col gap-4">

          {/* Avatar card */}
          <div
            className="relative rounded-[20px] p-6 flex flex-col items-center text-center overflow-hidden transition-colors duration-300"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <div
              className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: '#008751' }}
            />

            {/* Avatar */}
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white text-[30px] font-bold mb-3"
              style={{
                background: '#008751',
                border: `3px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,135,81,0.2)'}`,
              }}
            >
              {initials}
            </div>

            <p className="text-[19px] font-bold" style={{ color: nameColor }}>
              {form.full_name || 'Student'}
            </p>
            <p className="text-[14px] mt-0.5" style={{ color: emailColor }}>{form.email}</p>

            <span
              className="mt-3 text-[13px] font-bold px-3 py-[4px] rounded-full"
              style={{ background: roleBg, color: roleColor }}
            >
              Student
            </span>

            <div className="w-full h-px my-4" style={{ background: dividerColor }} />

            {/* Quick stats */}
            <div className="w-full space-y-2.5">
              {[
                { label: 'Account Status', value: 'Active', highlight: true },
                { label: 'Member Since',   value: 'May 2026' },
                { label: 'Sessions',       value: '3 completed' },
                { label: 'Assessments',    value: '2 taken' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <p className="text-[14px]" style={{ color: statLabelColor }}>{item.label}</p>
                  <p
                    className="text-[14px] font-bold"
                    style={{ color: item.highlight ? (isDarkMode ? '#4ade80' : '#008751') : statValueColor }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy notice */}
          <div
            className="rounded-[20px] p-4 flex items-start gap-3 transition-colors duration-300"
            style={{ background: privacyBg, border: `1px solid ${privacyBorder}` }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: privacyIconBg }}>
              <ShieldCheck size={15} style={{ color: '#008751' }} />
            </div>
            <div>
              <p className="text-[16px] font-bold mb-0.5" style={{ color: privacyTitle }}>
                Data Protection
              </p>
              <p className="text-[12.5px] leading-relaxed" style={{ color: privacyText }}>
                Your data is protected under NDPR 2019. Only your assigned counsellor can access your records.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Form sections ── */}
        <div className="flex flex-col gap-4">

          {/* Personal information */}
          <Section icon={User} title="Personal Information" isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Full Name"      value={form.full_name}      onChange={(v) => update('full_name', v)}      disabled={!editing} isDarkMode={isDarkMode} />
              <Field label="Email Address"  value={form.email}          disabled hint="Email cannot be changed"       isDarkMode={isDarkMode} />
              <Field label="Matric Number"  value={form.matric_number}  onChange={(v) => update('matric_number', v)}  disabled={!editing} placeholder="e.g. FT/ND/23/3210083" isDarkMode={isDarkMode} />
              <Field label="Phone Number"   value={form.phone}          onChange={(v) => update('phone', v)}          disabled={!editing} placeholder="e.g. 08012345678" type="tel" isDarkMode={isDarkMode} />
              <Field label="Department"     value={form.department}     onChange={(v) => update('department', v)}     disabled={!editing} placeholder="e.g. Computer Technology" isDarkMode={isDarkMode} />
              <Field label="Level"          value={form.level}          onChange={(v) => update('level', v)}          disabled={!editing} placeholder="e.g. ND 1FT" isDarkMode={isDarkMode} />
            </div>
          </Section>

          {/* Change password */}
          <Section icon={KeyRound} title="Change Password" isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Current Password', field: 'currentPassword' },
                { label: 'New Password',     field: 'newPassword' },
                { label: 'Confirm Password', field: 'confirmPassword' },
              ].map((item) => (
                <Field
                  key={item.field}
                  label={item.label}
                  value={form[item.field as keyof typeof form]}
                  onChange={(v) => update(item.field, v)}
                  disabled={!editing}
                  type="password"
                  placeholder="••••••••"
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            {editing && (
              <p className="text-[14px] mt-3" style={{ color: isDarkMode ? 'rgba(134,239,172,0.6)' : 'rgba(59,109,17,0.7)' }}>
                Leave password fields empty to keep your current password.
              </p>
            )}
          </Section>

          {/* Danger zone */}
          <div
            className="relative rounded-[20px] p-5 overflow-hidden transition-colors duration-300"
            style={{ background: dangerBg, border: `1px solid ${dangerBorder}` }}
          >
            <div
              className="absolute bottom-[-24px] right-[-24px] w-[80px] h-[80px] rounded-full pointer-events-none opacity-[0.06]"
              style={{ background: '#E24B4A' }}
            />
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: dangerIconBg }}
              >
                <AlertTriangle size={15} style={{ color: isDarkMode ? '#f87171' : '#E24B4A' }} />
              </div>
              <div className="flex-1">
                <p className="text-[20px] font-bold mb-1" style={{ color: dangerTitle }}>
                  Danger Zone
                </p>
                <p className="text-[15px] leading-relaxed mb-3" style={{ color: dangerText }}>
                  Deleting your account is permanent and cannot be undone. All your session records
                  and assessment history will be removed.
                </p>
                <button
                  className="h-8 px-4 rounded-full text-[15px] font-bold transition-all"
                  style={{ background: dangerBtnBg, border: `1px solid ${dangerBorder}`, color: dangerText }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = dangerBtnHov)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = dangerBtnBg)}
                >
                  Delete My Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}