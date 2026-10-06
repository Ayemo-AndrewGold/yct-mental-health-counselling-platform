'use client';

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// 50 COUNSELLORS
// ─────────────────────────────────────────────────────────────────────────────
const COUNSELLORS = [
  { full_name: 'Dr. Adaeze Okonkwo',       specialisation: 'Academic Stress & Anxiety'                  },
  { full_name: 'Mr. Emeka Nwosu',          specialisation: 'Depression & Mood Disorders'                 },
  { full_name: 'Mrs. Fatima Abdullahi',    specialisation: 'Crisis Intervention'                         },
  { full_name: 'Dr. Chukwuemeka Eze',      specialisation: 'Suicidal Ideation & Safety Planning'         },
  { full_name: 'Ms. Aisha Bello',          specialisation: 'Anxiety & Panic Disorders'                   },
  { full_name: 'Mr. Seun Adeyemi',         specialisation: 'Substance Abuse Counselling'                 },
  { full_name: 'Mrs. Ngozi Okafor',        specialisation: 'Grief & Bereavement'                         },
  { full_name: 'Dr. Tunde Lawal',          specialisation: 'Relationship & Family Issues'                },
  { full_name: 'Ms. Kemi Adeleke',         specialisation: 'Self-Esteem & Identity'                      },
  { full_name: 'Mr. Biodun Olawale',       specialisation: 'Trauma & PTSD'                               },
  { full_name: 'Mrs. Amaka Nwachukwu',     specialisation: 'Sleep Disorders & Stress'                    },
  { full_name: 'Dr. Yusuf Ibrahim',        specialisation: 'Attention Deficit & Learning Difficulties'   },
  { full_name: 'Ms. Chidinma Obi',         specialisation: 'Social Anxiety & Phobias'                    },
  { full_name: 'Mr. Victor Alomaja',       specialisation: 'Academic Performance Counselling'             },
  { full_name: 'Mrs. Blessing Eniola',     specialisation: 'Eating Disorders & Body Image'                },
  { full_name: 'Dr. Kunle Fashola',        specialisation: 'Generalised Anxiety Disorder'                 },
  { full_name: 'Ms. Rukayat Suleiman',     specialisation: 'Peer Pressure & Bullying'                    },
  { full_name: 'Mr. Emeka Osei',           specialisation: 'Career Counselling & Motivation'              },
  { full_name: 'Mrs. Toyin Babatunde',     specialisation: 'Domestic Abuse Counselling'                   },
  { full_name: 'Dr. Samuel Ehigie',        specialisation: 'Psychosis & Severe Mental Illness'            },
  { full_name: 'Ms. Hafsat Musa',          specialisation: 'Cultural & Religious Adjustment'              },
  { full_name: 'Mr. Taiwo Ogundimu',       specialisation: 'Financial Stress & Poverty'                  },
  { full_name: 'Mrs. Chinwe Nzeka',        specialisation: 'Depression & Loneliness'                     },
  { full_name: 'Dr. Olumide Bakare',       specialisation: 'Mindfulness & Cognitive Behavioural Therapy' },
  { full_name: 'Ms. Ifeoma Ugwu',          specialisation: 'Anger Management'                            },
  { full_name: 'Mr. Babatunde Salako',     specialisation: 'Anxiety & Academic Burnout'                  },
  { full_name: 'Mrs. Adunola Adebakin',    specialisation: 'Sexual Health & Relationships'                },
  { full_name: 'Dr. Nkechi Okonkwo',       specialisation: 'Postpartum & Women\'s Mental Health'         },
  { full_name: 'Mr. Femi Adebisi',         specialisation: 'Addiction & Recovery Counselling'             },
  { full_name: 'Ms. Zainab Yusuf',         specialisation: 'Stress Resilience & Coping Skills'            },
  { full_name: 'Mrs. Patience Ogu',        specialisation: 'Childhood Trauma & Abuse Recovery'            },
  { full_name: 'Dr. Kayode Adeleke',       specialisation: 'Neurodevelopmental Disorders'                 },
  { full_name: 'Mr. Chibuzo Eze',          specialisation: 'Crisis Intervention & Hotline Support'        },
  { full_name: 'Ms. Funmi Oladapo',        specialisation: 'Depression & Social Withdrawal'               },
  { full_name: 'Mrs. Hadiza Shehu',        specialisation: 'Emotional Regulation & DBT'                   },
  { full_name: 'Dr. Obiora Aneke',         specialisation: 'Psychosomatic Disorders'                      },
  { full_name: 'Mr. Gbenga Adeyinka',      specialisation: 'Exam Anxiety & Test Stress'                   },
  { full_name: 'Ms. Adaeze Ibe',           specialisation: 'Grief Counselling & Loss'                     },
  { full_name: 'Mrs. Suliat Balogun',      specialisation: 'Bipolar Disorder & Mood Swings'               },
  { full_name: 'Dr. Osita Nzeka',          specialisation: 'Schizophrenia & Psychotic Disorders'          },
  { full_name: 'Mr. Dare Akinwale',        specialisation: 'Phobias & Exposure Therapy'                   },
  { full_name: 'Ms. Chioma Okonkwo',       specialisation: 'Adjustment Disorder & Life Transitions'       },
  { full_name: 'Mrs. Bimbo Ajibade',       specialisation: 'Interpersonal Therapy & Social Skills'        },
  { full_name: 'Dr. Taiwo Damilola',       specialisation: 'Obsessive Compulsive Disorder'                },
  { full_name: 'Mr. Rotimi Fadeyi',        specialisation: 'Depression & Suicidal Prevention'             },
  { full_name: 'Ms. Nneka Okezie',         specialisation: 'Sexual Abuse & Trauma Recovery'               },
  { full_name: 'Mrs. Folake Adeleye',      specialisation: 'Parenting & Family Stress'                    },
  { full_name: 'Dr. Ezeobiora Chukwu',     specialisation: 'Personality Disorders'                        },
  { full_name: 'Mr. Segun Olawumi',        specialisation: 'Mindfulness-Based Stress Reduction'           },
  { full_name: 'Ms. Uche Okafor',          specialisation: 'Academic Failure & Dropout Prevention'        },
];

