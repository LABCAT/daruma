<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		size = 'md',
		children,
		class: className = '',
		...rest
	}: {
		variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg' | 'icon';
		children?: Snippet;
		class?: string;
		[key: string]: any;
	} = $props();
</script>

<button class={`dm-button dm-button--${variant} dm-button--${size} ${className}`} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</button>

<style lang="scss">
	.dm-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--dm-space-2);
		font-family: var(--dm-font-family);
		font-weight: var(--dm-font-weight-medium);
		border-radius: var(--dm-radius-md);
		cursor: pointer;
		transition:
			background-color var(--dm-transition-fast),
			color var(--dm-transition-fast),
			border-color var(--dm-transition-fast),
			box-shadow var(--dm-transition-fast),
			transform var(--dm-transition-fast);
		border: var(--dm-border-width-base) solid transparent;
		outline: none;
		white-space: nowrap;

		&:active {
			transform: scale(0.98);
		}

		&:focus-visible {
			box-shadow:
				0 0 0 2px var(--dm-color-bg),
				0 0 0 4px var(--dm-color-ring);
		}

		&:disabled {
			opacity: 0.5;
			pointer-events: none;
		}

		/* Sizes */
		&--sm {
			height: 32px;
			padding: 0 var(--dm-space-3);
			font-size: var(--dm-font-size-xs);
		}

		&--md {
			height: 40px;
			padding: 0 var(--dm-space-4);
			font-size: var(--dm-font-size-sm);
		}

		&--lg {
			height: 48px;
			padding: 0 var(--dm-space-8);
			font-size: var(--dm-font-size-base);
		}

		&--icon {
			height: 40px;
			width: 40px;
			padding: 0;
		}

		/* Variants */
		&--primary {
			background-color: var(--dm-color-primary);
			color: var(--dm-color-primary-foreground);
			box-shadow: var(--dm-shadow-sm);
			&:hover {
				background-color: hsl(var(--dm-primary-hsl) / 0.9);
			}
		}

		&--secondary {
			background-color: var(--dm-color-secondary);
			color: var(--dm-color-secondary-foreground);
			box-shadow: var(--dm-shadow-sm);
			&:hover {
				background-color: hsl(var(--dm-secondary-hsl) / 0.9);
			}
		}

		&--tertiary {
			background-color: var(--dm-color-tertiary);
			color: var(--dm-color-tertiary-foreground);
			box-shadow: var(--dm-shadow-sm);
			&:hover {
				background-color: hsl(var(--dm-tertiary-hsl) / 0.9);
			}
		}

		&--outline {
			background-color: transparent;
			color: var(--dm-color-text);
			border-color: var(--dm-color-border);
			box-shadow: var(--dm-shadow-sm);
			&:hover {
				background-color: var(--dm-color-muted);
			}
		}

		&--ghost {
			background-color: transparent;
			color: var(--dm-color-text);
			&:hover {
				background-color: var(--dm-color-muted);
			}
		}

		&--danger {
			background-color: transparent;
			color: var(--dm-color-danger);
			border-color: var(--dm-color-danger);
			box-shadow: var(--dm-shadow-sm);
			&:hover {
				background-color: var(--dm-color-danger);
				color: var(--dm-color-danger-foreground);
			}
		}
	}
</style>
