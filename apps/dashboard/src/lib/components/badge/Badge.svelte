<script lang="ts">
	import './Badge.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
		class?: string;
		children?: Snippet;
	}

	let { variant = 'default', class: className = '', children, ...rest }: Props = $props();
</script>

<div class="dm-badge dm-badge--{variant} {className}" {...rest}>
	{@render children?.()}
</div>

