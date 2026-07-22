import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ platform, locals }) => {
	if (!locals.authenticated) {
		return { conversations: [] };
	}

	const db = platform?.env?.DB_CHAT;
	if (!db) {
		return { conversations: [] };
	}

	try {
		const { results } = await db
			.prepare('SELECT id, title FROM conversations ORDER BY updated_at DESC')
			.all();

		return {
			conversations: results
		};
	} catch (e) {
		console.error('Failed to load conversations', e);
		return { conversations: [] };
	}
};
