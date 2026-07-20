---
name: agent-documentation
description: >-
  Length and structure rules for README, AGENTS.md, and agent-facing docs.
  Use when creating or editing README.md, AGENTS.md, CLAUDE.md, docs for agents,
  or when the user asks how long agent docs should be.
paths:
  - "**/README.md"
  - "**/AGENTS.md"
  - "**/CLAUDE.md"
  - "docs/**/*.md"
  - ".agents/**/*.md"
---

# Agent-facing documentation

Agents load these files into limited context. Longer ≠ smarter.

## Length targets

| File | Target | Soft max |
|------|--------|----------|
| `README.md` | 50–150 lines | ~200 |
| Root `AGENTS.md` | &lt;150 lines | ~300 |
| Nested `AGENTS.md` | 30–80 lines | ~150 |
| Skills (`SKILL.md`) | focused body | &lt;500 lines; put detail in `references/` |

## What belongs where

- **`.agents/rules/`** — **agent rules** (tool-agnostic). Cursor, Claude, Copilot, etc. all read these. Never put rules in `.cursorrules` / IDE-only files.
- **README** — what it is, how to run, links to `AGENTS.md` / `docs/`. Humans first.
- **AGENTS.md** — short index: pointers to `.agents/rules/`, commands, boundaries. Not the rule dump.
- **docs/** — deep specs; link from AGENTS.md / rules, do not paste in.
- **`.agents/skills/`** — invokable workflows (progressive disclosure).

## Rules

- Prefer pointers (`docs/FOO.md`, `.agents/rules/…`) over copying content into AGENTS.md / README
- Do not duplicate what the codebase or linter already enforces
- Do not auto-generate bloated AGENTS.md / README “overviews”
- When a file grows past soft max: split (nested AGENTS.md, `docs/`, or skill `references/`) — do not keep padding the root
- Match this repo’s style: short, technically specific, no fluff
- **Never** invent Cursor-only / IDE-only rule files — use `.agents/rules/`

## No stub / redirect-only docs

**Never** create a markdown file whose only job is “Moved — see other file.”

- On rename/move: **delete** the old path; update inbound links to the new path
- Folder `README.md` may be a short **index of real docs** (table of contents) — that is content, not a stub
- Do not leave `# Moved` / “Superseded, go here” placeholders “so old links don’t break” — fix the links instead
