import { NextRequest, NextResponse } from "next/server";
import { parseWithRules } from "@/lib/parser/rules";
import {
  buildResponse,
  buildHelpMessage,
  buildUnknownMessage,
  type ActionResult,
} from "@/lib/response/builder";
import { getDemoStore, DEMO_USER_ID_CONST } from "@/lib/demo/store";
import type { ParsedIntent } from "@/lib/parser/types";

/**
 * POST /api/chat — Web demo chat endpoint.
 * Processes messages through the regex-only parser against the in-memory demo store.
 * No database, no WhatsApp, no LLM — zero cost.
 */
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const text = message.trim();
    const store = getDemoStore();

    // Parse intent with regex-only (no LLM)
    const intent = parseWithRules(text);

    // Log inbound
    store.logMessage({
      direction: "inbound",
      body: text,
      intent: intent.intent,
    });

    // Execute intent against demo store
    let reply: string;
    try {
      const result = executeDemoIntent(intent, text);
      reply = buildResponse(result);
    } catch (err) {
      console.error("[chat] Execute error:", err);
      reply = "Something went wrong. Please try again.";
    }

    // Log outbound
    store.logMessage({
      direction: "outbound",
      body: reply,
      intent: intent.intent,
    });

    return NextResponse.json({
      reply,
      intent: intent.intent,
      confidence: intent.confidence,
    });
  } catch (err) {
    console.error("[chat] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Execute a parsed intent against the in-memory demo store.
 * Mirrors the WhatsApp webhook's executeIntent() but uses demo store instead of DB.
 */
function executeDemoIntent(intent: ParsedIntent, rawMessage: string): ActionResult {
  const store = getDemoStore();

  switch (intent.intent) {
    case "task_create": {
      const task = store.createTask({
        title: intent.title,
        rawMessage,
        dueAt: intent.dueAt,
        remindAt: intent.remindAt,
        category: intent.category,
        source: "web",
      });
      const pendingCount = store.countPending();
      // Cast to match ActionResult's Task type expectations
      return {
        action: "task_created",
        task: task as any,
        pendingCount,
      };
    }

    case "expense_log": {
      const dateStr = intent.date
        ? formatDateForStore(intent.date)
        : formatDateForStore(new Date());
      const expense = store.createExpense({
        amountPaise: intent.amountPaise,
        category: intent.category,
        merchant: intent.merchant,
        description: rawMessage,
        transactionDate: dateStr,
        source: "web",
      });
      const { totalPaise } = store.getTotalExpenses("today");
      return {
        action: "expense_logged",
        expense: expense as any,
        todayTotalPaise: totalPaise,
      };
    }

    case "task_done": {
      const task = store.findTaskByQuery(intent.taskQuery);
      if (!task) {
        const pendingTasks = store.getTasksByFilter("pending");
        return {
          action: "task_not_found",
          query: intent.taskQuery,
          pendingTasks: pendingTasks as any[],
        };
      }
      const doneTask = store.markTaskDone(task.id);
      const remainingCount = store.countPending();
      return {
        action: "task_done",
        task: doneTask as any,
        remainingCount,
      };
    }

    case "task_skip": {
      const task = store.findTaskByQuery(intent.taskQuery);
      if (!task) {
        const pendingTasks = store.getTasksByFilter("pending");
        return {
          action: "task_not_found",
          query: intent.taskQuery,
          pendingTasks: pendingTasks as any[],
        };
      }
      const skippedTask = store.markTaskSkipped(task.id);
      return { action: "task_skipped", task: skippedTask as any };
    }

    case "query_tasks": {
      const tasks = store.getTasksByFilter(intent.filter);
      return { action: "task_list", tasks: tasks as any[], filter: intent.filter };
    }

    case "query_expenses": {
      const filter = intent.filter ?? "today";
      const { totalPaise, count } = store.getTotalExpenses(filter, intent.category);
      const byCategory = store.getExpensesByCategory(filter);
      return { action: "expense_list", totalPaise, count, byCategory, filter };
    }

    case "query_summary": {
      const period = intent.period ?? "this_week";
      const pending = store.getTasksByFilter("pending");
      const overdue = store.getTasksByFilter("overdue");
      const allTasks = store.getTasksByFilter("all");
      const doneCount = allTasks.filter((t) => t.status === "done").length;
      const { totalPaise } = store.getTotalExpenses(period);
      const topCategories = store.getExpensesByCategory(period);
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
      return {
        action: "profile_updated",
        field: intent.field,
        value: intent.value,
      };
    }

    case "help":
      return { action: "error", message: buildHelpMessage() };

    case "unknown":
      return { action: "error", message: buildUnknownMessage() };

    default:
      return { action: "error", message: buildUnknownMessage() };
  }
}

function formatDateForStore(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}
