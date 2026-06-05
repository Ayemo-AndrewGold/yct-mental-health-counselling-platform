'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { getMessages, sendMessage, markMessagesRead } from '@/lib/api';
import { MessageSquare, CalendarDays, Lock, Send, ArrowLeft, ChevronRight } from 'lucide-react';

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
function ConversationItem({ conv, active, onClick, dm }: {
  conv: Conversation; active: boolean; onClick: () => void; dm: boolean;
}) {
  const initials = conv.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3.5 py-3.5 text-left transition-colors"
      style={{
        background: active ? (dm ? 'rgba(0,135,81,0.20)' : 'rgba(0,135,81,0.12)') : 'transparent',
        borderRight: active ? '3px solid #008751' : '3px solid transparent',
        borderBottom: `1px solid ${dm ? 'rgba(0,135,81,0.18)' : 'rgba(182,230,204,0.4)'}`,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = dm ? 'rgba(0,135,81,0.12)' : 'rgba(0,135,81,0.05)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
        style={{ background: '#008751', border: `2px solid ${dm ? 'rgba(0,135,81,0.4)' : 'rgba(0,135,81,0.2)'}` }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[13px] font-semibold truncate"
            style={{ color: dm ? '#fff' : '#1a3d1f' }}>{conv.full_name}</p>
          <span className="text-[10px] shrink-0 ml-2"
            style={{ color: dm ? 'rgba(255,255,255,0.35)' : '#3B6D11' }}>{conv.last_time}</span>
        </div>
        <p className="text-[12px] truncate"
          style={{ color: dm ? 'rgba(255,255,255,0.5)' : '#3B6D11' }}>
          {conv.last_message || 'No messages yet'}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {conv.unread > 0 && (
          <div className="w-[18px] h-[18px] rounded-full bg-[#008751] flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">{conv.unread}</span>
          </div>
        )}
        <ChevronRight size={14} style={{ color: dm ? 'rgba(255,255,255,0.3)' : '#b6e6cc' }} />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function MessageBubble({ msg, currentUserId, dm }: {
  msg: Message; currentUserId: number; dm: boolean;
}) {
  const isMe = msg.sender_id === currentUserId;
  return (
    <div className={`flex mb-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[80%] sm:max-w-[68%] px-3.5 py-2.5 text-[13px] leading-relaxed"
        style={isMe
          ? { background: '#008751', color: '#fff', borderRadius: '18px 18px 4px 18px' }
          : dm
            ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,135,81,0.25)', color: '#fff', borderRadius: '18px 18px 18px 4px' }
            : { background: '#fff', border: '1px solid #b6e6cc', color: '#1a3d1f', borderRadius: '18px 18px 18px 4px', boxShadow: '0 1px 4px rgba(0,135,81,0.06)' }
        }>
        <p>{msg.text}</p>
        <p className="text-[10px] mt-1"
          style={{ color: isMe ? 'rgba(255,255,255,0.55)' : dm ? 'rgba(255,255,255,0.4)' : '#3B6D11', textAlign: isMe ? 'right' : 'left' }}>
          {msg.time}{isMe && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NO APPOINTMENT GATE
// ─────────────────────────────────────────────────────────────────────────────
function NoAppointmentGate({ dm }: { dm: boolean }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white"
        style={{ background: '#008751' }}>
        <MessageSquare size={22} />
      </div>
      <p className="text-[15px] font-bold mb-1.5" style={{ color: dm ? '#fff' : '#1a3d1f' }}>
        Messaging not available yet
      </p>
      <p className="text-[13px] leading-relaxed max-w-[260px] mb-5"
        style={{ color: dm ? 'rgba(255,255,255,0.5)' : '#3B6D11' }}>
        You need to book an appointment with a counsellor before you can send messages.
      </p>
      <Link href="/dashboard/student/appointments"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-[13px] font-bold rounded-full transition-opacity hover:opacity-90"
        style={{ background: '#008751' }}>
        <CalendarDays size={14} /> Book an appointment
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentMessagesPage() {
  const [conversations,   setConversations]   = useState<Conversation[]>([]);
  const [activeId,        setActiveId]        = useState<number | null>(null);
  const [input,           setInput]           = useState('');
  const [loading,         setLoading]         = useState(true);
  const [sending,         setSending]         = useState(false);
  const [currentUserId,   setCurrentUserId]   = useState<number | null>(null);
  const [hasAppointment,  setHasAppointment]  = useState<boolean | null>(null);
  const [dm,              setDm]              = useState(false);
  // Mobile: 'list' | 'chat'
  const [mobileView,      setMobileView]      = useState<'list' | 'chat'>('list');
  const bottomRef = useRef<HTMLDivElement>(null);

  const active         = conversations.find(c => c.user_id === activeId) ?? null;
  const totalUnread    = conversations.reduce((a, c) => a + c.unread, 0);
  const activeInitials = active?.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '';

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') setDm(true);
    const handler = (e: Event) =>
      setDm((e as CustomEvent<{ isDarkMode: boolean }>).detail.isDarkMode);
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUserId(user.id);
      setHasAppointment(user.has_appointment ?? true);
    }
    getMessages().then(data => {
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

  function handleSelectConv(userId: number) {
    setActiveId(userId);
    setMobileView('chat'); // switch to chat panel on mobile
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || activeId === null || !currentUserId) return;
    setSending(true); setInput('');
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
    } finally { setSending(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  // ── Tokens ──
  const C = {
    h:           dm ? '#fff'                      : '#1a3d1f',
    sub:         dm ? 'rgba(255,255,255,0.5)'     : '#3B6D11',
    shellBg:     dm ? 'rgba(0,30,15,0.6)'         : '#f0faf4',
    shellBorder: dm ? 'rgba(0,135,81,0.25)'       : '#b6e6cc',
    sideBorder:  dm ? 'rgba(0,135,81,0.20)'       : '#b6e6cc',
    sideLabel:   dm ? 'rgba(255,255,255,0.45)'    : '#3B6D11',
    chatHdrBg:   dm ? 'rgba(0,135,81,0.12)'       : 'rgba(0,135,81,0.06)',
    msgsBg:      dm ? 'rgba(0,20,10,0.4)'         : 'rgba(240,250,244,0.5)',
    inputBarBg:  dm ? 'rgba(0,25,12,0.7)'         : '#f0faf4',
    textareaBg:  dm ? 'rgba(255,255,255,0.07)'    : '#fff',
    textareaBdr: dm ? 'rgba(0,135,81,0.25)'       : '#b6e6cc',
    textareaClr: dm ? '#fff'                      : '#1a3d1f',
    encPillBg:   dm ? 'rgba(255,255,255,0.06)'    : '#fff',
    encPillBdr:  dm ? 'rgba(0,135,81,0.25)'       : '#b6e6cc',
    encPillTxt:  dm ? 'rgba(255,255,255,0.4)'     : '#3B6D11',
    emptyIconBg: dm ? 'rgba(0,135,81,0.15)'       : 'rgba(0,135,81,0.1)',
    badgeBg:     dm ? 'rgba(226,75,74,0.2)'       : '#fdf0f0',
    badgeClr:    dm ? '#fca5a5'                   : '#A32D2D',
    encBg:       dm ? 'rgba(0,135,81,0.15)'       : '#f0faf4',
    encBdr:      dm ? 'rgba(0,135,81,0.35)'       : '#b6e6cc',
    skBg1:       dm ? 'rgba(255,255,255,0.08)'    : '#b6e6cc',
    skBg2:       dm ? 'rgba(255,255,255,0.05)'    : '#d1f0e0',
    backBtn:     dm ? 'rgba(255,255,255,0.08)'    : 'rgba(0,135,81,0.08)',
    backBtnBdr:  dm ? 'rgba(255,255,255,0.12)'    : '#b6e6cc',
    backBtnTxt:  dm ? 'rgba(255,255,255,0.8)'     : '#008751',
  };

  // ─────────────────────────────────────────
  // SIDEBAR PANEL
  // ─────────────────────────────────────────
  const SidebarPanel = (
    <div className="flex flex-col pt-14 h-full" style={{ borderRight: `1px solid ${C.sideBorder}` }}>
      <div className="px-4 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${C.sideBorder}` }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: C.sideLabel }}>
          Your Counsellors
        </p>
        {totalUnread > 0 && (
          <span className="text-[9px] font-bold px-2 py-[2px] rounded-full"
            style={{ background: C.badgeBg, color: C.badgeClr }}>
            {totalUnread} unread
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {loading ? (
          <div className="px-4 py-3 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full shrink-0" style={{ background: C.skBg1 }} />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 rounded" style={{ background: C.skBg1 }} />
                  <div className="h-2.5 w-32 rounded" style={{ background: C.skBg2 }} />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
              style={{ background: C.emptyIconBg }}>
              <MessageSquare size={18} style={{ color: '#008751' }} />
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color: C.sub }}>
              No conversations yet.<br />Book a session to start.
            </p>
            <Link href="/dashboard/student/appointments"
              className="mt-3 text-[12px] font-bold hover:underline" style={{ color: '#008751' }}>
              Book appointment →
            </Link>
          </div>
        ) : (
          conversations.map(c => (
            <ConversationItem
              key={c.user_id} conv={c}
              active={activeId === c.user_id}
              onClick={() => handleSelectConv(c.user_id)}
              dm={dm}
            />
          ))
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────
  // CHAT PANEL
  // ─────────────────────────────────────────
  const ChatPanel = (
    <div className="flex-1 flex pt-10 flex-col min-w-0 h-full">

      {active ? (
        <>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{ borderBottom: `1px solid ${C.sideBorder}`, background: C.chatHdrBg }}>

            {/* Mobile back button */}
            <button
              onClick={() => setMobileView('list')}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
              style={{ background: C.backBtn, border: `1px solid ${C.backBtnBdr}` }}
              aria-label="Back to conversations"
            >
              <ArrowLeft size={15} style={{ color: C.backBtnTxt }} />
            </button>

            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ background: '#008751' }}>
              {activeInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold truncate" style={{ color: C.h }}>{active.full_name}</p>
              <p className="text-[10px] capitalize" style={{ color: C.sub }}>{active.role}</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 shrink-0"
              style={{ background: C.encBg, border: `1px solid ${C.encBdr}` }}>
              <Lock size={10} style={{ color: '#008751' }} />
              <span className="text-[10px] font-semibold hidden sm:inline" style={{ color: '#008751' }}>
                Confidential
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden"
            style={{ background: C.msgsBg }}>
            {active.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: C.emptyIconBg }}>
                  <MessageSquare size={20} style={{ color: '#008751' }} />
                </div>
                <p className="text-[13px] font-bold mb-1" style={{ color: C.h }}>Start the conversation</p>
                <p className="text-[12px]" style={{ color: C.sub }}>
                  Send a message to {active.full_name.split(' ')[0]}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ background: C.encPillBg, border: `1px solid ${C.encPillBdr}` }}>
                    <Lock size={10} style={{ color: '#008751' }} />
                    <span className="text-[10px]" style={{ color: C.encPillTxt }}>
                      Messages are end-to-end encrypted
                    </span>
                  </div>
                </div>
                {active.messages.map(msg => (
                  <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId ?? 0} dm={dm} />
                ))}
              </>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-end gap-2 px-3 py-3 shrink-0"
            style={{ borderTop: `1px solid ${C.sideBorder}`, background: C.inputBarBg }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${active.full_name.split(' ')[0]}…`}
              rows={1}
              className="flex-1 rounded-[14px] px-3.5 py-2.5 text-[13px] resize-none focus:outline-none transition-all"
              style={{ background: C.textareaBg, border: `1px solid ${C.textareaBdr}`, color: C.textareaClr }}
              onFocus={e => { e.currentTarget.style.borderColor = '#008751'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,135,81,0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.textareaBdr; e.currentTarget.style.boxShadow = 'none'; }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white shrink-0 transition-all hover:opacity-90 disabled:opacity-40"
              style={{ background: '#008751' }}
            >
              {sending
                ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={15} />
              }
            </button>
          </div>
        </>
      ) : (
        /* Nothing selected — desktop only empty state */
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: C.emptyIconBg }}>
            <MessageSquare size={20} style={{ color: '#008751' }} />
          </div>
          <p className="text-[14px] font-bold" style={{ color: C.h }}>Select a conversation</p>
          <p className="text-[12px]" style={{ color: C.sub }}>Pick one from the list on the left</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 py-5 pb-10">

      {/* ── Page Header ── */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {/* Mobile: show back arrow when in chat view */}
            {mobileView === 'chat' && (
              <button onClick={() => setMobileView('list')}
                className="lg:hidden mr-1 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: C.backBtn, border: `1px solid ${C.backBtnBdr}` }}>
                <ArrowLeft size={15} style={{ color: C.backBtnTxt }} />
              </button>
            )}
            <h2 className="text-[20px] sm:text-[22px] font-bold" style={{ color: C.h }}>
              {mobileView === 'chat' && active
                ? active.full_name.split(' ')[0]
                : 'Messages'
              }
            </h2>
            {totalUnread > 0 && mobileView === 'list' && (
              <span className="text-[10px] font-bold px-2.5 py-[3px] rounded-full"
                style={{ background: C.badgeBg, color: C.badgeClr }}>
                {totalUnread} unread
              </span>
            )}
          </div>
          <p className="text-[12px]" style={{ color: C.sub }}>
            {mobileView === 'chat' && active
              ? active.role
              : 'Secure, encrypted messages with your counsellor'
            }
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background: C.encBg, border: `1px solid ${C.encBdr}` }}>
          <Lock size={12} style={{ color: '#008751' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#008751' }}>End-to-end encrypted</span>
        </div>
      </div>

      {/* ── Chat Shell ── */}
      <div
        className="relative rounded-[20px] overflow-hidden"
        style={{
          height: '72vh',
          minHeight: 420,
          background: C.shellBg,
          border: `1px solid ${C.shellBorder}`,
          display: 'flex',
        }}
      >
        {/* Deco */}
        <div className="absolute bottom-[-40px] right-[-40px] w-[140px] h-[140px] rounded-full pointer-events-none opacity-[0.04]"
          style={{ background: '#008751' }} />

        {/* ── MOBILE: single panel switching ── */}
        <div className="flex w-full lg:hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#008751', borderTopColor: 'transparent' }} />
            </div>
          ) : hasAppointment === false ? (
            <NoAppointmentGate dm={dm} />
          ) : mobileView === 'list' ? (
            <div className="w-full flex flex-col">
              {SidebarPanel}
            </div>
          ) : (
            <div className="w-full flex flex-col">
              {ChatPanel}
            </div>
          )}
        </div>

        {/* ── DESKTOP: side-by-side ── */}
        <div className="hidden lg:flex w-full">
          {/* Sidebar */}
          <div className="w-[260px] shrink-0 flex flex-col">
            {SidebarPanel}
          </div>

          {/* Chat */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#008751', borderTopColor: 'transparent' }} />
            </div>
          ) : hasAppointment === false ? (
            <NoAppointmentGate dm={dm} />
          ) : (
            ChatPanel
          )}
        </div>
      </div>
    </div>
  );
}