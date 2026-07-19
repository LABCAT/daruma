# Daruma — Personal AI Assistant

Daruma is the founder’s AI co-founder — the most powerful assistant in the universe, running **Metal Monkey Apps** (`metalmonkey.cc`): strategy, research, decisions, roadmap, and ops. Founder keeps creative direction.

**Not a product / never shipped.** Internal only. Public business brand = Metal Monkey Apps ([`BRANDS.md`](BRANDS.md)).

**Daruma does not code in chat.** Coding stays in Claude Code (local) and OpenHands (later). Daruma decides, documents, and dispatches.

See also: [`VISION.md`](VISION.md), [`GOALS.md`](GOALS.md), [`MODEL_COSTS.md`](MODEL_COSTS.md), [`projects/02-DASHBOARD.md`](projects/02-DASHBOARD.md).

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

A private AI orchestrator for the Metal Monkey business: always reachable, research-capable, decision-capturing, and able to dispatch coding/ops agents — without being the coding IDE itself.

### Operating mode

**Daruma pushes the plan forward.** Infer scope from docs and tracker; propose sensible defaults; execute tactical work without waiting for the founder.

**Founder approves irreversible actions:** spending, public-facing launches, brand/creative direction changes. **Code merges:** today coding agents open PRs; founder merges; future gated auto-merge per Stack layers — never auto for store submit / secrets / spend. **Knowledge/docs:** after founder confirms, write into the repo (working tree or GitHub API); PR optional for solo — same pattern as a research-intake Cursor session.

**Agents must not block on questions the docs already answer.** If ambiguous, pick the smallest shippable option and note it in `CURRENT.md` — founder can redirect.

---

### Stack layers

Daruma is layered tools, not one product. Each layer does one job.

| Layer | Tool (vision default) | When |
|-------|----------------------|------|
| **Control plane (day-to-day)** | **Dashboard** (`daruma.labcat.nz`) — Solid + Workers; OE section first, chat/decisions later ([`projects/02-DASHBOARD.md`](projects/02-DASHBOARD.md)) | Next: AG-01 layout move |
| **Coding (local)** | Claude Code + MiniMax PAYG + **Graphify** | Phase 0 |
| **Coding (remote sandbox)** | **OpenHands** (BYOK, Docker, issues→PR) — capability Daruma *dispatches*, not the chat UI | Phase 2 candidate |
| **Design-from-prompt** | **Open Design** + `DESIGN.md` — for **product/site repos** (e.g. metalmonkey.cc), not this command-center repo. Dashboard UI: Solid + SCSS/BEM ([`projects/02-DASHBOARD.md`](projects/02-DASHBOARD.md)). | When building those products |
| **Schedule / heartbeat** | **Cloudflare Workers** cron / Queues | Phase 0–2 |
| **Messaging operator** | Skip by default. OpenClaw/Hermes only if Telegram-as-UI is explicitly wanted later | Optional |
| **Security** | Fine-grained GitHub tokens; sandbox for remote coding; NemoClaw only if a third-party always-on holds creds | When agents get write access |
| **Deep research** | **DeerFlow** — optional later | Multi-hour research jobs |

**Custom vs off-the-shelf:** Day-to-day interaction is **custom-built** (Daruma Assistant). OpenHands is a coding engine to dispatch later. OpenClaw skipped unless messaging UI is wanted. Product design systems (Open Design / `DESIGN.md`, Astro+Solid tokens) live in the **product repo**, not here.

**PR / merge autonomy (future):** Goal is Daruma can open *and* merge when safe — not “merge everything.” Ladder: (1) open PRs only → (2) auto-merge behind hard gates (CI + E2E + scoped token; AI review when ready) → (3) never auto: spending, store submit, brand forks, prod secrets. Founder can always revoke. Mistakes are prevented by gates, not slogans.

- **DeerFlow** deferred, not rejected. Wire as a skill/MCP call when multi-hour research deliverables are worth it.
- **Free-pool routing:** build **first-party** into Daruma Assistant (`LLMProvider` + failover). Do not depend on freellmapi for Cloudflare. freellmapi remains **optional** local `/v1` for Claude Code only (see below).

### Knowledge / memory (RAG)

**Vector databases** (Pinecone, Qdrant, Weaviate, or **pgvector** on Neon) store embeddings so retrieval is by meaning, not keywords. They power **RAG**: fetch relevant chunks → feed the LLM → answer with private/fresh facts the model does not hold. ANN search makes that fast at scale.

