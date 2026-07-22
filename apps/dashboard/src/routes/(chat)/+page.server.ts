import type { PageServerLoad } from './$types';
import { MODELS_CONFIG } from '$lib/config/models';

export const load: PageServerLoad = async ({ platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) return { enabledModels: MODELS_CONFIG.filter(m => m.defaultEnabled).map(m => m.id) };

	let enabledModels: string[] = MODELS_CONFIG.filter(m => m.defaultEnabled).map(m => m.id);
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
