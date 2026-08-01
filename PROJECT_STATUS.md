1# DevOS — Project Status & Implementation Roadmap

This file is the single source of truth for **where this project stands and what to do next**.
It's written so that either you or a future Claude Code session can pick this up cold and keep
going without re-deriving decisions that have already been made. `README.md` covers setup
commands; this file covers the *why*, the *what's done*, and the *what's left*, in detail.

> **Database migrated to Neon, Storage migrated to Vercel Blob (2026-08-01).** Supabase has been
> removed from this project entirely — no Supabase Postgres, Storage, Auth, or `@supabase/supabase-js`
> dependency remains. Sections below that describe a Supabase-based local dev stack, the
> WebSocket-polyfill workaround, or Supabase Storage as current architecture are **historical** —
> kept for the war-stories/lessons-learned value, not because they reflect the live setup.

---

## 1. What DevOS is

DevOS is Darshan Kumar K R's engineering portfolio, built as two things layered on top of one
shared content database:

1. **A macOS-style desktop shell** ("DevOS") — a window manager, dock, menu bar, and Spotlight
   search, with content shown inside "apps" (Finder for projects, Notes for the about/bio, Mail
   for contact, Preview for the resume, Safari for research, Terminal for a fun CLI, Settings for
   theme/wallpaper). This is the premium, memorable, portfolio-as-product experience.
2. **A classic scrolling site** (Hero → About → Experience → Projects → Research → Skills →
   Services → Contact) — the fallback for small screens/touch devices where window management
   doesn't make sense.
3. **An Admin Panel** (`/admin`) that is the single source of truth for *everything* shown in
   both experiences above — profile, projects, experience, research, skills, services, social
   links, navigation, site SEO settings, media, and the wallpaper/accent catalog. The goal stated
   up front: **never touch code or JSON to update the site again.**

