# Agent standing rules (all AG prompts)

1. **Do not stop for founder questions.** Docs + defaults. One PR per AG; then next AG.
2. **No visual approve gate.** `DESIGN_BRIEF.md` is taste law.
3. **Local secrets:** `apps/dashboard/.dev.vars` (gitignored). Prod secrets only AG-09.
4. **Prod Cloudflare:** AG-09 Part B only; else `CUTOVER.md`.
5. **Pin versions** (`^x.y.z`). Never `"latest"`.
6. **CI harness is AG-00/00b only.** Later AGs **fill test slots** under existing scripts/jobs (`07-CI-AND-REGRESSION.md`). Do not add ad-hoc workflows. Do not delete jobs. Turn `skip` → real asserts when the feature lands.
7. **Evidence:** PR shows tests added to the harness + Actions green.
