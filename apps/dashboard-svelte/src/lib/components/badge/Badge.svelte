<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		children,
		class: className = '',
		...rest
	}: {
		variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
		children?: Snippet;
		class?: string;
		[key: string]: any;
	} = $props();
</script>

<div class={`dm-badge dm-badge--${variant} ${className}`} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</div>

<style lang="scss">
	.dm-badge {
		display: inline-flex;
		align-items: center;
		border-radius: var(--dm-radius-pill);
		border: var(--dm-border-width-base) solid transparent;
		padding: 4px 12px;
		font-size: 13px;
		font-weight: 600;
		font-family: var(--dm-font-family);
		line-height: 1.2;
		gap: 6px;
		transition: all var(--dm-transition-fast);
		white-space: nowrap;

		&--default {
			background-color: transparent;
			color: var(--dm-color-muted-foreground);
			border-color: var(--dm-color-border);
			&:hover {
				background-color: var(--dm-color-surface);
			}
		}

		&--primary {
			background-color: hsl(var(--dm-primary-hsl) / 0.12);
			color: hsl(var(--dm-primary-hsl));
			border-color: hsl(var(--dm-primary-hsl) / 0.2);
			&:hover {
				background-color: hsl(var(--dm-primary-hsl) / 0.2);
			}
		}

		&--secondary {
			background-color: hsl(var(--dm-secondary-hsl) / 0.12);
			color: hsl(var(--dm-secondary-hsl));
			border-color: hsl(var(--dm-secondary-hsl) / 0.2);
			&:hover {
				background-color: hsl(var(--dm-secondary-hsl) / 0.2);
			}
		}

		&--danger {
			background-color: hsl(var(--dm-danger-hsl) / 0.12);
			color: hsl(var(--dm-danger-hsl));
			border-color: hsl(var(--dm-danger-hsl) / 0.2);
			&:hover {
				background-color: hsl(var(--dm-danger-hsl) / 0.2);
			}
		}

		&--success {
			background-color: hsl(var(--dm-success-hsl) / 0.12);
			color: hsl(var(--dm-success-hsl));
			border-color: hsl(var(--dm-success-hsl) / 0.2);
			&:hover {
				background-color: hsl(var(--dm-success-hsl) / 0.2);
			}
		}

		&--warning {
			background-color: hsl(var(--dm-secondary-hsl) / 0.12);
			color: hsl(var(--dm-secondary-hsl));
			border-color: hsl(var(--dm-secondary-hsl) / 0.2);
			&:hover {
				background-color: hsl(var(--dm-secondary-hsl) / 0.2);
			}
		}
	}
</style>
