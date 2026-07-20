<script lang="ts">
	import './Stack.scss';
	import type { Snippet } from 'svelte';

	interface Props {
		space?: '1' | '2' | '3' | '4' | '5' | '6' | '8';
		children?: Snippet;
	}

	let { space = '3', children }: Props = $props();
</script>

<div class="dm-stack dm-stack--space-{space}">
	{@render children?.()}
</div>

