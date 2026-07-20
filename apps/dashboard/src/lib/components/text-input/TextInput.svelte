<script lang="ts">
	import './TextInput.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
		helperText?: string;
		icon?: Snippet;
		class?: string;
	}

	let {
		label,
		error,
		helperText,
		icon,
		class: className = '',
		id,
		...rest
	}: Props = $props();
</script>

<div class="dm-text-input">
	{#if label}
		<label class="dm-text-input__label" for={id}>{label}</label>
	{/if}
	<div class="dm-text-input__wrapper">
		{#if icon}
			<div class="dm-text-input__icon">{@render icon()}</div>
		{/if}
		<input
			{id}
			class="dm-text-input__field {icon ? 'dm-text-input__field--with-icon' : ''} {error
				? 'dm-text-input__field--error'
				: ''} {className}"
			{...rest}
		/>
	</div>
	{#if error || helperText}
		<span class="dm-text-input__helper {error ? 'dm-text-input__helper--error' : ''}">
			{error || helperText}
		</span>
	{/if}
</div>

