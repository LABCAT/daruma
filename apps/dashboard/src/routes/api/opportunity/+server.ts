import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, request }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json({ error: 'Database not available' }, { status: 500 });
	}

	try {
		// Check if we need to seed
		const { results } = await db
			.prepare('SELECT * FROM ideas_ranked WHERE status = ? ORDER BY rank_score DESC')
			.bind('pending')
			.all();

		// Seed local D1 if empty
		const url = new URL(request.url);
		const isLocal = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(url.hostname) || url.hostname.includes('local');
		
		console.log('GET /api/opportunity', { isLocal, hostname: url.hostname, resultsCount: results.length });

		if (results.length === 0 && isLocal) {
			console.log('Seeding local database...');
			const seedData = Array.from({ length: 10 }).map((_, i) => ({
				id: crypto.randomUUID(),
				keyword: `Mock Idea ${i + 1}`,
				rank_score: Math.random() * 100,
				score_json: '{}',
				status: 'pending',
				created_at: new Date().toISOString()
			}));

			const stmts = seedData.map((d) => 
				db.prepare(
					'INSERT INTO ideas_ranked (id, keyword, rank_score, score_json, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(d.id, d.keyword, d.rank_score, d.score_json, d.status, d.created_at)
			);

			await db.batch(stmts);

			const { results: seededResults } = await db
				.prepare('SELECT * FROM ideas_ranked WHERE status = ? ORDER BY rank_score DESC')
				.bind('pending')
				.all();
				
			return json({ items: seededResults });
		}

		return json({ items: results });
	} catch (err: any) {
		console.error('Error in /api/opportunity GET:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json({ error: 'Database not available' }, { status: 500 });
	}

	try {
		const { updates } = await request.json().catch(() => ({ updates: [] }));

		if (!Array.isArray(updates) || updates.length === 0) {
			return json({ error: 'Invalid or empty updates array' }, { status: 400 });
		}

		const validStatuses = ['pending', 'sent_to_synthesis', 'build', 'skip', 'research_more'];
		
		const stmts = updates.map((update: any) => {
			if (!update.id || !update.status || !validStatuses.includes(update.status)) {
				throw new Error(`Invalid update object: ${JSON.stringify(update)}`);
			}
			return db.prepare('UPDATE ideas_ranked SET status = ? WHERE id = ?').bind(update.status, update.id);
		});

		await db.batch(stmts);

		return json({ success: true });
	} catch (err: any) {
		console.error('Error in /api/opportunity PATCH:', err);
		return json({ error: err.message }, { status: 400 });
	}
};
