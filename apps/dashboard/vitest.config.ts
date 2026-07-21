import { defineConfig } from 'vitest/config';
import { cloudflareTest } from '@cloudflare/vitest-pool-workers';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		cloudflareTest({
			wrangler: { configPath: './wrangler.toml' },
			miniflare: {
				workers: [
					{
						name: 'daruma-opportunity-engine-orchestrator',
						modules: true,
						script: 'export default { fetch() { return new Response("mock") } }'
					}
				]
			}
		})
	],
	test: {
		include: ['src/**/*.test.ts']
	},
});
