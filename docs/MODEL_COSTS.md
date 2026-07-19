# Model cost comparison (Daruma)

Snapshot for models Daruma may use. **Not** a full market catalog — curated list only.

**Last verified:** 2026-07-19  
**Refresh cadence:** monthly (1st of month or when picking a new default)  
**Authoritative sources (prefer these over copying stale tables):**

| Source | What it gives | URL |
|--------|---------------|-----|
| **BenchLM pricing** | Official-ish list $/MTok + quality score | https://benchlm.ai/llm-pricing |
| **Artificial Analysis** | Blended price, speed, intelligence index | https://artificialanalysis.ai/leaderboards/models |
| **CheapestInference** | Monthly AA-based price tracker | https://cheapestinference.com/reports/llm-price-tracker/ |
| **OpenRouter** | Live routed prices + `:free` slugs | https://openrouter.ai/models |
| **Vendor consoles** | Free tier / credits (Google AI Studio, xAI, etc.) | per provider |

**Refresh task:** Re-fetch BenchLM + AA for the rows below; update this file; bump `Last verified`. Do **not** invent prices. Prefer linking out when a full board is needed.

---

## Daruma roles (which bill matters)

| Surface | Default models | Cost lens |
|---------|----------------|-----------|
| **Daruma Assistant** (Metal Monkey command center) | Free Gemini Flash → DeepSeek / Qwen / Kimi / GLM / Grok when needed | Prefer free; paid = cost per good decision |
| **Claude Code** (coding) | MiniMax M3 PAYG | Agent-loop $/hr with cache reads |
| **OpenHands** (later) | BYOK — same pool, tag `task_id` | Cost per completed task |

---

## Paid list prices (USD / 1M tokens)

From BenchLM (2026-07-18) unless noted. Verify before spend.

| Model | Input | Output | Context | BenchLM score | Daruma note |
|-------|------:|-------:|--------:|-------------:|-------------|
| **DeepSeek V4 Flash** | $0.14 | $0.28 | 1M | ~59 | Best budget paid; strong Score/$ |
| **MiniMax M3** | $0.30 | $1.20 | 1M | ~70 | Coding default (Claude Code), not chat-only default |
| **DeepSeek V4 Pro** | $0.43 | $0.87 | 1M | ~61 | Step up from Flash |
| **Grok 4.1 Fast** | $0.20 | $0.50 | 2M | ~51 | Cheap long-context Grok |
| **Grok 4.3** | $1.25 | $2.50 | 1M | ~65 | Mid Grok |
| **Grok 4.5** | $2.00 | $6.00 | 500K | ~77 | Strong quality; **not** cheap vs MiniMax/DeepSeek on list price |
| **Gemini 3 Flash** | $0.50 | $3.00 | 1M | ~60 | Paid API rate — free path is AI Studio (below) |
| **Gemini 3.5 Flash** | $1.50 | $9.00 | 1M | ~65 | Paid Flash |
| **Gemini 3 Pro** | $2.00 | $12.00 | 2M | ~68 | Hard research / judgment |
| **Kimi K2.5** | $0.60 | $3.00 | 256K | ~60 | Long-context / research-ish |
| **Kimi K2.6** | $0.95 | $4.00 | 256K | ~57 | |
| **Kimi K3** | $3.00 | $15.00 | 1.05M | ~81 | Frontier-class open; expensive |
| **GLM-5** | $1.00 | $3.20 | 200K | ~66 | |
| **GLM-5.1 / 5.2** | $1.40 | $4.40 | 200K–1M | ~64–68 | |
| **Qwen3.5 Flash** | $0.10 | $0.40 | 1M | ~48 | Cheap; verify tool-calling |
| **Qwen3.5 397B** | $0.60 | $3.60 | 128K | ~57 | |

**Grok 4.5:** Capable (BenchLM ~77, often cited as strong Score/$ among mid-frontier). Use when free credits or task quality beats cheaper models — same rule as other frontier picks. List price is ~7× MiniMax input / 5× output.

**CheapestInference (AA index $/point, 2026-07-06):** DeepSeek V4 Flash ≈ $0.007/pt; MiniMax M3 ≈ $0.027; Kimi K2.6 ≈ $0.093; Gemini 3.5 Flash ≈ $0.180 — open budget models dominate efficiency charts.

---

## Free / near-free (capacity, not $/MTok)

| Route | Cost | Limits / caveats |
|-------|------|------------------|
| **Google AI Studio — Gemini Flash / Flash-Lite** | $0 | Rate-limited (RPM/TPM/RPD). Pro often **paid-only** (verify in AI Studio). Free prompts may train Google products. |
| **OpenRouter `:free`** | $0 | ~50 req/day free plan (higher with credits). RPM caps → 429. Slugs vanish. Some hosts log prompts (e.g. NVIDIA trial). |
| **Groq** | Free tier | Fast; model set limited; rate limits |
| **xAI Grok** | Trial credits | Confirm in `console.x.ai`; do not budget vanished promo credits |
| **Same weights, many hosts** | $0–paid | DeepSeek/Qwen/etc. may appear free on one host and paid on another — router failovers on 429 |

Free remaining quota is often **not** API-visible. Daruma usage UI: metered tokens we observed + 429/failover events; “tokens left” only when a provider returns it.

---

## Planned picker set (enable in settings)

Keep the dropdown short via **Settings → enabled models**.

| Enabled by default (intent) | Role |
|-----------------------------|------|
| Gemini Flash (AI Studio free) | Everyday Daruma chat |
| DeepSeek V4 Flash (paid or free host) | Cheap escalate / failover |
| Qwen / Kimi / GLM (best available free→paid) | Research / long context when they win |
| Grok 4.5 (credits or rare paid) | High-quality judgment |
| MiniMax M3 | Backup; primary for **coding** tools, not chat default |
| Gemini Pro | Hard research turns (paid) |

Disable the rest without deleting keys.

---

## How to refresh (monthly)

1. Open [BenchLM pricing](https://benchlm.ai/llm-pricing) — update paid rows for models above.  
2. Skim [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models) / [CheapestInference](https://cheapestinference.com/reports/llm-price-tracker/) for efficiency shifts.  
3. Check [OpenRouter free](https://openrouter.ai/models?q=free) + Google AI Studio rate-limit dashboard for free capacity.  
4. Set `Last verified` to today.  
5. If defaults should change, update [`DARUMA.md`](DARUMA.md) model strategy in the same PR.

Automate later (Workers cron or scheduled research issue) — manual is fine until assistant metering exists.
