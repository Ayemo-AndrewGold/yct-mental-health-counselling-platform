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
  assignedTo: string;
  openedDate: string;
  status: CaseStatus;
  phq9: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const CASES: Case[] = [
  { id: '1', caseId: '#CASE-0041', studentName: 'Adewale Funmilayo',    isAnonymous: false, initials: 'AF', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100', department: 'Electrical Engineering', level: 'HND1', issueType: 'Severe Anxiety',       severity: 'High',   assignedTo: 'Mr. Alomaja', openedDate: 'Apr 20', status: 'In Progress', phq9: 18 },
  { id: '2', caseId: '#CASE-0039', studentName: 'ANON-48392',            isAnonymous: true,  initials: 'AN', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',   department: '',                       level: '',     issueType: 'Sleep & Depression',   severity: 'High',   assignedTo: 'Mrs. Bello',  openedDate: 'Apr 21', status: 'Urgent',      phq9: 21 },
  { id: '3', caseId: '#CASE-0037', studentName: 'Okonkwo Chukwuemeka',  isAnonymous: false, initials: 'OC', avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a] border-[#b6dfc0]',  department: 'Computer Technology',    level: 'ND2',  issueType: 'Academic Stress',      severity: 'Medium', assignedTo: 'Mr. Alomaja', openedDate: 'Apr 19', status: 'In Progress', phq9: 14 },
  { id: '4', caseId: '#CASE-0035', studentName: 'ANON-71204',            isAnonymous: true,  initials: 'AN', avatarStyle: 'bg-amber-50 text-amber-700 border-amber-100',   department: '',                       level: '',     issueType: 'Exam Anxiety',         severity: 'Medium', assignedTo: 'Dr. Fashola', openedDate: 'Apr 19', status: 'Pending',     phq9: 11 },
  { id: '5', caseId: '#CASE-0034', studentName: 'Fatima Abdullahi',     isAnonymous: false, initials: 'FA', avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',        department: 'Mass Communication',    level: 'HND1', issueType: 'Anxiety',              severity: 'Medium', assignedTo: 'Dr. Fashola', openedDate: 'Apr 18', status: 'Resolved',    phq9: 8  },
  { id: '6', caseId: '#CASE-0031', studentName: 'Balogun Ifeoluwa',     isAnonymous: false, initials: 'BI', avatarStyle: 'bg-green-50 text-green-700 border-green-100',    department: 'Business Administration',level: 'ND1',  issueType: 'Low Mood',             severity: 'Low',    assignedTo: 'Miss Okafor', openedDate: 'Apr 17', status: 'Resolved',    phq9: 4  },
  { id: '7', caseId: '#CASE-0029', studentName: 'Nwosu Tochukwu',       isAnonymous: false, initials: 'NT', avatarStyle: 'bg-red-50 text-red-700 border-red-100',          department: 'Computer Technology',    level: 'ND2',  issueType: 'Suicidal Ideation',    severity: 'High',   assignedTo: 'Mrs. Bello',  openedDate: 'Apr 15', status: 'In Progress', phq9: 24 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { cls: string; dot: string }> = {
    High:   { cls: 'bg-red-50 text-red-700',    dot: 'bg-red-600'   },
    Medium: { cls: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
    Low:    { cls: 'bg-green-50 text-green-700', dot: 'bg-green-600' },
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
    Urgent:      'bg-red-50 text-red-700',
    'In Progress': 'bg-amber-50 text-amber-700',
    Pending:     'bg-blue-50 text-blue-700',
    Resolved:    'bg-green-50 text-green-700',
    Closed:      'bg-gray-100 text-gray-500',
  };
  return <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${map[status]}`}>{status}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminCasesPage() {
  const [search, setSearch]     = useState('');
  const [severity, setSeverity] = useState('All Severity');
  const [assignee, setAssignee] = useState('All Counsellors');
  const [status, setStatus]     = useState('All Status');

  const filtered = CASES.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.studentName.toLowerCase().includes(q) || c.caseId.toLowerCase().includes(q) || c.issueType.toLowerCase().includes(q);
    const matchSev    = severity  === 'All Severity'    || c.severity   === severity;
    const matchAssign = assignee  === 'All Counsellors' || c.assignedTo === assignee;
    const matchStatus = status    === 'All Status'      || c.status     === status;
    return matchSearch && matchSev && matchAssign && matchStatus;
  });

  const inputCls = 'h-[34px] border border-gray-200 rounded-lg px-3 text-[12px] text-gray-700 bg-white focus:outline-none focus:border-[#1a5c2a] transition';

  const statCards = [
    { label: 'High Severity',      value: String(CASES.filter(c => c.severity === 'High').length),   accent: 'bg-red-500'   },
    { label: 'Medium Severity',    value: String(CASES.filter(c => c.severity === 'Medium').length), accent: 'bg-[#f5a623]' },
    { label: 'Low Severity',       value: String(CASES.filter(c => c.severity === 'Low').length),    accent: 'bg-[#1a5c2a]' },
    { label: 'Pending Assignment', value: String(CASES.filter(c => c.status === 'Pending').length),  accent: 'bg-blue-500'  },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Cases</h2>
          <p className="text-[12px] text-gray-500 mt-1">{filtered.length} cases shown · {CASES.filter(c => c.severity === 'High').length} flagged as high severity</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 h-8 border border-gray-100 rounded-lg px-3 bg-white hover:bg-gray-50 text-[12px] text-gray-500 font-medium transition-colors">Export</button>
          <button className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors">+ New Case</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {statCards.map((s) => (
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or case ID..." className={`${inputCls} w-full pl-8`} />
        </div>
        <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={inputCls}>
          {['All Severity', 'High', 'Medium', 'Low'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className={inputCls}>
          {['All Counsellors', 'Mr. Alomaja', 'Mrs. Bello', 'Dr. Fashola', 'Miss Okafor'].map((a) => <option key={a}>{a}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {['All Status', 'Urgent', 'In Progress', 'Pending', 'Resolved', 'Closed'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Case ID', 'Student', 'Issue Type', 'PHQ-9', 'Severity', 'Assigned To', 'Opened', 'Status', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-3 font-mono text-[11px] text-gray-400 font-semibold">{c.caseId}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-[1.5px] ${c.avatarStyle}`}>
                      {c.initials}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-gray-900">{c.studentName}</p>
                      <p className="text-[10.5px] text-gray-400">
                        {c.isAnonymous ? 'Anonymous session' : `${c.department} · ${c.level}`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-gray-700 max-w-[160px] truncate">{c.issueType}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-bold ${c.phq9 >= 20 ? 'text-red-600' : c.phq9 >= 10 ? 'text-amber-600' : 'text-green-600'}`}>
                    {c.phq9}
                  </span>
                </td>
                <td className="px-4 py-3"><SeverityBadge severity={c.severity} /></td>
                <td className="px-4 py-3 text-[12px] text-gray-600">{c.assignedTo}</td>
                <td className="px-4 py-3 text-[12px] text-gray-400">{c.openedDate}</td>
                <td className="px-4 py-3"><CaseStatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="h-6 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10.5px] font-medium rounded-md transition-colors">View</button>
                    <button className="h-6 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10.5px] font-medium rounded-md transition-colors">Assign</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-[12px] font-medium text-gray-500">No cases found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Try adjusting your filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}