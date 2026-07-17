# DevOS

Premium engineering portfolio platform for **Darshan Kumar K R**.

**Domain:** [darshankumar.me](https://darshankumar.me)

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content architecture

All portfolio content lives in `src/content/` as JSON files:

| File | Purpose |
|------|---------|
| `site.json` | Site metadata, SEO, domain config |
| `profile.json` | Owner info, bio, audiences |
| `experience.json` | Work history |
| `projects.json` | Project case studies |
| `research.json` | Research & publications |
| `skills.json` | Technical capabilities |
| `services.json` | Freelance offerings |
| `social.json` | Social & contact links |
| `navigation.json` | Header navigation |

Update JSON files to change site content — no code changes required.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

## Phase 1

This is Phase 1 of DevOS — foundation, design system, content architecture, and core pages.
