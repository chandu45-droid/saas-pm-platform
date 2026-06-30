/**
 * Multi-expense parser — detects messages with 2+ expenses in a single line.
 * Examples:
 *   "200 uber 150 swiggy"       → [{200, uber, transport}, {150, swiggy, food}]
 *   "chai 50 bus 30"            → [{50, null, food}, {30, null, transport}]
 *   "spent 200 uber 150 chai"   → [{200, uber, transport}, {150, null, food}]
 *   "300 rent 1k groceries"     → [{300, null, rent}, {1000, null, food}]
 *
 * Strategy: extract all amounts, then for each amount find the nearest
 * merchant/category keyword in its "segment" of the message.
 */
import { extractAllAmounts, type AmountMatch } from "./amount";
import { categorize } from "../../core/categorizer";

export interface ParsedExpenseItem {
  amountPaise: number;
  category: string;
  merchant: string | null;
  date: Date | null;
}

// Known merchants (same as rules.ts — keep in sync)
const KNOWN_MERCHANTS =
  /\b(swiggy|zomato|uber|ola|rapido|netflix|hotstar|amazon|flipkart|myntra|bigbasket|blinkit|zepto|dunzo|croma|nykaa|meesho|ajio|dominos|pizza\s*hut|mcdonalds|kfc|starbucks|subway|burger\s*king|chaayos|spotify|jiocinema|sonyliv|zee5)\b/i;

// Category keywords for segment matching
const CATEGORY_KEYWORDS: { pattern: RegExp; category: string }[] = [
  { pattern: /\b(food|chai|coffee|lunch|dinner|breakfast|biryani|snack|meal|tiffin)\b/i, category: "food" },
  { pattern: /\b(auto|cab|petrol|diesel|metro|bus|train|flight|uber|ola|rapido)\b/i, category: "transport" },
  { pattern: /\b(rent|maintenance|society)\b/i, category: "rent" },
  { pattern: /\b(emi|loan)\b/i, category: "emi" },
  { pattern: /\b(wifi|electricity|gas|water|recharge|broadband|bill)\b/i, category: "utilities" },
  { pattern: /\b(movie|drinks|party|cinema|pvr|concert|game|gaming)\b/i, category: "entertainment" },
  { pattern: /\b(clothes|shoes|shopping|shirt|jeans|kurta)\b/i, category: "shopping" },
  { pattern: /\b(medicine|doctor|hospital|pharmacy|medical)\b/i, category: "health" },
  { pattern: /\b(gym|fitness|yoga)\b/i, category: "health" },
  { pattern: /\b(groceries|grocery|vegetables|fruits|sabzi|daal)\b/i, category: "food" },
];

/** Check if text contains a known merchant or category keyword */
function hasSignal(text: string): boolean {
  if (KNOWN_MERCHANTS.test(text)) return true;
  for (const { pattern } of CATEGORY_KEYWORDS) {
    if (pattern.test(text)) return true;
  }
  return false;
}

/**
 * Parse multi-expense messages.
 * Returns null if message has 0-1 amounts (let normal parser handle it).
 * Returns array of 2+ ParsedExpenseItem if multi-expense detected.
 */
export function parseMultiExpense(message: string): ParsedExpenseItem[] | null {
  const amounts = extractAllAmounts(message);

  // Only handle multi-expense (2+)
  if (amounts.length < 2) return null;

  const lower = message.toLowerCase();
  const sortedAmounts = [...amounts].sort((a, b) => a.startIndex - b.startIndex);

  // Detect message pattern:
  // Pattern A: "200 uber 150 swiggy" — numbers first, keywords after
  // Pattern B: "chai 50 bus 30" — keywords first, numbers after
  // Check: does the first amount start at/near the beginning?
  const firstAmtStart = sortedAmounts[0].startIndex;
  const textBeforeFirst = lower.slice(0, firstAmtStart).trim()
    .replace(/\b(spent|paid|and|aur|or|plus|ka|ki|ke|rs|rupees?|₹)\b/gi, "").trim();
  const isKeywordFirst = textBeforeFirst.length > 0 && hasSignal(textBeforeFirst);

  const items: ParsedExpenseItem[] = [];
  const cleanNoise = (t: string) =>
    t.replace(/\b(spent|paid|and|aur|or|plus|ka|ki|ke|rs|rupees?|₹)\b/gi, "").trim();

  for (let i = 0; i < sortedAmounts.length; i++) {
    const amt = sortedAmounts[i];
    const amtEnd = amt.startIndex + amt.raw.length;

    // Get text BEFORE (from previous amount's end to this amount's start)
    const beforeStart = i > 0
      ? sortedAmounts[i - 1].startIndex + sortedAmounts[i - 1].raw.length
      : 0;
    const cleanedBefore = cleanNoise(lower.slice(beforeStart, amt.startIndex));

    // Get text AFTER (from this amount's end to next amount's start)
    const afterEnd = i < sortedAmounts.length - 1
      ? sortedAmounts[i + 1].startIndex
      : lower.length;
    const cleanedAfter = cleanNoise(lower.slice(amtEnd, afterEnd));

    // Use pattern to determine which side to prefer:
    // Pattern B (keyword-first): always look BEFORE the amount
    // Pattern A (amount-first): always look AFTER the amount
    let cleaned: string;
    if (isKeywordFirst) {
      cleaned = cleanedBefore || cleanedAfter;
    } else {
      cleaned = cleanedAfter || cleanedBefore;
    }

    // Try to find merchant in segment
    const merchantMatch = KNOWN_MERCHANTS.exec(cleaned);
    let category = "misc";
    let merchant: string | null = null;

    if (merchantMatch) {
      merchant = merchantMatch[1];
      const catResult = categorize(merchant);
      category = catResult.category !== "uncategorized" ? catResult.category : "misc";
    } else {
      // Try category keywords
      for (const { pattern, category: cat } of CATEGORY_KEYWORDS) {
        if (pattern.test(cleaned)) {
          category = cat;
          break;
        }
      }
      // Last resort: try categorizer on cleaned text
      if (category === "misc" && cleaned.length > 1) {
        const catResult = categorize(cleaned);
        if (catResult.category !== "uncategorized") {
          category = catResult.category;
          merchant = catResult.merchant ?? null;
        }
      }
    }

    items.push({
      amountPaise: amt.paise,
      category,
      merchant,
      date: null,
    });
  }

  return items;
}
