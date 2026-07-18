# Daruma — Personal AI Assistant

Daruma is the founder's personal AI co-founder: always-on grunt work, marketing research, app development, and operations — while the founder retains final control of creative direction and business decisions.

**Not a product.** Daruma is for internal use only. `daruma.nz` remains the parent brand domain, not a SaaS platform for others.

See also: [`VISION.md`](VISION.md) (business strategy), [`GOALS.md`](GOALS.md) (founder learning).

---

## Roles

| Name | Role |
|------|------|
| **Founder** | Creative Director — vision, taste, redirect when wrong |
| **Daruma** | AI workforce — proposes defaults, executes, pushes the plan forward; escalates only irreversible actions |
| **Keima** | Creative + dev workstation — video, audio, interactive coding at the desk |

Keima and Daruma are separate machines long-term. Keima must stay responsive for creative work; Daruma runs heavy agent loops without competing for GPU/CPU.

---

## Keima — Creative Workhorse

Windows x86 desktop (build when budget allows; do not wait on Windows 12 — GPU and CPU are the bottleneck).

### Creative workloads

- **DaVinci Resolve** — 4K editing; NVIDIA strongly preferred (CUDA, NVENC/NVDEC)
- **Ableton Live** — music production
- **Reason** — music production
- **Native Instruments** (Kontakt, Komplete, etc.) — requires x86 Windows; NI does not support Windows on Arm

### Audio hardware

- Current PCIe audio interface will not transfer to a new build
- Plan for a USB or Thunderbolt interface (Arm-compatible only matters if Keima is ever replaced by an Arm box — not the plan)

### AI / dev on Keima

- Desk-side development with background coding agents
- Optional local LLM inference for small models (VRAM-dependent)
- NVIDIA GPU required — AMD is a poor fit for Resolve CUDA and the ML tooling ecosystem on Windows

### GPU — not decided

Requirements to research before buying:

| Need | VRAM implication |
|------|------------------|
| 4K Resolve | 16GB comfortable for most timelines |
| Local LLM learning (interim) | 16GB → 8B–14B models; 24GB → ~32B models |
| Future dual-GPU upgrade | Motherboard + PSU headroom if pursuing later |

Candidates under consideration (prices volatile — verify at purchase):

- **RTX 5060 Ti 16GB** — new, efficient, good Resolve + small local models
- **RTX 4070 Ti SUPER 16GB** — clearance; wider memory bus, faster when in stock
- **Used RTX 3090 24GB** — best VRAM-per-dollar for local LLMs; used-market only in NZ, no warranty, higher power draw

Avoid Arm-based creative boxes (e.g. RTX Spark) for Keima — NI plugins and audio driver compatibility are friction points.

---

## Daruma — Assistant Infrastructure

### Vision

A private AI assistant capable of becoming AGI: running continuously, working on the business (code, research, marketing tasks), reachable from anywhere for questions and decisions.

### Operating mode

**Daruma pushes the plan forward.** Infer scope from docs and tracker; propose sensible defaults; execute tactical work without waiting for the founder.

**Founder approves irreversible actions:** spending, public-facing launches, brand/creative direction changes. **Merges:** today Daruma opens PRs only and founder merges; future gated auto-merge per Stack layers (CI/E2E/scopes) — never auto for store submit / secrets / spend.

**Agents must not block on questions the docs already answer.** If ambiguous, pick the smallest shippable option and note it in `CURRENT.md` — founder can redirect.

---

### Stack layers

Daruma is layered tools, not one product. Each layer does one job.

| Layer | Tool (vision default) | When |
|-------|----------------------|------|
| **Control plane (day-to-day)** | **Daruma Assistant** — custom Workers + Solid chat, bundled knowledge, `propose_decision` → GitHub PRs ([`DARUMA_ASSISTANT_PLAN.md`](DARUMA_ASSISTANT_PLAN.md)) | Phase 1 — *this* is how the founder talks to Daruma |
| **Coding (local)** | Claude Code + MiniMax PAYG + **Graphify** | Phase 0 |
| **Coding (remote sandbox)** | **OpenHands** (BYOK, Docker, issues→PR) — capability Daruma *dispatches*, not the chat UI | Phase 2 candidate |
| **Design-from-prompt** | **Open Design** + `DESIGN.md` — for **product/site repos** (e.g. metalmonkey.cc), not this command-center repo. Daruma Assistant UI follows existing Solid + SCSS/BEM patterns ([`PHASE_2_MIGRATION_SPEC.md`](PHASE_2_MIGRATION_SPEC.md)). | When building those products |
| **Schedule / heartbeat** | **Cloudflare Workers** cron / Queues | Phase 0–2 |
| **Messaging operator** | Skip by default. OpenClaw/Hermes only if Telegram-as-UI is explicitly wanted later | Optional |
| **Security** | Fine-grained GitHub tokens; sandbox for remote coding; NemoClaw only if a third-party always-on holds creds | When agents get write access |
| **Deep research** | **DeerFlow** — optional later | Multi-hour research jobs |

