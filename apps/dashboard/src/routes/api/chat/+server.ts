import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createChatStream } from '$lib/server/llm';

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) {
		return json({ error: 'Chat database not available' }, { status: 500 });
	}

	try {
		const { conversation_id, message, model_id = 'gemini-3.5-flash-lite' } = await request.json();

		if (!conversation_id || !message) {
			return json({ error: 'Missing conversation_id or message' }, { status: 400 });
		}

		// Save user message first
		const userMessageId = crypto.randomUUID();
		await db
			.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
			.bind(userMessageId, conversation_id, 'user', message, new Date().toISOString())
			.run();

		// Fetch conversation to get preferred_model_id if model_id override is missing
		let currentModelId = model_id;
		if (!currentModelId) {
			const { results: convResults } = await db
				.prepare('SELECT preferred_model_id FROM conversations WHERE id = ?')
				.bind(conversation_id)
				.all();
			if (convResults.length > 0 && convResults[0].preferred_model_id) {
				currentModelId = convResults[0].preferred_model_id;
			} else {
				currentModelId = 'gemini-3.5-flash-lite'; // default
			}
		} else {
			// Update preferred model
			await db
				.prepare('UPDATE conversations SET preferred_model_id = ?, updated_at = ? WHERE id = ?')
				.bind(currentModelId, new Date().toISOString(), conversation_id)
				.run();
		}

		// Fetch conversation history
		const { results: historyResults } = await db
			.prepare('SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
			.bind(conversation_id)
			.all();
		
		const messages = historyResults.map((row: any) => ({
			role: row.role,
			content: row.content
		}));

		// Load settings
		let failoverOrder: string[] = [];
		const { results: settingsResults } = await db
			.prepare('SELECT failover_order FROM settings WHERE id = ?')
			.bind('user')
			.all();
		
		if (settingsResults.length > 0 && settingsResults[0].failover_order) {
			failoverOrder = JSON.parse(settingsResults[0].failover_order as string);
		}

		// Make sure the currentModelId isn't at the front of failover list to avoid redundant failover
		failoverOrder = failoverOrder.filter(m => m !== currentModelId);

		const onEvent = async (eventMessage: string) => {
			await db
				.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
				.bind(crypto.randomUUID(), conversation_id, 'event', eventMessage, new Date().toISOString())
				.run();
		};

		const onComplete = async (content: string, usage: any, finalModel: string) => {
			const assistantMessageId = crypto.randomUUID();
			const now = new Date().toISOString();
			
			// 1. Save assistant message
			await db
				.prepare('INSERT INTO messages (id, conversation_id, role, content, model_id, created_at) VALUES (?, ?, ?, ?, ?, ?)')
				.bind(assistantMessageId, conversation_id, 'assistant', content, finalModel, now)
				.run();

			// 2. Save usage telemetry
			// Cost calculation is rough or 0 for now. The prompt says "estimated USD".
			const provider = finalModel.startsWith('gemini') ? 'google' : 
							 finalModel.startsWith('deepseek') ? 'deepseek' : 
							 'groq';

			const promptTokens = usage?.prompt_tokens || 0;
			const completionTokens = usage?.completion_tokens || 0;
			const cachedTokens = usage?.prompt_tokens_details?.cached_tokens || null;
			
			// A real app would have a rate table.
			const estimatedCost = 0; 

			await db
				.prepare('INSERT INTO api_usage (id, conversation_id, message_id, model_id, provider, tokens_prompt, tokens_completion, tokens_cached, estimated_cost, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
				.bind(crypto.randomUUID(), conversation_id, assistantMessageId, finalModel, provider, promptTokens, completionTokens, cachedTokens, estimatedCost, now)
				.run();
		};

		const { stream } = await createChatStream(messages, currentModelId, platform.env as Record<string, any>, onComplete, onEvent, failoverOrder);

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			}
		});

	} catch (err: any) {
		console.error('Error in /api/chat POST:', err);
		// Log error event
		try {
			const body = await request.clone().json();
			if (body.conversation_id) {
				await db
					.prepare('INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)')
					.bind(crypto.randomUUID(), body.conversation_id, 'event', `Error: ${err.message}`, new Date().toISOString())
					.run();
			}
		} catch (e) {
			// ignore fallback error
		}
		
		return json({ error: err.message }, { status: 500 });
	}
};
