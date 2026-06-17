# Alyssa Birthday Invitation

A mobile-first birthday invitation website with an admin panel to edit event details, collect RSVPs, and display guest wishes as floating bubbles.

## Features

- **Public invitation** — hero, event details, gallery, RSVP form
- **Bahasa Melayu default** with **BM / EN** language toggle
- **RSVP** — guest name, attendance, guest count, optional birthday wishes
- **Floating wish bubbles** — guests' wishes animate across the page
- **Directions** — Google Maps and Waze links for the venue
- **Admin panel** (`/admin`) — edit invitation copy (BM + EN), images, view RSVP responses
- **Postgres + Drizzle** — invitation data and RSVPs stored in Supabase Postgres (or any Postgres host)

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team) + Postgres
- [Bun](https://bun.sh) (package manager)

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string (Supabase pooler URL works) |
| `ADMIN_PASSWORD` | Password for `/admin/login` |

### 3. Database setup

Run migrations and seed default invitation data:

```bash
bun run db:migrate:wishes
bun run db:migrate:content-en
bun run db:migrate:guest-count
bun run db:migrate:rls
bun run db:seed
```

Test the database connection:

```bash
bun run db:connect
```

### 4. Run the dev server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) for the invitation and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:seed` | Seed default invitation row |
| `bun run db:migrate:rls` | Enable Supabase RLS policies |
| `bun run db:studio` | Open Drizzle Studio |

## Project structure

```
app/              # Next.js pages (public + admin)
components/       # UI primitives, sections, admin components
db/               # Drizzle schema and client
lib/              # Invitation data, auth, i18n, server actions
scripts/          # Database migration and seed scripts
public/uploads/   # Hero and gallery images (gitignored contents)
```

## Admin

1. Go to `/admin/login`
2. Enter `ADMIN_PASSWORD` from `.env.local`
3. Edit invitation content in **Bahasa Melayu** and **English**
4. Upload hero and gallery images
5. View RSVP responses at `/admin/rsvps`

## Security notes

- Keep `DATABASE_URL` and `ADMIN_PASSWORD` secret — server-side only
- RLS is enabled on `invitation` and `rsvp_responses` for Supabase PostgREST access
- The Next.js app connects with the postgres role and bypasses RLS for admin operations

## Deploy

Works on [Vercel](https://vercel.com) or any Node.js host. Set `DATABASE_URL` and `ADMIN_PASSWORD` in your deployment environment. For image uploads, ensure `public/uploads/` is writable or move to object storage for production.

```bash
bun run build
bun run start
```
