<script lang="ts">
	import './Select.scss';
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		label?: string;
		error?: string;
		helperText?: string;
		class?: string;
		wrapperClass?: string;
		value?: string | number | string[];
		children?: Snippet;
	}

	let {
		label,
		error,
		helperText,
		class: className = '',
		id = 'select-' + Math.random().toString(36).slice(2, 9),
		value = $bindable(),
		children,
		...rest
	}: Props = $props();
</script>

<div class="dm-select {wrapperClass || ''}">
	{#if label}
		<label class="dm-select__label" for={id}>{label}</label>
	{/if}
	<div class="dm-select__wrapper">
		<select
			{id}
			class="dm-select__field {error ? 'dm-select__field--error' : ''} {className}"
			bind:value
			{...rest}
		>
			{#if children}
				{@render children()}
			{/if}
		</select>
		<div class="dm-select__icon">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</div>
	</div>
	{#if error || helperText}
		<span class="dm-select__helper {error ? 'dm-select__helper--error' : ''}">
			{error || helperText}
		</span>
	{/if}
</div>
