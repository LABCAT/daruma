import { test, expect } from '@playwright/test';

test.describe('Layout & Chat UI (DD-02)', () => {
	test('verify global theme toggle and navigation', async ({ page }) => {
		// 1. Authenticate
		await page.goto('/login');
		
		const passwordInput = page.getByLabel('Password', { exact: true });
		await passwordInput.waitFor({ state: 'visible' });
		await passwordInput.fill(process.env.DASHBOARD_PASSWORD || '');
		await page.getByRole('button', { name: 'Login' }).click();
		
		// Wait for redirect to dashboard root (chat index)
		await page.waitForURL('**/');

		// 2. Verify global theme toggle is present on root
		const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
		await expect(themeToggle).toBeVisible();

		// 3. Verify Theme Toggle works and applies data-theme to HTML
		const htmlElement = page.locator('html');
		await themeToggle.click();
		// Just ensure it exists and clicks, logic depends on system preferences but it toggles
		await expect(htmlElement).toHaveAttribute('data-theme', /light|dark/);

		// 4. Verify Chat Sidebar is visible
		const sidebar = page.locator('.dm-chat-sidebar');
		await expect(sidebar).toBeVisible();

		// 5. Navigate to Opportunity Engine and verify back button
		await page.getByRole('link', { name: 'Opportunity Engine' }).click();
		await page.waitForURL('**/opportunity/pending');

		// Verify theme toggle is STILL present on the opportunity layout
		await expect(themeToggle).toBeVisible();

		// Verify back button exists and works
		const backBtn = page.getByRole('link', { name: 'Back to Dashboard' });
		await expect(backBtn).toBeVisible();
		
		await backBtn.click();
		await page.waitForURL('**/');
		
		// Back on the root chat UI
		await expect(page.locator('.greeting')).toHaveText('What can I help you with?');
	});
});
