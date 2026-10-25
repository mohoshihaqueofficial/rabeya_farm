# Security

Rules and current risks. The site will handle money (booking payments) and personal data (phone numbers,
addresses), so these items are **requirements**, not suggestions.

> Related: [architecture.md](architecture.md) · [phases.md](phases.md) · [database.md](database.md)

---

## 1. Current risks (prototype)

| # | Risk | Severity | Fix in |
|---|---|---|---|
| 1 | ~~`/admin` has no login~~ — **fixed**: username + password login (`/admin-login`), signed HttpOnly session cookie with a **30-minute idle timeout** (warning at 28 min, `app/admin/components/idle-logout.tsx`), `proxy.ts` + server check in `app/admin/layout.tsx`, owner/editor roles, users managed at `/admin/users` | — | done |
| 2 | Payment & OTP forms are demos; nothing is verified server-side | High before launch | Phase 3–4 |
| 3 | Admin content still in `localStorage` (readable by any script on the origin) | Medium | Phase 2 |
| 4 | ~~No security headers~~ — **fixed** in `next.config.ts` (CSP, HSTS in production, X-Frame-Options, nosniff, Referrer/Permissions-Policy); `X-Powered-By` removed; `robots.ts` disallows `/admin` | — | done |
| 5 | Uploaded images accepted as base64 with only a client-side type/size check | Medium | Phase 2 |
| 6 | Admin users live in `.data/admin-users.json` (scrypt-hashed passwords). Needs a persistent disk; **does not work on serverless hosting** (Vercel). Login rate limit is in-memory. | Medium | Phase 2 (move to `admins` table) |

Admin setup: `.env.local` must contain `ADMIN_SESSION_SECRET` (≥ 32 chars), and `ADMIN_USERNAME` / `ADMIN_PASSWORD` for the first owner (used only while no users exist). Never commit `.env.local` or `.data/`.

---

## 2. Authentication & authorization

- **Admins:** email + password, hashed with Argon2id (or bcrypt cost ≥ 12). Lock the account for 15 min after 5 failed attempts.
- **Customers:** phone + 6-digit OTP. Store only a hash of the code; 5-minute expiry; max 5 attempts; max 3 OTP requests per phone per 15 min and per IP per hour.
- **Sessions:** HttpOnly, `Secure`, `SameSite=Lax` cookie containing a random session ID (not user data). Rotate on login; destroy on logout.
- **`proxy.ts` is only an optimistic redirect.** Next 16 docs: Server Functions are reachable by direct POST, so **every Server Action and Route Handler must verify the session and role itself.**
- Roles: `owner` (everything), `manager` (cows, bookings, payments), `editor` (blog & homepage content).

```ts
// Pattern for every admin Server Action
"use server";
export async function updateCow(input: unknown) {
  const admin = await requireAdmin(["owner", "manager"]); // throws → 401/403
  const data = cowSchema.parse(input);                   // validate (zod/valibot)
  // … write, audit log, revalidate
}
```

---

## 3. Input validation

- Validate **on the server** with a schema for every action; client checks are for UX only.
- Mirror today's client rules: cow name/price/weight required and > 0; colour and availability from enums;
  YouTube URL must pass `youtubeId()`; blog slug `^[a-z0-9]+(-[a-z0-9]+)*$` and unique; FAQ ≤ 4 on homepage; featured cows ≤ 4.
- Text is rendered through React (auto-escaped). **Never** use `dangerouslySetInnerHTML` with user or admin content.
- Blog content stays plain paragraphs (no HTML/Markdown rendering) unless a sanitizer is added.

## 4. File uploads

- Allow only `image/jpeg`, `image/png`, `image/webp`; verify by magic bytes on the server, not just the extension.
- Max 2 MB (cow photos) / 1.5 MB (others); re-encode or strip EXIF (GPS) before storing.
- Upload with short-lived signed URLs to object storage; store only the resulting URL.
- Payment receipts go to a **private** bucket, served via signed URLs to admins only.

## 5. Payments

- Never trust amounts or cow prices from the browser — read them from the DB.
- Booking + cow status change in one DB transaction (no double booking).
- Transaction IDs unique per method (`unique (method, reference)`).
- Gateway callbacks (SSLCommerz/bKash): verify signature/validate via the gateway API server-side; make the handler idempotent.
- Bank account details shown on the payment page must come from config, and the page already tells customers to confirm by phone — keep that.

## 6. Headers & transport

Set in `next.config.ts` `headers()`:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy` — allow self, `i.ytimg.com` / `www.youtube-nocookie.com` (video embeds), the image bucket; `frame-ancestors 'none'`
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 7. Secrets & privacy

- Secrets only in environment variables (`.env*` is already git-ignored). Rotate if one is ever committed.
- Admin lists show phone numbers; public pages never do. Log IDs, not personal data.
- Rate-limit public forms (contact, booking, OTP) to stop spam.
- Keep dependencies updated (`npm audit` in CI); pin Next.js minor versions and read release notes.

## 8. Pre-launch checklist

- [ ] Anonymous POST to every admin action returns 401
- [ ] OTP brute-force and request limits tested
- [ ] Double-booking race tested (two simultaneous submissions)
- [ ] Upload rejects a renamed `.exe` / SVG / oversized file
- [ ] Security headers verified (securityheaders.com)
- [ ] Backup restore tested