**Caveats:** RAG reduces inventing-from-nothing; it does not eliminate hallucinations. Ops/cost grow with corpus size and re-embedding. Not every Daruma surface needs one.

**Models do not share memory — Daruma does.** Each API call gets a Daruma-built payload: core system prompt + retrieved knowledge/memories + recent thread (trimmed to the **active model’s** context window). Soft model affinity (preferred model per chat); switching/failover resends history — no provider-side session required.

**Always-in vs retrieve-on-demand:** decide after the assistant is running and measurable — do not over-design now.

**Vector DB ≠ chat cache.** Provider KV cache = GPU prefix reuse. App response cache = skip identical LLM calls. Vector/RAG = semantic search over docs/memories for retrieval. Phase 1 = **bundled knowledge** via `KnowledgeProvider` + D1 memories/decisions. Vector/RAG is a **later swap** when the corpus needs it. Prefer **pgvector on Neon** ([`GOALS.md`](GOALS.md)) before dedicated vector SaaS.

**Research before durable writes:** same standard as this command-center chat — read repo docs, verify with live search/primary sources when claims matter, then confirm → update git docs. Do not document from model vibes alone.

**When to move to vector/RAG** — Daruma proposes; founder redirects. Escalate only if it means new paid SaaS (Pinecone etc.) or irreversible data migration. Move when **2+** of these are true:

| Signal | Example |
|--------|---------|
| Bundle/context too big | Knowledge pack blows Worker size, context window, or routinely gets truncated |
| Retrieval misses | Agent often fails to find the right doc that exists; keyword/bundle search isn't enough |
| Corpus sprawl | Need to search research dumps, chat logs, or multi-repo notes — not just `docs/` + tracker |
| Stale sync tax | Rebuild/redeploy cycle can't keep up with how fast knowledge changes |
| Cost-per-task | Measuring shows RAG + smaller prompts beats stuffing the full bundle every turn |

**Not signals:** “industry standard,” wanting a graph UI, or a still-small `docs/` folder that fits cleanly in context.

Public hub: **`metalmonkey.cc`**. Day-to-day Daruma UI: **`daruma.labcat.nz`** ([`projects/02-DASHBOARD.md`](projects/02-DASHBOARD.md)).

### Phased roadmap

| Phase | When | What |
|-------|------|------|
| **0 — Now** | Current | **Coding default (post-Cursor):** Claude Code + MiniMax M3 PAYG (Anthropic-compatible BYOK — harness stays, model is cheap). Editor: VS Code (or Cursor free if usable). Do not renew Cursor expecting BYOK to keep Agent/Auto magic. Skip Claude Pro unless MiniMax quality fails. **Graphify** when context hurts; free/cheap APIs for research. Keep costs minimal until revenue covers them. |
| **1 — Keima** | Next hardware purchase | Creative + desk-side dev on x86/NVIDIA tower |
| **2 — Daruma lite** | After agent templates + CI/E2E prove out | Cheap VPS: **OpenHands** (BYOK coding sandbox) + Workers cron. OpenClaw only if messaging UI wanted. No auto-merge yet. |
| **3 — Daruma full** | When revenue justifies ~$5–7k NZD | Local 70B+ (Spark) + gated auto-merge where CI/E2E hold; NemoClaw if always-on holds creds |

Do not rush Phase 2 before agent templates and test harnesses are solid — infra without good task scoping wastes time.

### Model and tool strategy

**Principle:** Tool- and model-agnostic. Optimise for **cost per completed outcome**, not sticker $/MTok. Free first for Daruma chat; paid when free is rate-limited or quality fails. Re-evaluate monthly via [`MODEL_COSTS.md`](MODEL_COSTS.md).

| Tier | Options | Use |
|------|---------|-----|
| **Free** | Google AI Studio Flash; Groq; OpenRouter `:free`; xAI trial if console shows credits; same open weights across hosts with failover | Daruma everyday chat + bulk |
| **Budget paid** | **DeepSeek V4 Flash** (chat escalate); **MiniMax M3 PAYG** (**coding** via Claude Code); Qwen / Kimi / GLM as they win | Daily workhorse |
| **Strong / frontier** | Gemini Pro; Grok 4.5; Kimi K3; Anthropic — only when cost-per-task wins | Hard judgment / research |
| **Local** | Keima GPU (small); Spark (70B+) | Phase 1 / 3 |

