const KEY = "blm-desk.token";

export function getDeskToken() {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setDeskToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(KEY, token);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* partitioned iframe */
  }
}
