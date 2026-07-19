<script lang="ts">
	let {
		label,
		class: className = '',
		...rest
	}: {
		label?: string;
		class?: string;
		[key: string]: any;
	} = $props();
</script>

<label class={`dm-switch-wrapper ${className}`}>
	<div class="dm-switch">
		<input type="checkbox" class="dm-switch__input" {...rest} />
		<span class="dm-switch__slider"></span>
	</div>
	{#if label}
		<span class="dm-switch__label">{label}</span>
	{/if}
</label>

<style lang="scss">
	.dm-switch-wrapper {
		display: inline-flex;
		align-items: center;
		gap: var(--dm-space-3);
		cursor: pointer;
	}

	.dm-switch {
		position: relative;
		display: inline-block;
		width: 44px;
		height: 24px;
		flex-shrink: 0;

		&__input {
			opacity: 0;
			width: 0;
			height: 0;
			position: absolute;

			&:checked + .dm-switch__slider {
				background-color: var(--dm-color-primary);
			}

			&:checked + .dm-switch__slider:before {
				transform: translateX(20px);
			}

			&:focus-visible + .dm-switch__slider {
				box-shadow:
					0 0 0 2px var(--dm-color-bg),
					0 0 0 4px var(--dm-color-ring);
			}

			&:disabled + .dm-switch__slider {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}

		&__slider {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--dm-color-border);
			transition: var(--dm-transition-base);
			border-radius: var(--dm-radius-pill);

			&:before {
				position: absolute;
				content: '';
				height: 20px;
				width: 20px;
				left: 2px;
				bottom: 2px;
				background-color: white;
				transition: var(--dm-transition-base);
				border-radius: 50%;
				box-shadow: var(--dm-shadow-sm);
			}
		}

		&__label {
			font-family: var(--dm-font-family);
			font-size: var(--dm-font-size-sm);
			font-weight: var(--dm-font-weight-medium);
			color: var(--dm-color-text);
		}
	}
</style>
