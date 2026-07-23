<script lang="ts">

	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	let ideas = $state(data.ideas.map((idea: any) => {
		let parsedScore = null;
		try {
			parsedScore = JSON.parse(idea.score_json || '{}');
		} catch (e) {
			// ignore
		}
		return { ...idea, parsedScore };
	}));
	let isProcessing = $state(false);

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

	async function startResearch(id: string) {
		if (isProcessing) return;
		isProcessing = true;

		try {
			const res = await fetch(`/api/opportunity/${id}/research`, {
				method: 'POST'
			});

			if (res.ok) {
				const data = await res.json();
				if (data.conversationId) {
					const url = data.autoPrompt 
						? `/chat/${data.conversationId}?q=${encodeURIComponent(data.autoPrompt)}` 
						: `/chat/${data.conversationId}`;
					goto(url);
					return; // leave isProcessing true during navigation
				}
			}
			console.error('Failed to start research');
			isProcessing = false;
		} catch (err) {
			console.error('Research failed', err);
			isProcessing = false;
		}
	}
</script>

<header class="dm-opportunity__header">
	<h2 class="dm-opportunity__title">Saved for Research</h2>
</header>

	{#if ideas.length === 0}
		<div class="dm-opportunity__empty">
			<p>No saved research opportunities.</p>
		</div>
	{:else}
		<ul class="dm-opportunity__list">
			{#each ideas as idea (idea.id)}
				<li class="dm-opportunity__item">
					<div class="dm-opportunity__item-content">
						<h2 class="dm-opportunity__keyword">{idea.keyword}</h2>
						<span class="dm-opportunity__score" title="Overall ranking score">Score: {idea.rank_score.toFixed(2)}</span>
						
						{#if idea.parsedScore?.scores}
							<div class="dm-opportunity__breakdown">
								<div class="dm-opportunity__stat" title="Level of customer pain (1-5, 5 = daily business-stopping)">
									<span class="dm-opportunity__stat-label">Pain</span>
									<span class="dm-opportunity__stat-value">{idea.parsedScore.scores.pain}</span>
								</div>
								<div class="dm-opportunity__stat" title="Willingness to pay (1-5, 5 = proven paid/sub in niche)">
									<span class="dm-opportunity__stat-label">WTP</span>
									<span class="dm-opportunity__stat-value">{idea.parsedScore.scores.wtp}</span>
								</div>
								<div class="dm-opportunity__stat" title="Ease of discovery (1-5, 5 = high-volume keyword + beatable competition)">
									<span class="dm-opportunity__stat-label">Discovery</span>
									<span class="dm-opportunity__stat-value">{idea.parsedScore.scores.discovery}</span>
								</div>
								<div class="dm-opportunity__stat" title="Build speed and ease (1-5, 5 = offline ≤3 screens)">
									<span class="dm-opportunity__stat-label">Build</span>
									<span class="dm-opportunity__stat-value">{idea.parsedScore.scores.buildSpeed}</span>
								</div>
								<div class="dm-opportunity__stat" title="Relevance confidence to Daruma's capabilities">
									<span class="dm-opportunity__stat-label">Match</span>
									<span class="dm-opportunity__stat-value">{Math.round(idea.parsedScore.scores.relevanceConfidence * 100)}%</span>
								</div>
							</div>
						{/if}
					</div>
					<div class="dm-opportunity__actions">
						<button 
							class="dm-opportunity__btn dm-opportunity__btn--success"
							onclick={() => updateStatus(idea.id, 'build')}
							disabled={isProcessing}
						>
							Build
						</button>
						{#if idea.conversation_id}
							<button 
								class="dm-opportunity__btn dm-opportunity__btn--warning"
								onclick={() => goto(`/chat/${idea.conversation_id}`)}
								disabled={isProcessing}
							>
								Open Chat
							</button>
						{:else}
							<button 
								class="dm-opportunity__btn dm-opportunity__btn--warning"
								onclick={() => startResearch(idea.id)}
								disabled={isProcessing}
							>
								Research
							</button>
						{/if}
						<button 
							class="dm-opportunity__btn dm-opportunity__btn--primary"
							onclick={() => updateStatus(idea.id, 'pending')}
							disabled={isProcessing}
						>
							Restore
						</button>
						<button 
							class="dm-opportunity__btn dm-opportunity__btn--danger"
							onclick={() => updateStatus(idea.id, 'skip')}
							disabled={isProcessing}
						>
							Skip
						</button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
