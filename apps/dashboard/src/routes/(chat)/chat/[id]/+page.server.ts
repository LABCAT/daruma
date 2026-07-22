import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) return { messages: [], enabledModels: [] };

	const { id } = params;

	// Load messages
	const { results: messages } = await db
		.prepare('SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
		.bind(id)
		.all();

	// Load settings
	let enabledModels: string[] = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'llama-3.3-70b-versatile', 'gpt-oss-120b', 'deepseek-chat'];
	const { results: settings } = await db
		.prepare('SELECT enabled_models FROM settings WHERE id = ?')
		.bind('user')
		.all();

	if (settings.length > 0 && settings[0].enabled_models) {
		enabledModels = JSON.parse(settings[0].enabled_models as string);
	}

	// Load preferred model
	let preferredModelId = 'gemini-3.5-flash-lite';
	let title = 'New Chat';
	const { results: conv } = await db
		.prepare('SELECT preferred_model_id, title FROM conversations WHERE id = ?')
		.bind(id)
		.all();
	if (conv.length > 0) {
		if (conv[0].preferred_model_id) preferredModelId = conv[0].preferred_model_id as string;
		if (conv[0].title) title = conv[0].title as string;
	}

	return {
		messages,
		enabledModels,
		preferredModelId,
		title,
		conversationId: id
	};
};
