'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type AssessmentType = 'PHQ-9' | 'GAD-7' | 'PSS';

interface Question {
  id: number;
  text: string;
}

interface Assessment {
  id: AssessmentType;
  title: string;
  desc: string;
  duration: string;
  color: string;
  accent: string;
  tagColor: string;
  icon: React.ReactNode;
  questions: Question[];
  options: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSESSMENT DATA
// ─────────────────────────────────────────────────────────────────────────────
const ASSESSMENTS: Assessment[] = [
  {
    id: 'PHQ-9',
    title: 'PHQ-9',
    desc: 'Patient Health Questionnaire — screens for depression symptoms over the last 2 weeks.',
    duration: '3–5 min',
    color: 'bg-purple-50',
    accent: 'bg-purple-500',
    tagColor: 'bg-purple-50 text-purple-700',
    icon: (
      <svg className="w-5 h-5 stroke-purple-600" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
    ),
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
    desc: 'Generalised Anxiety Disorder scale — measures anxiety symptoms over the last 2 weeks.',
    duration: '2–4 min',
    color: 'bg-blue-50',
    accent: 'bg-blue-500',
    tagColor: 'bg-blue-50 text-blue-700',
    icon: (
      <svg className="w-5 h-5 stroke-blue-600" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
        <path d="M12 21C12 21 3 15.5 3 9.5C3 7.01 4.99 5 7.5 5C9.14 5 10.61 5.83 11.5 7.09C12.39 5.83 13.86 5 15.5 5C18.01 5 20 7.01 20 9.5C20 15.5 12 21 12 21Z"/>
      </svg>
    ),
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
    desc: 'Perceived Stress Scale — measures how unpredictable, uncontrollable, and overloaded you feel.',
    duration: '3–5 min',
    color: 'bg-orange-50',
    accent: 'bg-orange-500',
    tagColor: 'bg-orange-50 text-orange-700',
    icon: (
      <svg className="w-5 h-5 stroke-orange-500" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
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
    if (score <= 4) return { label: 'Minimal', color: 'text-green-600', bg: 'bg-green-50', advice: 'No action needed. Keep maintaining healthy habits.' };
    if (score <= 9) return { label: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50', advice: 'Consider self-care strategies and monitor your mood.' };
    if (score <= 14) return { label: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-50', advice: 'We recommend booking a session with a counsellor.' };
    if (score <= 19) return { label: 'Moderately Severe', color: 'text-red-600', bg: 'bg-red-50', advice: 'Please book a counselling session as soon as possible.' };
    return { label: 'Severe', color: 'text-red-700', bg: 'bg-red-100', advice: 'Urgent: Please reach out to a counsellor immediately.' };
  }
  if (type === 'GAD-7') {
    if (score <= 4) return { label: 'Minimal', color: 'text-green-600', bg: 'bg-green-50', advice: 'No significant anxiety detected. Keep up healthy routines.' };
    if (score <= 9) return { label: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50', advice: 'Try relaxation techniques and monitor your anxiety levels.' };
    if (score <= 14) return { label: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-50', advice: 'We recommend speaking with a counsellor.' };
    return { label: 'Severe', color: 'text-red-600', bg: 'bg-red-50', advice: 'Please book a session with a counsellor urgently.' };
  }
  // PSS
  if (score <= 13) return { label: 'Low Stress', color: 'text-green-600', bg: 'bg-green-50', advice: 'Your stress levels are manageable. Keep it up!' };
  if (score <= 26) return { label: 'Moderate Stress', color: 'text-yellow-600', bg: 'bg-yellow-50', advice: 'Consider stress management techniques or talking to someone.' };
  return { label: 'High Stress', color: 'text-red-600', bg: 'bg-red-50', advice: 'We strongly recommend booking a counselling session.' };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSESSMENT CARD (selection screen)
// ─────────────────────────────────────────────────────────────────────────────
function AssessmentCard({ assessment, onStart }: { assessment: Assessment; onStart: () => void }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden hover:shadow-md transition-all duration-200`}>
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${assessment.accent}`} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${assessment.color}`}>
          {assessment.icon}
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${assessment.tagColor}`}>
          {assessment.duration}
        </span>
      </div>
      <h3 className="text-[14px] font-bold text-gray-900 mb-1">{assessment.title}</h3>
      <p className="text-[11.5px] text-gray-500 leading-relaxed mb-4">{assessment.desc}</p>
      <button
        onClick={onStart}
        className="w-full h-9 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white text-[12px] font-medium rounded-xl transition"
      >
        Start Assessment
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function QuizScreen({
  assessment,
  onComplete,
  onBack,
}: {
  assessment: Assessment;
  onComplete: (score: number) => void;
  onBack: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);

  const total = assessment.questions.length;
  const question = assessment.questions[current];
  const progress = ((current) / total) * 100;
  const allAnswered = Object.keys(answers).length === total;

  function answer(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (current < total - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 300);
    }
  }

  function submit() {
    const score = Object.values(answers).reduce((a, b) => a + b, 0);
    onComplete(score);
  }

  return (
    <div className="max-w-xl mx-auto">

      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 mb-5 transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to assessments
      </button>

      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-gray-900">{assessment.title} Assessment</h2>
          <span className="text-[11px] text-gray-400">{current + 1} / {total}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1a5c2a] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
        <p className="text-[13px] text-gray-500 mb-2">Over the last 2 weeks, how often have you been bothered by:</p>
        <p className="text-[16px] font-semibold text-gray-900 leading-snug mb-6">
          {question.text}
        </p>
        <div className="space-y-2.5">
          {assessment.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-[13px] font-medium transition-all
                ${answers[question.id] === i
                  ? 'bg-[#1a5c2a] text-white border-[#1a5c2a]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#1a5c2a] hover:bg-[#e8f5ec]'
                }`}
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
          className="h-9 px-4 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium disabled:opacity-40 hover:bg-gray-50 transition"
        >
          Previous
        </button>
        {current < total - 1 ? (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={answers[question.id] === undefined}
            className="h-9 px-4 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-medium disabled:opacity-40 hover:bg-[#2d7a3e] transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="h-9 px-5 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold disabled:opacity-40 hover:bg-[#2d7a3e] transition"
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
  assessment,
  score,
  onRetake,
  onBack,
}: {
  assessment: Assessment;
  score: number;
  onRetake: () => void;
  onBack: () => void;
}) {
  const result = getResult(assessment.id, score);
  const maxScore = assessment.options.length - 1;
  const maxTotal = assessment.questions.length * maxScore;
  const pct = Math.round((score / maxTotal) * 100);

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-700 mb-5 transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back to assessments
      </button>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center mb-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Result</p>
        <h2 className="text-[22px] font-bold text-gray-900 mb-1">{assessment.title} Complete</h2>

        {/* Score circle */}
        <div className="flex items-center justify-center my-6">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#e8f5ec" strokeWidth="10"/>
            <circle
              cx="60" cy="60" r="48" fill="none"
              stroke="#1a5c2a" strokeWidth="10"
              strokeDasharray={`${(pct / 100) * 301.6} 301.6`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="58" textAnchor="middle" fill="#1a5c2a" fontSize="24" fontWeight="700">{score}</text>
            <text x="60" y="74" textAnchor="middle" fill="#9ca3af" fontSize="11">out of {maxTotal}</text>
          </svg>
        </div>

        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${result.bg} mb-4`}>
          <span className={`text-[15px] font-bold ${result.color}`}>{result.label}</span>
        </div>

        <p className="text-[12.5px] text-gray-600 leading-relaxed max-w-sm mx-auto mb-6">
          {result.advice}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onRetake}
            className="flex-1 h-10 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Retake
          </button>
          <Link
            href="/dashboard/student/book"
            className="flex-1 h-10 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold hover:bg-[#2d7a3e] transition flex items-center justify-center"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
        <p className="text-[11px] text-yellow-700 leading-relaxed">
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
  const [score, setScore] = useState<number | null>(null);

  function startAssessment(a: Assessment) {
    setActive(a);
    setScore(null);
  }

  function completeAssessment(s: number) {
    setScore(s);
  }

  function retake() {
    setScore(null);
  }

  function goBack() {
    setActive(null);
    setScore(null);
  }

  return (
    <div className="px-6 py-5 pb-10">

      {/* Show quiz or result */}
      {active && score === null && (
        <QuizScreen assessment={active} onComplete={completeAssessment} onBack={goBack} />
      )}
      {active && score !== null && (
        <ResultScreen assessment={active} score={score} onRetake={retake} onBack={goBack} />
      )}

      {/* Selection screen */}
      {!active && (
        <>
          <div className="mb-5">
            <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
              Wellbeing Assessment
            </h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Take a standardised mental health assessment to understand how you are feeling
            </p>
          </div>

          {/* Info banner */}
          <div className="bg-[#1a5c2a] rounded-2xl px-6 py-4 mb-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">Your responses are confidential</p>
              <p className="text-[11px] text-white/60 mt-0.5">
                Results are only shared with your assigned counsellor. All data is encrypted.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ASSESSMENTS.map((a) => (
              <AssessmentCard key={a.id} assessment={a} onStart={() => startAssessment(a)} />
            ))}
          </div>

          {/* Previous results placeholder */}
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h3 className="text-[13px] font-semibold text-gray-900">Previous Results</h3>
            </div>
            <div className="px-5 py-8 text-center">
              <p className="text-[12px] text-gray-400">No assessments taken yet. Start one above.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}