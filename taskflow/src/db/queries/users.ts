import { eq } from "drizzle-orm";
import { db } from "../index";
import { users, type User, type NewUser } from "../schema";

export async function findUserByPhone(phone: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  return result[0];
}

export async function findUserById(id: string): Promise<User | undefined> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function findOrCreateUser(phone: string): Promise<User> {
  const existing = await findUserByPhone(phone);
  if (existing) return existing;

  const result = await db.insert(users).values({ phone }).returning();
  return result[0];
}

export async function updateUser(id: string, data: Partial<NewUser>): Promise<User> {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}
