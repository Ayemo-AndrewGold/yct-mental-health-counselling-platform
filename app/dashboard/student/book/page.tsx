'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCounsellors, bookAppointment } from '@/lib/api';
import { Check, Users, Video, MessageSquare, ArrowRight } from 'lucide-react';

// ── Types & Data unchanged ──
interface Counsellor { id: number; full_name: string; email: string; department: string; }
interface TimeSlot { id: string; time: string; available: boolean; }

const TIME_SLOTS: TimeSlot[] = [
  { id:'t1', time:'08:00', available:true  }, { id:'t2', time:'09:00', available:true  },
  { id:'t3', time:'10:00', available:true  }, { id:'t4', time:'11:00', available:true  },
  { id:'t5', time:'12:00', available:false }, { id:'t6', time:'14:00', available:true  },
  { id:'t7', time:'15:00', available:true  }, { id:'t8', time:'16:00', available:true  },
];
const SESSION_TYPES = [
  { key:'Physical', desc:'Meet in person at the Student Affairs Building', icon: Users },
  { key:'Video',    desc:'Join a secure video call from anywhere',          icon: Video },
  { key:'Chat',     desc:'Text-based secure messaging session',             icon: MessageSquare },
];

function getNextDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return {
      id: i.toString(),
      day:  d.toLocaleDateString('en-GB', { weekday:'short' }),
      date: d.getDate(),
      month:d.toLocaleDateString('en-GB', { month:'short' }),
      full: d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }),
      isoDate: d.toISOString().split('T')[0],
    };
  });
}

