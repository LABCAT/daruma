# Prompts — Metal Monkey Apps / Daruma

Reusable AI prompts for research, ideation, and building. Use with Claude, Gemini, or Cursor.

---

## Research Prompts

Weekly research issues paste one of these (brand rotates via [`research-queue.json`](research-queue.json)).

### Toolbox Research Prompt

```
North star: every idea must plausibly generate revenue from Android users
actively searching for a solution. Bias toward audiences that already spend on
tools. Optimise for Play Store keyword demand, low build time, and proven
willingness to pay. No "nice ideas" — only searched-for problems with evidence.

Platform: Google Play Store first (iOS later). Discovery is ASO-first. Reddit,
G2/Capterra, and niche forums are in scope for pain quotes and spend evidence —
not as primary discovery.

Each time this prompt is run, independently select a fresh combination of:
- Audience: a specific small business type or trade (never repeat a previous one)
- Source: Play Store reviews, Reddit, niche forums, G2/Capterra
- Angle: painful admin tasks | tools they hate but pay for | things still done
  on paper | features missing from popular tools

State your chosen combination at the top before researching.
Do not repeat an audience or angle combination from earlier in this conversation.
Use live web search and cite sources.

Hard constraints:
- Do not invent keywords — every keyword must have Play Store evidence
- If demand evidence is weak, discard the idea (do not list it)
- Single-purpose tool, not a platform or suite
- Shippable v1 in under a week; prefer ≤3 screens, no auth, minimal or no backend
- Prefer boring validated problems over clever unvalidated ones

Mandatory validation (complete before scoring each opportunity):
1. Play Store keyword audit — search the exact target keyword. Top 3 apps:
   pricing model, rating count, avg rating. Flag saturated if top results are
   major brands with 100K+ downloads and strong ratings.
2. Demand signal — multiple dedicated apps or clear search intent required;
   noisy or missing results → skip. Note autocomplete / keyword clusters if visible.
3. Spend evidence — competitor subscription price, paid app with traction, or
   "I pay $X for Y" quote. No evidence → Willingness to Pay max 2.
4. Free-alternative check — built-in Android feature, Sheets template, or free
   app 4.5+ stars? Differentiation must be razor-sharp time savings, not UI alone.
5. Red flags (auto-skip): no search demand; unbeatable free incumbents; core value
   needs backend, accounts, or third-party API; creeps into platform territory

When scoring — be strict:
- Pain (1–5): 5 = daily, business-stopping; 1 = occasional annoyance
- Willingness to pay (1–5): 5 = proven subscriptions/paid apps; 1 = only free/ad;
  no spend evidence = max 2
- Discovery (1–5): 5 = high-volume Play keyword with beatable competition;
  1 = no keyword, outbound only
- Build speed (1–5): 5 = offline form/calculator/generator ≤3 screens;
  4 = local-first + share/export; 1–2 = backend, APIs, auth, or >3 screens
- Passion (1–5): founder scores in Brainstorm — output — on this line

---

This week's research focus:
- Audience:
- Source:
- Angle:

For each opportunity (3–5 total):

### [Opportunity name]
- Brand: Tanuki Toolbox
- One-line hook:
- Target keyword (Play Store):
- Primary discovery channel: store
- Revenue model: [subscription | one-time | freemium]
- Evidence (mandatory): competing apps, install/rating signals, keyword alignment,
  spend evidence found
- Pain (1–5):
- Willingness to pay (1–5):
- Discovery (1–5):
- Build speed (1–5):
- Passion (1–5): —
- Evidence subtotal /20:
- MVP scope: [one sentence — absolute minimum to ship v1]
- Recommendation: build | research more | skip

If you cannot complete mandatory validation, do not list the opportunity.

End with: **Top pick:** [name] — [one sentence why, based on evidence not intuition]
```

### Dojo Research Prompt

