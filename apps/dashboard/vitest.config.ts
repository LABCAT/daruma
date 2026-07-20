import { defineConfig } from 'vitest/config';
import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		cloudflareTest({
			wrangler: { configPath: './wrangler.toml' }
		})
	],
	test: {
		include: ['src/**/*.test.ts']
	},
});
