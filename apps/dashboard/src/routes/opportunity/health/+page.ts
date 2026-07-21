import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/api/health');
	if (res.ok) {
		const data = await res.json();
		return { 
			runs: data.items || [],
			status: (data.status as 'healthy' | 'warning' | 'error') || 'error',
			stages: data.stages
		};
	}
	return { runs: [], status: 'error' as const, stages: null };
};
