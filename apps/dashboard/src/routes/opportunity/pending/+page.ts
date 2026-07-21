import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/opportunity');
	if (res.ok) {
		const data = await res.json();
		return { ideas: data.items || [] };
	}
	return { ideas: [] };
};
