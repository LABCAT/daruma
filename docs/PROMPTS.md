# Prompts — Project Daruma

Reusable AI prompts for research, ideation, and building. Use with Claude, Gemini, or Cursor.

---

## Research Prompts

### App Store Gap Research
```
Search for the top apps in [category] on the iOS and Google Play App Store. 
Find their ratings, number of reviews, last update date, and any common 
complaints on Reddit or app review sites. I am looking for gaps — old, 
poorly rated, or bloated apps where a simpler and more beautiful alternative 
could win. Summarise the top 3 opportunities.
```

### Reddit Complaint Mining
```
Search Reddit for complaints about [specific app or category]. What are users 
frustrated about? What features are they asking for that do not exist? What 
would make them switch to an alternative? Summarise the top pain points.
```

### Keyword Research
```
Search for App Store keyword data for [category or niche]. What are people 
searching for? Which keywords have decent volume but weak competition (top apps 
old, low rated, or generic)? Suggest 5 keyword opportunities ranked by 
opportunity score.
```

### Small Business Pain Point Research
```
Search Reddit, forums, and review sites for complaints from [industry] business 
owners about their admin software or tools. What tasks do they find painful, 
time-consuming, or poorly served by existing tools? I am looking for a micro 
problem I can solve with a single-purpose web app. Summarise the top 5 pain points.
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
