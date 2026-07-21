import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, platform }) => {
	if (!locals.authenticated) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const orchestratorUrl = platform?.env?.ORCHESTRATOR_URL;
	const cronSecret = platform?.env?.CRON_SECRET;

	if (!orchestratorUrl) {
		return json({ error: 'ORCHESTRATOR_URL not configured' }, { status: 500 });
	}
	if (!cronSecret) {
		return json({ error: 'CRON_SECRET not configured' }, { status: 500 });
	}

	try {
		// Call the orchestrator URL securely
		const res = await fetch(orchestratorUrl, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${cronSecret}`
			}
		});
		
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
