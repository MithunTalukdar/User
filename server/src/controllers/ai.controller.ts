import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { profileSchema } from '../validation/schema';
import { generateAll, generateType, refine, askAssistant } from '../services/ai/service';
import type { ChatMessage, ProfileInput } from '../types';

export const generateAllHandler = asyncHandler(async (req: Request, res: Response) => {
  const profile = profileSchema.parse(req.body.profile || req.body || {});
  const level = profile.level;
  const outputs = await generateAll(profile, level);
  res.json({ outputs });
});

export const generateTypeHandler = asyncHandler(async (req: Request, res: Response) => {
  const type = (req.body.type || '') as string;
  const profile = profileSchema.parse(req.body.profile || {});
  const text = await generateType(type, profile, profile.level);
  if ((type as string) === '') throw new ApiError(400, 'type is required');
  res.json({ text });
});

export const refineHandler = asyncHandler(async (req: Request, res: Response) => {
  const { type, currentText, variant } = req.body || {};
  const profile = profileSchema.parse(req.body.profile || {});
  if (!type) throw new ApiError(400, 'type is required');
  if (!currentText) throw new ApiError(400, 'currentText is required');
  if (!['improve', 'rewrite'].includes(variant)) {
    throw new ApiError(400, 'variant must be "improve" or "rewrite"');
  }
  const text = await refine(type, currentText, variant, profile);
  res.json({ text });
});

export const chatHandler = asyncHandler(async (req: Request, res: Response) => {
  const messages: ChatMessage[] = Array.isArray(req.body.messages) ? req.body.messages : [];
  const profile = req.body.profile ? profileSchema.parse(req.body.profile) : undefined;
  const last = messages[messages.length - 1]?.content?.trim();
  if (!last) throw new ApiError(400, 'A message is required');
  const reply = await askAssistant(messages, profile as ProfileInput | undefined);
  res.json({ reply });
});