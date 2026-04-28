'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ClientSearchParams from './ClientSearchParams';

const useSearchParams = dynamic(() => import('next/navigation').then((mod) => mod.useSearchParams), { ssr: false });
import Image from 'next/image';

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
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

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
          text:
            "Hello, welcome to MindBridge. You're in a completely safe and anonymous space. I don’t know who you are — and that’s okay. How are you feeling today?",
          time: getTime(),
        },
      ]);
    }
  }, [sessionId]);

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

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

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
    } catch (error) {
      console.error('Error sending message:', error);
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
        id: `sys-end`,
        role: 'system',
        text: 'Session ended. All messages have been cleared from this device.',
        time: getTime(),
      },
    ]);
  }

  const inputClass =
    'flex-1 h-12 border border-gray-200 rounded-xl px-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition bg-white';

  return (
    <>
      <Suspense fallback={<div>Loading session...</div>}>
        <ClientSearchParams onSessionId={setSessionId} />
      </Suspense>
      <div className="h-screen flex flex-col overflow-hidden bg-[#f7faf8]">

        {/* TOP BAR */}
        <div className="h-[64px] bg-[#1a5c2a] px-5 py-1 flex items-center justify-between">
            <Link href="/" className="flex items-center pt-15  gap-3 mb-14">
              <Image src="/favicon.png" width={55} height={55} alt="Logo" />
              <div>
                <p className="text-white text-xl font-semibold">MindBridge</p>
                <p className="text-white/60 text-sm">
                  Yabatech Mental Health Platform
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#f5b829]/20 border border-[#f5b829]/40 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#f5b829]" />
                <span className="text-xs text-[#f5b829] font-medium">Anonymous Session</span>
              </div>

              <button
                onClick={handleEndSession}
                className="text-xs text-white/80 border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                End session
              </button>
            </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* SIDEBAR */}
          <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-100">

            <div className="p-5 border-b">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Session</p>
              <div className="bg-[#e8f5ec] border border-[#b6dfc0] rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-[#1a5c2a]">ID: {sessionId}</p>
                <p className="text-xs text-[#5a8f6a] mt-1">Fully anonymous session</p>
              </div>
            </div>

            <div className="p-5 border-b">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Privacy</p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>🔒 Fully encrypted</li>
                <li>🛡️ No identity required</li>
                <li>👁️ Cannot be traced</li>
                <li>✔️ NDPR compliant</li>
              </ul>
            </div>

            <div className="p-5 overflow-y-auto">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Resources</p>
              <ul className="space-y-2">
                {QUICK_RESOURCES.map((r) => (
                  <li key={r} className="text-sm text-gray-500 hover:text-[#1a5c2a] cursor-pointer transition">
                    • {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CHAT */}
          <div className="flex-1 flex flex-col">

            {/* CHAT HEADER */}
            <div className="bg-white border-b px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-gray-900">Counsellor</p>
                <p className="text-xs text-[#1a5c2a] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1a5c2a]" />
                  Online
                </p>
              </div>

              <div className="text-xs text-gray-400">Secure session</div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">

              {messages.map((msg) => (
                <div key={msg.id} className={`max-w-[75%] ${msg.role === 'user' ? 'ml-auto text-right' : ''}`}>

                  <div
                    className={`text-base leading-relaxed px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-[#1a5c2a] text-white'
                        : msg.role === 'system'
                        ? 'bg-gray-100 text-gray-500 text-sm mx-auto text-center'
                        : 'bg-white border text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </div>

                  <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                </div>
              ))}

              {typing && (
                <p className="text-sm text-gray-400">Counsellor is typing...</p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="border-t bg-white p-4 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={ended ? 'Session ended' : 'Type your message...'}
                disabled={ended}
                className={inputClass}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-[#1a5c2a] text-white px-5 rounded-xl text-sm font-medium hover:bg-[#145022] transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}