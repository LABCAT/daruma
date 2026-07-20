<script lang="ts">
	import './TableRow.scss';
	import type { Snippet } from 'svelte';

	interface Props {
		isHeader?: boolean;
		children?: Snippet;
	}

	let { isHeader = false, children }: Props = $props();
</script>

<div class="dm-table-row {isHeader ? 'dm-table-row--header' : 'dm-table-row--data'}">
	{@render children?.()}
</div>