**Custom vs off-the-shelf:** Day-to-day interaction is **custom-built** (Daruma Assistant). OpenHands is a coding engine to dispatch later. OpenClaw skipped unless messaging UI is wanted. Product design systems (Open Design / `DESIGN.md`, Astro+Solid tokens) live in the **product repo**, not here.

**PR / merge autonomy (future):** Goal is Daruma can open *and* merge when safe — not “merge everything.” Ladder: (1) open PRs only → (2) auto-merge behind hard gates (CI + E2E + scoped token; AI review when ready) → (3) never auto: spending, store submit, brand forks, prod secrets. Founder can always revoke. Mistakes are prevented by gates, not slogans.

- **DeerFlow** deferred, not rejected. Wire as a skill/MCP call when multi-hour research deliverables are worth it.
- freellmapi — local Claude Code anytime; Cloudflare assistant after public `/v1` gateway (see model strategy). Phase 1 Worker = Google + MiniMax.

### Knowledge / memory (RAG)

**Vector databases** (Pinecone, Qdrant, Weaviate, or **pgvector** on Neon) store embeddings so retrieval is by meaning, not keywords. They power **RAG**: fetch relevant chunks → feed the LLM → answer with private/fresh facts the model does not hold. ANN search makes that fast at scale.

**Caveats:** RAG reduces inventing-from-nothing; it does not eliminate hallucinations. Ops/cost grow with corpus size and re-embedding. Not every Daruma surface needs one.

**Daruma default now:** command-center truth lives in git docs (assistant Phase 1 = **bundled knowledge** via `KnowledgeProvider`). Repo structure → **Graphify**. Vector/RAG is a **later swap** behind that provider when chat must search a large, changing corpus. Prefer **pgvector on Neon** (already in [`GOALS.md`](GOALS.md)) before a dedicated vector SaaS unless scale forces it.

**When to move to vector/RAG** — Daruma proposes; founder redirects. Escalate only if it means new paid SaaS (Pinecone etc.) or irreversible data migration. Move when **2+** of these are true:

| Signal | Example |
|--------|---------|
| Bundle/context too big | Knowledge pack blows Worker size, context window, or routinely gets truncated |
| Retrieval misses | Agent often fails to find the right doc that exists; keyword/bundle search isn't enough |
| Corpus sprawl | Need to search research dumps, chat logs, or multi-repo notes — not just `docs/` + tracker |
| Stale sync tax | Rebuild/redeploy cycle can't keep up with how fast knowledge changes |
| Cost-per-task | Measuring shows RAG + smaller prompts beats stuffing the full bundle every turn |

**Not signals:** “industry standard,” wanting a graph UI, or a still-small `docs/` folder that fits cleanly in context.

`daruma.nz` stays the parent brand site. Day-to-day assistant UI: **`daruma.labcat.nz`** (see [`DARUMA_ASSISTANT_PLAN.md`](DARUMA_ASSISTANT_PLAN.md)).

### Phased roadmap

| Phase | When | What |
|-------|------|------|
| **0 — Now** | Current | **Coding default (post-Cursor):** Claude Code + MiniMax M3 PAYG (Anthropic-compatible BYOK — harness stays, model is cheap). Editor: VS Code (or Cursor free if usable). Do not renew Cursor expecting BYOK to keep Agent/Auto magic. Skip Claude Pro unless MiniMax quality fails. **Graphify** when context hurts; free/cheap APIs for research. Keep costs minimal until revenue covers them. |
| **1 — Keima** | Next hardware purchase | Creative + desk-side dev on x86/NVIDIA tower |
| **2 — Daruma lite** | After agent templates + CI/E2E prove out | Cheap VPS: **OpenHands** (BYOK coding sandbox) + Workers cron. OpenClaw only if messaging UI wanted. No auto-merge yet. |
| **3 — Daruma full** | When revenue justifies ~$5–7k NZD | Local 70B+ (Spark) + gated auto-merge where CI/E2E hold; NemoClaw if always-on holds creds |

