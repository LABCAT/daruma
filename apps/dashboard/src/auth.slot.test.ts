import { describe, it, expect, vi } from 'vitest';
import { POST as loginPost } from './routes/api/login/+server';
import { GET as meGet } from './routes/api/me/+server';
import { handle } from './hooks.server';
import { signSession } from '$lib/server/auth';

describe('dashboard auth API (slot)', () => {
	it('login -> me 200', async () => {
		// Mock platform env
		const platform = {
			env: { DASHBOARD_PASSWORD: 'test-password' }
		} as any;

		// 1. Login success
		let sessionCookieVal = '';
		const cookies = {
			set: vi.fn((name, val) => { sessionCookieVal = val; }),
			get: vi.fn(),
			delete: vi.fn(),
			serialize: vi.fn(),
		} as any;

		const loginRequest = new Request('http://localhost/api/login', {
			method: 'POST',
			body: JSON.stringify({ password: 'test-password' }),
		});

		const loginRes = await loginPost({ request: loginRequest, cookies, platform } as any);
		expect(loginRes.status).toBe(200);
		expect(cookies.set).toHaveBeenCalledWith('session', expect.any(String), expect.any(Object));

		// 2. Me 200 (Mock locals)
		const locals = { authenticated: true };
		const meRes = await meGet({ locals } as any);
		expect(meRes.status).toBe(200);
		const data = await meRes.json();
		expect(data).toEqual({ authenticated: true });
	});

	it('no cookie -> 401 (via hooks)', async () => {
		const request = new Request('http://localhost/api/me', {
			method: 'GET'
		});

		const event = {
			request,
			url: new URL('http://localhost/api/me'),
			cookies: {
				get: vi.fn().mockReturnValue(undefined)
			},
			platform: {
				env: { DASHBOARD_PASSWORD: 'test-password' }
			},
			locals: {}
		} as any;

		const resolve = vi.fn();
		const response = await handle({ event, resolve });
		expect(response.status).toBe(401);
		expect(resolve).not.toHaveBeenCalled();
	});
});
