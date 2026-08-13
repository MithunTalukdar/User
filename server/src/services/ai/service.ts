import { config } from '../../config';
import type { OutputType, ProfileInput, Level, ChatMessage } from '../../types';
import { OUTPUT_TYPES } from '../../types';
import {
  buildGenerationPrompt,
  buildAllPrompt,
  buildRefinePrompt,
  CHAT_SYSTEM_PROMPT,
} from './prompts';
import { mockVariants, mockChatReply } from './mock';
import { complete, chat as openaiChat, aiEnabled } from './openai';

function isOutputType(value: string): value is OutputType {
  return (OUTPUT_TYPES as readonly string[]).includes(value);
}

function safeExtractJson(raw: string): Record<string, unknown> {
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start > -1 && end > start) {
    const block = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(block);
    } catch {
      /* fall through */
    }
  }
  return {};
}

export async function generateOne(
  type: OutputType,
  profile: ProfileInput,
  level: Level = 'mid',
): Promise<string> {
  if (!aiEnabled()) return mockVariants(profile)[type] || '';
  return complete(buildGenerationPrompt(type, profile, level));
}

export async function generateAll(
  profile: ProfileInput,
  level: Level = 'mid',
): Promise<Record<string, string>> {
  if (!aiEnabled()) return mockVariants(profile) as Record<string, string>;

  const { system, user } = buildAllPrompt(profile, level);
  let raw: string;
  try {
    raw = await complete(system, user, { json: true, maxTokens: 3000 });
  } catch (e) {
    const msg = (e as Error).message || '';
    // Fall back to per-item generation if JSON mode is unsupported.
    if (!/json|response_format|400|bad request/i.test(msg)) throw e;
    const outputs: Record<string, string> = {};
    await Promise.all(
      OUTPUT_TYPES.map(async (t) => {
        outputs[t] = await generateOne(t, profile, level);
      }),
    );
    return outputs;
  }

  const parsed = safeExtractJson(raw);
  const outputs: Record<string, string> = {};
  let missing = false;
  for (const key of OUTPUT_TYPES) {
    const v = parsed[key];
    if (typeof v === 'string' && v.trim()) {
      outputs[key] = v.trim();
    } else {
      missing = true;
    }
  }
  if (missing) {
    await Promise.all(
      OUTPUT_TYPES.map(async (t) => {
        if (!outputs[t]) outputs[t] = await generateOne(t, profile, level);
      }),
    );
  }
  return outputs;
}

export async function refine(
  type: string,
  currentText: string,
  variant: 'improve' | 'rewrite',
  profile: ProfileInput,
): Promise<string> {
  if (!isOutputType(type)) throw new Error(`Unknown output type "${type}"`);
  if (!aiEnabled()) return mockVariants(profile)[type] || '';
  return complete(buildRefinePrompt(type, currentText, variant, profile));
}

export async function generateType(
  type: string,
  profile: ProfileInput,
  level: Level,
): Promise<string> {
  if (!isOutputType(type)) throw new Error(`Unknown output type "${type}"`);
  return generateOne(type, profile, level);
}

export async function askAssistant(
  messages: ChatMessage[],
  profile?: ProfileInput,
): Promise<string> {
  if (!aiEnabled()) return mockChatReply(messages[messages.length - 1]?.content || '');

  const system = profile
    ? [
        CHAT_SYSTEM_PROMPT,
        'The user has shared this profile — tailor your advice to it where relevant:',
        profile.username || profile.fullName
          ? `Candidate: ${profile.fullName || profile.username}`
          : '',
        `Role: ${profile.jobRole || ''} at ${profile.company || ''}`,
        `Skills: ${profile.skills || ''}`,
        `Experience: ${profile.experience || ''}`,
      ]
        .filter(Boolean)
        .join('\n')
    : CHAT_SYSTEM_PROMPT;

  return openaiChat(messages, system);
}