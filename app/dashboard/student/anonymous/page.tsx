'use client';

import { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  sender: 'user' | 'counsellor';
  text: string;
  time: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK INITIAL MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'counsellor',
    text: 'Hello! You are connected anonymously. Your identity is completely protected. How can I support you today?',
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// QUICK PROMPTS
// ─────────────────────────────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  'I am feeling anxious about exams',
  'I have been feeling very low lately',
  'I need someone to talk to',
  'I am struggling with stress',
];

// ─────────────────────────────────────────────────────────────────────────────
// AUTO REPLIES
// ─────────────────────────────────────────────────────────────────────────────
const AUTO_REPLIES = [
  'Thank you for sharing that with me. Can you tell me more about how long you have been feeling this way?',
  'I hear you. That sounds really difficult. You are not alone in feeling this way.',
  'It takes courage to reach out. I am here to listen and support you.',
  'That is completely understandable. Many students experience this. What has been the hardest part for you?',
  'I appreciate you opening up. Would you like to explore some coping strategies together?',
  'You are doing the right thing by talking about it. How has this been affecting your daily life?',
];

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[9px] font-bold shrink-0 mr-2 mt-1">
          MB
        </div>
      )}
      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[12px] leading-relaxed
        ${isUser
          ? 'bg-[#1a5c2a] text-white rounded-br-sm'
          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'}`}>
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1 ${isUser ? 'text-white/60 text-right' : 'text-gray-400'}`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPING INDICATOR
// ─────────────────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
        MB
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AnonymousChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text?: string) {
    const msgText = text ?? input.trim();
    if (!msgText || ended) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setStarted(true);
    setTyping(true);

    // Auto reply after delay
    setTimeout(() => {
      setTyping(false);
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        sender: 'counsellor',
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1800);
  }

  function endSession() {
    setEnded(true);
    const endMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'counsellor',
      text: 'This session has ended. Remember, you can always reach out again. Take care of yourself. 💚',
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, endMsg]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="px-6 py-5 pb-10">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-gray-900 tracking-[-0.4px]">
          Anonymous Chat
        </h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          Talk to a counsellor without revealing your identity
        </p>
      </div>

      {/* Privacy notice */}
      <div className="bg-[#1a5c2a] rounded-2xl px-5 py-4 mb-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="1.75">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-white mb-0.5">Your identity is protected</p>
          <p className="text-[11px] text-white/60 leading-relaxed">
            No personal information is collected in this session. You are identified only as an anonymous user. This session is not linked to your account.
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-white/60">Counsellor online</span>
        </div>
      </div>

      {/* Chat window */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col" style={{ height: '55vh' }}>

        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-[10px] font-bold">
              MB
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-900">MindBridge Counsellor</p>
              <p className="text-[10px] text-gray-400">Anonymous session · End-to-end encrypted</p>
            </div>
          </div>
          {!ended && started && (
            <button
              onClick={endSession}
              className="h-8 px-3 border border-red-200 text-red-600 rounded-lg text-[11px] font-medium hover:bg-red-50 transition"
            >
              End Session
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/50 [&::-webkit-scrollbar]:hidden">

          {/* Lock notice */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
              <svg className="w-3 h-3 stroke-[#1a5c2a]" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span className="text-[10px] text-gray-500">Anonymous & encrypted session</span>
            </div>
          </div>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts — show before first message */}
        {!started && !ended && (
          <div className="px-5 py-3 border-t border-gray-50 bg-white shrink-0">
            <p className="text-[10px] text-gray-400 mb-2">Quick start:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-[11px] font-medium px-3 py-1.5 bg-[#e8f5ec] text-[#1a5c2a] rounded-full hover:bg-[#1a5c2a] hover:text-white transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        {!ended ? (
          <div className="px-4 py-3 border-t border-gray-100 flex items-end gap-2 shrink-0 bg-white">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message anonymously..."
              rows={1}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-[12px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 resize-none transition"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="w-9 h-9 bg-[#1a5c2a] hover:bg-[#2d7a3e] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 text-center shrink-0">
            <p className="text-[11px] text-gray-400 mb-2">Session ended</p>
            <button
              onClick={() => {
                setMessages(INITIAL_MESSAGES);
                setStarted(false);
                setEnded(false);
              }}
              className="h-8 px-4 bg-[#1a5c2a] text-white rounded-xl text-[11px] font-medium hover:bg-[#2d7a3e] transition"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>

      {/* Crisis box */}
      <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 flex items-start gap-4">
        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 stroke-red-600" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-red-700 mb-0.5">Experiencing a crisis?</p>
          <p className="text-[11px] text-red-600 leading-relaxed">
            If you are in immediate danger, please call emergency services or the Nigerian suicide prevention line: <strong>0800-SUICIDE</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}