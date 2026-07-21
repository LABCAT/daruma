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
		<Alert variant="danger" title="Pipeline Broken" icon={dangerAlertIcon}>
			One or more pipeline stages are stalled or inactive. Check the stage statuses below for details.
		</Alert>
	{:else}
		<Alert variant="success" title="System Healthy" icon={checkAlertIcon}>
			The Opportunity Engine is actively running on schedule.
		</Alert>
	{/if}
</div>

{#if data.stages}
	<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--dm-space-4); margin-bottom: var(--dm-space-6)">
		{#each Object.entries(data.stages) as [stageName, stageData]}
			<div style="padding: var(--dm-space-4); border: var(--dm-border-width-base) solid var(--dm-color-border); border-radius: var(--dm-radius-md); background-color: var(--dm-color-surface);">
				<div style="font-weight: var(--dm-font-weight-bold); text-transform: capitalize; margin-bottom: var(--dm-space-2);">
					{stageName}
				</div>
				<div style="display: flex; align-items: center; gap: var(--dm-space-2); margin-bottom: var(--dm-space-2)">
					{#if (stageData as any).status === 'healthy'}
						<div style="color: var(--dm-color-success); display: flex; align-items: center;"><Check size={16} /> <span style="margin-left: 4px;">Active</span></div>
					{:else}
						<div style="color: var(--dm-color-danger); display: flex; align-items: center;"><AlertCircle size={16} /> <span style="margin-left: 4px;">Stalled</span></div>
					{/if}
				</div>
				<div style="font-size: var(--dm-font-size-sm); color: var(--dm-color-muted-foreground)">
					Last run: {(stageData as any).lastRun ? new Date((stageData as any).lastRun).toLocaleString() : 'Never'}
				</div>
			</div>
		{/each}
	</div>
{/if}

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
