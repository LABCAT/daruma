<script lang="ts">
	import './Switch.scss';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		label?: string;
		class?: string;
	}

	let { label, class: className = '', ...rest }: Props = $props();
</script>

<label class="dm-switch-wrapper {className}">
	<div class="dm-switch">
		<input type="checkbox" class="dm-switch__input" {...rest} />
		<span class="dm-switch__slider"></span>
	</div>
	{#if label}
		<span class="dm-switch__label">{label}</span>
	{/if}
</label>

