import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, platform }) => {
	if (!locals.authenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const orchestrator = platform?.env?.ORCHESTRATOR;
	const cronSecret = platform?.env?.CRON_SECRET;

	if (!orchestrator) {
		return json({ error: 'Orchestrator service binding not found' }, { status: 500 });
	}
	if (!cronSecret) {
		return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	}

	try {
		// Call the orchestrator service binding securely
		const req = new Request('http://daruma-opportunity-engine-orchestrator', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${cronSecret}`
			}
		});

		const res = await orchestrator.fetch(req);
		
		if (!res.ok) {
			const text = await res.text();
			return json({ error: `Orchestrator failed: ${res.status} ${text}` }, { status: 500 });
		}

		const resultText = await res.text();
		return json({ success: true, message: resultText });
	} catch (err) {
		console.error('Failed to trigger pipeline:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
