import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'node:fs';

if (fs.existsSync('.dev.vars')) {
	const devVars = fs.readFileSync('.dev.vars', 'utf-8');
	devVars.split('\n').forEach((line) => {
		const cleanLine = line.replace(/\r/g, '').trim();
		const parts = cleanLine.split('=');
		if (parts.length >= 2) {
			const key = parts[0].trim();
			const value = parts.slice(1).join('=').trim();
			if (key) {
				process.env[key] = value;
			}
		}
	});
}

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			}
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	},
	server: {
		fs: {
			allow: ['../..']
		}
	}
});
