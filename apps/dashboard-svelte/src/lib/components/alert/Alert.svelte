<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		title,
		icon,
		children,
		class: className = '',
		...rest
	}: {
		variant?: 'default' | 'danger' | 'success' | 'warning';
		title?: string;
		icon?: Snippet;
		children?: Snippet;
		class?: string;
		[key: string]: any;
	} = $props();
</script>

<div class={`dm-alert dm-alert--${variant} ${className}`} role="alert" {...rest}>
	{#if icon}
		<div class="dm-alert__icon">{@render icon()}</div>
	{/if}
	<div class="dm-alert__content">
		{#if title}
			<h5 class="dm-alert__title">{title}</h5>
		{/if}
		<div class="dm-alert__description">
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.dm-alert {
		display: flex;
		position: relative;
		width: 100%;
		border-radius: var(--dm-radius-lg);
		border: none;
		padding: 16px;
		font-family: var(--dm-font-family);
		gap: 12px;

		&__icon {
			display: flex;
			align-items: flex-start;
			padding-top: 2px;

			svg {
				width: 20px;
				height: 20px;
			}
		}

		&__content {
			display: flex;
			flex-direction: column;
			gap: 4px;
			flex: 1;
		}

		&__title {
			margin: 0;
			font-size: 16px;
			font-weight: 600;
			line-height: 1.25;
		}

		&__description {
			font-size: 14px;
			line-height: 1.5;
			color: var(--dm-color-text);
		}

		/* Variants */
		&--danger {
			background-color: hsl(var(--dm-danger-hsl) / 0.1);
			box-shadow:
				inset var(--dm-border-width-accent) 0 0 0 hsl(var(--dm-danger-hsl)),
				inset 0 0 0 var(--dm-border-width-base) hsl(var(--dm-danger-hsl) / 0.15);
			.dm-alert__icon {
				color: hsl(var(--dm-danger-hsl));
			}
			.dm-alert__title {
				color: hsl(var(--dm-danger-hsl));
			}
		}

		&--success {
			background-color: hsl(var(--dm-success-hsl) / 0.15);
			box-shadow:
				inset var(--dm-border-width-accent) 0 0 0 hsl(var(--dm-success-hsl)),
				inset 0 0 0 var(--dm-border-width-base) hsl(var(--dm-success-hsl) / 0.2);
			.dm-alert__icon {
				color: hsl(var(--dm-success-hsl));
			}
			.dm-alert__title {
				color: hsl(var(--dm-success-hsl));
			}
		}

		&--warning {
			background-color: hsl(var(--dm-secondary-hsl) / 0.15);
			box-shadow:
				inset var(--dm-border-width-accent) 0 0 0 hsl(var(--dm-secondary-hsl)),
				inset 0 0 0 var(--dm-border-width-base) hsl(var(--dm-secondary-hsl) / 0.2);
			.dm-alert__icon {
				color: hsl(var(--dm-secondary-hsl));
			}
			.dm-alert__title {
				color: hsl(var(--dm-secondary-hsl));
			}
		}
	}
</style>
