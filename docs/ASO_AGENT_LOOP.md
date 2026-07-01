# ASO Agent Loop Research System

Concept specification for a future automated research agent. Not implementation — design only.

Related: [`PROMPTS.md`](PROMPTS.md) (manual prompt), [`RESEARCH.md`](RESEARCH.md) (current weekly loop).

---

## 1. Overview

An loop-based AI research process that continuously generates micro app ideas for **Daruma Toolbox** and validates each against **Google Play Store demand signals** before acceptance.

Principles:

- **ASO-first discovery** — ideas start from search behaviour, not intuition
- **Play Store keyword validation** — every keyword must survive a real store search audit
- **Reject without evidence** — weak or unverifiable demand → discard immediately

The manual Tuesday research issue is a human-in-the-loop prototype of this system. The agent version runs the same logic unattended.

---

## 2. Core Idea

Iterative loop:

```
Generate idea + target keyword
  → Validate keyword (Play Store search)
  → Analyse competitors + saturation
  → Score (evidence-based rubric)
  → Reject or accept
  → Repeat until strong candidates found
```

Rules:

- No idea is accepted without cited Play Store evidence
- Designed to eliminate vibe-based app ideas
- Prefer **boring but validated** problems over novel unvalidated concepts

---

## 3. Validation Rules

**Primary signal source:** Google Play Store only. Reddit, G2, and forums may supplement spend evidence — not replace store validation.

| Rule | Requirement |
|------|-------------|
| No invented keywords | Keyword must return real, category-aligned results on Play |
| Competing apps | Top 3 listed: monetization, rating count, avg rating |
| Category alignment | Results must match intent (not noisy/mixed SERP) |
| Search intent | Multiple dedicated apps or clear demand cluster required |
| Weak signal | Discard immediately — do not score or list |

**Auto-skip (red flags):**

- No apps rank and no one is searching for the term
- Top 3 are unbeatable free incumbents (major brands, 100K+ downloads, 4.5+ stars)
- Core value requires backend, accounts, or third-party API
- Creeps into platform/suite territory
- "Good enough" free alternative exists with no razor-sharp differentiation

**Spend evidence** (for Willingness to Pay): competitor subscription price, paid app with traction, or explicit user quote. No evidence → WTP max 2.

---

## 4. Scoring System

Agent scores four evidence dimensions. Founder adds Passion in Brainstorm for final gate.

| Criterion | Guidance |
|-----------|----------|
| **Pain (1–5)** | 5 = daily, business-stopping; 1 = occasional annoyance |
| **Willingness to Pay (1–5)** | 5 = proven subscriptions/paid apps in niche; 1 = only free/ad; no evidence = max 2 |
| **Discovery (1–5)** | 5 = high-volume Play keyword + beatable competition; 1 = no keyword, outbound only |
| **Build Speed (1–5)** | 5 = offline form/calculator/generator ≤3 screens; 1–2 = backend, APIs, auth, or >3 screens |

- **Evidence subtotal:** /20 (agent output)
- **Passion (1–5):** founder scores in Brainstorm
- **Final total:** /25 — pick threshold default **18** ([`research-queue.json`](research-queue.json))

Build Speed favours Toolbox v1 constraints: single-purpose, shippable in under a week, minimal or no backend.

---

## 5. Loop Behaviour

| Parameter | Default behaviour |
|-----------|-------------------|
| Max cycles | N (configurable; suggest 10–20 per run) |
| Stop condition | ≥3 ideas with evidence subtotal ≥15/20 |
| On failure | Refine audience, angle, or keyword cluster; do not retry same keyword |
| Direction bias | Shift toward adjacent keywords when saturation detected |
| Output priority | Rank by Discovery + WTP, not novelty |

Agent memory per run:

- Audiences already tried
- Keywords discarded and why
- Saturation patterns (e.g. genre dominated by free incumbents)

---

## 6. Intended Use

- **Brand:** Daruma Toolbox micro-app pipeline
- **Goal:** Identify small, monetisable Android tools discoverable via Play Store ASO
- **Platform:** Google Play first; iOS later once Play proves the category
- **Not for:** Dojo games (separate prompt/rubric in [`PROMPTS.md`](PROMPTS.md)), web-only SaaS, platforms, or marketing-dependent launches

Outputs feed [brainstorm.daruma.nz](https://brainstorm.daruma.nz) → [`tracker/APPS.md`](../tracker/APPS.md) → [`CURRENT.md`](CURRENT.md).

---

## 7. Future Extensions

Potential upgrades when automation is worth the infra cost:

- Play Store metadata API or scraping layer (competitor snapshots, install ranges)
- Automated competitor diff (pricing, last update, rating trend)
- Overnight batch runs on VPS / Cloudflare Worker
- Integration with [`daruma-scheduled.yml`](../.github/workflows/daruma-scheduled.yml) — agent posts results to `[Research]` issue; founder reviews in Brainstorm
- Cross-run memory (Redis/DB) so audiences and keywords don't repeat across weeks
- Phase 2 per [`RESEARCH.md`](RESEARCH.md): always-on agent replaces paste-into-chat step

---

## Open Questions

- N cycles vs token budget per run
- Whether agent may propose keyword *variations* of a failed term or must pick fresh audiences only
- Minimum evidence subtotal to surface in issue (15/20 vs 16/20)
