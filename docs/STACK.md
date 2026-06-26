# Stack — Project Daruma

## Daruma Toolbox (`tools.daruma.nz`)

**Framework:** SvelteKit
**Monorepo:** pnpm workspaces — `apps/*` + shared packages. Build rules in that repo's `AGENTS.md`.
**Database:** Neon DB (Postgres serverless)
**Cache / KV:** Upstash Redis
**Hosting:** Cloudflare Pages
**Storage:** Cloudflare R2
**Auth:** Auth.js v5
**Payments:** Stripe

**Pattern:**
```
SvelteKit app → Cloudflare Pages
             → Neon DB (via serverless HTTP driver)
             → Upstash Redis (REST API)
             → R2 (S3-compatible, presigned URLs)
```

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

**Capacitor:** noted as a fast-track option for wrapping Toolbox web apps as mobile apps without a full React Native build.

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

## Template Strategy

Before App 1, build reusable starter templates:

**Toolbox template:** SvelteKit + Neon + Upstash + Cloudflare Pages + Stripe + basic auth
**Dojo template:** React Native + Expo + AdMob + basic navigation + IAP setup

Every new app clones the relevant template. Never start from zero.
