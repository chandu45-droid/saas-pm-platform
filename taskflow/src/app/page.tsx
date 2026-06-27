import Link from "next/link";

const WHATSAPP_DEMO_URL = "#"; // Replace with actual WhatsApp link later

const CHAT_EXAMPLES = [
  { direction: "out" as const, text: "gym 6pm tomorrow" },
  {
    direction: "in" as const,
    text: "*gym* added!\nDue: Tomorrow 6:00 PM\nWill remind 30 min before.\n3 tasks pending.",
  },
  { direction: "out" as const, text: "spent 200 swiggy" },
  {
    direction: "in" as const,
    text: "Rs 200 logged -> food (swiggy)\nToday total: Rs 450",
  },
  { direction: "out" as const, text: "summary" },
  {
    direction: "in" as const,
    text: "*Summary (this week)*\nTasks: 12 done, 3 pending, 0 overdue\nSpent: Rs 2,450\nTop: food Rs 1,200, transport Rs 600",
  },
];

const FEATURES = [
  {
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    title: "Tasks in Chat",
    desc: "Just type what you need to do. No forms, no clicks, no setup. \"call mom\", \"buy groceries tomorrow 5pm\" — done.",
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Expense Tracking",
    desc: "\"chai 50\", \"2.5k rent\", \"spent 300 uber\". Auto-categorized with 100+ India merchant rules. See where your money goes.",
  },
  {
    icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    title: "Proactive Reminders",
    desc: "Morning briefs, task reminders, spend alerts, overdue nudges. Your assistant pushes info to you — you don't need to check.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Web Dashboard",
    desc: "Visual overview of tasks, expense charts, category breakdowns, and spending trends. WhatsApp captures, web dashboard analyzes.",
  },
  {
    icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
    title: "Hinglish-First",
    desc: "\"kal meeting hai 3 baje\", \"aaj kitna kharcha hua?\" — speaks your language. Built for how India actually texts.",
  },
  {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "Private & Local",
    desc: "Your data stays yours. No sharing, no ads, no selling your spending patterns. Simple, private, personal.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
              TF
            </div>
            <span className="text-lg font-semibold text-foreground">
              TaskFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              Dashboard
            </Link>
            <a
              href={WHATSAPP_DEMO_URL}
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Try on WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left - Copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                India&apos;s WhatsApp Personal Assistant
              </div>
              <h1 className="text-4xl font-bold leading-tight text-foreground lg:text-5xl lg:leading-tight">
                Your whole life,{" "}
                <span className="text-primary">organized in one chat</span>
              </h1>
              <p className="mt-4 text-lg text-muted leading-relaxed max-w-lg">
                Tasks, reminders, expenses — captured in WhatsApp, visualized on
                web. Zero setup. First message = first task. Works in Hinglish.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={WHATSAPP_DEMO_URL}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#22bf5b] transition-all"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Start on WhatsApp
                </a>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-base font-semibold text-foreground hover:bg-surface-alt transition-all"
                >
                  View Dashboard
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted">
                Free forever for personal use. No credit card needed.
              </p>
            </div>

            {/* Right - Chat Preview */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="rounded-2xl border border-border bg-surface shadow-2xl shadow-black/5 overflow-hidden">
                {/* Chat header */}
                <div className="flex items-center gap-3 bg-primary px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white text-sm font-bold">
                    TF
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      TaskFlow
                    </div>
                    <div className="text-[11px] text-white/70">online</div>
                  </div>
                </div>
                {/* Chat body */}
                <div className="flex flex-col gap-2.5 p-4 bg-surface-alt/50 min-h-[340px]">
                  {CHAT_EXAMPLES.map((msg, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] px-3 py-2 text-[13px] leading-relaxed whitespace-pre-line ${
                        msg.direction === "out"
                          ? "chat-bubble-out self-end"
                          : "chat-bubble-in self-start"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              How it works
            </h2>
            <p className="mt-2 text-muted">
              Three steps. Thirty seconds. That&apos;s it.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Message TaskFlow",
                desc: "Add TaskFlow on WhatsApp. Send your first message — a task, an expense, anything.",
                color: "bg-primary",
              },
              {
                step: "2",
                title: "Live Your Life",
                desc: "Get morning briefs, reminders before tasks, spend alerts when you go over budget.",
                color: "bg-accent",
              },
              {
                step: "3",
                title: "See the Big Picture",
                desc: "Open the web dashboard anytime to see charts, trends, and your complete productivity story.",
                color: "bg-[#8b5cf6]",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-xl border border-border bg-surface p-6"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${s.color} text-white text-lg font-bold`}
                >
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-2 text-muted">
              Built for how India actually uses WhatsApp.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group rounded-xl border border-border bg-surface p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={f.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="mx-auto max-w-3xl px-4 py-16 lg:py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Stop downloading apps.
            <br />
            <span className="text-primary">Start texting.</span>
          </h2>
          <p className="mt-4 text-muted max-w-lg mx-auto">
            500M+ Indians already have WhatsApp. TaskFlow turns it into the only
            productivity tool you need. Free forever for personal use.
          </p>
          <div className="mt-8">
            <a
              href={WHATSAPP_DEMO_URL}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#22bf5b] transition-all"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Start Free on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white text-xs font-bold">
                TF
              </div>
              <span className="text-sm font-medium text-foreground">
                TaskFlow
              </span>
            </div>
            <p className="text-xs text-muted">
              Built with care in Hyderabad. Not financial advice. Illustrative projections only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
