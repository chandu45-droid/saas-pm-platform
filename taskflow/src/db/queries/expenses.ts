import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { db } from "../index";
import { expenses, type Expense, type NewExpense } from "../schema";

export async function createExpense(data: NewExpense): Promise<Expense> {
  const result = await db.insert(expenses).values(data).returning();
  return result[0];
}

export async function getExpensesByUser(
  userId: string,
  filter: "today" | "this_week" | "this_month" = "this_month",
  category?: string | null
): Promise<Expense[]> {
  const now = new Date();
  const startDate = getStartDate(filter, now);
  const dateStr = formatDateStr(startDate);
  const todayStr = formatDateStr(now);

  const conditions = [
    eq(expenses.userId, userId),
    gte(expenses.transactionDate, dateStr),
    lte(expenses.transactionDate, todayStr),
  ];

  if (category) {
    conditions.push(eq(expenses.category, category));
  }

  return db
    .select()
    .from(expenses)
    .where(and(...conditions))
    .orderBy(desc(expenses.transactionDate));
}

export async function getTotalExpenses(
  userId: string,
  filter: "today" | "this_week" | "this_month" = "this_month",
  category?: string | null
): Promise<{ totalPaise: number; count: number }> {
  const now = new Date();
  const startDate = getStartDate(filter, now);
  const dateStr = formatDateStr(startDate);
  const todayStr = formatDateStr(now);

  const conditions = [
    eq(expenses.userId, userId),
    gte(expenses.transactionDate, dateStr),
    lte(expenses.transactionDate, todayStr),
  ];

  if (category) {
    conditions.push(eq(expenses.category, category));
  }

  const result = await db
    .select({
      totalPaise: sql<number>`coalesce(sum(${expenses.amountPaise}), 0)::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(expenses)
    .where(and(...conditions));

  return {
    totalPaise: result[0]?.totalPaise ?? 0,
    count: result[0]?.count ?? 0,
  };
}

export async function getExpensesByCategory(
  userId: string,
  filter: "today" | "this_week" | "this_month" = "this_month"
): Promise<{ category: string; totalPaise: number; count: number }[]> {
  const now = new Date();
  const startDate = getStartDate(filter, now);
  const dateStr = formatDateStr(startDate);
  const todayStr = formatDateStr(now);

  return db
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
    .orderBy(sql`sum(${expenses.amountPaise}) desc`);
}

export async function updateExpense(id: string, data: Partial<NewExpense>): Promise<Expense> {
  const result = await db.update(expenses).set(data).where(eq(expenses.id, id)).returning();
  return result[0];
}

export async function deleteExpense(id: string): Promise<void> {
  await db.delete(expenses).where(eq(expenses.id, id));
}

function getStartDate(filter: "today" | "this_week" | "this_month", now: Date): Date {
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
  return y + "-" + m + "-" + day;
}
