<script lang="ts">
	import '../styles/index.scss';
	let { children } = $props();
</script>

<div class="app-root">
	{@render children()}
</div>

<style lang="scss">
	.app-root {
		height: 100vh;
		width: 100vw;
		overflow: auto;
		background-color: var(--dm-color-background);
	}
</style>
