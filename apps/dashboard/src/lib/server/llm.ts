import { getModelConfig, type ModelConfig } from '../config/models';

export type Message = {
	role: 'user' | 'assistant' | 'system' | 'event';
	content: string;
};

export type ModelProvider = 'google' | 'groq' | 'deepseek' | 'openrouter';

function getProviderUrl(provider: ModelProvider): string {
	switch (provider) {
		case 'google':
			return 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
		case 'groq':
			return 'https://api.groq.com/openai/v1/chat/completions';
		case 'deepseek':
			return 'https://api.deepseek.com/chat/completions';
		case 'openrouter':
			return 'https://openrouter.ai/api/v1/chat/completions';
	}
}

function getProviderFromModel(modelId: string): ModelProvider {
	const config = getModelConfig(modelId);
	if (config) return config.provider;

	if (modelId.startsWith('gemini')) return 'google';
	if (modelId.startsWith('deepseek')) return 'deepseek';
	return 'groq'; // Default to groq for llama/mixtral/gemma
}

function getProviderKey(provider: ModelProvider, env: Record<string, any>): string | undefined {
	switch (provider) {
		case 'google':
			return env.GOOGLE_AI_API_KEY || env.GOOGLE_API_KEY;
		case 'groq':
			return env.GROQ_API_KEY;
		case 'deepseek':
			return env.DEEPSEEK_API_KEY;
		case 'openrouter':
			return env.OPENROUTER_API_KEY;
	}
}

export function trimHistory(messages: Message[], modelId: string): Message[] {
	const config = getModelConfig(modelId);
	if (!config) return messages;

	const maxTokens = Math.min(config.contextWindow, config.requestCeilingTokens || Infinity) * 0.8; // Target ~80% of ceiling
	const CHARS_PER_TOKEN = 3.5;

	// Always keep system messages
	const systemMessages = messages.filter((m) => m.role === 'system');
	const otherMessages = messages.filter((m) => m.role !== 'system' && m.role !== 'event');

	const systemLength = systemMessages.reduce((sum, m) => sum + m.content.length, 0);
	const maxOtherTokens = maxTokens - (systemLength / CHARS_PER_TOKEN);

	if (maxOtherTokens <= 0) return systemMessages; // Edge case: system prompt too big

	let currentTokens = 0;
	const retainedOther = [];
	
	// Keep latest messages first
	for (let i = otherMessages.length - 1; i >= 0; i--) {
		const m = otherMessages[i];
		const tokens = m.content.length / CHARS_PER_TOKEN;
		if (currentTokens + tokens > maxOtherTokens) {
			break;
		}
		currentTokens += tokens;
		retainedOther.unshift(m);
	}

	return [...systemMessages, ...retainedOther];
}

export async function createChatStream(
	messages: Message[],
	modelId: string,
	env: Record<string, any>,
	onComplete: (content: string, usage: any, finalModel: string) => Promise<void>,
	onEvent: (message: string) => Promise<void>,
	failoverOrder: string[] = []
): Promise<{ stream: ReadableStream; finalModel: string }> {
	const currentModel = modelId;
	const config = getModelConfig(currentModel);
	const provider = config?.provider || getProviderFromModel(currentModel);
	const url = getProviderUrl(provider);
	const key = getProviderKey(provider, env);
	const apiModel = config?.apiModel || currentModel;

	// Trim history
	const trimmedMessages = trimHistory(messages, currentModel);

	const payloadMessages = trimmedMessages
		.filter((m) => m.role !== 'event')
		.map((m) => ({
			role: m.role,
			content: m.content
		}));

	if (!key) {
		if (failoverOrder.length > 0) {
			const nextModel = failoverOrder[0];
			await onEvent(`No API key for ${currentModel} → using ${nextModel}`);
			return createChatStream(messages, nextModel, env, onComplete, onEvent, failoverOrder.slice(1));
		}
		throw new Error(`No API key available for ${provider} (${currentModel})`);
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`
		},
		body: JSON.stringify({
			model: apiModel,
			messages: payloadMessages,
			stream: true,
			stream_options: { include_usage: true }
		})
	});

	if (!response.ok) {
		// Failover on ANY error: 401 (Invalid Key), 402/403 (No Credits), 429 (Rate Limit), 500+ (Downtime)
		if (failoverOrder.length > 0) {
			const nextModel = failoverOrder[0];
			await onEvent(`Error ${response.status} on ${currentModel} → using ${nextModel}`);
			return createChatStream(messages, nextModel, env, onComplete, onEvent, failoverOrder.slice(1));
		}
		throw new Error(`Provider error: ${response.status} ${response.statusText}`);
	}

	let fullText = '';
	let usage = { prompt_tokens: 0, completion_tokens: 0, prompt_tokens_details: { cached_tokens: 0 } };

	const decoder = new TextDecoder();
	let buffer = '';

	const transform = new TransformStream({
		async transform(chunk, controller) {
			// Pass through the chunk unmodified exactly once
			controller.enqueue(chunk);

			buffer += decoder.decode(chunk, { stream: true });
			const lines = buffer.split('\n');
			// Keep the last (potentially incomplete) line in the buffer
			buffer = lines.pop() || '';

			for (const line of lines) {
				const trimmed = line.trim();
				if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
					try {
						const data = JSON.parse(trimmed.slice(6));
						if (data.choices && data.choices[0]?.delta?.content) {
							fullText += data.choices[0].delta.content;
						}
						if (data.usage) {
							usage = data.usage;
						}
					} catch (e) {
						// ignore partial/invalid json
					}
				}
			}
		},
		async flush() {
			await onComplete(fullText, usage, currentModel);
		}
	});

	return {
		stream: response.body!.pipeThrough(transform),
		finalModel: currentModel
	};
}

export class FailoverError extends Error {
	constructor(
		public failedModel: string,
		public nextModel: string,
		public eventMessage: string,
		public remainingFailover: string[]
	) {
		super(eventMessage);
		this.name = 'FailoverError';
	}
}
