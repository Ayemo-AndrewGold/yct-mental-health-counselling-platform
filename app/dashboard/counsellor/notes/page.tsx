'use client';

import { useState, useEffect } from 'react';
import { getCounsellorNotes, createCounsellorNote, updateCounsellorNote } from '@/lib/api';

type NoteType = 'Session' | 'Follow-up' | 'Assessment' | 'Safety Plan';

interface Note {
  id: string | number;
  student_name?: string;     // backend field
  studentName?: string;      // normalised
  is_anonymous?: boolean;
  isAnonymous?: boolean;
  initials?: string;
  note_type?: string;        // backend field
  type?: NoteType;           // normalised
  created_at?: string;       // backend field
  date?: string;             // normalised
  session_number?: number;   // backend field
  sessionNumber?: number;    // normalised
  content: string;
  phq9_score?: number;       // backend field
  phq9?: number;             // normalised
  follow_up_date?: string;   // backend field
  followUpDate?: string;     // normalised
}

// ─── Normalise backend shape ──────────────────────────────────────────────────
function normalise(raw: Note): Note {
  const name = raw.student_name ?? raw.studentName ?? 'Unknown';
  const rawType = (raw.note_type ?? raw.type ?? 'Session') as NoteType;
  const validTypes: NoteType[] = ['Session', 'Follow-up', 'Assessment', 'Safety Plan'];
  const type: NoteType = validTypes.includes(rawType) ? rawType : 'Session';

  return {
    ...raw,
    studentName:   name,
    isAnonymous:   raw.is_anonymous   ?? raw.isAnonymous   ?? false,
    initials:      raw.initials       ?? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    type,
    date:          raw.created_at     ?? raw.date          ?? '',
    sessionNumber: raw.session_number ?? raw.sessionNumber ?? 1,
    phq9:          raw.phq9_score     ?? raw.phq9,
    followUpDate:  raw.follow_up_date ?? raw.followUpDate  ?? '',
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
    expandBg:      dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    noticeBg:      dark ? 'rgba(0,135,81,0.12)'    : '#f0fdf4',
    noticeBorder:  dark ? 'rgba(0,135,81,0.30)'    : '#bbf7d0',
    noticeText:    dark ? '#86efac'                : '#15803d',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    inputText:     dark ? '#ffffff'                : '#111827',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    modalBg:       dark ? '#0d1f14'                : '#ffffff',
  };
}

function TypeBadge({ type, dark }: { type: NoteType; dark: boolean }) {
  const map: Record<NoteType, { bg: string; text: string }> = {
    'Session':     { bg: dark ? 'rgba(0,135,81,0.20)'  :'#e8f5ec', text: dark ? '#86efac':'#1a5c2a' },
    'Follow-up':   { bg: dark ? 'rgba(59,130,246,0.18)':'#eff6ff', text: dark ? '#93c5fd':'#1d4ed8' },
    'Assessment':  { bg: dark ? 'rgba(139,92,246,0.18)':'#f5f3ff', text: dark ? '#c4b5fd':'#6d28d9' },
    'Safety Plan': { bg: dark ? 'rgba(239,68,68,0.18)' :'#fef2f2', text: dark ? '#fca5a5':'#b91c1c' },
  };
  const { bg, text } = map[type] ?? map['Session'];
  return (
    <span className="text-[13px] font-semibold px-3 py-1 rounded-md font-[lexend]"
      style={{ background: bg, color: text }}>{type}</span>
  );
}