Today, (1) and (2) both exist in the codebase, but only (2) is actually wired up as the live
homepage — see [Phase 3](#phase-3--wire-devos-as-the-homepage) for why and what's needed to flip
that. (3) is fully built and is the main achievement of this work session.

---

## 2. Architecture overview

### Stack
- **Next.js 15** (App Router, React 19, TypeScript, Tailwind v4, Framer Motion) — unchanged from
  the original project.
- **Prisma 7** (`@prisma/adapter-pg` driver adapter) talking to **Neon Postgres**. Prisma
  7 changed how datasources work: connection URLs live in `prisma.config.ts` / are passed to the
  `PrismaClient` constructor via an adapter, *not* in `schema.prisma`'s `datasource` block anymore.
  (Originally Supabase Postgres — migrated to Neon; see the "Database migrated to Neon, Storage
  migrated to Vercel Blob" note further down for why both moves happened.)
- **Vercel Blob** — holds every uploaded image/video/PDF. A `MediaAsset` table in
  Postgres tracks metadata (url, type, filename, size) independent of what references it, which is
  what makes the Media Library page possible. (Originally Supabase Storage — migrated once Postgres
  moved to Neon, since bundling Storage with Supabase no longer had a Postgres dependency to justify it.)
- **Custom JWT auth** (`jose` for signing/verifying, `bcryptjs` for password hashing) — new. No
  NextAuth/Clerk/Supabase Auth — this is a single-admin tool, so a minimal hand-rolled session is
  less code and less to reason about than pulling in a general-purpose auth library.

### Folder map (everything new this session, relative to `src/`)

```
app/
  layout.tsx                     — minimal root shell (fonts, <html>/<body>, generateMetadata)
  (site)/                        — route group: the public marketing site
    layout.tsx                   — Header/Footer/JSON-LD (moved out of root layout.tsx)
    page.tsx                     — homepage (classic scroll sections)
    not-found.tsx                — styled 404 with full site chrome
    projects/[slug]/page.tsx     — project detail page
  admin/
    login/page.tsx               — standalone login (no sidebar chrome)
    (dashboard)/                 — route group: everything behind auth + sidebar
      layout.tsx                 — sidebar + topbar (Preview toggle, logout, view site)
      page.tsx                   — dashboard overview (counts, quick links)
      profile/page.tsx
      projects/page.tsx
      experience/page.tsx
      research/page.tsx
      skills/page.tsx
      services/page.tsx
      social/page.tsx
      navigation/page.tsx
      media/page.tsx
      appearance/page.tsx
      settings/page.tsx          — Site Settings/SEO + resume upload
  api/admin/
    login/route.ts, logout/route.ts
    preview/enable/route.ts, preview/disable/route.ts  — Next.js Draft Mode toggle
  not-found.tsx                  — minimal fallback 404 (routes outside (site) group)
  sitemap.ts, robots.ts, opengraph-image.tsx  — now read from DB (async)

middleware.ts                    — protects /admin/** and /api/admin/** (except login/logout)

components/
  admin/                         — every admin-only UI primitive and per-entity component
    AdminSidebar.tsx, AdminPageHeader.tsx, AdminIcon.tsx
    Drawer.tsx                   — slide-over panel used for every create/edit form
    DndListContainer.tsx, SortableRow.tsx   — drag-to-reorder (@dnd-kit)
    PublishSwitch.tsx, RowActions.tsx        — publish toggle, edit/delete-with-confirm
    FormField.tsx, TagListInput.tsx, KeyValueListInput.tsx   — shared form controls
    ErrorBanner.tsx, EmptyState.tsx
    LoginForm.tsx, LogoutButton.tsx, PreviewToggle.tsx
    media/MediaPicker.tsx, MediaLibraryClient.tsx
    projects/, experience/, research/, skills/, services/, social/, navigation/,
    profile/, settings/, appearance/   — one Form + one Client component per entity
  os/, sections/, layout/, ui/, motion/   — pre-existing, mostly unchanged (see below for what did change)

lib/
  db.ts                          — Prisma client singleton (pg pool adapter, hot-reload safe)
  content.ts                     — REWRITTEN: async, DB-backed, cached, publish-filtered
  cache-tags.ts                  — one cache tag per entity, shared between content.ts and actions
  enum-map.ts                    — dash-case (app) <-> underscore-case (DB enum) conversion
  seo.ts                          — createMetadata() is now async
  auth/
    session.ts                   — JWT sign/verify, cookie config
    current-user.ts              — reads+verifies the session cookie server-side
  admin/
    guard.ts                     — requireAdmin() — defense-in-depth check inside every action
    action-result.ts             — shared { ok: true, data } | { ok: false, error } type
    schemas.ts                   — every Zod schema, shared between actions and client forms
    queries.ts                   — unfiltered, uncached admin list queries (one per entity)
    actions/                     — one file per entity, all Next.js Server Actions
      projects.ts, experience.ts, research.ts, skills.ts, services.ts, social.ts,
      navigation.ts, profile.ts, site-settings.ts, appearance.ts, media.ts
  os/
    content-context.tsx          — OSContentProvider/useOSContent (new)
    window-manager.tsx, settings-store.tsx, apps.tsx   — pre-existing, unchanged

types/content.ts                 — extended (ProjectMetric, ProjectGalleryItem, Wallpaper, Accent,
                                     Education, Certification, Achievement, Testimonial, BlogPost
                                     types added; ProjectCategory/Status/ExperienceType/ResearchType
                                     pulled out as named exports)

prisma/
  schema.prisma                  — the whole data model
  seed.ts                        — migrates old src/content/*.json into the DB (one-time, idempotent)
```

`src/content/*.json` still exists on disk but is **dead** — nothing imports it anymore. Safe to
delete once you've confirmed the seed ran successfully (the seed script reads these files once to
populate the DB, then they're no longer referenced by any code path).

### Data flow, end to end

**Public page render:** `page.tsx` (or any section component) calls an `async` function from
`src/lib/content.ts`, e.g. `getProjects()`. That function reads from an `unstable_cache`-wrapped
Prisma query (tagged e.g. `"projects"`), then filters the result to `published: true` rows unless
Draft Mode is on, then converts DB enum values (`open_source`) back to the app-facing hyphenated
form (`open-source`) via `dbEnumToApp`.

**Admin edit:** An admin page (e.g. `projects/page.tsx`) is a Server Component that calls
`listProjectsAdmin()` from `src/lib/admin/queries.ts` — this is a *separate, unfiltered, uncached*
read path (drafts must be visible to the admin; the admin always needs the freshest row right
after a save). It renders `<ProjectsClient initialProjects={...} />`, a Client Component that holds
the list in local state and renders it through the shared `DndListContainer` / `SortableRow` /
`PublishSwitch` / `RowActions` primitives. Create/edit opens `<Drawer>` with a per-entity `<XForm>`
(react-hook-form + zodResolver). Every mutation calls a Server Action from
`src/lib/admin/actions/*.ts`, which validates with Zod, writes via Prisma, calls
`revalidateTag(CACHE_TAGS.x)` to bust the public cache, and returns `{ ok: true, data }` or
`{ ok: false, error }`. The client component applies the result optimistically to its local state
— **no `router.refresh()` anywhere in the CRUD flow**, which is what makes the admin feel instant
rather than round-tripping a full page reload on every click.

**Media:** `MediaPicker` (used inside every form that needs an image/file — project cover/gallery,
avatar, resume, OG image, wallpaper image) opens a `Drawer` that lists existing `MediaAsset` rows
(via the `listMediaAdmin` action) and lets you upload a new file. Upload goes straight through a
Server Action (`uploadMedia`, which accepts `FormData` with a `File` — Next.js Server Actions
support this natively), which calls `put()` from `@vercel/blob` and records a `MediaAsset` row.
`next.config.mjs` allow-lists the Vercel Blob storage domain for `next/image` and raises the Server
Actions body size limit to 25MB (default is 1MB, far too small for images/video).

**Auth:** `/api/admin/login` checks email+bcrypt-compare against the single `AdminUser` row, signs
a JWT (`jose`, `HS256`, 7-day expiry) with `SESSION_SECRET`, sets it as an httpOnly cookie.
`middleware.ts` (Edge runtime — this is why `jose` was chosen over something needing Node APIs)
verifies that cookie on every request to `/admin/**` and `/api/admin/**` except the login/logout
routes themselves, redirecting to `/admin/login` (or returning 401 for API routes) if missing or
invalid. Every Server Action *also* calls `requireAdmin()` itself as defense-in-depth, in case a
routing change ever weakens the middleware matcher.

**Draft Mode / preview:** Every collection row has `published: boolean`. Public reads filter to
`published: true` unless Next.js's built-in Draft Mode is enabled for the current request (checked
via `draftMode()` from `next/headers` inside `content.ts`). The "Preview site" button in the admin
topbar hits `/api/admin/preview/enable` (sets Next's draft-mode bypass cookie), and the public
`(site)` layout shows a banner when it detects draft mode is on. This gives "preview before
publish" without building a parallel content-versioning system.

### Key decisions and why (so you don't re-litigate them)

- **Supabase was originally chosen over Vercel Postgres/Blob** because it bundled Postgres + Storage
  in one dashboard/account — fewer moving parts for a single-admin CMS. That rationale no longer
  applies: Postgres moved to Neon and Storage moved to Vercel Blob (2026-08-01), so the project now
  has zero Supabase dependency. Prisma's schema-as-code migrations and type safety are still why
  Prisma is used for data access rather than a provider-specific client.
- **Custom auth over NextAuth/Supabase Auth** because there is exactly one user. A general-purpose
  multi-provider auth system would be pure overhead here.
- **`published: boolean` over a full draft/live dual-copy versioning system** because item-level
  publish state (hide a project until it's ready) covers the overwhelming majority of real use —
  full field-level revision history for a solo-maintained portfolio wasn't judged worth the
  complexity. Next.js Draft Mode fills the remaining gap (preview a specific edit before it goes
  live) without needing to build that versioning system.
- **Shared primitives, not a generic `<AdminCollectionList>` framework.** The list chrome (drag
  reorder, publish toggle, delete-with-confirm, drawer shell) is identical across all 7 collection
  types and is factored into `DndListContainer`/`SortableRow`/`PublishSwitch`/`RowActions`/`Drawer`.
  The *form fields* are not generalized — a Project form and a SkillCategory form have nothing in
  common — each entity gets its own `<XForm>` component built from shared field-level controls
  (`FormField`, `TagListInput`, `KeyValueListInput`, `MediaPicker`). This avoids both "7 diverging
  copy-pasted CRUD pages" and "one over-abstracted schema-driven form renderer that fights every
  entity's actual shape."
- **`{ ok: true, data } | { ok: false, error }` action result type**, not `{ data?, error? }`.
  TypeScript can't reliably narrow a union on the truthiness of an optional `string` (an empty
  string is falsy but still "present"), so every action result needs an explicit boolean
  discriminant. This is in `src/lib/admin/action-result.ts` — reuse `ok()`/`fail()` from there for
  any new action file.
- **Zod schemas live outside the `"use server"` action files** (`src/lib/admin/schemas.ts`), not
  inside them. A file with `"use server"` at the top may only export async functions — exporting a
  Zod schema object from it is a build error. Schemas are shared between the server action (which
  validates on write) and the client form's `zodResolver` (which validates on submit).
- **Enum values stay hyphenated in the app layer** (`"open-source"`, `"in-progress"`,
  `"full-time"`) even though Postgres enums can't contain hyphens (stored as `open_source`, etc.).
  `src/lib/enum-map.ts`'s `dbEnumToApp`/`appEnumToDb` convert at the boundary (inside `content.ts`
  reads and inside each action's writes) specifically so that **zero existing UI components had to
  change** their `project.category === "open-source"` comparisons.

---

## 3. Current status — detailed

### ✅ Fully built (Phase 0 + Phase 1)

| Area | What exists |
|---|---|
| Database | Full Prisma schema: `Profile`, `SiteSettings`, `AdminUser` (singletons); `Project`, `Experience`, `Research`, `SkillCategory`, `Service`, `SocialLink`, `NavigationItem` (ordered, published collections); `MediaAsset`, `Wallpaper`, `Accent`; **and** `Education`, `Certification`, `Achievement`, `Testimonial`, `BlogPost` (schema exists, no admin UI yet — see Phase 2) |
| Seed | `prisma/seed.ts` migrates every existing `src/content/*.json` row into the DB, creates the admin user from env vars, seeds a default wallpaper/accent catalog. Idempotent — safe to re-run. |
| Content layer | `src/lib/content.ts` fully async, cached, publish-aware |
| Auth | Login page, session cookie, middleware protection, logout — all working |
| Admin shell | Sidebar nav, topbar (email, Preview toggle, View site, Sign out), dashboard overview with counts |
| Projects CRUD | Full form: slug/title/tagline/description/problem/solution, impact + technologies (tag inputs), category/status selects, cover image + gallery (MediaPicker), links, metrics (key-value list), featured + published |
| Experience CRUD | company/role/period/location/type, description, achievements + technologies, featured + published |
| Research CRUD | title/venue/year/type, abstract, authors + tags, links (pdf/doi/arxiv/slides), featured + published |
| Skills CRUD | Category name + nested skill list (name + level dropdown per skill) |
| Services CRUD | title/description/deliverables |
| Social Links CRUD | label/url/icon |
| Navigation CRUD | label/href |
| Profile (singleton) | name/title/headline/subheadline/location/email/availability/bio, avatar (MediaPicker), highlights (key-value), audiences (repeatable title+description) |
| Site Settings (singleton) | name/tagline/domain/url/description/keywords, locale, OG image, **resume PDF upload** |
| Media Library | Grid view, upload, delete, copy-URL; `MediaPicker` reused everywhere an image/file is needed |
| Appearance | Wallpaper catalog (label, image or CSS gradient, default flag) and accent color catalog (label, hex value, default flag), both drag-reorderable |
| Draft Mode / Preview | Working end-to-end: toggle in admin, banner on public site, publish-filtering respects it |

### ⚠️ Not yet verified

Everything above **type-checks and lints clean** (`npx tsc --noEmit`, `npx next lint` — both pass
with zero errors as of this writing) but **has never actually been run.** No migration has been
applied, no data has been seeded, no page has been rendered, no form has been submitted. This is
the immediate next step before anything else — see [Section 4](#4-verification-blocker).

### ✅ Fully built (Phase 2a + 2b — extended content types)

| Area | What exists |
|---|---|
| Education CRUD | institution/degree/field/period/location/description, published, drag-reorder |
| Certifications CRUD | name/issuer/issueDate/credentialUrl, published, drag-reorder |
| Achievements CRUD | title/description/date, published, drag-reorder |
| Testimonials CRUD | name/role/company/quote/avatar (MediaPicker), published, drag-reorder |
| Blog CRUD | slug/title/excerpt/tags, write-here (markdown) **or** link-out toggle, cover image, publishedAt date, published, drag-reorder |
| Public sections | `Education`, `Certifications`, `Achievements`, `Testimonials` sections added to `src/app/(site)/page.tsx` (each returns `null` if empty, so nothing renders until the admin adds content) |
| Public blog routes | `/blog` (list, cards link out for external posts) and `/blog/[slug]` (renders markdown via `react-markdown`, redirects to `externalUrl` if visited directly on a link-out post); added to `sitemap.ts` |
| Admin | Sidebar nav + dashboard counts extended for all 5 new entities; 5 new `AdminIconName` icons added |

All type-checks and lints clean (same unverified-at-runtime caveat as Phase 0/1 — see
[Section 4](#4-verification-blocker), which is still unresolved: Node 20.19.6, Docker Desktop not
running, `.env` still has placeholder Supabase credentials as of this writing).

Note: unlike Phase 0/1, these 5 entities have **no legacy JSON to seed from** — `prisma/seed.ts` was
intentionally left unchanged. Once the DB is connected, populate them by hand through the admin UI.

### ❌ Not built yet

See [Phase 3](#phase-3--wire-devos-as-the-homepage), [Phase 4](#phase-4--production-hardening)
below.

---

## 4. Verification — DONE (2026-07-21)

**Status: environment fully stood up and verified end-to-end.** Local Supabase stack running, DB
migrated + seeded, dev server boots clean, admin auth / CRUD / media / draft-mode all confirmed
working against the real local Postgres + Storage. Three real bugs were found and fixed along the
way — **all three will also bite in any fresh clone / CI / production deploy**, not just this
machine, so don't skip them:

1. **`@supabase/supabase-js` crashes on Node 20.** `createClient()` unconditionally constructs a
   `RealtimeClient`, which requires a native `WebSocket` global — only available from Node 22+. This
   project's documented runtime is Node 20.19.6, so *any* code path touching `supabaseAdmin` (i.e.
   every media upload) would throw `Node.js detected but native WebSocket not found`. Fixed in
   `src/lib/supabase.ts` with a `ws`-package polyfill (`ws` + `@types/ws` added to `package.json`)
   guarded by `typeof globalThis.WebSocket === "undefined"`. The app never uses Supabase Realtime, so
   this is a safe, permanent fix, not a workaround to revisit — keep it.
2. **A stray `NODE_ENV=production` User environment variable on this Windows machine broke `next
   dev`.** Next's webpack CSS pipeline branches on `isProduction` in several places
   (`getGlobalCssLoader` selection, `MiniCssExtractPlugin` wiring, etc.); with `NODE_ENV` forced to
   `production` outside Next's own control, `next dev` produced a webpack config with no CSS loader
   applied to `globals.css` at all — surfaced as `Module parse failed: Unexpected character '@'` for
   the `@import "tailwindcss";` line, plus a red-herring `.next/required-server-files.json` ENOENT.
   Fix: run dev commands with `NODE_ENV` unset or explicitly `development`
   (`unset NODE_ENV && export NODE_ENV=development` before `npm run dev`, or fix the machine's User
   env var directly — Claude Code can't remove a User-level env var itself). This is a machine
   config issue, not a repo bug, but every future session on this machine needs to know about it.
3. **`npm install`/`npm ci` silently drop `tailwindcss` / `@tailwindcss/postcss` / `lightningcss` on
   this machine.** Verbose logging showed npm reporting a clean, error-free install while these
   specific native-binary packages vanished from `node_modules` immediately after — reproduced 5+
   times including a full lockfile regen. Root cause not conclusively identified (leading theory:
   corporate EDR/AV quarantining `.node` binaries written by `node.exe`, since a plain file copy of
   the same binary survived fine). Workaround: use **pnpm** instead of npm for installs on this
   machine, with `node-linker=hoisted` in `.npmrc` (flat, npm-style `node_modules` — needed because
   Next's PostCSS config loader also assumes `postcss` itself is hoisted to the project root, which
   pnpm's default strict/symlinked linking does not do — also had to add `postcss` as an explicit
   devDependency for the same reason). If this machine's AV/EDR gets an exclusion added for the repo
   folder, npm should be revisited, but there's no urgency — pnpm works fine long-term.

None of these three are fixed by re-running the same command — if you hit `Module parse failed`,
`Node.js detected but native WebSocket not found`, or vanishing `node_modules/@tailwindcss/*` again,
this section already has the fix.

### What was actually verified (via direct HTTP / Server-Action calls + DB checks — no browser
available this session, so nothing visual/interactive like drag-reorder or on-screen forms was
confirmed; see the note at the end of this section)

- **Supabase stack**: `npx supabase start --ignore-health-check` (plain `supabase start` reliably
  timed out tearing down `storage-api`/`pg-meta` before their migrations finished — this flag lets
  the CLI exit without killing containers still mid-migration; containers self-report healthy soon
  after). Local API `http://127.0.0.1:54321`, DB `postgresql://postgres:postgres@127.0.0.1:54322/postgres`.
- **Migration + seed**: `npx prisma migrate dev` + `npx prisma db seed` against the local stack — one
  legacy project, one admin user, five wallpapers landed correctly.
- **Dev server**: boots clean, homepage renders real DB content (`<title>Darshan Kumar K R —
  Software Engineer</title>`, profile bio, etc.).
- **Admin auth**: login sets a valid 7-day JWT cookie; `/admin` redirects unauthenticated requests to
  `/admin/login`; unauthenticated `/api/admin/**` returns 401; both middleware and each action's own
  `requireAdmin()` defense-in-depth confirmed (a hand-crafted unauthenticated action call created zero
  rows).
- **CRUD**: exercised the real Server Action HTTP wire protocol directly (extracting action IDs from
  `.next/server/server-reference-manifest.json`, POSTing to the page URL with a `Next-Action` header)
  for `createProject`/`updateProject`/`toggleProjectPublished`/`deleteProject` and
  `createService`/`deleteService`, verifying each DB write directly via `psql`. Every entity shares
  the same action-file/schema/query pattern (see Section 8), so this is representative, not
  exhaustive — the untested entities are structurally identical.
- **Media / Storage**: `uploadMedia`'s FormData wire format could **not** be hand-constructed via
  curl (React Server Actions encode FormData/File arguments in a binary reply protocol generated by
  React's client runtime, not something meant to be reverse-engineered) — confirmed this by seeing
  every attempt fail inside Next's own busboy parser *before* our action code ever ran (a debug
  `console.log` placed at the top of `uploadMedia` never printed). Instead, verified the two things
  that actually mattered — the bug above (Storage client construction crashing) and that Storage
  itself works — with a standalone Node script calling `supabaseAdmin.storage.from(...).upload(...)`
  directly: succeeded, returned a real object key in the `devos-media` bucket.
- **Draft Mode / preview**: created an unpublished project, confirmed it's absent from the public
  homepage HTML, enabled Draft Mode (`/api/admin/preview/enable`, capturing the
  `__prerender_bypass` cookie), confirmed the same project *is* present when requesting with that
  cookie plus a visible preview banner, then disabled preview. `revalidateTag` cache invalidation
  confirmed working (new/updated rows show up immediately, no stale cache).
- **Public site plumbing**: `sitemap.xml`, `robots.txt` (reads domain from DB `SiteSettings`),
  `opengraph-image` (real PNG, 200), unknown routes and unknown project slugs correctly 404, `/blog`
  renders without crashing despite being empty.

### What still needs a real browser (not done this session)

Drag-to-reorder, the Media Library UI / resume upload UI specifically (only the underlying Storage
client was verified, not the actual upload button), appearance/wallpaper picker preview, keyboard
navigation, focus management, screen-reader/ARIA pass, and general responsive/visual QA. Claude Code
had no browser tool available this session (`claude-in-chrome` extension was declined mid-setup) —
either finish installing it (`/chrome` completes the connection next session) or click through
these by hand. The dev server convention on this machine going forward:
```bash
unset NODE_ENV && export NODE_ENV=development && npm run dev
```

What's in flight below is kept for historical reference only — it predates the fixes above:

### What's been done so far

1. Started a bare `devos-postgres` container on port 55432 — **then removed it** (`docker rm -f
   devos-postgres`) in favor of a fuller approach: the Supabase CLI's local dev stack
   (`npx supabase init` + `npx supabase start`), which runs Postgres **and** a real Storage API in
   Docker, so Media Library / resume upload can be verified against real Supabase Storage semantics
   instead of being skipped.
2. `npx supabase init` ran, creating `supabase/config.toml`. Edited it to:
   - Disable services this app doesn't use: `[auth]`, `[realtime]`, `[edge_runtime]`, `[analytics]`
     all set `enabled = false` (faster startup, fewer containers).
   - Declare the storage bucket the app expects: `[storage.buckets.devos-media]` with
     `public = true`, `file_size_limit = "20MiB"` (matches `SUPABASE_STORAGE_BUCKET` in `.env` and
     the 20MB cap in `src/lib/admin/actions/media.ts`).
3. `next.config.mjs` — added a second `remotePatterns` entry, `{ protocol: "http", hostname:
   "127.0.0.1", pathname: "/storage/v1/object/public/**" }`, alongside the existing `*.supabase.co`
   one, so `next/image` will load from local Supabase Storage too.
4. `.env` updated with working local dev values:
   - `ADMIN_EMAIL="darshan.r.in@rupeek.com"`, `ADMIN_PASSWORD="DevOS-Verify-2026!"`,
     `SESSION_SECRET` set to a fixed dev string.
   - **`DATABASE_URL`/`DIRECT_URL` are STALE** — they still point at
     `postgresql://devos:devos_local_pw@localhost:55432/devos`, i.e. the standalone container from
     step 1 that no longer exists. Once `supabase start` finishes, these must be replaced with the
     Supabase-managed Postgres connection string (default `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
     per `supabase/config.toml`'s `[db] port = 54322` — confirm with `npx supabase status`).
   - `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are still the original cloud
     placeholders and also need replacing with the local stack's API URL (default
     `http://127.0.0.1:54321`) and local `service_role` key, both printed by `npx supabase status`.
5. A Prisma migration was generated and applied — `prisma/migrations/20260721034659_init/` — but it
   was applied **against the now-deleted standalone container**, so that migration folder exists on
   disk but no live database currently reflects it. `npx prisma migrate dev` needs to be re-run
   against the new Supabase-managed Postgres once `.env` is pointed at it (this is a fresh empty DB,
   so this is a clean re-apply, not a conflict).
6. `npx supabase start` was kicked off in the background and left running unattended for several
   minutes with **no output yet** and no `supabase_*` containers showing in `docker ps` — process
   list showed `supabase.exe`/`supabase-go.exe` still alive, so it hadn't crashed, but it also hadn't
   visibly progressed. This machine already has a large amount of unrelated Docker state running
   (several other projects' containers, an 8GB `ollama` image, etc.) which may be slowing image
   pulls. **First step on resume: check whether that process is still running or has stalled/died,
   and if stalled, kill it and retry** (`docker ps -a --filter name=supabase`, check for a hung
   image pull with `docker system df` / `docker events`).

### Resuming from here — exact next steps

```bash
# 1. Confirm/retry the local Supabase stack
npx supabase status                 # or `npx supabase start` again if step 6 above never finished
npx supabase status                 # once up, copy the API URL + anon/service_role keys

# 2. Fix .env: DATABASE_URL, DIRECT_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
#    (see "stale" notes above for exact defaults)

# 3. Apply schema + seed
npx prisma migrate dev
npx prisma db seed          # migrates old JSON content in + creates admin user + appearance catalog

# 4. Run the app
npm run dev
```

Then work through the full verification checklist the user specified: admin auth, every CRUD
operation (including the 5 new Phase 2 entities), drag-and-drop ordering, publish/draft workflow,
media uploads, resume upload, appearance/wallpaper management, navigation management, SEO settings,
blog CRUD + rendering, public site rendering from the DB, Spotlight search, homepage, mobile
responsiveness, keyboard navigation, accessibility, error handling, empty states, and loading
states — fixing anything broken immediately, before moving on to the production-polish audit
(dead code, duplication, performance, bundle size, animation/spacing/UX consistency) the user also
asked for. None of that has started yet.

---

## 5. Phase 2 — extended content types

**✅ Done.** Kept below as a record of the pattern followed — see Section 3 above for what actually
landed.

Goal: cover the remaining content types from the original requirement list that don't have admin
UI yet, following the *exact* established pattern (look at `src/lib/admin/actions/services.ts` and
`src/components/admin/services/*` — Service is the simplest existing entity and the closest
template for these).

### 5a. Education, Certifications, Achievements, Testimonials

The Prisma models already exist (`Education`, `Certification`, `Achievement`, `Testimonial`) with
`order`/`published` fields. For each one:

1. Add a Zod schema to `src/lib/admin/schemas.ts` (mirror `serviceSchema`).
2. Add `src/lib/admin/actions/<entity>.ts` with `create/update/delete/togglePublished/reorder`
   (copy `services.ts`, rename).
3. Add `list<Entity>Admin()` to `src/lib/admin/queries.ts`.
4. Add `src/components/admin/<entity>/<Entity>Form.tsx` and `<Entity>Client.tsx` (copy
   `ServiceForm.tsx`/`ServicesClient.tsx`, adjust fields).
5. Add `src/app/admin/(dashboard)/<entity>/page.tsx`.
6. Add the nav entry to `NAV_GROUPS` in `src/components/admin/AdminSidebar.tsx`.
7. Add `get<Entity>()` (and `getFeatured<Entity>()` if it has a `featured` concept — these four
   don't currently) to `src/lib/content.ts`, same shape as `getServices()`.
8. Add a public section component under `src/components/sections/` (e.g. `Testimonials.tsx`,
   following `Services.tsx`'s structure — `FadeIn` + `SectionHeading` + a grid of `Card`s) and wire
   it into `src/app/(site)/page.tsx`.
9. Add the corresponding TS type fields if needed — `Education`, `Certification`, `Achievement`,
   `Testimonial` are already defined in `src/types/content.ts`.

Suggested field notes:
- **Education**: institution, degree, field (optional), period, location (optional), description
  (optional) — no `featured` concept, just an ordered list.
- **Certifications**: name, issuer, issueDate, credentialUrl (optional, link out) — consider a
  "Verify" external link button in the public section.
- **Achievements**: title, description (optional), date (optional) — simplest of the four.
- **Testimonials**: name, role, company (optional), quote, avatarUrl (MediaPicker, optional) — this
  one benefits from a carousel or masonry layout in the public section rather than a plain grid,
  given quotes vary a lot in length.

### 5b. Blog / writing

`BlogPost` model already exists: `slug`, `title`, `excerpt`, `content` (markdown, optional),
`externalUrl` (optional), `coverImage`, `tags`, `publishedAt`, `order`, `published`. Design intent:
each post is *either* a full in-app markdown post *or* a link out to something published elsewhere
(Medium, Substack, dev.to) — the admin picks one per post.

Steps:
1. Schema + actions + admin form/list page, same pattern as above. The form should let the admin
   toggle between "Write here" (shows a `content` textarea — render it with `react-markdown`,
   already installed but unused so far) and "Link out" (shows just the `externalUrl` field).
2. `getBlogPosts()`/`getBlogPostBySlug()` in `content.ts`.
3. Public routes: `src/app/(site)/blog/page.tsx` (list, card per post, links to `/blog/[slug]` for
   in-app posts or directly to `externalUrl` for linked-out posts) and
   `src/app/(site)/blog/[slug]/page.tsx` (renders `content` via `react-markdown`, `generateMetadata`
   per post, `generateStaticParams` like the existing `projects/[slug]/page.tsx`).
4. Add "Blog"/"Writing" to `src/content` navigation defaults and the admin sidebar.

---

## 6. Phase 3 — wire DevOS as the homepage

This is the highest-visual-impact remaining phase — it's the difference between "portfolio with a
neat Easter egg" and "portfolio that IS the desktop experience."

### 6a. Make Desktop the real homepage

Currently `src/app/(site)/page.tsx` renders the classic scroll sections directly, and
`Desktop`/`WindowManagerProvider`/`SettingsProvider`/`OSContentProvider` are never mounted anywhere
— confirmed dead code today. The plan (confirmed with the user): **DevOS is the default experience
on desktop/tablet; the classic scroll layout is the automatic small-screen/touch fallback.**

Suggested approach:
1. Fetch all the content `Desktop`'s apps need (profile, site, projects, experience, research,
   skills, services, social — the exact shape of `OSContent` in
   `src/lib/os/content-context.tsx`) in `src/app/(site)/page.tsx` (it's already a Server Component
   doing a `Promise.all` fetch for Hero — extend that).
2. Render both trees and pick with CSS, not JS-side rendering logic, to avoid a hydration flash:
   `<div className="hidden lg:block"><OSContentProvider>...<Desktop/></OSContentProvider></div>`
   and `<div className="lg:hidden">{/* existing scroll sections */}</div>`. Because
   `WindowManagerProvider`/`SettingsProvider` are React Context, wrap them around just the Desktop
   branch. Pick the breakpoint based on both viewport width *and* a coarse-pointer media query check
   (`(pointer: coarse)`) so a touch laptop doesn't get windows it can't comfortably drag — a
   `useMediaQuery`-style hook reading `matchMedia` at mount, defaulting to the scroll layout during
   SSR/first paint to avoid a flash of the wrong layout.
3. Update `SettingsApp.tsx` to read wallpapers/accents from `useOSContent()` (already fetched via
   `getWallpapers()`/`getAccents()` in `content.ts`) instead of the hardcoded `WALLPAPERS`/`ACCENTS`
   maps in `settings-store.tsx`. Keep `settings-store.tsx`'s localStorage persistence (that's
   correctly a per-visitor preference, not admin content) but have it validate the visitor's stored
   choice against the live catalog (in case an admin removed a wallpaper the visitor had selected).
4. Wire `themeInitScript()` (defined in `settings-store.tsx`, currently never called) into the
   Desktop branch's layout to avoid a light/dark flash on load, passing the live accent catalog in
   rather than the hardcoded `ACCENTS` map.

### 6b. Real Spotlight search

`Spotlight.tsx` already indexes projects/research/skills from `OSContent` — this mostly works once
6a is done. Consider also indexing Experience and Services, and highlighting matched text.

### 6c. Accessibility & keyboard pass

- `Window.tsx`: add `Escape` to close the focused window, focus trapping while a window is
  focused, and restore focus to the triggering dock icon on close.
- `Dock.tsx`/`AppIcon.tsx`: confirm keyboard-only users can open every app (currently relies on
  click/double-click for desktop icons in `Desktop.tsx` — add keyboard equivalents).
- Run an automated pass (axe or Lighthouse) once the Desktop is live and fix contrast/ARIA gaps.

---

## 7. Phase 4 — production hardening

- **Images**: `next.config.mjs` already allow-lists the Vercel Blob storage domain; double check every
  `<img>`/`<Image>` in the codebase actually uses `next/image` (the gallery preview in
  `ProjectForm.tsx` currently uses a raw `<img>` with an eslint-disable — fine for a small admin
  thumbnail, but revisit if it needs optimization).
- **SEO**: `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` already read from the DB — extend the
  sitemap to include `/blog/[slug]` once Phase 2b exists.
- **Admin polish**: loading skeletons for list pages (currently a blank moment while the server
  component fetches — acceptable today, but a skeleton would feel more premium), empty/error states
  are already in place via `EmptyState`/`ErrorBanner`, extend the same pattern to any new Phase 2
  pages.
- **Login rate-limiting**: `/api/admin/login` has no lockout after repeated failed attempts today.
  For a single-admin tool exposed to the internet, add a simple attempt counter (in-memory is fine
  given the low-traffic, single-instance nature of this deployment; a DB-backed counter is more
  robust if deployed across multiple serverless regions).
- **README**: keep it in sync as Phase 2/3/4 land — it documents the Neon/Vercel Blob/Prisma/admin
  architecture and the setup flow end to end.

---

## 8. Conventions to follow for any new work

- One action file per entity in `src/lib/admin/actions/`, always: `"use server"` at the top, import
  `ok`/`fail`/`ActionResult` from `action-result.ts`, `requireAdmin()` as the first line of every
  exported function, `revalidateTag(CACHE_TAGS.x)` after every write.
- One Zod schema per entity in `schemas.ts`, imported by both the action file and the client form —
  never redefine a schema inline in an action file (breaks the `"use server"` export-only-functions
  rule) or in a client form (drifts from the server's validation).
- One `<Entity>Form.tsx` (react-hook-form + `zodResolver`) and one `<Entity>Client.tsx` (local
  optimistic state, `DndListContainer` + `SortableRow` + `PublishSwitch` + `RowActions` +
  `Drawer`) per collection entity — copy the closest existing example rather than inventing a new
  shape.
- Singletons (Profile, Site Settings) skip the list/Drawer machinery entirely — just a form
  directly on the page with a "Saved" inline confirmation, see `ProfileForm.tsx`.
- Any new enum needs a corresponding entry check in `enum-map.ts` only if its values contain
  hyphens in the app-facing type; enums without hyphens (like skill `level`) don't need conversion.
- Never call `content.ts` functions from a Client Component — either fetch server-side and pass
  props down, make the component itself an `async` Server Component, or (for the OS apps
  specifically) add the data to `OSContent` and consume via `useOSContent()`.
