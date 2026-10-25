# Database Design

Target schema for Phase 2+ ([phases.md](phases.md)). Today the same shapes live as TypeScript types in
`data/*.ts`; the tables below map **one-to-one** to those types so the migration is mechanical.

- **Engine:** PostgreSQL 16 (Neon / Supabase)
- **ORM:** Drizzle or Prisma (pick one; examples below are plain SQL)
- **Conventions:** `snake_case` columns, `uuid` primary keys unless a human ID exists, `created_at` / `updated_at` on every table, money in **integer taka** (no floats), soft visibility via `is_active` / `is_draft` rather than deleting.

> Related: [architecture.md](architecture.md) · [security.md](security.md)

---

## 1. Entity overview

```
admins ─┬─< audit_logs
        │
cows ───┼─< cow_photos
        ├─< bookings >── customers
        │       └─< payments
blog_posts ─< blog_sections
hero_slides, reviews, partners, advisors, faqs   (homepage content, ordered by sort_order)
otp_codes (short-lived)
```

---

## 2. Tables

### cows  (`data/cattle.ts` → `Cow`)
| Column | Type | Notes |
|---|---|---|
| id | text PK | Human ID `RB-101`; generated as next unused number |
| name | text not null | "ধরন / নাম" |
| weight_kg | int not null check (> 0) | |
| price_taka | int not null check (> 0) | |
| color | text not null | enum: `brown, white, black, mixed` |
| availability | text not null | enum: `available, partial-booked, sold` |
| age, gender, health, vaccine, origin, feed | text | Shown in the public specs table |
| video_url | text null | YouTube link, validated with `youtubeId()` |
| is_draft | bool default true | Hidden from public when true |
| is_featured | bool default false | Homepage; app enforces max 4 |
| views, inquiries | int default 0 | Stats only |
| created_at, updated_at | timestamptz | |

Index: `(is_draft, availability)`, `(is_featured) where is_featured`.

### cow_photos
`id uuid PK`, `cow_id → cows.id on delete cascade`, `url text`, `position text default 'center'`, `sort_order int`.
The photo with `sort_order = 0` is the main photo (`Cow.image`); the rest are `Cow.gallery`.

### blog_posts  (`data/blogs.ts` → `BlogPost`)
`slug text PK` (`^[a-z0-9]+(-[a-z0-9]+)*$`), `title`, `excerpt`, `category`, `author`, `published_at date`,
`cover_image_url`, `image_position`, `is_featured bool` (unique partial index: only one true),
`is_active bool`, timestamps. `read_time` and `published_label` are **computed**, not stored.

### blog_sections
`id uuid PK`, `post_slug → blog_posts.slug on update cascade on delete cascade`, `heading text`, `paragraphs text[]`, `sort_order int`.

### Homepage content
| Table | Columns (+ `id`, `sort_order`, `is_active`, timestamps) |
|---|---|
| hero_slides | `image_url`, `alt` |
| reviews | `quote`, `name`, `location`, `image_url` |
| partners | `name`, `agreement_photo_url` |
| advisors | `name`, `role`, `summary`, `image_url` (card colour derived from order) |
| faqs | `question`, `answer`, `show_on_homepage bool` (app enforces max 4) |

### customers
`id uuid PK`, `phone text unique not null` (E.164, `+8801…`), `name`, `email null`, `address null`, timestamps.

### bookings
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | Shown to customer as short order ID |
| cow_id | text → cows.id | |
| customer_id | uuid → customers.id | |
| type | text | `partial` / `full` |
| amount_due_taka | int | |
| status | text | `pending, verified, completed, cancelled, refunded` |
| delivery_address, delivery_date | text, date | |
| timestamps | | |

Constraint: **one open booking per cow** — `unique (cow_id) where status in ('pending','verified')`.
Booking creation runs in a transaction that also sets `cows.availability`.

### payments
`id uuid PK`, `booking_id → bookings.id`, `method` (`bank, bkash, nagad, gateway`), `amount_taka int`,
`reference text` (transaction ID), `receipt_url null`, `status` (`submitted, verified, rejected`),
`verified_by → admins.id null`, `verified_at`, timestamps.
Index: `unique (method, reference)` to block reusing a transaction ID.

### admins
`id uuid PK`, `email unique`, `password_hash`, `name`, `role` (`owner, manager, editor`), `last_login_at`, timestamps.

### audit_logs
`id bigserial PK`, `admin_id`, `action` (e.g. `cow.update`), `entity`, `entity_id`, `diff jsonb`, `created_at`.

### otp_codes
`phone`, `code_hash`, `expires_at` (5 min), `attempts int`, `created_at`. Delete after use or expiry.

---

## 3. Migration from today's data

1. Write migrations for the tables above.
2. Seed script reads `data/cattle.ts`, `blogs.ts`, `homepage.ts`, `partners.ts`, `advisors.ts`, `faqs.ts`
   and inserts rows; images in `public/` keep their paths (or are uploaded to storage).
3. Admin `localStorage` data is **not** migrated automatically — it only exists in one browser.
   If needed, export it once from DevTools and import manually.

## 4. Backups & data rules

- Automated daily backups, 14-day retention; test a restore before launch.
- Never hard-delete bookings or payments; cancel/refund instead.
- Personal data (phone, address) is visible only to admins; see [security.md](security.md).
