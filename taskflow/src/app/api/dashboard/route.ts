import { NextRequest, NextResponse } from "next/server";
import { getDemoStore } from "@/lib/demo/store";

// Only import DB when actually needed (lazy)
const isDemoMode = !process.env.DATABASE_URL;

/**
 * GET /api/dashboard?userId=...&taskFilter=pending&expensePeriod=this_month
 *
 * Returns aggregated dashboard data: tasks + expenses + stats.
 * In demo mode (no DATABASE_URL), serves from the in-memory store.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const taskFilter = (searchParams.get("taskFilter") ?? "pending") as
    | "pending"
    | "today"
    | "overdue"
    | "all";
  const expensePeriod = (searchParams.get("expensePeriod") ??
    "this_month") as "today" | "this_week" | "this_month";

  // ── Demo mode: serve from in-memory store ──
  if (isDemoMode) {
    return serveDemoDashboard(taskFilter, expensePeriod);
  }

  // ── Production mode: serve from PostgreSQL ──
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({
      tasks: [],
      expenses: [],
      stats: {
        pendingTasks: 0,
        doneTasks: 0,
        overdueTasks: 0,
        totalSpentPaise: 0,
        expenseCount: 0,
        categoryBreakdown: [],
      },
    });
  }

  try {
    // Dynamic imports — only loaded when DATABASE_URL is set
    const { db } = await import("@/db/index");
    const { tasks, expenses } = await import("@/db/schema");
    const { eq, and, desc, gte, lte, sql } = await import("drizzle-orm");

    const now = new Date();

    // --- Fetch tasks based on filter ---
    const taskResults = await fetchTasks(db, tasks, userId, taskFilter, now, { eq, and, desc, gte, lte });

    // --- Fetch task stats (always full counts, not filtered) ---
    const [pendingCount, doneCount, overdueCount] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.status, "pending")))
        .then((r: any[]) => r[0]?.count ?? 0),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.status, "done")))
        .then((r: any[]) => r[0]?.count ?? 0),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, userId),
            eq(tasks.status, "pending"),
            lte(tasks.dueAt, now)
          )
        )
        .then((r: any[]) => r[0]?.count ?? 0),
    ]);

    // --- Fetch expenses ---
    const startDate = getStartDate(expensePeriod, now);
    const dateStr = formatDateStr(startDate);
    const todayStr = formatDateStr(now);

    const [expenseResults, totalResult, categoryResult] = await Promise.all([
      db
        .select()
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, userId),
            gte(expenses.transactionDate, dateStr),
            lte(expenses.transactionDate, todayStr)
          )
        )
        .orderBy(desc(expenses.transactionDate))
        .limit(20),
      db
        .select({
          totalPaise: sql<number>`coalesce(sum(${expenses.amountPaise}), 0)::int`,
          count: sql<number>`count(*)::int`,
        })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, userId),
            gte(expenses.transactionDate, dateStr),
            lte(expenses.transactionDate, todayStr)
          )
        ),
      db
        .select({
          category: expenses.category,
          totalPaise: sql<number>`coalesce(sum(${expenses.amountPaise}), 0)::int`,
          count: sql<number>`count(*)::int`,
        })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, userId),
            gte(expenses.transactionDate, dateStr),
            lte(expenses.transactionDate, todayStr)
          )
        )
        .groupBy(expenses.category)
        .orderBy(sql`sum(${expenses.amountPaise}) desc`),
    ]);

    return NextResponse.json({
      tasks: taskResults,
      expenses: expenseResults,
      stats: {
        pendingTasks: pendingCount,
        doneTasks: doneCount,
        overdueTasks: overdueCount,
        totalSpentPaise: totalResult[0]?.totalPaise ?? 0,
        expenseCount: totalResult[0]?.count ?? 0,
        categoryBreakdown: categoryResult,
      },
    });
  } catch (err) {
    console.error("[dashboard] Error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}

// ── Demo dashboard from in-memory store ──

function serveDemoDashboard(
  taskFilter: string,
  expensePeriod: string
) {
  const store = getDemoStore();

  const taskResults = store.getTasksByFilter(taskFilter);
  const allTasks = store.getTasksByFilter("all");
  const pendingTasks = store.getTasksByFilter("pending");
  const overdueTasks = store.getTasksByFilter("overdue");
  const doneCount = allTasks.filter((t) => t.status === "done").length;

  const { totalPaise: totalSpentPaise, count: expenseCount } =
    store.getTotalExpenses(expensePeriod);
  const categoryBreakdown = store.getExpensesByCategory(expensePeriod);
  const expenseResults = store.getExpensesByPeriod(expensePeriod).slice(0, 20);

  return NextResponse.json({
    tasks: taskResults,
    expenses: expenseResults,
    stats: {
      pendingTasks: pendingTasks.length,
      doneTasks: doneCount,
      overdueTasks: overdueTasks.length,
      totalSpentPaise,
      expenseCount,
      categoryBreakdown,
    },
  });
}

// --- Helpers ---

async function fetchTasks(
  db: any,
  tasks: any,
  userId: string,
  filter: string,
  now: Date,
  ops: any
) {
  const { eq, and, gte, lte } = ops;
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  switch (filter) {
    case "today":
      return db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, userId),
            gte(tasks.dueAt, startOfDay),
            lte(tasks.dueAt, endOfDay)
          )
        )
        .orderBy(tasks.dueAt);

    case "pending":
      return db
        .select()
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.status, "pending")))
        .orderBy(tasks.dueAt)
        .limit(30);

    case "overdue":
      return db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, userId),
            eq(tasks.status, "pending"),
            lte(tasks.dueAt, now)
          )
        )
        .orderBy(tasks.dueAt);

    default: {
      const { desc } = await import("drizzle-orm");
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, userId))
        .orderBy(desc(tasks.createdAt))
        .limit(50);
    }
  }
}

function getStartDate(
  filter: "today" | "this_week" | "this_month",
  now: Date
): Date {
  const start = new Date(now);
  switch (filter) {
    case "today":
      return start;
    case "this_week":
      start.setDate(start.getDate() - start.getDay());
      return start;
    case "this_month":
      start.setDate(1);
      return start;
  }
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
