import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { tasks, expenses } from "@/db/schema";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

/**
 * GET /api/dashboard?userId=...&taskFilter=pending&expensePeriod=this_month
 *
 * Returns aggregated dashboard data: tasks + expenses + stats.
 * For now, userId is passed as a query param.
 * TODO: Replace with JWT session auth from web_sessions table.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");
  const taskFilter = (searchParams.get("taskFilter") ?? "pending") as
    | "pending"
    | "today"
    | "overdue"
    | "all";
  const expensePeriod = (searchParams.get("expensePeriod") ??
    "this_month") as "today" | "this_week" | "this_month";

  // If no userId provided, return empty state (for demo/unauthenticated view)
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
    const now = new Date();

    // --- Fetch tasks based on filter ---
    const taskResults = await fetchTasks(userId, taskFilter, now);

    // --- Fetch task stats (always full counts, not filtered) ---
    const [pendingCount, doneCount, overdueCount] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.status, "pending")))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(tasks)
        .where(and(eq(tasks.userId, userId), eq(tasks.status, "done")))
        .then((r) => r[0]?.count ?? 0),
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
        .then((r) => r[0]?.count ?? 0),
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

// --- Helpers ---

async function fetchTasks(
  userId: string,
  filter: string,
  now: Date
) {
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

    default:
      return db
        .select()
        .from(tasks)
        .where(eq(tasks.userId, userId))
        .orderBy(desc(tasks.createdAt))
        .limit(50);
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
