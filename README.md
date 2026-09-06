# Business Listing Management (BLM)

[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![TanStack](https://img.shields.io/badge/TanStack-Router%20%2B%20Query-FF4154)](https://tanstack.com/)

<p align="center">
  <img src="docs/banner.png" alt="BLM - Business Listing Management" width="100%" />
</p>

**Keep every location accurate across Google, Apple, Bing, and the directory network, from one workspace.**

Live demo:
- [https://businesslistingmanagement.co](https://businesslistingmanagement.co)

---

## Screenshots

| Home | Product |
|:---:|:---:|
| ![Home hero](docs/screenshots/home-hero.png) | ![Product](docs/screenshots/product.png) |

| How it works | Pricing |
|:---:|:---:|
| ![How it works](docs/screenshots/how-it-works.png) | ![Pricing](docs/screenshots/pricing.png) |

| Compare | Blog |
|:---:|:---:|
| ![Compare](docs/screenshots/compare.png) | ![Blog](docs/screenshots/blog.png) |

<p align="center">
  <img src="docs/screenshots/blog-post.png" alt="BLM blog post" width="90%" />
</p>

---

## Overview

**BLM (Business Listing Management)** is software for multi-location brands, franchises, agencies, and local SEO teams. It unifies **NAP** (name, address, phone), closes duplicates, scores directory coverage, and keeps Google Business Profile, Apple Maps / Apple Business Connect, Bing Places, Facebook, Yelp, and the wider directory network in lockstep.

The product site and app ship as one Vite + React codebase: marketing pages, compare guides, blog/CMS, auth, and the listing workspace.

---

## Why BLM

- **Canonical NAP, not a dozen logins.** One approved name, address, and phone per location. Every publisher is diffed against that string (suite, tracking number, DBA vs legal included).
- **Duplicates before reviews split.** Near-matches on phone, place, and name surface as risk, with a suggested surviving listing.
- **Hours that actually propagate.** Holiday hours and temporary closures are scored as health, not a footnote. Stale Apple or Bing hours matter as much as a wrong phone.
- **Coverage you can defend in a QBR.** See which publishers have the location, which are stale, and which never received it, as a score marketing and ops can share.
- **Workspaces for brands and agencies.** Create a workspace with a work email. No card required while billing is not live yet.

---

## Features

- **Listings sync and health** - NAP consistency, coverage map, and publisher-level diffs across maps and directories
- **Hours propagation** - holiday windows, temporary closures, and category hygiene scored alongside NAP
- **Duplicate radar** - near-match detection with a suggested survivor so reviews and photos are not orphaned
- **QBR-ready coverage** - directory coverage and risk you can put in a weekly digest or stakeholder review
- **Compare hub** - independent guides for teams evaluating listing software (including Yext and BrightLocal alternatives)
- **Workspaces** - signup, login, and multi-location workspace flows for brands, franchises, and agencies
- **Marketing and product in one app** - home, product, how-it-works, pricing, blog, resources, glossary, security, and demo booking

---

## Tech stack

Verified from `package.json`:

| Layer | Choice |
| --- | --- |
| UI | React 19, Tailwind CSS 4, Radix UI, Lucide |
| App framework | Vite 8, TanStack Start / Router / Query / Table |
| Language | TypeScript 5.7 |
| Auth | better-auth |
| Data | PostgreSQL (`pg`), Kysely, Supabase JS client, PGlite (local/edge cases) |
| Forms and validation | React Hook Form, Zod |
| Charts | Recharts |
| Deploy | Vercel (`vercel.json`) |
| Quality | ESLint, Prettier, Playwright, Node test runner |

---

## Getting started

**Requirements:** Node.js 20+ recommended.

```bash
git clone https://github.com/asmitc-source/blm.git
cd blm
npm install
```


### Scripts (from `package.json`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on `0.0.0.0:8080` |
| `npm run build` | Production build, then `db:migrate` |
| `npm run preview` | Preview the production build |
| `npm run db:migrate` | Run SQL migrations |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm test` | Script and library tests |
| `npm run check:auth` | Auth invariant checks |

Environment variables are loaded through `scripts/with-app-env.mjs` for `dev`, `build`, and `preview`. Configure your local env before starting the app.

---

## Project structure

```text
blm/
├── docs/
│   ├── banner.png
│   └── screenshots/          # README gallery
├── migrations/               # SQL migrations (auth, leads, trial, cms)
├── public/                   # favicon, robots, sitemap, OG assets
├── scripts/                  # env wrapper, migrate, smoke, brand checks
├── src/
│   ├── components/           # home, layout, auth, admin, UI primitives
│   ├── lib/                  # site copy, CMS, auth, SEO, auditor, DB
│   └── routes/               # file-based routes (marketing, blog, compare, app, api)
├── supabase/
├── package.json
├── vite.config.ts
└── vercel.json
```

---

## Roadmap

Honest near-term direction (no fake metrics):

- Harden listing desk workflows: import, NAP fingerprinting, publisher diffs, duplicate queues
- Expand directory coverage and hours/category monitoring
- Ship billing when plans go live (Starter / Growth listed pricing already on the site)
- Agency multi-account structure and role controls for Enterprise
- Keep compare guides and editorial content current for local SEO teams

---


## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and locally via `.env.local`; see `.env.example`).

### Google login

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret |
| `VITE_OAUTH_ENABLED` | Set to `true` to show the Google button on login/signup |

Authorized redirect URI in Google Cloud Console: `https://<your-domain>/api/auth/callback/google` (local: `http://localhost:8080/api/auth/callback/google`).

### Contact + newsletter

Tables `contact_submissions` and `newsletter_subscribers` ship in `migrations/0005_contact_newsletter.sql` (auto-applied on deploy when `DATABASE_URL` is set). For Supabase RLS (anon insert, no public read), also run `supabase/contact_newsletter.sql` in the SQL editor.

Verify contact rows: `select * from contact_submissions order by created_at desc limit 20;`
Verify subscribers: `select email, status, subscribed_at from newsletter_subscribers order by subscribed_at desc;`

### SMTP (newsletter emails)

| Variable | Example |
| --- | --- |
| `SMTP_HOST` | `smtp.office365.com` (or `smtpout.secureserver.net`) |
| `SMTP_PORT` | `587` (STARTTLS) or `465` (TLS) |
| `SMTP_USER` | `hello@nakama.in` |
| `SMTP_PASS` | mailbox password — **Vercel/local only, never commit** |
| `SMTP_FROM` | `BLM <hello@nakama.in>` |

Welcome emails send on subscribe (subscriber is saved even if SMTP is unset). New-article emails fan out when an admin **publishes** an article via the CMS desk (`cmsSaveArticle` draft → published). Static markdown posts in the repo do not auto-email.

## License

No license file is present in this repository yet. All rights reserved by the author unless a license is added later.

---

### Made by Asmit

Built by **Asmit** · [casmit510@gmail.com](mailto:casmit510@gmail.com)
