// Admin session: a signed, expiring token in an HttpOnly cookie.
// Token = "<userId>.<expiresAtMs>.<HMAC-SHA256(userId.expiresAtMs)>", signed with ADMIN_SESSION_SECRET.
// Web Crypto only, so it runs in proxy.ts as well as in Server Components / Actions.
// proxy.ts only checks the signature; the server (lib/admin-auth.ts) also checks the user still exists and is active.

export const adminCookieName = "rabeya_admin";
// Idle timeout: the session lasts this long after the last activity, then the user must log in again.
// The browser (IdleLogout) refreshes it while the admin is active; closing the tab lets it expire.
export const adminIdleMinutes = 30;

const encoder = new TextEncoder();

export function sessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  return value && value.length >= 32 ? value : null;
}

function toBase64Url(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(value: string, key: string) {
  const cryptoKey = await crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toBase64Url(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value)));
}

// Constant-time comparison (both sides are HMAC'd first so lengths match).
export async function safeEqual(a: string, b: string) {
  const key = sessionSecret() ?? "unconfigured";
  const [x, y] = await Promise.all([hmac(a, key), hmac(b, key)]);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  return diff === 0;
}

export async function createAdminToken(userId: string) {
  const key = sessionSecret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload = `${userId}.${Date.now() + adminIdleMinutes * 60 * 1000}`;
  return { token: `${payload}.${await hmac(payload, key)}`, maxAge: adminIdleMinutes * 60 };
}

/** Returns the user id from a valid, unexpired token, otherwise null. */
export async function readAdminToken(token: string | undefined) {
  const key = sessionSecret();
  if (!key || !token) return null;
  const [userId, expiresAt, signature] = token.split(".");
  if (!userId || !/^[\w-]+$/.test(userId) || !expiresAt || !/^\d+$/.test(expiresAt) || !signature || Number(expiresAt) < Date.now()) return null;
  return (await safeEqual(signature, await hmac(`${userId}.${expiresAt}`, key))) ? userId : null;
}

// Only allow redirects back into the admin panel (no open redirect).
export function safeAdminPath(next: unknown) {
  return typeof next === "string" && /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin";
}
