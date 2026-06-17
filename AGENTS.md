<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Birthday Invitation Site

This project is a **birthday invitation site for Alyssa**. Event details are stored in **Postgres** via Drizzle (`DATABASE_URL`) and edited via `/admin`.

### Design system rules

- `.cursor/rules/design-system.mdc` — colors, Tailwind, typography, accessibility, **mobile-first**
- `.cursor/rules/components.mdc` — component file structure and React patterns

### Key paths

- Theme tokens: `app/globals.css` (`@theme inline`)
- Data layer: `lib/invitation.ts` (types, formatters)
- Data fetch: `lib/get-invitation.ts` (Drizzle)
- Server actions: `lib/actions/invitation.ts` (update, upload, auth)
- Auth: `lib/auth.ts` (`ADMIN_PASSWORD` cookie session)
- Uploads: `lib/uploads.ts` → `public/uploads/`
- Drizzle schema: `db/schema.ts`
- UI primitives: `components/ui/`
- Page sections: `components/sections/`
- Admin editor: `app/admin/`, `components/admin/`

### Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | Postgres connection (Drizzle) |
| `ADMIN_PASSWORD` | Yes | Password for `/admin` login |

### Package manager

Use **Bun** — see `.cursor/rules/bun.mdc`. Commands: `bun run dev`, `bun run db:push`, `bun run db:seed`, `bun run db:connect`.

### Mobile-first

All page and admin UI work must be mobile-first (single column, touch targets, full-width CTAs on phones).
