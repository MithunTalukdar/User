import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { config } from '../config';
import { getRepos } from '../db/repos';
import { asyncHandler } from '../utils/asyncHandler';
import { signToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyOtpSchema,
} from '../validation/schema';
import {
  isOtpExpired,
  issueOtp,
  remainingCooldownSeconds,
  verifyOtpHash,
} from '../services/otp.service';
import type { AuthRequest } from '../middleware/auth';
import type { UserRecord } from '../types';

const repos = () => getRepos();

function publicUser(user: UserRecord) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address: user.address,
    avatar: user.avatar,
    isVerified: user.isVerified,
  };
}

function cooldownError(seconds: number): ApiError {
  return new ApiError(429, `Please wait ${seconds}s before requesting another code.`, {
    retryAfter: seconds,
  });
}

async function assertOtpValid(user: UserRecord, purpose: 'registration' | 'password_reset', otp: string) {
  if (!user.otpHash || user.otpPurpose !== purpose) {
    throw new ApiError(400, 'No verification code was issued for this request.');
  }
  if (isOtpExpired(user.otpExpiresAt)) {
    throw new ApiError(400, 'This code has expired. Please request a new one.');
  }
  if (!(await verifyOtpHash(user.otpHash, otp))) {
    throw new ApiError(400, 'Incorrect verification code. Please try again.');
  }
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  console.log(`[auth] register attempt email=${data.email} fullName=${data.fullName}`);
  const existing = await repos().user.findByEmail(data.email);
  if (existing) {
    console.log(`[auth] register rejected (duplicate email) email=${data.email}`);
    throw new ApiError(409, 'An account with this email already exists. Please log in instead.');
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  try {
    const user = await repos().user.create({
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      passwordHash,
      isVerified: true,
    });
    console.log(`[auth] register success id=${user.id} email=${user.email}`);
    res.status(201).json({
      message: 'Registration successful. You can now log in.',
      user: publicUser(user),
    });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      throw new ApiError(409, 'An account with this email already exists. Please log in instead.');
    }
    throw err;
  }
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = verifyOtpSchema.parse(req.body);
  const user = await repos().user.findByEmail(data.email);
  if (!user) throw new ApiError(404, 'No account found for this email.');

  if (data.purpose === 'registration') {
    if (user.isVerified) {
      res.json({
        ok: true,
        message: 'Email already verified. You can now log in to continue.',
      });
      return;
    }
    await assertOtpValid(user, 'registration', data.otp);
    await repos().user.update(user.id, {
      isVerified: true,
      otpHash: null,
      otpPurpose: null,
      otpExpiresAt: null,
      otpCooldownUntil: null,
    });
    res.json({
      ok: true,
      message: 'Registration completed successfully. Please log in to continue.',
    });
    return;
  }

  await assertOtpValid(user, 'password_reset', data.otp);
  res.json({ ok: true, message: 'Code verified. You can now create a new password.' });
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = resendOtpSchema.parse(req.body);
  const user = await repos().user.findByEmail(data.email);
  if (!user) throw new ApiError(404, 'No account found for this email.');

  const wait = remainingCooldownSeconds(user.otpCooldownUntil);
  if (wait > 0) throw cooldownError(wait);

  const { devOtp } = await issueOtp({ user, purpose: data.purpose });
  res.json({
    message:
      data.purpose === 'password_reset'
        ? 'A new password reset code has been sent to your email.'
        : 'A new verification code has been sent to your email.',
    resendAfter: config.otp.resendSeconds,
    ...(devOtp ? { debugOtp: devOtp } : {}),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  console.log(`[auth] login attempt email=${data.email}`);
  const user = await repos().user.findByEmail(data.email);
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    console.log(`[auth] login rejected (bad credentials) email=${data.email}`);
    throw new ApiError(401, 'Invalid email or password.');
  }
  if (!user.isVerified) {
    console.log(`[auth] login rejected (unverified) email=${data.email}`);
    throw new ApiError(403, 'Please verify your email before logging in.', {
      code: 'EMAIL_NOT_VERIFIED',
      email: user.email,
    });
  }
  const token = signToken({ userId: user.id });
  console.log(`[auth] login success id=${user.id} email=${user.email}`);
  res.json({ token, user: publicUser(user) });
});

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.userId ? await repos().user.findById(req.userId) : null;
  if (!user) throw new ApiError(404, 'User not found');
  console.log(`[auth] me ok id=${user.id} email=${user.email}`);
  res.json({ user: publicUser(user) });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = updateProfileSchema.parse(req.body);
  const user = req.userId ? await repos().user.findById(req.userId) : null;
  if (!user) throw new ApiError(404, 'User not found');
  const updated = await repos().user.update(user.id, data);
  if (!updated) throw new ApiError(404, 'User not found');
  res.json({ message: 'Profile updated successfully.', user: publicUser(updated) });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = changePasswordSchema.parse(req.body);
  const user = req.userId ? await repos().user.findById(req.userId) : null;
  if (!user) throw new ApiError(404, 'User not found');
  if (!(await bcrypt.compare(data.currentPassword, user.passwordHash))) {
    throw new ApiError(400, 'Current password is incorrect.');
  }
  if (data.currentPassword === data.newPassword) {
    throw new ApiError(400, 'New password must be different from the current password.');
  }
  const passwordHash = await bcrypt.hash(data.newPassword, 10);
  await repos().user.update(user.id, { passwordHash });
  res.json({ message: 'Password changed successfully.' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const data = forgotPasswordSchema.parse(req.body);
  const user = await repos().user.findByEmail(data.email);
  if (!user) {
    res.json({
      message: 'If an account exists for this email, a password reset code has been sent.',
      resendAfter: config.otp.resendSeconds,
    });
    return;
  }
  const wait = remainingCooldownSeconds(user.otpCooldownUntil);
  if (wait > 0) throw cooldownError(wait);

  const { devOtp } = await issueOtp({ user, purpose: 'password_reset' });
  res.json({
    message: 'A password reset code has been sent to your email.',
    resendAfter: config.otp.resendSeconds,
    ...(devOtp ? { debugOtp: devOtp } : {}),
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const data = resetPasswordSchema.parse(req.body);
  const user = await repos().user.findByEmail(data.email);
  if (!user) throw new ApiError(400, 'Invalid or expired reset request.');

  await assertOtpValid(user, 'password_reset', data.otp);

  const passwordHash = await bcrypt.hash(data.password, 10);
  await repos().user.update(user.id, {
    passwordHash,
    otpHash: null,
    otpPurpose: null,
    otpExpiresAt: null,
    otpCooldownUntil: null,
  });
  res.json({ ok: true, message: 'Password reset successfully. Please log in with your new password.' });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ ok: true, message: 'Logged out successfully.' });
});
