<script lang="ts">
	import './ChatSidebar.scss';
	import { page } from '$app/stores';
	import { Plus, MessageSquare, LayoutDashboard, Palette, Trash2 } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { goto } from '$app/navigation';

	interface Conversation {
		id: string;
		title: string;
	}

	interface Props {
		conversations?: Conversation[];
	}

	let { conversations = [] }: Props = $props();

	let activeId = $derived($page.params.id);

	async function deleteConversation(id: string) {
		const confirmed = confirm('Are you sure you want to delete this chat? This action cannot be undone.');
		if (!confirmed) return;

		try {
			const res = await fetch(`/api/chat/${id}`, { method: 'DELETE' });
			if (res.ok) {
				await invalidateAll();
				if (activeId === id) {
					goto('/');
				}
			}
		} catch (err) {
			console.error('Failed to delete conversation', err);
		}
	}
</script>

<aside class="dm-chat-sidebar">
	<div class="dm-chat-sidebar__header">
		<a href="/" class="dm-chat-sidebar__new-btn">
			<div class="dm-chat-sidebar__new-btn-content">
				<div class="dm-chat-sidebar__logo">Daruma</div>
			</div>
			<div class="dm-chat-sidebar__new-icon">
				<Plus size={18} />
			</div>
		</a>
	</div>
	
	<div class="dm-chat-sidebar__scroll-area">
		<div class="dm-chat-sidebar__list">
			<div class="dm-chat-sidebar__section-title">Recent Chats</div>
			{#each conversations as conv}
				<a 
					href="/chat/{conv.id}" 
					class="dm-chat-sidebar__item {activeId === conv.id ? 'dm-chat-sidebar__item--active' : ''}"
				>
					<MessageSquare size={16} class="dm-chat-sidebar__item-icon" />
					<span class="dm-chat-sidebar__item-title">{conv.title}</span>
					<button 
						class="dm-chat-sidebar__delete-btn"
						title="Delete chat"
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							deleteConversation(conv.id);
						}}
					>
						<Trash2 size={14} />
					</button>
				</a>
			{:else}
				<div class="dm-chat-sidebar__empty">
					No conversations yet
				</div>
			{/each}
		</div>
	</div>
	
	<div class="dm-chat-sidebar__footer">
		<a href="/opportunity" class="dm-chat-sidebar__item">
			<LayoutDashboard size={16} class="dm-chat-sidebar__item-icon" />
			<span class="dm-chat-sidebar__item-title">Opportunity Engine</span>
		</a>
		<a href="/design" class="dm-chat-sidebar__item">
			<Palette size={16} class="dm-chat-sidebar__item-icon" />
			<span class="dm-chat-sidebar__item-title">Design System</span>
		</a>
	</div>
</aside>
