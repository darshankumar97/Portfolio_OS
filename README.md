# DevOS

Premium engineering portfolio platform for **Darshan Kumar K R**, built as a macOS-style desktop
experience with a full Admin Panel behind it — every piece of content, media, and site setting is
editable from `/admin` with no code or JSON changes required.

**Domain:** [darshankumar.me](https://darshankumar.me)

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Prisma 7 (`@prisma/adapter-pg`) + Supabase Postgres — content database
- Supabase Storage — media (images, video, resume PDFs)
- Custom JWT session auth (`jose` + `bcryptjs`) — single-admin login, no third-party auth provider

## Architecture

- `src/content/*.json` — **removed.** Content used to live here; it now lives in Postgres and is
  managed entirely through `/admin`.
- `src/lib/content.ts` — the public read layer. Async, DB-backed, cached with Next.js
  `unstable_cache` + tags; every collection (`getProjects`, `getExperience`, etc.) filters to
  `published` rows unless Draft Mode is active (see below).
- `src/lib/admin/` — the admin write layer: `actions/*.ts` (one file per entity, Next.js Server
  Actions with Zod validation + `revalidateTag`), `queries.ts` (unfiltered, uncached reads for the
  admin UI), `schemas.ts` (shared Zod schemas used by both server actions and client forms).
- `src/components/os/**` + `src/lib/os/**` — the DevOS desktop shell (window manager, dock, menu
  bar, spotlight, and apps: Finder, Notes, Terminal, Mail, Preview, Safari, Settings). Not yet
  wired in as the homepage — `src/app/(site)/page.tsx` still renders the classic scrolling layout.
  Client-side OS apps get their data through `OSContentProvider`
  (`src/lib/os/content-context.tsx`), not by calling `content.ts` directly (Prisma can't run in the
  browser).
- `src/app/admin/**` — the Admin Panel. `(dashboard)` route group holds the authenticated shell
  (sidebar + topbar); `login/` is the standalone sign-in page. Every collection has a drag-to-reorder
  list + drawer form (CRUD, publish/unpublish, delete); Profile and Site Settings are singleton
  forms; Media Library and Appearance (wallpapers/accents) are their own dedicated pages.
- Draft/publish model: every collection row has a `published` boolean. The public site only shows
  published rows unless the admin turns on **Preview site** (top-right of `/admin`), which flips
  Next.js Draft Mode and shows a "previewing drafts" banner on the live site.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up Supabase**

   Create a free project at [supabase.com](https://supabase.com), then from the dashboard grab:
   - **Settings → Database** — the pooled connection string (port 6543) and the direct connection
     string (port 5432)
   - **Settings → API** — the project URL and the `service_role` key
   - **Storage** — create a public bucket (default name expected: `devos-media`)

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in real values:

   ```bash
   cp .env.example .env
   ```

   | Variable | Purpose |
   |---|---|
   | `DATABASE_URL` | Pooled Postgres connection (Supavisor, port 6543) — used by the app at runtime |
   | `DIRECT_URL` | Direct Postgres connection (port 5432) — used only by `prisma migrate` |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used for Storage uploads |
   | `SUPABASE_STORAGE_BUCKET` | Storage bucket name (defaults to `devos-media`) |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded as the one admin account (hashed on insert) |
   | `SESSION_SECRET` | Long random string used to sign admin session JWTs |

4. **Run migrations and seed initial content**

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

   The seed script creates the admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD` and a starter
   wallpaper/accent catalog. Project/experience/research/etc. content is added through `/admin`
   from here on.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the public site and
   [http://localhost:3000/admin](http://localhost:3000/admin/login) for the Admin Panel.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build (runs `prisma generate` via `postinstall`)
- `npm run start` — production server
- `npm run lint` — ESLint
- `npx prisma migrate dev` — apply schema migrations
- `npx prisma db seed` — seed the admin user + appearance catalog
- `npx prisma studio` — browse/edit the database directly (debugging only — use `/admin` day to day)

## Project status

**Done:** database schema + migrations, Prisma/Supabase data layer, admin auth (JWT session,
middleware-protected `/admin/**`), Draft Mode preview, full CRUD admin for Projects, Experience,
Research, Skills, Services, Social Links, Navigation, Profile, Site Settings/SEO, Media Library
(Supabase Storage upload + reusable picker), and Appearance (wallpaper/accent catalogs).

**Not yet done:**
- Education, Certifications, Achievements, Testimonials — schema exists, admin CRUD + public
  display sections don't yet.
- Blog/writing — schema exists (`BlogPost`), no admin UI or public `/blog` routes yet.
- DevOS desktop shell isn't wired in as the homepage yet (classic scroll layout is still what
  visitors see); the plan is DevOS on capable screens with the classic layout as the small-screen
  fallback.
- Spotlight search currently only queries build-time OS context, not a live/full-text search.
- Production hardening pass: broader loading/error states in the admin, login rate-limiting.

None of the above has been run against a live database yet — verification is blocked on a local
Postgres (Docker) or real Supabase credentials.
