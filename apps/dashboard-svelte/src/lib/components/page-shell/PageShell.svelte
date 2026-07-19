<script lang="ts">
	import ThemeToggle from '../theme-toggle/ThemeToggle.svelte';
	import type { Snippet } from 'svelte';

	let {
		title,
		children
	}: {
		title?: string;
		children?: Snippet;
	} = $props();
</script>

<div class="dm-page-shell">
	<header class="dm-page-shell__header">
		{#if title}
			<h1 class="dm-page-shell__title">{title}</h1>
		{/if}
		<div style="margin-left: auto;">
			<ThemeToggle />
		</div>
	</header>
	<main class="dm-page-shell__main">
		{#if children}
			{@render children()}
		{/if}
	</main>
</div>

<style lang="scss">
	.dm-page-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		&__header {
			display: flex;
			align-items: center;
			padding: var(--dm-space-4) var(--dm-space-4) 0;
			max-width: var(--dm-container-max);
			margin: 0 auto;
			width: 100%;
		}

		&__title {
			margin-bottom: 0;
		}

		&__main {
			flex: 1;
			padding: var(--dm-space-4);
			max-width: var(--dm-container-max);
			margin: 0 auto;
			width: 100%;
		}
	}
</style>
