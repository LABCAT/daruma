<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		space = '3',
		children
	}: {
		space?: '1' | '2' | '3' | '4' | '5' | '6' | '8';
		children?: Snippet;
	} = $props();
</script>

<div class={`dm-stack dm-stack--space-${space}`}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.dm-stack {
		display: flex;
		flex-direction: column;

		&--space-1 {
			gap: var(--dm-space-1);
		}
		&--space-2 {
			gap: var(--dm-space-2);
		}
		&--space-3 {
			gap: var(--dm-space-3);
		}
		&--space-4 {
			gap: var(--dm-space-4);
		}
		&--space-5 {
			gap: var(--dm-space-5);
		}
		&--space-6 {
			gap: var(--dm-space-6);
		}
		&--space-8 {
			gap: var(--dm-space-8);
		}
	}
</style>
