import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// Tiny server-side JSON file store under .data/ (git-ignored) — a stand-in until the database exists.
// Requires a persistent disk (VPS / `next start`); not suitable for serverless hosting.

export const dataDir = path.join(process.cwd(), ".data");

export async function readJsonList<T>(file: string): Promise<T[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(path.join(dataDir, file), "utf8"));
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch { return []; }
}

// Temp file + rename so a crash never leaves a half-written file.
export async function writeJsonList<T>(file: string, items: T[]) {
  const target = path.join(dataDir, file);
  await mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, JSON.stringify(items, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temp, target);
}

// Serialises read-modify-write on one file inside this server process (prevents two orders for one cow racing).
const locks = new Map<string, Promise<unknown>>();
export async function withFileLock<T>(file: string, task: () => Promise<T>): Promise<T> {
  const previous = locks.get(file) ?? Promise.resolve();
  const run = previous.catch(() => {}).then(task);
  locks.set(file, run.catch(() => {}));
  return run;
}
