# AI Exploration

Last updated: 2026-07-19

---

## Agent / coding harnesses

| Link | Note |
|------|------|
| [OpenHands](https://github.com/OpenHands/OpenHands) | Remote coding sandbox — Daruma Phase 2 candidate |
| [obra/superpowers](https://github.com/obra/superpowers) | Full methodology (plan → TDD → subagents). **Don't fork.** Diff ideas into `.agents/skills/` only if they fit Daruma (see below). |
| [BuilderIO/skills](https://github.com/BuilderIO/skills) | À la carte hygiene/orchestration. **Don't fork.** Same adapt-in-place rule. Lighter fit than superpowers for 100 micro-apps. |
| [garrytan/gstack](https://github.com/garrytan/gstack) | Multi-agent “virtual team” — deferred until parallel-app pain |
| [affaan-m/ecc](https://github.com/affaan-m/ecc) | ECC-style agent tooling |
| [free-claude-code](https://github.com/Alishahryar1/free-claude-code) | Free / alternate Claude Code path — evaluate vs MiniMax + freellmapi |
| [claude-pulse](https://github.com/nikitadoudikov/claude-pulse) | **Best match for XDA write-up:** local Claude Code dashboard — tokens/cost, context fill, live session, phone approve via ntfy. ([XDA](https://www.xda-developers.com/stopped-wasting-claude-tokens-after-installing-open-source-dashboard/)) Alternate analytics-only: [cc-lens](https://github.com/Arindam200/cc-lens) (more stars, no mobile approve). |

### Skills libraries — stance (decided)

- Keep Daruma’s own `.agents/skills/` + `AGENTS.md` (cross-tool). Do not adopt their plugin packaging.
- **Superpowers:** heavy/prescriptive. Candidate gaps to evaluate later: systematic-debugging, TDD / verification-before-completion. Skip full worktree-per-task pipeline for tiny micro-apps.
- **BuilderIO/skills:** better à la carte fit. Candidate ideas: efficient-frontier (cheap agent / expensive judge), plow-ahead (log assumptions + proceed), read-the-damn-docs. Watch hosted deps on `/visual-plan`.
- Next action when ready: agent reviews both repos vs our skills → plan only (a/b/c per skill) → founder sanity-check → then write.

## Design → code

| Link | Note |
|------|------|
| [Open Design](https://open-design.ai/) | Design-from-prompt — product repos, not this command center |
| [Figma ↔ GitHub (VentureBeat)](https://venturebeat.com/technology/are-designers-the-new-swes-figma-makes-new-two-way-github-integration-turns-designs-into-live-production-code-with-built-in-governance) | Two-way Figma/GitHub production code |

## Creative / audio / visual

| Link | Note |
|------|------|
| [Waves Illugen](https://www.waves.com/illugen) | Generative audio |
| Arpeggiator VST | (name only — add store URL when known) |
| [CodePen arpeggiator](https://codepen.io/jak_e/full/qNrZyw) | Web arpeggiator demo |
