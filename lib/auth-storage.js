const USER_KEY = "reelup_user";
const TOKEN_KEY = "reelup_token";

export function saveAuthSession(userData) {
  if (!userData) return;
  const { token, ...user } = userData;

  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  }

  if (typeof document !== "undefined") {
    if (token) {
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
    if (user.role) {
      document.cookie = `role=${user.role}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
  }
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }
  if (typeof document !== "undefined") {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
  }
}
