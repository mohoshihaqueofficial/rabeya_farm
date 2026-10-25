# Error Handling

How errors are shown to users and recorded for the team. Principle: **the user always knows what happened
and what to do next — in Bangla — and the team can find the cause.**

> Related: [architecture.md](architecture.md) · [security.md](security.md)

---

## 1. Kinds of errors

| Kind | Example | Handling |
|---|---|---|
| **Validation** (expected) | Empty cow name, bad YouTube link, duplicate blog slug | Show inline or toast message; keep the form data |
| **Business rule** (expected) | 5th featured cow, cow already booked, homepage FAQ limit | Toast explaining the rule + how to fix it |
| **Not found** | `/korbani-goru/RB-999`, unknown blog slug, draft cow | `notFound()` → `not-found.tsx` |
| **Storage / network** | localStorage full; later DB/storage/SMS down | Toast "সংরক্ষণ করা যায়নি …"; nothing half-saved |
| **Unexpected** (bug) | Exception in a component or action | Error boundary (`error.tsx`) + logged to monitoring |

---

## 2. Today (prototype) — patterns already in the code

- **Admin toast** (`app/admin/components/admin-toast.tsx`): green ✓ success / red ! error, auto-hides after 3.2 s,
  `role="status"` / `role="alert"` for screen readers. Every admin action must call it.
- **Validation before save** (cow editor, blog editor, FAQ, collections): first failing rule wins, the
  relevant tab is opened, message names the field, e.g. `"নাম, মূল্য ও ওজন দিন"`, `"সঠিক YouTube লিংক দিন"`.
- **Storage failure**: `localStorage.setItem` is wrapped in `try/catch`; on failure show
  `"সংরক্ষণ করা যায়নি · ব্রাউজারের জায়গা পূর্ণ…"` and **do not** update UI state.
- **Reading stored data**: each record is parsed in its own `try` so one bad record never hides the rest (`loadAdminCattle`).
- **Not found**: public pages call `notFound()` when an ID/slug is missing or the item is a draft.
- **Destructive actions** (delete) ask `confirm()` first.

---

## 3. Target (with a backend)

### Server Actions return results, they don't throw for expected errors
Following the Next 16 docs ("Handling expected errors"): model expected errors as return values.

```ts
type ActionResult<T = void> = { ok: true; data: T } | { ok: false; code: ErrorCode; message: string; field?: string };

// In the form (client):
const result = await saveCow(form);
if (!result.ok) { notify(result.message, "error"); focusField(result.field); return; }
notify("সব পরিবর্তন সংরক্ষিত হয়েছে");
```

Throw only for **unexpected** failures; those reach the nearest `error.tsx`.

### Error codes (shared, mapped to Bangla text in one place)
`VALIDATION`, `NOT_FOUND`, `CONFLICT` (already booked, duplicate slug/transaction ID), `LIMIT` (featured/FAQ max),
`UNAUTHORIZED`, `FORBIDDEN`, `RATE_LIMITED`, `STORAGE_FAILED`, `PAYMENT_FAILED`, `UNKNOWN`.
`UNKNOWN` messages never include stack traces or SQL — show "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন" plus a short reference ID.

### Error boundaries (files to add)
| File | Purpose |
|---|---|
| `app/error.tsx` | Public pages: friendly Bangla message, "আবার চেষ্টা করুন" (`reset`) + "হোমে ফিরুন" |
| `app/global-error.tsx` | Root layout failure (must render its own `<html><body>`) |
| `app/not-found.tsx` | Custom 404 with links to catalogue and home |
| `app/admin/error.tsx` | Admin-styled boundary; keeps sidebar usable |
| `app/korbani-goru/[id]/partial-payment/error.tsx` | Payment-specific: "টাকা কাটা হয়ে থাকলে ফোন করুন ০১৭১২–৩৪৫৬৭৮" |

### Payments — special care
- If the outcome is uncertain (timeout), **never** tell the user it failed; say it is being verified and show the order ID.
- Booking + payment writes are transactional and idempotent (same reference twice → same result, not a duplicate).

### Logging & monitoring
- Server: structured logs `{ level, code, action, entityId, refId }` — no phone numbers, OTPs or passwords.
- Client + server exceptions → Sentry (or similar), tagged with route and release.
- Alerts: payment action failure rate > 2 %, SMS/OTP failures, 5xx spike.

---

## 4. Message style guide

- Bangla, short, says **what to do**: "রঙ ও বিক্রয় অবস্থা নির্বাচন করুন" — not "Invalid input".
- Name the field the user must fix.
- Success messages confirm the result: "ওয়েবসাইটে প্রকাশিত হয়েছে".
- Never blame the user; never show technical details.
