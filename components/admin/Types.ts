// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type Severity    = 'High' | 'Medium' | 'Low';
export type SessionType = 'Chat' | 'Physical' | 'Video';
export type UserRole    = 'Student' | 'Counsellor' | 'Admin';
export type UserStatus  = 'Active' | 'Inactive' | 'Suspended';
export type Trend       = 'up' | 'down' | 'neutral';

export interface StatCardData {
  value: string;
  label: string;
  sub: string;
  accentClass: string;
  iconBg: string;
  iconColor: string;
  iconKey: string;
  trend: Trend;
  trendLabel: string;
}

export interface RecentUser {
  id: string;
  name: string;
  initials: string;
  avatarStyle: string;
  department: string;
  level: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
}

export interface RecentSession {
  id: string;
  studentName: string;
  isAnonymous: boolean;
  initials: string;
  avatarStyle: string;
  counsellor: string;
  sessionType: SessionType;
  duration: string;
  date: string;
  severity: Severity;
}

export interface SystemAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  time: string;
}

export interface DeptInsight {
  dept: string;
  cases: number;
  pct: number;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
export const STAT_CARDS: StatCardData[] = [
  {
    value: '1,248', label: 'Registered Students', sub: '↑ 84 this month',
    accentClass: 'bg-[#1a5c2a]', iconBg: 'bg-[#e8f5ec]', iconColor: '#1a5c2a', iconKey: 'users',
    trend: 'up', trendLabel: '↑ 7.2%',
  },
  {
    value: '142', label: 'Active Cases', sub: '23 flagged as high severity',
    accentClass: 'bg-[#f5a623]', iconBg: 'bg-[#fdf3dc]', iconColor: '#d97706', iconKey: 'briefcase',
    trend: 'down', trendLabel: '↑ 12 new',
  },
  {
    value: '6', label: 'Counsellors Online', sub: '2 in active sessions',
    accentClass: 'bg-blue-500', iconBg: 'bg-blue-50', iconColor: '#2563eb', iconKey: 'headset',
    trend: 'neutral', trendLabel: '8 total',
  },
  {
    value: '37', label: 'Pending Requests', sub: 'Oldest: 3 days ago',
    accentClass: 'bg-red-500', iconBg: 'bg-red-50', iconColor: '#ef4444', iconKey: 'clock',
    trend: 'down', trendLabel: '↑ 5 today',
  },
];

export const RECENT_USERS: RecentUser[] = [
  { id: '1', name: 'Okonkwo Chukwuemeka', initials: 'OC', avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a] border-[#b6dfc0]', department: 'Computer Technology', level: 'ND2', role: 'Student', status: 'Active', joinedDate: 'Apr 21' },
  { id: '2', name: 'Fatima Abdullahi',    initials: 'FA', avatarStyle: 'bg-blue-50 text-blue-700 border-blue-100',        department: 'Mass Communication',    level: 'HND1', role: 'Student', status: 'Active', joinedDate: 'Apr 20' },
  { id: '3', name: 'Adewale Funmilayo',   initials: 'AF', avatarStyle: 'bg-purple-50 text-purple-700 border-purple-100',  department: 'Electrical Engineering', level: 'HND1', role: 'Student', status: 'Active', joinedDate: 'Apr 20' },
  { id: '4', name: 'Mr. Victor Alomaja',  initials: 'VA', avatarStyle: 'bg-[#fdf3dc] text-[#d97706] border-[#fde68a]',   department: 'Computer Technology',   level: '—',    role: 'Counsellor', status: 'Active', joinedDate: 'Mar 01' },
  { id: '5', name: 'Balogun Ifeoluwa',    initials: 'BI', avatarStyle: 'bg-green-50 text-green-700 border-green-100',     department: 'Business Administration', level: 'ND1', role: 'Student', status: 'Inactive', joinedDate: 'Apr 18' },
];

export const RECENT_SESSIONS: RecentSession[] = [
  { id: '1', studentName: 'Nwosu Tochukwu',    isAnonymous: false, initials: 'NT', avatarStyle: 'bg-[#e8f5ec] text-[#1a5c2a]',    counsellor: 'Mr. Alomaja', sessionType: 'Chat',     duration: '45 min', date: 'Today · 10:00 AM', severity: 'Medium' },
  { id: '2', studentName: 'ANON-48392',          isAnonymous: true,  initials: 'AN', avatarStyle: 'bg-[#fdf3dc] text-[#d97706]',    counsellor: 'Mrs. Bello',  sessionType: 'Chat',     duration: '30 min', date: 'Today · 09:15 AM', severity: 'High'   },
  { id: '3', studentName: 'Fatima Abdullahi',   isAnonymous: false, initials: 'FA', avatarStyle: 'bg-blue-50 text-blue-700',         counsellor: 'Mr. Alomaja', sessionType: 'Physical', duration: '60 min', date: 'Apr 20 · 11:30 AM', severity: 'Low'    },
  { id: '4', studentName: 'Eze Chidera',         isAnonymous: false, initials: 'EC', avatarStyle: 'bg-purple-50 text-purple-700',    counsellor: 'Dr. Fashola', sessionType: 'Video',    duration: '50 min', date: 'Apr 20 · 02:00 PM', severity: 'Medium' },
];

export const SYSTEM_ALERTS: SystemAlert[] = [
  { id: '1', type: 'critical', title: 'High-severity case unattended', description: 'ANON-48392 has been waiting 4+ hours with a high severity flag.', time: '2 min ago' },
  { id: '2', type: 'warning',  title: 'Counsellor capacity at 90%',    description: 'Mr. Alomaja has reached 90% of his weekly session limit.',       time: '1 hr ago'  },
  { id: '3', type: 'info',     title: 'Monthly report ready',           description: 'The April mental health trend report has been generated.',        time: '3 hrs ago' },
];

export const DEPT_INSIGHTS: DeptInsight[] = [
  { dept: 'Computer Technology',    cases: 38, pct: 78, color: 'bg-[#1a5c2a]'  },
  { dept: 'Electrical Engineering', cases: 27, pct: 55, color: 'bg-blue-500'    },
  { dept: 'Business Administration',cases: 22, pct: 45, color: 'bg-[#f5a623]'  },
  { dept: 'Mass Communication',     cases: 18, pct: 37, color: 'bg-purple-500'  },
  { dept: 'Food Technology',        cases: 12, pct: 25, color: 'bg-red-400'     },
];