<script lang="ts">
	import PageShell from '$lib/components/page-shell/PageShell.svelte';
	import TextArea from '$lib/components/text-area/TextArea.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import Select from '$lib/components/select/Select.svelte';
	import { Send } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let inputMessage = $state('');
	let isSubmitting = $state(false);
	let selectedModel = $state(data.preferredModelId || 'gemini-3.5-flash-lite');

	async function handleSubmit() {
		if (!inputMessage.trim() || isSubmitting) return;

		isSubmitting = true;
		try {
			const res = await fetch('/api/chat/create', { 
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ preferredModelId: selectedModel })
			});
			const { id } = await res.json();

			goto(`/chat/${id}?q=${encodeURIComponent(inputMessage)}`);
		} catch (err) {
			console.error(err);
			isSubmitting = false;
		}
	}
</script>

<PageShell>
	<div class="home-workspace">
		<div class="home-content">
			<h1 class="greeting">What can I help you with?</h1>
			<div class="composer-container">
				<div class="model-selector-wrapper">
					<Select bind:value={selectedModel} disabled={isSubmitting}>
						{#each data.enabledModels as model}
							<option value={model}>{model}</option>
						{/each}
					</Select>
				</div>
				<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="composer-form">
					<TextArea
						placeholder="Message Daruma..."
						bind:value={inputMessage}
						disabled={isSubmitting}
						onsubmit={handleSubmit}
					/>
					<Button type="submit" variant="primary" disabled={isSubmitting} class="send-btn">
						<Send size={16} />
					</Button>
				</form>
			</div>
		</div>
	</div>
</PageShell>

<style lang="scss">
	.home-workspace {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: calc(100vh - 120px);
	}

	.home-content {
		width: 100%;
		max-width: 800px;
		padding: var(--dm-space-4);
		text-align: center;
	}

	.greeting {
		font-size: var(--dm-font-size-3xl);
		font-weight: var(--dm-font-weight-bold);
		color: var(--dm-color-foreground);
		margin-bottom: var(--dm-space-8);
	}

	.composer-container {
		display: flex;
		flex-direction: column;
		gap: var(--dm-space-2);
		margin: 0 auto;
		text-align: left;
	}

	.model-selector-wrapper {
		display: flex;
		justify-content: flex-end;
	}



	.composer-form {
		display: flex;
		gap: var(--dm-space-2);
		align-items: flex-end;
		
		:global(.dm-text-area) {
			flex: 1;
		}
	}
</style>
