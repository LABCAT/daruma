import { test, expect } from '@playwright/test';

test.describe('Opportunity Engine (AG-08)', () => {
	test.beforeEach(async ({ context }) => {
		// Grant clipboard permissions for testing Copy Top 5
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	});

	test('login and comprehensive pending list interactions', async ({ page, request }) => {
		// 1. Authenticate
		await page.goto('/login');
		
		const passwordInput = page.getByLabel('Password', { exact: true });
		await passwordInput.waitFor({ state: 'visible' });
		await passwordInput.fill(process.env.DASHBOARD_PASSWORD || '');
		await page.getByRole('button', { name: 'Login' }).click();
		
		// Wait for redirect to dashboard root
		await page.waitForURL('**/');

		// 2. Navigate & Verify Seeding (Idempotency of Seeding)
		await page.goto('/opportunity');
		await expect(page.locator('h1.dm-opportunity__title')).toHaveText('Opportunity Engine');

		const listItems = page.locator('li.dm-opportunity__item');
		let count = await listItems.count();
		
		// If seeding worked, count > 0.
		expect(count).toBeGreaterThan(0);
		const initialSeedCount = count;

		// Re-visit the page to ensure seeding doesn't double-insert
		await page.goto('/opportunity');
		await expect(page.locator('h1.dm-opportunity__title')).toBeVisible();
		count = await listItems.count();
		expect(count).toBe(initialSeedCount);

		// 3. Test Bulk Action ("Copy Top 5") & Failure Recovery Simulation
		const copyBtn = page.getByRole('button', { name: 'Copy Top 5' });
		await expect(copyBtn).toBeVisible();
		await expect(copyBtn).toBeEnabled();

		await copyBtn.click();
		
		// Wait for items to be removed (top 5 sent to synthesis)
		const expectedCountAfterCopy = Math.max(0, initialSeedCount - 5);
		await expect(listItems).toHaveCount(expectedCountAfterCopy);

		// Verify clipboard content
		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText.split('\n').length).toBeLessThanOrEqual(5);
		expect(clipboardText.length).toBeGreaterThan(0);

		// 4. Test Per-Row Actions (Build, Research, Skip)
		if (expectedCountAfterCopy > 0) {
			const firstItem = listItems.first();
			const buildBtn = firstItem.getByRole('button', { name: 'Build' });
			await buildBtn.click();
			
			// UI optimistic update removes it immediately
			await expect(listItems).toHaveCount(expectedCountAfterCopy - 1);
		}

		// 5. Test Error Handling & Idempotency of API directly
		// What happens if we send invalid status?
		const invalidPatch = await page.request.patch('/api/opportunity', {
			data: { updates: [{ id: 'non-existent', status: 'invalid_status' }] }
		});
		expect(invalidPatch.status()).toBe(400);

		// Valid patch but missing ID
		const validPatchIdempotent = await page.request.patch('/api/opportunity', {
			data: { updates: [{ id: 'missing-id-1234', status: 'skip' }] }
		});
		// D1 batch update for missing IDs just affects 0 rows, should return 200 success
		expect(validPatchIdempotent.status()).toBe(200);
	});
});
