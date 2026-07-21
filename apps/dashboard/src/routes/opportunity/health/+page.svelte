<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	import TableRow from '$lib/components/table-row/TableRow.svelte';
	import Alert from '$lib/components/alert/Alert.svelte';
	import { Check, AlertTriangle, AlertCircle } from 'lucide-svelte';
</script>

{#snippet checkAlertIcon()}<Check />{/snippet}
{#snippet warningAlertIcon()}<AlertTriangle />{/snippet}
{#snippet dangerAlertIcon()}<AlertCircle />{/snippet}

<header class="dm-opportunity__header">
	<h2 class="dm-opportunity__title">Pipeline Health</h2>
</header>

<div style="margin-bottom: var(--dm-space-6)">
	{#if data.status === 'error'}
		<Alert variant="danger" title="Pipeline Inactive" icon={dangerAlertIcon}>
			No recent orchestrator runs detected. The cron trigger may be failing or disabled.
		</Alert>
	{:else if data.status === 'warning'}
		<Alert variant="warning" title="Workers Stalled" icon={warningAlertIcon}>
			The orchestrator ran recently, but the collect or score workers have not processed the queue. Check worker logs for crashes or dead-letter queues.
		</Alert>
	{:else}
		<Alert variant="success" title="System Healthy" icon={checkAlertIcon}>
			The Opportunity Engine is actively running on schedule.
		</Alert>
	{/if}
</div>

{#if data.runs.length > 0}
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
