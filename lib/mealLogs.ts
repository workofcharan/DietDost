import { supabase } from "@/lib/supabase";

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

type MealLogRow = {
  id: string;
  name: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  quantity: number | null;
  serving_label: string | null;
  consumed_at: string | null;
  logged_at: string | null;
  source: string | null;
};

function toFiniteNumber(value: unknown, fallback = 0) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
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
    id: input.id || crypto.randomUUID(),
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

function rowToMealLog(row: MealLogRow): MealLog {
  const source = isLogSource(row.source) ? row.source : "curated";
  return createMealLog({
    id: row.id,
    name: row.name,
    calories: row.calories ?? 0,
    protein: row.protein ?? 0,
    carbs: row.carbs ?? 0,
    fat: row.fat ?? 0,
    quantity: row.quantity ?? 1,
    servingLabel: row.serving_label || "1 serving",
    consumedAt: row.consumed_at || new Date().toISOString(),
    loggedAt: row.logged_at || row.consumed_at || new Date().toISOString(),
    source,
  });
}

function mealLogToInsert(log: MealLog, userId: string) {
  return {
    id: log.id,
    user_id: userId,
    name: log.name,
    calories: log.calories,
    protein: log.protein,
    carbs: log.carbs,
    fat: log.fat,
    quantity: log.quantity,
    serving_label: log.servingLabel,
    consumed_at: log.consumedAt,
    logged_at: log.loggedAt,
    source: log.source,
  };
}

async function requireUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Please sign in to save and view your meal logs.");
  }
  return data.user.id;
}

export async function readMealLogs(options?: { from?: string; to?: string }) {
  await requireUserId();
  let query = supabase.from("meal_logs").select("*").order("consumed_at", { ascending: true });

  if (options?.from) query = query.gte("consumed_at", options.from);
  if (options?.to) query = query.lt("consumed_at", options.to);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return sortMealLogs(((data || []) as MealLogRow[]).map(rowToMealLog));
}

export async function appendMealLogs(inputs: MealLogInput[]) {
  const userId = await requireUserId();
  const logs = inputs.map(createMealLog);
  const { data, error } = await supabase
    .from("meal_logs")
    .insert(logs.map((log) => mealLogToInsert(log, userId)))
    .select("*")
    .order("consumed_at", { ascending: true });

  if (error) throw new Error(error.message);
  return sortMealLogs(((data || []) as MealLogRow[]).map(rowToMealLog));
}

export async function deleteMealLog(id: string) {
  const { error } = await supabase.from("meal_logs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateMealLog(id: string, patch: Partial<MealLog>) {
  const payload: Record<string, unknown> = {};
  if (patch.name !== undefined) payload.name = patch.name.trim();
  if (patch.calories !== undefined) payload.calories = toFiniteNumber(patch.calories);
  if (patch.protein !== undefined) payload.protein = toFiniteNumber(patch.protein);
  if (patch.carbs !== undefined) payload.carbs = toFiniteNumber(patch.carbs);
  if (patch.fat !== undefined) payload.fat = toFiniteNumber(patch.fat);
  if (patch.quantity !== undefined) payload.quantity = toPositiveQuantity(patch.quantity);
  if (patch.servingLabel !== undefined) payload.serving_label = patch.servingLabel || "1 serving";
  if (patch.consumedAt !== undefined) payload.consumed_at = validDate(patch.consumedAt)?.toISOString() || new Date().toISOString();
  if (patch.loggedAt !== undefined) payload.logged_at = validDate(patch.loggedAt)?.toISOString() || new Date().toISOString();
  if (patch.source !== undefined) payload.source = isLogSource(patch.source) ? patch.source : "curated";

  const { data, error } = await supabase.from("meal_logs").update(payload).eq("id", id).select("*").single();
  if (error) throw new Error(error.message);
  return rowToMealLog(data as MealLogRow);
}
