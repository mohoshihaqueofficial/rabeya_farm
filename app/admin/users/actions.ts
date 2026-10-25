"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin-auth";
import { hashPassword, listAdminUsers, minPasswordLength, saveAdminUsers, usernamePattern, type AdminRole } from "@/lib/admin-users";

export type UserActionResult = { ok: boolean; message: string };

const fail = (message: string): UserActionResult => ({ ok: false, message });
const roles: AdminRole[] = ["owner", "editor"];

// Every action re-checks the session and owner role — Server Actions are reachable by direct POST.
async function owner() {
  try { return await requireAdminAction(["owner"]); } catch { return null; }
}

export async function createAdminUser(formData: FormData): Promise<UserActionResult> {
  if (!(await owner())) return fail("এই কাজের অনুমতি নেই।");
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as AdminRole;

  if (!name) return fail("নাম দিন।");
  if (!usernamePattern.test(username)) return fail("ইউজারনেম ৩–৩০ অক্ষরের হতে হবে: ছোট হাতের ইংরেজি অক্ষর, সংখ্যা, _ বা .");
  if (password.length < minPasswordLength) return fail(`পাসওয়ার্ড কমপক্ষে ${minPasswordLength} অক্ষরের হতে হবে।`);
  if (!roles.includes(role)) return fail("ভূমিকা নির্বাচন করুন।");

  const users = await listAdminUsers();
  if (users.some(user => user.username === username)) return fail("এই ইউজারনেম আগে থেকেই আছে।");
  await saveAdminUsers([...users, { id: randomUUID(), username, name, role, active: true, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() }]);
  revalidatePath("/admin/users");
  return { ok: true, message: `ইউজার "${username}" তৈরি হয়েছে।` };
}

export async function setAdminUserActive(id: string, active: boolean): Promise<UserActionResult> {
  const me = await owner();
  if (!me) return fail("এই কাজের অনুমতি নেই।");
  if (id === me.id) return fail("নিজের অ্যাকাউন্ট বন্ধ করা যাবে না।");
  const users = await listAdminUsers();
  const target = users.find(user => user.id === id);
  if (!target) return fail("ইউজার পাওয়া যায়নি।");
  if (!active && target.role === "owner" && users.filter(user => user.role === "owner" && user.active).length <= 1) return fail("অন্তত একজন সক্রিয় Owner থাকতে হবে।");
  await saveAdminUsers(users.map(user => user.id === id ? { ...user, active } : user));
  revalidatePath("/admin/users");
  return { ok: true, message: active ? `"${target.username}" চালু করা হয়েছে।` : `"${target.username}" বন্ধ করা হয়েছে · আর লগইন করতে পারবে না।` };
}

export async function resetAdminPassword(id: string, password: string): Promise<UserActionResult> {
  if (!(await owner())) return fail("এই কাজের অনুমতি নেই।");
  if (password.length < minPasswordLength) return fail(`পাসওয়ার্ড কমপক্ষে ${minPasswordLength} অক্ষরের হতে হবে।`);
  const users = await listAdminUsers();
  const target = users.find(user => user.id === id);
  if (!target) return fail("ইউজার পাওয়া যায়নি।");
  const passwordHash = await hashPassword(password);
  await saveAdminUsers(users.map(user => user.id === id ? { ...user, passwordHash } : user));
  return { ok: true, message: `"${target.username}"-এর পাসওয়ার্ড বদলানো হয়েছে।` };
}

export async function deleteAdminUser(id: string): Promise<UserActionResult> {
  const me = await owner();
  if (!me) return fail("এই কাজের অনুমতি নেই।");
  if (id === me.id) return fail("নিজের অ্যাকাউন্ট মুছে ফেলা যাবে না।");
  const users = await listAdminUsers();
  const target = users.find(user => user.id === id);
  if (!target) return fail("ইউজার পাওয়া যায়নি।");
  if (target.role === "owner" && users.filter(user => user.role === "owner" && user.active && user.id !== id).length === 0) return fail("অন্তত একজন সক্রিয় Owner থাকতে হবে।");
  await saveAdminUsers(users.filter(user => user.id !== id));
  revalidatePath("/admin/users");
  return { ok: true, message: `"${target.username}" মুছে ফেলা হয়েছে।` };
}
