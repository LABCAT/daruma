<script lang="ts">
	import './Button.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg' | 'icon';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		size?: Size;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<button class="dm-button dm-button--{variant} dm-button--{size} {className}" {...rest}>
	{@render children?.()}
</button>

