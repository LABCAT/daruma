<script lang="ts">
	import { marked } from 'marked';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';
	import './Markdown.scss';

	interface Props {
		content: string;
		class?: string;
	}

	let { content, class: className = '' }: Props = $props();

	let html = $derived.by(() => {
		if (!content) return '';
		
		const parsed = marked.parse(content, { async: false }) as string;
		
		if (browser) {
			return DOMPurify.sanitize(parsed);
		}
		
		// Simple fallback for SSR if needed (though usually not necessary for SPA chat)
		return parsed;
	});
</script>

<div class="dm-markdown {className}">
	{@html html}
</div>