```
North star: every idea must plausibly generate revenue from Android users
actively searching for a game. Bias toward categories with proven IAP, ad, or
subscription spend. Optimise for Play Store keyword demand, low build time, and
beatable incumbents. No "clever concepts" — only validated keyword gaps.

Platform: Google Play Store first. iOS ships later via Expo EAS once Play proves
the category — research keywords and competitors on Play only.

Each time this prompt is run, independently select a fresh combination of:
- Genre: puzzle | arcade | reflex | trivia | word | math | memory | creative
- Source: Play Store categories, Play Store reviews, Reddit (r/androidgaming),
  AppMagic revenue estimates
- Angle: keyword gaps | tired incumbents | underserved niche | learn-by-playing

State your chosen combination at the top before researching.
Do not repeat a genre or angle combination from earlier in this conversation.
Use live web search and cite sources.

Hard constraints:
- Do not invent keywords — every keyword must have Play Store evidence
- If demand evidence is weak, discard the idea (do not list it)
- One game mechanic, describable in one sentence
- Completable in under 2 minutes per session
- Shippable v1 in under a week; offline-first preferred
- Monetisable — default: ads + remove-ads IAP
- Prefer boring validated gaps over clever unvalidated concepts

Mandatory validation (complete before scoring each opportunity):
1. Play Store keyword audit — search the exact target keyword. Top 3 apps:
   monetization (ads/IAP/sub), rating count, avg rating, last update, visual quality.
   Flag saturated if top results are major studios with 100K+ downloads and 4.5+ stars.
2. Demand signal — multiple dedicated apps or clear search intent required;
   noisy or missing results → skip. Note autocomplete / keyword clusters if visible.
3. Beatability — at least one top app is old, ugly, poorly rated, bloated, or
   off-keyword. If all tops are polished and loved → skip unless niche is proven.
4. Monetization evidence — category shows ads, remove-ads IAP, premium unlocks, or
   subscriptions. No spend signal → Willingness to Pay max 2.
5. Red flags (auto-skip): no search demand; unbeatable studio incumbents; needs
   online multiplayer, accounts, or backend; heavy levels/unlocks/progression;
   not shippable in a week

When scoring — be strict:
- Pain (1–5): user frustration with incumbents — 5 = reviews complain about tops;
  1 = category is fine, no real gap
- Willingness to pay (1–5): 5 = proven IAP/ad revenue in category; 1 = no monetization
  signal; no evidence = max 2
- Discovery (1–5): 5 = high-volume Play keyword with beatable competition;
  1 = no keyword, outbound only
- Build speed (1–5): 5 = one mechanic, one loop, offline; 4 = simple state, no unlock tree;
  1–2 = levels, progression, online, or complex state
- Passion (1–5): founder scores in Brainstorm — output — on this line

---

This week's research focus:
- Genre:
- Source:
- Angle:

For each opportunity (3–5 total):

### [Opportunity name]
- Brand: Dojo
- One-line hook:
- Target keyword (Play Store):
- Primary discovery channel: store
- Revenue model: [ads + IAP | subscription | hybrid]
- Evidence (mandatory): competing apps, install/rating signals, keyword alignment,
  monetization evidence, beatability case
- Competitor weakness: [why the current top app is beatable]
- Pain (1–5):
- Willingness to pay (1–5):
- Discovery (1–5):
- Build speed (1–5):
- Passion (1–5): —
- Evidence subtotal /20:
- MVP scope: [one sentence — absolute minimum to ship v1]
- Recommendation: build | research more | skip

If you cannot complete mandatory validation, do not list the opportunity.

End with: **Top pick:** [name] — [one sentence why, based on evidence not intuition]
```

---

## Ideation Prompts

### Idea Scoring

```
Here is a micro app idea: [idea]. Score it against these criteria:
1. Pain level (1–5): How painful is the problem?
2. Willingness to pay (1–5): Are they already spending money on this?
3. Reachability (1–5): Can I reach the audience without a big budget?
4. Build speed (1–5): Can this be built in days not months?
5. Passion (1–5): Does the founder actually care about this?

Give a total score out of 25 and a one-paragraph recommendation.
```

### Micro Game Concept

```
Suggest 5 micro game concepts that could be built in under a week using
React Native + Expo (Skia for native graphics; p5/canvas only on the web target). Each concept should:
- Have a clear App Store keyword to target
- Be visually distinctive (not a generic reskin)
- Have a simple one-sentence hook
- Be monetisable with ads + remove ads IAP
```

---

## Build Prompts

### New Toolbox App

```
I am starting a new Tanuki Toolbox app. It is a [description] tool for
[audience]. The stack is SvelteKit + Neon DB + Upstash Redis + Cloudflare Pages
+ Stripe. Start by scaffolding the project from the Toolbox template.
The app should do one thing: [core function]. Keep it simple and beautiful.
Write robust tests covering edge cases, failures, and idempotency—not just the happy path.
```

### New Dojo Game

```
I am starting a new Daruma Dojo micro game. The concept is [description].
The stack is React Native + Expo. The primary App Store keyword is [keyword].
Start by scaffolding from the Dojo template. The game should be completable
in under 2 minutes per session. Monetisation: ads + remove ads IAP.
Write robust tests covering edge cases, failures, and idempotency—not just the happy path.
```

---

## Context Prompt (paste into new Claude conversations)

```
I am building Metal Monkey Apps (metalmonkey.cc) with Daruma as my AI co-founder.
Mission: 100 micro apps and games.

Brands:
- Metal Monkey Apps: overarching + web on *.metalmonkey.cc
- Tanuki Toolbox (tools.daruma.nz): React Native tools for small businesses; free + IAP
- Daruma Dojo (dojo.daruma.nz): React Native fun + learning apps/games; ads + IAP; Play first

Command center: github.com/LABCAT/daruma
Full-stack, NZ, Windows-heavy. AI is the workforce.

[Add your specific question or task here]
```
