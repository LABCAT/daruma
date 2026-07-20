import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { signSession } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
	const { password } = await request.json().catch(() => ({ password: '' }));
	const expectedPassword = platform?.env?.DASHBOARD_PASSWORD || env.DASHBOARD_PASSWORD;
	console.log('Login attempt:', { password, expectedPassword, platformHasEnv: !!platform?.env, envVar: env.DASHBOARD_PASSWORD });

	if (!expectedPassword || password !== expectedPassword) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const session = await signSession(expectedPassword);
	
	cookies.set('session', session, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 7 // 1 week
	});

	return json({ success: true });
};
