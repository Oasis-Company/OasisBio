import { callLlm, buildSystemMessage, buildUserMessage } from '../llm-client';
import { DIA_DEFAULT_PROMPT } from '../types';
import type { LlmConfig, LlmMessage } from '../types';

export interface DiaConfig {
  systemPrompt?: string;
  apiEndpoint: string;
  apiKey: string;
  model: string;
}

export async function getDiaResponse(
  message: string,
  config: DiaConfig,
  conversationHistory?: LlmMessage[]
): Promise<string> {
  const systemPrompt = config.systemPrompt || DIA_DEFAULT_PROMPT;

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
    temperature: 0.8,
  };

  const response = await callLlm(messages, llmConfig);
  return response.content;
}

export function getDiaAvatar(): string {
  return '/assets/deo/dia.png';
}

export function getDiaGreeting(): string {
  return '嗨！我是 Dia，粉色小恐龙，很高兴见到你！有什么创意想法想聊聊吗？';
}
