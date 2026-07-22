import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) {
		return json({ error: 'Chat database not available' }, { status: 500 });
	}

	try {
		const { results } = await db
			.prepare('SELECT enabled_models, failover_order FROM settings WHERE id = ?')
			.bind('user')
			.all();

		if (results.length === 0) {
			// default settings
			const defaultSettings = {
				enabled_models: ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'llama-3.3-70b-versatile', 'gpt-oss-120b', 'deepseek-chat'],
				failover_order: ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'llama-3.3-70b-versatile', 'gpt-oss-120b', 'deepseek-chat']
			};
			
			await db
				.prepare('INSERT INTO settings (id, enabled_models, failover_order) VALUES (?, ?, ?)')
				.bind('user', JSON.stringify(defaultSettings.enabled_models), JSON.stringify(defaultSettings.failover_order))
				.run();
				
			return json(defaultSettings);
		}

		return json({
			enabled_models: JSON.parse(results[0].enabled_models as string),
			failover_order: JSON.parse(results[0].failover_order as string)
		});
	} catch (err: any) {
		console.error('Error in /api/settings GET:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) {
		return json({ error: 'Chat database not available' }, { status: 500 });
	}

	try {
		const body = await request.json();
		const { enabled_models, failover_order } = body;

		if (!Array.isArray(enabled_models) || !Array.isArray(failover_order)) {
			return json({ error: 'enabled_models and failover_order must be arrays' }, { status: 400 });
		}

		await db
			.prepare('UPDATE settings SET enabled_models = ?, failover_order = ? WHERE id = ?')
			.bind(JSON.stringify(enabled_models), JSON.stringify(failover_order), 'user')
			.run();

		return json({ success: true });
	} catch (err: any) {
		console.error('Error in /api/settings POST:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
