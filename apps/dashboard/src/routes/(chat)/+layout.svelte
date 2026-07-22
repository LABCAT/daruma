<script lang="ts">
	import ChatSidebar from '$lib/components/chat-sidebar/ChatSidebar.svelte';
	let { data, children } = $props();
</script>

<div class="chat-layout">
	<ChatSidebar conversations={data.conversations || []} />
	<main class="chat-main">
		{@render children()}
	</main>
</div>

<style lang="scss">
	.chat-layout {
		display: flex;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}

	.chat-main {
		flex: 1;
		height: 100vh;
		overflow-y: auto;
		background-color: var(--dm-color-background);
	}
</style>
