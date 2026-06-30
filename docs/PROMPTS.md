# Prompts — Project Daruma

Reusable AI prompts for research, ideation, and building. Use with Claude, Gemini, or Cursor.

---

## Research Prompts

Weekly research issues paste one of these (brand rotates via [`research-queue.json`](research-queue.json)).

### Toolbox Research Prompt
```
North star: ideas must plausibly contribute to portfolio revenue that funds
always-on Daruma — bias toward audiences that already spend on tools.

Each time this prompt is run, independently select a fresh combination of:
- Audience: a specific small business type or trade (never repeat a previous one)
- Source: App Store reviews, Play Store reviews, Reddit, Twitter/X, G2/Capterra
- Angle: painful admin tasks | tools they hate but pay for | things still done
  on paper | features missing from popular tools

State your chosen combination at the top of your response before researching.
Do not repeat an audience or angle combination from earlier in this conversation.
Use live web search and cite sources.

I am looking for micro problems solvable with a single-purpose mobile app
shippable as a working v1 in under a week. Discovery is ASO-first —
identify the exact App Store/Play Store keyword a user would search. Secondary
channels (Reddit, niche forums, direct outreach) are in scope when they add reach.
Revenue models in scope: subscription, one-time purchase, or freemium with a
paid tier. Minimum screens, immediate value, no onboarding required. Not a
platform. Not a suite. A tiny sharp tool that does one thing better than anything else.

When scoring Build Speed — be strict. Anything requiring complex integrations,
third-party APIs, or more than 3 screens scores 1-2. A smart form, calculator,
or generator with immediate output scores 4-5. Favour the latter.

When scoring Willingness to pay — be strict. Score whether this audience already
spends money on the problem (existing subscriptions, SaaS, or paid apps). Free-only
niches with no spend signal score 1-2.

---

This week's research focus:
- Audience:
- Source:
- Angle:

For each opportunity (3–5 total):

### [Opportunity name]
- Brand: Toolbox
- One-line hook:
- Target keyword (ASO):
- Primary discovery channel: [store | community | outreach]
- Revenue model: [subscription | one-time | freemium]
- Pain (1–5):
- Willingness to pay (1–5): [existing spend in category]
- Discovery (1–5): [ASO volume vs competition; secondary channels if any]
- Build speed (1–5): [v1 in under a week = 4-5, anything longer = 1-2]
- Passion (1–5):
- Total /25:
- MVP scope: [one sentence — what is the absolute minimum to ship v1]
- Recommendation: build | research more | skip

End with: **Top pick:** [name] — [one sentence why]
```

### Dojo Research Prompt
```
North star: ideas must plausibly contribute to portfolio revenue that funds
always-on Daruma — bias toward categories with proven IAP, ad, or subscription spend.

Each time this prompt is run, independently select a fresh combination of:
- Genre: puzzle | arcade | reflex | trivia | word | math | memory | creative
- Platform focus: iOS App Store | Google Play Store | web | cross-platform
- Research source: App Store keyword tools | Play Store categories |
  Reddit (r/iosgaming, r/androidgaming) | AppMagic revenue estimates

State your chosen combination at the top of your response before researching.
Do not repeat a genre or platform combination from earlier in this conversation.
Use live web search and cite sources.

I am looking for keyword gaps — search terms with real volume where the top
ranking apps are old, ugly, poorly rated, or bloated. Discovery is ASO-first;
a beautiful, focused alternative could rank quickly with good ASO. Also in scope:
web playable, cross-platform, Product Hunt, Reddit launches.

The app must be:
- Describable in one sentence
- Completable in under 2 minutes per session
- Shippable as a working v1 in under a week
- Monetisable — default: ads + remove-ads IAP; subscription or premium IAP
  if the category already supports it

When scoring Build Speed — be strict. A simple game loop with one mechanic
scores 4-5. Anything requiring levels, unlocks, or complex state scores 1-2.

When scoring Willingness to pay — be strict. Score whether users already spend
in this category (IAP, remove-ads, premium unlocks, subscriptions) and whether
ad revenue density is realistic. Categories with no spend signal score 1-2.

---

This week's research focus:
- Genre:
- Platform:
- Source:

For each opportunity (3–5 total):

### [Opportunity name]
- Brand: Dojo
- One-line hook:
- Target keyword (ASO or web):
- Primary discovery channel: [store | web | community | launch]
- Revenue model: [ads + IAP | subscription | hybrid]
- Competitor weakness: [why the current top app is beatable]
- Pain (1–5):
- Willingness to pay (1–5): [existing spend + ad/IAP potential]
- Discovery (1–5): [keyword volume vs competition; secondary channels if any]
- Build speed (1–5): [v1 in under a week = 4-5, anything longer = 1-2]
- Passion (1–5):
- Total /25:
- MVP scope: [one sentence — what is the absolute minimum to ship v1]
- Recommendation: build | research more | skip

End with: **Top pick:** [name] — [one sentence why]
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
I am starting a new Daruma Toolbox app. It is a [description] tool for 
[audience]. The stack is SvelteKit + Neon DB + Upstash Redis + Cloudflare Pages 
+ Stripe. Start by scaffolding the project from the Toolbox template. 
The app should do one thing: [core function]. Keep it simple and beautiful.
```

### New Dojo Game
```
I am starting a new Daruma Dojo micro game. The concept is [description]. 
The stack is React Native + Expo. The primary App Store keyword is [keyword]. 
Start by scaffolding from the Dojo template. The game should be completable 
in under 2 minutes per session. Monetisation: ads + remove ads IAP.
```

---

## Context Prompt (paste into new Claude conversations)

```
I am working on Project Daruma — a mission to build 100 micro apps and games.

Two sub-brands:
- Daruma Toolbox (tools.daruma.nz): micro tools for small businesses. 
  Stack: SvelteKit + Neon + Upstash + Cloudflare Pages. Revenue: subscriptions.
- Daruma Dojo (dojo.daruma.nz): micro learning apps and games. 
  Stack: React + Expo. Revenue: ads + IAP. Google Play first, iOS via Expo EAS.

Command center repo: github.com/LABCAT/daruma
I am a full-stack developer based in New Zealand, Windows-heavy.
I use AI (Claude, Cursor, Copilot) as my primary workforce.

[Add your specific question or task here]
```
