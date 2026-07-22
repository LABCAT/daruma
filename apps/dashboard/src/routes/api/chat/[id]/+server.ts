import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) {
		return json({ error: 'Chat database not available' }, { status: 500 });
	}

	const { id } = params;

	try {
		// Delete messages first (foreign key constraint might not be strictly enforced, but good practice)
		await db.prepare('DELETE FROM messages WHERE conversation_id = ?').bind(id).run();
		
		// Delete conversation
		await db.prepare('DELETE FROM conversations WHERE id = ?').bind(id).run();

		return json({ success: true });
	} catch (err: any) {
		console.error('Error deleting chat:', err);
		return json({ error: err.message }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ params, request, platform }) => {
	const db = platform?.env?.DB_CHAT;
	if (!db) {
		return json({ error: 'Chat database not available' }, { status: 500 });
	}

	const { id } = params;

	try {
		const { title } = await request.json();

		if (!title) {
			return json({ error: 'Title is required' }, { status: 400 });
		}

		await db
			.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?')
			.bind(title, new Date().toISOString(), id)
			.run();

		return json({ success: true, title });
	} catch (err: any) {
		console.error('Error updating chat:', err);
		return json({ error: err.message }, { status: 500 });
	}
};
