import { NextRequest, NextResponse } from "next/server";
import { createTask, getTasksByUser, markTaskDone, markTaskSkipped } from "@/db/queries/tasks";

/**
 * GET /api/tasks?userId=...&filter=pending|today|overdue|all
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const filter = (req.nextUrl.searchParams.get("filter") ?? "all") as
    | "today"
    | "pending"
    | "overdue"
    | "all";

  try {
    const tasks = await getTasksByUser(userId, filter);
    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("[tasks GET]", err);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

/**
 * POST /api/tasks
 * Body: { userId, title, category?, dueAt? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, category, dueAt } = body;

    if (!userId || !title) {
      return NextResponse.json(
        { error: "userId and title required" },
        { status: 400 }
      );
    }

    const task = await createTask({
      userId,
      title,
      category: category ?? null,
      dueAt: dueAt ? new Date(dueAt) : null,
      source: "web",
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (err) {
    console.error("[tasks POST]", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

/**
 * PATCH /api/tasks
 * Body: { taskId, action: "done" | "skip" }
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, action } = body;

    if (!taskId || !action) {
      return NextResponse.json(
        { error: "taskId and action required" },
        { status: 400 }
      );
    }

    let task;
    if (action === "done") {
      task = await markTaskDone(taskId);
    } else if (action === "skip") {
      task = await markTaskSkipped(taskId);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ task });
  } catch (err) {
    console.error("[tasks PATCH]", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
