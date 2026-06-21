import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { db } from "../index";
import { tasks, type Task, type NewTask } from "../schema";

export async function createTask(data: NewTask): Promise<Task> {
  const result = await db.insert(tasks).values(data).returning();
  return result[0];
}

export async function getTasksByUser(
  userId: string,
  filter: "today" | "pending" | "overdue" | "all" = "all"
): Promise<Task[]> {
  const now = new Date();
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
        .orderBy(tasks.dueAt);

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

export async function findTaskByQuery(userId: string, query: string): Promise<Task | undefined> {
  // Search by title match (case-insensitive)
  const allPending = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.status, "pending")))
    .orderBy(desc(tasks.createdAt));

  const lower = query.toLowerCase();
  return allPending.find((t) => t.title.toLowerCase().includes(lower));
}

export async function markTaskDone(taskId: string): Promise<Task> {
  const result = await db
    .update(tasks)
    .set({ status: "done", completedAt: new Date(), updatedAt: new Date() })
    .where(eq(tasks.id, taskId))
    .returning();
  return result[0];
}

export async function markTaskSkipped(taskId: string): Promise<Task> {
  const result = await db
    .update(tasks)
    .set({ status: "skipped", updatedAt: new Date() })
    .where(eq(tasks.id, taskId))
    .returning();
  return result[0];
}

export async function updateTask(id: string, data: Partial<NewTask>): Promise<Task> {
  const result = await db
    .update(tasks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tasks.id, id))
    .returning();
  return result[0];
}

export async function deleteTask(id: string): Promise<void> {
  await db.delete(tasks).where(eq(tasks.id, id));
}

export async function countPendingTasks(userId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.status, "pending")));
  return result[0]?.count ?? 0;
}