// ─── Note card ────────────────────────────────────────────────────────────────
function NoteCard({ note, onEdit, t }: {
  note: Note; onEdit: (n: Note) => void; t: ReturnType<typeof useTheme>;
}) {
  const [expanded, setExpanded] = useState(false);
  const phqColor = note.phq9 !== undefined
    ? (note.phq9 >= 20 ? '#ef4444' : note.phq9 >= 10 ? (t.dark ? '#fde68a':'#b45309') : (t.dark ? '#86efac':'#15803d'))
    : t.textMuted;

  const btnBase = 'h-9 px-4 rounded-xl text-[13px] font-semibold font-[lexend] transition-colors';
  const displayDate = note.date
    ? new Date(note.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
    : '';

  return (
    <div className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
      style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 border-2"
            style={note.isAnonymous
              ? { background: t.dark ? 'rgba(251,191,36,0.18)':'#fffbeb', color: t.dark ? '#fde68a':'#b45309', borderColor: t.dark ? 'rgba(251,191,36,0.30)':'#fde68a' }
              : { background: t.greenBg, color: t.greenText, borderColor: t.greenBorder }
            }>
            {note.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                {note.studentName}
              </p>
              <TypeBadge type={note.type!} dark={t.dark} />
              <span className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>
                Session #{note.sessionNumber}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {displayDate && (
                <span className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>{displayDate}</span>
              )}
              {note.phq9 !== undefined && (
                <>
                  <span style={{ color: t.textMuted }}>·</span>
                  <span className="text-[14px] font-bold font-[lexend]" style={{ color: phqColor }}>
                    PHQ-9: {note.phq9}
                  </span>
                </>
              )}
              {note.followUpDate && (
                <>
                  <span style={{ color: t.textMuted }}>·</span>
                  <span className="text-[14px] font-medium font-[lexend]" style={{ color: t.greenText }}>
                    Follow-up: {note.followUpDate}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setExpanded(!expanded)} className={btnBase}
              style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: 'transparent' }}>
              {expanded ? 'Hide' : 'Read'}
            </button>
            <button onClick={() => onEdit(note)} className={btnBase}
              style={{ background: t.greenBg, color: t.greenText }}>
              Edit
            </button>
          </div>
        </div>
        {expanded && (
          <div className="mt-5 pt-5 rounded-xl p-4"
            style={{ borderTop: `1px solid ${t.divider}`, background: t.expandBg }}>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-[lexend]"
              style={{ color: t.textSecondary }}>{note.content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Note modal ───────────────────────────────────────────────────────────────
function NoteModal({ note, onClose, onSave, saving, t }: {
  note: Partial<Note> | null;
  onClose: () => void;
  onSave: (n: Partial<Note>) => void;
  saving: boolean;
  t: ReturnType<typeof useTheme>;
}) {
  const [form, setForm] = useState<Partial<Note>>(
    note ?? { studentName:'', type:'Session', content:'', followUpDate:'' }
  );
  function update(field: keyof Note, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const inputCls = `w-full h-12 rounded-xl px-4 text-[15px] font-[lexend] focus:outline-none transition`;
  const labelCls = `block text-[13px] font-semibold mb-2 font-[lexend]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        style={{ background: t.modalBg, border: `1px solid ${t.cardBorder}` }}>
        <div className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `1px solid ${t.divider}` }}>
          <h3 className="text-[18px] font-bold font-[syne]" style={{ color: t.textPrimary }}>
            {note?.id ? 'Edit Note' : 'New Session Note'}
          </h3>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition"
            style={{ background: t.dark ? 'rgba(255,255,255,0.08)':'#f3f4f6' }}>
            <svg className="w-4 h-4" style={{ color: t.textMuted }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: t.textSecondary }}>Student Name</label>
              <input value={form.studentName ?? ''} onChange={e => update('studentName', e.target.value)}
                placeholder="e.g. Fatima Abdullahi" className={inputCls}
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} />
            </div>
            <div>
              <label className={labelCls} style={{ color: t.textSecondary }}>Note Type</label>
              <select value={form.type ?? 'Session'} onChange={e => update('type', e.target.value)}
                className={inputCls}
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}>
                {(['Session','Follow-up','Assessment','Safety Plan'] as NoteType[]).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: t.textSecondary }}>Session Number</label>
              <input type="number" value={form.sessionNumber ?? ''} onChange={e => update('sessionNumber', parseInt(e.target.value))}
                placeholder="e.g. 1" className={inputCls}
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} />
            </div>
            <div>
              <label className={labelCls} style={{ color: t.textSecondary }}>PHQ-9 Score</label>
              <input type="number" min={0} max={27} value={form.phq9 ?? ''} onChange={e => update('phq9', parseInt(e.target.value))}
                placeholder="0 – 27" className={inputCls}
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} />
            </div>
          </div>
          <div>
            <label className={labelCls} style={{ color: t.textSecondary }}>Follow-up Date</label>
            <input type="date" value={form.followUpDate ?? ''} onChange={e => update('followUpDate', e.target.value)}
              className={inputCls}
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} />
          </div>
          <div>
            <label className={labelCls} style={{ color: t.textSecondary }}>Session Notes</label>
            <textarea value={form.content ?? ''} onChange={e => update('content', e.target.value)}
              placeholder="Write your session notes here..." rows={5}
              className="w-full rounded-xl px-4 py-3.5 text-[15px] font-[lexend] focus:outline-none resize-none transition"
              style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }} />
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: `1px solid ${t.divider}` }}>
          <p className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>
            Notes are encrypted and only visible to you and admin.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="h-11 px-5 rounded-xl text-[14px] font-semibold font-[lexend] transition"
              style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: 'transparent' }}>
              Cancel
            </button>
            <button onClick={() => onSave(form)} disabled={saving}
              className="h-11 px-5 rounded-xl text-[14px] font-semibold font-[lexend] transition disabled:opacity-60"
              style={{ background: '#008751', color: '#ffffff' }}>
              {saving ? 'Saving…' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CounsellorNotesPage() {
  const t = useTheme();
  const [notes,     setNotes]     = useState<Note[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [typeFilter,setType]      = useState('All Types');
  const [modalNote, setModalNote] = useState<Partial<Note> | null | undefined>(undefined);

  useEffect(() => {
    getCounsellorNotes()
      .then(data => setNotes(Array.isArray(data) ? data.map(normalise) : []))
      .catch(() => setError('Could not load notes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n => {
    const q = search.toLowerCase();
    return (!q || (n.studentName ?? '').toLowerCase().includes(q) || (n.type ?? '').toLowerCase().includes(q))
      && (typeFilter === 'All Types' || n.type === typeFilter);
  });

  async function handleSave(form: Partial<Note>) {
    setSaving(true);
    setError('');
    try {
      // Map normalised fields back to backend field names
      const payload: Record<string, unknown> = {
        student_name:   form.studentName,
        note_type:      form.type,
        session_number: form.sessionNumber,
        phq9_score:     form.phq9,
        follow_up_date: form.followUpDate || null,
        content:        form.content,
      };

      if (form.id) {
        // Edit existing note
        const res = await updateCounsellorNote(form.id, payload);
        if (res.ok) {
          const updated = normalise(await res.json());
          setNotes(prev => prev.map(n => String(n.id) === String(form.id) ? updated : n));
        } else {
          setError('Failed to update note.');
        }
      } else {
        // Create new note
        const res = await createCounsellorNote(payload);
        if (res.ok) {
          const created = normalise(await res.json());
          setNotes(prev => [created, ...prev]);
        } else {
          setError('Failed to save note.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
      setModalNote(undefined);
    }
  }

  const inputCls = `h-[42px] rounded-xl px-4 text-[14px] font-[lexend] focus:outline-none transition border`;

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            Session Notes
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
            {notes.length} notes · All encrypted and confidential
          </p>
        </div>
        <button onClick={() => setModalNote(null)}
          className="flex items-center gap-2 h-11 px-5 rounded-xl text-[15px] font-semibold transition"
          style={{ background: '#008751', color: '#ffffff' }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Note
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Notes',    value: String(notes.length),                                              accent: 'bg-[#008751]'  },
          { label: 'Safety Plans',   value: String(notes.filter(n => n.type === 'Safety Plan').length),        accent: 'bg-red-500'    },
          { label: 'Assessments',    value: String(notes.filter(n => n.type === 'Assessment').length),         accent: 'bg-purple-500' },
          { label: 'Follow-ups Due', value: String(notes.filter(n => n.followUpDate && n.followUpDate !== '').length), accent: 'bg-amber-400' },
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
            placeholder="Search by student name or note type..."
            className={`${inputCls} w-full pl-10`}
            style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }} />
        </div>
        <select value={typeFilter} onChange={e => setType(e.target.value)} className={inputCls}
          style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.inputText }}>
          {['All Types','Session','Follow-up','Assessment','Safety Plan'].map(v => <option key={v}>{v}</option>)}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl px-5 py-4 text-[14px] font-[lexend]"
          style={{ background: t.dark ? 'rgba(239,68,68,0.15)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c', border: `1px solid ${t.dark ? 'rgba(239,68,68,0.30)':'#fecaca'}` }}>
          {error}
        </div>
      )}

      {/* Notes list */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-6 animate-pulse"
              style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-48 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#e5e7eb' }} />
                  <div className="h-3 w-72 rounded" style={{ background: t.dark ? 'rgba(255,255,255,0.07)':'#f3f4f6' }} />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <p className="text-[15px] font-[lexend]" style={{ color: t.textMuted }}>
              {notes.length === 0 ? 'No notes yet. Click "New Note" to write your first one.' : 'No notes match your search.'}
            </p>
          </div>
        ) : (
          filtered.map(n => (
            <NoteCard key={n.id} note={n} onEdit={note => setModalNote(note)} t={t} />
          ))
        )}
      </div>

      {/* Confidentiality notice */}
      <div className="rounded-2xl px-6 py-5 flex items-start gap-4"
        style={{ background: t.noticeBg, border: `1px solid ${t.noticeBorder}` }}>
        <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: t.noticeText }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-[14px] leading-relaxed font-[lexend]" style={{ color: t.noticeText }}>
          All session notes are encrypted and stored securely in compliance with NDPR 2019.
          Notes are only accessible to you and authorised administrators.
        </p>
      </div>

      {modalNote !== undefined && (
        <NoteModal note={modalNote} onClose={() => setModalNote(undefined)} onSave={handleSave} saving={saving} t={t} />
      )}
    </div>
  );
}
