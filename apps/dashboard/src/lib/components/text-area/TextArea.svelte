<script lang="ts">
	import './TextArea.scss';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { onMount } from 'svelte';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		label?: string;
		error?: string;
		class?: string;
		autoResize?: boolean;
		onsubmit?: () => void;
	}

	let {
		value = $bindable(''),
		label,
		error,
		class: className = '',
		autoResize = true,
		onsubmit,
		...rest
	}: Props = $props();

	let textareaRef: HTMLTextAreaElement | undefined = $state();

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;
		if (autoResize) {
			adjustHeight();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (onsubmit) {
				onsubmit();
			}
		}
	}

	function adjustHeight() {
		if (!textareaRef) return;
		textareaRef.style.height = 'auto';
		textareaRef.style.height = `${Math.min(textareaRef.scrollHeight, 200)}px`;
	}

	onMount(() => {
		if (autoResize) adjustHeight();
	});

	$effect(() => {
		if (value === '' && autoResize) {
			adjustHeight();
		}
	});
</script>

<div class="dm-text-area {className}">
	{#if label}
		<label class="dm-text-area__label" for={rest.id}>{label}</label>
	{/if}
	
	<textarea
		bind:this={textareaRef}
		class="dm-text-area__input {error ? 'dm-text-area__input--error' : ''}"
		{value}
		oninput={handleInput}
		onkeydown={handleKeydown}
		{...rest as any}
	></textarea>

	{#if error}
		<span class="dm-text-area__error-text">{error}</span>
	{/if}
</div>
