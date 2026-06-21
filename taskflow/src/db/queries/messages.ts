import { eq } from "drizzle-orm";
import { db } from "../index";
import { messages, type NewMessage } from "../schema";

export async function logMessage(data: NewMessage): Promise<void> {
  await db.insert(messages).values(data);
}

export async function isDuplicate(waMessageId: string): Promise<boolean> {
  const result = await db
    .select({ id: messages.id })
    .from(messages)
    .where(eq(messages.waMessageId, waMessageId))
    .limit(1);
  return result.length > 0;
}
