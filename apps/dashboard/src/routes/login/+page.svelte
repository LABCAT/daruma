<script lang="ts">
	import PageShell from '$lib/components/page-shell/PageShell.svelte';
	import Stack from '$lib/components/stack/Stack.svelte';
	import TextInput from '$lib/components/text-input/TextInput.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import Alert from '$lib/components/alert/Alert.svelte';
	import { AlertCircle, Lock, Eye, EyeOff } from 'lucide-svelte';

	let password = $state('');
	let showPassword = $state(false);
	let error = $state('');
	let loading = $state(false);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const res = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password })
			});

			if (res.ok) {
				window.location.href = '/';
			} else {
				error = 'Invalid password. Please try again.';
			}
		} catch (err) {
			error = 'Something went wrong while connecting to the server.';
		} finally {
			loading = false;
		}
	}
</script>

{#snippet dangerAlertIcon()}
	<AlertCircle size={18} />
{/snippet}

{#snippet lockIcon()}
	<Lock size={18} />
{/snippet}

{#snippet passwordSuffix()}
	<button
		type="button"
		class="password-toggle"
		onclick={() => (showPassword = !showPassword)}
		aria-label={showPassword ? 'Hide password' : 'Show password'}
	>
		{#if showPassword}
			<EyeOff size={16} />
		{:else}
			<Eye size={16} />
		{/if}
	</button>
{/snippet}

<PageShell title="Daruma">
	<div class="login-wrapper">
		<div class="login-container">
			<Stack space="6">
				<div class="login-header">
					<h1 class="login-title">Welcome Back</h1>
					<p class="login-subtitle">Enter your password to access the Daruma dashboard.</p>
				</div>

				<form class="login-form" onsubmit={handleSubmit}>
					<Stack space="4">
						<TextInput
							id="password"
							label="Password"
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							icon={lockIcon}
							suffix={passwordSuffix}
							bind:value={password}
							required
						/>
						
						{#if error}
							<Alert variant="danger" title="Authentication Failed" icon={dangerAlertIcon}>
								{error}
							</Alert>
						{/if}

						<div style="margin-top: var(--dm-space-2)">
							<Button variant="primary" type="submit" disabled={loading} style="width: 100%">
								{loading ? 'Authenticating...' : 'Login'}
							</Button>
						</div>
					</Stack>
				</form>
			</Stack>
		</div>
	</div>
</PageShell>

<style lang="scss">
	.login-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 200px);
	}

	.login-container {
		width: 100%;
		max-width: 420px;
		padding: var(--dm-space-8);
		background-color: var(--dm-color-surface);
		border: var(--dm-border-width-base) solid var(--dm-color-border);
		border-radius: var(--dm-radius-lg);
		box-shadow: var(--dm-shadow-lg);
	}

	.login-header {
		text-align: center;
	}

	.login-title {
		font-size: var(--dm-font-size-2xl);
		font-weight: var(--dm-font-weight-bold);
		margin-bottom: var(--dm-space-2);
		color: var(--dm-color-foreground);
		letter-spacing: -0.025em;
	}

	.login-subtitle {
		font-size: var(--dm-font-size-sm);
		color: var(--dm-color-muted-foreground);
	}

	.password-toggle {
		background: none;
		border: none;
		padding: 0;
		color: var(--dm-color-muted-foreground);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--dm-transition-fast);

		&:hover {
			color: var(--dm-color-foreground);
		}
	}
</style>
