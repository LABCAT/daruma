# Daruma — Personal AI Assistant

Daruma is the founder's personal AI co-founder: always-on grunt work, marketing research, app development, and operations — while the founder retains final control of creative direction and business decisions.

**Not a product.** Daruma is for internal use only. `daruma.nz` remains the parent brand domain, not a SaaS platform for others.

See also: [`VISION.md`](VISION.md) (business strategy), [`GOALS.md`](GOALS.md) (founder learning).

---

## Roles

| Name | Role |
|------|------|
| **Founder** | CEO — creative direction, final decisions, review and approval |
| **Daruma** | AI assistant — development, research, marketing grunt work, 24/7 when infra allows |
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

A private Jarvis: running continuously, working on the business (code, research, marketing tasks), reachable from anywhere for questions and decisions. Founder approves anything irreversible (merges, spending, public-facing changes).

### Remote access

Prefer existing channels over building a custom web app:

- **OpenClaw** (or **NemoClaw** for sandboxed execution) with Telegram, Slack, or similar
- `daruma.nz` stays the parent brand site — a personal command-center web UI is optional and low priority vs paying for proven background-agent tools in the near term

### Phased roadmap

| Phase | When | What |
|-------|------|------|
| **0 — Now** | Current | Paid IDE background agents for dev grunt work; free/cheap cloud APIs for experimentation. Keep costs minimal until revenue covers them. |
| **1 — Keima** | Next hardware purchase | Creative + desk-side dev on x86/NVIDIA tower |
| **2 — Daruma lite** | After Keima or in parallel if cheap | Small Linux VPS (~$6–12/mo) running OpenClaw or NemoClaw; one narrow cron job (e.g. weekly idea research), not full autonomy |
| **3 — Daruma full** | When revenue justifies ~$5–7k NZD | RTX Spark or DGX Spark (128GB unified memory) for local 70B+ models; OpenClaw + NemoClaw; no per-token API costs at scale |

Do not rush Phase 2 before agent templates and test harnesses are solid — infra without good task scoping wastes time.

### Model and tool strategy

**Principle:** use whatever background-agent + model combo is cheapest and good enough this quarter. Re-evaluate providers regularly — this space moves fast.

Categories (no vendor lock-in):

- **Paid background agents** — IDE-hosted async workers (prompt → PR while you sleep)
- **Free/cheap API tiers** — Groq, Google AI Studio, NVIDIA NIM (rate limits, not credits), MiniMax trial credits, etc.; good for experiments, unreliable as sole 24/7 brain
- **Local inference** — Keima GPU for small models; Spark for large models

Hosted "frontier for free" claims (social media, blog posts) are usually trial credits, cherry-picked benchmarks, or self-host requirements that need Spark-tier hardware. Verify before committing.

---

## Making Agents Actually Work

Lesson from the first Toolbox app: background agents still needed substantial manual testing. Fixes for every repo:

- **Scoped tasks** — micro-tickets, not "build the feature"
- **Definition of done** — tests pass, linter clean, specific acceptance criteria
- **`AGENTS.md` per repo** — stack rules, test commands, boundaries
- **CI from day one** — agent can run `pnpm test` and self-correct
- **Browser/UI verification** where needed — Playwright or MCP, not founder-as-QA by default

Multi-hour autonomous loops are an anti-pattern. Tight loops: read → edit → test → stop or one retry → escalate to founder.

---

## Future: Creative Software + MCP

When DAWs and NLEs expose MCP endpoints (community servers exist for Resolve and Ableton today), Daruma on the network could assist with video/audio workflows on Keima — without running the LLM on the creative machine. Not a near-term priority.

---

## Open Questions

- Keima GPU — final choice when NZ stock and pricing are clearer
- RTX Spark vs DGX Spark — evaluate at purchase time (pricing, availability fall 2026+)
- Phase 2 VPS timing — after agent templates prove out on paid bg agents
- Provider evaluation — MiniMax, GLM, Groq, etc.; track in prompts or a quarterly check, not in this doc
