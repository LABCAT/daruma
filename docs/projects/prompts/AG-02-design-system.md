# AG-02 — Design system (founder-gated)

Paste only after AG-01. **Do not start AG-03 until the founder has approved the look/feel.**

## Context

Read: `docs/projects/02-DASHBOARD.md` (styles locked: SCSS + BEM, rem/px rules, no CSS Modules, no component library).

**Also read and obey** `docs/projects/DESIGN_BRIEF.md` — founder taste. If the brief is empty/unfilled, **stop** and ask the founder to fill it before generating tokens.

## Goal

Create the dashboard **design foundation** in `apps/dashboard` (package may be created here if AG-01 did not):

1. **Design tokens** as SCSS variables (or CSS custom properties): colour, type scale, spacing, borders, focus — no Tailwind
2. **Base/reset** + a few **BEM** layout primitives (e.g. page shell, stack, cluster) — not a full component library
3. **One preview route** (e.g. `/design` or `/dev/tokens`) showing type, colours, spacing, a sample button/input/table row — enough to judge feel
4. Document tokens in a short `apps/dashboard/DESIGN.md` (or `docs/projects/` note) so later AG prompts reuse them

## Founder involvement (required)

Before marking this AG done:

1. Antigravity opens a PR (or preview) with the `/design` route
2. **Founder reviews** in browser and redirects (contrast, density, type, mood)
3. Antigravity applies one revision pass from that feedback
4. Founder says **approved** → only then AG-03

## Do NOT

- Storybook
- Generate React/Tailwind in v0/Figma Make and “convert”
- Bits UI / Kobalte / large headless kits
- Build login, OE tables, or chat UI here

## Verification (raw evidence)

1. Token file(s) + BEM primitive partials
2. Preview route screenshot or HTML sample
3. Explicit note: **founder approved** (or list of founder redirects applied)