// ─────────────────────────────────────────────────────────────────────────────
// 500 STUDENTS — Nigerian names across YCT departments & levels
// ─────────────────────────────────────────────────────────────────────────────
const FIRST_NAMES = [
  'Adaeze','Emeka','Fatima','Chukwuemeka','Aisha','Seun','Ngozi','Tunde','Kemi','Biodun',
  'Amaka','Yusuf','Chidinma','Victor','Blessing','Kunle','Rukayat','Gbenga','Toyin','Samuel',
  'Hafsat','Taiwo','Chinwe','Olumide','Ifeoma','Babatunde','Adunola','Nkechi','Femi','Zainab',
  'Patience','Kayode','Chibuzo','Funmi','Hadiza','Obiora','Dare','Chioma','Bimbo','Nneka',
  'Folake','Ezeobiora','Segun','Uche','Chidi','Amara','Jide','Opeyemi','Sola','Bola',
  'Ade','Olu','Dami','Temi','Yemi','Bisi','Wole','Lekan','Tope','Lola',
  'Dele','Seyi','Remi','Ayo','Lanre','Gbemi','Tobi','Wemi','Dayo','Nike',
  'Shade','Sade','Ronke','Bunmi','Yinka','Deji','Tunji','Kolade','Dapo','Goke',
  'Akin','Tokunbo','Dupe','Yetunde','Modupe','Abike','Kehinde','Taiwo','Temitope','Iyabo',
  'Rasaki','Jamiu','Wasiu','Kazeem','Lawal','Mukaila','Sulaimon','Taofik','Raheem','Bashir',
  'Musa','Usman','Abdullahi','Sadiya','Asmau','Hauwa','Khadija','Mariam','Zahra','Halima',
  'Chinyere','Obiageli','Uchechi','Adaora','Chiamaka','Uchenna','Ifunanya','Oluchi','Ebele','Nma',
  'Ikenna','Obinna','Onyeka','Ugochukwu','Chinedu','Nnamdi','Chukwudi','Ogechukwu','Somto','Kosi',
  'Effiong','Bassey','Asuquo','Etim','Okon','Edet','Inyang','Nsikak','Eno','Arit',
  'Ovie','Oghene','Erhiurhoro','Okoro','Edafe','Ejiro','Ese','Ufuoma','Oghenerukewe','Emakuwe',
  'Isioma','Ifeanyi','Onyedika','Chukwuebuka','Amaechi','Obioma','Tobechukwu','Adachukwu','Chizaram','Ebelechukwu',
  'Pelumi','Ireoluwa','Ayomide','Moyinoluwa','Oluwatimilehin','Oluwafunmilayo','Oluwatosin','Oluwasegun','Oluwakemi','Oluwabunmi',
  'Abimbola','Adewunmi','Adedayo','Adeola','Adeyemi','Adewale','Adebimpe','Adebayo','Adebola','Adekunle',
  'Ifedayo','Ifeoluwa','Ifedolapo','Ifedayo','Adefunke','Adefola','Adesola','Adetola','Adetayo','Adeyinka',
  'Grace','Faith','Hope','Joy','Mercy','Peace','Patience','Charity','Glory','Goodness',
];

