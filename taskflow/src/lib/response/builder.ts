/**
 * Response builder — converts parsed intent results into WhatsApp reply messages.
 * Rules: under 300 chars, WhatsApp markdown, confirm what was parsed, include running totals.
 */
import type { ParsedIntent } from "../parser/types";
import { bold, formatRupees, formatDate, formatTime, truncate } from "./format";
import type { Task, Expense } from "../../db/schema";

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
  let msg = bold(truncate(r.task.title)) + " added!";
  if (r.task.dueAt) {
    msg += "\nDue: " + formatDate(r.task.dueAt) + " " + formatTime(r.task.dueAt);
    msg += "\nWill remind 30 min before.";
  }
  msg += "\n" + r.pendingCount + " task" + (r.pendingCount === 1 ? "" : "s") + " pending.";
  return msg;
}

function buildExpenseLogged(r: ExpenseLoggedResult): string {
  let msg = formatRupees(r.expense.amountPaise) + " logged";
  msg += " -> " + (r.expense.category || "misc");
  if (r.expense.merchant) {
    msg += " (" + r.expense.merchant + ")";
  }
  msg += "\nToday total: " + formatRupees(r.todayTotalPaise);
  return msg;
}

function buildTaskDone(r: TaskDoneResult): string {
  let msg = bold(truncate(r.task.title)) + " -- done!";
  if (r.remainingCount > 0) {
    msg += "\n" + r.remainingCount + " task" + (r.remainingCount === 1 ? "" : "s") + " left today.";
  } else {
    msg += "\nAll done for today!";
  }
  return msg;
}

function buildTaskSkipped(r: TaskSkippedResult): string {
  return bold(truncate(r.task.title)) + " skipped for today.";
}

function buildTaskNotFound(r: TaskNotFoundResult): string {
  if (r.pendingTasks.length === 0) {
    return "No pending tasks found.";
  }
  let msg = "Which task? " + r.query + " didn't match.\n";
  r.pendingTasks.slice(0, 5).forEach((t, i) => {
    msg += (i + 1) + ". " + truncate(t.title, 40) + "\n";
  });
  return msg.trim();
}

function buildTaskList(r: TaskListResult): string {
  if (r.tasks.length === 0) {
    return "No tasks " + (r.filter === "overdue" ? "overdue" : "for " + r.filter) + ".";
  }
  let msg = bold("Tasks (" + r.filter + "):") + "\n";
  r.tasks.slice(0, 10).forEach((t, i) => {
    const status = t.status === "done" ? " (done)" : t.status === "skipped" ? " (skipped)" : "";
    const due = t.dueAt ? " -- " + formatTime(t.dueAt) : "";
    msg += (i + 1) + ". " + truncate(t.title, 35) + due + status + "\n";
  });
  if (r.tasks.length > 10) {
    msg += "+" + (r.tasks.length - 10) + " more";
  }
  return msg.trim();
}

function buildExpenseList(r: ExpenseListResult): string {
  if (r.count === 0) {
    return "No expenses logged " + r.filter.replace("_", " ") + ".";
  }
  let msg = bold("Expenses (" + r.filter.replace("_", " ") + "):") + "\n";
  msg += "Total: " + formatRupees(r.totalPaise) + " (" + r.count + " entries)\n";
  if (r.byCategory && r.byCategory.length > 0) {
    r.byCategory.slice(0, 6).forEach((c) => {
      msg += "  " + c.category + ": " + formatRupees(c.totalPaise) + "\n";
    });
  }
  return msg.trim();
}

function buildSummary(r: SummaryResult): string {
  const period = r.period.replace("_", " ");
  let msg = bold("Summary (" + period + ")") + "\n";
  msg += "Tasks: " + r.tasksDone + " done, " + r.tasksPending + " pending";
  if (r.tasksOverdue > 0) msg += ", " + r.tasksOverdue + " overdue";
  msg += "\nSpent: " + formatRupees(r.expenseTotalPaise);
  if (r.topCategories.length > 0) {
    msg += "\nTop: ";
    msg += r.topCategories
      .slice(0, 3)
      .map((c) => c.category + " " + formatRupees(c.totalPaise))
      .join(", ");
  }
  return msg;
}

function buildProfileUpdated(r: ProfileUpdatedResult): string {
  switch (r.field) {
    case "name":
      return "Got it! I'll call you " + bold(r.value) + ".";
    case "income":
      return "Monthly income set to " + formatRupees(parseInt(r.value, 10)) + ".";
    case "brief_time":
      return "Morning brief set to " + bold(r.value) + ".";
    default:
      return "Profile updated!";
  }
}

export function buildHelpMessage(): string {
  return [
    bold("I can help with:"),
    "",
    bold("Tasks"),
    "  gym 6pm tomorrow",
    "  call mom",
    "  done gym",
    "",
    bold("Expenses"),
    "  spent 200 swiggy",
    "  chai 50",
    "  2.5k rent",
    "",
    bold("Queries"),
    "  what's left today?",
    "  how much did I spend?",
    "  summary",
    "",
    bold("Settings"),
    "  call me Rahul",
    "  income 50k",
    "  brief at 7am",
  ].join("\n");
}

export function buildUnknownMessage(): string {
  return "Not sure what you mean. Type " + bold("help") + " for examples.";
}
