<script lang="ts">
	import './ThemeToggle.scss';
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

