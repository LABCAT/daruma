# AG-02 — Design system check (no founder gate)

Paste after **AG-02a**. Read `AGENT-RULES.md`.

`DESIGN_BRIEF.md` is **already filled** — obey it. Tokens/components likely already exist; this is **verify + gap-fill**, not a redesign.

## Goal

On the **SvelteKit app**, confirm:

1. `src/styles/` tree + `--dm-*` only in `variables.scss` (no class selectors there)
2. modern-normalize → variables → mixins → base
3. Co-located BEM `dm-` components (`.svelte` + `*.scss`); `/design` preview shows type, colour, space, button/input/table sample
4. `DESIGN.md` documents tokens + how to add a component

If anything missing vs brief (light/dark, Inter, bold borders, Daruma red `#A32D2D`, etc.), **fix it** — do not ask.

## Do NOT

Stop for approval. Storybook, Tailwind, CSS Modules, kits, v0 conversion, auth, OE UI.

## Tests

None beyond AG-02a build slot. Do not weaken CI.

## Verification

Tree + `/design` note. Then **immediately proceed to AG-03**.
