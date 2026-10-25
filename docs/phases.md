# Delivery Phases

The roadmap from today's prototype to a production site that can take real bookings.
Each phase ends with a working, deployable site. Do not start a phase before the previous one's
**exit criteria** are met.

> Related: [architecture.md](architecture.md) · [database.md](database.md) · [security.md](security.md)

---

## Phase 0 — Prototype ✅ (done)

Public site and admin UI with static data and `localStorage` persistence.

- Catalogue with filters, cow details (gallery, YouTube video), partial/full payment forms (demo)
- Homepage: hero slider, featured cows (max 4), reviews, MoU partners, FAQ, advisors
- Blog (list, article, social share), FAQ page with search, social icons
- Admin: dashboard, cows (draft/active, featured, photos, video), blogs, homepage sections, FAQ

**Known gaps:** no auth on `/admin`, no database, no real payments/OTP, admin edits invisible to visitors.

---

## Phase 1 — Foundation & admin login (security first)

Goal: nobody but the farm team can open `/admin`.

1. Add `lib/auth`: admin accounts (email + password, hashed with Argon2/bcrypt), HttpOnly session cookie.
2. `proxy.ts`: redirect unauthenticated `/admin/*` requests to `/admin/login` (optimistic check).
3. Login page, logout button in the admin topbar, session expiry (7 days, sliding).
4. Security headers (CSP, HSTS, etc. — see [security.md](security.md)).
5. Environment variables via `.env.local` + hosting secrets; never committed.

**Exit criteria:** `/admin` and every admin Server Action reject anonymous requests (tested with a direct POST).

---

## Phase 2 — Database & real content management

Goal: admin changes are saved centrally and visible to every visitor.

1. Provision PostgreSQL; add ORM + migrations ([database.md](database.md)).
2. Seed the DB from `data/*.ts`.
3. Data-access layer `lib/queries/*`; public pages read from it.
4. Replace every `localStorage` write in admin with a **Server Action** (validated with a schema, auth-checked).
5. Image uploads → object storage (signed upload, type/size checks); store URLs only.
6. `revalidatePath`/`revalidateTag` after each write.
7. Remove the localStorage merge code (`loadAdminCattle`, `useStoredList`, etc.).

**Exit criteria:** an edit in admin appears on the public site from a different device within seconds; no base64 images in the DB.

---

## Phase 3 — Bookings & payments

Goal: customers can reserve a cow and the farm can verify payment.

1. `bookings` + `payments` tables; booking statuses (`pending → verified → completed / cancelled / refunded`).
2. Payment form submits to a Server Action: stores bank-transfer reference + uploaded receipt.
3. Prevent double booking: transactional status change on the cow (`available → partial-booked`).
4. Admin "অর্ডার" page: list, verify/reject payment, mark delivered.
5. SMS + email confirmation to the customer; notification to admin.
6. (Optional) Online gateway (SSLCommerz / bKash) with server-side verification of callbacks.

**Exit criteria:** a test booking goes end-to-end; the same cow cannot be booked twice concurrently.

---

## Phase 4 — Customer accounts

1. Phone + OTP login via SMS gateway (rate-limited — see [security.md](security.md)).
2. "আমার বুকিং" page: booking status, receipts, delivery date.
3. Admin "ক্রেতা" page.

**Exit criteria:** a customer can log in on a new device and see their bookings.

---

## Phase 5 — Quality, SEO & launch

1. Metadata + Open Graph images for cows and blog posts; `sitemap.ts`, `robots.ts`.
2. Error monitoring (Sentry or similar) and uptime checks ([error-handling.md](error-handling.md)).
3. Accessibility pass (keyboard, contrast, screen-reader labels) and Lighthouse ≥ 90 on mobile.
4. Daily DB backups + restore test.
5. Admin activity log (who changed what).
6. English translation completeness (`data/i18n.ts`).

**Exit criteria:** launch checklist signed off; restore from backup tested once.

---

## Phase 6 — After launch (backlog)

Reports dashboard (sales, bookings per week) · donation campaign payments · delivery scheduling ·
multiple admin roles (owner / manager / editor) · Bangla/English content per field.
