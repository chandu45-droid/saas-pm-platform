/**
 * WhatsApp message formatting utilities.
 * WhatsApp supports: *bold*, _italic_, ~strikethrough~, ```monospace```
 */

/** Format amount from paise to readable INR string */
export function formatRupees(paise: number): string {
  const rupees = Math.abs(paise) / 100;
  if (rupees >= 10000000) {
    return "Rs." + (rupees / 10000000).toFixed(2) + " Cr";
  }
  if (rupees >= 100000) {
    return "Rs." + (rupees / 100000).toFixed(2) + " L";
  }
  if (rupees >= 1000) {
    return "Rs." + rupees.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  }
  return "Rs." + rupees.toFixed(0);
}

/** Bold text for WhatsApp */
export function bold(text: string): string {
  return "*" + text + "*";
}

/** Format a date as readable string */
export function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Format time as 12-hour string */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Truncate text to maxLength with ellipsis */
export function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
