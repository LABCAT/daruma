import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/seen-keywords');
	if (res.ok) {
		const data = await res.json();
		return { keywords: data.items || [] };
	}
	return { keywords: [] };
};
