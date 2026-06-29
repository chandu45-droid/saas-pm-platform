/**
 * In-memory demo store — replaces PostgreSQL for zero-cost demo mode.
 * All data lives in memory, resets on server restart.
 * Pre-seeded with realistic Indian user data for dashboard demo.
 */

export interface DemoUser {
  id: string;
  phone: string;
  name: string | null;
  timezone: string;
  morningBriefTime: string;
  tier: string;
  monthlyIncomePaise: number | null;
  cityTier: string | null;
  onboardedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoTask {
  id: string;
  userId: string;
  title: string;
  rawMessage: string | null;
  status: string;
  category: string | null;
  dueAt: Date | null;
  remindAt: Date | null;
  completedAt: Date | null;
  reminderSent: boolean;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoExpense {
  id: string;
  userId: string;
  amountPaise: number;
  category: string;
  merchant: string | null;
  description: string | null;
  source: string;
  transactionDate: string;
  createdAt: Date;
}

export interface DemoMessage {
  id: string;
  userId: string | null;
  waMessageId: string | null;
  direction: string;
  body: string;
  intent: string | null;
  parsedData: Record<string, unknown> | null;
  createdAt: Date;
}

const DEMO_USER_ID = "demo-user-001";

function uuid(): string {
  return "demo-" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function hoursFromNow(h: number): Date {
  return new Date(Date.now() + h * 60 * 60 * 1000);
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Seed Data ──────────────────────────────────────────────────────────

function createSeedTasks(): DemoTask[] {
  const now = new Date();
  return [
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Call mom", rawMessage: "call mom",
      status: "done", category: null, dueAt: daysAgo(1), remindAt: null,
      completedAt: daysAgo(1), reminderSent: false, source: "whatsapp",
      createdAt: daysAgo(2), updatedAt: daysAgo(1),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Gym", rawMessage: "gym 6pm tomorrow",
      status: "done", category: null, dueAt: daysAgo(1), remindAt: null,
      completedAt: daysAgo(0), reminderSent: true, source: "whatsapp",
      createdAt: daysAgo(2), updatedAt: daysAgo(0),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Buy groceries from BigBasket", rawMessage: "buy groceries bigbasket",
      status: "pending", category: null, dueAt: hoursFromNow(3), remindAt: hoursFromNow(2.5),
      completedAt: null, reminderSent: false, source: "whatsapp",
      createdAt: daysAgo(0), updatedAt: daysAgo(0),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Submit project report", rawMessage: "submit project report by friday",
      status: "pending", category: null, dueAt: hoursFromNow(48), remindAt: hoursFromNow(47.5),
      completedAt: null, reminderSent: false, source: "whatsapp",
      createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Pay electricity bill", rawMessage: "pay electricity bill",
      status: "pending", category: null, dueAt: hoursFromNow(24), remindAt: hoursFromNow(23.5),
      completedAt: null, reminderSent: false, source: "whatsapp",
      createdAt: daysAgo(0), updatedAt: daysAgo(0),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Doctor appointment", rawMessage: "doctor appointment 10am",
      status: "done", category: null, dueAt: daysAgo(3), remindAt: null,
      completedAt: daysAgo(3), reminderSent: true, source: "whatsapp",
      createdAt: daysAgo(5), updatedAt: daysAgo(3),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Return Amazon package", rawMessage: "return amazon package",
      status: "pending", category: null, dueAt: null, remindAt: null,
      completedAt: null, reminderSent: false, source: "whatsapp",
      createdAt: daysAgo(0), updatedAt: daysAgo(0),
    },
    {
      id: uuid(), userId: DEMO_USER_ID, title: "Meeting with Rahul", rawMessage: "meeting with rahul 3pm",
      status: "done", category: null, dueAt: daysAgo(2),
      remindAt: null, completedAt: daysAgo(2), reminderSent: true, source: "whatsapp",
      createdAt: daysAgo(3), updatedAt: daysAgo(2),
    },
  ];
}

function createSeedExpenses(): DemoExpense[] {
  const today = formatDateStr(new Date());
  return [
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 15000, category: "food", merchant: "swiggy", description: "spent 150 swiggy", source: "whatsapp", transactionDate: today, createdAt: daysAgo(0) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 5000, category: "food", merchant: null, description: "chai 50", source: "whatsapp", transactionDate: today, createdAt: daysAgo(0) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 25000, category: "transport", merchant: "uber", description: "uber 250", source: "whatsapp", transactionDate: today, createdAt: daysAgo(0) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 30000, category: "food", merchant: "zomato", description: "lunch zomato 300", source: "whatsapp", transactionDate: formatDateStr(daysAgo(1)), createdAt: daysAgo(1) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 12000, category: "transport", merchant: "ola", description: "ola 120", source: "whatsapp", transactionDate: formatDateStr(daysAgo(1)), createdAt: daysAgo(1) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 49900, category: "subscriptions", merchant: "netflix", description: "netflix 499", source: "whatsapp", transactionDate: formatDateStr(daysAgo(2)), createdAt: daysAgo(2) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 80000, category: "food", merchant: null, description: "groceries 800", source: "whatsapp", transactionDate: formatDateStr(daysAgo(3)), createdAt: daysAgo(3) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 15000, category: "entertainment", merchant: null, description: "movie 150", source: "whatsapp", transactionDate: formatDateStr(daysAgo(4)), createdAt: daysAgo(4) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 200000, category: "transport", merchant: null, description: "petrol 2000", source: "whatsapp", transactionDate: formatDateStr(daysAgo(5)), createdAt: daysAgo(5) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 35000, category: "food", merchant: "dominos", description: "dominos 350", source: "whatsapp", transactionDate: formatDateStr(daysAgo(6)), createdAt: daysAgo(6) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 10000, category: "food", merchant: null, description: "chai samosa 100", source: "whatsapp", transactionDate: formatDateStr(daysAgo(7)), createdAt: daysAgo(7) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 45000, category: "utilities", merchant: null, description: "electricity bill 450", source: "whatsapp", transactionDate: formatDateStr(daysAgo(8)), createdAt: daysAgo(8) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 150000, category: "shopping", merchant: "amazon", description: "amazon headphones 1500", source: "whatsapp", transactionDate: formatDateStr(daysAgo(10)), createdAt: daysAgo(10) },
    { id: uuid(), userId: DEMO_USER_ID, amountPaise: 60000, category: "health", merchant: null, description: "gym membership 600", source: "whatsapp", transactionDate: formatDateStr(daysAgo(12)), createdAt: daysAgo(12) },
  ];
}

// ── Store Singleton ────────────────────────────────────────────────────

class DemoStore {
  users: DemoUser[] = [];
  tasks: DemoTask[] = [];
  expenses: DemoExpense[] = [];
  messages: DemoMessage[] = [];

  constructor() {
    this.users = [{
      id: DEMO_USER_ID,
      phone: "+919876543210",
      name: "Demo User",
      timezone: "Asia/Kolkata",
      morningBriefTime: "07:00",
      tier: "free",
      monthlyIncomePaise: 5000000, // 50k
      cityTier: "tier1",
      onboardedAt: daysAgo(30),
      createdAt: daysAgo(30),
      updatedAt: new Date(),
    }];
    this.tasks = createSeedTasks();
    this.expenses = createSeedExpenses();
    this.messages = [];
  }

  // ── User operations ──
  getUser(): DemoUser {
    return this.users[0];
  }

  // ── Task operations ──
  createTask(data: Partial<DemoTask>): DemoTask {
    const task: DemoTask = {
      id: uuid(),
      userId: DEMO_USER_ID,
      title: data.title ?? "",
      rawMessage: data.rawMessage ?? null,
      status: "pending",
      category: data.category ?? null,
      dueAt: data.dueAt ?? null,
      remindAt: data.remindAt ?? null,
      completedAt: null,
      reminderSent: false,
      source: data.source ?? "web",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  getTasksByFilter(filter: string): DemoTask[] {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    switch (filter) {
      case "today":
        return this.tasks.filter(t =>
          t.userId === DEMO_USER_ID && t.dueAt &&
          t.dueAt >= startOfDay && t.dueAt <= endOfDay
        ).sort((a, b) => (a.dueAt?.getTime() ?? 0) - (b.dueAt?.getTime() ?? 0));
      case "pending":
        return this.tasks.filter(t =>
          t.userId === DEMO_USER_ID && t.status === "pending"
        ).sort((a, b) => (a.dueAt?.getTime() ?? Infinity) - (b.dueAt?.getTime() ?? Infinity));
      case "overdue":
        return this.tasks.filter(t =>
          t.userId === DEMO_USER_ID && t.status === "pending" && t.dueAt && t.dueAt < now
        ).sort((a, b) => (a.dueAt?.getTime() ?? 0) - (b.dueAt?.getTime() ?? 0));
      default:
        return this.tasks
          .filter(t => t.userId === DEMO_USER_ID)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, 50);
    }
  }

  countPending(): number {
    return this.tasks.filter(t => t.userId === DEMO_USER_ID && t.status === "pending").length;
  }

  findTaskByQuery(query: string): DemoTask | undefined {
    const lower = query.toLowerCase();
    return this.tasks.find(t =>
      t.userId === DEMO_USER_ID &&
      t.status === "pending" &&
      t.title.toLowerCase().includes(lower)
    );
  }

  markTaskDone(taskId: string): DemoTask {
    const task = this.tasks.find(t => t.id === taskId)!;
    task.status = "done";
    task.completedAt = new Date();
    task.updatedAt = new Date();
    return task;
  }

  markTaskSkipped(taskId: string): DemoTask {
    const task = this.tasks.find(t => t.id === taskId)!;
    task.status = "skipped";
    task.updatedAt = new Date();
    return task;
  }

  // ── Expense operations ──
  createExpense(data: Partial<DemoExpense>): DemoExpense {
    const expense: DemoExpense = {
      id: uuid(),
      userId: DEMO_USER_ID,
      amountPaise: data.amountPaise ?? 0,
      category: data.category ?? "misc",
      merchant: data.merchant ?? null,
      description: data.description ?? null,
      source: data.source ?? "web",
      transactionDate: data.transactionDate ?? formatDateStr(new Date()),
      createdAt: new Date(),
    };
    this.expenses.push(expense);
    return expense;
  }

  getExpensesByPeriod(period: string): DemoExpense[] {
    const now = new Date();
    const start = this.getStartDate(period, now);
    const startStr = formatDateStr(start);
    const todayStr = formatDateStr(now);

    return this.expenses
      .filter(e =>
        e.userId === DEMO_USER_ID &&
        e.transactionDate >= startStr &&
        e.transactionDate <= todayStr
      )
      .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
  }

  getTotalExpenses(period: string, category?: string | null): { totalPaise: number; count: number } {
    let filtered = this.getExpensesByPeriod(period);
    if (category) {
      filtered = filtered.filter(e => e.category === category);
    }
    return {
      totalPaise: filtered.reduce((sum, e) => sum + e.amountPaise, 0),
      count: filtered.length,
    };
  }

  getExpensesByCategory(period: string): { category: string; totalPaise: number; count: number }[] {
    const filtered = this.getExpensesByPeriod(period);
    const map: Record<string, { totalPaise: number; count: number }> = {};
    for (const e of filtered) {
      if (!map[e.category]) map[e.category] = { totalPaise: 0, count: 0 };
      map[e.category].totalPaise += e.amountPaise;
      map[e.category].count += 1;
    }
    return Object.entries(map)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.totalPaise - a.totalPaise);
  }

  // ── Message operations ──
  logMessage(data: Partial<DemoMessage>): DemoMessage {
    const msg: DemoMessage = {
      id: uuid(),
      userId: data.userId ?? DEMO_USER_ID,
      waMessageId: data.waMessageId ?? null,
      direction: data.direction ?? "inbound",
      body: data.body ?? "",
      intent: data.intent ?? null,
      parsedData: data.parsedData ?? null,
      createdAt: new Date(),
    };
    this.messages.push(msg);
    return msg;
  }

  // ── Helpers ──
  private getStartDate(filter: string, now: Date): Date {
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
      default:
        start.setDate(1);
        return start;
    }
  }
}

// Singleton — shared across all API routes
let _store: DemoStore | null = null;

export function getDemoStore(): DemoStore {
  if (!_store) {
    _store = new DemoStore();
  }
  return _store;
}

export const DEMO_USER_ID_CONST = DEMO_USER_ID;
