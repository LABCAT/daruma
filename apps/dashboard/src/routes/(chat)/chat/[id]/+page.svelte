<script lang="ts">
	import PageShell from '$lib/components/page-shell/PageShell.svelte';
	import Stack from '$lib/components/stack/Stack.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import TextArea from '$lib/components/text-area/TextArea.svelte';
	import { Send, LayoutDashboard } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	
	let messages = $state<any[]>([]);
	let selectedModel = $state('gemini-3.5-flash-lite');
	let inputMessage = $state('');

	$effect(() => {
		if (messages.length === 0 && data.messages?.length > 0) {
			messages = data.messages;
		}
		if (selectedModel === 'gemini-3.5-flash-lite' && data.preferredModelId) {
			selectedModel = data.preferredModelId;
		}
	});
	let isSubmitting = $state(false);

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
	</div>
</div>

<style lang="scss">
	.chat-workspace {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: var(--dm-color-bg);
	}

	.chat-header {
		padding: var(--dm-space-4);
		border-bottom: var(--dm-border-width-base) solid var(--dm-color-border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--dm-color-surface);
	}

	.chat-header-left {
		display: flex;
		align-items: center;
		gap: var(--dm-space-3);
	}

	.chat-back-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--dm-space-2);
		color: var(--dm-color-text);
		text-decoration: none;
		border-radius: var(--dm-radius-md);
		transition: background-color 0.2s;

		&:hover {
			background: var(--dm-color-border);
		}
	}

	.chat-title {
		font-size: var(--dm-font-size-xl);
		font-weight: var(--dm-font-weight-bold);
		margin: 0;
	}

	.model-dropdown {
		padding: var(--dm-space-2) var(--dm-space-3);
		border-radius: var(--dm-radius-md);
		border: var(--dm-border-width-base) solid var(--dm-color-border);
		background: var(--dm-color-bg);
		color: var(--dm-color-text);
		font-size: var(--dm-font-size-sm);
	}

	.chat-transcript {
		flex: 1;
		overflow-y: auto;
		padding: var(--dm-space-6) var(--dm-space-4);
	}

	.message-event {
		text-align: center;
		font-size: var(--dm-font-size-sm);
		color: var(--dm-color-muted-foreground, gray);
		padding: var(--dm-space-2);
		margin: var(--dm-space-2) 0;
		background: var(--dm-color-surface);
		border-radius: var(--dm-radius-sm);
	}

	.message-bubble {
		max-width: 80%;
		padding: var(--dm-space-3) var(--dm-space-4);
		border-radius: var(--dm-radius-lg);
	}

	.message-bubble--user {
		align-self: flex-end;
		background: var(--dm-color-primary);
		color: white;
		border-bottom-right-radius: var(--dm-radius-sm);
	}

	.message-bubble--assistant {
		align-self: flex-start;
		background: var(--dm-color-surface);
		border: var(--dm-border-width-base) solid var(--dm-color-border);
		color: var(--dm-color-text);
		border-bottom-left-radius: var(--dm-radius-sm);
	}

	.chat-composer {
		padding: var(--dm-space-4);
		background: var(--dm-color-surface);
		border-top: var(--dm-border-width-base) solid var(--dm-color-border);
	}

	.composer-form {
		display: flex;
		gap: var(--dm-space-2);
		max-width: 800px;
		margin: 0 auto;
		align-items: flex-end;
		
		:global(.dm-text-area) {
			flex: 1;
		}
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		padding: var(--dm-space-1) 0;

		span {
			width: 6px;
			height: 6px;
			background-color: var(--dm-color-muted-foreground, gray);
			border-radius: 50%;
			animation: typing 1.4s infinite ease-in-out;
		}

		span:nth-child(1) { animation-delay: -0.32s; }
		span:nth-child(2) { animation-delay: -0.16s; }
	}

	@keyframes typing {
		0%, 80%, 100% { transform: scale(0); }
		40% { transform: scale(1); }
	}
</style>