Do not rush Phase 2 before agent templates and test harnesses are solid — infra without good task scoping wastes time.

### Model and tool strategy

**Principle:** Tool- and model-agnostic. Optimise for **cost per completed outcome**, not sticker $/MTok. A expensive frontier model that finishes in one pass can beat a cheap model that burns 10× tokens + retries. Re-evaluate quarterly; keep multiple routes warm (free trials, budget PAYG, frontier when the math wins).

| Tier | Options | Use |
|------|---------|-----|
| **Free** | Groq, Google AI Studio, OpenRouter free endpoints; xAI Grok trial if console shows it; **freellmapi** (self-hosted — see below) | Bulk / low-stakes; rate limits / cutoff risk |
| **Budget paid** | **MiniMax M3 PAYG** (primary coding via Claude Code); DeepSeek V4 Flash; OpenRouter paid slugs; Grok when free credits or task-fit beats MiniMax | Daily workhorse |
| **Frontier / critical** | Anthropic (Sonnet/Fable/etc.), other top models — only when cost-per-task or quality requires it | Hard problems, one-shot wins |
| **Local** | Keima GPU (small models); Spark (70B+) | Phase 1 / 3 |

**Price snapshot (USD / 1M tokens, verify before spend):**

| Model | Input | Cache read | Output | vs MiniMax M3 |
|-------|-------|------------|--------|----------------|
| **MiniMax M3** (≤512k, std) | $0.30 | $0.06 | $1.20 | baseline |
| **Grok Build 0.1** (<200k) | $1.00 | $0.20 | $2.00 | ~3× input |
| **Grok 4.20 / 4.3** (<200k) | $1.25 | $0.20 | $2.50 | ~4× input |
| **Grok 4.5** (<200k) | $2.00 | $0.50 | $6.00 | ~7× in / 5× out |

Grok is **not** the cheap default vs MiniMax on list price. Use Grok when (a) free credits cover it, or (b) it completes the job with fewer tokens/retries so **task cost** wins. Same rule for Fable 5 and other frontier models.

**Claude Code + MiniMax:** Point Claude Code at MiniMax Anthropic-compatible endpoint (`https://api.minimax.io/anthropic`) with a **PAYG API key** (not MiniMax flat Token Plans — those use 5h/weekly windows and are a poor fit for agent loops). Prefer this over Cursor renew or Claude Pro for routine cost. Claude Pro is $20/mo or ~$17/mo annual ($200) — has annual, not monthly-only. Optional: also point Claude Code at local freellmapi (below).

**freellmapi** ([tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)): self-hosted OpenAI-compatible gateway that aggregates free provider tiers behind `/v1`. Not a hosted “sign up for a cloud URL.”

| Use | How | When |
|-----|-----|------|
| **Local Claude Code / tooling** | Run freellmapi on the dev machine; `base_url` = `http://localhost:3001/v1` + dashboard unified key | **Now** — no Cloudflare, no VPS |
| **Cloudflare Daruma Assistant** (`daruma.labcat.nz`) | Worker calls `FREELLMAPI_BASE_URL` — must be reachable from the edge. Plain Workers **cannot** run freellmapi (Node+SQLite app). | After always-on gateway exists |
| **Always-on gateway** | Cheap VPS (e.g. Hetzner) running freellmapi with public `/v1` | Phase 2-ish; pairs with OpenHands VPS |
| **Cloudflare Containers** | Possible later on Workers Paid ($5) — on-demand OK; always-on burns included GiB/vCPU hours then overages | Experiment only; not Phase 1 |

Phase 1 assistant ships **Google AI Studio + MiniMax** only. freellmapi appears in the model picker when `FREELLMAPI_BASE_URL` is set. Cold-start: Google Flash until then. Spark is optional later host — **not required** for freellmapi.

