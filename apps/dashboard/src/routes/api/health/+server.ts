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
		let stages = {
			orchestrator: { status: 'unknown', lastRun: null },
			collect: { status: 'unknown', lastRun: null },
			score: { status: 'unknown', lastRun: null }
		};

		if (results.length > 0) {
			const now = Date.now();
			const msInHour = 1000 * 60 * 60;
			
			const isRecent = (dateStr: string) => {
				const time = new Date(dateStr).getTime();
				return (now - time) / msInHour <= 48;
			};

			const orchRun = results.find(r => (r as any).stage === 'orchestrator');
			const collectRun = results.find(r => (r as any).stage === 'collect');
			const scoreRun = results.find(r => (r as any).stage === 'score');

			stages.orchestrator = {
				status: orchRun && isRecent((orchRun as any).created_at) ? 'healthy' : 'error',
				lastRun: orchRun ? (orchRun as any).created_at : null
			};

			stages.collect = {
				status: collectRun && isRecent((collectRun as any).created_at) ? 'healthy' : 'error',
				lastRun: collectRun ? (collectRun as any).created_at : null
			};

			stages.score = {
				status: scoreRun && isRecent((scoreRun as any).created_at) ? 'healthy' : 'error',
				lastRun: scoreRun ? (scoreRun as any).created_at : null
			};

			if (stages.orchestrator.status === 'error') {
				status = 'error'; // Cron is not firing
			} else if (stages.collect.status === 'error' || stages.score.status === 'error') {
				status = 'warning'; // Workers are failing or queue is stuck
			} else {
				status = 'healthy'; // All stages have completed recently
			}
		}

		return json({ 
			items: results,
			status,
			stages
		});
	} catch (err: any) {
		console.error('Error in /api/health GET:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
