<script lang="ts">
	import { onMount } from 'svelte';

	let theme = $state('light');

	onMount(() => {
		const savedTheme = localStorage.getItem('dm-theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

		if (savedTheme) {
			theme = savedTheme;
			document.documentElement.setAttribute('data-theme', savedTheme);
		} else if (prefersDark.matches) {
			theme = 'dark';
			document.documentElement.setAttribute('data-theme', 'dark');
		}

		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('dm-theme')) {
				const newTheme = e.matches ? 'dark' : 'light';
				theme = newTheme;
				document.documentElement.setAttribute('data-theme', newTheme);
			}
		};

		prefersDark.addEventListener('change', handleChange);
		return () => prefersDark.removeEventListener('change', handleChange);
	});

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		theme = newTheme;
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('dm-theme', newTheme);
	}
</script>

<button class="dm-theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
	{theme === 'light' ? '☾ Dark' : '☼ Light'}
</button>

<style lang="scss">
	.dm-theme-toggle {
		background: transparent;
		border: var(--dm-border-width-base) solid var(--dm-color-border);
		color: var(--dm-color-text);
		font-family: var(--dm-font-family);
		font-size: var(--dm-font-size-sm);
		font-weight: var(--dm-font-weight-bold);
		padding: var(--dm-space-1) var(--dm-space-3);
		border-radius: var(--dm-radius-lg); // pill shape
		cursor: pointer;
		transition: all var(--dm-transition-fast);
		display: flex;
		align-items: center;
		gap: var(--dm-space-2);

		&:hover {
			background: var(--dm-color-surface);
			border-color: var(--dm-color-text);
		}
	}
</style>
