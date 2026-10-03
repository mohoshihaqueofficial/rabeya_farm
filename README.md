# Rabeya Farm

A fully independent website project for Rabeya Farm.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## Development

```bash
npm run dev
```

Open http://localhost:3000.

Admin panel: http://localhost:3000/admin

- `/admin/cows` — searchable cattle inventory
- `/admin/cows/[id]` — dynamic cattle editor with details, health, media, and activity tabs
- `/admin/cows/new` — new cattle draft flow

## Performance and caching

- Static App Router pages are prerendered and cached by Next.js.
- Optimized image responses use WebP with a 7-day minimum cache TTL.
- Versioned `*-optimized.jpg` source assets use a 1-year immutable browser cache.
- Replace an optimized image with a new filename when its content changes so browsers receive the new version immediately.

Editable homepage content is stored in `data/site.ts`. Official farm details, product catalogue, contact information, and media can be added as they become available.
