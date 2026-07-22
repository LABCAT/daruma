import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, platform }) => {
	const db = platform?.env?.DB_CHAT;
	const apiKey = platform?.env?.GOOGLE_API_KEY;

	if (!db) {
		return json({ error: 'Chat database not available' }, { status: 500 });
	}

	if (!apiKey) {
		return json({ error: 'Google API key not configured' }, { status: 500 });
	}

	const { id } = params;

	try {
		// 1. Check if conversation exists and get first user message
		const { results: messages } = await db
			.prepare('SELECT content FROM messages WHERE conversation_id = ? AND role = ? ORDER BY created_at ASC LIMIT 1')
			.bind(id, 'user')
			.all();

		if (messages.length === 0) {
			return json({ error: 'No user message found to generate title' }, { status: 400 });
		}

		const userMessage = messages[0].content as string;

		// 2. Ask Gemini to summarize
		const systemPrompt = "You are a helpful assistant. Summarize the following user message into a short chat title (maximum 3-5 words). Do not use quotes, punctuation, or preamble. Just the title.";
		
		const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gemini-3.5-flash-lite',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userMessage }
				],
				temperature: 0.3,
				max_tokens: 15
			})
		});

		if (!response.ok) {
			throw new Error(`Google API returned ${response.status}`);
		}

		const data = await response.json();
		const generatedTitle = data.choices?.[0]?.message?.content?.trim() || 'New Chat';
		
		// Remove quotes if the LLM adds them despite instructions
		const cleanTitle = generatedTitle.replace(/^["']|["']$/g, '');

		// 3. Save to DB
		await db
			.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?')
			.bind(cleanTitle, new Date().toISOString(), id)
			.run();

		return json({ success: true, title: cleanTitle });
	} catch (err: any) {
		console.error('Error generating title:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
