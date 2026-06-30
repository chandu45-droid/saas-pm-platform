"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type MessageStatus = "sending" | "sent" | "delivered";

type ChatMessage = {
  id: string;
  direction: "in" | "out";
  text: string;
  timestamp: Date;
  intent?: string;
  status?: MessageStatus;
};

const WELCOME_MESSAGE = `\u{1F44B} *Hey! I'm Sortd* — your personal assistant.

\u{1F4CB} *Tasks* — "gym 6pm tomorrow"
\u{1F4B0} *Expenses* — "spent 200 swiggy"
\u{1F4CA} *Overview* — "summary"
\u{1F4AC} *Multi-log* — "200 uber 150 chai"

Just type naturally — I understand Hinglish too! \u{1F1EE}\u{1F1F3}`;

// -- Contextual quick actions based on last intent --
type QuickActionSet = { label: string; emoji: string; message: string }[];

const STARTER_ACTIONS: QuickActionSet = [
  { label: "gym 6pm tomorrow", emoji: "\u{1F3CB}️", message: "gym 6pm tomorrow" },
  { label: "spent 200 swiggy", emoji: "\u{1F354}", message: "spent 200 swiggy" },
  { label: "200 uber 150 chai", emoji: "\u{1F4B8}", message: "200 uber 150 chai" },
  { label: "summary", emoji: "\u{1F4CA}", message: "summary" },
  { label: "pending tasks", emoji: "\u{1F4CB}", message: "pending tasks" },
  { label: "help", emoji: "❓", message: "help" },
];

const AFTER_TASK_ACTIONS: QuickActionSet = [
  { label: "add another task", emoji: "➕", message: "call mom by friday" },
  { label: "show pending", emoji: "\u{1F4CB}", message: "pending tasks" },
  { label: "log expense", emoji: "\u{1F4B0}", message: "spent 150 chai" },
  { label: "summary", emoji: "\u{1F4CA}", message: "summary" },
];

const AFTER_EXPENSE_ACTIONS: QuickActionSet = [
  { label: "log more", emoji: "➕", message: "chai 50" },
  { label: "today's spend", emoji: "\u{1F4B0}", message: "how much spent today?" },
  { label: "this week", emoji: "\u{1F4C5}", message: "this week expenses" },
  { label: "summary", emoji: "\u{1F4CA}", message: "summary" },
];

const AFTER_QUERY_ACTIONS: QuickActionSet = [
  { label: "add task", emoji: "\u{1F4CB}", message: "gym 6pm tomorrow" },
  { label: "log expense", emoji: "\u{1F4B0}", message: "spent 200 swiggy" },
  { label: "summary", emoji: "\u{1F4CA}", message: "summary" },
  { label: "help", emoji: "❓", message: "help" },
];

const AFTER_DONE_ACTIONS: QuickActionSet = [
  { label: "what's left", emoji: "\u{1F4CB}", message: "pending tasks" },
  { label: "add task", emoji: "➕", message: "buy groceries tomorrow" },
  { label: "summary", emoji: "\u{1F4CA}", message: "summary" },
];

function getQuickActions(lastIntent?: string): QuickActionSet {
  switch (lastIntent) {
    case "task_create":
      return AFTER_TASK_ACTIONS;
    case "expense_log":
    case "multi_expense_log":
      return AFTER_EXPENSE_ACTIONS;
    case "task_done":
    case "task_skip":
      return AFTER_DONE_ACTIONS;
    case "query_tasks":
    case "query_expenses":
    case "query_summary":
      return AFTER_QUERY_ACTIONS;
    default:
      return STARTER_ACTIONS;
  }
}

function formatTimestamp(d: Date): string {
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Convert WhatsApp-style *bold* to <strong> */
function renderMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(1, -1)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/** Delivery status ticks — WhatsApp style */
function DeliveryTicks({ status }: { status?: MessageStatus }) {
  if (!status || status === "sending") {
    // Single grey tick (clock icon while sending)
    return (
      <svg className="h-3.5 w-3.5 text-white/40" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "sent") {
    // Single tick
    return (
      <svg className="h-3.5 w-3.5 text-white/50" viewBox="0 0 16 16" fill="none">
        <path d="M4 8l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Double blue ticks (delivered)
  return (
    <svg className="h-4 w-4 text-blue-400" viewBox="0 0 20 16" fill="none">
      <path d="M2 8l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      direction: "in",
      text: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [lastIntent, setLastIntent] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    // Add user message with "sending" status
    const userMsgId = uid();
    const userMsg: ChatMessage = {
      id: userMsgId,
      direction: "out",
      text: trimmed,
      timestamp: new Date(),
      status: "sending",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    // After short delay, mark as "sent"
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: "sent" } : m))
      );
    }, 300);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();

      // Mark user message as delivered
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: "delivered" } : m))
      );

      const botMsg: ChatMessage = {
        id: uid(),
        direction: "in",
        text: data.reply,
        timestamp: new Date(),
        intent: data.intent,
      };
      setMessages((prev) => [...prev, botMsg]);
      setLastIntent(data.intent);
    } catch {
      const errMsg: ChatMessage = {
        id: uid(),
        direction: "in",
        text: "Something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const quickActions = getQuickActions(lastIntent);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-primary px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white text-sm font-bold">
            S
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Sortd</div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-white/70">
                {sending ? "typing..." : "online"}
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-colors flex items-center gap-1.5"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </Link>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-3">
          {/* Date chip */}
          <div className="flex justify-center">
            <span className="rounded-full bg-surface-alt px-3 py-1 text-[11px] text-muted shadow-sm">
              Today
            </span>
          </div>

          {/* Demo mode notice */}
          {messages.length <= 2 && (
            <div className="flex justify-center">
              <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-[11px] text-amber-400">
                {"\u{1F6E1}️ Demo mode — data resets on refresh"}
              </span>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.direction === "out" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[75%] px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-line ${
                  msg.direction === "out"
                    ? "chat-bubble-out"
                    : "chat-bubble-in"
                }`}
              >
                <div>{renderMarkdown(msg.text)}</div>
                <div className="mt-1 flex items-center gap-1.5 justify-end">
                  {msg.intent && msg.direction === "in" && (
                    <span className="text-[9px] uppercase tracking-wider opacity-40 font-medium">
                      {msg.intent.replace(/_/g, " ")}
                    </span>
                  )}
                  <span
                    className={`text-[10px] ${
                      msg.direction === "out"
                        ? "text-white/60"
                        : "text-muted/60"
                    }`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </span>
                  {msg.direction === "out" && (
                    <DeliveryTicks status={msg.status} />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div className="flex justify-start">
              <div className="chat-bubble-in px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Contextual quick actions — always visible, change based on last intent */}
      <div className="border-t border-border/50 bg-surface/50 px-3 py-2 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {quickActions.map((action) => (
              <button
                key={action.message}
                onClick={() => sendMessage(action.message)}
                disabled={sending}
                className="flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-all disabled:opacity-50 active:scale-95"
              >
                <span>{action.emoji}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-surface px-3 py-3 sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-border bg-surface-alt px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={sending || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark disabled:opacity-40 transition-all active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
