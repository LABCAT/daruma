<script lang="ts">
	import './Button.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg' | 'icon';

	interface Props {
		variant?: Variant;
		size?: Size;
		class?: string;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		style?: string;
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let {
		variant = 'primary',
		size = 'md',
		class: className = '',
		href,
		children,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a {href} class="dm-button dm-button--{variant} dm-button--{size} {className}" {...rest as any}>
		{@render children?.()}
	</a>
{:else}
	<button class="dm-button dm-button--{variant} dm-button--{size} {className}" {...rest as any}>
		{@render children?.()}
	</button>
{/if}

