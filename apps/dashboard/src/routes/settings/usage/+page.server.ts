import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) return { usage: [] };

	// Get usage telemetry joined with conversation title
	const { results } = await db
		.prepare(`
			SELECT 
				u.id, u.model_id, u.provider, 
				u.tokens_prompt, u.tokens_completion, u.tokens_cached, 
				u.estimated_cost, u.created_at,
				c.title as conversation_title
			FROM api_usage u
			LEFT JOIN conversations c ON u.conversation_id = c.id
			ORDER BY u.created_at DESC
			LIMIT 100
		`)
		.all();

	return {
		usage: results
	};
};
