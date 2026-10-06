'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMessages, sendMessage, markMessagesRead, getCounsellorStudents } from '@/lib/api';

interface Message      { id: number; sender_id: number; text: string; time: string; read: boolean }
interface Conversation { user_id: number; full_name: string; role: string; unread: number; last_message: string; last_time: string; messages: Message[] }
interface Student      { id: number; full_name: string; email: string; matric_number: string; department: string; level: string | null; is_active: boolean }

// ─── Dark-mode hook ───────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDark(saved === 'dark');
    const handler = (e: Event) => {
      const ev = e as CustomEvent<{ isDarkMode: boolean }>;
      if (ev.detail?.isDarkMode !== undefined) setDark(ev.detail.isDarkMode);
    };
    window.addEventListener('themeToggle', handler);
    return () => window.removeEventListener('themeToggle', handler);
  }, []);
  return {
    dark,
    panelBg:       dark ? 'rgba(255,255,255,0.05)' : '#ffffff',
    panelBorder:   dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
    divider:       dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    activeConv:    dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    activeConvBdr: dark ? 'rgba(0,135,81,0.50)'    : '#1a5c2a',
    hoverBg:       dark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
    msgAreaBg:     dark ? 'rgba(0,0,0,0.15)'       : '#f8fafb',
    inputBg:       dark ? 'rgba(255,255,255,0.07)' : '#ffffff',
    inputBorder:   dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
    textPrimary:   dark ? '#ffffff'                : '#111827',
    textSecondary: dark ? 'rgba(255,255,255,0.65)' : '#374151',
    textMuted:     dark ? 'rgba(255,255,255,0.40)' : '#9ca3af',
    greenBg:       dark ? 'rgba(0,135,81,0.20)'    : '#e8f5ec',
    greenBorder:   dark ? 'rgba(0,135,81,0.35)'    : '#b6dfc0',
    greenText:     dark ? '#86efac'                : '#1a5c2a',
    myMsgBg:       dark ? '#005c38'                : '#1a5c2a',
    theirMsgBg:    dark ? 'rgba(255,255,255,0.08)' : '#ffffff',
    theirMsgBdr:   dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.07)',
    searchBg:      dark ? 'rgba(255,255,255,0.07)' : '#f3f4f6',
  };
}

