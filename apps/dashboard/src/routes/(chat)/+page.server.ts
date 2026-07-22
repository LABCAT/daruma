import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) return { enabledModels: [] };

	let enabledModels: string[] = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.6-flash', 'llama-3.3-70b-versatile', 'gpt-oss-120b'];
	try {
		const { results: settings } = await db
			.prepare('SELECT enabled_models FROM settings WHERE id = ?')
			.bind('user')
			.all();

		if (settings.length > 0 && settings[0].enabled_models) {
			enabledModels = JSON.parse(settings[0].enabled_models as string);
		}
	} catch (e) {
		console.error('Failed to load settings', e);
	}

	return {
		enabledModels,
		preferredModelId: 'gemini-3.5-flash-lite'
	};
};
