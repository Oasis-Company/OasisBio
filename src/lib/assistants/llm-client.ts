import type { LlmConfig, LlmMessage, LlmResponse } from './types';

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

export class LlmClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'LlmClientError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJitter(): number {
  return Math.random() * 500;
}

function isRetryableStatus(statusCode: number): boolean {
  return statusCode === 429 || statusCode >= 500;
}

export async function callLlm(
  messages: LlmMessage[],
  config: LlmConfig
): Promise<LlmResponse> {
  const {
    apiEndpoint,
    apiKey,
    model = 'gpt-4o',
    maxTokens = 4096,
    temperature = 0.7,
  } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();

        if (!isRetryableStatus(response.status)) {
          throw new LlmClientError(
            `LLM API error: ${response.status} - ${errorBody}`,
            response.status,
            false
          );
        }

        throw new LlmClientError(
          `LLM API error: ${response.status} - ${errorBody}`,
          response.status,
          true
        );
      }

      const data = (await response.json()) as {
        choices: Array<{
          message: { content: string | null; role: string };
          finish_reason: string;
        }>;
        usage?: {
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
        };
        model?: string;
      };

      if (!data.choices || !data.choices[0]) {
        throw new LlmClientError('Invalid LLM response: no choices found');
      }

      const rawContent = data.choices[0].message?.content ?? '';
      let content = rawContent;

      content = content.replace(/^```[\w]*\n?/g, '').replace(/```$/g, '').trim();

      return {
        content,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens,
              completionTokens: data.usage.completion_tokens,
              totalTokens: data.usage.total_tokens,
            }
          : undefined,
        raw: data as Record<string, unknown>,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (error instanceof LlmClientError && !error.isRetryable) {
        throw error;
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY_BASE * Math.pow(2, attempt) + getJitter();
        await sleep(delay);
      }
    }
  }

  throw lastError || new LlmClientError('Max retries exceeded');
}

export function buildSystemMessage(content: string): LlmMessage {
  return { role: 'system', content };
}

export function buildUserMessage(content: string): LlmMessage {
  return { role: 'user', content };
}

export function buildAssistantMessage(content: string): LlmMessage {
  return { role: 'assistant', content };
}
