import { Response } from 'express';
import { getRepos } from '../db/repos';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { addressSchema } from '../validation/schema';
import type { AuthRequest } from '../middleware/auth';

const repos = () => getRepos();

export const listAddresses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const addresses = await repos().address.listByUser(userId);
  res.json({ addresses });
});

export const createAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const data = addressSchema.parse(req.body);
  const address = await repos().address.create(userId, data);
  res.status(201).json({ message: 'Address saved successfully.', address });
});

export const updateAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const existing = await repos().address.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Address not found');
  if (existing.userId !== userId) throw new ApiError(403, 'Forbidden');
  const data = addressSchema.partial().parse(req.body);
  const updated = await repos().address.update(req.params.id, data);
  res.json({ message: 'Address updated successfully.', address: updated });
});

export const deleteAddress = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const existing = await repos().address.findById(req.params.id);
  if (!existing) throw new ApiError(404, 'Address not found');
  if (existing.userId !== userId) throw new ApiError(403, 'Forbidden');
  await repos().address.remove(req.params.id);
  res.json({ ok: true, message: 'Address deleted successfully.' });
});
