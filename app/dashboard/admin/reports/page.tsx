'use client';

import { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type ReportPeriod = 'This Week' | 'This Month' | 'Last Month' | 'This Year';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  lastGenerated: string;
  size: string;
  type: 'PDF' | 'CSV' | 'XLSX';
  iconBg: string;
  iconEmoji: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const MONTHLY_TREND = [
  { month: 'Oct', cases: 28, sessions: 41, resolved: 22 },
  { month: 'Nov', cases: 35, sessions: 52, resolved: 29 },
  { month: 'Dec', cases: 19, sessions: 31, resolved: 16 },
  { month: 'Jan', cases: 42, sessions: 67, resolved: 38 },
  { month: 'Feb', cases: 58, sessions: 84, resolved: 51 },
  { month: 'Mar', cases: 61, sessions: 91, resolved: 55 },
  { month: 'Apr', cases: 47, sessions: 73, resolved: 39 },
];

const ISSUE_BREAKDOWN = [
  { label: 'Anxiety',           pct: 34, count: 48,  color: 'bg-blue-500'   },
  { label: 'Academic Stress',   pct: 27, count: 38,  color: 'bg-[#f5a623]' },
  { label: 'Depression',        pct: 18, count: 26,  color: 'bg-purple-500' },
  { label: 'Sleep Disorders',   pct: 11, count: 15,  color: 'bg-teal-500'   },
  { label: 'Other',             pct: 10, count: 14,  color: 'bg-gray-400'   },
];

const REPORT_CARDS: ReportCard[] = [
  { id: '1', title: 'Monthly Mental Health Summary',     description: 'Overview of cases, sessions, and outcomes for April 2026.',    lastGenerated: 'Apr 21, 2026', size: '2.4 MB', type: 'PDF',  iconBg: 'bg-red-50',    iconEmoji: '📄' },
  { id: '2', title: 'Counsellor Performance Report',     description: 'Individual counsellor session counts, ratings, and utilisation.', lastGenerated: 'Apr 20, 2026', size: '1.1 MB', type: 'XLSX', iconBg: 'bg-green-50',  iconEmoji: '📊' },
  { id: '3', title: 'Student Severity Distribution',     description: 'PHQ-9, GAD-7, and PSS score distributions across departments.',  lastGenerated: 'Apr 18, 2026', size: '890 KB', type: 'PDF',  iconBg: 'bg-blue-50',   iconEmoji: '📈' },
  { id: '4', title: 'Anonymous Session Analytics',       description: 'Trends in anonymous counselling usage and response times.',      lastGenerated: 'Apr 15, 2026', size: '560 KB', type: 'CSV',  iconBg: 'bg-amber-50',  iconEmoji: '🔒' },
  { id: '5', title: 'Resource Engagement Report',        description: 'Download counts, category popularity, and user engagement.',     lastGenerated: 'Apr 10, 2026', size: '340 KB', type: 'CSV',  iconBg: 'bg-purple-50', iconEmoji: '📚' },
  { id: '6', title: 'Platform Usage & Audit Summary',    description: 'Login activity, feature usage, and system health metrics.',      lastGenerated: 'Apr 01, 2026', size: '1.8 MB', type: 'PDF',  iconBg: 'bg-gray-50',   iconEmoji: '🔍' },
];

// ─────────────────────────────────────────────────────────────────────────────
// BAR CHART (pure CSS)
// ─────────────────────────────────────────────────────────────────────────────
function BarChart() {
  const maxVal = Math.max(...MONTHLY_TREND.map(d => d.sessions));
  return (
    <div className="flex items-end gap-2 h-36 pt-2">
      {MONTHLY_TREND.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '112px', justifyContent: 'flex-end' }}>
            {/* Sessions bar */}
            <div
              className="w-full rounded-t-md bg-[#1a5c2a] relative group cursor-default"
              style={{ height: `${(d.sessions / maxVal) * 100}%` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {d.sessions} sessions
              </div>
            </div>
          </div>
          <span className="text-[9.5px] text-gray-400 font-medium">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('This Month');

  const kpis = [
    { label: 'Total Cases',       value: '142',  delta: '+12', up: false, accent: 'bg-[#1a5c2a]' },
    { label: 'Sessions Conducted',value: '73',   delta: '+8',  up: true,  accent: 'bg-blue-500'  },
    { label: 'Resolved Cases',    value: '39',   delta: '+5',  up: true,  accent: 'bg-[#f5a623]' },
    { label: 'Avg. PHQ-9 Score',  value: '9.4',  delta: '-0.8',up: true,  accent: 'bg-red-500'   },
  ];

  return (
    <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px] leading-none">Reports</h2>
          <p className="text-[12px] text-gray-500 mt-1">Platform analytics and generated reports — April 2026</p>
        </div>
        <div className="flex gap-2">
          {(['This Week','This Month','Last Month','This Year'] as ReportPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`h-8 px-3 rounded-lg text-[11.5px] font-medium transition-colors border
                ${period === p ? 'bg-[#1a5c2a] text-white border-[#1a5c2a]' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${k.accent}`} />
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11.5px] text-gray-500">{k.label}</p>
              <span className={`text-[10px] font-semibold px-2 py-[2px] rounded-full ${k.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {k.delta}
              </span>
            </div>
            <p className="text-[28px] font-bold text-gray-900 leading-none tracking-tight">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4">

        {/* Sessions trend */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-semibold text-gray-900">Monthly Sessions Trend</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Oct 2025 – Apr 2026</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a5c2a]" /><span className="text-[10.5px] text-gray-400">Sessions</span></div>
            </div>
          </div>
          <BarChart />
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
            {MONTHLY_TREND.slice(-3).map((d) => (
              <div key={d.month} className="text-center">
                <p className="text-[10px] text-gray-400">{d.month}</p>
                <p className="text-[14px] font-bold text-gray-900 mt-0.5">{d.sessions}</p>
                <p className="text-[10px] text-green-600">{d.resolved} resolved</p>
              </div>
            ))}
          </div>
        </div>

        {/* Issue breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-[13px] font-semibold text-gray-900 mb-4">Issue Type Breakdown</h3>
          <div className="space-y-3">
            {ISSUE_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11.5px] text-gray-700 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] text-gray-400">{item.count} cases</span>
                    <span className="text-[11px] font-semibold text-gray-900">{item.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Summary insight */}
          <div className="mt-4 bg-[#e8f5ec] border border-[#b6dfc0] rounded-xl px-3.5 py-3">
            <p className="text-[10px] font-bold text-[#1a5c2a] uppercase tracking-wider mb-1">Key Finding</p>
            <p className="text-[11px] text-[#1a5c2a] leading-relaxed">
              Anxiety remains the top issue at 34%. Cases spike by 40% during exam periods — proactive group sessions recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Generated reports */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="text-[13px] font-semibold text-gray-900">Generated Reports</h3>
          <button className="flex items-center gap-1.5 h-8 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white rounded-lg px-3 text-[12px] font-medium transition-colors">
            + Generate New
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {REPORT_CARDS.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${r.iconBg}`}>
                {r.iconEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-900">{r.title}</p>
                <p className="text-[10.5px] text-gray-400 mt-0.5 truncate">{r.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10.5px] text-gray-500">{r.lastGenerated}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{r.size}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-[3px] rounded-md flex-shrink-0
                ${r.type === 'PDF' ? 'bg-red-50 text-red-600' : r.type === 'CSV' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {r.type}
              </span>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button className="h-7 px-3 bg-[#1a5c2a] text-white text-[11px] font-medium rounded-lg hover:bg-[#2d7a3e] transition-colors">Download</button>
                <button className="h-7 px-3 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-lg hover:bg-gray-200 transition-colors">Preview</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}