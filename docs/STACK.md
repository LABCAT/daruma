# Stack — Metal Monkey Apps

## Web — Metal Monkey Apps (`metalmonkey.cc`)

**Rule:** New web product apps → `*.metalmonkey.cc` (custom domain only if earned). Legacy: `web.daruma.nz` until migrated.

**Framework (current):** SvelteKit  
**Framework (lean, not locked):** TanStack Start + SolidJS for new Daruma internal UIs and Metal Monkey web — decide before next greenfield web app; do not churn live SvelteKit apps until migration is worth it.

**Monorepo:** pnpm workspaces — `apps/*` + shared packages. Build rules in that repo's `AGENTS.md`.
**Database:** Neon DB (Postgres serverless)
**Cache / KV:** Upstash Redis
**Local-first sync:** ElectricSQL + TanStack DB — **medium-term**, primarily for **Daruma ops** (e.g. live multi-agent dashboards), not required for v1 product micro-apps
**Hosting:** Cloudflare Pages (current SvelteKit); Workers for TanStack Start / Solid SPAs when adopted
**Storage:** Cloudflare R2
**Auth:** Auth.js v5
**Payments:** Stripe

**Pattern (current):**
```
SvelteKit app → Cloudflare Pages
             → Neon DB (via serverless HTTP driver)
             → Upstash Redis (REST API)
             → R2 (S3-compatible, presigned URLs)
```

---

## Tanuki Toolbox — Play (`tools.daruma.nz`)

**Framework:** React Native + Expo  
Tanuki Toolbox is **Play / RN-first**. Web product apps belong under Metal Monkey, not this brand.
**UI:** Shopify Restyle — tokens → themes → shared components in `packages/design-system`. No NativeWind, no Tailwind.
**Design source:** `tanuki-toolbox-design-system` (sibling repo — visual spec; translated into Restyle in the monorepo)
**Monetisation:** Free download + one-off IAP unlock (see [`REVENUE.md`](REVENUE.md))
**Distribution:** Play Store ASO-first

**Theme architecture:** Base theme + light/dark; future vertical themes (e.g. gardening, finance) override tokens only — components stay shared.

**Capacitor:** fast-track option for wrapping Metal Monkey web apps as mobile without a full RN build.

---

## Daruma Dojo (`dojo.daruma.nz`)

**Framework:** React + Expo (React Native)
**UI:** NativeWind for App 1; Tamagui long-term (cross-platform)
**Monorepo:** pnpm workspaces — `apps/*` + shared packages (e.g. `@daruma/ui`). Build rules in that repo's `AGENTS.md`.
**Target platforms:** Web, Android (Google Play), iOS (via Expo EAS Build)
**Backend:** Per app — many apps are offline-only (local storage). Add API + database only when needed.
**Database (when needed):** Supabase or Neon DB
**Cache / KV:** Upstash Redis
**Storage:** Cloudflare R2
**Hosting:** Cloudflare Pages (web), Expo EAS (mobile builds)
**Ads:** TBD — AdMob (mobile), Google AdSense or Carbon (web)

**Mobile pattern (when backend needed):**
```
React Native (Expo) app
  → API layer (Cloudflare Workers)
  → Supabase / Neon DB
  → Upstash Redis
```
Note: when an app uses a backend, mobile never connects directly to the database — always via an API layer.

**Platform order:** Google Play first (Windows-friendly, cheaper, faster review), iOS later via Expo EAS cloud builds — no Mac required locally.

---

## Shared Infrastructure

| Service | Use |
|---------|-----|
| Neon DB | Postgres for both brands where needed |
| Upstash Redis | Caching, rate limiting, KV |
| Cloudflare R2 | File storage, assets |
| Cloudflare Workers | API layer, edge functions |
| Stripe | Payments for Toolbox subscriptions |
| Expo EAS | Cloud mobile builds (solves Windows → iOS problem) |

---

## Developer Environment

- **OS:** Windows (primary)
- **Android:** Android Studio + emulator on Windows — no issues
- **iOS simulator:** Not available on Windows — use real device or Expo Go app
- **iOS builds:** Expo EAS cloud builds — no Mac needed
- **App Store submission:** Via browser — no Mac needed

---

## E2E Testing (monorepo integration)

Planned for all three app monorepos — not in D01 v1. YAML flows (Maestro) suit mobile; Playwright suits web. Both are LLM-friendly for agent-authored tests.

| Monorepo | Purpose | E2E tool | Status |
|----------|---------|----------|--------|
| `web.daruma.nz` | Web apps | Playwright | ☐ Not integrated |
| `tools.daruma.nz` | ASO / Play Store apps | Maestro | ☐ Not integrated |
| `dojo.daruma.nz` | Games / learning apps | Maestro | ☐ Not integrated |

**When:** Dojo after D01 ships; Toolbox when next template/scaffold work lands.

---

## Template Strategy

Before App 1, build reusable starter templates:

**Toolbox web template (legacy `web.daruma.nz`):** SvelteKit + Neon + Upstash + Cloudflare Pages + Stripe + basic auth + E2E (Playwright) — current. New web: Metal Monkey `*.metalmonkey.cc` + TanStack Start/Solid (TBD).
**Tanuki Toolbox ASO template (`tools.daruma.nz`):** React Native + Expo + Restyle + `packages/design-system` + IAP billing + E2E (Maestro)
**Dojo template (`dojo.daruma.nz`):** React Native + Expo + AdMob + basic navigation + IAP setup + E2E (Maestro)

Every new app clones the relevant template. Never start from zero.
