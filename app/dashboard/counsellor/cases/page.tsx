'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type Severity   = 'High' | 'Medium' | 'Low';
type CaseStatus = 'Urgent' | 'In Progress' | 'Pending' | 'Resolved' | 'Closed';

interface Case {
  id: string;
  caseId: string;
  studentName: string;
  isAnonymous: boolean;
  initials: string;
  avatarStyle: string;
  department: string;
  level: string;
  issueType: string;
  severity: Severity;
  openedDate: string;
  status: CaseStatus;
  phq9: number;
  notes: string;
  sessions: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const CASES: Case[] = [
  {
    id: '1', caseId: '#CASE-0029',
    studentName: 'Nwosu Tochukwu', isAnonymous: false,
    initials: 'NT', avatarStyle: 'bg-red-50 text-red-700 border-red-100',
    department: 'Computer Technology', level: 'ND2',
    issueType: 'Suicidal Ideation', severity: 'High',
    openedDate: 'Apr 15, 2026', status: 'In Progress',
    phq9: 24, sessions: 4,
    notes: 'Student disclosed passive suicidal ideation. Safety plan established. Weekly sessions scheduled. Parents notified with consent.',
  },
  {
    id: '2', caseId: '#CASE-0039',
    studentName: 'ANON-48392', isAnonymous: true,
    initials: 'AN', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',
    department: '', level: '',
    issueType: 'Sleep & Depression', severity: 'High',
    openedDate: 'Apr 21, 2026', status: 'Urgent',
    phq9: 21, sessions: 1,
    notes: 'Anonymous student presenting with severe depression and sleep disturbances. PHQ-9 score of 21 indicates severe depression. Urgent follow-up required.',
  },
  {
    id: '3', caseId: '#CASE-0037',
    studentName: 'Okonkwo Chukwuemeka', isAnonymous: false,
    initials: 'OC', avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a] border-[#b6dfc0]',
    department: 'Computer Technology', level: 'ND2',
    issueType: 'Academic Stress', severity: 'Medium',
    openedDate: 'Apr 19, 2026', status: 'In Progress',
    phq9: 14, sessions: 2,
    notes: 'Student struggling with exam pressure and fear of failure. CBT techniques introduced. Progress noted in second session.',
  },
  {
    id: '4', caseId: '#CASE-0041',
    studentName: 'Adewale Funmilayo', isAnonymous: false,
    initials: 'AF', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100',
    department: 'Electrical Engineering', level: 'HND1',
    issueType: 'Severe Anxiety', severity: 'High',
    openedDate: 'Apr 20, 2026', status: 'In Progress',
    phq9: 18, sessions: 3,
    notes: 'Generalised anxiety disorder suspected. GAD-7 score of 16. Breathing exercises and journaling recommended. Referral to Dr. Fashola being considered.',
  },
  {
    id: '5', caseId: '#CASE-0034',
    studentName: 'Fatima Abdullahi', isAnonymous: false,
    initials: 'FA', avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',
    department: 'Mass Communication', level: 'HND1',
    issueType: 'Anxiety', severity: 'Medium',
    openedDate: 'Apr 18, 2026', status: 'Resolved',
    phq9: 8, sessions: 2,
    notes: 'Mild anxiety related to academic workload. Student responded well to session. PHQ-9 improved from 14 to 8. Case resolved.',
  },
  {
    id: '6', caseId: '#CASE-0031',
    studentName: 'Balogun Ifeoluwa', isAnonymous: false,
    initials: 'BI', avatarStyle: 'bg-green-50 text-green-700 border-green-100',
    department: 'Business Administration', level: 'ND1',
    issueType: 'Low Mood', severity: 'Low',
    openedDate: 'Apr 17, 2026', status: 'Resolved',
    phq9: 4, sessions: 1,
    notes: 'Student presented with low mood following relationship difficulties. Single session sufficient. Follow-up in 30 days.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { cls: string; dot: string }> = {
    High:   { cls: 'bg-red-50 text-red-700',    dot: 'bg-red-500'   },
    Medium: { cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
    Low:    { cls: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  };
  const { cls, dot } = map[severity];
  return (
    <span className={`inline-flex items-center gap-[5px] text-[10px] font-semibold px-2 py-[3px] rounded-md ${cls}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${dot}`} />
      {severity}
    </span>
  );
}

function CaseStatusBadge({ status }: { status: CaseStatus }) {
  const map: Record<CaseStatus, string> = {
    Urgent:        'bg-red-50 text-red-700',
    'In Progress': 'bg-amber-50 text-amber-700',
    Pending:       'bg-blue-50 text-blue-700',
    Resolved:      'bg-green-50 text-green-700',
    Closed:        'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CASE CARD
// ─────────────────────────────────────────────────────────────────────────────
function CaseCard({ c }: { c: Case }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
      <div className="p-5">
        <div className="flex items-start gap-4">

          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border-[1.5px] ${c.avatarStyle}`}>
            {c.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-[13px] font-semibold text-gray-900">{c.studentName}</p>
              <span className="text-[10px] text-gray-400 font-mono">{c.caseId}</span>
              <SeverityBadge severity={c.severity} />
              <CaseStatusBadge status={c.status} />
            </div>
            <p className="text-[11px] text-gray-500">
              {c.isAnonymous ? 'Anonymous session' : `${c.department} · ${c.level}`}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] text-gray-500">{c.issueType}</span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className={`text-[11px] font-bold ${c.phq9 >= 20 ? 'text-red-600' : c.phq9 >= 10 ? 'text-amber-600' : 'text-green-600'}`}>
                PHQ-9: {c.phq9}
              </span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-500">{c.sessions} sessions</span>
              <span className="text-[10px] text-gray-300">·</span>
              <span className="text-[11px] text-gray-400">Opened {c.openedDate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="h-8 px-3 border border-gray-200 text-gray-600 rounded-lg text-[11px] font-medium hover:bg-gray-50 transition"
            >
              {expanded ? 'Hide Notes' : 'View Notes'}
            </button>
            {(c.status === 'Urgent' || c.status === 'In Progress') && (
              <button className="h-8 px-3 bg-teal-700 text-white rounded-lg text-[11px] font-medium hover:bg-teal-600 transition">
                Update
              </button>
            )}
            {c.status === 'In Progress' && (
              <button className="h-8 px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-[11px] font-medium hover:bg-green-100 transition">
                Resolve
              </button>
            )}
          </div>
        </div>

        {/* Expanded notes */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Case Notes
            </p>
            <p className="text-[12px] text-gray-700 leading-relaxed">{c.notes}</p>
            <div className="flex gap-2 mt-3">
              <button className="h-7 px-3 bg-teal-50 text-teal-700 rounded-lg text-[11px] font-medium hover:bg-teal-100 transition">
                Edit Notes
              </button>
              <button className="h-7 px-3 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-medium hover:bg-blue-100 transition">
                Add Session Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function CounsellorCasesPage() {
  const [search, setSearch]     = useState('');
  const [severity, setSeverity] = useState('All Severity');
  const [status, setStatus]     = useState('All Status');

  const filtered = CASES.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch   = !q || c.studentName.toLowerCase().includes(q) || c.caseId.toLowerCase().includes(q) || c.issueType.toLowerCase().includes(q);
    const matchSeverity = severity === 'All Severity' || c.severity === severity;
    const matchStatus   = status   === 'All Status'   || c.status   === status;
    return matchSearch && matchSeverity && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-teal-600 transition';

  return (
    <div className="px-6 py-5 pb-10 space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">My Cases</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {CASES.filter(c => c.severity === 'High').length} high severity · {CASES.filter(c => c.status === 'Resolved').length} resolved
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total Cases',    value: String(CASES.length),                                              accent: 'bg-teal-600'  },
          { label: 'Urgent',         value: String(CASES.filter(c => c.status === 'Urgent').length),           accent: 'bg-red-500'   },
          { label: 'In Progress',    value: String(CASES.filter(c => c.status === 'In Progress').length),      accent: 'bg-amber-400' },
          { label: 'Resolved',       value: String(CASES.filter(c => c.status === 'Resolved').length),         accent: 'bg-green-500' },
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
            placeholder="Search by name, case ID or issue..."
            className={`${inputCls} w-full pl-8`}
          />
        </div>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={inputCls}>
          {['All Severity', 'High', 'Medium', 'Low'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {['All Status', 'Urgent', 'In Progress', 'Pending', 'Resolved', 'Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Cases list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-[12px] text-gray-400">No cases found. Try adjusting your filters.</p>
          </div>
        ) : (
          filtered.map((c) => <CaseCard key={c.id} c={c} />)
        )}
      </div>
    </div>
  );
}