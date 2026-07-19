<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		error,
		helperText,
		icon,
		class: className = '',
		id,
		...rest
	}: {
		label?: string;
		error?: string;
		helperText?: string;
		icon?: Snippet;
		class?: string;
		id?: string;
		[key: string]: any;
	} = $props();
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
			class={`dm-text-input__field ${icon ? 'dm-text-input__field--with-icon' : ''} ${error ? 'dm-text-input__field--error' : ''} ${className}`}
			{...rest}
		/>
	</div>
	{#if error || helperText}
		<span class={`dm-text-input__helper ${error ? 'dm-text-input__helper--error' : ''}`}>
			{error || helperText}
		</span>
	{/if}
</div>

<style lang="scss">
	.dm-text-input {
		display: flex;
		flex-direction: column;
		gap: var(--dm-space-1);
		width: 100%;

		&__label {
			font-size: var(--dm-font-size-sm);
			font-weight: var(--dm-font-weight-medium);
			color: var(--dm-color-text);
		}

		&__wrapper {
			position: relative;
			display: flex;
			align-items: center;
		}

		&__icon {
			position: absolute;
			left: var(--dm-space-3);
			color: var(--dm-color-muted-foreground);
			display: flex;
			align-items: center;
			justify-content: center;
			pointer-events: none;

			svg {
				width: 16px;
				height: 16px;
			}
		}

		&__field {
			width: 100%;
			height: 40px;
			padding: 0 var(--dm-space-3);
			border-radius: var(--dm-radius-md);
			border: var(--dm-border-width-base) solid var(--dm-color-border);
			background-color: var(--dm-color-surface);
			color: var(--dm-color-text);
			font-family: var(--dm-font-family);
			font-size: var(--dm-font-size-sm);
			transition: all var(--dm-transition-fast);

			&::placeholder {
				color: var(--dm-color-muted-foreground);
			}

			&:focus-visible {
				border-color: var(--dm-color-primary);
				box-shadow: 0 0 0 1px var(--dm-color-primary);
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				background-color: var(--dm-color-muted);
			}

			&--with-icon {
				padding-left: calc(var(--dm-space-3) + 16px + var(--dm-space-2));
			}

			&--error {
				border-color: var(--dm-color-danger);
				&:focus-visible {
					box-shadow: 0 0 0 1px var(--dm-color-danger);
				}
			}
		}

		&__helper {
			font-size: var(--dm-font-size-xs);
			color: var(--dm-color-muted-foreground);

			&--error {
				color: var(--dm-color-danger);
			}
		}
	}
</style>
