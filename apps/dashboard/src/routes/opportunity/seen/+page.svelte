<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	import TableRow from '$lib/components/table-row/TableRow.svelte';
</script>

<header class="dm-opportunity__header">
	<h2 class="dm-opportunity__title">Seen Keywords</h2>
</header>

{#if data.keywords.length === 0}
	<div class="dm-opportunity__empty">
		<p>No keywords seen yet.</p>
	</div>
{:else}
	<div style="border: var(--dm-border-width-base) solid var(--dm-color-border); border-radius: var(--dm-radius-md); overflow: hidden">
		<TableRow isHeader>
			<div style="flex: 1">Keyword (Normalized)</div>
			<div style="width: 200px; text-align: right">Last Seen At</div>
		</TableRow>

		{#each data.keywords as kw (kw.keyword_normalized)}
			<TableRow>
				<div style="flex: 1"><strong>{kw.keyword_normalized}</strong></div>
				<div style="width: 200px; text-align: right; color: var(--dm-color-muted-foreground)">{new Date(kw.last_seen_at).toLocaleString()}</div>
			</TableRow>
		{/each}
	</div>
{/if}
