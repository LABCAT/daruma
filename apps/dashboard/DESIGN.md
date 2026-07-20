# Dashboard Design System

This document outlines the foundation of the Daruma dashboard design system.

## Tokens (CSS Variables)
All design tokens are defined in `src/styles/variables.scss` as CSS custom properties on `:root` and prefixed with `--dm-`.

### Colors
- `--dm-color-bg`: Background (Light/Dark mode responsive)
- `--dm-color-text`: Text color (Light/Dark mode responsive)
- `--dm-color-surface`: Alternate background for cards/rows
- `--dm-color-border`: Standard border color
- `--dm-color-primary`: Brand Red (`#A32D2D`)
- `--dm-color-secondary`: Gold (`#D4A017`)
- `--dm-color-tertiary`: Orange (`#D85A30`)
- `--dm-color-danger`: Deep Red (`#791F1F`)
- `--dm-color-success`: Muted Green (`#2e7d32`)

### Typography
- Font Family: Inter (`--dm-font-family`)
- Sizes: `--dm-font-size-sm` up to `--dm-font-size-xxl`. All use the `to-rem()` function.
- Weights: `--dm-font-weight-regular` (400) and `--dm-font-weight-bold` (700)

### Shape & Space
- Generous whitespace: `--dm-space-1` through `--dm-space-8`
- Radii: `--dm-radius-sm` through `--dm-radius-lg` (soft/rounded corners)
- Borders: `--dm-border-width-base` (2px) and `--dm-border-width-thick` (4px). Bold borders contrast with soft corners.

## Component Creation Process (AG-03+)

Agent rule: [`.agents/rules/dashboard-svelte.md`](../../.agents/rules/dashboard-svelte.md).

When creating new UI elements in `apps/dashboard/src/lib/components/`, strictly follow these BEM conventions:

1. **Folder Structure**: One folder per component (e.g. `card/`).
2. **Files**: Create `Card.svelte` and a co-located `Card.scss`.
3. **BEM Prefix**: Use the `.dm-` prefix. (e.g. `.dm-card`, `.dm-card__header`, `.dm-card--active`).
4. **Importing Styles**: Co-located SCSS is the **first** import in `<script>` (`import "./Card.scss";`), then types/modules. No `<style>` block for design rules.
5. **No CSS Modules or Tailwind**: Rely entirely on the global CSS custom properties for styling. Do not use inline styles for design rules.
