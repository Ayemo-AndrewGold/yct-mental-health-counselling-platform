'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCounsellors, bookAppointment } from '@/lib/api';
import Cookies from 'js-cookie'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Counsellor {
  id: number;
  full_name: string;
  email: string;
  department: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────


const TIME_SLOTS: TimeSlot[] = [
  { id: 't1', time: '08:00', available: true  },
  { id: 't2', time: '09:00', available: true  },
  { id: 't3', time: '10:00', available: true  },
  { id: 't4', time: '11:00', available: true  },
  { id: 't5', time: '12:00', available: false },
  { id: 't6', time: '14:00', available: true  },
  { id: 't7', time: '15:00', available: true  },
  { id: 't8', time: '16:00', available: true  },
];

const SESSION_TYPES = ['Physical', 'Video', 'Chat'];

// Generate next 7 days
function getNextDays() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      id: i.toString(),
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-GB', { month: 'short' }),
      full: d.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      }),
      isoDate: d.toISOString().split('T')[0]
    });
  }
  return days;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  const steps = ['Choose Counsellor', 'Pick Date & Time', 'Session Type', 'Confirm'];
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
              ${i + 1 === step ? 'bg-[#1a5c2a] text-white' : i + 1 < step ? 'bg-[#e8f5ec] text-[#1a5c2a]' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1 < step ? (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-[11px] font-medium hidden md:block
              ${i + 1 === step ? 'text-[#1a5c2a]' : i + 1 < step ? 'text-gray-500' : 'text-gray-300'}`}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-6 md:w-10 ${i + 1 < step ? 'bg-[#1a5c2a]' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function BookSessionPage() {
  const [step, setStep] = useState(1);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loadingCounsellors, setLoadingCounsellors] = useState(true);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const days = getNextDays();

  // Load real counsellors from backend 
  useEffect(() =>{
    getCounsellors().then((data) => {
      setCounsellors(data);
      setLoadingCounsellors(false);
    });
  }, []);

  async function confirm() {
    if (!selectedCounsellor || !selectedSlot || !selectedType) return;

    setLoading(true);
    setError('');

    const dayData = days.find(d => d.id === selectedDay);

    try {
      const res = await bookAppointment({
        counsellor: Number (selectedCounsellor.id),
        session_type: selectedType,
        date: dayData?.isoDate ?? '',
        time: selectedSlot.time + ':00',
        duration: 45,
        note: note || undefined,
      });

      if (res.ok) {
        setBooked(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Booking failed. Please try again.')
      }
    } catch {
      setError('Something wentwrong. Please try again');
    } finally {
      setLoading(false);
    }
  }

  if (booked) {
    return (
      <div className="px-6 py-5 pb-10 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#e8f5ec] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-[18px] font-bold text-gray-900 mb-1">Session Booked!</h2>
          <p className="text-[12px] text-gray-500 mb-4">
            Your session with <strong>{selectedCounsellor?.full_name}</strong> has been confirmed for{' '}
            <strong>{days.find(d => d.id === selectedDay)?.full}</strong> at{' '}
            <strong>{selectedSlot?.time}</strong>.
          </p>
          <div className="bg-[#e8f5ec] border border-[#b6dfc0] rounded-xl px-4 py-3 mb-5 text-left">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-gray-400">Counsellor</p>
                <p className="font-semibold text-gray-800">{selectedCounsellor?.full_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Session Type</p>
                <p className="font-semibold text-gray-800">{selectedType}</p>
              </div>
              <div>
                <p className="text-gray-400">Date</p>
                <p className="font-semibold text-gray-800">{days.find(d => d.id === selectedDay)?.full}</p>
              </div>
              <div>
                <p className="text-gray-400">Time</p>
                <p className="font-semibold text-gray-800">{selectedSlot?.time}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/student/sessions"
              className="flex-1 h-10 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold hover:bg-[#2d7a3e] transition flex items-center justify-center"
            >
              View My Sessions
            </Link>
            <Link
              href="/dashboard/student"
              className="flex-1 h-10 border border-gray-200 text-gray-600 rounded-xl text-[12px] font-medium hover:bg-gray-50 transition flex items-center justify-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">Book a Session</h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Schedule a counselling session with an available counsellor
        </p>
      </div>

      <StepIndicator step={step} />

      {/* STEP 1 — Choose Counsellor */}
      {step === 1 && (
        <div>
          <h3 className="text-[13px] font-semibold text-gray-700 mb-3">Available Counsellors</h3>

          {loadingCounsellors ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gray-200" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-2.5 w-16 bg-gray-100 rounded" />
                    </div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : counsellors.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
              <p className="text-[12px] text-gray-400">
                No counsellors available at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {counsellors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCounsellor(c); setStep(2); }}
                  className={`bg-white border rounded-2xl p-5 text-left hover:shadow-md transition-all duration-200
                    ${selectedCounsellor?.id === c.id ? 'border-[#1a5c2a]' : 'border-gray-100'}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[13px] font-bold">
                      {c.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">{c.full_name}</p>
                      <p className="text-[11px] text-gray-500">Counsellor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[11px] text-gray-500">Available</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — Pick Date & Time */}
       {step === 2 && (
        <div className="max-w-2xl">
          <h3 className="text-[13px] font-semibold text-gray-700 mb-3">Select a Date</h3>
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={`flex flex-col items-center px-4 py-3 rounded-xl border min-w-[64px] transition-all
                  ${selectedDay === d.id ? 'bg-[#1a5c2a] border-[#1a5c2a] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#1a5c2a]'}`}
              >
                <span className="text-[10px] font-medium">{d.day}</span>
                <span className="text-[18px] font-bold leading-tight">{d.date}</span>
                <span className="text-[10px]">{d.month}</span>
              </button>
            ))}
          </div>

          {selectedDay && (
            <>
              <h3 className="text-[13px] font-semibold text-gray-700 mb-3">Select a Time</h3>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`h-10 rounded-xl border text-[12px] font-medium transition-all
                      ${!slot.available ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' :
                        selectedSlot?.id === slot.id ? 'bg-[#1a5c2a] border-[#1a5c2a] text-white' :
                        'bg-white border-gray-200 text-gray-700 hover:border-[#1a5c2a]'}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="h-10 px-5 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedDay || !selectedSlot}
              className="h-10 px-5 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold disabled:opacity-40 hover:bg-[#2d7a3e] transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Session Type */}
      {step === 3 && (
        <div className="max-w-md">
          <h3 className="text-[13px] font-semibold text-gray-700 mb-3">How would you like to meet?</h3>
          <div className="space-y-3 mb-5">
            {SESSION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                  ${selectedType === type ? 'border-[#1a5c2a] bg-[#e8f5ec]' : 'border-gray-200 bg-white hover:border-[#1a5c2a]'}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                  ${selectedType === type ? 'bg-[#1a5c2a]' : 'bg-gray-100'}`}>
                  {type === 'Physical' && (
                    <svg className={`w-4 h-4 ${selectedType === type ? 'stroke-white' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                  )}
                  {type === 'Video' && (
                    <svg className={`w-4 h-4 ${selectedType === type ? 'stroke-white' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                    </svg>
                  )}
                  {type === 'Chat' && (
                    <svg className={`w-4 h-4 ${selectedType === type ? 'stroke-white' : 'stroke-gray-500'}`} viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{type} Session</p>
                  <p className="text-[11px] text-gray-500">
                    {type === 'Physical' && 'Meet in person at the Student Affairs Building'}
                    {type === 'Video' && 'Join a secure video call from anywhere'}
                    {type === 'Chat' && 'Text-based secure messaging session'}
                  </p>
                </div>
                {selectedType === type && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-[#1a5c2a] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Optional note */}
          <div className="mb-5">
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              Add a note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Briefly describe what you'd like to talk about..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 resize-none transition"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="h-10 px-5 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedType}
              className="h-10 px-5 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold disabled:opacity-40 hover:bg-[#2d7a3e] transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Confirm */}
      {step === 4 && (
        <div className="max-w-md">
          <h3 className="text-[13px] font-semibold text-gray-700 mb-3">Confirm your booking</h3>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
            <div className="bg-[#1a5c2a] px-5 py-3">
              <p className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest">Booking Summary</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Counsellor', value: `${selectedCounsellor?.full_name}` },
                { label: 'Date', value: days.find(d => d.id === selectedDay)?.full ?? '' },
                { label: 'Time', value: selectedSlot?.time ?? '' },
                { label: 'Session Type', value: selectedType ?? '' },
                { label: 'Note', value: note || 'None' },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4">
                  <p className="text-[11px] text-gray-400 shrink-0">{item.label}</p>
                  <p className="text-[12px] font-medium text-gray-800 text-right">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-5">
            <p className="text-[11px] text-yellow-700 leading-relaxed">
              By confirming, you agree to attend this session. Please cancel at least 2 hours in advance if you cannot attend.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="h-10 px-5 border border-gray-200 rounded-xl text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={confirm}
              disabled={loading}
              className="flex-1 h-10 bg-[#1a5c2a] text-white rounded-xl text-[12px] font-semibold hover:bg-[#2d7a3e] disabled:opacity-60 transition"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}