// ─── Conversation item ────────────────────────────────────────────────────────
function ConversationItem({ conv, active, onClick, t }: {
  conv: Conversation; active: boolean; onClick: () => void; t: ReturnType<typeof useTheme>;
}) {
  const initials = conv.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
      style={{
        background: active ? t.activeConv : 'transparent',
        borderRight: active ? `3px solid ${t.activeConvBdr}` : '3px solid transparent',
        borderBottom: `1px solid ${t.divider}`,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = t.hoverBg; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold border-[1.5px] shrink-0"
        style={{ background: t.greenBg, color: t.greenText, borderColor: t.greenBorder }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[15px] font-semibold truncate font-[lexend]" style={{ color: t.textPrimary }}>
            {conv.full_name}
          </p>
          <span className="text-[12px] shrink-0 ml-2 font-[lexend]" style={{ color: t.textMuted }}>
            {conv.last_time}
          </span>
        </div>
        <p className="text-[13px] truncate font-[lexend]" style={{ color: t.textMuted }}>
          {conv.last_message || 'No messages yet'}
        </p>
      </div>
      {conv.unread > 0 && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: t.greenText }}>
          <span className="text-[10px] font-bold" style={{ color: t.dark ? '#003d1f' : '#ffffff' }}>
            {conv.unread}
          </span>
        </div>
      )}
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, currentUserId, t }: {
  msg: Message; currentUserId: number; t: ReturnType<typeof useTheme>;
}) {
  const isMine = Number(msg.sender_id) === Number(currentUserId);
  return (
    <div className={`flex w-full mb-4 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm"
        style={isMine
          ? { background: t.myMsgBg, borderBottomRightRadius: '6px' }
          : { background: t.theirMsgBg, border: `1px solid ${t.theirMsgBdr}`, borderBottomLeftRadius: '6px' }
        }>
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-[lexend]"
          style={{ color: isMine ? '#ffffff' : t.textPrimary }}>{msg.text}</p>
        <div className={`mt-1.5 text-[12px] font-[lexend] ${isMine ? 'text-right' : 'text-left'}`}
          style={{ color: isMine ? 'rgba(255,255,255,0.60)' : t.textMuted }}>
          {msg.time}{isMine && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── New message modal ────────────────────────────────────────────────────────
function NewMessageModal({ onClose, onSelectStudent, existingIds, t }: {
  onClose: () => void; onSelectStudent: (s: Student) => void;
  existingIds: number[]; t: ReturnType<typeof useTheme>;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getCounsellorStudents().then(data => { setStudents(data); setLoading(false); });
  }, []);

  const filtered = students.filter(s =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.matric_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ background: t.panelBg === 'rgba(255,255,255,0.05)' ? (t.dark ? '#0d1f14' : '#ffffff') : '#ffffff', border: `1px solid ${t.panelBorder}` }}>

        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div>
            <p className="text-[16px] font-semibold font-[syne]" style={{ color: t.textPrimary }}>New Conversation</p>
            <p className="text-[13px] mt-0.5 font-[lexend]" style={{ color: t.textMuted }}>Select a student to message</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition"
            style={{ background: t.dark ? 'rgba(255,255,255,0.08)':'#f3f4f6' }}>
            <svg className="w-4 h-4" style={{ color: t.textMuted }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.textMuted }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, matric or department..."
              className="w-full h-11 pl-9 pr-3 rounded-xl text-[14px] font-[lexend] focus:outline-none transition"
              style={{ background: t.searchBg, border: `1px solid ${t.inputBorder}`, color: t.textPrimary }} />
          </div>
        </div>

        <div className="overflow-y-auto max-h-72 [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: t.greenText }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[14px] font-[lexend]" style={{ color: t.textMuted }}>No students found</p>
            </div>
          ) : filtered.map(student => {
            const initials = student.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const already  = existingIds.includes(student.id);
            return (
              <button key={student.id} onClick={() => onSelectStudent(student)}
                className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left"
                style={{ borderBottom: `1px solid ${t.divider}` }}
                onMouseEnter={e => (e.currentTarget.style.background = t.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 border"
                  style={{ background: t.greenBg, color: t.greenText, borderColor: t.greenBorder }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold truncate font-[lexend]" style={{ color: t.textPrimary }}>
                    {student.full_name}
                  </p>
                  <p className="text-[13px] truncate font-[lexend]" style={{ color: t.textMuted }}>
                    {student.matric_number} · {student.department}
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full font-[lexend] shrink-0"
                  style={already
                    ? { background: t.greenBg, color: t.greenText, border: `1px solid ${t.greenBorder}` }
                    : { background: t.dark ? 'rgba(34,197,94,0.15)':'#f0fdf4', color: t.dark ? '#86efac':'#15803d', border: `1px solid ${t.dark ? 'rgba(34,197,94,0.30)':'#bbf7d0'}` }
                  }>{already ? 'Existing' : 'New'}</span>
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3" style={{ borderTop: `1px solid ${t.divider}`, background: t.dark ? 'rgba(255,255,255,0.03)':'#fafafa' }}>
          <p className="text-[13px] text-center font-[lexend]" style={{ color: t.textMuted }}>
            Only students with appointments appear here
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CounsellorMessagesPage() {
  const t = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId,      setActiveId]      = useState<string | number | null>(null);
  const [input,         setInput]         = useState('');
  const [loading,       setLoading]       = useState(true);
  const [sending,       setSending]       = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [search,        setSearch]        = useState('');
  const [showModal,     setShowModal]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active         = conversations.find(c => String(c.user_id) === String(activeId)) ?? null;
  const filteredConvs  = conversations.filter(c => c.full_name.toLowerCase().includes(search.toLowerCase()));
  const existingConvIds = conversations.map(c => c.user_id);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setConversations(prev => JSON.stringify(prev) !== JSON.stringify(data) ? data : prev);
      if (!activeId && data.length > 0) setActiveId(String(data[0].user_id));
    } catch {}
  };

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) setCurrentUserId(JSON.parse(stored).id);
    loadMessages().finally(() => setLoading(false));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [active?.messages]);
  useEffect(() => { const i = setInterval(loadMessages, 3000); return () => clearInterval(i); }, [activeId]);
  useEffect(() => {
    if (activeId) {
      markMessagesRead(Number(activeId));
      setConversations(prev => prev.map(c => String(c.user_id) === String(activeId) ? { ...c, unread: 0 } : c));
    }
  }, [activeId]);

  function handleSelectStudent(student: Student) {
    setShowModal(false);
    const existing = conversations.find(c => c.user_id === student.id);
    if (existing) { setActiveId(String(student.id)); return; }
    const newConv: Conversation = { user_id: student.id, full_name: student.full_name, role: 'student', unread: 0, last_message: '', last_time: '', messages: [] };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(String(student.id));
  }

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeId) return;
    setSending(true); setInput('');
    try {
      const res = await sendMessage(Number(activeId), text);
      if (res.ok) {
        const newMsg = await res.json();
        setConversations(prev => prev.map(c =>
          String(c.user_id) === String(activeId)
            ? { ...c, messages: [...c.messages, newMsg], last_message: text, last_time: newMsg.time }
            : c
        ));
      }
    } finally { setSending(false); }
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const totalUnread    = conversations.reduce((a, c) => a + c.unread, 0);
  const activeInitials = active?.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '';

  return (
    <div className="px-4 sm:px-6 py-6 pb-10 font-[lexend]">
      {showModal && (
        <NewMessageModal onClose={() => setShowModal(false)} onSelectStudent={handleSelectStudent}
          existingIds={existingConvIds} t={t} />
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-[26px] font-bold font-[syne]" style={{ color: t.textPrimary }}>Messages</h2>
            {totalUnread > 0 && (
              <span className="text-[13px] font-bold px-3 py-1 rounded-full"
                style={{ background: t.dark ? 'rgba(239,68,68,0.18)':'#fef2f2', color: t.dark ? '#fca5a5':'#b91c1c' }}>
                {totalUnread} unread
              </span>
            )}
          </div>
          <p className="text-[15px] mt-1" style={{ color: t.textMuted }}>Secure messages with your students</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-11 px-5 rounded-xl text-[15px] font-semibold transition-colors"
          style={{ background: '#008751', color: '#ffffff' }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Message
        </button>
      </div>

      {/* Chat layout */}
      <div className="rounded-2xl overflow-hidden flex"
        style={{ height: '68vh', background: t.panelBg, border: `1px solid ${t.panelBorder}` }}>

        {/* LEFT — conversation list */}
        <div className="w-[300px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${t.divider}` }}>
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${t.divider}` }}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: t.textMuted }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full h-10 pl-9 pr-3 rounded-xl text-[14px] focus:outline-none transition"
                style={{ background: t.searchBg, border: `1px solid ${t.inputBorder}`, color: t.textPrimary }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex items-center justify-center mt-12">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: t.greenText }} />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: t.greenBg }}>
                  <svg className="w-6 h-6" style={{ color: t.greenText }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="text-[14px] font-[lexend] mb-2" style={{ color: t.textMuted }}>No conversations yet</p>
                <button onClick={() => setShowModal(true)}
                  className="text-[14px] font-medium hover:underline font-[lexend]"
                  style={{ color: t.greenText }}>Start one →</button>
              </div>
            ) : filteredConvs.map(c => (
              <ConversationItem key={c.user_id} conv={c}
                active={String(activeId) === String(c.user_id)}
                onClick={() => setActiveId(String(c.user_id))} t={t} />
            ))}
          </div>
        </div>

        {/* RIGHT — chat window */}
        {active ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0"
              style={{ borderBottom: `1px solid ${t.divider}` }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold border-[1.5px]"
                  style={{ background: t.greenBg, color: t.greenText, borderColor: t.greenBorder }}>
                  {activeInitials}
                </div>
                <div>
                  <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textPrimary }}>
                    {active.full_name}
                  </p>
                  <p className="text-[13px] capitalize font-[lexend]" style={{ color: t.textMuted }}>{active.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-1.5"
                style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
                <svg className="w-3.5 h-3.5" style={{ color: t.greenText }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span className="text-[13px] font-medium font-[lexend]" style={{ color: t.greenText }}>Confidential</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:hidden"
              style={{ background: t.msgAreaBg }}>
              <div className="flex items-center justify-center mb-5">
                <div className="flex items-center gap-2 rounded-full px-4 py-1.5"
                  style={{ background: t.theirMsgBg, border: `1px solid ${t.theirMsgBdr}` }}>
                  <svg className="w-3.5 h-3.5" style={{ color: t.greenText }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span className="text-[13px] font-[lexend]" style={{ color: t.textMuted }}>
                    End-to-end encrypted · Confidential
                  </span>
                </div>
              </div>

              {active.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
                    <svg className="w-7 h-7" style={{ color: t.greenText }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                    Start the conversation
                  </p>
                  <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                    Send a message to {active.full_name.split(' ')[0]}
                  </p>
                </div>
              ) : active.messages.map(msg => (
                <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId ?? -1} t={t} />
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-4 flex items-end gap-3 shrink-0"
              style={{ borderTop: `1px solid ${t.divider}`, background: t.panelBg }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={`Message ${active.full_name.split(' ')[0]}…`}
                rows={1}
                className="flex-1 rounded-2xl px-5 py-3.5 text-[15px] font-[lexend] placeholder:opacity-50 focus:outline-none resize-none transition"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.textPrimary }} />
              <button onClick={handleSend} disabled={!input.trim() || sending}
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition shrink-0 disabled:opacity-40"
                style={{ background: '#008751' }}>
                {sending
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                }
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
              <svg className="w-8 h-8" style={{ color: t.greenText }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold font-[lexend]" style={{ color: t.textSecondary }}>
                No conversation selected
              </p>
              <p className="text-[14px] mt-1 font-[lexend]" style={{ color: t.textMuted }}>
                Pick one from the list or start a new one
              </p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 h-11 px-5 rounded-xl text-[15px] font-semibold font-[lexend] transition"
              style={{ background: '#008751', color: '#ffffff' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
