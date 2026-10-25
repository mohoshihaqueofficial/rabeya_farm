import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookieName, readAdminToken } from "./admin-session";
import { findAdminById, toPublicUser, type AdminRole, type PublicAdminUser } from "./admin-users";

/** Current admin from the session cookie, only if the user still exists and is active. */
export async function getCurrentAdmin(): Promise<PublicAdminUser | null> {
  const userId = await readAdminToken((await cookies()).get(adminCookieName)?.value);
  if (!userId) return null;
  const user = await findAdminById(userId);
  return user?.active ? toPublicUser(user) : null;
}

/** For pages/layouts: redirect to login when not signed in (or not allowed). */
export async function requireAdminPage(roles?: AdminRole[]) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin-login");
  if (roles && !roles.includes(admin.role)) redirect("/admin");
  return admin;
}

/** For Server Actions: they are reachable by direct POST, so every action must call this itself. */
export async function requireAdminAction(roles?: AdminRole[]) {
  const admin = await getCurrentAdmin();
  if (!admin || (roles && !roles.includes(admin.role))) throw new Error("FORBIDDEN");
  return admin;
}
