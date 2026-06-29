"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type ChatMessage = {
  id: string;
  direction: "in" | "out";
  text: string;
  timestamp: Date;
  intent?: string;
};

const WELCOME_MESSAGE = `*Welcome to Sortd!* Your personal assistant.

Try typing:
  *Tasks:* "gym 6pm tomorrow", "call mom"
  *Expenses:* "spent 200 swiggy", "chai 50"
  *Queries:* "summary", "pending tasks"
  *Help:* "help"

Type anything to get started!`;

const QUICK_ACTIONS = [
  "gym 6pm tomorrow",
  "spent 200 swiggy",
  "summary",
  "pending tasks",
  "help",
];

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

    // Add user message
    const userMsg: ChatMessage = {
      id: uid(),
      direction: "out",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: uid(),
        direction: "in",
        text: data.reply,
        timestamp: new Date(),
        intent: data.intent,
      };
      setMessages((prev) => [...prev, botMsg]);
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
                Demo Mode — In-memory
              </span>
            </div>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-white/25 transition-colors"
        >
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
                <div
                  className={`mt-1 flex items-center gap-1.5 ${
                    msg.direction === "out"
                      ? "justify-end"
                      : "justify-end"
                  }`}
                >
                  {msg.intent && msg.direction === "in" && (
                    <span className="text-[9px] uppercase tracking-wider opacity-40 font-medium">
                      {msg.intent}
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

      {/* Quick actions (shown when few messages) */}
      {messages.length <= 2 && (
        <div className="border-t border-border/50 bg-surface/50 px-3 py-2.5 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="text-[10px] text-muted uppercase tracking-wider font-medium mb-2">
              Try these
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  disabled={sending}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-all disabled:opacity-50"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark disabled:opacity-40 transition-all"
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
