import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'list',
	use: {
		...devices['Desktop Chrome'],
		baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:8789',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'pnpm exec wrangler pages dev .svelte-kit/cloudflare --ip 127.0.0.1 --port 8789 --persist-to=.wrangler/state/e2e',
		url: 'http://127.0.0.1:8789',
		reuseExistingServer: false,
		env: { CI: '1' }
	}
});
