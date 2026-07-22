<script lang="ts">
	import PageShell from '$lib/components/page-shell/PageShell.svelte';
	
	let { data } = $props();
</script>

<PageShell title="Usage Telemetry">
	<div class="usage-container">
		<table class="usage-table">
			<thead>
				<tr>
					<th>Time</th>
					<th>Chat</th>
					<th>Model</th>
					<th>Provider</th>
					<th>Prompt Tokens</th>
					<th>Completion Tokens</th>
					<th>Cached Tokens</th>
				</tr>
			</thead>
			<tbody>
				{#each data.usage as row}
					<tr>
						<td>{new Date(row.created_at).toLocaleString()}</td>
						<td>{row.conversation_title || 'Unknown'}</td>
						<td>{row.model_id}</td>
						<td>{row.provider}</td>
						<td>{row.tokens_prompt}</td>
						<td>{row.tokens_completion}</td>
						<td>{row.tokens_cached || 0}</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7" class="text-center" style="padding: var(--dm-space-4); color: var(--dm-color-muted-foreground)">
							No usage data yet.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</PageShell>

<style lang="scss">
	.usage-container {
		padding: var(--dm-space-4);
	}

	.usage-table {
		width: 100%;
		border-collapse: collapse;
		background: var(--dm-color-surface);
		border-radius: var(--dm-radius-md);
		overflow: hidden;
		box-shadow: var(--dm-shadow-sm);
		
		th, td {
			padding: var(--dm-space-3) var(--dm-space-4);
			text-align: left;
			border-bottom: var(--dm-border-width-base) solid var(--dm-color-border);
		}

		th {
			background: var(--dm-color-bg);
			font-weight: var(--dm-font-weight-bold);
			color: var(--dm-color-foreground);
		}

		td {
			color: var(--dm-color-text);
			font-size: var(--dm-font-size-sm);
		}

		tbody tr:hover {
			background: var(--dm-color-bg);
		}
	}
</style>
