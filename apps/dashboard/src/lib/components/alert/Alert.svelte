<script lang="ts">
	import './Alert.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'default' | 'danger' | 'success' | 'warning';
		title?: string;
		icon?: Snippet;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		title,
		icon,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<div class="dm-alert dm-alert--{variant} {className}" role="alert" {...rest}>
	{#if icon}
		<div class="dm-alert__icon">{@render icon()}</div>
	{/if}
	<div class="dm-alert__content">
		{#if title}
			<h5 class="dm-alert__title">{title}</h5>
		{/if}
		<div class="dm-alert__description">
			{@render children?.()}
		</div>
	</div>
</div>

