<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	import TableRow from '$lib/components/table-row/TableRow.svelte';
</script>

<header class="dm-opportunity__header">
	<h2 class="dm-opportunity__title">Pipeline Health</h2>
</header>

{#if data.runs.length === 0}
	<div class="dm-opportunity__empty">
		<p>No pipeline runs recorded.</p>
	</div>
{:else}
	<div style="border: var(--dm-border-width-base) solid var(--dm-color-border); border-radius: var(--dm-radius-md); overflow: hidden">
		<TableRow isHeader>
			<div style="width: 120px">Run ID</div>
			<div style="width: 150px">Stage</div>
			<div style="width: 100px; text-align: right">Ideas In</div>
			<div style="width: 100px; text-align: right">Ideas Out</div>
			<div style="flex: 1; text-align: right">Created At</div>
		</TableRow>

		{#each data.runs as run (run.id)}
			<TableRow>
				<div style="width: 120px; font-family: monospace; color: var(--dm-color-muted-foreground)">{run.id.split('-')[0]}...</div>
				<div style="width: 150px">{run.stage}</div>
				<div style="width: 100px; text-align: right">{run.ideas_in ?? '-'}</div>
				<div style="width: 100px; text-align: right">{run.ideas_out ?? '-'}</div>
				<div style="flex: 1; text-align: right; color: var(--dm-color-muted-foreground)">{new Date(run.created_at).toLocaleString()}</div>
			</TableRow>
		{/each}
	</div>
{/if}
