'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Message {
  id: string;
  role: 'counsellor' | 'user' | 'system';
  text: string;
  time: string;
}

const QUICK_RESOURCES = [
  'Managing exam stress',
  'Anxiety — what to know',
  'Sleep & mental health',
  'When to seek help',
  'Breathing techniques',
  'Dealing with loneliness',
];

function getTime() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h > 12 ? h - 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

function generateSessionId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'ANON-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function AnonymousSessionPage() {
  const searchParams = useSearchParams();
  const [sessionId] = useState(() => searchParams.get('id') || generateSessionId());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'sys-1',
      role: 'system',
      text: `Anonymous session started · ID: ${sessionId} · No personal data stored`,
      time: getTime(),
    },
    {
      id: 'c-1',
      role: 'counsellor',
      text: "Hello, welcome to MindBridge. You're in a completely safe and anonymous space. I don't know who you are, and that's perfectly fine. How are you feeling today?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [ended, setEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || typing || ended) return;
    setInput('');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: getTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const res = await fetch('/api/anonymous/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          role: 'counsellor',
          text: data.reply || 'Thank you for sharing that. Can you tell me more?',
          time: getTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `c-err-${Date.now()}`,
          role: 'counsellor',
          text: 'Sorry, there was a connection issue. Please try again.',
          time: getTime(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleEndSession() {
    setEnded(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-end`,
        role: 'system',
        text: 'Session ended. All messages have been cleared from this device.',
        time: getTime(),
      },
    ]);
  }

  const inputClass =
    'flex-1 h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition bg-white';

  return (
    /* Full viewport, nothing overflows */
    <div className="h-screen flex flex-col overflow-hidden bg-[#f9fbfa]">

      {/* ── TOP BAR ── */}
      <div className="h-13 bg-[#1a5c2a] px-4 flex items-center justify-between flex-shrink-0" style={{ height: '52px' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#f5b829] flex items-center justify-center text-[#1a5c2a] text-[10px] font-bold shrink-0">
            YCT
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">MindBridge</p>
            <p className="text-[10px] text-white/55">Yabatech Mental Health Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Anonymous pill */}
          <div className="flex items-center gap-1.5 bg-[#f5b829]/18 border border-[#f5b829]/35 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5b829]" />
            <span className="text-[11px] text-[#f5b829] font-medium">Anonymous Session</span>
          </div>
          <button
            onClick={handleEndSession}
            className="text-[11px] text-white/75 border border-white/20 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition"
          >
            End session
          </button>
        </div>
      </div>

      {/* ── SHELL ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <div className="hidden md:flex w-52 lg:w-56 shrink-0 flex-col bg-white border-r border-gray-100 overflow-hidden">

          {/* Session ID */}
          <div className="px-3.5 pt-3.5 pb-3 border-b border-gray-50">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Your Session</p>
            <div className="bg-[#e8f5ec] border border-[#b6dfc0] rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-[#1a5c2a]">ID: {sessionId}</p>
              <p className="text-[10px] text-[#5a8f6a] mt-0.5">No personal data stored</p>
            </div>
          </div>

          {/* Privacy */}
          <div className="px-3.5 py-3 border-b border-gray-50">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Your Privacy</p>
            <ul className="space-y-2">
              {[
                { label: 'No name required', icon: 'shield' },
                { label: 'Fully encrypted', icon: 'lock' },
                { label: 'Admin cannot trace you', icon: 'eye-off' },
                { label: 'NDPR compliant', icon: 'check' },
              ].map(({ label, icon }) => (
                <li key={label} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#e8f5ec] flex items-center justify-center shrink-0">
                    {icon === 'shield' && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {icon === 'lock' && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    )}
                    {icon === 'eye-off' && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </svg>
                    )}
                    {icon === 'check' && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick resources */}
          <div className="flex-1 px-3.5 py-3 overflow-y-auto">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Quick Resources</p>
            <ul className="space-y-1.5">
              {QUICK_RESOURCES.map((r) => (
                <li key={r} className="flex items-start gap-2 cursor-pointer group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4900a] mt-1.5 shrink-0" />
                  <span className="text-[11px] text-gray-500 group-hover:text-[#1a5c2a] transition leading-snug">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Chat header */}
          <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-xs font-medium shrink-0">
              MB
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Counsellor (MindBridge)</p>
              <p className="text-[11px] text-[#1a5c2a] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a5c2a]" />
                Online — ready to help
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-[#e8f5ec] border border-[#b6dfc0] px-2 py-1 rounded-full">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#1a5c2a" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-[10px] text-[#1a5c2a] font-medium">End-to-end encrypted</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => {
              if (msg.role === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              if (msg.role === 'counsellor') {
                return (
                  <div key={msg.id} className="flex flex-col items-start max-w-[72%]">
                    <p className="text-[10px] font-medium text-[#1a5c2a] mb-1">Counsellor</p>
                    <div className="bg-white border border-gray-100 text-gray-800 text-xs leading-relaxed px-3 py-2 rounded-xl rounded-bl-sm">
                      {msg.text}
                    </div>
                    <p className="text-[10px] text-gray-300 mt-1">{msg.time}</p>
                  </div>
                );
              }
              return (
                <div key={msg.id} className="flex flex-col items-end max-w-[72%] ml-auto">
                  <p className="text-[10px] font-medium text-white/60 mb-1 text-right" style={{ color: '#888' }}>
                    You (Anonymous)
                  </p>
                  <div className="bg-[#1a5c2a] text-white text-xs leading-relaxed px-3 py-2 rounded-xl rounded-br-sm">
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1 text-right">{msg.time} · Delivered</p>
                </div>
              );
            })}

            {/* Typing indicator */}
            {typing && (
              <div className="flex flex-col items-start">
                <p className="text-[10px] font-medium text-[#1a5c2a] mb-1">Counsellor</p>
                <div className="bg-white border border-gray-100 px-3 py-2.5 rounded-xl rounded-bl-sm flex items-center gap-1">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hint */}
          <p className="text-[10px] text-gray-300 text-center pb-1">
            Your messages are encrypted. The counsellor cannot see your identity.
          </p>

          {/* Input bar */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={ended ? 'Session ended.' : 'Type your message…'}
              disabled={ended}
              className={inputClass}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || typing || ended}
              className="w-9 h-9 rounded-lg bg-[#1a5c2a] hover:bg-[#2d7a3e] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}