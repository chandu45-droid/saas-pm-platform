/**
 * Response builder — converts parsed intent results into WhatsApp reply messages.
 * Rules: under 300 chars, WhatsApp markdown, confirm what was parsed, include running totals.
 * Now with personality: emojis, category icons, contextual tips, spending insights.
 */
import type { ParsedIntent } from "../parser/types";
import { bold, formatRupees, formatDate, formatTime, truncate } from "./format";
import type { Task, Expense } from "../../db/schema";

// -- Category emoji mapping --
const CATEGORY_EMOJI: Record<string, string> = {
  food: "\u{1F354}",
  transport: "\u{1F695}",
  rent: "\u{1F3E0}",
  emi: "\u{1F3E6}",
  utilities: "⚡",
  entertainment: "\u{1F3AC}",
  shopping: "\u{1F6CD}️",
  health: "\u{1F3E5}",
  education: "\u{1F4DA}",
  groceries: "\u{1F6D2}",
  subscriptions: "\u{1F4F1}",
  misc: "\u{1F4E6}",
};

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category?.toLowerCase()] ?? "\u{1F4E6}";
}

// -- Contextual tips (shown randomly after actions) --
const EXPENSE_TIPS = [
  "Tip: Type *summary* to see your weekly overview",
  "Tip: Ask *how much did I spend this week?*",
  "Tip: You can log multiple expenses like *200 uber 150 chai*",
  "Tip: Try *what did I spend on food?* for category breakdown",
];

const TASK_TIPS = [
  "Tip: Say *done [task]* when you finish it",
  "Tip: Type *pending* to see what's left",
  "Tip: Add time like *meeting 3pm tomorrow*",
  "Tip: Type *summary* for your full overview",
];

function randomTip(tips: string[]): string {
  return tips[Math.floor(Math.random() * tips.length)];
}

// -- Action result types passed from the webhook handler --

interface TaskCreatedResult {
  action: "task_created";
  task: Task;
  pendingCount: number;
}

interface ExpenseLoggedResult {
  action: "expense_logged";
  expense: Expense;
  todayTotalPaise: number;
}

interface MultiExpenseLoggedResult {
  action: "multi_expense_logged";
  expenses: Expense[];
  todayTotalPaise: number;
}

interface TaskDoneResult {
  action: "task_done";
  task: Task;
  remainingCount: number;
}

interface TaskSkippedResult {
  action: "task_skipped";
  task: Task;
}

interface TaskNotFoundResult {
  action: "task_not_found";
  query: string;
  pendingTasks: Task[];
}

interface TaskListResult {
  action: "task_list";
  tasks: Task[];
  filter: string;
}

interface ExpenseListResult {
  action: "expense_list";
  totalPaise: number;
  count: number;
  byCategory?: { category: string; totalPaise: number }[];
  filter: string;
}

interface SummaryResult {
  action: "summary";
  tasksPending: number;
  tasksDone: number;
  tasksOverdue: number;
  expenseTotalPaise: number;
  topCategories: { category: string; totalPaise: number }[];
  period: string;
}

interface ProfileUpdatedResult {
  action: "profile_updated";
  field: string;
  value: string;
}

interface ErrorResult {
  action: "error";
  message: string;
}

export type ActionResult =
  | TaskCreatedResult
  | ExpenseLoggedResult
  | MultiExpenseLoggedResult
  | TaskDoneResult
  | TaskSkippedResult
  | TaskNotFoundResult
  | TaskListResult
  | ExpenseListResult
  | SummaryResult
  | ProfileUpdatedResult
  | ErrorResult;

export function buildResponse(result: ActionResult): string {
  switch (result.action) {
    case "task_created":
      return buildTaskCreated(result);
    case "expense_logged":
      return buildExpenseLogged(result);
    case "multi_expense_logged":
      return buildMultiExpenseLogged(result);
    case "task_done":
      return buildTaskDone(result);
    case "task_skipped":
      return buildTaskSkipped(result);
    case "task_not_found":
      return buildTaskNotFound(result);
    case "task_list":
      return buildTaskList(result);
    case "expense_list":
      return buildExpenseList(result);
    case "summary":
      return buildSummary(result);
    case "profile_updated":
      return buildProfileUpdated(result);
    case "error":
      return result.message;
  }
}

