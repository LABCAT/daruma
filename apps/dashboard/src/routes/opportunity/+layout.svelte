<script lang="ts">
	import { page } from '$app/stores';
	import './Opportunity.scss';
	let { children } = $props();
</script>

<div class="dm-opportunity">
	<div class="dm-opportunity__top-bar">
		<h1 class="dm-opportunity__main-title">Opportunity Engine</h1>
		<nav class="dm-opportunity__tabs">
			<a href="/opportunity/pending" class="dm-opportunity__tab" class:dm-opportunity__tab--active={$page.url.pathname === '/opportunity/pending'}>Pending</a>
			<a href="/opportunity/health" class="dm-opportunity__tab" class:dm-opportunity__tab--active={$page.url.pathname === '/opportunity/health'}>Health</a>
			<a href="/opportunity/seen" class="dm-opportunity__tab" class:dm-opportunity__tab--active={$page.url.pathname === '/opportunity/seen'}>Seen Keywords</a>
		</nav>
	</div>

	<div class="dm-opportunity__content">
		{@render children()}
	</div>
</div>
