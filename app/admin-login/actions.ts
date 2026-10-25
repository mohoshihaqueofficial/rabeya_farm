"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookieName, createAdminToken, readAdminToken, safeAdminPath, sessionSecret } from "@/lib/admin-session";
import { findAdminById, findAdminByUsername, hashPassword, verifyPassword } from "@/lib/admin-users";

export type LoginState = { error?: string };

// Per-IP limit: 5 failed logins → locked for 15 minutes.
// In-memory (resets on restart, per server instance); move to the DB/Redis with the backend (docs/security.md).
const attempts = new Map<string, { count: number; lockedUntil: number }>();
const maxAttempts = 5;
const lockMs = 15 * 60 * 1000;
// Used when the username doesn't exist, so a wrong username takes as long as a wrong password.
const dummyHash = hashPassword("timing-equaliser");

export async function loginAdmin(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!sessionSecret()) return { error: "অ্যাডমিন লগইন এখনো চালু করা হয়নি (ADMIN_SESSION_SECRET সেট করা নেই)।" };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() || requestHeaders.get("x-real-ip") || "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.lockedUntil > now) {
    return { error: `অনেকবার ভুল চেষ্টা হয়েছে। ${Math.ceil((record.lockedUntil - now) / 60000)} মিনিট পর আবার চেষ্টা করুন।` };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const user = username ? await findAdminByUsername(username) : null;
  const passwordOk = await verifyPassword(password, user?.passwordHash ?? await dummyHash);

  // Same message for wrong username, wrong password or disabled account — don't reveal which.
  if (!user || !passwordOk || !user.active) {
    const count = (record && record.lockedUntil && record.lockedUntil <= now ? 0 : record?.count ?? 0) + 1;
    attempts.set(ip, { count, lockedUntil: count >= maxAttempts ? now + lockMs : 0 });
    const left = maxAttempts - count;
    return { error: left > 0 ? `ইউজারনেম বা পাসওয়ার্ড সঠিক নয়। আর ${left} বার চেষ্টা করা যাবে।` : "অনেকবার ভুল চেষ্টা হয়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।" };
  }

  attempts.delete(ip);
  await setSessionCookie(user.id);
  redirect(safeAdminPath(formData.get("next")));
}

async function setSessionCookie(userId: string) {
  const { token, maxAge } = await createAdminToken(userId);
  (await cookies()).set(adminCookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge });
}

/** Called by the admin panel while the user is active: extends the idle timeout. False = session already gone. */
export async function refreshAdminSession(): Promise<boolean> {
  const userId = await readAdminToken((await cookies()).get(adminCookieName)?.value);
  const user = userId ? await findAdminById(userId) : null;
  if (!user?.active) return false;
  await setSessionCookie(user.id);
  return true;
}

/** Automatic logout after inactivity; the login page explains why. */
export async function logoutAdminIdle() {
  (await cookies()).delete(adminCookieName);
  redirect("/admin-login?reason=idle");
}

export async function logoutAdmin() {
  (await cookies()).delete(adminCookieName);
  redirect("/admin-login");
}
