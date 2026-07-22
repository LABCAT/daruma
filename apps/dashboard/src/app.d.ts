// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			authenticated: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DASHBOARD_PASSWORD?: string;
				DB: D1Database;
				DB_CHAT: D1Database;
				ORCHESTRATOR: Fetcher;
				CRON_SECRET?: string;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
