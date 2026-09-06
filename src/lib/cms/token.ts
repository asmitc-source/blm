const KEY = "blm-desk.session";
const COOKIE = "blm_desk";

type DeskSession = { access: string; refresh?: string };

function parse(raw: string | null): DeskSession | null {
  if (!raw) return null;
  try {
    if (raw.startsWith("{")) return JSON.parse(raw) as DeskSession;
    return { access: raw };
  } catch {
    return { access: raw };
  }
}

function readCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )blm_desk=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (!token) {
    document.cookie = `${COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    return;
  }
  document.cookie = `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${14 * 86400}; SameSite=Lax`;
}

export function getDeskToken() {
  try {
    const fromStore = parse(localStorage.getItem(KEY)) ?? parse(sessionStorage.getItem(KEY));
    return fromStore?.access || readCookie();
  } catch {
    return readCookie();
  }
}

export function getDeskRefresh() {
  try {
    return parse(localStorage.getItem(KEY))?.refresh || null;
  } catch {
    return null;
  }
}

export function setDeskToken(token: string | null, refresh?: string | null) {
  try {
    if (!token) {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
      writeCookie(null);
      return;
    }
    const payload = JSON.stringify({ access: token, refresh: refresh || "" });
    localStorage.setItem(KEY, payload);
    sessionStorage.setItem(KEY, payload);
    writeCookie(token);
  } catch {
    writeCookie(token);
  }
}
