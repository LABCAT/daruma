<script lang="ts">
	import './Opportunity.scss';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	let ideas = $state(data.ideas);
	let isProcessing = $state(false);

	async function copyTop5() {
		if (ideas.length === 0 || isProcessing) return;
		isProcessing = true;

		const top5 = ideas.slice(0, 5);
		const keywords = top5.map((idea: any) => idea.keyword).join('\n');
		
		try {
			await navigator.clipboard.writeText(keywords);
			
			const updates = top5.map((idea: any) => ({
				id: idea.id,
				status: 'sent_to_synthesis'
			}));

			const res = await fetch('/api/opportunity', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ updates })
			});

			if (res.ok) {
				ideas = ideas.slice(5);
			} else {
				console.error('Failed to update status');
			}
		} catch (err) {
			console.error('Copy/Update failed', err);
		} finally {
			isProcessing = false;
		}
	}

	async function updateStatus(id: string, status: string) {
		if (isProcessing) return;
		
		// Optimistically remove from UI
		const originalIdeas = [...ideas];
		ideas = ideas.filter((idea: any) => idea.id !== id);

		try {
			const res = await fetch('/api/opportunity', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ updates: [{ id, status }] })
			});

			if (!res.ok) {
				// Revert on failure
				ideas = originalIdeas;
				console.error('Failed to update status');
			}
		} catch (err) {
			ideas = originalIdeas;
			console.error('Update failed', err);
		}
	}
</script>

<div class="dm-opportunity">
	<header class="dm-opportunity__header">
		<h1 class="dm-opportunity__title">Opportunity Engine</h1>
		<button 
			class="dm-opportunity__btn dm-opportunity__btn--primary" 
			on:click={copyTop5}
			disabled={isProcessing || ideas.length === 0}
		>
			Copy Top 5
		</button>
	</header>

	{#if ideas.length === 0}
		<div class="dm-opportunity__empty">
			<p>No pending opportunities.</p>
		</div>
	{:else}
		<ul class="dm-opportunity__list">
			{#each ideas as idea (idea.id)}
				<li class="dm-opportunity__item">
					<div class="dm-opportunity__item-content">
						<h2 class="dm-opportunity__keyword">{idea.keyword}</h2>
						<span class="dm-opportunity__score">Score: {idea.rank_score.toFixed(2)}</span>
					</div>
					<div class="dm-opportunity__actions">
						<button 
							class="dm-opportunity__btn dm-opportunity__btn--success"
							on:click={() => updateStatus(idea.id, 'build')}
							disabled={isProcessing}
						>
							Build
						</button>
						<button 
							class="dm-opportunity__btn dm-opportunity__btn--warning"
							on:click={() => updateStatus(idea.id, 'research_more')}
							disabled={isProcessing}
						>
							Research
						</button>
						<button 
							class="dm-opportunity__btn dm-opportunity__btn--danger"
							on:click={() => updateStatus(idea.id, 'skip')}
							disabled={isProcessing}
						>
							Skip
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