// ── Step Indicator ──
function StepIndicator({ step, dm }: { step: number; dm: boolean }) {
  const steps = ['Choose Counsellor','Date & Time','Session Type','Confirm'];
  return (
    <div className="flex items-center gap-1.5 mb-6 flex-wrap">
      {steps.map((s, i) => {
        const num   = i + 1;
        const done  = num < step;
        const active = num === step;
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={active
                  ? { background:'#008751', color:'#fff' }
                  : done
                    ? { background: dm ? '#0d1f14' : '#f0faf4', color:'#008751', border:'2px solid #b6e6cc' }
                    : { background: dm ? '#0d1f14' : '#f0faf4', color: dm ? '#3B6D11' : '#b6e6cc', border: `1px solid ${dm ? '#1a3d2a' : '#b6e6cc'}` }
                }>
                {done ? <Check size={11} /> : num}
              </div>
              <span className="text-[11px] font-semibold hidden md:block"
                style={{ color: active ? '#008751' : done ? (dm ? '#6ee7a0' : '#3B6D11') : (dm ? '#1a3d2a' : '#b6e6cc') }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px w-6 md:w-8 transition-colors"
                style={{ background: done ? '#008751' : (dm ? '#1a3d2a' : '#b6e6cc') }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ──
export default function BookSessionPage() {
  const [dm, setDm] = useState(false);
  const [step,               setStep]               = useState(1);
  const [counsellors,        setCounsellors]        = useState<Counsellor[]>([]);
  const [loadingCounsellors, setLoadingCounsellors] = useState(true);
  const [selectedCounsellor, setSelectedCounsellor] = useState<Counsellor | null>(null);
  const [selectedDay,        setSelectedDay]        = useState<string | null>(null);
  const [selectedSlot,       setSelectedSlot]       = useState<TimeSlot | null>(null);
  const [selectedType,       setSelectedType]       = useState<string | null>(null);
  const [note,               setNote]               = useState('');
  const [booked,             setBooked]             = useState(false);
  const [loading,            setLoading]            = useState(false);
  const [error,              setError]              = useState('');
  const days = getNextDays();

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setDm(true);
    const handler = (e: Event) => setDm((e as CustomEvent<{isDarkMode:boolean}>).detail.isDarkMode);
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);

  useEffect(() => {
    getCounsellors().then(data => { setCounsellors(data); setLoadingCounsellors(false); });
  }, []);

  async function confirm() {
    if (!selectedCounsellor || !selectedSlot || !selectedType) return;
    setLoading(true); setError('');
    const dayData = days.find(d => d.id === selectedDay);
    try {
      const res = await bookAppointment({
        counsellor: Number(selectedCounsellor.id),
        session_type: selectedType,
        date: dayData?.isoDate ?? '',
        time: selectedSlot.time + ':00',
        duration: 45,
        note: note || undefined,
      });
      if (res.ok) { setBooked(true); }
      else { const data = await res.json(); setError(data.error || 'Booking failed. Please try again.'); }
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }

  // ── colour tokens ──
  const C = {
    pageBg:    dm ? '#0a130d' : 'transparent',
    cardBg:    dm ? '#0d1f14' : '#f0faf4',
    cardBorder:dm ? '#1a3d2a' : '#b6e6cc',
    h:         dm ? '#d1fae5' : '#1a3d1f',
    sub:       dm ? '#6ee7a0' : '#3B6D11',
    label:     dm ? '#6ee7a0' : '#3B6D11',
    inputBg:   dm ? '#0d1f14' : '#fff',
    inputText: dm ? '#d1fae5' : '#1a3d1f',
    backBg:    dm ? '#0d1f14' : '#f0faf4',
    backTxt:   dm ? '#6ee7a0' : '#3B6D11',
    warnBg:    dm ? '#1a1200' : '#fdf6e8',
    warnBdr:   dm ? '#3d2e00' : '#f0d08a',
    warnTxt:   dm ? '#fde047' : '#854F0B',
    summBg:    dm ? '#0d1f14' : '#f0faf4',
    rowBdr:    dm ? '#1a3d2a' : '#b6e6cc',
    lbl:       dm ? '#4ade80' : '#3B6D11',
    val:       dm ? '#d1fae5' : '#1a3d1f',
    unavailBg: dm ? '#1f0d0d' : '#fdf0f0',
    unavailBdr:dm ? '#3d1a1a' : '#f5bebe',
    unavailTxt:dm ? '#7a2a2a' : '#f5bebe',
  };

  const cardStyle   = { background: C.cardBg, border: `1px solid ${C.cardBorder}` };
  const sectionLabel = (txt: string) => (
    <p className="text-[11px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: C.sub }}>{txt}</p>
  );
  const backBtn = (onClick: () => void) => (
    <button onClick={onClick}
      className="h-10 px-5 rounded-full text-[12px] font-semibold transition-all"
      style={{ background: C.backBg, border: `1px solid ${C.cardBorder}`, color: C.backTxt }}>
      Back
    </button>
  );
  const nextBtn = (onClick: () => void, label: string, disabled = false) => (
    <button onClick={onClick} disabled={disabled}
      className="flex-1 h-10 rounded-full text-[12px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      style={{ background: '#008751', border:'none', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {label}
    </button>
  );

  // ── SUCCESS ──
  if (booked) return (
    <div className="px-6 py-10 flex items-center justify-center min-h-[60vh]" style={{ background: C.pageBg }}>
      <div className="rounded-[20px] p-10 max-w-md w-full text-center" style={cardStyle}>
        <div className="w-14 h-14 rounded-full bg-[#008751] flex items-center justify-center mx-auto mb-4">
          <Check size={26} className="text-white" />
        </div>
        <h2 className="text-[20px] font-bold mb-1.5" style={{ color: C.h }}>Session Booked!</h2>
        <p className="text-[12px] mb-5 leading-relaxed" style={{ color: C.sub }}>
          Your session with <strong>{selectedCounsellor?.full_name}</strong> has been confirmed for{' '}
          <strong>{days.find(d => d.id === selectedDay)?.full}</strong> at <strong>{selectedSlot?.time}</strong>.
        </p>
        <div className="rounded-[14px] p-4 mb-5" style={{ background: dm ? '#071209' : '#f0faf4', border: `1px solid ${C.cardBorder}` }}>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Counsellor',    selectedCounsellor?.full_name ?? ''],
              ['Session Type',  selectedType ?? ''],
              ['Date',          days.find(d => d.id === selectedDay)?.full ?? ''],
              ['Time',          selectedSlot?.time ?? ''],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[10px] mb-0.5" style={{ color: C.lbl }}>{l}</p>
                <p className="text-[12px] font-semibold" style={{ color: C.val }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/student/appointments"
            className="flex-1 h-10 rounded-full text-white text-[12px] font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: '#008751' }}>
            View My Sessions <ArrowRight size={12} />
          </Link>
          <Link href="/dashboard/student"
            className="flex-1 h-10 rounded-full text-[12px] font-semibold flex items-center justify-center transition-all"
            style={{ background: C.backBg, border: `1px solid ${C.cardBorder}`, color: C.backTxt }}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-6 py-5 pb-10" style={{ background: C.pageBg }}>

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-[22px] font-bold" style={{ color: C.h }}>Book a Session</h2>
        <p className="text-[17px] mt-1" style={{ color: C.sub }}>
          Schedule a counselling session with an available counsellor
        </p>
      </div>

      <StepIndicator step={step} dm={dm} />

      {/* ── STEP 1 — Choose Counsellor ── */}
      {step === 1 && (
        <div>
          {sectionLabel('Available Counsellors')}
          {loadingCounsellors ? (
            <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-[20px] p-5 animate-pulse" style={cardStyle}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full " style={{ background: C.cardBorder }} />
                    <div className="space-y-1.5">
                      <div className="h-3 w-24 rounded" style={{ background: C.cardBorder }} />
                      <div className="h-2.5 w-16 rounded" style={{ background: C.cardBorder }} />
                    </div>
                  </div>
                  <div className="h-8 rounded-xl" style={{ background: C.cardBorder }} />
                </div>
              ))}
            </div>
          ) : counsellors.length === 0 ? (
            <div className="rounded-[20px] p-8 text-center" style={cardStyle}>
              <p className="text-[15px]" style={{ color: C.sub }}>
                No counsellors available at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {counsellors.map(c => {
                const initials = c.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
                const isSelected = selectedCounsellor?.id === c.id;
                return (
                  <button key={c.id}
                    onClick={() => { setSelectedCounsellor(c); setStep(2); }}
                    className="relative rounded-[20px] p-5 text-left overflow-hidden transition-all duration-200 hover:-translate-y-[2px]"
                    style={{
                      background: isSelected ? (dm ? '#071a0d' : '#e6f7ef') : C.cardBg,
                      border: `1px solid ${isSelected ? '#008751' : C.cardBorder}`,
                      boxShadow: isSelected ? '0 8px 24px rgba(0,135,81,0.12)' : 'none',
                    }}>
                    <div className="absolute bottom-[-16px] right-[-16px] w-[60px] h-[60px] rounded-full opacity-[0.07] pointer-events-none"
                      style={{ background: '#008751' }} />
                    <div className="w-11 h-11 rounded-full bg-[#008751] flex items-center justify-center text-white text-[13px] font-bold mb-3"
                      style={{ border:'2px solid rgba(0,135,81,0.2)' }}>
                      {initials}
                    </div>
                    <p className="text-[13px] font-bold mb-0.5" style={{ color: C.h }}>{c.full_name}</p>
                    <p className="text-[11px] mb-2" style={{ color: C.sub }}>Counsellor</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-[6px] h-[6px] rounded-full bg-green-400" />
                      <span className="text-[10px]" style={{ color: C.sub }}>Available</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2 — Date & Time ── */}
      {step === 2 && (
        <div className="max-w-2xl">
          {sectionLabel('Select a Date')}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {days.map(d => {
              const active = selectedDay === d.id;
              return (
                <button key={d.id} onClick={() => setSelectedDay(d.id)}
                  className="flex flex-col items-center px-4 py-3 rounded-[14px] min-w-[58px] flex-shrink-0 transition-all duration-150"
                  style={{
                    background: active ? '#008751' : C.cardBg,
                    border: `1px solid ${active ? '#008751' : C.cardBorder}`,
                    color: active ? '#fff' : C.sub,
                  }}>
                  <span className="text-[9px] font-600 uppercase tracking-wide">{d.day}</span>
                  <span className="text-[20px] font-bold leading-tight">{d.date}</span>
                  <span className="text-[9px]">{d.month}</span>
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <>
              {sectionLabel('Select a Time')}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {TIME_SLOTS.map(slot => {
                  const active = selectedSlot?.id === slot.id;
                  return (
                    <button key={slot.id} disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className="h-10 rounded-[12px] text-[12px] font-semibold transition-all"
                      style={!slot.available
                        ? { background: C.unavailBg, border: `1px solid ${C.unavailBdr}`, color: C.unavailTxt, cursor:'not-allowed' }
                        : active
                          ? { background: '#008751', border:'1px solid #008751', color:'#fff' }
                          : { background: C.cardBg, border: `1px solid ${C.cardBorder}`, color: C.h }
                      }>
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="flex gap-3">
            {backBtn(() => setStep(1))}
            {nextBtn(() => setStep(3), 'Continue', !selectedDay || !selectedSlot)}
          </div>
        </div>
      )}

      {/* ── STEP 3 — Session Type ── */}
      {step === 3 && (
        <div className="max-w-md">
          {sectionLabel('How would you like to meet?')}
          <div className="space-y-2.5 mb-5">
            {SESSION_TYPES.map(({ key, desc, icon: Icon }) => {
              const active = selectedType === key;
              return (
                <button key={key} onClick={() => setSelectedType(key)}
                  className="w-full flex items-center gap-3.5 p-4 rounded-[16px] text-left transition-all"
                  style={{
                    background: active ? (dm ? '#071a0d' : '#e6f7ef') : C.cardBg,
                    border: `1px solid ${active ? '#008751' : C.cardBorder}`,
                  }}>
                  <div className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: active ? '#008751' : (dm ? '#0d2e1a' : 'rgba(0,135,81,0.1)') }}>
                    <Icon size={17} style={{ color: active ? '#fff' : '#008751' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold" style={{ color: C.h }}>{key} Session</p>
                    <p className="text-[11px] mt-0.5" style={{ color: C.sub }}>{desc}</p>
                  </div>
                  {active && (
                    <div className="w-5 h-5 rounded-full bg-[#008751] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mb-5">
            <label className="block text-[12px] font-semibold mb-2" style={{ color: C.label }}>
              Add a note <span style={{ color: C.sub, fontWeight:400 }}>(optional)</span>
            </label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Briefly describe what you'd like to talk about…"
              rows={3}
              className="w-full rounded-[14px] px-4 py-3 text-[12px] resize-none focus:outline-none transition-all"
              style={{ background: C.inputBg, border: `1px solid ${C.cardBorder}`, color: C.inputText }}
              onFocus={e => { e.currentTarget.style.borderColor='#008751'; e.currentTarget.style.boxShadow='0 0 0 3px rgba(0,135,81,0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor=C.cardBorder; e.currentTarget.style.boxShadow='none'; }}
            />
          </div>

          <div className="flex gap-3">
            {backBtn(() => setStep(2))}
            {nextBtn(() => setStep(4), 'Continue', !selectedType)}
          </div>
        </div>
      )}

      {/* ── STEP 4 — Confirm ── */}
      {step === 4 && (
        <div className="max-w-md">
          {sectionLabel('Confirm your booking')}

          {/* Summary card */}
          <div className="rounded-[20px] overflow-hidden mb-4" style={{ border: `1px solid ${C.cardBorder}` }}>
            {/* Header with photo overlay */}
            <div className="relative px-5 py-4 overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage:"url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80')" }} />
              <div className="absolute inset-0" style={{ background:'linear-gradient(105deg, rgba(0,40,20,0.96) 0%, rgba(0,70,35,0.90) 100%)' }} />
              <p className="relative text-[10px] font-bold text-yellow-300 uppercase tracking-[0.1em]">★ Booking Summary</p>
            </div>

            {/* Rows */}
            <div className="px-5" style={{ background: C.summBg }}>
              {[
                ['Counsellor',   selectedCounsellor?.full_name ?? ''],
                ['Date',         days.find(d => d.id === selectedDay)?.full ?? ''],
                ['Time',         selectedSlot?.time ?? ''],
                ['Session Type', selectedType ?? ''],
                ['Note',         note || 'None'],
              ].map(([l, v]) => (
                <div key={l} className="flex items-start justify-between gap-4 py-3"
                  style={{ borderBottom: `1px solid ${C.rowBdr}` }}>
                  <p className="text-[11px]" style={{ color: C.lbl }}>{l}</p>
                  <p className="text-[12px] font-semibold text-right" style={{ color: C.val }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-[14px] px-4 py-3 mb-5 text-[11px] leading-relaxed"
            style={{ background: C.warnBg, border: `1px solid ${C.warnBdr}`, color: C.warnTxt }}>
            ⚠️ By confirming, you agree to attend this session. Please cancel at least 2 hours in advance if you cannot attend.
          </div>

          {error && (
            <div className="rounded-[14px] px-4 py-3 mb-4 text-[11px]"
              style={{ background: dm ? '#1f0d0d' : '#fdf0f0', border: `1px solid ${dm ? '#3d1a1a' : '#f5bebe'}`, color: dm ? '#fca5a5' : '#A32D2D' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {backBtn(() => setStep(3))}
            <button onClick={confirm} disabled={loading}
              className="flex-1 h-10 rounded-full text-[12px] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#008751', border:'none' }}>
              {loading ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}