import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const db = platform?.env?.DB_CHAT;
	const id = crypto.randomUUID();

	if (db) {
		await db
			.prepare('INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)')
			.bind(id, 'New Chat', new Date().toISOString(), new Date().toISOString())
			.run();
	}

	throw redirect(303, `/chat/${id}`);
};