function buildTaskCreated(r: TaskCreatedResult): string {
  let msg = "✅ " + bold(truncate(r.task.title)) + " added!";
  if (r.task.dueAt) {
    msg += "\n⏰ Due: " + formatDate(r.task.dueAt) + " " + formatTime(r.task.dueAt);
    msg += "\nI'll remind you 30 min before.";
  }
  msg += "\n\u{1F4CB} " + r.pendingCount + " task" + (r.pendingCount === 1 ? "" : "s") + " pending";
  if (Math.random() > 0.5) {
    msg += "\n\n\u{1F4A1} " + randomTip(TASK_TIPS);
  }
  return msg;
}

function buildExpenseLogged(r: ExpenseLoggedResult): string {
  const emoji = getCategoryEmoji(r.expense.category || "misc");
  let msg = emoji + " " + formatRupees(r.expense.amountPaise) + " logged";
  msg += " → " + bold(r.expense.category || "misc");
  if (r.expense.merchant) {
    msg += " (" + r.expense.merchant + ")";
  }
  msg += "\n\u{1F4B0} Today's total: " + bold(formatRupees(r.todayTotalPaise));
  if (Math.random() > 0.6) {
    msg += "\n\n\u{1F4A1} " + randomTip(EXPENSE_TIPS);
  }
  return msg;
}

function buildMultiExpenseLogged(r: MultiExpenseLoggedResult): string {
  let msg = "\u{1F4B8} " + bold(r.expenses.length + " expenses logged!") + "\n";
  for (const exp of r.expenses) {
    const emoji = getCategoryEmoji(exp.category || "misc");
    msg += emoji + " " + formatRupees(exp.amountPaise) + " → " + (exp.category || "misc");
    if (exp.merchant) msg += " (" + exp.merchant + ")";
    msg += "\n";
  }
  msg += "\n\u{1F4B0} Today's total: " + bold(formatRupees(r.todayTotalPaise));
  return msg;
}

function buildTaskDone(r: TaskDoneResult): string {
  let msg = "\u{1F389} " + bold(truncate(r.task.title)) + " — done!";
  if (r.remainingCount > 0) {
    msg += "\n\u{1F4CB} " + r.remainingCount + " task" + (r.remainingCount === 1 ? "" : "s") + " left.";
  } else {
    msg += "\n✨ All done for today! Great job!";
  }
  return msg;
}

function buildTaskSkipped(r: TaskSkippedResult): string {
  return "⏭️ " + bold(truncate(r.task.title)) + " skipped for today.";
}

function buildTaskNotFound(r: TaskNotFoundResult): string {
  if (r.pendingTasks.length === 0) {
    return "✅ No pending tasks found. You're all caught up!";
  }
  let msg = "\u{1F914} Couldn't find \"" + r.query + "\". Did you mean:\n";
  r.pendingTasks.slice(0, 5).forEach((t, i) => {
    msg += (i + 1) + ". " + truncate(t.title, 40) + "\n";
  });
  msg += "\nTry: *done [task name]*";
  return msg.trim();
}

function buildTaskList(r: TaskListResult): string {
  if (r.tasks.length === 0) {
    if (r.filter === "overdue") return "✅ No overdue tasks. You're on track!";
    if (r.filter === "pending") return "✅ No pending tasks. All caught up!";
    return "\u{1F4CB} No tasks for " + r.filter + ".";
  }
  let msg = "\u{1F4CB} " + bold("Tasks (" + r.filter + "):") + "\n";
  r.tasks.slice(0, 10).forEach((t) => {
    const icon = t.status === "done" ? "✅" : t.status === "skipped" ? "⏭️" : "⬜";
    const due = t.dueAt ? " • " + formatTime(t.dueAt) : "";
    msg += icon + " " + truncate(t.title, 35) + due + "\n";
  });
  if (r.tasks.length > 10) {
    msg += "+" + (r.tasks.length - 10) + " more";
  }
  return msg.trim();
}

