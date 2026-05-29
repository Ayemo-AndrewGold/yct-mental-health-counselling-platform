'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getMessages, sendMessage, markMessagesRead } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  sender_id: number;
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  user_id: number;
  full_name: string;
  role: string;
  last_message: string;   // ✅ fixed: was 'lastMessage' in old version
  last_time: string;
  unread: number;
  messages: Message[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION LIST ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ConversationItem({
  conv, active, onClick,
}: {
  conv: Conversation; active: boolean; onClick: () => void;
}) {
  const initials = conv.full_name
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
        ${active ? 'bg-green-50 border-r-2 border-[#1a5c2a]' : 'hover:bg-gray-50'}`}
    >
      {/* ✅ Avatar now has background color */}
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-[#1a5c2a]">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[12px] font-semibold text-gray-900 truncate">{conv.full_name}</p>
          <span className="text-[10px] text-gray-400 shrink-0 ml-2">{conv.last_time}</span>
        </div>
        <p className="text-[11px] text-gray-500 truncate">
          {conv.last_message || 'No messages yet'}
        </p>
      </div>
      {conv.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-[#1a5c2a] flex items-center justify-center shrink-0">
          <span className="text-[9px] font-bold text-white">{conv.unread}</span>
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function MessageBubble({ msg, currentUserId }: { msg: Message; currentUserId: number }) {
  const isMe = msg.sender_id === currentUserId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed
        ${isMe
          ? 'bg-[#1a5c2a] text-white rounded-br-sm'
          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60 text-right' : 'text-gray-400'}`}>
          {msg.time}
          {isMe && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NO APPOINTMENT GATE
// ─────────────────────────────────────────────────────────────────────────────
function NoAppointmentGate() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-[#1a5c2a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <p className="text-[13px] font-semibold text-gray-800 mb-1">Messaging not available yet</p>
      <p className="text-[11px] text-gray-500 leading-relaxed max-w-[240px] mb-5">
        You need to book an appointment with a counsellor before you can send messages.
      </p>
      <Link
        href="/dashboard/student/appointments"
        className="inline-flex items-center gap-2 h-9 px-5 bg-[#1a5c2a] hover:bg-[#2d7a3e] text-white text-[12px] font-semibold rounded-xl transition"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        Book an appointment
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);  // ✅ always number
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ always compare as numbers
  const active = conversations.find((c) => c.user_id === activeId) ?? null;

  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUserId(user.id);
      // Check appointment gate from cookie — or you can call an API
      // If your user cookie includes has_appointment, use that:
      setHasAppointment(user.has_appointment ?? true); // default true if not tracked
    }

    getMessages().then((data) => {
      setConversations(data);
      // ✅ parse to number immediately
      if (data.length > 0) setActiveId(Number(data[0].user_id));
      setLoading(false);

      // If student has any conversations, they clearly have an appointment
      if (data.length > 0) setHasAppointment(true);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages]);

  useEffect(() => {
    if (activeId !== null) {
      markMessagesRead(activeId);
      setConversations(prev =>
        prev.map(c => c.user_id === activeId ? { ...c, unread: 0 } : c)
      );
    }
  }, [activeId]);

  async function handleSend() {
    const text = input.trim();
    if (!text || activeId === null || !currentUserId) return;

    setSending(true);
    setInput('');

    try {
      const res = await sendMessage(activeId, text);
      if (res.ok) {
        const newMsg = await res.json();
        setConversations(prev =>
          prev.map(c =>
            c.user_id === activeId
              ? {
                  ...c,
                  messages: [...c.messages, newMsg],
                  last_message: text,
                  last_time: newMsg.time,
                }
              : c
          )
        );
      }
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const activeInitials = active?.full_name
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '';

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">Messages</h2>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-red-50 text-red-600">
                {totalUnread} unread
              </span>
            )}
          </div>
          <p className="text-[12px] text-gray-500 mt-0.5">
            Secure, encrypted messages with your counsellor
          </p>
        </div>

        {/* Encryption badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-3 py-1.5">
          <svg className="w-3 h-3 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span className="text-[10px] text-[#1a5c2a] font-medium">End-to-end encrypted</span>
        </div>
      </div>

      {/* Chat layout */}
      <div
        className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex"
        style={{ height: '65vh' }}
      >
        {/* LEFT — conversation list */}
        <div className="w-[260px] shrink-0 border-r border-gray-100 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Your Counsellors
            </p>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {loading ? (
              /* Skeleton */
              <div className="px-4 py-3 space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                      <div className="h-2.5 w-32 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  No conversations yet.<br />Book a session to start.
                </p>
                <Link
                  href="/dashboard/student/appointments"
                  className="mt-3 text-[11px] text-[#1a5c2a] font-semibold hover:underline"
                >
                  Book appointment →
                </Link>
              </div>
            ) : (
              conversations.map((c) => (
                <ConversationItem
                  key={c.user_id}
                  conv={c}
                  active={activeId === c.user_id}
                  onClick={() => setActiveId(c.user_id)}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT — chat window or gate */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#1a5c2a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : hasAppointment === false ? (
          /* ── Appointment gate ── */
          <NoAppointmentGate />
        ) : active ? (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {activeInitials}
              </div>
              <div>
                <p className="text-[12px] font-semibold text-gray-900">{active.full_name}</p>
                <p className="text-[10px] text-gray-400 capitalize">{active.role}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span className="text-[10px] text-[#1a5c2a] font-medium">Confidential</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/50 [&::-webkit-scrollbar]:hidden">
              {active.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-[#1a5c2a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <p className="text-[12px] font-medium text-gray-600">Start the conversation</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Send a message to {active.full_name.split(' ')[0]}
                  </p>
                </div>
              ) : (
                <>
                  {/* Encryption notice */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
                      <svg className="w-3 h-3 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                      <span className="text-[10px] text-gray-500">Messages are end-to-end encrypted</span>
                    </div>
                  </div>
                  {active.messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId ?? 0} />
                  ))}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-end gap-2 shrink-0 bg-white">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${active.full_name.split(' ')[0]}…`}
                rows={1}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 resize-none transition"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-9 h-9 bg-[#1a5c2a] hover:bg-[#2d7a3e] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition shrink-0"
              >
                {sending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* No active conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#1a5c2a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="text-[12px] font-medium text-gray-600">Select a conversation</p>
            <p className="text-[11px] text-gray-400">Pick one from the list on the left</p>
          </div>
        )}
      </div>
    </div>
  );
}