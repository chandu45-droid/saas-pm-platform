import { NextRequest, NextResponse } from "next/server";
import {
  createExpense,
  getExpensesByUser,
  getExpensesByCategory,
  getTotalExpenses,
} from "@/db/queries/expenses";

/**
 * GET /api/expenses?userId=...&period=today|this_week|this_month&category=...
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const period = (req.nextUrl.searchParams.get("period") ?? "this_month") as
    | "today"
    | "this_week"
    | "this_month";
  const category = req.nextUrl.searchParams.get("category");

  try {
    const [expenseList, totals, breakdown] = await Promise.all([
      getExpensesByUser(userId, period, category),
      getTotalExpenses(userId, period, category),
      getExpensesByCategory(userId, period),
    ]);

    return NextResponse.json({
      expenses: expenseList,
      totals,
      categoryBreakdown: breakdown,
    });
  } catch (err) {
    console.error("[expenses GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Body: { userId, amountPaise, category, merchant?, description?, transactionDate? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, amountPaise, category, merchant, description, transactionDate } =
      body;

    if (!userId || !amountPaise || !category) {
      return NextResponse.json(
        { error: "userId, amountPaise, and category required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const dateStr = transactionDate ?? formatDateStr(now);

    const expense = await createExpense({
      userId,
      amountPaise: Number(amountPaise),
      category,
      merchant: merchant ?? null,
      description: description ?? null,
      transactionDate: dateStr,
      source: "web",
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (err) {
    console.error("[expenses POST]", err);
    return NextResponse.json(
      { error: "Failed to log expense" },
      { status: 500 }
    );
  }
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
