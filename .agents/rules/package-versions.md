---
name: package-versions
description: >-
  Never use "latest" (or *) for npm/pnpm package versions. Pin with semver at
  the current stable release. Use when editing package.json, adding dependencies,
  or running package installs.
paths:
  - "**/package.json"
  - "**/pnpm-lock.yaml"
  - "**/package-lock.json"
---

# Package versions — pin current stable

Want **current stable** packages; never the floating tag `latest`.

## Rules

- **Never** write `"latest"`, `"*"`, or unpinned tags (`next`, `canary`, bare `beta`) in `package.json`
- **Always** resolve the current stable release before adding or bumping: `pnpm view <pkg> version`
- **Do** pin with semver: exact (`8.1.5`) or caret of that release (`^8.1.5`)
- **Never** copy an old major from another package, scaffold, or memory (e.g. `^6.0.0` when npm shows 8.x) — re-check npm every time
- Prefer matching the repo’s existing range style (`^` vs exact) in the same `package.json`

```json
// BAD — floating tag
"vite": "latest"

// BAD — stale major without checking npm
"vite": "^6.0.0"

// GOOD — checked npm today, pinned semver
"vite": "^8.1.5"
```

## When upgrading

1. `pnpm view <pkg> version` (or the package’s npm page)
2. Write `^<that version>` in `package.json`
3. `pnpm install` and run the app’s build/test
