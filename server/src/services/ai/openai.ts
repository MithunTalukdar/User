import OpenAI from 'openai';
import { config } from '../../config';
import type { ChatMessage } from '../../types';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI | null {
  if (config.mockAI || !config.openai.apiKey) return null;
  if (!client) {
    client = new OpenAI({
      apiKey: config.openai.apiKey,
      baseURL: config.openai.baseURL,
      timeout: 180_000,
    });
  }
  return client;
}

export function aiEnabled(): boolean {
  return !config.mockAI && Boolean(config.openai.apiKey);
}

export async function complete(
  system: string,
  user = '',
  options: { json?: boolean; maxTokens?: number } = {},
): Promise<string> {
  const ai = getOpenAI();
  if (!ai) throw new Error('AI provider is not configured');
  const res = await ai.chat.completions.create({
    model: config.openai.model,
    temperature: 0.7,
    max_tokens: options.maxTokens ?? 2000,
    response_format: options.json ? { type: 'json_object' } : undefined,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user || 'Write the output now.' },
    ],
  });
  const text = res.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from AI provider');
  return text;
}

export async function chat(messages: ChatMessage[], system: string): Promise<string> {
  const ai = getOpenAI();
  if (!ai) throw new Error('AI provider is not configured');
  const res = await ai.chat.completions.create({
    model: config.openai.model,
    temperature: 0.7,
    max_tokens: 900,
    messages: [{ role: 'system', content: system }, ...messages],
  });
  const text = res.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty response from AI provider');
  return text;
}
