# Revenue — Metal Monkey Apps

**Priority:** Tanuki Toolbox revenue first. Dojo monetisation TBD.

**Discovery default:** ASO + SEO — founder builds, not markets. Reddit / Product Hunt / outreach **deferred** until Daruma can run them autonomously; not ruled out long-term.

---

## Models by Brand

### Tanuki Toolbox — Play (`tools.daruma.nz`)

- **Model:** Free download + **one-off IAP unlock** (primary plan)
- **Philosophy:** Ship-and-forget — no subscription billing, no support system baked in
- **Gate patterns:** Feature gate (lock export/save) or usage gate (daily cap) — not time-based trials
- **Play Store cut:** ~15% on first $1M USD/year (opt-in tier); higher above that

### Metal Monkey Apps — Web (`*.metalmonkey.cc`)

- **Model:** Monthly subscription ($5–20/mo) where backend/Neon costs apply
- **Target:** 15–50 customers per app to hit $500/mo
- **Discovery:** Long-tail SEO — the tool is the page
- **Legacy:** `web.daruma.nz` until migrated

### Daruma Dojo

- **Model:** TBD — ads + remove-ads IAP is the leading candidate
- **Strategy:** Many small apps compound once monetisation is chosen

---

## Micro → Mini Graduation

1. Ship single-feature **micro** apps on Play
2. Watch signal: installs, repeat opens, reviews asking for more
3. Winners **graduate in-place** — add gated premium features to the same listing (same install base, no cold-start migration)
4. Vertical-specific bundles only (e.g. gardening services, food trucks) — never "do everything" SaaS

---

## Play + Web discovery (Toolbox Play)

Two channels, one funnel. Play is primary; web landing pages supplement over time.

### Play Store — medium-tail ASO

People type **2–3 words** into Play ("food truck calculator", "cleaning schedule app"). Hyper-specific long-tail phrases have near-zero Play volume.

- **App title + subtitle** target the medium-tail keyword
- Research keywords **before** naming or building ([`projects/opportunity-engine/`](projects/opportunity-engine/))
- Launch, gather ratings, iterate listing copy

### Web — long-tail landing pages (`tanukitoolbox.sbs`)

People type **full questions** into Google ("how to track food truck daily expenses nz") — they don't type that into Play. A landing page ranks for long-tail intent and sends high-intent traffic to the Play listing.

**Landing page is not the app.** The app lives on Play. The page is marketing:

- Who it's for + what problem it solves
- 2–3 screenshots
- Play Store install button / deep link
- Copy targeting the long-tail phrase (FAQ or use-case paragraph)

**Example:**

| Layer | Target | Example |
|-------|--------|---------|
| Play listing | Medium-tail | "Food Truck Cost Calculator" |
| Landing URL | Same app, one primary page | `tanukitoolbox.sbs/food-truck-cost-calculator` |
| Long-tail caught on Google | Specific intent | "how to track food truck daily expenses" |

### Page count (default)

| Page | When |
|------|------|
| **1 landing page per Play app** | Always — primary medium-tail + 2–3 related long-tail angles in copy |
| **1 portfolio hub** | `tanukitoolbox.sbs` — lists all apps, cross-links |
| **Extra pages per app** | Only when one app has clearly distinct search intents (e.g. mini-app with separate features) — not default |

Web SEO is **slow** (months). Play ASO remains the main channel for early apps. Landing pages are built at ship time, compounding over the portfolio.

### Dojo

Same Play medium-tail ASO pattern. Long-tail landing pages on `darumadojo.cc` when needed — lower priority than Toolbox.

---

## ASO process (Toolbox + Dojo)

1. Research keywords before naming or building
2. Target medium-tail on Play (see above)
3. Build title and subtitle around primary keyword
4. Launch, gather ratings, iterate
5. Ship matching landing page on brand domain for long-tail web traffic

### Tools

- **AppFollow / AppFigures** — keyword volume and difficulty
- **AppMagic** — revenue estimates (sanity check)
- **Manual Play Store search** — autocomplete reveals real behaviour

### What to look for

- Decent volume, weak competition
- Top apps rated 3.5 stars or lower, dated or bloated
- No beautiful, focused alternative exists

---

## SEO (Metal Monkey Web — `*.metalmonkey.cc`)

- Long-tail queries rank on Google — the **web app is the page**, not a brochure
- Target: "invoice generator for NZ sole traders", "shift roster calculator", etc.
- No separate landing-page funnel — users use the tool in-browser; subs via Stripe

---

## Distribution by phase

Organic only — ASO, SEO, portfolio effects. Founder does not do manual marketing.

| Phase | Channel |
|-------|---------|
| Apps 1–10 | Play ASO; landing pages at ship; web SEO for `web.daruma.nz` tools |
| Apps 11–30 | ASO + SEO compounding; portfolio hub live |
| Apps 31–60 | In-app cross-promotion; unlock upsells; organic stack deepens |
| Apps 61–100 | Established brand; word of mouth from portfolio density |
| **Later (Daruma-automated)** | Reddit / Product Hunt / outreach — only when an agent can run it; founder opt-out until then |

---

## Revenue Targets

| Milestone | Timeframe |
|-----------|-----------|
| First $1 of revenue | 1–3 months |
| 10 apps live | 3–6 months |
| First $500/mo | 6–12 months |
| $500–$2k/mo | 12–18 months |
| 100 apps live | 2–3 years |
