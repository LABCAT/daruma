import { describe, it, expect } from 'vitest';
import { trimHistory, type Message } from './llm';

describe('llm utilities', () => {
	describe('trimHistory', () => {
		it('should keep all messages if under limit', () => {
			const messages: Message[] = [
				{ role: 'system', content: 'system prompt' },
				{ role: 'user', content: 'hello' }
			];
			const trimmed = trimHistory(messages, 'gemini-flash');
			expect(trimmed.length).toBe(2);
		});

		it('should drop older messages if over ceiling', () => {
			const testModel = 'groq-gpt-oss-120b';
			
			const longText = 'a'.repeat(20000); // ~ 5700 tokens
			
			const messages: Message[] = [
				{ role: 'system', content: 'system prompt' },
				{ role: 'user', content: longText },
				{ role: 'assistant', content: 'ok' },
				{ role: 'user', content: longText }
			];
			
			const trimmed = trimHistory(messages, testModel);
			expect(trimmed.length).toBe(3);
			expect(trimmed[0].role).toBe('system');
			expect(trimmed[1].content).toBe('ok');
			expect(trimmed[2].content).toBe(longText);
		});

		it('should always keep system messages even if massive', () => {
			const longText = 'a'.repeat(100000); 
			const messages: Message[] = [
				{ role: 'system', content: longText }, 
				{ role: 'user', content: 'hello' } 
			];
			const trimmed = trimHistory(messages, 'groq-gpt-oss-120b');
			expect(trimmed.length).toBe(1); 
			expect(trimmed[0].role).toBe('system');
		});

		it('should filter out event messages entirely', () => {
			const messages: Message[] = [
				{ role: 'event', content: 'some error' },
				{ role: 'user', content: 'hello' }
			];
			const trimmed = trimHistory(messages, 'gemini-flash');
			expect(trimmed.length).toBe(1);
			expect(trimmed[0].role).toBe('user');
		});
	});

	describe('deterministic prefix', () => {
		it('should generate identical prefixes given same inputs', () => {
			const agentsRaw = 'Agents doc';
			const currentRaw = 'Current doc';
			const visionRaw = 'Vision doc';
			const activeMemories = ['Memory 1', 'Memory 2'];

			const buildPrefix = (agents: string, current: string, vision: string, memories: string[]) => {
				return [
					`# AGENTS.md\n\n${agents}`,
					`# CURRENT.md\n\n${current}`,
					`# VISION.md\n\n${vision}`,
					memories.length > 0 ? `# Memories\n\n${memories.join('\n\n')}` : ''
				].filter(Boolean).join('\n\n---\n\n');
			};

			const run1 = buildPrefix(agentsRaw, currentRaw, visionRaw, activeMemories);
			const run2 = buildPrefix(agentsRaw, currentRaw, visionRaw, activeMemories);

			expect(run1).toEqual(run2);
		});
	});
});
