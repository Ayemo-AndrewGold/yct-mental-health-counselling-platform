'use client';

import { useState, useEffect } from 'react';
import { getCounsellorCases, updateCounsellorCase } from '@/lib/api';

type Severity   = 'High' | 'Medium' | 'Low';
type CaseStatus = 'Urgent' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';

interface Case {
  id: string | number;
  case_id?: string;          // from backend
  caseId?: string;           // normalised
  student_name?: string;     // from backend
  studentName?: string;      // normalised
  is_anonymous?: boolean;
  isAnonymous?: boolean;
  initials?: string;
  department?: string;
  level?: string;
  issue_type?: string;       // from backend
  issueType?: string;        // normalised
  severity: Severity;
  opened_date?: string;      // from backend
  openedDate?: string;       // normalised
  status: CaseStatus;
  phq9_score?: number;       // from backend
  phq9?: number;             // normalised
  case_notes?: string;       // from backend
  notes?: string;            // normalised
  session_count?: number;    // from backend
  sessions?: number;         // normalised
}

// ─── Normalise whatever shape the backend sends ───────────────────────────────
function normalise(raw: Case): Case {
  const name = raw.student_name ?? raw.studentName ?? 'Unknown';
  return {
    ...raw,
    studentName: name,
    caseId:      raw.case_id    ?? raw.caseId    ?? `#CASE-${raw.id}`,
    isAnonymous: raw.is_anonymous ?? raw.isAnonymous ?? false,
    initials:    raw.initials   ?? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    department:  raw.department  ?? '',
    level:       raw.level       ?? '',
    issueType:   raw.issue_type  ?? raw.issueType ?? 'General',
    openedDate:  raw.opened_date ?? raw.openedDate ?? '',
    phq9:        raw.phq9_score  ?? raw.phq9       ?? 0,
    notes:       raw.case_notes  ?? raw.notes      ?? '',
    sessions:    raw.session_count ?? raw.sessions ?? 0,
  };
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
    expandBg:      dark ? 'rgba(0,135,81,0.10)'    : '#f0fdf4',
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

function SeverityBadge({ severity, dark }: { severity: Severity; dark: boolean }) {
  const map: Record<Severity, { bg: string; text: string; dot: string }> = {
    High:   { bg: dark ? 'rgba(239,68,68,0.18)'  :'#fef2f2', text: dark ? '#fca5a5':'#b91c1c', dot: '#ef4444'  },
    Medium: { bg: dark ? 'rgba(251,191,36,0.18)' :'#fffbeb', text: dark ? '#fde68a':'#b45309', dot: '#f59e0b'  },
    Low:    { bg: dark ? 'rgba(34,197,94,0.18)'  :'#f0fdf4', text: dark ? '#86efac':'#15803d', dot: '#22c55e'  },
  };
  const { bg, text, dot } = map[severity] ?? map['Low'];
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1 rounded-md font-[lexend]"
      style={{ background: bg, color: text }}>
      <span className="w-2 h-2 rounded-full" style={{ background: dot }} />
      {severity}
    </span>
  );
}

function CaseStatusBadge({ status, dark }: { status: CaseStatus; dark: boolean }) {
  const map: Record<CaseStatus, { bg: string; text: string }> = {
    Urgent:        { bg: dark ? 'rgba(239,68,68,0.18)'  :'#fef2f2', text: dark ? '#fca5a5':'#b91c1c' },
    'In Progress': { bg: dark ? 'rgba(251,191,36,0.18)' :'#fffbeb', text: dark ? '#fde68a':'#b45309' },
    Pending:       { bg: dark ? 'rgba(59,130,246,0.18)' :'#eff6ff', text: dark ? '#93c5fd':'#1d4ed8' },
    Resolved:      { bg: dark ? 'rgba(34,197,94,0.18)'  :'#f0fdf4', text: dark ? '#86efac':'#15803d' },
    Closed:        { bg: dark ? 'rgba(255,255,255,0.08)':'#f3f4f6', text: dark ? 'rgba(255,255,255,0.45)':'#6b7280' },
  };
  const { bg, text } = map[status] ?? map['Pending'];
  return (
    <span className="text-[13px] font-semibold px-3 py-1 rounded-full font-[lexend]"
      style={{ background: bg, color: text }}>{status}</span>
  );
}

