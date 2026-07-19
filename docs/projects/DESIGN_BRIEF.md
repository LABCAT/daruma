# Dashboard design brief (founder)

Fill this **before** Antigravity runs [`prompts/AG-02-design-system.md`](prompts/AG-02-design-system.md).
Antigravity: treat this as taste source of truth; do not invent a competing aesthetic.

Internal tool (`daruma.labcat.nz`) — command center, not a marketing site. Still: it should feel intentional and yours.

---

## Mood (3–5 words)

- Futuristic, sleek, zen, magical, light — but restrained. Avoid the generic "AI neon" aesthetic (no glow, no purple/cyan gradients, no glassmorphism). Think precision instrument or a minimalist spellbook rather than a sci-fi HUD.

## References (optional)

- Linear (app + site) — spare, fast, no clutter
- Vercel dashboard, Railway.app, Raycast — command-center-for-developers territory

## Colour

- Overall: **light and dark** — theme switch driven by CSS `prefers-color-scheme` / system setting. Default preference is light, but dark should be fully supported for v1.
- Background: black / white base
- Text / primary: black / white base, brand red as primary accent
- Accent (sparingly): Daruma red `#A32D2D` (primary), gold `#D4A017` (secondary), orange `#D85A30` (tertiary, used sparingly)
- Danger / success: Danger = deep red `#791F1F`, **outline style** (border only, no fill) so it never gets confused with solid primary red. Success = green (muted/forest tone, not neon) — reserved exclusively for success/confirmation states, never used elsewhere as a UI color.
- **Avoid:** neon glow, purple/cyan AI-product gradients, glassmorphism, full solid-red backgrounds (red is an accent, not a wash)

## Type

- Feel: geometric — **Inter**
- Headings vs body: **high contrast** — headings notably bigger than body, and **bold** weight. Body stays regular weight.
- Web font: Inter (loaded, not system stack)

## Density & layout

- **Airy** — generous whitespace, not a packed ops-dashboard grid
- Max content width: **flexible per route** — wide/full-bleed for data-heavy views (tables, multi-column), capped/narrower for forms and settings-style views
- Corners: **soft** (rounded)
- Borders: **strong/bold** — almost cel-shaded in crispness, without going full comic-book. Pairs with the soft corners (bold outlines on rounded shapes).

## Components (v1 only what AG-02 needs)

Preview route should show: type scale, colours, spacing, one button, one input, one table row.

- Buttons: **kept simple, few styles** (matching Claude's own restrained button usage) —
  - Primary: solid red
  - Secondary: solid gold
  - Tertiary: solid orange (used sparingly, may barely appear in v1)
  - Danger: outline style, red border, no fill
- Tables: **striped rows**, header row uses solid **gold** background, soft-rounded corners, bold/strong borders
- **No:** cards everywhere, pill clusters, floating badges on heroes, full-bleed red backgrounds

## Motion

- **Minimal** — subtle only (e.g. quick hover/state transitions). No decorative motion, no glow/pulse effects.

## Do / don't

| Do | Don't |
|----|--------|
| Use red as a precise, sparing accent (primary actions only) | Use red as a background wash or dominant fill |
| Keep danger (deep red, outline) and success (green) visually distinct from brand colours | Let danger red visually collide with primary red |
| Bold borders on soft/rounded shapes | Full comic/cel-shaded illustration style |
| Generous whitespace, airy layout | Dense ops-dashboard packing |
| Gold table headers, striped rows | Cards for tabular data |

## Founder sign-off

- [x] Brief filled
- [ ] AG-02 preview reviewed in browser
- [ ] Revisions done (if any)
- [ ] **Approved for AG-03** — date: ____