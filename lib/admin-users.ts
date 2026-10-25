import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

// Admin users stored server-side in a JSON file (never sent to the browser with hashes).
// Temporary until the database exists (docs/database.md → admins table). Needs a persistent disk:
// works on a VPS / `next start`, NOT on serverless hosting where the file system is read-only/ephemeral.

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;
const storeFile = path.join(process.cwd(), ".data", "admin-users.json");

export type AdminRole = "owner" | "editor";
export type AdminUser = { id: string; username: string; name: string; role: AdminRole; active: boolean; passwordHash: string; createdAt: string };
export type PublicAdminUser = Omit<AdminUser, "passwordHash">;

export const usernamePattern = /^[a-z0-9_.]{3,30}$/;
export const minPasswordLength = 8;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function readStore(): Promise<AdminUser[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(storeFile, "utf8"));
    return Array.isArray(parsed) ? parsed as AdminUser[] : [];
  } catch { return []; }
}

// Write to a temp file then rename, so a crash never leaves a half-written store.
async function writeStore(users: AdminUser[]) {
  await mkdir(path.dirname(storeFile), { recursive: true });
  const temp = `${storeFile}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(users, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temp, storeFile);
}

// First run: create the owner from ADMIN_USERNAME / ADMIN_PASSWORD (.env.local) so someone can log in.
export async function listAdminUsers(): Promise<AdminUser[]> {
  const users = await readStore();
  if (users.length) return users;
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || !usernamePattern.test(username)) return [];
  const owner: AdminUser = { id: randomUUID(), username, name: "রাবেয়া অ্যাডমিন", role: "owner", active: true, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() };
  await writeStore([owner]);
  return [owner];
}

export const toPublicUser = (user: AdminUser): PublicAdminUser => ({ id: user.id, username: user.username, name: user.name, role: user.role, active: user.active, createdAt: user.createdAt });

export async function findAdminById(id: string) {
  return (await listAdminUsers()).find(user => user.id === id) ?? null;
}

export async function findAdminByUsername(username: string) {
  return (await listAdminUsers()).find(user => user.username === username.trim().toLowerCase()) ?? null;
}

export async function saveAdminUsers(users: AdminUser[]) {
  await writeStore(users);
}
