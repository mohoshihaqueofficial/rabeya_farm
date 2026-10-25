# Architecture

Rabeya Farm is a Bangla-first website for selling Qurbani cattle online, plus an admin panel to manage
the catalogue and the homepage content. This document describes the system **as it is today** and the
**target architecture** once a backend is added.

> Related: [phases.md](phases.md) · [database.md](database.md) · [security.md](security.md) · [error-handling.md](error-handling.md) · [prompts.md](prompts.md)

---

## 1. Tech stack

| Layer | Today | Notes |
|---|---|---|
| Framework | Next.js **16.3** (App Router), React 19.2 | Breaking changes vs older Next — read `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`). `middleware.ts` is now **`proxy.ts`**. |
| Language | TypeScript 5 (strict) | `npx tsc --noEmit` must pass. |
| Styling | Plain CSS per route (`*.css`, one CSS module for advisors) + `app/globals.css`; Tailwind 4 installed but barely used | Keep the existing per-route CSS pattern. |
| Fonts | Hind Siliguri (Bangla) via `next/font` | |
| Data | Static TypeScript files in `data/` | No database yet. |
| Admin persistence | Browser `localStorage` | Demo only — see §4. |
| Hosting | Not decided | Vercel is the natural fit for Next 16. |

---

## 2. Folder structure

```
app/
  page.tsx                     Homepage (hero slider, featured cows, reviews, partners, FAQ, advisors)
  korbani-goru/                Cattle catalogue
    page.tsx, catalogue.tsx      List + filters (price, weight, colour) + sort + pagination
    [id]/page.tsx                Cow details (gallery + YouTube video, specs, booking panel)
    [id]/partial-payment/        Partial booking payment form (bank transfer details)
    [id]/full-payment/           Full payment form
    booked-cows.ts               "Already booked from this browser" flag (localStorage)
  blog/, blog/[slug]/          Blog list + article (with social share buttons)
  faq/                         All FAQs with search
  about/, contact/, donation/, refund-policy/, account/ (mobile + OTP login — demo)
  components/                  Shared site UI: header, footer, hero slider, FAQ list, social links, …
  admin/                       Admin panel (no auth yet!)
    layout.tsx + components/admin-shell.tsx   Sidebar + topbar
    page.tsx                   Dashboard
    cows/, cows/[id]/          Cattle list + create/edit (id "new" = create)
    blogs/, blogs/[slug]/      Blog list + create/edit (slug "new" = create)
    partners/                  MoU partners
    homepage/slider|reviews|advisors|faq   Homepage sections
    components/                Admin-only UI: cow editor, blog editor, collection manager, toast, hooks
data/                          Single source of truth for content + types
  cattle.ts                    Cow type, catalogue, featured, helpers (youtubeId, bnNumber)
  admin-cattle.ts              Admin view of cows + localStorage merge
  blogs.ts, faqs.ts, homepage.ts, partners.ts, advisors.ts
public/                        Images (Home/, partners/, advisors/)
docs/                          These documents
```

---

## 3. Key design rules

1. **One data model per entity, shared by site and admin.** `data/cattle.ts` defines `Cow`; the admin form
   edits exactly those fields, nothing more, nothing less. Same for blogs, FAQs, partners, etc.
   When a field is added, add it to the type → it must appear in both the public page and the admin form.
2. **Public = published only.** Drafts / inactive items are filtered out in `data/*` (`catalogue`,
   `activeBlogPosts`, `activePartners`, `faq.active`) — pages never filter by themselves.
3. **Server Components by default.** Only interactive pieces are `"use client"` (filters, gallery,
   forms, admin pages).
4. **Bangla UI text, English code.** Labels, toasts and errors are in Bangla; identifiers and comments in English.
5. **Admin feedback.** Every admin action shows a toast (`AdminToast`), success or error.

### Content managed from admin

| Entity | Public page(s) | Admin page | Data file | Storage key (demo) |
|---|---|---|---|---|
| Cow | `/korbani-goru`, `/korbani-goru/[id]`, homepage "আমাদের সংগ্রহ" (featured, max 4) | `/admin/cows` | `cattle.ts` | `rabeya-admin-cow:<id>` |
| Blog post | `/blog`, `/blog/[slug]` | `/admin/blogs` | `blogs.ts` | `rabeya-farm:blogs` |
| Hero slide | homepage hero | `/admin/homepage/slider` | `homepage.ts` | `rabeya-farm:hero-slides` |
| Review | homepage reviews | `/admin/homepage/reviews` | `homepage.ts` | `rabeya-farm:reviews` |
| MoU partner | homepage partners | `/admin/partners` | `partners.ts` | `rabeya-farm:mou-partners` |
| Advisor | homepage advisors | `/admin/homepage/advisors` | `advisors.ts` | `rabeya-farm:advisors` |
| FAQ | `/faq`, homepage FAQ (★, max 4) | `/admin/homepage/faq` | `faqs.ts` | `rabeya-farm:faqs` |

---

## 4. Current limitation: no backend

All admin changes are written to **the admin's own browser** (`localStorage`, ~5 MB). Consequences:

- Visitors never see admin changes; the public site shows only what is in `data/*.ts`.
- Uploaded photos are stored as base64 data URLs and fill storage quickly.
- Payments, bookings and login are **UI demos** — nothing is sent anywhere.
- `/admin` is publicly reachable (no login).

This is acceptable for a design prototype only. [phases.md](phases.md) describes how to remove it.

---

## 5. Target architecture

```
Browser ──► Next.js (Vercel)
              ├─ proxy.ts                 optimistic auth redirect for /admin/*
              ├─ Server Components        read published data (cached, revalidated on change)
              ├─ Server Actions           all admin writes + booking/payment submissions
              │     └─ verify session + role inside every action (never trust proxy alone)
              ├─ lib/db (Drizzle/Prisma) ─► PostgreSQL (Neon / Supabase)
              ├─ lib/storage             ─► Object storage (Cloudflare R2 / S3) for photos
              ├─ lib/auth                 session cookie (HttpOnly), admin password + customer phone OTP
              └─ lib/sms                 ─► Bangladeshi SMS gateway for OTP & booking confirmations
```

- `data/*.ts` becomes the **seed** for the database; the types move to `lib/types` (or are generated from the schema).
- Public pages read through a small data-access layer (`lib/queries/*`) so the swap from static files to DB touches one place.
- After an admin write, call `revalidatePath`/`revalidateTag` so published pages update immediately.
- Images: upload to object storage, store the URL in the DB; use `next/image` with `remotePatterns` for that bucket.

---

## 6. Conventions checklist (for every change)

- [ ] Field exists in the shared type and in **both** the public page and the admin form
- [ ] Drafts/inactive items excluded from public data
- [ ] Bangla UI text; toast on every admin action
- [ ] Works at phone width (≥ 360 px)
- [ ] `npx tsc --noEmit` and `npm run lint` pass
