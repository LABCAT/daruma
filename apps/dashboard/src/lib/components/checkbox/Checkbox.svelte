<script lang="ts">
	import './Checkbox.scss';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Check } from 'lucide-svelte';

	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		label?: string;
		description?: string;
		class?: string;
	}

	let { label, description, class: className = '', ...rest }: Props = $props();
</script>

<label class="dm-checkbox-wrapper {className}">
	<div class="dm-checkbox">
		<input type="checkbox" class="dm-checkbox__input" {...rest} />
		<div class="dm-checkbox__box">
			<Check class="dm-checkbox__icon" />
		</div>
	</div>
	{#if label || description}
		<div class="dm-checkbox__text">
			{#if label}
				<span class="dm-checkbox__label">{label}</span>
			{/if}
			{#if description}
				<p class="dm-checkbox__description">{description}</p>
			{/if}
		</div>
	{/if}
</label>

