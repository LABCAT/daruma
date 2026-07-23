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
		// 1. Fetch Opportunity and join raw signals
		const { results } = await db
			.prepare(`
				SELECT r.*, w.signals_json 
				FROM ideas_ranked r 
				LEFT JOIN ideas_raw w ON r.keyword = w.keyword 
				WHERE r.id = ?
			`)
			.bind(id)
			.all();

		if (results.length === 0) {
			return json({ error: 'Opportunity not found' }, { status: 404 });
		}

		const idea = results[0] as any;

		// 2. Build Seed Context
		// Bounded synthesis to fit within token limits
		let signalsStr = idea.signals_json && idea.signals_json !== '{}' ? idea.signals_json : 'No scraped signals available. Rely on your general knowledge to synthesize this topic.';
		if (signalsStr.length > 3000) {
			signalsStr = signalsStr.substring(0, 3000) + '\n... (truncated to fit budget)';
		}
		
		let scoresStr = idea.score_json || '{}';
		if (scoresStr.length > 1000) {
			scoresStr = scoresStr.substring(0, 1000) + '\n... (truncated to fit budget)';
		}

		const systemPrompt = `You are a product strategist and research assistant for Metal Monkey Apps, a micro-app and game studio.
Your goal is to help the founder evaluate and synthesize this scraped product opportunity.

Topic: ${idea.keyword}
Rank Score: ${idea.rank_score}

--- SIGNALS (scraped context) ---
${signalsStr}

--- SCORES (rubric breakdown) ---
${scoresStr}

Help the founder:
1. Synthesize the core problem this solves based on the signals.
2. Identify existing gaps or weaknesses in current competitors.
3. Propose the absolute minimum viable product (MVP) scope to test this.
4. Highlight any major build or distribution risks.

Be concise. Do not use corporate preamble. Lead with insights.`;

		// 3. Create conversation in DB_CHAT
		const conversationId = crypto.randomUUID();
		const now = new Date().toISOString();
		
		await dbChat
			.prepare('INSERT INTO conversations (id, title, preferred_model_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
			.bind(conversationId, `Research: ${idea.keyword}`, 'gemini-3.6-flash', now, now)
			.run();

		// Insert system context message
		await dbChat
			.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
			.bind(crypto.randomUUID(), conversationId, 'system', systemPrompt, now)
			.run();

		// 4. Update Opportunity status and link the conversation
		await db
			.prepare('UPDATE ideas_ranked SET status = ?, conversation_id = ? WHERE id = ?')
			.bind('research_more', conversationId, id)
			.run();

		const autoPrompt = `Please synthesize the core problem, identify competitor gaps, and propose an MVP based on the signals.`;
		return json({ conversationId, autoPrompt });
	} catch (err: any) {
		console.error('Error creating research chat:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
