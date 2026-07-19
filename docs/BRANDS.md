# Brands — Metal Monkey Apps

## Hierarchy

| Layer | What |
|-------|------|
| **Daruma** | The AI assistant (this command center). Not a product brand. Never shipped to customers. |
| **Metal Monkey Apps** (`metalmonkey.cc`) | The business + overarching public brand |
| **Tanuki Toolbox** | React Native apps for small businesses |
| **Daruma Dojo** | React Native apps/games that are fun and involve learning |

```
Metal Monkey Apps (business + web)
├── Web apps → *.metalmonkey.cc (custom domain only if an app earns it)
├── Tanuki Toolbox → Play / RN small-business tools
└── Daruma Dojo → Play / RN fun + learning
         ↑
      Daruma (AI) runs the operation
```

---

## Metal Monkey Apps

**Domain:** `metalmonkey.cc`  
**Role:** Overarching brand for the business. All **new web** micro-apps live here.

**Design system:** [Figma Make — Design System for Metal Monkey](https://www.figma.com/make/mqbG0tprnZ104p8gVpr5QK/Design-System-for-Metal-Monkey?t=66QIAfLwiLL8eiwg-0)

**Web hosting rule:** Subdomains by default (`app.metalmonkey.cc`). Custom domain only when an app is popular enough to warrant it.

**Legacy:** Existing web apps on `web.daruma.nz` (e.g. brainstorm) stay until migrated.

**Revenue (web):** Monthly subs ($5–20/mo) where backend costs apply — per app, not required for every product.

---

## Tanuki Toolbox

**Tagline:** Small tools. Real work.

**Platform:** React Native + Expo (Google Play first; iOS via EAS).  
**Repo (current):** `tools.daruma.nz` — rename later; brand in store is **Tanuki Toolbox**.

**Audience:** Small business owners, sole traders, tradespeople, adventure tourism operators  
**Problem:** Admin is painful; generic software is overkill  
**Positioning:** One job done perfectly — ship-and-forget

**Revenue:** Free download + one-off IAP unlock (primary). No monthly sub required on Play.

**Packaging:** Micro apps first; verticals with traction may graduate to mini (3–4 related gated features). Not catch-all SaaS.

**Pipeline:** Adventure tourism · sole trader / tradie admin · revenue priority over Dojo

---

## Daruma Dojo

**Tagline:** Learn by playing.  
**Potential tagline / mode:** **Challenge Club** — competitive framing (leaderboards, challenges) when Dojo adds social/compete loops. Not a separate brand; stays under Daruma Dojo.

**Platform:** React Native + Expo (Play first; iOS via EAS).  
**Repo (current):** `dojo.daruma.nz`

**Audience:** Casual learners and game players  
**Positioning:** Fun micro games/apps that also teach something

**Revenue:** TBD — ads + IAP leading candidate. Lower priority than Toolbox for now.

**Pipeline:** Play keyword gaps · Skia visuals · D01 (Multiplication Dojo) first · Scratch-style learn-by-play (not committed)

**Founder-play lane:** WebGL / GLSL / shapes / sacred geometry / colour theory / maths — games the founder will actually play to learn these concepts (visual + interactive, not worksheet clones).

**Wild vision (not near-term):** Align some apps to **NZ / Australian maths curriculum** and pursue school pickup. Speculative — prove consumer Play pipeline first; revisit when D01+ traction exists.

---

## Shared ops

- **Daruma** (AI + this repo) orchestrates strategy, research, and dispatch for Metal Monkey Apps.
- Brands share infra/templates but stay positioned independently.
- **Play Store:** One org account can publish Toolbox + Dojo. Brand in app titles; developer name account-level. See [`CURRENT.md`](CURRENT.md#play-console--domains).
- Optional brand landing domains (`tanukitoolbox.sbs`, `darumadojo.cc`) — verification/landing only; not required for D01.
