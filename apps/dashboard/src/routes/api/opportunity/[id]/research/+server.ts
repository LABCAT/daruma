import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, platform }) => {
	const db = platform?.env?.DB;
	const dbChat = platform?.env?.DB_CHAT;

	if (!db || !dbChat) {
		return json({ error: 'Databases not available' }, { status: 500 });
	}

	const { id } = params;

	try {
		// 1. Fetch Opportunity
		const { results } = await db
			.prepare('SELECT * FROM ideas_ranked WHERE id = ?')
			.bind(id)
			.all();

		if (results.length === 0) {
			return json({ error: 'Opportunity not found' }, { status: 404 });
		}

		const idea = results[0] as any;

		// 2. Build Seed Context
		// Bounded synthesis to fit within token limits
		let signalsStr = idea.signals_json || '{}';
		if (signalsStr.length > 3000) {
			signalsStr = signalsStr.substring(0, 3000) + '\n... (truncated to fit budget)';
		}
		
		let scoresStr = idea.score_json || '{}';
		if (scoresStr.length > 1000) {
			scoresStr = scoresStr.substring(0, 1000) + '\n... (truncated to fit budget)';
		}

		const systemPrompt = `You are a research assistant exploring a new product opportunity.
Topic: ${idea.keyword}
Rank Score: ${idea.rank_score}

--- SIGNALS ---
${signalsStr}

--- SCORES ---
${scoresStr}

Help the user research this opportunity further, identify gaps, and propose a minimum viable product.`;

		// 3. Create conversation in DB_CHAT
		const conversationId = crypto.randomUUID();
		const now = new Date().toISOString();
		
		await dbChat
			.prepare('INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)')
			.bind(conversationId, `Research: ${idea.keyword}`, now, now)
			.run();

		// Insert system context message
		await dbChat
			.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
			.bind(crypto.randomUUID(), conversationId, 'system', systemPrompt, now)
			.run();

		// Insert introductory assistant message
		await dbChat
			.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
			.bind(crypto.randomUUID(), conversationId, 'assistant', `I'm ready to research **${idea.keyword}**. What specific aspects would you like to explore first?`, new Date(Date.now() + 1000).toISOString())
			.run();

		// 4. Update Opportunity status and link the conversation
		await db
			.prepare('UPDATE ideas_ranked SET status = ?, conversation_id = ? WHERE id = ?')
			.bind('research_more', conversationId, id)
			.run();

		return json({ conversationId });
	} catch (err: any) {
		console.error('Error creating research chat:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