**OpenRouter free (Nemotron etc.):** NVIDIA-hosted trial — prompts/session logged to improve NVIDIA products. No confidential/personal data. RPM/concurrency caps → 429s; limits and the endpoint can change or vanish anytime. Paid twin: drop `:free` (e.g. `nvidia/nemotron-3-ultra-550b-a55b`); DeepInfra list ~$0.50/$2.20 per 1M in/out (provider-dependent). OpenRouter does not mark up token rates; fees are on **credit top-ups** (card 5.5% / $0.80 min; crypto 5%) and **BYOK** (5% after 1M req/mo).

**xAI Grok credits:** New-account ~$25 promo is often real — confirm in `console.x.ai` (expiry usually ~30 days). Ongoing **$150/mo data-sharing credits: treat as ended** (widely reported gone since ~May 2025); official billing docs only cover prepaid/invoice + promo codes. Do not budget Daruma on $150/mo unless your dashboard explicitly shows it.

### LLM caching (provider KV vs app cache)

**Provider KV / prompt cache** (Anthropic, MiniMax, OpenAI, etc.): inference engine keeps Key/Value tensors for a stable prompt prefix so multi-turn agent loops pay **cache-read** rates (e.g. MiniMax M3 ~$0.06/M) instead of full input. This lives in the provider’s GPU stack — **not** something Upstash Redis or Cloudflare KV can host (shipping tensors off-GPU each token would kill latency).

**Do for Daruma:** keep system/tool prefixes **deterministic** (no live timestamps, random IDs, or per-request noise in the cached prefix). Prefer PAYG providers that expose cheap cache reads for Claude Code–style loops.

**App-level cache** (Upstash Redis, Cloudflare KV, **Cloudflare AI Gateway**): cache **final text responses** for identical (or deliberately keyed) requests to skip the LLM entirely. AI Gateway supports exact-match response caching + TTL. Useful for repeated lookups / Opportunity Engine–style idempotent calls — **weak** for unique agentic turns (almost never exact duplicates).

**Do not:** confuse Redis “KV” with model KV cache, or expect Redis to cut MiniMax/Anthropic decode cost inside a tool loop.

Hosted "frontier for free" claims are usually trial credits, cherry-picked benchmarks, data-for-compute deals, or self-host requirements that need Spark-tier hardware. Verify before committing.

---

## Making Agents Actually Work

Lesson from the first Toolbox app: background agents still needed substantial manual testing. Fixes for every repo:

- **Scoped tasks** — micro-tickets, not "build the feature"
- **Definition of done** — tests pass, linter clean, specific acceptance criteria
- **`AGENTS.md` per repo** — stack rules, test commands, boundaries
- **CI from day one** — agent can run `pnpm test` and self-correct
- **UI verification** — Playwright (web monorepos), Maestro (mobile monorepos), or MCP; not founder-as-QA by default. Integration status: [`STACK.md`](STACK.md)

Multi-hour autonomous loops are an anti-pattern. Tight loops: read → edit → test → stop or one retry → escalate only if stuck or irreversible.

---

## Future: Creative Software + MCP

When DAWs and NLEs expose MCP endpoints (community servers exist for Resolve and Ableton today), Daruma on the network could assist with video/audio workflows on Keima — without running the LLM on the creative machine. Not a near-term priority.

---

## Open Questions

- Keima GPU — final choice when NZ stock and pricing are clearer
- RTX Spark vs DGX Spark — evaluate at purchase time (pricing, availability fall 2026+)
- Phase 2 VPS timing — after agent templates + CI/E2E prove out
- Phase 2 coding sandbox — OpenHands (default candidate) vs commercial cloud agents
- Messaging operator — skipped; Daruma Assistant is the control plane ([`DARUMA_ASSISTANT_PLAN.md`](DARUMA_ASSISTANT_PLAN.md))
- Phase 1 host — `daruma.labcat.nz`
- freellmapi — local Claude Code anytime; Cloudflare Daruma after Hetzner (or similar) public `/v1`
- Auto-merge gates — define exact CI/E2E/review checklist before enabling
- Framework lean — TanStack Start + Solid vs keep SvelteKit for Metal Monkey / Daruma web (decide before next greenfield web app)
- Metal Monkey vs `web.daruma.nz` — new web apps → Metal Monkey; brainstorm stays on `web.daruma.nz` for now (may migrate later)
- ElectricSQL + TanStack DB — medium-term for Daruma live agent/ops dashboards, not product v1 default
- DeerFlow timing — when long-horizon research deliverables justify the Docker overhead
