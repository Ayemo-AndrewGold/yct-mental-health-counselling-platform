'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAppointments, cancelAppointment } from '@/lib/api';
import { Plus, Clock } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type SessionStatus     = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type ActualSessionType = 'Physical' | 'Video' | 'Chat';
type FilterStatus      = 'All' | SessionStatus;

interface Session {
  id: number;
  counsellor_name: string;
  session_type: ActualSessionType;
  date: string;
  time: string;
  status: SessionStatus;
  note?: string;
  duration?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGE TOKEN MAPS
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_BADGE_LIGHT: Record<SessionStatus, React.CSSProperties> = {
  Pending:   { background: '#fdf6e8', color: '#854F0B', border: '1px solid #f0d08a' },
  Confirmed: { background: '#eef5fd', color: '#185FA5', border: '1px solid #b3d3f5' },
  Completed: { background: '#008751', color: '#fff' },
  Cancelled: { background: '#fdf0f0', color: '#A32D2D', border: '1px solid #f5bebe' },
};
const STATUS_BADGE_DARK: Record<SessionStatus, React.CSSProperties> = {
  Pending:   { background: 'rgba(186,117,23,0.18)', color: '#fde68a', border: '1px solid rgba(186,117,23,0.35)' },
  Confirmed: { background: 'rgba(55,138,221,0.18)',  color: '#93c5fd', border: '1px solid rgba(55,138,221,0.35)' },
  Completed: { background: '#008751', color: '#fff' },
  Cancelled: { background: 'rgba(226,75,74,0.18)',   color: '#fca5a5', border: '1px solid rgba(226,75,74,0.35)' },
};

const TYPE_BADGE_LIGHT: Record<ActualSessionType, React.CSSProperties> = {
  Physical: { background: 'rgba(0,135,81,0.12)', color: '#008751' },
  Video:    { background: '#f3f1fe', color: '#7F77DD' },
  Chat:     { background: '#fdf6e8', color: '#BA7517' },
};
const TYPE_BADGE_DARK: Record<ActualSessionType, React.CSSProperties> = {
  Physical: { background: 'rgba(0,135,81,0.20)',    color: '#4ade80' },
  Video:    { background: 'rgba(127,119,221,0.18)', color: '#a5b4fc' },
  Chat:     { background: 'rgba(186,117,23,0.18)',  color: '#fbbf24' },
};

// ─────────────────────────────────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status, isDarkMode }: { status: SessionStatus; isDarkMode: boolean }) {
  const map = isDarkMode ? STATUS_BADGE_DARK : STATUS_BADGE_LIGHT;
  return (
    <span className="text-[10px] font-bold px-2.5 py-[3px] rounded-full" style={map[status]}>
      {status}
    </span>
  );
}