function CaseCard({ c, t, onUpdate }: {
  c: Case; t: ReturnType<typeof useTheme>;
  onUpdate: (id: string | number, status: CaseStatus) => void;
}) {
  const [expanded,  setExpanded]  = useState(false);
  const [updating,  setUpdating]  = useState(false);

  const phqColor = (c.phq9 ?? 0) >= 20 ? '#ef4444'
    : (c.phq9 ?? 0) >= 10 ? (t.dark ? '#fde68a' : '#b45309')
    : (t.dark ? '#86efac' : '#15803d');

  const btnBase = 'h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors disabled:opacity-50';

  async function handleResolve() {
    setUpdating(true);
    await onUpdate(c.id, 'Resolved');
    setUpdating(false);
  }

  async function handleUpdate() {
    setUpdating(true);
    await onUpdate(c.id, c.status === 'Urgent' ? 'In Progress' : c.status);
    setUpdating(false);
  }

  return (
    <div className="rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
      style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      <div className="p-6">
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 border-2"
            style={c.isAnonymous
              ? { background: t.dark ? 'rgba(251,191,36,0.18)':'#fffbeb', color: t.dark ? '#fde68a':'#b45309', borderColor: t.dark ? 'rgba(251,191,36,0.30)':'#fde68a' }
              : { background: t.greenBg, color: t.greenText, borderColor: t.greenBorder }
            }>
            {c.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                {c.studentName}
              </p>
              <span className="text-[12px] font-mono" style={{ color: t.textMuted }}>{c.caseId}</span>
              <SeverityBadge severity={c.severity} dark={t.dark} />
              <CaseStatusBadge status={c.status} dark={t.dark} />
            </div>
            <p className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>
              {c.isAnonymous ? 'Anonymous session' : [c.department, c.level].filter(Boolean).join(' · ')}
            </p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>{c.issueType}</span>
              {(c.phq9 ?? 0) > 0 && (
                <>
                  <span style={{ color: t.textMuted }}>·</span>
                  <span className="text-[14px] font-bold font-[lexend]" style={{ color: phqColor }}>
                    PHQ-9: {c.phq9}
                  </span>
                </>
              )}
              {(c.sessions ?? 0) > 0 && (
                <>
                  <span style={{ color: t.textMuted }}>·</span>
                  <span className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>{c.sessions} sessions</span>
                </>
              )}
              {c.openedDate && (
                <>
                  <span style={{ color: t.textMuted }}>·</span>
                  <span className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>Opened {c.openedDate}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button onClick={() => setExpanded(!expanded)} className={btnBase}
              style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: 'transparent' }}>
              {expanded ? 'Hide Notes' : 'View Notes'}
            </button>
            {(c.status === 'Urgent' || c.status === 'In Progress') && (
              <button onClick={handleUpdate} disabled={updating} className={btnBase}
                style={{ background: '#008751', color: '#ffffff' }}>
                Update
              </button>
            )}
            {c.status === 'In Progress' && (
              <button onClick={handleResolve} disabled={updating} className={btnBase}
                style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                Resolve
              </button>
            )}
          </div>
        </div>

        {/* Expanded notes */}
        {expanded && (
          <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${t.divider}` }}>
            <p className="text-[12px] font-bold uppercase tracking-wider mb-2 font-[lexend]"
              style={{ color: t.textMuted }}>Case Notes</p>
            {c.notes ? (
              <p className="text-[14px] leading-relaxed font-[lexend]"
                style={{ color: t.textSecondary }}>{c.notes}</p>
            ) : (
              <p className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>
                No notes recorded yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function Skeleton({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <div className="rounded-2xl p-6 animate-pulse" style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-48 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
          <div className="h-3 w-72 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.07)':'#f3f4f6' }} />
          <div className="h-3 w-56 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.07)':'#f3f4f6' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CounsellorCasesPage() {
  const t = useTheme();
  const [cases,    setCases]    = useState<Case[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');
  const [severity, setSeverity] = useState('All Severity');
  const [status,   setStatus]   = useState('All Status');

  useEffect(() => {
    getCounsellorCases()
      .then(data => {
        setCases(Array.isArray(data) ? data.map(normalise) : []);
      })
      .catch(() => setError('Could not load cases. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdate(id: string | number, newStatus: CaseStatus) {
    const res = await updateCounsellorCase(id, { status: newStatus });
    if (res.ok) {
      setCases(prev => prev.map(c => String(c.id) === String(id) ? { ...c, status: newStatus } : c));
    }
  }

  const filtered = cases.filter(c => {
    const q = search.toLowerCase();
    return (
      (!q
        || (c.studentName ?? '').toLowerCase().includes(q)
        || (c.caseId ?? '').toLowerCase().includes(q)
        || (c.issueType ?? '').toLowerCase().includes(q))
      && (severity === 'All Severity' || c.severity === severity)
      && (status   === 'All Status'   || c.status   === status)
    );
  });

  const highCount     = cases.filter(c => c.severity === 'High').length;
  const resolvedCount = cases.filter(c => c.status === 'Resolved').length;
  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Header ── */}
      <div>
        <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
          My Cases
        </h2>
        <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
          {highCount} high severity · {resolvedCount} resolved
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Cases', value: String(cases.length),                                          accent: 'bg-[#008751]' },
          { label: 'Urgent',      value: String(cases.filter(c => c.status === 'Urgent').length),       accent: 'bg-red-500'   },
          { label: 'In Progress', value: String(cases.filter(c => c.status === 'In Progress').length),  accent: 'bg-amber-400' },
          { label: 'Resolved',    value: String(resolvedCount),                                         accent: 'bg-green-500' },
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
            placeholder="Search by name, case ID or issue..."
            className={`${inputCls} w-full pl-10`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={severity} onChange={e => setSeverity(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Severity','High','Medium','Low'].map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Status','Urgent','In Progress','Pending','Resolved','Closed'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-2xl px-5 py-4 text-[14px] font-[lexend]"
          style={{ background: t.dark ? 'rgba(239,68,68,0.15)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c', border: `1px solid ${t.dark ? 'rgba(239,68,68,0.30)':'#fecaca'}` }}>
          {error}
        </div>
      )}

      {/* ── List ── */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} t={t} />)
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[15px] font-[lexend]" style={{ color: t.textMuted }}>
              {cases.length === 0 ? 'No cases assigned yet.' : 'No cases match your filters.'}
            </p>
          </div>
        ) : (
          filtered.map(c => (
            <CaseCard key={c.id} c={c} t={t} onUpdate={handleUpdate} />
          ))
        )}
      </div>
    </div>
  );
}
