# 06 — ASO Agent Loop

Concept / validation rules. Pipeline architecture: [`04-PIPELINE.md`](04-PIPELINE.md). Purpose: [`03-PURPOSE.md`](03-PURPOSE.md).

Related: [`../../research/PROMPTS.md`](../../research/PROMPTS.md), [`../../research/RESEARCH.md`](../../research/RESEARCH.md).

## Overview

Loop that generates Tanuki Toolbox micro-app ideas and validates each against **Play Store demand** before acceptance.

- ASO-first — search behaviour, not intuition
- Every keyword survives a real store search audit
- Weak / unverifiable demand → discard

## Validation

**Primary signal:** Google Play only. Reddit/forums may supplement spend evidence — not replace store validation.

| Rule | Requirement |
|------|-------------|
| No invented keywords | Real, category-aligned Play results |
| Competing apps | Top 3: monetization, rating count, avg rating |
| Category alignment | Not noisy/mixed SERP |
| Search intent | Dedicated apps or clear demand cluster |
| Weak signal | Discard — do not score |

**Auto-skip:** no apps + no search; unbeatable free incumbents; needs backend/accounts/API; platform/suite creep; “good enough” free with no sharp differentiation.

**Spend evidence (WTP):** competitor sub/paid traction or user quote. None → WTP max 2.

## Scoring

| Criterion | Guidance |
|-----------|----------|
| Pain (1–5) | 5 = daily business-stopping |
| WTP (1–5) | 5 = proven paid/sub in niche; no evidence = max 2 |
| Discovery (1–5) | 5 = high-volume keyword + beatable competition |
| Build Speed (1–5) | 5 = offline ≤3 screens; 1–2 = backend/auth/>3 screens |

Evidence subtotal /20. Passion (founder) in Brainstorm. Final /25 — default pick threshold **18**.

## Loop behaviour

Max cycles configurable (suggest 10–20). Stop when ≥3 ideas ≥15/20. On failure: refine audience/angle — don’t retry same keyword. Rank by Discovery + WTP.

## Use

Tanuki Toolbox, Play first. Not for Dojo games, web SaaS, platforms.
