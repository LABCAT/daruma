<script lang="ts">
	import './PageShell.scss';
	import type { Snippet } from 'svelte';
	import ThemeToggle from '../theme-toggle/ThemeToggle.svelte';

	interface Props {
		title?: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="dm-page-shell">
	<header class="dm-page-shell__header">
		{#if title}
			<h1 class="dm-page-shell__title">{title}</h1>
		{/if}
		<div style="margin-left: auto">
			<ThemeToggle />
		</div>
	</header>
	<main class="dm-page-shell__main">
		{@render children?.()}
	</main>
</div>

