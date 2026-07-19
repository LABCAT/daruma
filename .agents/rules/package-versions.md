---
name: package-versions
description: >-
  Never use "latest" (or *) for npm/pnpm package versions. Pin with semver.
  Use when editing package.json, adding dependencies, or running package installs.
paths:
  - "**/package.json"
  - "**/pnpm-lock.yaml"
  - "**/package-lock.json"
---

# Package versions — pin with semver

Want current packages; never the floating tag `latest`.

## Rules

- **Never** write `"latest"`, `"*"`, or unpinned tags (`next`, `canary`, `beta` without a version) in `package.json`
- **Do** pin with semver: exact (`1.9.5`) or caret/tilde of a real version (`^1.9.5`, `~1.9.5`)
- When adding a dep: resolve the current version (`pnpm view <pkg> version`), then write that semver into `package.json`
- Prefer matching the repo’s existing range style (`^` vs exact) in the same `package.json`

```json
// BAD
"vite": "latest"

// GOOD
"vite": "^6.3.5"
```
