import { test, expect } from "@playwright/test";

/**
 * E2E slot — AG-08: login + OE pending list.
 * Skipped until auth + UI exist so the harness job stays green.
 */
test.describe("dashboard e2e (slot)", () => {
  test.skip(true, "AG-08: enable when login + /opportunity exist");

  test("login and pending list", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });
});
