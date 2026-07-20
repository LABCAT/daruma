<script lang="ts">
	import '../styles/index.scss';

	let { children } = $props();
</script>

<svelte:head>
	<title>Daruma</title>
</svelte:head>

{@render children()}
