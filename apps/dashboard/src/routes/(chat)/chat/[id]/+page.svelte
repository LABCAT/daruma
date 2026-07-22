<script lang="ts">
	import PageShell from '$lib/components/page-shell/PageShell.svelte';
	import Stack from '$lib/components/stack/Stack.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import TextArea from '$lib/components/text-area/TextArea.svelte';
	import { Send, LayoutDashboard } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { getModelConfig } from '$lib/config/models';
	import './_page.scss';

	let { data } = $props();
	
	let messages = $state<any[]>([]);
	let selectedModel = $state(data.enabledModels[0] || 'gemini-flash');
	let inputMessage = $state('');

	$effect(() => {
		if (messages.length === 0 && data.messages?.length > 0) {
			messages = data.messages;
		}
		if (selectedModel === data.enabledModels[0] && data.preferredModelId && data.enabledModels.includes(data.preferredModelId)) {
			selectedModel = data.preferredModelId;
		}
	});
	let isSubmitting = $state(false);

	let activeConfig = $derived(getModelConfig(selectedModel));
	let maxTokens = $derived(Math.min(activeConfig?.contextWindow || Infinity, activeConfig?.requestCeilingTokens || Infinity));
	let currentTextLength = $derived(messages.reduce((sum, m) => sum + (m.content?.length || 0), 0) + inputMessage.length + 15000); // 15k char buffer for system prompt
	let estimatedTokens = $derived(Math.round(currentTextLength / 3.5));
	let usagePercent = $derived(maxTokens !== Infinity ? Math.min(100, (estimatedTokens / maxTokens) * 100) : 0);

	let transcriptRef: HTMLElement | undefined = $state();

	onMount(() => {
		const q = $page.url.searchParams.get('q');
		if (q && messages.length === 0) {
			inputMessage = q;
			window.history.replaceState({}, '', `/chat/${data.conversationId}`);
			handleSubmit(new Event('submit') as any);
		}
	});

	function scrollToBottom() {
		if (transcriptRef) {
			setTimeout(() => {
				transcriptRef.scrollTop = transcriptRef.scrollHeight;
			}, 10);
		}
	}

	$effect(() => {
		messages;
		scrollToBottom();
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!inputMessage.trim() || isSubmitting) return;

		const userMsg = inputMessage;
		inputMessage = '';
		isSubmitting = true;

		// Add user message optimistically, and empty assistant message for loader
		messages = [...messages, 
			{ role: 'user', content: userMsg },
			{ role: 'assistant', content: '' }
		];

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					conversation_id: data.conversationId,
					message: userMsg,
					model_id: selectedModel
				})
			});

			if (!res.ok) {
				messages[messages.length - 1] = { role: 'event', content: 'Failed to send message.' };
				isSubmitting = false;
				return;
			}

			// Read stream
			const reader = res.body?.getReader();
			if (!reader) return;

			const decoder = new TextDecoder();
			let assistantContent = '';
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					const trimmed = line.trim();
					if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
						try {
							const json = JSON.parse(trimmed.slice(6));
							if (json.choices && json.choices[0]?.delta?.content) {
								assistantContent += json.choices[0].delta.content;
								// Update last message
								messages[messages.length - 1].content = assistantContent;
							}
						} catch (err) {
							// Ignore parsing errors for partial chunks
						}
					}
				}
			}

			// Auto-rename if this is the first message (title is still 'New Chat')
			if (data.title === 'New Chat' && messages.length === 2) { // 2 messages = user + assistant
				fetch(`/api/chat/${data.conversationId}/generate-title`, { method: 'POST' })
					.then(r => r.json())
					.then(res => {
						if (res.success) {
							data.title = res.title;
							invalidateAll(); // refresh sidebar
						}
					})
					.catch(console.error);
			}

		} catch (err) {
			console.error(err);
			messages = [...messages, { role: 'event', content: 'Connection error.' }];
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="chat-workspace">
	<div class="chat-header">
		<div class="chat-header-left">
			<a href="/" class="chat-back-btn" title="Back to dashboard">
				<LayoutDashboard size={20} />
			</a>
			<h1 class="chat-title">Chat</h1>
		</div>
		<div class="model-selector">
			<select bind:value={selectedModel} class="model-dropdown">
				{#each data.enabledModels as model}
					<option value={model}>{model}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="chat-transcript" bind:this={transcriptRef}>
		<Stack space="4">
			{#each messages as msg}
				{#if msg.role === 'event'}
					<div class="message-event">
						{msg.content}
					</div>
				{:else}
					<div class="message-bubble message-bubble--{msg.role}">
						<div class="message-content">
							{#if msg.role === 'assistant'}
								{#if msg.content === ''}
									<div class="typing-indicator">
										<span></span>
										<span></span>
										<span></span>
									</div>
								{:else}
									<!-- Markdown rendering would go here, using pre for now -->
									<pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">{msg.content}</pre>
								{/if}
							{:else}
								{msg.content}
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		</Stack>
	</div>

	<div class="chat-composer">
		<form onsubmit={handleSubmit} class="composer-form">
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
		<div class="context-bar-container">
			<div class="context-bar-fill" style="width: {usagePercent}%" class:warning={usagePercent > 80}></div>
			<div class="context-bar-text">
				{estimatedTokens} / {maxTokens !== Infinity ? maxTokens : '∞'} tokens
				{#if activeConfig?.requestCeilingTokens && activeConfig.requestCeilingTokens < activeConfig.contextWindow}
					<span class="context-bar-hint">(rate ceiling bound)</span>
				{/if}
			</div>
		</div>
	</div>
</div>
