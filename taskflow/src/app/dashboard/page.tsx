"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

// Types matching DB schema
type Task = {
  id: string;
  title: string;
  status: string | null;
  category: string | null;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string | null;
  source: string | null;
};

type Expense = {
  id: string;
  amountPaise: number;
  category: string;
  merchant: string | null;
  description: string | null;
  transactionDate: string;
  createdAt: string | null;
};

type CategoryBreakdown = {
  category: string;
  totalPaise: number;
  count: number;
};

type DashboardData = {
  tasks: Task[];
  expenses: Expense[];
  stats: {
    pendingTasks: number;
    doneTasks: number;
    overdueTasks: number;
    totalSpentPaise: number;
    expenseCount: number;
    categoryBreakdown: CategoryBreakdown[];
  };
};

const CATEGORY_COLORS: Record<string, string> = {
  food: "#ef4444",
  transport: "#3b82f6",
  shopping: "#8b5cf6",
  entertainment: "#f59e0b",
  bills: "#06b6d4",
  health: "#22c55e",
  education: "#ec4899",
  groceries: "#10b981",
  other: "#64748b",
};

function formatRupees(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / 86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 6)
    return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusBadge({ status }: { status: string | null }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    done: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    skipped: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const s = status ?? "pending";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${colors[s] ?? colors.pending}`}
    >
      {s}
    </span>
  );
}

// Simple bar chart for category breakdown
function CategoryChart({ data }: { data: CategoryBreakdown[] }) {
  const maxAmount = Math.max(...data.map((d) => d.totalPaise), 1);
  return (
    <div className="space-y-2.5">
      {data.map((item) => (
        <div key={item.category} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-foreground capitalize">
              {item.category}
            </span>
            <span className="text-xs text-muted">
              {formatRupees(item.totalPaise)}{" "}
              <span className="text-[10px]">({item.count})</span>
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.totalPaise / maxAmount) * 100}%`,
                backgroundColor:
                  CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other,
              }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-sm text-muted text-center py-4">
          No expenses yet
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskFilter, setTaskFilter] = useState<"pending" | "today" | "all">(
    "pending"
  );
  const [expensePeriod, setExpensePeriod] = useState<
    "today" | "this_week" | "this_month"
  >("this_month");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/dashboard?taskFilter=${taskFilter}&expensePeriod=${expensePeriod}`
      );
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [taskFilter, expensePeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
              TF
            </div>
            <span className="text-lg font-semibold text-foreground">
              TaskFlow
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden sm:block">
              Synced with WhatsApp
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              U
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Your tasks and expenses at a glance
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
            {error}
            <button
              onClick={fetchData}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
          {[
            {
              label: "Pending",
              value: data?.stats.pendingTasks ?? "-",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "text-amber-500",
              bgColor: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
              label: "Done",
              value: data?.stats.doneTasks ?? "-",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "text-green-500",
              bgColor: "bg-green-50 dark:bg-green-950/30",
            },
            {
              label: "Overdue",
              value: data?.stats.overdueTasks ?? "-",
              icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z",
              color: "text-red-500",
              bgColor: "bg-red-50 dark:bg-red-950/30",
            },
            {
              label: "Spent",
              value: data
                ? formatRupees(data.stats.totalSpentPaise)
                : "-",
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              color: "text-primary",
              bgColor: "bg-primary/5",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-xl border border-border p-4 ${stat.bgColor}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className={`h-4 w-4 ${stat.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={stat.icon}
                  />
                </svg>
                <span className="text-xs text-muted">{stat.label}</span>
              </div>
              <div className="text-xl font-bold text-foreground">
                {loading ? (
                  <span className="inline-block h-6 w-12 animate-pulse rounded bg-border" />
                ) : (
                  stat.value
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Task List — 3/5 width */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              {/* Task header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-base font-semibold text-foreground">
                  Tasks
                </h2>
                <div className="flex gap-1 rounded-lg bg-surface-alt p-0.5">
                  {(["pending", "today", "all"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTaskFilter(f)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        taskFilter === f
                          ? "bg-surface text-foreground shadow-sm"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {f === "pending"
                        ? "Pending"
                        : f === "today"
                        ? "Today"
                        : "All"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Task items */}
              <div className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 animate-pulse">
                      <div className="h-4 w-3/4 rounded bg-border mb-2" />
                      <div className="h-3 w-1/3 rounded bg-border" />
                    </div>
                  ))
                ) : data?.tasks && data.tasks.length > 0 ? (
                  data.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-surface-alt/50 transition-colors"
                    >
                      <div
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          task.status === "done"
                            ? "border-green-500 bg-green-500"
                            : task.status === "skipped"
                            ? "border-gray-300 bg-gray-300"
                            : "border-border"
                        }`}
                      >
                        {task.status === "done" && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            task.status === "done"
                              ? "text-muted line-through"
                              : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <StatusBadge status={task.status} />
                          {task.dueAt && (
                            <span className="text-[11px] text-muted">
                              {formatDate(task.dueAt)} {formatTime(task.dueAt)}
                            </span>
                          )}
                          {task.category && (
                            <span className="text-[11px] text-muted capitalize">
                              {task.category}
                            </span>
                          )}
                        </div>
                      </div>
                      {task.source && (
                        <span className="text-[10px] text-muted/50 shrink-0">
                          {task.source === "whatsapp" ? "WA" : "Web"}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-muted">No tasks yet</p>
                    <p className="text-xs text-muted/70 mt-1">
                      Send a message on WhatsApp to create your first task
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expense Panel — 2/5 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Summary Card */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-base font-semibold text-foreground">
                  Expenses
                </h2>
                <div className="flex gap-1 rounded-lg bg-surface-alt p-0.5">
                  {(["today", "this_week", "this_month"] as const).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setExpensePeriod(p)}
                        className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                          expensePeriod === p
                            ? "bg-surface text-foreground shadow-sm"
                            : "text-muted hover:text-foreground"
                        }`}
                      >
                        {p === "today"
                          ? "Today"
                          : p === "this_week"
                          ? "Week"
                          : "Month"}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Total spent */}
              <div className="px-4 pt-4 pb-2">
                <p className="text-xs text-muted mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-foreground">
                  {loading ? (
                    <span className="inline-block h-8 w-24 animate-pulse rounded bg-border" />
                  ) : (
                    formatRupees(data?.stats.totalSpentPaise ?? 0)
                  )}
                </p>
                <p className="text-xs text-muted mt-0.5">
                  {data?.stats.expenseCount ?? 0} transactions
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="px-4 pb-4 pt-2">
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <div className="h-3 w-1/3 rounded bg-border mb-1" />
                        <div className="h-2 rounded bg-border" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <CategoryChart
                    data={data?.stats.categoryBreakdown ?? []}
                  />
                )}
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Recent Expenses
                </h3>
              </div>
              <div className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 animate-pulse">
                      <div className="h-3 w-1/2 rounded bg-border mb-1" />
                      <div className="h-3 w-1/4 rounded bg-border" />
                    </div>
                  ))
                ) : data?.expenses && data.expenses.length > 0 ? (
                  data.expenses.slice(0, 8).map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              CATEGORY_COLORS[exp.category] ??
                              CATEGORY_COLORS.other,
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">
                            {exp.merchant ?? exp.description ?? exp.category}
                          </p>
                          <p className="text-[11px] text-muted capitalize">
                            {exp.category} · {formatDate(exp.transactionDate)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-foreground shrink-0 ml-2">
                        {formatRupees(exp.amountPaise)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-muted">No expenses yet</p>
                    <p className="text-xs text-muted/70 mt-1">
                      &quot;spent 200 swiggy&quot; on WhatsApp
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick tip */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-primary mb-1">
                Quick tip
              </p>
              <p className="text-xs text-muted leading-relaxed">
                All data here syncs from WhatsApp. Just text TaskFlow to
                create tasks or log expenses. Try: &quot;gym tomorrow 6pm&quot;
                or &quot;chai 50&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-8 pb-4 text-center">
          <p className="text-[11px] text-muted/60">
            Financial data shown is for personal tracking only. Not financial
            advice. All projections are illustrative.
          </p>
        </div>
      </main>
    </div>
  );
}
