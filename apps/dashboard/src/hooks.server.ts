import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { verifySession } from '$lib/server/auth';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session');
	const password = event.platform?.env?.DASHBOARD_PASSWORD || env.DASHBOARD_PASSWORD;

	const authenticated = await verifySession(sessionCookie, password);
	event.locals.authenticated = authenticated;

	const isApi = event.url.pathname.startsWith('/api/');
	const isLogin = event.url.pathname === '/login' || event.url.pathname === '/api/login';

	if (!authenticated && !isLogin) {
		if (isApi) {
			return new Response('Unauthorized', { status: 401 });
		} else {
			throw redirect(303, '/login');
		}
	}

	return resolve(event);
};
