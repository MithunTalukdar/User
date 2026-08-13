import { Request, Response } from 'express';
import { getRepos } from '../db/repos';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { profileSchema } from '../validation/schema';
import type { AuthRequest } from '../middleware/auth';

const repos = () => getRepos();

export const saveProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = profileSchema.parse(req.body.profile || {});
  const variants = req.body.variants || {};
  const { id } = await repos().profile.create({
    ...parsed,
    userId: req.userId || null,
    variants,
  });
  res.status(201).json({ id });
});

export const listProfiles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const all = await repos().profile.list();
  const profiles = req.userId ? all.filter((p) => p.userId === req.userId) : all;
  res.json({ profiles });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const doc = await repos().profile.findById(req.params.id);
  if (!doc) throw new ApiError(404, 'Profile not found');
  res.json({ profile: doc });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await repos().profile.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Profile not found');
  if (existing.userId && existing.userId !== req.userId) {
    throw new ApiError(403, 'Forbidden');
  }
  const patch: Record<string, unknown> = { ...(req.body.profile ? profileSchema.parse(req.body.profile) : {}) };
  if (req.body.variants) patch.variants = req.body.variants;
  if (typeof req.body.pinned === 'boolean') patch.pinned = req.body.pinned;
  const updated = await repos().profile.update(req.params.id, patch);
  res.json({ profile: updated });
});

export const deleteProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await repos().profile.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Profile not found');
  if (existing.userId && existing.userId !== req.userId) {
    throw new ApiError(403, 'Forbidden');
  }
  await repos().profile.remove(req.params.id);
  res.json({ ok: true });
});

export const togglePin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const existing = await repos().profile.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Profile not found');
  if (existing.userId && existing.userId !== req.userId) {
    throw new ApiError(403, 'Forbidden');
  }
  const pinned = await repos().profile.togglePin(req.params.id);
  res.json({ pinned });
});