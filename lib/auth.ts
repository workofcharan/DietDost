import type { Session } from "@supabase/supabase-js";

export interface DietDostUser {
  name: string;
  email: string;
  calorieGoal: number;
  goal: string;
}

export const AUTH_STORAGE_KEY = "dietdost:user";

export function saveUser(user: DietDostUser) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): DietDostUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DietDostUser) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

type SessionMetadata = Record<string, unknown>;

export function syncSession(session: Session | null | undefined): DietDostUser | null {
  if (!session?.user) {
    clearUser();
    return null;
  }

  const meta = (session.user.user_metadata ?? {}) as SessionMetadata;
  const name = typeof meta.name === "string" ? meta.name : session.user.email?.split("@")[0] || "DietDost User";
  const goal = typeof meta.goal === "string" ? meta.goal : "maintain";
  const calorieGoal = typeof meta.calorieGoal === "number" ? meta.calorieGoal : Number(meta.calorieGoal) || 2000;

  const user: DietDostUser = {
    name,
    email: session.user.email || "",
    calorieGoal,
    goal,
  };
  saveUser(user);
  return user;
}
