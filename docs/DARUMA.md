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

**Founder approves only irreversible actions:** spending, public-facing launches, brand/creative direction changes, **merges to main** (Daruma opens PRs only — founder merges).

**Agents must not block on questions the docs already answer.** If ambiguous, pick the smallest shippable option and note it in `CURRENT.md` — founder can redirect.

---

### Stack layers

Daruma is layered tools, not one product. Each layer does one job.

| Layer | Tool | When |
|-------|------|------|
| **Coding** | Any IDE/cloud coding agent + **Graphify** (repo knowledge graph) | Phase 0 |
| **Always-on** | **OpenClaw** or **Hermes** — Telegram, cron, messaging gateway | Phase 2 VPS |
| **Security** | **NemoClaw** — sandbox wrapper for OpenClaw/Hermes when agents hold real creds | Phase 2+ |
| **Deep research** | **DeerFlow** — multi-agent task factory (reports, long research jobs) | Later, optional |

- **OpenClaw** — more channels, bigger skill ecosystem; audit community skills before installing.
- **Hermes** — self-improving skill loop (disabled by default); alternative at Phase 2. Reliability claims vs OpenClaw are unverified — pick at setup time.
- **NemoClaw** is not a runtime — it hardens OpenClaw or Hermes inside NVIDIA OpenShell sandboxes.
- **DeerFlow** deferred, not rejected. No native messaging; heavy Docker setup. Add when multi-hour research deliverables are worth it; wire as a skill/MCP call from the always-on layer.

`daruma.nz` stays the parent brand site — a personal command-center web UI is optional and low priority.

### Phased roadmap

| Phase | When | What |
|-------|------|------|
| **0 — Now** | Current | Scoped dev tasks via **whatever coding agent is best value** (Cursor, Antigravity, Copilot, etc.); **Graphify** in repos when context hurts; Groq / Google AI Studio for cheap research. Keep costs minimal until revenue covers them. |
| **1 — Keima** | Next hardware purchase | Creative + desk-side dev on x86/NVIDIA tower |
| **2 — Daruma lite** | After agent templates prove out | Linux VPS (~$6–12/mo) running **OpenClaw or Hermes**; one narrow cron job (e.g. weekly idea research), not full autonomy. Add **NemoClaw** if the agent gets GitHub or API creds. |
| **3 — Daruma full** | When revenue justifies ~$5–7k NZD | RTX Spark or DGX Spark (128GB unified memory) for local 70B+ models; always-on layer + NemoClaw; no per-token API costs at scale |

Do not rush Phase 2 before agent templates and test harnesses are solid — infra without good task scoping wastes time.

### Model and tool strategy

**Principle:** 100% tool-agnostic — best performance per dollar each quarter, no single primary IDE or agent. Re-evaluate quarterly.

| Tier | Options | Use |
|------|---------|-----|
| **Free** | Groq, Google AI Studio | Experiments only — rate limits break 24/7 loops |
| **Budget paid** | MiniMax M3, DeepSeek V4 Flash | API workhorse when free tiers hit limits |
| **Critical coding** | Best model available via whichever tool hosts it | High-stakes work only |
| **Local** | Keima GPU (small models); Spark (70B+) | Phase 1 / 3 |

Hosted "frontier for free" claims are usually trial credits, cherry-picked benchmarks, or self-host requirements that need Spark-tier hardware. Verify before committing.

---

## Making Agents Actually Work

Lesson from the first Toolbox app: background agents still needed substantial manual testing. Fixes for every repo:

- **Scoped tasks** — micro-tickets, not "build the feature"
- **Definition of done** — tests pass, linter clean, specific acceptance criteria
- **`AGENTS.md` per repo** — stack rules, test commands, boundaries
- **CI from day one** — agent can run `pnpm test` and self-correct
- **Browser/UI verification** where needed — Playwright or MCP, not founder-as-QA by default

Multi-hour autonomous loops are an anti-pattern. Tight loops: read → edit → test → stop or one retry → escalate only if stuck or irreversible.

---

## Future: Creative Software + MCP

When DAWs and NLEs expose MCP endpoints (community servers exist for Resolve and Ableton today), Daruma on the network could assist with video/audio workflows on Keima — without running the LLM on the creative machine. Not a near-term priority.

---

## Open Questions

- Keima GPU — final choice when NZ stock and pricing are clearer
- RTX Spark vs DGX Spark — evaluate at purchase time (pricing, availability fall 2026+)
- Phase 2 VPS timing — after agent templates prove out on scoped coding agents
- Phase 2 runtime — OpenClaw vs Hermes (decide at VPS setup)
- DeerFlow timing — when long-horizon research deliverables justify the Docker overhead
