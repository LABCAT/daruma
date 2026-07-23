---
name: agent-testing
description: >-
  Testing standards and guidelines for robust tests.
  Use when writing, modifying, or reviewing tests.
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Standards

When writing tests in Daruma, **do not just write tests to make the CI pass** (the "happy path"). You must write production-grade, robust tests that verify real-world edge cases.

## Must

- **Mandatory Test Coverage**: Agents MUST NEVER write new features, modify existing logic, or fix bugs without simultaneously writing or updating the corresponding automated tests (Unit and/or E2E) to cover that specific code path. If you create a new UI feature, you must write a Playwright E2E test for it.
- **Mandatory Pre-Commit Verification**: You MUST run the ENTIRE test suite to verify all code changes BEFORE running any `git commit` or `git push` command. This means you must run BOTH `pnpm run test` (unit tests) AND `pnpm run test:e2e` (end-to-end tests) regardless of how simple the change is or how urgent the user's prompt seems.

- **Test Edge Cases**: Always test what happens when data is missing, malformed, below threshold, or out of bounds.
- **Test Failure States**: Verify how the system handles exceptions, network failures, or API limits. If a scraper fails, assert that the system recovers or retries gracefully.
- **Test Idempotency**: Verify that running the exact same function, queue message, or DB insertion twice does not corrupt data, throw uncaught errors, or create duplicate records.
- **Assert Safeties**: When testing Queue Workers, explicitly assert that `msg.retry()` is called on failure and `msg.ack()` is only called on definitive success.

## Must not

- Do not write trivial tests just to satisfy a checklist or get a green build.
- Do not assume external dependencies (DBs, external APIs, scrapers) will always return success.

## Patterns

- Explicitly wipe DB state (`DELETE FROM ...`) at the start of tests to prevent test pollution.
- Use Cloudflare's `cloudflare:test` `waitOnExecutionContext` for worker tests to ensure all async work finishes before asserting.
- Create explicit mock failure states (e.g., `vi.mocked(api).mockRejectedValueOnce(...)`) to force error handling paths.