**Chat defaults (Daruma Assistant):** Gemini Flash (free) → escalate to DeepSeek / Qwen / Kimi / GLM / Gemini Pro / Grok 4.5. **MiniMax is not the chat default** — it remains the Claude Code cheap coding harness.

**Prices:** live table in [`MODEL_COSTS.md`](MODEL_COSTS.md) (BenchLM + Artificial Analysis). Do not duplicate full boards here.

**Usage / cost tracking:** Per-turn tokens + estimated USD + context used/max (active model). Roll up to conversation; later tag OpenHands `task_id` for cost-per-task. Usage route/dashboard required. Free “tokens remaining” only when a provider exposes it — else show observed usage + 429/failover.

**UI:** Model dropdown (enabled models only). Settings → enable/disable models + preferred free failover order. No Claude-style effort/thinking toggles in Phase 1 (optional later per provider).

**Claude Code + MiniMax:** Point at MiniMax Anthropic-compatible endpoint (`https://api.minimax.io/anthropic`) with a **PAYG** key (not flat Token Plans). Prefer over Cursor renew / Claude Pro for routine coding cost.

**freellmapi** ([tashfeenahmed/freellmapi](https://github.com/tashfeenahmed/freellmapi)): optional **local** OpenAI-compatible free-tier aggregator for Claude Code (`localhost:3001/v1`). **Not** required for Daruma Assistant — Assistant owns multi-provider routing + failover in-process. Plain Workers cannot run freellmapi; do not block Assistant on Hetzner/public `/v1`.

**OpenRouter free:** Useful failover capacity; RPM caps; some hosts log prompts (e.g. NVIDIA trial) — no confidential data. Fees on credit top-ups / BYOK, not token markup.

**xAI Grok credits:** Confirm in `console.x.ai`. Do not budget ended promo credits.

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

### Loops (wording)

| Term | Meaning |
|------|---------|
| **Agent loop** | Built-in: model → tools → results → repeat. Always on in Claude Code / Cursor agents — not something you enable |
| **`/loop` (or similar)** | Session scheduler: re-fire a prompt on an interval. Cron-in-chat — not the “keep coding until green” brain |
| **Closed-loop completion** | What we want: implement → run Playwright/Maestro/CI → fix → repeat until green → open PR for short review |

Neither Cursor nor Claude Code is a guaranteed infinite self-healing CI robot (budgets, flaky E2E, ambiguous failures). Target: **bounded** 1–N fix cycles with explicit pass criteria — not multi-hour unattended thrash.

Multi-hour autonomous loops are an anti-pattern. Tight loops: read → edit → test → stop or one retry → escalate only if stuck or irreversible.

**Long-term:** Daruma **orchestrates** (dispatch OpenHands / cloud agents, require green CI+E2E before PR-ready). Individual coding tools are interchangeable engines — see Phase 2 in this doc + [`AI_EXPLORATION.md`](AI_EXPLORATION.md).

---

## Future: Creative Software + MCP

When DAWs and NLEs expose MCP endpoints (community servers exist for Resolve and Ableton today), Daruma on the network could assist with video/audio workflows on Keima — without running the LLM on the creative machine. Not a near-term priority.

---

## Open Questions

- Keima GPU — final choice when NZ stock and pricing are clearer
- RTX Spark vs DGX Spark — evaluate at purchase time (pricing, availability fall 2026+)
- Phase 2 VPS timing — after agent templates + CI/E2E prove out
- Phase 2 coding sandbox — OpenHands (default candidate) vs commercial cloud agents
- Messaging operator — skipped; dashboard is the control plane ([`projects/02-DASHBOARD.md`](projects/02-DASHBOARD.md))
- Phase 1 host — `daruma.labcat.nz`
- freellmapi — optional local Claude Code only; Assistant uses first-party free router
- MODEL_COSTS.md — monthly refresh (BenchLM / AA); automate later
- Auto-merge gates — define exact CI/E2E/review checklist before enabling — see [`projects/07-CI-AND-REGRESSION.md`](projects/07-CI-AND-REGRESSION.md)
- Framework lean — Metal Monkey `apps.*` later (Tanuki first); Daruma dashboard = TanStack Start + Solid (locked)
- Migrate legacy `web.daruma.nz` apps to `*.metalmonkey.cc` when worth it
- ElectricSQL + TanStack DB — later for Daruma multi-agent live ops (state in Postgres), not AG-01–08 / not product default
- DeerFlow timing — when long-horizon research deliverables justify the Docker overhead
