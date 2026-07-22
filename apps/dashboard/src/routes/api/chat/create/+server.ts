import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) return json({ error: 'DB not available' }, { status: 500 });

	let preferredModelId = null;
	try {
		const body = await request.json();
		if (body.preferredModelId) preferredModelId = body.preferredModelId;
	} catch (e) {}

	const id = crypto.randomUUID();
	await db
		.prepare('INSERT INTO conversations (id, title, preferred_model_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
		.bind(id, 'New Chat', preferredModelId, new Date().toISOString(), new Date().toISOString())
		.run();

	return json({ id });
};