function TypeBadge({ type, isDarkMode }: { type: ActualSessionType; isDarkMode: boolean }) {
  const map = isDarkMode ? TYPE_BADGE_DARK : TYPE_BADGE_LIGHT;
  return (
    <span className="text-[10px] font-600 px-2.5 py-[3px] rounded-full" style={map[type]}>
      {type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CARD
// ─────────────────────────────────────────────────────────────────────────────
function SessionCard({ session, onCancel, isDarkMode }: {
  session: Session; onCancel: (id: number) => void; isDarkMode: boolean;
}) {
  const [expanded,   setExpanded]   = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    await onCancel(session.id);
    setCancelling(false);
  }

  const initials = session.counsellor_name
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  // Card tokens
  const cardBg      = isDarkMode ? 'rgba(0,135,81,0.10)'  : '#f0faf4';
  const cardBorder  = isDarkMode ? 'rgba(0,135,81,0.25)'  : '#b6e6cc';
  const nameColor   = isDarkMode ? '#bbf7d0'               : '#1a3d1f';
  const metaColor   = isDarkMode ? '#86efac'               : '#3B6D11';
  const divider     = isDarkMode ? 'rgba(0,135,81,0.22)'  : '#b6e6cc';
  const hoverShadow = isDarkMode ? '0 8px 24px rgba(0,135,81,0.18)' : '0 8px 24px rgba(0,135,81,0.10)';

  // Cancel button
  const cancelBg        = isDarkMode ? 'rgba(226,75,74,0.15)'  : '#fdf0f0';
  const cancelBorder    = isDarkMode ? 'rgba(226,75,74,0.30)'  : '#f5bebe';
  const cancelColor     = isDarkMode ? '#fca5a5'                : '#A32D2D';
  const cancelHoverBg   = isDarkMode ? 'rgba(226,75,74,0.25)'  : '#fbd5d5';

  // Notes button
  const notesBg       = isDarkMode ? 'rgba(0,135,81,0.15)'  : '#f0faf4';
  const notesBorder   = isDarkMode ? 'rgba(0,135,81,0.28)'  : '#b6e6cc';
  const notesColor    = isDarkMode ? '#4ade80'               : '#008751';
  const notesHoverBg  = isDarkMode ? 'rgba(0,135,81,0.25)'  : '#d9f2e6';

  return (
    <div
      className="relative rounded-[20px] p-5 overflow-hidden transition-all duration-200 hover:-translate-y-[2px]"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = hoverShadow)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div className="absolute bottom-[-20px] right-[-20px] w-[80px] h-[80px] rounded-full pointer-events-none opacity-[0.05]"
        style={{ background: '#008751' }} />

      <div className="flex items-start gap-3.5">
        {/* Avatar */}
        <div
          className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
          style={{ background: '#008751', border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,135,81,0.2)'}` }}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold mb-1.5" style={{ color: nameColor }}>
            {session.counsellor_name}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <StatusBadge status={session.status} isDarkMode={isDarkMode} />
            <TypeBadge   type={session.session_type} isDarkMode={isDarkMode} />
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: metaColor }}>
            <Clock size={11} />
            {formatDate(session.date)} · {formatTime(session.time)} · {session.duration ?? 45} min
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {(session.status === 'Pending' || session.status === 'Confirmed') && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-3.5 py-[6px] rounded-full text-[11px] font-600 transition-all disabled:opacity-50"
              style={{ background: cancelBg, border: `1px solid ${cancelBorder}`, color: cancelColor }}
              onMouseEnter={e => (e.currentTarget.style.background = cancelHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = cancelBg)}
            >
              {cancelling ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
          {session.status === 'Completed' && session.note && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3.5 py-[6px] rounded-full text-[11px] font-600 transition-all"
              style={{ background: notesBg, border: `1px solid ${notesBorder}`, color: notesColor }}
              onMouseEnter={e => (e.currentTarget.style.background = notesHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = notesBg)}
            >
              {expanded ? 'Hide Notes' : 'View Notes'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded notes */}
      {expanded && session.note && (
        <>
          <div className="h-px my-4" style={{ background: divider }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: metaColor }}>
            Session Notes
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: nameColor }}>
            {session.note}
          </p>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const [sessions,   setSessions]   = useState<Session[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<FilterStatus>('All');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const filters: FilterStatus[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

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
    getAppointments().then((data) => { setSessions(data); setLoading(false); });
  }, []);

  async function handleCancel(id: number) {
    const res = await cancelAppointment(id);
    if (res.ok) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'Cancelled' as const } : s));
    }
  }

  const filtered = filter === 'All' ? sessions : sessions.filter(s => s.status === filter);

  const counts = {
    Pending:   sessions.filter(s => s.status === 'Pending').length,
    Confirmed: sessions.filter(s => s.status === 'Confirmed').length,
    Completed: sessions.filter(s => s.status === 'Completed').length,
    Cancelled: sessions.filter(s => s.status === 'Cancelled').length,
  };

  // ─── Theme tokens ──────────────────────────────────────────────────────────
  const pageTitle    = isDarkMode ? '#ffffff'                : '#1a3d1f';
  const pageSubtitle = isDarkMode ? 'rgba(255,255,255,0.50)' : '#3B6D11';

  // Stat cards — light and dark variants
  const STAT_CARDS = isDarkMode ? [
    { label: 'Pending',   value: counts.Pending,   bg: 'rgba(186,117,23,0.12)', border: 'rgba(186,117,23,0.28)', val: '#fef3c7', lbl: '#fde68a', deco: '#fbbf24' },
    { label: 'Confirmed', value: counts.Confirmed, bg: 'rgba(55,138,221,0.12)', border: 'rgba(55,138,221,0.28)', val: '#bfdbfe', lbl: '#93c5fd', deco: '#60a5fa' },
    { label: 'Completed', value: counts.Completed, bg: 'rgba(0,135,81,0.13)',   border: 'rgba(0,135,81,0.28)',   val: '#bbf7d0', lbl: '#86efac', deco: '#4ade80' },
    { label: 'Cancelled', value: counts.Cancelled, bg: 'rgba(226,75,74,0.12)',  border: 'rgba(226,75,74,0.28)',  val: '#fee2e2', lbl: '#fca5a5', deco: '#f87171' },
  ] : [
    { label: 'Pending',   value: counts.Pending,   bg: '#fdf6e8', border: '#f0d08a', val: '#412402', lbl: '#854F0B', deco: '#BA7517' },
    { label: 'Confirmed', value: counts.Confirmed, bg: '#eef5fd', border: '#b3d3f5', val: '#0c2f52', lbl: '#185FA5', deco: '#378ADD' },
    { label: 'Completed', value: counts.Completed, bg: '#f0faf4', border: '#b6e6cc', val: '#1a3d1f', lbl: '#3B6D11', deco: '#008751' },
    { label: 'Cancelled', value: counts.Cancelled, bg: '#fdf0f0', border: '#f5bebe', val: '#501313', lbl: '#A32D2D', deco: '#E24B4A' },
  ];

  // Filter tabs
  const tabActive   = { background: '#008751', color: '#fff', border: '1px solid #008751' };
  const tabIdle     = isDarkMode
    ? { background: 'rgba(0,135,81,0.12)', border: '1px solid rgba(0,135,81,0.28)', color: '#86efac' }
    : { background: '#f0faf4',             border: '1px solid #b6e6cc',              color: '#3B6D11' };
  const tabHoverBorder = isDarkMode ? 'rgba(0,135,81,0.55)' : '#008751';
  const tabIdleBorder  = isDarkMode ? 'rgba(0,135,81,0.28)' : '#b6e6cc';

  // Empty / skeleton state
  const emptyBg      = isDarkMode ? 'rgba(0,135,81,0.10)'  : '#f0faf4';
  const emptyBorder  = isDarkMode ? 'rgba(0,135,81,0.25)'  : '#b6e6cc';
  const emptyTitle   = isDarkMode ? '#bbf7d0'               : '#1a3d1f';
  const emptySubtitle= isDarkMode ? '#86efac'               : '#3B6D11';
  const emptyIconBg  = isDarkMode ? 'rgba(0,135,81,0.20)'  : 'rgba(0,135,81,0.1)';

  const skeletonBg   = isDarkMode ? 'rgba(0,135,81,0.10)'  : '#f0faf4';
  const skeletonBdr  = isDarkMode ? 'rgba(0,135,81,0.22)'  : '#b6e6cc';
  const skeletonLine = isDarkMode ? 'rgba(0,135,81,0.22)'  : '#b6e6cc';
  const skeletonLine2= isDarkMode ? 'rgba(0,135,81,0.14)'  : '#d1f0e0';
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 py-5 pb-10 transition-colors duration-300">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[30px] font-bold" style={{ color: pageTitle }}>My Sessions</h2>
          <p className="text-[16px] mt-0.5" style={{ color: pageSubtitle }}>
            View and manage your counselling sessions
          </p>
        </div>
        <Link
          href="/dashboard/student/book"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-[14px] font-bold transition-opacity hover:opacity-90"
          style={{ background: '#008751' }}
        >
          <Plus size={15} /> Book New
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {STAT_CARDS.map(s => (
          <div
            key={s.label}
            className="relative rounded-[20px] p-5 overflow-hidden transition-all duration-200 hover:-translate-y-[2px]"
            style={{ background: s.bg, border: `1px solid ${s.border}` }}
          >
            <div className="absolute bottom-[-18px] right-[-18px] w-[64px] h-[64px] rounded-full opacity-[0.10]"
              style={{ background: s.deco }} />
            <p className="text-[34px] font-bold leading-none mb-1.5" style={{ color: s.val }}>
              {s.value}
            </p>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: s.lbl }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-[6px] rounded-full text-[12px] font-semibold transition-all duration-150"
            style={filter === f ? tabActive : tabIdle}
            onMouseEnter={e => { if (filter !== f) e.currentTarget.style.borderColor = tabHoverBorder; }}
            onMouseLeave={e => { if (filter !== f) e.currentTarget.style.borderColor = tabIdleBorder; }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Sessions list ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-[20px] p-5 animate-pulse"
              style={{ background: skeletonBg, border: `1px solid ${skeletonBdr}` }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full" style={{ background: skeletonLine }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded" style={{ background: skeletonLine }} />
                  <div className="h-2.5 w-56 rounded" style={{ background: skeletonLine2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[20px] p-10 text-center"
          style={{ background: emptyBg, border: `1px solid ${emptyBorder}` }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: emptyIconBg }}>
            <Clock size={20} style={{ color: '#008751' }} />
          </div>
          <p className="text-[18px] font-bold mb-1" style={{ color: emptyTitle }}>
            No {filter.toLowerCase()} sessions
          </p>
          <p className="text-[15px] mb-4" style={{ color: emptySubtitle }}>
            {filter === 'All' ? "You haven't booked any sessions yet." : `No sessions with status "${filter}".`}
          </p>
          <Link
            href="/dashboard/student/book"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-[15px] font-bold"
            style={{ background: '#008751' }}
          >
            <Plus size={15} /> Book a session
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
            <SessionCard key={s.id} session={s} onCancel={handleCancel} isDarkMode={isDarkMode} />
          ))}
        </div>
      )}
    </div>
  );
}