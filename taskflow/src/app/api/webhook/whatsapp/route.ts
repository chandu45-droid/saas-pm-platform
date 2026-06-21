import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, verifyChallenge } from "@/lib/whatsapp/verify";
import { sendTextMessage, markAsRead, extractMessage } from "@/lib/whatsapp";
import { parse } from "@/lib/parser";
import {
  buildResponse,
  buildHelpMessage,
  buildUnknownMessage,
  type ActionResult,
} from "@/lib/response/builder";
import { findOrCreateUser, updateUser } from "@/db/queries/users";
import {
  createTask,
  getTasksByUser,
  findTaskByQuery,
  markTaskDone,
  markTaskSkipped,
  countPendingTasks,
} from "@/db/queries/tasks";
import {
  createExpense,
  getExpensesByUser,
  getTotalExpenses,
  getExpensesByCategory,
} from "@/db/queries/expenses";
import { logMessage, isDuplicate } from "@/db/queries/messages";

/**
 * GET — Meta webhook verification challenge.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challengeResult = verifyChallenge({
    "hub.mode": searchParams.get("hub.mode") ?? undefined,
    "hub.verify_token": searchParams.get("hub.verify_token") ?? undefined,
    "hub.challenge": searchParams.get("hub.challenge") ?? undefined,
  });

  if (challengeResult) {
    return new NextResponse(challengeResult, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * POST — Incoming WhatsApp messages.
 * Returns 200 immediately, processes message asynchronously.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Verify webhook signature
    const signature = request.headers.get("x-hub-signature-256") ?? "";
    if (!verifyWebhookSignature(body, signature)) {
      console.error("[webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Process in background — don't block the response
    processMessage(payload).catch((err) => {
      console.error("[webhook] Processing error:", err);
    });

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }
}

async function processMessage(payload: Record<string, unknown>): Promise<void> {
  const extracted = extractMessage(payload);
  if (!extracted) return;

  const { from, waMessageId, body } = extracted;
  // Extract sender name from contacts array (not in IncomingMessage type)
  const name = extractContactName(payload);
  const text = body ?? "";

  // Dedup check
  if (await isDuplicate(waMessageId)) return;

  // Mark as read
  await markAsRead(waMessageId).catch(() => {});

  // Find or create user
  const user = await findOrCreateUser(from);

  // Update user name if available and not set
  if (name && !user.name) {
    await updateUser(user.id, { name }).catch(() => {});
  }

  // Log inbound message
  await logMessage({
    userId: user.id,
    waMessageId: waMessageId,
    direction: "inbound",
    body: text,
  });

  // Parse intent
  const intent = await parse(text, { llmEnabled: !!process.env.ANTHROPIC_API_KEY });

  // Log parsed intent
  await logMessage({
    userId: user.id,
    waMessageId: null,
    direction: "parsed",
    body: text,
    intent: intent.intent,
    parsedData: intent as unknown as Record<string, unknown>,
  }).catch(() => {});

  // Execute action and build response
  let reply: string;
  try {
    const result = await executeIntent(intent, user.id, text);
    reply = buildResponse(result);
  } catch (err) {
    console.error("[webhook] Execute error:", err);
    reply = "Something went wrong. Please try again.";
  }

  // Send reply
  await sendTextMessage(from, reply);

  // Log outbound
  await logMessage({
    userId: user.id,
    waMessageId: null,
    direction: "outbound",
    body: reply,
    intent: intent.intent,
  }).catch(() => {});
}

async function executeIntent(
  intent: import("@/lib/parser/types").ParsedIntent,
  userId: string,
  rawMessage: string
): Promise<ActionResult> {
  switch (intent.intent) {
    case "task_create": {
      const task = await createTask({
        userId,
        title: intent.title,
        rawMessage,
        dueAt: intent.dueAt,
        remindAt: intent.remindAt,
        category: intent.category,
        source: "whatsapp",
      });
      const pendingCount = await countPendingTasks(userId);
      return { action: "task_created", task, pendingCount };
    }

    case "expense_log": {
      const dateStr = intent.date
        ? formatDateForDB(intent.date)
        : formatDateForDB(new Date());
      const expense = await createExpense({
        userId,
        amountPaise: intent.amountPaise,
        category: intent.category,
        merchant: intent.merchant,
        description: rawMessage,
        transactionDate: dateStr,
        source: "whatsapp",
      });
      const { totalPaise } = await getTotalExpenses(userId, "today");
      return { action: "expense_logged", expense, todayTotalPaise: totalPaise };
    }

    case "task_done": {
      const task = await findTaskByQuery(userId, intent.taskQuery);
      if (!task) {
        const pendingTasks = await getTasksByUser(userId, "pending");
        return { action: "task_not_found", query: intent.taskQuery, pendingTasks };
      }
      const doneTask = await markTaskDone(task.id);
      const remainingCount = await countPendingTasks(userId);
      return { action: "task_done", task: doneTask, remainingCount };
    }

    case "task_skip": {
      const task = await findTaskByQuery(userId, intent.taskQuery);
      if (!task) {
        const pendingTasks = await getTasksByUser(userId, "pending");
        return { action: "task_not_found", query: intent.taskQuery, pendingTasks };
      }
      const skippedTask = await markTaskSkipped(task.id);
      return { action: "task_skipped", task: skippedTask };
    }

    case "query_tasks": {
      const tasks = await getTasksByUser(userId, intent.filter as "today" | "pending" | "overdue" | "all");
      return { action: "task_list", tasks, filter: intent.filter };
    }

    case "query_expenses": {
      const filter = (intent.filter ?? "today") as "today" | "this_week" | "this_month";
      const { totalPaise, count } = await getTotalExpenses(userId, filter, intent.category);
      const byCategory = await getExpensesByCategory(userId, filter);
      return { action: "expense_list", totalPaise, count, byCategory, filter };
    }

    case "query_summary": {
      const period = (intent.period ?? "this_week") as "today" | "this_week" | "this_month";
      const pending = await getTasksByUser(userId, "pending");
      const overdue = await getTasksByUser(userId, "overdue");
      const doneTasks = await getTasksByUser(userId, "all");
      const doneCount = doneTasks.filter((t) => t.status === "done").length;
      const { totalPaise } = await getTotalExpenses(userId, period);
      const topCategories = await getExpensesByCategory(userId, period);
      return {
        action: "summary",
        tasksPending: pending.length,
        tasksDone: doneCount,
        tasksOverdue: overdue.length,
        expenseTotalPaise: totalPaise,
        topCategories,
        period,
      };
    }

    case "set_profile": {
      if (intent.field === "name") {
        await updateUser(userId, { name: intent.value });
      } else if (intent.field === "income") {
        await updateUser(userId, { monthlyIncomePaise: parseInt(intent.value, 10) });
      } else if (intent.field === "brief_time") {
        await updateUser(userId, { morningBriefTime: intent.value });
      }
      return { action: "profile_updated", field: intent.field, value: intent.value };
    }

    case "help":
      return { action: "error", message: buildHelpMessage() };

    case "unknown":
      return { action: "error", message: buildUnknownMessage() };

    default:
      return { action: "error", message: buildUnknownMessage() };
  }
}

function extractContactName(payload: Record<string, unknown>): string | null {
  try {
    const entry = (payload.entry as unknown[])?.[0] as Record<string, unknown>;
    const changes = (entry?.changes as unknown[])?.[0] as Record<string, unknown>;
    const value = changes?.value as Record<string, unknown>;
    const contacts = value?.contacts as Record<string, unknown>[];
    if (!contacts || contacts.length === 0) return null;
    const profile = contacts[0].profile as Record<string, unknown>;
    return (profile?.name as string) ?? null;
  } catch {
    return null;
  }
}

function formatDateForDB(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}
