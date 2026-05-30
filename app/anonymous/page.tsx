'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ClientSearchParams from './ClientSearchParams';
import Image from 'next/image';
import { Lock, Shield, Eye, CheckCircle, Send, X, ChevronRight } from 'lucide-react';

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

const PRIVACY_ITEMS = [
  { icon: Lock,         text: 'Fully encrypted' },
  { icon: Shield,       text: 'No identity required' },
  { icon: Eye,          text: 'Cannot be traced' },
  { icon: CheckCircle,  text: 'NDPR compliant' },
];

function getTime() {
  const now = new Date();
  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function AnonymousSessionPage() {
  const [sessionId,  setSessionId]  = useState('');
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState('');
  const [typing,     setTyping]     = useState(false);
  const [ended,      setEnded]      = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      setMessages([
        {
          id: 'sys-1',
          role: 'system',
          text: `Anonymous session started · ID: ${sessionId} · No personal data stored`,
          time: getTime(),
        },
        {
          id: 'c-1',
          role: 'counsellor',
          text: "Hello, welcome to MindBridge. You're in a completely safe and anonymous space. I don't know who you are — and that's okay. How are you feeling today?",
          time: getTime(),
        },
      ]);
    }
  }, [sessionId]);

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

      if (!res.ok) throw new Error('Failed');

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

  function handleEndSession() {
    setEnded(true);
    setMessages((prev) => [
      ...prev,
      {
        id: 'sys-end',
        role: 'system',
        text: 'Session ended. All messages have been cleared from this device.',
        time: getTime(),
      },
    ]);
  }

  return (
    <>
      <Suspense fallback={<div>Loading session...</div>}>
        <ClientSearchParams onSessionId={setSessionId} />
      </Suspense>

      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 font-[lexend]">

        {/* ── TOP BAR ── */}
        <header className="h-16 bg-gradient-to-r from-[#1a5c2a] via-[#1e6b31] to-[#1a5c2a] shadow-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">

          {/* Left — logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Image src="/favicon.png" width={28} height={28} alt="Logo" className="rounded-full" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-[0.95rem] leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                MindBridge
              </p>
              <p className="text-white/50 text-[0.65rem]">Yabatech Mental Health Platform</p>
            </div>
          </Link>

          {/* Center — session badge */}
          <div className="flex items-center gap-2 bg-yellow-400/15 border border-yellow-400/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
            <span className="text-[0.72rem] text-yellow-300 font-semibold whitespace-nowrap">Anonymous Session</span>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-2">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 transition"
              aria-label="Session info"
            >
              <Shield size={16} />
            </button>

            <button
              onClick={handleEndSession}
              disabled={ended}
              className="flex items-center gap-1.5 text-[0.75rem] text-white/80 border border-white/20 bg-white/10 hover:bg-white/20 disabled:opacity-40 px-3 py-1.5 rounded-full transition font-medium"
            >
              <X size={13} />
              <span className="hidden sm:inline">End session</span>
            </button>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* ── SIDEBAR ── */}
          {/* Mobile overlay */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}

          <aside
            className={`
              absolute md:static z-40 top-0 left-0 h-full w-72 md:w-64
              flex flex-col shrink-0
              bg-gradient-to-b from-blue-50 via-white to-green-50
              border-r border-gray-200 shadow-md
              transition-transform duration-300
              ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >

            {/* Session ID card */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Session
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[0.82rem] font-bold text-[#1a5c2a]">
                    {sessionId || 'Starting…'}
                  </p>
                  <span className="text-[0.6rem] bg-green-100 text-green-700 border border-green-200 px-2 py-[2px] rounded-full font-semibold">
                    Active
                  </span>
                </div>
                <p className="text-[0.68rem] text-gray-400 mt-1">Fully anonymous · No data stored</p>
              </div>
            </div>

            {/* Privacy */}
            <div className="p-4 border-b border-gray-100">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Privacy
              </p>
              <ul className="space-y-2">
                {PRIVACY_ITEMS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 p-2 rounded-xl bg-white/70 border border-gray-100">
                    <span className="w-7 h-7 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-[#1a5c2a]" />
                    </span>
                    <span className="text-[0.78rem] text-gray-600">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="p-4 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Resources
              </p>
              <ul className="space-y-1">
                {QUICK_RESOURCES.map((r) => (
                  <li
                    key={r}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[0.78rem] text-gray-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-[#1a5c2a] hover:font-medium cursor-pointer transition-all duration-200 group"
                  >
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-[#1a5c2a] transition-colors shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── CHAT PANEL ── */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-700 to-green-400 flex items-center justify-center text-white font-bold text-[11px] shrink-0 ring-2 ring-green-100">
                  C
                </div>
                <div>
                  <p className="text-[0.88rem] font-semibold text-gray-900">Counsellor</p>
                  <p className="text-[0.68rem] text-green-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online · Secure session
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                <Lock size={11} className="text-blue-500" />
                <span className="text-[0.68rem] text-blue-600 font-medium">End-to-end encrypted</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user'
                      ? 'items-end'
                      : msg.role === 'system'
                      ? 'items-center'
                      : 'items-start'
                  }`}
                >
                  {/* System message */}
                  {msg.role === 'system' && (
                    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 max-w-[90%]">
                      <Lock size={11} className="text-gray-400 shrink-0" />
                      <p className="text-[0.68rem] text-gray-500 text-center">{msg.text}</p>
                    </div>
                  )}

                  {/* Counsellor message */}
                  {msg.role === 'counsellor' && (
                    <div className="flex items-end gap-2 max-w-[78%] sm:max-w-[65%]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-700 to-green-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mb-1">
                        C
                      </div>
                      <div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                          <p className="text-[0.85rem] text-gray-800 leading-relaxed">{msg.text}</p>
                        </div>
                        <p className="text-[0.62rem] text-gray-400 mt-1 ml-1">{msg.time}</p>
                      </div>
                    </div>
                  )}

                  {/* User message */}
                  {msg.role === 'user' && (
                    <div className="max-w-[78%] sm:max-w-[65%]">
                      <div className="bg-gradient-to-br from-[#1a5c2a] to-[#1e6b31] rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
                        <p className="text-[0.85rem] text-white leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-[0.62rem] text-gray-400 mt-1 text-right mr-1">{msg.time}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-700 to-green-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    C
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className={`border-t border-gray-200 bg-white/90 backdrop-blur-sm p-3 sm:p-4 shrink-0 shadow-lg`}>
              {ended ? (
                <div className="flex items-center justify-center gap-3 py-3">
                  <div className="flex items-center gap-2 text-gray-400 text-[0.82rem]">
                    <Lock size={14} />
                    Session ended — all messages cleared
                  </div>
                  <Link
                    href="/dashboard/student"
                    className="text-[0.78rem] font-medium text-[#1a5c2a] border border-green-200 bg-green-50 px-4 py-1.5 rounded-full hover:bg-green-100 transition"
                  >
                    Return home
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`flex-1 flex items-center gap-2 border rounded-2xl px-4 py-2.5 bg-white transition-all duration-200 shadow-sm focus-within:ring-2 focus-within:border-transparent
                    ${ended ? 'border-gray-100 opacity-50' : 'border-gray-200 focus-within:ring-[#1a5c2a]/20 focus-within:border-[#1a5c2a]'}
                  `}>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Type your message…"
                      disabled={ended}
                      className="flex-1 text-[0.88rem] text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || ended}
                    className="w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 bg-gradient-to-br from-[#1a5c2a] to-[#1e6b31] text-white rounded-2xl flex items-center justify-center gap-2 text-[0.82rem] font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shrink-0"
                  >
                    <Send size={15} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}