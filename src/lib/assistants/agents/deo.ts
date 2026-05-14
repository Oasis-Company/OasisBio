import { callLlm, buildSystemMessage, buildUserMessage } from '../llm-client';
import { DEO_DEFAULT_PROMPT } from '../types';
import type { LlmConfig, LlmMessage } from '../types';

export interface DeoConfig {
  systemPrompt?: string;
  apiEndpoint: string;
  apiKey: string;
  model: string;
}

export async function getDeoResponse(
  message: string,
  config: DeoConfig,
  conversationHistory?: LlmMessage[]
): Promise<string> {
  const systemPrompt = config.systemPrompt || DEO_DEFAULT_PROMPT;

  const messages: LlmMessage[] = [buildSystemMessage(systemPrompt)];

  if (conversationHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  messages.push(buildUserMessage(message));

  const llmConfig: LlmConfig = {
    apiEndpoint: config.apiEndpoint,
    apiKey: config.apiKey,
    model: config.model,
    maxTokens: 2048,
    temperature: 0.7,
  };

  const response = await callLlm(messages, llmConfig);
  return response.content;
}

export function getDeoAvatar(): string {
  return '/assets/deo/deo.png';
}

export function getDeoGreeting(): string {
  return '嗨！我是 Deo，绿色小恐龙，技术问题尽管问我！';
}
