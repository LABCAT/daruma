export interface ModelConfig {
	id: string;
	provider: 'google' | 'deepseek' | 'groq' | 'openrouter';
	apiModel: string;
	contextWindow: number;
	requestCeilingTokens?: number;
	inputPerMTok: number;
	outputPerMTok: number;
	defaultEnabled: boolean;
}

export const MODELS_CONFIG: ModelConfig[] = [
	{
		id: 'gemini-flash',
		provider: 'google',
		apiModel: 'gemini-3.5-flash-lite',
		contextWindow: 1000000,
		inputPerMTok: 0,
		outputPerMTok: 0,
		defaultEnabled: true
	},
	{
		id: 'deepseek-v4-flash',
		provider: 'deepseek',
		apiModel: 'deepseek-chat',
		contextWindow: 1000000,
		inputPerMTok: 0.14,
		outputPerMTok: 0.28,
		defaultEnabled: true
	},
	{
		id: 'groq-llama-3.3-70b',
		provider: 'groq',
		apiModel: 'llama-3.3-70b-versatile',
		contextWindow: 128000,
		requestCeilingTokens: 12000,
		inputPerMTok: 0,
		outputPerMTok: 0,
		defaultEnabled: true
	},
	{
		id: 'groq-gpt-oss-120b',
		provider: 'groq',
		apiModel: 'openai/gpt-oss-120b',
		contextWindow: 128000,
		requestCeilingTokens: 8000,
		inputPerMTok: 0,
		outputPerMTok: 0,
		defaultEnabled: true
	},
	{
		id: 'openrouter-free',
		provider: 'openrouter',
		apiModel: 'openrouter/free',
		contextWindow: 128000,
		requestCeilingTokens: 8000,
		inputPerMTok: 0,
		outputPerMTok: 0,
		defaultEnabled: true
	}
];

export function getModelConfig(id: string): ModelConfig | undefined {
	return MODELS_CONFIG.find((m) => m.id === id);
}
