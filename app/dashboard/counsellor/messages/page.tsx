'use client';

import { useState, useRef, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getMessages, sendMessage, markMessagesRead, getCounsellorStudents } from '@/lib/api';

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
  unread: number;
  last_message: string;
  last_time: string;
  messages: Message[];
}

interface Student {
  id: number;
  full_name: string;
  email: string;
  matric_number: string;
  department: string;
  level: string | null;
  is_active: boolean;
}

// ─── Conversation list item ───────────────────────────────────────────────────
function ConversationItem({ conv, active, onClick }: {
  conv: Conversation; active: boolean; onClick: () => void;
}) {
  const initials = conv.full_name
    .split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
        ${active ? 'bg-teal-50 border-r-2 border-teal-600' : 'hover:bg-gray-50'}`}
    >
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold border-[1.5px] bg-teal-50 text-teal-700 border-teal-200">
          {initials}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-[12px] font-semibold text-gray-900 truncate">{conv.full_name}</p>
          <span className="text-[10px] text-gray-400 shrink-0 ml-2">{conv.last_time}</span>
        </div>
        <p className="text-[11px] text-gray-500 truncate">{conv.last_message || 'No messages yet'}</p>
      </div>
      {conv.unread > 0 && (
        <div className="w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center shrink-0">
          <span className="text-[9px] font-bold text-white">{conv.unread}</span>
        </div>
      )}
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, currentUserId }: { msg: Message; currentUserId: number }) {
  const isMine = msg.sender_id === currentUserId;
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed
        ${isMine
          ? 'bg-teal-700 text-white rounded-br-sm'
          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isMine ? 'text-white/60 text-right' : 'text-gray-400'}`}>
          {msg.time}
          {isMine && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
        </p>
      </div>
    </div>
  );
}

// ─── New Message Modal ────────────────────────────────────────────────────────
function NewMessageModal({ onClose, onSelectStudent, existingIds }: {
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
  existingIds: number[];
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCounsellorStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter((s) =>
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.matric_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-semibold text-gray-900">New Conversation</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Select a student to message</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-50">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, matric or department..."
              className="w-full h-9 pl-8 pr-3 border border-gray-200 rounded-xl text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-600 transition bg-gray-50"
            />
          </div>
        </div>

        {/* Student list */}
        <div className="overflow-y-auto max-h-72 [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[11px] text-gray-400">No students found</p>
            </div>
          ) : filtered.map((student) => {
            const initials = student.full_name
              .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
            const alreadyMessaged = existingIds.includes(student.id);

            return (
              <button
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 transition text-left"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-gray-900 truncate">{student.full_name}</p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {student.matric_number} · {student.department}
                  </p>
                </div>
                {alreadyMessaged ? (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 shrink-0">
                    Existing
                  </span>
                ) : (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 shrink-0">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
          <p className="text-[10px] text-gray-400 text-center">
            Only students with appointments appear here
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CounsellorMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => String(c.user_id) === String(activeId)) ?? null;
  const filteredConvs = conversations.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase())
  );
  const existingConvIds = conversations.map((c) => c.user_id);

  useEffect(() => {
    const stored = Cookies.get('user');
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUserId(user.id);
    }
    getMessages().then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveId(String(data[0].user_id));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages]);

  useEffect(() => {
    if (activeId) {
      markMessagesRead(Number(activeId));
      setConversations(prev =>
        prev.map(c => String(c.user_id) === String(activeId) ? { ...c, unread: 0 } : c)
      );
    }
  }, [activeId]);

  // Called when counsellor picks a student from the modal
  function handleSelectStudent(student: Student) {
    setShowModal(false);

    // If conversation already exists, just open it
    const existing = conversations.find((c) => c.user_id === student.id);
    if (existing) {
      setActiveId(String(student.id));
      return;
    }

    // Otherwise create a placeholder conversation and open it
    const newConv: Conversation = {
      user_id: student.id,
      full_name: student.full_name,
      role: 'student',
      unread: 0,
      last_message: '',
      last_time: '',
      messages: [],
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveId(String(student.id));
  }

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeId) return;

    setSending(true);
    setInput('');

    try {
      const res = await sendMessage(Number(activeId), text);
      if (res.ok) {
        const newMsg = await res.json();
        setConversations(prev =>
          prev.map(c =>
            String(c.user_id) === String(activeId)
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
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const activeInitials = active?.full_name
    .split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? '';

  return (
    <div className="px-6 py-5 pb-10">

      {/* New Message Modal */}
      {showModal && (
        <NewMessageModal
          onClose={() => setShowModal(false)}
          onSelectStudent={handleSelectStudent}
          existingIds={existingConvIds}
        />
      )}

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
          <p className="text-[12px] text-gray-500 mt-0.5">Secure messages with your students</p>
        </div>

        {/* ── New Message button ── */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-9 px-4 bg-teal-700 hover:bg-teal-600 text-white text-[12px] font-semibold rounded-xl transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New Message
        </button>
      </div>

      {/* Chat layout */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex" style={{ height: '65vh' }}>

        {/* LEFT — conversation list */}
        <div className="w-[280px] shrink-0 border-r border-gray-100 flex flex-col">
          <div className="px-3 py-3 border-b border-gray-50">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full h-8 pl-8 pr-3 border border-gray-200 rounded-lg text-[11px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-600 transition bg-gray-50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex items-center justify-center mt-10">
                <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <p className="text-[11px] text-gray-400 mb-2">No conversations yet</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[11px] text-teal-600 font-medium hover:underline"
                >
                  Start one →
                </button>
              </div>
            ) : filteredConvs.map((c) => (
              <ConversationItem
                key={c.user_id}
                conv={c}
                active={String(activeId) === String(c.user_id)}
                onClick={() => setActiveId(String(c.user_id))}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — chat window */}
        {active ? (
          <div className="flex-1 flex flex-col min-w-0">

            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold border-[1.5px] bg-teal-50 text-teal-700 border-teal-200">
                  {activeInitials}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-gray-900">{active.full_name}</p>
                  <p className="text-[10px] text-gray-400 capitalize">{active.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 rounded-full px-3 py-1">
                <svg className="w-3 h-3 stroke-teal-600" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span className="text-[10px] text-teal-700 font-medium">Confidential</span>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/50 [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
                  <svg className="w-3 h-3 stroke-teal-600" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span className="text-[10px] text-gray-500">End-to-end encrypted · Confidential</span>
                </div>
              </div>

              {active.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <p className="text-[12px] font-medium text-gray-600">Start the conversation</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Send a message to {active.full_name.split(' ')[0]}
                  </p>
                </div>
              ) : (
                active.messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} currentUserId={currentUserId ?? -1} />
                ))
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
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 resize-none transition"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-9 h-9 bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition shrink-0"
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
          /* Empty state — no conversation selected */
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-gray-700">No conversation selected</p>
              <p className="text-[11px] text-gray-400 mt-1">Pick one from the list or start a new one</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 h-8 px-4 bg-teal-700 hover:bg-teal-600 text-white text-[11px] font-semibold rounded-xl transition"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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