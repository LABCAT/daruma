import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/health');
	if (res.ok) {
		const data = await res.json();
		return { runs: data.items || [] };
	}
	return { runs: [] };
};