function buildExpenseList(r: ExpenseListResult): string {
  if (r.count === 0) {
    return "\u{1F4B0} No expenses logged " + r.filter.replace(/_/g, " ") + ".";
  }
  let msg = "\u{1F4B0} " + bold("Expenses (" + r.filter.replace(/_/g, " ") + "):") + "\n";
  msg += "Total: " + bold(formatRupees(r.totalPaise)) + " (" + r.count + " entries)\n";
  if (r.byCategory && r.byCategory.length > 0) {
    msg += "\n";
    r.byCategory.slice(0, 6).forEach((c) => {
      const emoji = getCategoryEmoji(c.category);
      msg += emoji + " " + c.category + ": " + formatRupees(c.totalPaise) + "\n";
    });
  }
  return msg.trim();
}

function buildSummary(r: SummaryResult): string {
  const period = r.period.replace(/_/g, " ");
  let msg = "\u{1F4CA} " + bold("Summary (" + period + ")") + "\n\n";

  msg += "\u{1F4CB} *Tasks*\n";
  msg += "✅ " + r.tasksDone + " done";
  msg += "  ⏳ " + r.tasksPending + " pending";
  if (r.tasksOverdue > 0) {
    msg += "  ⚠️ " + r.tasksOverdue + " overdue";
  }

  msg += "\n\n\u{1F4B0} *Expenses*\n";
  msg += "Total spent: " + bold(formatRupees(r.expenseTotalPaise));
  if (r.topCategories.length > 0) {
    msg += "\n";
    r.topCategories
      .slice(0, 4)
      .forEach((c) => {
        const emoji = getCategoryEmoji(c.category);
        msg += emoji + " " + c.category + ": " + formatRupees(c.totalPaise) + "\n";
      });
  }

  return msg.trim();
}

function buildProfileUpdated(r: ProfileUpdatedResult): string {
  switch (r.field) {
    case "name":
      return "\u{1F44B} Got it! I'll call you " + bold(r.value) + ".";
    case "income":
      return "\u{1F4B5} Monthly income set to " + bold(formatRupees(parseInt(r.value, 10))) + ".";
    case "brief_time":
      return "☀️ Morning brief set to " + bold(r.value) + ".";
    default:
      return "✅ Profile updated!";
  }
}

export function buildHelpMessage(): string {
  return [
    "\u{1F44B} " + bold("Hey! Here's what I can do:"),
    "",
    "\u{1F4CB} " + bold("Tasks"),
    "  gym 6pm tomorrow",
    "  call mom by friday",
    "  done gym",
    "  skip meeting",
    "",
    "\u{1F4B0} " + bold("Expenses"),
    "  spent 200 swiggy",
    "  chai 50",
    "  2.5k rent",
    "  200 uber 150 swiggy",
    "",
    "\u{1F50D} " + bold("Queries"),
    "  pending tasks",
    "  how much did I spend?",
    "  this week expenses",
    "  summary",
    "",
    "⚙️ " + bold("Settings"),
    "  call me Rahul",
    "  income 50k",
    "  brief at 7am",
  ].join("\n");
}

export function buildUnknownMessage(raw?: string): string {
  if (raw) {
    const hasNumber = /\d+/.test(raw);
    const hasExpenseWord = /\b(spent|paid|kharcha|expense|cost|lagaa|kharch)\b/i.test(raw);
    const hasTaskWord = /\b(do|complete|finish|call|meet|buy|send|submit)\b/i.test(raw);

    if (hasNumber && !hasExpenseWord) {
      return "\u{1F914} Did you mean to log an expense?\nTry: *spent " + raw + "* or *" + raw + " rs*";
    }
    if (hasExpenseWord && !hasNumber) {
      return "\u{1F914} I need an amount to log that expense.\nTry: *spent 200 " + raw.replace(/\b(spent|paid|kharcha|expense|cost|lagaa|kharch)\b/gi, "").trim() + "*";
    }
    if (hasTaskWord) {
      return "✏️ I'll add that as a task.\nTo set a deadline, try: *" + raw + " tomorrow*";
    }
  }

  return "\u{1F914} I'm not sure what you mean.\n\nTry:\n• *spent 200 swiggy* (expense)\n• *gym 6pm tomorrow* (task)\n• *summary* (overview)\n• *help* (all commands)";
}
