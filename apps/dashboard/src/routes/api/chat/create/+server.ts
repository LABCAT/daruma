import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) return json({ error: 'DB not available' }, { status: 500 });

	const id = crypto.randomUUID();
	await db
		.prepare('INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)')
		.bind(id, 'New Chat', new Date().toISOString(), new Date().toISOString())
		.run();

	return json({ id });
};
