<script lang="ts">
	import './TextInput.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
		helperText?: string;
		icon?: Snippet;
		suffix?: Snippet;
		class?: string;
		value?: string | number | string[];
	}

	let {
		label,
		error,
		helperText,
		icon,
		suffix,
		class: className = '',
		id = 'text-input-' + Math.random().toString(36).slice(2, 9),
		value = $bindable(),
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
			class="dm-text-input__field {icon ? 'dm-text-input__field--with-icon' : ''} {suffix ? 'dm-text-input__field--with-suffix' : ''} {error
				? 'dm-text-input__field--error'
				: ''} {className}"
			bind:value
			{...rest}
		/>
		{#if suffix}
			<div class="dm-text-input__suffix">{@render suffix()}</div>
		{/if}
	</div>
	{#if error || helperText}
		<span class="dm-text-input__helper {error ? 'dm-text-input__helper--error' : ''}">
			{error || helperText}
		</span>
	{/if}
</div>

