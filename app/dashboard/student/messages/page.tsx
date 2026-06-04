'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getMessages, sendMessage, markMessagesRead } from '@/lib/api';
import { MessageSquare, CalendarDays, Lock, Send } from 'lucide-react';

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
  last_message: string;
  last_time: string;
  unread: number;
  messages: Message[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ConversationItem({ conv, active, onClick }: {
  conv: Conversation; active: boolean; onClick: () => void;
}) {
  const initials = conv.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left transition-colors"
      style={{
        background: active ? 'rgba(0,135,81,0.12)' : 'transparent',
        borderRight: active ? '3px solid #008751' : '3px solid transparent',
        borderBottom: '1px solid rgba(182,230,204,0.4)',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(0,135,81,0.05)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? 'rgba(0,135,81,0.12)' : 'transparent'; }}
    >
      <div
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
        style={{ background: '#008751', border: '2px solid rgba(0,135,81,0.2)' }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[12px] font-semibold truncate" style={{ color: '#1a3d1f' }}>{conv.full_name}</p>
          <span className="text-[9px] shrink-0 ml-2" style={{ color: '#3B6D11' }}>{conv.last_time}</span>
        </div>
        <p className="text-[11px] truncate" style={{ color: '#3B6D11' }}>
          {conv.last_message || 'No messages yet'}
        </p>
      </div>
      {conv.unread > 0 && (
        <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
          style={{ background: '#008751' }}>
          <span className="text-[8px] font-bold text-white">{conv.unread}</span>
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
    <div className={`flex mb-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[68%] px-3.5 py-2.5 text-[12px] leading-relaxed"
        style={isMe
          ? { background: '#008751', color: '#fff', borderRadius: '18px 18px 4px 18px' }
          : { background: '#fff', border: '1px solid #b6e6cc', color: '#1a3d1f', borderRadius: '18px 18px 18px 4px', boxShadow: '0 1px 4px rgba(0,135,81,0.06)' }
        }
      >
        <p>{msg.text}</p>
        <p className="text-[9px] mt-1"
          style={{ color: isMe ? 'rgba(255,255,255,0.55)' : '#3B6D11', textAlign: isMe ? 'right' : 'left' }}>
          {msg.time}{isMe && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
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
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white"
        style={{ background: '#008751' }}>
        <MessageSquare size={22} />
      </div>
      <p className="text-[14px] font-bold mb-1.5" style={{ color: '#1a3d1f' }}>
        Messaging not available yet
      </p>
      <p className="text-[12px] leading-relaxed max-w-[240px] mb-5" style={{ color: '#3B6D11' }}>
        You need to book an appointment with a counsellor before you can send messages.
      </p>
      <Link
        href="/dashboard/student/appointments"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-[12px] font-bold rounded-full transition-opacity hover:opacity-90"
        style={{ background: '#008751' }}
      >
        <CalendarDays size={13} /> Book an appointment
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId]           = useState<number | null>(null);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active       = conversations.find((c) => c.user_id === activeId) ?? null;
  const totalUnread  = conversations.reduce((a, c) => a + c.unread, 0);
  const activeInitials = active?.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '';

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUserId(user.id);
      setHasAppointment(user.has_appointment ?? true);
    }
    getMessages().then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveId(Number(data[0].user_id));
      setLoading(false);
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
              ? { ...c, messages: [...c.messages, newMsg], last_message: text, last_time: newMsg.time }
              : c
          )
        );
      }
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="px-6 py-5 pb-10">

      {/* ── Page Header ── */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-[30px] font-bold" style={{ color: '#1a3d1f' }}>Messages</h2>
            {totalUnread > 0 && (
              <span className="text-[10px] font-bold px-2.5 py-[3px] rounded-full"
                style={{ background: '#fdf0f0', color: '#A32D2D' }}>
                {totalUnread} unread
              </span>
            )}
          </div>
          <p className="text-[16px]" style={{ color: '#3B6D11' }}>
            Secure, encrypted messages with your counsellor
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background: '#f0faf4', border: '1px solid #b6e6cc' }}>
          <Lock size={12} style={{ color: '#008751' }} />
          <span className="text-[12px] font-semibold" style={{ color: '#008751' }}>End-to-end encrypted</span>
        </div>
      </div>

      {/* ── Chat Shell ── */}
      <div
        className="relative rounded-[20px] overflow-hidden flex"
        style={{ height: '68vh', minHeight: 480, background: '#f0faf4', border: '1px solid #b6e6cc' }}
      >
        {/* Deco circle */}
        <div className="absolute bottom-[-40px] right-[-40px] w-[160px] h-[160px] rounded-full pointer-events-none opacity-[0.04]"
          style={{ background: '#008751' }} />

        {/* ── LEFT: Conversation list ── */}
        <div className="w-[260px] shrink-0 flex flex-col" style={{ borderRight: '1px solid #b6e6cc' }}>
          <div className="px-4 py-4" style={{ borderBottom: '1px solid #b6e6cc' }}>
            <p className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ color: '#3B6D11' }}>
              Your Counsellors
            </p>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="px-4 py-3 space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full shrink-0" style={{ background: '#b6e6cc' }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-24 rounded" style={{ background: '#b6e6cc' }} />
                      <div className="h-2.5 w-32 rounded" style={{ background: '#d1f0e0' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'rgba(0,135,81,0.1)' }}>
                  <MessageSquare size={18} style={{ color: '#008751' }} />
                </div>
                <p className="text-[14px] leading-relaxed" style={{ color: '#3B6D11' }}>
                  No conversations yet.<br />Book a session to start.
                </p>
                <Link href="/dashboard/student/sessions"
                  className="mt-3 text-[16px] font-bold hover:underline" style={{ color: '#008751' }}>
                  Book appointment →
                </Link>
              </div>
            ) : (
              conversations.map(c => (
                <ConversationItem
                  key={c.user_id} conv={c}
                  active={activeId === c.user_id}
                  onClick={() => setActiveId(c.user_id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── RIGHT: Chat window or gate ── */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: '#008751', borderTopColor: 'transparent' }} />
          </div>

        ) : hasAppointment === false ? (
          <NoAppointmentGate />

        ) : active ? (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-3.5 shrink-0"
              style={{ borderBottom: '1px solid #b6e6cc', background: 'rgba(0,135,81,0.06)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: '#008751' }}>
                {activeInitials}
              </div>
              <div>
                <p className="text-[13px] font-bold" style={{ color: '#1a3d1f' }}>{active.full_name}</p>
                <p className="text-[10px] capitalize" style={{ color: '#3B6D11' }}>{active.role}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ background: '#f0faf4', border: '1px solid #b6e6cc' }}>
                <Lock size={11} style={{ color: '#008751' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#008751' }}>Confidential</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 [&::-webkit-scrollbar]:hidden"
              style={{ background: 'rgba(240,250,244,0.5)' }}>
              {active.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ background: 'rgba(0,135,81,0.1)' }}>
                    <MessageSquare size={20} style={{ color: '#008751' }} />
                  </div>
                  <p className="text-[13px] font-bold mb-1" style={{ color: '#1a3d1f' }}>Start the conversation</p>
                  <p className="text-[11px]" style={{ color: '#3B6D11' }}>
                    Send a message to {active.full_name.split(' ')[0]}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{ background: '#fff', border: '1px solid #b6e6cc' }}>
                      <Lock size={10} style={{ color: '#008751' }} />
                      <span className="text-[10px]" style={{ color: '#3B6D11' }}>
                        Messages are end-to-end encrypted
                      </span>
                    </div>
                  </div>
                  {active.messages.map(msg => (
                    <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId ?? 0} />
                  ))}
                </>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="flex items-end gap-2.5 px-4 py-3 shrink-0"
              style={{ borderTop: '1px solid #b6e6cc', background: '#f0faf4' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${active.full_name.split(' ')[0]}…`}
                rows={1}
                className="flex-1 rounded-[14px] px-4 py-2.5 text-[12px] resize-none focus:outline-none transition-all"
                style={{ background: '#fff', border: '1px solid #b6e6cc', color: '#1a3d1f' }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#008751';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,135,81,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#b6e6cc';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-[38px] h-[38px] rounded-[12px] flex items-center justify-center text-white shrink-0 transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: '#008751' }}
              >
                {sending
                  ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Send size={15} />
                }
              </button>
            </div>
          </div>

        ) : (
          /* No conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,135,81,0.1)' }}>
              <MessageSquare size={20} style={{ color: '#008751' }} />
            </div>
            <p className="text-[18px] font-bold" style={{ color: '#1a3d1f' }}>Select a conversation</p>
            <p className="text-[13px]" style={{ color: '#3B6D11' }}>Pick one from the list on the left</p>
          </div>
        )}
      </div>
    </div>
  );
}