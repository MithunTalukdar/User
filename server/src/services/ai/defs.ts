import { OUTPUT_LABELS, OUTPUT_TYPES, LEVELS } from '../../types';
import type { ProfileInput, OutputType, Level, ChatMessage, GenerationResult } from '../../types';

export { OUTPUT_LABELS, OUTPUT_TYPES, LEVELS };
export type { ProfileInput, OutputType, Level, ChatMessage, GenerationResult };

export interface GenerateAllResponse {
  outputs: Record<string, string>;
}
