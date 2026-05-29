'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAppointments, cancelAppointment } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type SessionStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
type ActualSessionType = 'Physical' | 'Video' | 'Chat';
type FilterStatus  = 'All' | SessionStatus;

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
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
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
// BADGES
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: SessionStatus }) {
  const map: Record<SessionStatus, string> = {
    Pending:   'bg-amber-50 text-amber-700',
    Confirmed: 'bg-blue-50 text-blue-700',
    Completed: 'bg-green-50 text-green-700',
    Cancelled: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-[3px] rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: ActualSessionType }) {
  const map: Record<ActualSessionType, string> = {
    Physical: 'bg-[#e8f5ec] text-[#1a5c2a]',
    Video:    'bg-purple-50 text-purple-700',
    Chat:     'bg-orange-50 text-orange-700',
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-[3px] rounded-md ${map[type]}`}>
      {type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CARD
// ─────────────────────────────────────────────────────────────────────────────
function SessionCard({ session, onCancel }: {
  session: Session;
  onCancel: (id: number) => void;
}) {
  const [expanded, setExpanded]     = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    await onCancel(session.id);
    setCancelling(false);
  }

  const initials = session.counsellor_name
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[13px] font-semibold text-gray-900">{session.counsellor_name}</p>
              <TypeBadge type={session.session_type} />
              <StatusBadge status={session.status} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {formatDate(session.date)} · {formatTime(session.time)} · {session.duration ?? 45} min
            </p>
            {session.note && (
              <p className="text-[11px] text-gray-500 mt-1 italic">
                Note: {session.note}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {(session.status === 'Pending' || session.status === 'Confirmed') && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="h-8 px-3 border border-red-200 text-red-600 rounded-lg text-[11px] font-medium hover:bg-red-50 disabled:opacity-50 transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            )}
            {session.status === 'Completed' && session.note && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="h-8 px-3 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-medium hover:bg-gray-50 transition"
              >
                {expanded ? 'Hide Notes' : 'View Notes'}
              </button>
            )}
          </div>
        </div>

        {/* Expanded notes */}
        {expanded && session.note && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Session Notes
            </p>
            <p className="text-[12px] text-gray-700 leading-relaxed">{session.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<FilterStatus>('All');

  const filters: FilterStatus[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  useEffect(() => {
    getAppointments().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  async function handleCancel(id: number) {
    const res = await cancelAppointment(id);
    if (res.ok) {
      setSessions((prev) =>
        prev.map((s) => s.id === id ? { ...s, status: 'Cancelled' as const } : s)
      );
    }
  }

  const filtered = filter === 'All'
    ? sessions
    : sessions.filter((s) => s.status === filter);

  const counts = {
    Pending:   sessions.filter(s => s.status === 'Pending').length,
    Confirmed: sessions.filter(s => s.status === 'Confirmed').length,
    Completed: sessions.filter(s => s.status === 'Completed').length,
    Cancelled: sessions.filter(s => s.status === 'Cancelled').length,
  };

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">My Sessions</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">View and manage your counselling sessions</p>
        </div>
        <Link
          href="/dashboard/student/book"
          className="flex items-center gap-1.5 h-9 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white px-4 rounded-xl text-[12px] font-medium transition"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Book New
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Pending',   value: counts.Pending,   color: 'bg-amber-400'  },
          { label: 'Confirmed', value: counts.Confirmed, color: 'bg-blue-400'   },
          { label: 'Completed', value: counts.Completed, color: 'bg-[#1a5c2a]'  },
          { label: 'Cancelled', value: counts.Cancelled, color: 'bg-red-400'    },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.color}`} />
            <p className="text-[24px] font-bold text-gray-900">{s.value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-4 rounded-xl text-[12px] font-medium transition-all
              ${filter === f
                ? 'bg-[#1a5c2a] text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a5c2a]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                  <div className="h-2.5 w-56 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
          <p className="text-[12px] text-gray-400">
            No {filter.toLowerCase()} sessions found.
          </p>
          <Link
            href="/dashboard/student/book"
            className="inline-block mt-3 text-[12px] text-[#1a5c2a] font-medium hover:underline"
          >
            Book a session →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <SessionCard key={s.id} session={s} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
}