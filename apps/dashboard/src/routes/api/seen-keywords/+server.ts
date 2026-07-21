import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, request }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json({ error: 'Database not available' }, { status: 500 });
	}

	try {
		const { results } = await db
			.prepare('SELECT * FROM seen_keywords ORDER BY last_seen_at DESC LIMIT 100')
			.all();

		// Seed local D1 if empty
		const url = new URL(request.url);
		const isLocal = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(url.hostname) || url.hostname.includes('local');
		
		if (results.length === 0 && isLocal) {
			console.log('Seeding local database for seen_keywords...');
			const seedData = Array.from({ length: 5 }).map((_, i) => ({
				keyword_normalized: `seen mock keyword ${i + 1}`,
				last_seen_at: new Date(Date.now() - i * 3600000).toISOString()
			}));

			const stmts = seedData.map((d) => 
				db.prepare(
					'INSERT INTO seen_keywords (keyword_normalized, last_seen_at) VALUES (?, ?)'
				).bind(d.keyword_normalized, d.last_seen_at)
			);

			await db.batch(stmts);

			const { results: seededResults } = await db
				.prepare('SELECT * FROM seen_keywords ORDER BY last_seen_at DESC LIMIT 100')
				.all();
				
			return json({ items: seededResults });
		}

		return json({ items: results });
	} catch (err: any) {
		console.error('Error in /api/seen-keywords GET:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
