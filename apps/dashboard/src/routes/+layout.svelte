<script lang="ts">
	import '../styles/index.scss';
	import ThemeToggle from '$lib/components/theme-toggle/ThemeToggle.svelte';
	let { children } = $props();
</script>

<div class="app-root">
	{@render children()}
	<div class="global-theme-toggle">
		<ThemeToggle />
	</div>
</div>

<style lang="scss">
	.app-root {
		height: 100vh;
		width: 100vw;
		overflow: auto;
		background-color: var(--dm-color-background);
	}
	.global-theme-toggle {
		position: fixed;
		bottom: var(--dm-space-4);
		right: var(--dm-space-4);
		z-index: 9999;
	}
</style>
