export async function signSession(password: string): Promise<string> {
	const enc = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		enc.encode(password),
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	const signature = await crypto.subtle.sign('HMAC', key, enc.encode('session'));
	const hashArray = Array.from(new Uint8Array(signature));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	return `session.${hashHex}`;
}

export async function verifySession(cookieValue: string | undefined, password: string | undefined): Promise<boolean> {
	if (!cookieValue || !password) return false;
	const expected = await signSession(password);
	return cookieValue === expected;
}
