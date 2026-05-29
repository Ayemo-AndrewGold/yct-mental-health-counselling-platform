'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type NoteType = 'Session' | 'Follow-up' | 'Assessment' | 'Safety Plan';

interface Note {
  id: string;
  studentName: string;
  isAnonymous: boolean;
  initials: string;
  avatarStyle: string;
  type: NoteType;
  date: string;
  sessionNumber: number;
  content: string;
  phq9?: number;
  followUpDate?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const NOTES: Note[] = [
  {
    id: 'n1',
    studentName: 'Nwosu Tochukwu',
    isAnonymous: false,
    initials: 'NT',
    avatarStyle: 'bg-red-50 text-red-700 border-red-100',
    type: 'Safety Plan',
    date: 'Apr 21, 2026',
    sessionNumber: 4,
    content: 'Student disclosed passive suicidal ideation. Safety plan established including emergency contacts, coping strategies, and removal of means. Parents notified with student consent. Weekly sessions scheduled for the next 4 weeks. Student agreed to call counsellor if ideation escalates.',
    phq9: 24,
    followUpDate: 'Apr 28, 2026',
  },
  {
    id: 'n2',
    studentName: 'Adewale Funmilayo',
    isAnonymous: false,
    initials: 'AF',
    avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100',
    type: 'Session',
    date: 'Apr 20, 2026',
    sessionNumber: 3,
    content: 'Continued CBT techniques for anxiety management. Student reported improvement in sleep quality. Introduced thought challenging worksheet. Student showed good engagement and completed homework from last session. GAD-7 reassessment scheduled for next week.',
    phq9: 18,
    followUpDate: 'Apr 27, 2026',
  },
  {
    id: 'n3',
    studentName: 'ANON-48392',
    isAnonymous: true,
    initials: 'AN',
    avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',
    type: 'Assessment',
    date: 'Apr 21, 2026',
    sessionNumber: 1,
    content: 'Initial assessment session. Anonymous student presenting with severe depression symptoms and chronic sleep disturbance. PHQ-9 score of 21 indicating severe depression. Immediate follow-up session booked. Crisis resources provided.',
    phq9: 21,
    followUpDate: 'Apr 23, 2026',
  },
  {
    id: 'n4',
    studentName: 'Fatima Abdullahi',
    isAnonymous: false,
    initials: 'FA',
    avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',
    type: 'Follow-up',
    date: 'Apr 19, 2026',
    sessionNumber: 2,
    content: 'Follow-up session showed significant improvement. Student has been consistently applying breathing exercises. PHQ-9 improved from 14 to 8. Academic performance stabilising. Recommend monthly check-ins going forward. Case moving toward resolution.',
    phq9: 8,
    followUpDate: 'May 19, 2026',
  },
  {
    id: 'n5',
    studentName: 'Okonkwo Chukwuemeka',
    isAnonymous: false,
    initials: 'OC',
    avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a] border-[#b6dfc0]',
    type: 'Session',
    date: 'Apr 19, 2026',
    sessionNumber: 2,
    content: 'Second session. Student continues to struggle with exam anxiety. Introduced time management strategies and mindfulness techniques. Homework: complete daily mood diary and 10-minute meditation. Good rapport established.',
    phq9: 14,
    followUpDate: 'Apr 26, 2026',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TYPE BADGE
// ─────────────────────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: NoteType }) {
  const map: Record<NoteType, string> = {
    'Session':     'bg-teal-50 text-teal-700',
    'Follow-up':   'bg-blue-50 text-blue-700',
    'Assessment':  'bg-purple-50 text-purple-700',
    'Safety Plan': 'bg-red-50 text-red-700',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-[3px] rounded-md ${map[type]}`}>
      {type}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTE CARD
// ─────────────────────────────────────────────────────────────────────────────
function NoteCard({ note, onEdit }: { note: Note; onEdit: (note: Note) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-[1.5px] ${note.avatarStyle}`}>
            {note.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[13px] font-semibold text-gray-900">{note.studentName}</p>
              <TypeBadge type={note.type} />
              <span className="text-[10px] text-gray-400">Session #{note.sessionNumber}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-400">{note.date}</span>
              {note.phq9 !== undefined && (
                <>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className={`text-[11px] font-bold ${note.phq9 >= 20 ? 'text-red-600' : note.phq9 >= 10 ? 'text-amber-600' : 'text-green-600'}`}>
                    PHQ-9: {note.phq9}
                  </span>
                </>
              )}
              {note.followUpDate && (
                <>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[11px] text-teal-600">Follow-up: {note.followUpDate}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="h-7 px-3 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-medium hover:bg-gray-50 transition"
            >
              {expanded ? 'Hide' : 'Read'}
            </button>
            <button
              onClick={() => onEdit(note)}
              className="h-7 px-3 bg-teal-50 text-teal-700 rounded-lg text-[11px] font-medium hover:bg-teal-100 transition"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-[12px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW / EDIT NOTE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function NoteModal({
  note,
  onClose,
  onSave,
}: {
  note: Partial<Note> | null;
  onClose: () => void;
  onSave: (n: Partial<Note>) => void;
}) {
  const [form, setForm] = useState<Partial<Note>>(
    note ?? { studentName: '', type: 'Session', content: '', followUpDate: '' }
  );

  function update(field: keyof Note, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const inputCls = 'w-full h-10 border border-gray-200 rounded-xl px-3 text-[12px] text-gray-800 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 transition bg-white';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-[14px] font-semibold text-gray-900">
            {note?.id ? 'Edit Note' : 'New Session Note'}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Student Name</label>
              <input
                value={form.studentName ?? ''}
                onChange={(e) => update('studentName', e.target.value)}
                placeholder="e.g. Fatima Abdullahi"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Note Type</label>
              <select
                value={form.type ?? 'Session'}
                onChange={(e) => update('type', e.target.value)}
                className={inputCls}
              >
                {(['Session', 'Follow-up', 'Assessment', 'Safety Plan'] as NoteType[]).map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Session Number</label>
              <input
                type="number"
                value={form.sessionNumber ?? ''}
                onChange={(e) => update('sessionNumber', parseInt(e.target.value))}
                placeholder="e.g. 1"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5">PHQ-9 Score</label>
              <input
                type="number"
                value={form.phq9 ?? ''}
                onChange={(e) => update('phq9', parseInt(e.target.value))}
                placeholder="0 – 27"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Follow-up Date</label>
            <input
              type="date"
              value={form.followUpDate ?? ''}
              onChange={(e) => update('followUpDate', e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Session Notes</label>
            <textarea
              value={form.content ?? ''}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Write your session notes here..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 resize-none transition"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          <p className="text-[10.5px] text-gray-400">
            Notes are encrypted and only visible to you and admin.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              className="h-9 px-4 bg-teal-700 text-white rounded-xl text-[12px] font-semibold hover:bg-teal-600 transition"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CounsellorNotesPage() {
  const [notes, setNotes]       = useState<Note[]>(NOTES);
  const [search, setSearch]     = useState('');
  const [typeFilter, setType]   = useState('All Types');
  const [modalNote, setModalNote] = useState<Partial<Note> | null | undefined>(undefined);

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase();
    const matchSearch = !q || n.studentName.toLowerCase().includes(q) || n.type.toLowerCase().includes(q);
    const matchType   = typeFilter === 'All Types' || n.type === typeFilter;
    return matchSearch && matchType;
  });

  function handleSave(form: Partial<Note>) {
    if (form.id) {
      setNotes((prev) => prev.map((n) => n.id === form.id ? { ...n, ...form } as Note : n));
    } else {
      const newNote: Note = {
        ...form,
        id: `n${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        isAnonymous: false,
        initials: (form.studentName ?? 'AN').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
        avatarStyle: 'bg-teal-50 text-teal-700 border-teal-200',
        sessionNumber: form.sessionNumber ?? 1,
        content: form.content ?? '',
        type: form.type ?? 'Session',
        studentName: form.studentName ?? '',
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setModalNote(undefined);
  }

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-teal-600 transition';

  return (
    <div className="px-6 py-5 pb-10 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">Session Notes</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {notes.length} notes · All encrypted and confidential
          </p>
        </div>
        <button
          onClick={() => setModalNote(null)}
          className="flex items-center gap-1.5 h-9 bg-teal-700 hover:bg-teal-600 text-white px-4 rounded-xl text-[12px] font-medium transition"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Note
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Notes',    value: String(notes.length),                                               accent: 'bg-teal-600'  },
          { label: 'Safety Plans',   value: String(notes.filter(n => n.type === 'Safety Plan').length),         accent: 'bg-red-500'   },
          { label: 'Assessments',    value: String(notes.filter(n => n.type === 'Assessment').length),          accent: 'bg-purple-500'},
          { label: 'Follow-ups Due', value: String(notes.filter(n => n.followUpDate).length),                   accent: 'bg-amber-400' },
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
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or note type..."
            className={`${inputCls} w-full pl-8`}
          />
        </div>
        <select value={typeFilter} onChange={(e) => setType(e.target.value)} className={inputCls}>
          {['All Types', 'Session', 'Follow-up', 'Assessment', 'Safety Plan'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Notes list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-[12px] text-gray-400">No notes found.</p>
          </div>
        ) : (
          filtered.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onEdit={(note) => setModalNote(note)}
            />
          ))
        )}
      </div>

      {/* Confidentiality notice */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 flex items-start gap-3">
        <svg className="w-4 h-4 stroke-teal-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-[11px] text-teal-700 leading-relaxed">
          All session notes are encrypted and stored securely in compliance with NDPR 2019.
          Notes are only accessible to you and authorised administrators.
        </p>
      </div>

      {/* Modal */}
      {modalNote !== undefined && (
        <NoteModal
          note={modalNote}
          onClose={() => setModalNote(undefined)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}