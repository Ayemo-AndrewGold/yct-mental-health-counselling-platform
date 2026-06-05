'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ChevronRight, Sparkles, HeartPulse,
  Brain, Activity, ChevronLeft,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type AssessmentType = 'PHQ-9' | 'GAD-7' | 'PSS';

interface Question { id: number; text: string }

interface Assessment {
  id: AssessmentType;
  title: string;
  fullTitle: string;
  desc: string;
  duration: string;
  accentKey: 'purple' | 'blue' | 'amber';
  icon: React.ElementType;
  questions: Question[];
  options: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCENT PALETTE  (mirrors overview's ACCENT + QA_ACCENT)
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT = {
  purple: { bg: '#f3f1fe', border: '#c9c4f4', icon: '#7F77DD', label: '#26215C', desc: '#534AB7', fill: '#7F77DD', tag: '#f3f1fe', tagText: '#534AB7' },
  blue:   { bg: '#eef5fd', border: '#b3d3f5', icon: '#378ADD', label: '#0c2f52', desc: '#185FA5', fill: '#378ADD', tag: '#eef5fd', tagText: '#185FA5' },
  amber:  { bg: '#fdf6e8', border: '#f0d08a', icon: '#BA7517', label: '#412402', desc: '#854F0B', fill: '#BA7517', tag: '#fdf6e8', tagText: '#854F0B' },
} as const;

const ACCENT_DARK = {
  purple: { bg: '#1a173a', border: '#3f3a6f', icon: '#a5b4fc', label: '#e0e7ff', desc: '#c7d2fe', fill: '#a5b4fc', tag: '#2d2a59', tagText: '#c7d2fe' },
  blue:   { bg: '#15253f', border: '#2d4d78', icon: '#60a5fa', label: '#dbeafe', desc: '#93c5fd', fill: '#60a5fa', tag: '#193052', tagText: '#bfdbfe' },
  amber:  { bg: '#3d2a12', border: '#725118', icon: '#fbbf24', label: '#fff7c0', desc: '#fde68a', fill: '#fbbf24', tag: '#4e3715', tagText: '#fde68a' },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENTS: Assessment[] = [
  {
    id: 'PHQ-9',
    title: 'PHQ-9',
    fullTitle: 'Patient Health Questionnaire',
    desc: 'Screens for depression symptoms over the last 2 weeks.',
    duration: '3–5 min',
    accentKey: 'purple',
    icon: Brain,
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    questions: [
      { id: 1, text: 'Little interest or pleasure in doing things?' },
      { id: 2, text: 'Feeling down, depressed, or hopeless?' },
      { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much?' },
      { id: 4, text: 'Feeling tired or having little energy?' },
      { id: 5, text: 'Poor appetite or overeating?' },
      { id: 6, text: 'Feeling bad about yourself — or that you are a failure?' },
      { id: 7, text: 'Trouble concentrating on things?' },
      { id: 8, text: 'Moving or speaking so slowly that other people could notice?' },
      { id: 9, text: 'Thoughts that you would be better off dead or of hurting yourself?' },
    ],
  },
  {
    id: 'GAD-7',
    title: 'GAD-7',
    fullTitle: 'Generalised Anxiety Disorder',
    desc: 'Measures anxiety symptoms over the last 2 weeks.',
    duration: '2–4 min',
    accentKey: 'blue',
    icon: Activity,
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    questions: [
      { id: 1, text: 'Feeling nervous, anxious, or on edge?' },
      { id: 2, text: 'Not being able to stop or control worrying?' },
      { id: 3, text: 'Worrying too much about different things?' },
      { id: 4, text: 'Trouble relaxing?' },
      { id: 5, text: 'Being so restless that it is hard to sit still?' },
      { id: 6, text: 'Becoming easily annoyed or irritable?' },
      { id: 7, text: 'Feeling afraid as if something awful might happen?' },
    ],
  },
  {
    id: 'PSS',
    title: 'PSS-10',
    fullTitle: 'Perceived Stress Scale',
    desc: 'Measures how unpredictable, uncontrollable, and overloaded you feel.',
    duration: '3–5 min',
    accentKey: 'amber',
    icon: HeartPulse,
    options: ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'],
    questions: [
      { id: 1, text: 'Been upset because of something that happened unexpectedly?' },
      { id: 2, text: 'Felt unable to control the important things in your life?' },
      { id: 3, text: 'Felt nervous and stressed?' },
      { id: 4, text: 'Felt confident about your ability to handle personal problems?' },
      { id: 5, text: 'Felt that things were going your way?' },
      { id: 6, text: 'Found that you could not cope with all the things you had to do?' },
      { id: 7, text: 'Been able to control irritations in your life?' },
      { id: 8, text: 'Felt that you were on top of things?' },
      { id: 9, text: 'Been angered because of things outside your control?' },
      { id: 10, text: 'Felt difficulties were piling up so high you could not overcome them?' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORE INTERPRETER
// ─────────────────────────────────────────────────────────────────────────────
function getResult(type: AssessmentType, score: number) {
  if (type === 'PHQ-9') {
    if (score <= 4)  return { label: 'Minimal',            color: '#008751', bg: '#f0faf4', border: '#b6e6cc', advice: 'No action needed. Keep maintaining healthy habits.' };
    if (score <= 9)  return { label: 'Mild',               color: '#BA7517', bg: '#fdf6e8', border: '#f0d08a', advice: 'Consider self-care strategies and monitor your mood.' };
    if (score <= 14) return { label: 'Moderate',           color: '#BA7517', bg: '#fdf6e8', border: '#f0d08a', advice: 'We recommend booking a session with a counsellor.' };
    if (score <= 19) return { label: 'Moderately Severe',  color: '#E24B4A', bg: '#fdf0f0', border: '#f5bebe', advice: 'Please book a counselling session as soon as possible.' };
    return               { label: 'Severe',               color: '#E24B4A', bg: '#fdf0f0', border: '#f5bebe', advice: 'Urgent: Please reach out to a counsellor immediately.' };
  }
  if (type === 'GAD-7') {
    if (score <= 4)  return { label: 'Minimal',  color: '#008751', bg: '#f0faf4', border: '#b6e6cc', advice: 'No significant anxiety detected. Keep up healthy routines.' };
    if (score <= 9)  return { label: 'Mild',     color: '#BA7517', bg: '#fdf6e8', border: '#f0d08a', advice: 'Try relaxation techniques and monitor your anxiety levels.' };
    if (score <= 14) return { label: 'Moderate', color: '#BA7517', bg: '#fdf6e8', border: '#f0d08a', advice: 'We recommend speaking with a counsellor.' };
    return               { label: 'Severe',     color: '#E24B4A', bg: '#fdf0f0', border: '#f5bebe', advice: 'Please book a session with a counsellor urgently.' };
  }
  if (score <= 13) return { label: 'Low Stress',      color: '#008751', bg: '#f0faf4', border: '#b6e6cc', advice: 'Your stress levels are manageable. Keep it up!' };
  if (score <= 26) return { label: 'Moderate Stress', color: '#BA7517', bg: '#fdf6e8', border: '#f0d08a', advice: 'Consider stress management techniques or talking to someone.' };
  return               { label: 'High Stress',       color: '#E24B4A', bg: '#fdf0f0', border: '#f5bebe', advice: 'We strongly recommend booking a counselling session.' };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSESSMENT CARD
// ─────────────────────────────────────────────────────────────────────────────
function AssessmentCard({ assessment, onStart, isDarkMode }: { assessment: Assessment; onStart: () => void; isDarkMode: boolean }) {
  const a = isDarkMode ? ACCENT_DARK[assessment.accentKey] : ACCENT[assessment.accentKey];
  const Icon = assessment.icon;
  return (
    <div
      className="relative rounded-[20px] p-5 flex flex-col overflow-hidden
                 transition-all duration-200 hover:-translate-y-[3px] cursor-pointer"
      style={{ background: a.bg, border: `1px solid ${a.border}` }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 12px 32px ${a.fill}22`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Decorative circle */}
      <div className="absolute bottom-[-22px] right-[-22px] w-[88px] h-[88px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: a.fill }} />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center text-white"
          style={{ background: a.icon }}>
          <Icon size={20} />
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
          style={{ background: a.tag, color: a.tagText, border: `1px solid ${a.border}` }}
        >
          {assessment.duration}
        </span>
      </div>

      {/* Title + desc */}
      <p className="text-[20px] font-bold mb-0.5" style={{ color: a.label }}>{assessment.title}</p>
      <p className="text-[16px] mb-1 font-medium" style={{ color: a.desc }}>{assessment.fullTitle}</p>
      <p className="text-[14px] leading-relaxed mb-5" style={{ color: a.desc }}>{assessment.desc}</p>

      {/* CTA */}
      <button
        onClick={onStart}
        className="mt-auto flex items-center gap-2 text-white text-[15px] font-bold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 w-full justify-center"
        style={{ background: a.icon }}
      >
        Start Assessment <ArrowRight size={13} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function QuizScreen({
  assessment, onComplete, onBack, isDarkMode,
}: {
  assessment: Assessment; onComplete: (score: number) => void; onBack: () => void; isDarkMode: boolean;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const a = isDarkMode ? ACCENT_DARK[assessment.accentKey] : ACCENT[assessment.accentKey];
  const Icon = assessment.icon;

  const total = assessment.questions.length;
  const question = assessment.questions[current];
  const progress = ((current) / total) * 100;
  const allAnswered = Object.keys(answers).length === total;

  function answer(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (current < total - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 280);
    }
  }

  function submit() {
    const score = Object.values(answers).reduce((a, b) => a + b, 0);
    onComplete(score);
  }

  return (
    <div className="max-w-xl mx-auto">

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-medium mb-5 transition-colors hover:opacity-70"
        style={{ color: a.icon }}
      >
        <ChevronLeft size={16} /> Back to assessments
      </button>

      {/* Progress header card */}
      <div
        className="rounded-[20px] p-5 mb-4"
        style={{ background: a.bg, border: `1px solid ${a.border}` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white"
              style={{ background: a.icon }}>
              <Icon size={15} />
            </div>
            <h2 className="text-[15px] font-bold" style={{ color: a.label }}>{assessment.title} Assessment</h2>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: a.desc }}>
            {current + 1} <span style={{ color: a.fill, opacity: 0.5 }}>/ {total}</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: a.border }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: a.icon }}
          />
        </div>
        <p className="text-[11px] mt-1.5 font-medium" style={{ color: a.desc }}>
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Question card */}
      <div
        className="rounded-[20px] p-6 mb-4"
        style={{
          background: isDarkMode ? '#111827' : '#ffffff',
          border: isDarkMode ? '1px solid rgba(148,163,184,0.20)' : `1px solid ${a.border}`,
        }}
      >
        <p className="text-[12px] font-medium mb-2" style={{ color: a.desc }}>
          Over the last 2 weeks, how often have you been bothered by:
        </p>
        <p className="text-[17px] font-bold leading-snug mb-6" style={{ color: a.label }}>
          {question.text}
        </p>

        <div className="space-y-2.5">
          {assessment.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className="w-full text-left px-4 py-3 rounded-[14px] border text-[14px] font-medium transition-all duration-150"
              style={answers[question.id] === i
                ? { background: a.icon, color: '#fff', borderColor: a.icon }
                : { background: a.bg, color: a.label, borderColor: a.border }
              }
              onMouseEnter={e => {
                if (answers[question.id] !== i) {
                  e.currentTarget.style.borderColor = a.icon;
                  e.currentTarget.style.background = a.border + '66';
                }
              }}
              onMouseLeave={e => {
                if (answers[question.id] !== i) {
                  e.currentTarget.style.borderColor = a.border;
                  e.currentTarget.style.background = a.bg;
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="h-10 px-5 rounded-[12px] text-[13px] font-semibold disabled:opacity-40 transition"
          style={{ background: a.bg, border: `1px solid ${a.border}`, color: a.label }}
        >
          Previous
        </button>
        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={answers[question.id] === undefined}
            className="h-10 px-5 rounded-[12px] text-[13px] font-semibold text-white disabled:opacity-40 transition hover:opacity-90"
            style={{ background: a.icon }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="h-10 px-6 rounded-[12px] text-[13px] font-bold text-white disabled:opacity-40 transition hover:opacity-90"
            style={{ background: a.icon }}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ResultScreen({
  assessment, score, onRetake, onBack, isDarkMode,
}: {
  assessment: Assessment; score: number; onRetake: () => void; onBack: () => void; isDarkMode: boolean;
}) {
  const a = isDarkMode ? ACCENT_DARK[assessment.accentKey] : ACCENT[assessment.accentKey];
  const Icon = assessment.icon;
  const result = getResult(assessment.id, score);
  const resultStyle = isDarkMode
    ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: result.bg, border: `1px solid ${result.border}` };
  const maxScore = assessment.options.length - 1;
  const maxTotal = assessment.questions.length * maxScore;
  const pct = Math.round((score / maxTotal) * 100);

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] font-medium mb-5 transition-colors hover:opacity-70"
        style={{ color: a.icon }}
      >
        <ChevronLeft size={16} /> Back to assessments
      </button>

      {/* Result card */}
      <div
        className="relative rounded-[20px] p-6 text-center mb-4 overflow-hidden"
        style={{ background: a.bg, border: `1px solid ${a.border}` }}
      >
        {/* Deco */}
        <div className="absolute bottom-[-28px] right-[-28px] w-[110px] h-[110px] rounded-full opacity-[0.07] pointer-events-none"
          style={{ background: a.fill }} />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
          style={{ background: a.icon + '18', border: `1px solid ${a.border}` }}>
          <Icon size={14} style={{ color: a.icon }} />
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: a.desc }}>
            {assessment.title} Complete
          </span>
        </div>

        <h2 className="text-[22px] font-bold mb-1" style={{ color: a.label }}>Your Results</h2>
        <p className="text-[13px] mb-6" style={{ color: a.desc }}>{assessment.fullTitle}</p>

        {/* Score ring */}
        <div className="flex items-center justify-center mb-5">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="52" fill="none" stroke={a.border} strokeWidth="10"/>
            <circle
              cx="65" cy="65" r="52" fill="none"
              stroke={a.icon} strokeWidth="10"
              strokeDasharray={`${(pct / 100) * 326.7} 326.7`}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
            />
            <text x="65" y="62" textAnchor="middle" fill={a.label} fontSize="26" fontWeight="700">{score}</text>
            <text x="65" y="78" textAnchor="middle" fill={a.desc} fontSize="12">out of {maxTotal}</text>
          </svg>
        </div>

        {/* Result label */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4"
          style={resultStyle}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: result.color }} />
          <span className="text-[15px] font-bold" style={{ color: result.color }}>{result.label}</span>
        </div>

        <p className="text-[13px] leading-relaxed max-w-sm mx-auto mb-6" style={{ color: a.desc }}>
          {result.advice}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onRetake}
            className="flex-1 h-11 rounded-[14px] text-[13px] font-semibold transition hover:opacity-80"
            style={{ background: a.border + '80', color: a.label, border: `1px solid ${a.border}` }}
          >
            Retake
          </button>
          <Link
            href="/dashboard/student/book"
            className="flex-1 h-11 rounded-[14px] text-[13px] font-bold text-white flex items-center justify-center gap-2 transition hover:opacity-90"
            style={{ background: a.icon }}
          >
            Book a Session <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-[14px] px-4 py-3"
        style={isDarkMode
          ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }
          : { background: '#fdf6e8', border: '1px solid #f0d08a' }
        }
      >
        <p className="text-[12px] leading-relaxed" style={{ color: isDarkMode ? 'rgba(255,255,255,0.78)' : '#854F0B' }}>
          <strong>Note:</strong> This assessment is a screening tool, not a clinical diagnosis.
          Please speak with a qualified counsellor for professional support.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [active, setActive] = useState<Assessment | null>(null);
  const [score,  setScore]  = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  function startAssessment(a: Assessment) { setActive(a); setScore(null); }
  function completeAssessment(s: number)  { setScore(s); }
  function retake() { setScore(null); }
  function goBack(){ setActive(null); setScore(null); }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setIsDarkMode(storedTheme === 'dark');

    const handleThemeChange = () => {
      setIsDarkMode(localStorage.getItem('theme') === 'dark');
    };

    window.addEventListener('themeToggle', handleThemeChange);

    return () => {
      window.removeEventListener('themeToggle', handleThemeChange);
    };
  }, []);

  const labelColor = isDarkMode ? '#F9FAFB' : '#111827';
  const mutedColor = isDarkMode ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.38)';
  const secondaryTextColor = isDarkMode ? 'rgba(255,255,255,0.72)' : '#3B6D11';
  const sectionCardStyle = isDarkMode
    ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }
    : { background: '#f0faf4', border: '1px solid #b6e6cc' };
  const pageStyle = {
    background: isDarkMode ? '#020617' : '#f8fafc',
    color: labelColor,
  };

  /* ─────────────────────────────────────────
   QUICK ACTION ACCENT TOKENS
───────────────────────────────────────────── */
const QA_LIGHT = {
  green:  { bg: '#f0faf4', border: '#b6e6cc', icon: '#008751', label: '#1a3d1f', desc: '#3B6D11', cta: '#008751' },
  blue:   { bg: '#eef5fd', border: '#b3d3f5', icon: '#378ADD', label: '#0c2f52', desc: '#185FA5', cta: '#378ADD' },
  purple: { bg: '#f3f1fe', border: '#c9c4f4', icon: '#7F77DD', label: '#26215C', desc: '#534AB7', cta: '#7F77DD' },
  amber:  { bg: '#fdf6e8', border: '#f0d08a', icon: '#BA7517', label: '#412402', desc: '#854F0B', cta: '#BA7517' },
} as const;

const QA_DARK = {
  green:  { bg: 'rgba(0,135,81,0.13)',   border: 'rgba(0,135,81,0.28)',   icon: '#00a86b', label: '#bbf7d0', desc: '#86efac', cta: '#00a86b' },
  blue:   { bg: 'rgba(55,138,221,0.10)', border: 'rgba(55,138,221,0.25)', icon: '#60a5fa', label: '#bfdbfe', desc: '#93c5fd', cta: '#60a5fa' },
  purple: { bg: 'rgba(127,119,221,0.10)',border: 'rgba(127,119,221,0.25)',icon: '#a5b4fc', label: '#e0e7ff', desc: '#c7d2fe', cta: '#a5b4fc' },
  amber:  { bg: 'rgba(186,117,23,0.10)', border: 'rgba(186,117,23,0.25)', icon: '#fbbf24', label: '#fef3c7', desc: '#fde68a', cta: '#fbbf24' },
} as const;

type QAAccentKey = keyof typeof QA_LIGHT;

  return (
    // add data-theme so global css can target dark mode, and keep local fallbacks for inline styles
    <div data-theme={isDarkMode ? 'dark' : 'light'} className="flex flex-col gap-6 p-4 sm:p-6 pb-10 transition-colors duration-200" style={pageStyle}>

      {/* Breadcrumb */}
      <div
        className="flex items-center gap-1.5 text-[22px]"
        style={{ color: isDarkMode ? 'rgba(255,255,255,0.72)' : 'rgba(0,0,0,0.4)' }}>
        <span>Portal</span>
        <ChevronRight size={12} />
        <span
          className="font-semibold"
          style={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>Wellbeing Assessment</span>
      </div>

      {/* ── Welcome Banner — identical structure to overview ── */}
      <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 190 }}>

        {/* Photo layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://camhs.huhs.harvard.edu/files/2025/04/homepage-2.jpg')" }}
        />

        {/* Green directional overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(0,55,30,0.93) 0%, rgba(0,87,51,0.82) 55%, rgba(0,87,51,0.55) 100%)' }}
        />

        {/* Content */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-7 sm:py-8">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={12} className="text-yellow-300" />
              <p className="text-[12px] font-bold text-yellow-300 uppercase tracking-[0.12em]">Mental Health Screening</p>
            </div>
            <h2 className="text-[20px] sm:text-[22px] font-bold text-white leading-snug mb-2">
              How are you feeling today?
            </h2>
            <p className="text-[14px] text-white/60 max-w-sm leading-relaxed">
              Take a standardised assessment to better understand your mental health.
              Results are confidential and encrypted.
            </p>
            {/* Confidence info pill */}
            <div
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl"
              style={ isDarkMode
                ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                : { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }
              }>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
              <p className="text-[13px] text-white/80 font-medium">
                Responses are confidential &amp; shared only with your counsellor
              </p>
            </div>
          </div>

          {/* Right side — 3 mini stat pills */}
          <div className="hidden sm:flex flex-col gap-2 shrink-0">
            {[
              { label: '3 Assessments',  sub: 'PHQ-9, GAD-7, PSS' },
              { label: '2–5 min each',   sub: 'Quick & standardised' },
              { label: 'Encrypted',      sub: 'Data fully protected' },
            ].map((s) => (
              <div
                key={s.label}
                className="px-4 py-2.5 rounded-[14px] min-w-[170px]"
                style={ isDarkMode
                  ? { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }
                  : { background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)' }
                }>
                <p className="text-[16px] font-bold" style={{ color: isDarkMode ? '#F9FAFB' : '#ffffff' }}>{s.label}</p>
                <p className="text-[13px] mt-0.5" style={{ color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quiz / Result ── */}
      {active && score === null && (
        <QuizScreen assessment={active} onComplete={completeAssessment} onBack={goBack} isDarkMode={isDarkMode} />
      )}
      {active && score !== null && (
        <ResultScreen assessment={active} score={score} onRetake={retake} onBack={goBack} isDarkMode={isDarkMode} />
      )}

      {/* ── Selection screen ── */}
      {!active && (
        <>
          {/* Section label */}
          <p className="text-[13px] font-bold uppercase tracking-widest" style={{ color: mutedColor }}>
            Choose an Assessment
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ASSESSMENTS.map((a) => (
              <AssessmentCard key={a.id} assessment={a} onStart={() => startAssessment(a)} isDarkMode={isDarkMode} />
            ))}
          </div>

          {/* Previous results */}
          <div
            className="rounded-[20px] overflow-hidden"
            style={sectionCardStyle}
          >
            <div className="px-5 py-4" style={{ borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid #b6e6cc' }}>
              <h3 className="text-[16px] font-bold" style={{ color: labelColor }}>Previous Results</h3>
            </div>
            <div className="px-5 py-8 text-center">
              <p className="text-[15px]" style={{ color: secondaryTextColor }}>
                No assessments taken yet. Start one above.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}