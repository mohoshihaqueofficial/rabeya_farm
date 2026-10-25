# Prompts

Ready-to-use prompts for AI coding assistants (Claude Code, etc.) working on this repo. Copy a prompt,
fill the `<…>` parts, and paste it. Each prompt points the assistant to the right files and rules so the
result matches the existing code.

> Always true for this repo: Next.js **16** — read `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`).
> Rules live in [architecture.md](architecture.md) §3 and §6.

---

## 0. Context prompt (paste first in a new session)

```
This is Rabeya Farm, a Bangla-first Qurbani cattle website with an admin panel (Next.js 16 App Router,
React 19, TypeScript, plain CSS per route). Read docs/architecture.md, docs/security.md and
docs/error-handling.md before changing anything.
Rules:
- One shared type per entity in data/*.ts; the admin form edits exactly the fields the public page shows.
- Drafts/inactive items are filtered in data/*, never shown publicly.
- UI text in Bangla; every admin action shows an AdminToast (success or error).
- Match the surrounding code style; keep changes minimal.
- Finish with `npx tsc --noEmit` and `npm run lint` passing.
```

---

## 1. Add a field to cows (site + admin together)

```
Add a "<field name>" field to cows, e.g. <example value>.
1. Add it to the Cow type and cowDefaults in data/cattle.ts (and newAdminCow in data/admin-cattle.ts, blank).
2. Show it on the public cow page specs table (app/korbani-goru/[id]/page.tsx).
3. Add the input to the admin cow editor (app/admin/components/cow-details-editor.tsx) in the same place/order.
4. Validate it in validate() if required, with a Bangla toast message.
Do not add it anywhere else unless the public page shows it.
```

## 2. New homepage section managed from admin

```
Make the homepage "<section name>" editable from admin under the হোমপেজ sidebar group.
- Put the type, defaults and a storage key in data/homepage.ts.
- Public component reads via useStoredList (app/components/use-stored-list.ts).
- Admin page app/admin/homepage/<slug>/page.tsx using CollectionManager if it has a photo,
  otherwise follow app/admin/homepage/faq/page.tsx.
- Add the link to homepageItems in app/admin/components/admin-shell.tsx.
```

## 3. Phase 1 — admin login

```
Implement Phase 1 from docs/phases.md: admin authentication.
- lib/auth: password hashing (Argon2id), session table/cookie (HttpOnly, Secure, SameSite=Lax).
- proxy.ts (Next 16 name for middleware) redirecting /admin/* to /admin/login when no session cookie.
- requireAdmin(roles) helper used inside every admin Server Action (proxy is not enough — see docs/security.md §2).
- /admin/login page in Bangla, logout in the admin topbar.
Read node_modules/next/dist/docs/01-app/02-guides/authentication.md first.
```

## 4. Phase 2 — move an entity from localStorage to the database

```
Move <entity> from localStorage to PostgreSQL per docs/database.md.
- Create the table + migration and a seed from data/<file>.ts.
- Add lib/queries/<entity>.ts for reads; update public pages to use it.
- Replace admin localStorage writes with Server Actions that: requireAdmin → validate with a schema →
  write → audit log → revalidatePath. Return ActionResult as in docs/error-handling.md §3.
- Remove the now-unused localStorage code for this entity.
```

## 5. Booking & payment flow (Phase 3)

```
Implement booking submission for app/korbani-goru/[id]/partial-payment and full-payment.
- Server Action creates booking + payment in ONE transaction and sets cow availability.
- Enforce one open booking per cow and unique (method, reference) — return CONFLICT errors in Bangla.
- Read price from the DB, never from the form.
- Receipt upload to a private bucket (docs/security.md §4).
- Admin "অর্ডার" page to verify/reject payments.
Test: two simultaneous submissions for the same cow → only one succeeds.
```

## 6. Review a change

```
Review the current diff against docs/architecture.md §6 and docs/security.md.
Check: shared type used on both sides, drafts hidden publicly, Bangla toasts on every admin action,
server-side validation and auth in every Server Action, no dangerouslySetInnerHTML, mobile layout.
List concrete problems with file:line; don't rewrite unrelated code.
```

## 7. Bug report → fix

```
Bug: <what happens> on <URL>. Expected: <what should happen>. Steps: <1, 2, 3>.
Find the root cause before changing code; reproduce it if possible (headless Chrome against
localhost:3000 works). Fix it with the smallest change, then explain the cause in 2–3 lines.
```

---

## Tips

- One task per prompt; mention the exact page URL or file.
- Attach a screenshot for UI changes and say which element ("উপরের টপবার", "কার্ডের ডান কোণ").
- Ask the assistant to say what it **could not** verify (e.g. not tested in a real browser).