const LAST_NAMES = [
  'Okonkwo','Nwosu','Abdullahi','Eze','Bello','Adeyemi','Okafor','Lawal','Adeleke','Olawale',
  'Nwachukwu','Ibrahim','Obi','Alomaja','Eniola','Fashola','Suleiman','Osei','Babatunde','Ehigie',
  'Musa','Ogundimu','Nzeka','Bakare','Ugwu','Salako','Adebakin','Okonkwo','Adebisi','Yusuf',
  'Ogu','Adeleke','Eze','Oladapo','Shehu','Aneke','Adeyinka','Ibe','Balogun','Nzeka',
  'Akinwale','Okonkwo','Ajibade','Damilola','Fadeyi','Okezie','Adeleye','Chukwu','Olawumi','Okafor',
  'Nweke','Ugwu','Eze','Obi','Chukwu','Nwosu','Okafor','Okonkwo','Eze','Nwosu',
  'Adeyemo','Adewale','Adelaja','Adewumi','Adeniyi','Adetunji','Adebisi','Adedeji','Adekola','Adekunbi',
  'Olayinka','Olawuyi','Olasinde','Olatunji','Olawumi','Oladeji','Olayemi','Olanrewaju','Olawoye','Olajide',
  'Abubakar','Usman','Garba','Sani','Bello','Umar','Aliyu','Mohammed','Hassan','Idris',
  'Bassey','Effiong','Okon','Edet','Inyang','Etim','Asuquo','Nsikak','Eno','Ekaette',
  'Okoro','Ovie','Oghene','Edafe','Ejiro','Ese','Ufuoma','Edjere','Emakuwe','Oghenekevwe',
  'Olusegun','Oluwaseun','Oluwafemi','Oluwaseyi','Oluwatobi','Oluwakayode','Oluwatunde','Oluwatoyin','Oluwabukola','Oluwakemi',
];

const DEPARTMENTS = [
  'Computer Technology',
  'Electrical Engineering',
  'Mass Communication',
  'Business Administration',
  'Accountancy',
  'Food Technology',
  'Science Lab Technology',
  'Civil Engineering',
  'Mechanical Engineering',
  'Marketing',
  'Banking and Finance',
  'Hospitality Management',
];

const LEVELS = ['ND1FT','ND1PT','ND2FT','ND2PT','HND1FT','HND1PT','HND2FT','HND2PT'];

function randItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function pad(n: number, len: number): string { return String(n).padStart(len, '0'); }

function generateStudents(count: number) {
  const seen = new Set<string>();
  const list = [];
  let i = 0;
  while (list.length < count) {
    i++;
    const fn = randItem(FIRST_NAMES);
    const ln = randItem(LAST_NAMES);
    const full_name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}${ln.toLowerCase().slice(0,3)}${pad(list.length + 1, 3)}@yabatech.edu.ng`;
    if (seen.has(email)) continue;
    seen.add(email);
    const year = 23;
    const matric = `P/ND/${year}/${pad(3210000 + list.length + 1, 7)}`;
    const dept  = randItem(DEPARTMENTS);
    const level = randItem(LEVELS);
    list.push({ full_name, email, matric_number: matric, department: dept, level });
  }
  return list;
}

// Generate once at module level so it stays stable
const STUDENTS = generateStudents(500);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function makeEmail(fullName: string): string {
  const cleaned = fullName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim();
  const firstName = cleaned.split(' ')[0].toLowerCase();
  return `${firstName}@yabatech.edu.ng`;
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
    theadBg:       dark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    rowHover:      dark ? 'rgba(255,255,255,0.04)' : '#f9fafb',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    amberBg:       dark ? 'rgba(245,166,35,0.18)'  : '#fffbeb',
    amberBorder:   dark ? 'rgba(245,166,35,0.30)'  : '#fde68a',
    amberText:     dark ? '#fde68a'                : '#92400e',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type RunStatus = 'idle' | 'running' | 'done';
type RowState  = 'pending' | 'running' | 'ok' | 'skip' | 'error';

interface SeedRow {
  index: number;
  label: string;        // display name
  email: string;
  sub: string;          // specialisation or dept+level
  state: RowState;
  message: string;
}

export default function AdminSeedPage() {
  const t = useTheme();
  const [tab, setTab] = useState<'counsellors' | 'students'>('counsellors');

  // ── Counsellor rows ──
  const [cRows, setCRows] = useState<SeedRow[]>(
    COUNSELLORS.map((c, i) => ({
      index: i, label: c.full_name, email: makeEmail(c.full_name),
      sub: c.specialisation, state: 'pending', message: '',
    }))
  );
  const [cStatus,    setCStatus]    = useState<RunStatus>('idle');
  const [cCurrent,   setCCurrent]   = useState(-1);
  const [cOk,  setCOk]  = useState(0);
  const [cSkip,setCSkip]= useState(0);
  const [cErr, setCErr] = useState(0);

  // ── Student rows ──
  const [sRows, setSRows] = useState<SeedRow[]>(
    STUDENTS.map((s, i) => ({
      index: i, label: s.full_name, email: s.email,
      sub: `${s.department} · ${s.level} · ${s.matric_number}`,
      state: 'pending', message: '',
    }))
  );
  const [sStatus,  setSStatus]  = useState<RunStatus>('idle');
  const [sCurrent, setSCurrent] = useState(-1);
  const [sOk,  setSOk]  = useState(0);
  const [sSkip,setSSkip]= useState(0);
  const [sErr, setSErr] = useState(0);

  // ─── Run counsellors ────────────────────────────────────────────────────────
  async function runCounsellors() {
    setCStatus('running'); setCOk(0); setCSkip(0); setCErr(0);
    for (let i = 0; i < COUNSELLORS.length; i++) {
      const c = COUNSELLORS[i];
      const email = makeEmail(c.full_name);
      setCCurrent(i);
      setCRows(prev => prev.map(r => r.index === i ? { ...r, state: 'running', message: 'Creating…' } : r));
      try {
        const res = await fetchWithAuth('/create-counsellor/', {
          method: 'POST',
          body: JSON.stringify({ full_name: c.full_name, email, password: '123456789', role: 'counsellor' }),
        });
        if (res.ok) {
          setCRows(prev => prev.map(r => r.index === i ? { ...r, state: 'ok', message: 'Created' } : r));
          setCOk(n => n + 1);
        } else {
          const data = await res.json().catch(() => ({}));
          const msg = data?.email?.[0] ?? data?.error ?? `HTTP ${res.status}`;
          const isSkip = res.status === 400 || msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists');
          setCRows(prev => prev.map(r => r.index === i ? { ...r, state: isSkip ? 'skip' : 'error', message: isSkip ? 'Already exists' : msg } : r));
          if (isSkip) setCSkip(n => n + 1); else setCErr(n => n + 1);
        }
      } catch (err: any) {
        setCRows(prev => prev.map(r => r.index === i ? { ...r, state: 'error', message: err?.message ?? 'Network error' } : r));
        setCErr(n => n + 1);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    setCCurrent(-1); setCStatus('done');
  }

  // ─── Run students ───────────────────────────────────────────────────────────
  async function runStudents() {
    setSStatus('running'); setSOk(0); setSSkip(0); setSErr(0);
    for (let i = 0; i < STUDENTS.length; i++) {
      const s = STUDENTS[i];
      setSCurrent(i);
      setSRows(prev => prev.map(r => r.index === i ? { ...r, state: 'running', message: 'Creating…' } : r));
      try {
        const res = await fetchWithAuth('/register/', {
          method: 'POST',
          body: JSON.stringify({
            full_name:      s.full_name,
            email:          s.email,
            password:       '123456789',
            matric_number:  s.matric_number,
            department:     s.department,
            level:          s.level,
            role:           'student',
          }),
        });
        if (res.ok) {
          setSRows(prev => prev.map(r => r.index === i ? { ...r, state: 'ok', message: 'Created' } : r));
          setSOk(n => n + 1);
        } else {
          const data = await res.json().catch(() => ({}));
          const msg = data?.email?.[0] ?? data?.matric_number?.[0] ?? data?.error ?? data?.detail ?? `HTTP ${res.status}`;
          const isSkip = res.status === 400 || msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists');
          setSRows(prev => prev.map(r => r.index === i ? { ...r, state: isSkip ? 'skip' : 'error', message: isSkip ? 'Already exists' : msg } : r));
          if (isSkip) setSSkip(n => n + 1); else setSErr(n => n + 1);
        }
      } catch (err: any) {
        setSRows(prev => prev.map(r => r.index === i ? { ...r, state: 'error', message: err?.message ?? 'Network error' } : r));
        setSErr(n => n + 1);
      }
      // Small delay — don't hammer the API
      await new Promise(r => setTimeout(r, 80));
    }
    setSCurrent(-1); setSStatus('done');
  }

  // ─── Derived state ──────────────────────────────────────────────────────────
  const rows    = tab === 'counsellors' ? cRows    : sRows;
  const status  = tab === 'counsellors' ? cStatus  : sStatus;
  const current = tab === 'counsellors' ? cCurrent : sCurrent;
  const ok      = tab === 'counsellors' ? cOk      : sOk;
  const skip    = tab === 'counsellors' ? cSkip    : sSkip;
  const err     = tab === 'counsellors' ? cErr     : sErr;
  const total   = rows.length;
  const pct     = total > 0 ? Math.round((ok / total) * 100) : 0;

  const stateStyle: Record<RowState, { bg: string; text: string; label: string }> = {
    pending: { bg: t.dark ? 'rgba(255,255,255,0.05)':'#f3f4f6', text: t.textMuted,              label: '·' },
    running: { bg: t.amberBg,                                   text: t.amberText,              label: '⟳' },
    ok:      { bg: t.greenBg,                                   text: t.greenText,              label: '✓' },
    skip:    { bg: t.dark ? 'rgba(59,130,246,0.18)':'#eff6ff',  text: t.dark ? '#93c5fd':'#1d4ed8', label: '↷' },
    error:   { bg: t.dark ? 'rgba(239,68,68,0.18)':'#fef2f2',   text: t.dark ? '#fca5a5':'#b91c1c', label: '✗' },
  };

  return (
    <div className="px-4 sm:px-6 py-6 pb-12 space-y-6 font-[lexend]">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight font-[syne]" style={{ color: t.textPrimary }}>
            Seed Demo Data
          </h2>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>
            Register 50 counsellors and 500 students on the backend for demo/pitch purposes.
          </p>
        </div>
        <Link href="/dashboard/admin"
          className="h-11 px-5 rounded-xl text-[14px] font-semibold transition font-[lexend] flex items-center"
          style={{ border: `1px solid ${t.cardBorder}`, color: t.textSecondary, background: t.cardBg }}>
          ← Back
        </Link>
      </div>

      {/* ── Info banner ── */}
      <div className="rounded-2xl px-6 py-5"
        style={{ background: 'linear-gradient(120deg, #1a5c2a 0%, #008751 60%, #005c38 100%)' }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { label: 'Counsellors to add', value: '50'                          },
            { label: 'Students to add',    value: '500'                         },
            { label: 'Default password',   value: '123456789'                   },
            { label: 'Email pattern',      value: 'name@yabatech.edu.ng'        },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[12px] text-white/50 uppercase tracking-wider font-[lexend] mb-1">{item.label}</p>
              <p className="text-[17px] font-bold text-white font-[syne]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 rounded-2xl p-1.5 w-fit"
        style={{ background: t.dark ? 'rgba(255,255,255,0.06)':'#f3f4f6', border: `1px solid ${t.cardBorder}` }}>
        {(['counsellors','students'] as const).map(tb => (
          <button key={tb} onClick={() => setTab(tb)}
            className="px-6 py-2.5 rounded-xl text-[14px] font-semibold font-[lexend] transition-all"
            style={tab === tb
              ? { background: '#008751', color: '#ffffff' }
              : { color: t.textMuted, background: 'transparent' }
            }>
            {tb === 'counsellors' ? `👨‍⚕️ Counsellors (${COUNSELLORS.length})` : `🎓 Students (${STUDENTS.length})`}
          </button>
        ))}
      </div>

      {/* ── Progress card ── */}
      <div className="rounded-2xl p-6 space-y-5"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>

        {/* Count boxes */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Created',   value: ok,               color: t.greenText, bg: t.greenBg  },
            { label: 'Skipped',   value: skip,             color: t.dark ? '#93c5fd':'#1d4ed8', bg: t.dark ? 'rgba(59,130,246,0.18)':'#eff6ff' },
            { label: 'Errors',    value: err,              color: t.dark ? '#fca5a5':'#b91c1c', bg: t.dark ? 'rgba(239,68,68,0.18)':'#fef2f2'  },
            { label: 'Remaining', value: Math.max(0, total - ok - skip - err), color: t.textMuted, bg: t.dark ? 'rgba(255,255,255,0.05)':'#f3f4f6' },
          ].map(item => (
            <div key={item.label} className="rounded-xl p-4 text-center"
              style={{ background: item.bg }}>
              <p className="text-[28px] font-bold font-[syne]" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[13px] font-[lexend] mt-1" style={{ color: item.color }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {status !== 'idle' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>
                {status === 'done'
                  ? `✓ Finished — ${ok} created, ${skip} skipped, ${err} errors`
                  : `Processing ${current + 1} of ${total}…`}
              </span>
              <span className="text-[15px] font-bold font-[syne]" style={{ color: t.greenText }}>{pct}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden"
              style={{ background: t.dark ? 'rgba(255,255,255,0.10)':'#f3f4f6' }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${pct}%`, background: '#008751' }} />
            </div>
          </div>
        )}

        {/* Action */}
        <div className="flex items-center gap-4 flex-wrap">
          {status === 'idle' && (
            <button
              onClick={tab === 'counsellors' ? runCounsellors : runStudents}
              className="h-12 px-8 rounded-xl text-[15px] font-semibold font-[lexend] transition"
              style={{ background: '#1a5c2a', color: '#ffffff' }}>
              🚀 Create All {total} {tab === 'counsellors' ? 'Counsellors' : 'Students'}
            </button>
          )}
          {status === 'running' && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: t.greenText }} />
              <span className="text-[14px] font-[lexend]" style={{ color: t.textSecondary }}>
                Running… keep this tab open
              </span>
            </div>
          )}
          {status === 'done' && (
            <>
              <div className="flex items-center gap-2 rounded-xl px-5 py-3"
                style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
                <span className="text-[18px]">🎉</span>
                <span className="text-[14px] font-semibold font-[lexend]" style={{ color: t.greenText }}>
                  Done! {ok} created · {skip} already existed · {err} errors
                </span>
              </div>
              <Link
                href={tab === 'counsellors' ? '/dashboard/admin/counsellors' : '/dashboard/admin/students'}
                className="h-12 px-6 rounded-xl text-[15px] font-semibold font-[lexend] transition flex items-center"
                style={{ background: '#1a5c2a', color: '#ffffff' }}>
                View {tab === 'counsellors' ? 'Counsellors' : 'Students'} →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Preview table ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>

        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div>
            <h3 className="text-[17px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>
              {tab === 'counsellors' ? 'Counsellors Preview' : 'Students Preview'}
            </h3>
            <p className="text-[13px] mt-0.5 font-[lexend]" style={{ color: t.textMuted }}>
              Password: <strong>123456789</strong> · Showing first 50 of {total}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: t.theadBg, borderBottom: `1px solid ${t.divider}` }}>
                {['#', 'Name', 'Email', tab === 'counsellors' ? 'Specialisation' : 'Dept · Level · Matric', 'Status'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider font-[lexend]"
                    style={{ color: t.textMuted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 50).map(row => {
                const s = stateStyle[row.state];
                const isActive = row.index === current;
                const initials = row.label.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/i,'')
                  .split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                return (
                  <tr key={row.index}
                    style={{
                      borderBottom: `1px solid ${t.divider}`,
                      background: isActive ? (t.dark ? 'rgba(245,166,35,0.08)':'#fffbeb') : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.rowHover; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-mono" style={{ color: t.textMuted }}>{row.index + 1}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={{ background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }}>
                          {initials}
                        </div>
                        <span className="text-[14px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                          {row.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-mono" style={{ color: t.textMuted }}>{row.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-[lexend]" style={{ color: t.textSecondary }}>{row.sub}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full font-[lexend]"
                        style={{ background: s.bg, color: s.text }}>
                        {s.label} {
                          row.state === 'running' ? 'Creating…' :
                          row.state === 'ok'      ? 'Created'   :
                          row.state === 'skip'    ? 'Already exists' :
                          row.state === 'error'   ? row.message :
                          'Waiting'
                        }
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {total > 50 && (
          <div className="px-6 py-4 text-center" style={{ borderTop: `1px solid ${t.divider}` }}>
            <p className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>
              + {total - 50} more {tab} not shown in preview. All {total} will be created when you click the button.
            </p>
          </div>
        )}
      </div>

      {/* ── Warning ── */}
      <div className="rounded-2xl px-6 py-4 flex items-start gap-3"
        style={{ background: t.amberBg, border: `1px solid ${t.amberBorder}` }}>
        <svg className="w-5 h-5 shrink-0 mt-0.5" style={{ color: t.amberText }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p className="text-[14px] leading-relaxed font-[lexend]" style={{ color: t.amberText }}>
          <strong>Important:</strong> These are real accounts registered on the backend.
          Accounts that already exist will be skipped automatically — it is safe to run multiple times.
          Advise all users to change their password after first login.
          This page is only accessible to Super Administrators.
        </p>
      </div>
    </div>
  );
}
