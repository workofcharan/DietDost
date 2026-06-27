export type MealCategory = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type MealLogSource = "curated" | "open-food-facts" | "gemini";

export interface MealLog {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  servingLabel: string;
  consumedAt: string;
  loggedAt: string;
  source: MealLogSource;
  sourceLabel: string;
}

export type MealLogInput = Omit<MealLog, "id" | "loggedAt" | "sourceLabel"> & {
  id?: string;
  loggedAt?: string;
  sourceLabel?: string;
};

export const LOG_STORAGE_KEY = "dietdost:meal-logs";

export const MEAL_CATEGORIES: MealCategory[] = ["Breakfast", "Lunch", "Snack", "Dinner"];

export const MEAL_DEFAULT_HOURS: Record<MealCategory, number> = {
  Breakfast: 8,
  Lunch: 13,
  Snack: 17,
  Dinner: 20,
};

export const SOURCE_LABELS: Record<MealLogSource, string> = {
  curated: "Curated",
  "open-food-facts": "Open Food Facts",
  gemini: "Gemini AI",
};

const LEGACY_CATEGORY_HOURS: Record<string, number> = {
  Breakfast: 8,
  Lunch: 13,
  Snack: 17,
  Dinner: 20,
};

const INITIAL_LOGS: Array<MealLogInput & { category: MealCategory }> = [
  { id: "1", name: "2 Idlis with Coconut Chutney", category: "Breakfast", calories: 220, protein: 6, carbs: 42, fat: 3, quantity: 1, servingLabel: "1 plate", consumedAt: consumedAtForMeal("Breakfast"), source: "curated" },
  { id: "2", name: "Masala Chai (with milk & sugar)", category: "Breakfast", calories: 90, protein: 2, carbs: 12, fat: 3, quantity: 1, servingLabel: "1 cup", consumedAt: withHour(new Date(), 8, 30).toISOString(), source: "curated" },
  { id: "3", name: "2 Butter Rotis", category: "Lunch", calories: 240, protein: 6, carbs: 36, fat: 8, quantity: 1, servingLabel: "2 pieces", consumedAt: consumedAtForMeal("Lunch"), source: "curated" },
  { id: "4", name: "Dal Tadka", category: "Lunch", calories: 150, protein: 8, carbs: 20, fat: 4, quantity: 1, servingLabel: "1 bowl", consumedAt: withHour(new Date(), 13, 15).toISOString(), source: "curated" },
  { id: "5", name: "Bhindi Masala", category: "Lunch", calories: 120, protein: 3, carbs: 14, fat: 6, quantity: 1, servingLabel: "1 bowl", consumedAt: withHour(new Date(), 13, 30).toISOString(), source: "curated" },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toFiniteNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toPositiveQuantity(value: unknown) {
  const quantity = toFiniteNumber(value, 1);
  return quantity > 0 ? quantity : 1;
}

function isLogSource(value: unknown): value is MealLogSource {
  return value === "curated" || value === "open-food-facts" || value === "gemini";
}

function validDate(value: unknown) {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function withHour(base: Date, hour: number, minute = 0) {
  const date = new Date(base);
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function consumedAtForMeal(category: MealCategory, base = new Date()) {
  return withHour(base, MEAL_DEFAULT_HOURS[category]).toISOString();
}

export function consumedAtForHour(hour: number, base = new Date()) {
  return withHour(base, Math.max(0, Math.min(23, hour))).toISOString();
}

export function getMealCategory(consumedAt: string): MealCategory {
  const hour = new Date(consumedAt).getHours();
  if (hour < 11) return "Breakfast";
  if (hour < 16) return "Lunch";
  if (hour < 19) return "Snack";
  return "Dinner";
}

export function formatMealTime(consumedAt: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(consumedAt));
}

export function sortMealLogs(logs: MealLog[]) {
  return [...logs].sort((a, b) => new Date(a.consumedAt).getTime() - new Date(b.consumedAt).getTime());
}

export function createMealLog(input: MealLogInput): MealLog {
  const source = isLogSource(input.source) ? input.source : "curated";

  return {
    id: input.id || makeId(),
    name: input.name.trim(),
    calories: toFiniteNumber(input.calories),
    protein: toFiniteNumber(input.protein),
    carbs: toFiniteNumber(input.carbs),
    fat: toFiniteNumber(input.fat),
    quantity: toPositiveQuantity(input.quantity),
    servingLabel: input.servingLabel || "1 serving",
    consumedAt: validDate(input.consumedAt)?.toISOString() || new Date().toISOString(),
    loggedAt: validDate(input.loggedAt)?.toISOString() || new Date().toISOString(),
    source,
    sourceLabel: input.sourceLabel || SOURCE_LABELS[source],
  };
}

function migrateLog(raw: unknown, index: number): MealLog | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<MealLog> & { category?: string };
  if (!item.name) return null;

  const existingConsumedAt = validDate(item.consumedAt);
  const fallbackHour = LEGACY_CATEGORY_HOURS[item.category || ""] ?? 12;
  const consumedAt = existingConsumedAt?.toISOString() || withHour(new Date(), fallbackHour, index * 5).toISOString();
  const source = isLogSource(item.source) ? item.source : "curated";

  return createMealLog({
    id: typeof item.id === "string" ? item.id : undefined,
    name: item.name,
    calories: toFiniteNumber(item.calories),
    protein: toFiniteNumber(item.protein),
    carbs: toFiniteNumber(item.carbs),
    fat: toFiniteNumber(item.fat),
    quantity: toPositiveQuantity(item.quantity),
    servingLabel: item.servingLabel || "1 serving",
    consumedAt,
    loggedAt: item.loggedAt,
    source,
    sourceLabel: item.sourceLabel,
  });
}

export function readMealLogs() {
  if (typeof window === "undefined") return sortMealLogs(INITIAL_LOGS.map(createMealLog));

  try {
    const raw = window.localStorage.getItem(LOG_STORAGE_KEY);
    if (!raw) {
      const initial = sortMealLogs(INITIAL_LOGS.map(createMealLog));
      writeMealLogs(initial);
      return initial;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const migrated = sortMealLogs(parsed.map(migrateLog).filter((log): log is MealLog => Boolean(log)));
    writeMealLogs(migrated);
    return migrated;
  } catch {
    return sortMealLogs(INITIAL_LOGS.map(createMealLog));
  }
}

export function writeMealLogs(logs: MealLog[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(sortMealLogs(logs)));
}

export function appendMealLogs(inputs: MealLogInput[]) {
  const existing = readMealLogs();
  const next = sortMealLogs([...existing, ...inputs.map(createMealLog)]);
  writeMealLogs(next);
  return next;
}

export function replaceMealLog(logs: MealLog[], id: string, patch: Partial<MealLog>) {
  return sortMealLogs(logs.map((log) => (log.id === id ? createMealLog({ ...log, ...patch, id: log.id, loggedAt: log.loggedAt }) : log)));
}
