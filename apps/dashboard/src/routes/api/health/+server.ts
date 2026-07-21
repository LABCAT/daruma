import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, request }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json({ error: 'Database not available' }, { status: 500 });
	}

	try {
		const { results } = await db
			.prepare('SELECT * FROM pipeline_runs ORDER BY created_at DESC LIMIT 100')
			.all();

		// Seed local D1 if empty
		const url = new URL(request.url);
		const isLocal = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(url.hostname) || url.hostname.includes('local');
		
		if (results.length === 0 && isLocal) {
			console.log('Seeding local database for pipeline_runs...');
			const seedData = Array.from({ length: 5 }).map((_, i) => ({
				id: crypto.randomUUID(),
				stage: 'orchestrator',
				ideas_in: Math.floor(Math.random() * 10),
				ideas_out: Math.floor(Math.random() * 5),
				created_at: new Date(Date.now() - i * 86400000).toISOString()
			}));

			const stmts = seedData.map((d) => 
				db.prepare(
					'INSERT INTO pipeline_runs (id, stage, ideas_in, ideas_out, created_at) VALUES (?, ?, ?, ?, ?)'
				).bind(d.id, d.stage, d.ideas_in, d.ideas_out, d.created_at)
			);

			await db.batch(stmts);

			const { results: seededResults } = await db
				.prepare('SELECT * FROM pipeline_runs ORDER BY created_at DESC LIMIT 100')
				.all();
				
			return json({ 
				items: seededResults,
				status: 'healthy' // Local seeded data is always considered healthy
			});
		}

		let status = 'error';
		if (results.length > 0) {
			const lastRunTime = new Date((results[0] as any).created_at).getTime();
			const msSinceLastRun = Date.now() - lastRunTime;
			const hoursSinceLastRun = msSinceLastRun / (1000 * 60 * 60);

			if (hoursSinceLastRun <= 48) {
				status = 'healthy';
			} else {
				status = 'warning';
			}
		}

		return json({ 
			items: results,
			status 
		});
	} catch (err: any) {
		console.error('Error in /api/health GET:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
