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

export function syncSession(session: any): DietDostUser | null {
  if (!session || !session.user) {
    clearUser();
    return null;
  }
  const meta = session.user.user_metadata || {};
  const user: DietDostUser = {
    name: meta.name || session.user.email?.split("@")[0] || "DietDost User",
    email: session.user.email || "",
    calorieGoal: Number(meta.calorieGoal) || 2000,
    goal: meta.goal || "maintain",
  };
  saveUser(user);
  return user;
}
