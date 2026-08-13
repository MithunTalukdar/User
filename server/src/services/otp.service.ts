import bcrypt from 'bcryptjs';
import { config } from '../config';
import { getRepos } from '../db/repos';
import { otpEmailHtml, sendMail } from './email.service';
import type { UserRecord } from '../types';

export interface OtpResult {
  devOtp?: string;
  expiresAt: Date;
  cooldownUntil: Date;
}

export function generateOtp(length = config.otp.codeLength): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i += 1) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 8);
}

export async function verifyOtpHash(hash: string | null | undefined, otp: string): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(otp, hash);
}

export function isOtpExpired(expiresAt: Date | null | undefined): boolean {
  if (!expiresAt) return true;
  return expiresAt.getTime() < Date.now();
}

export function remainingCooldownSeconds(cooldownUntil: Date | null | undefined): number {
  if (!cooldownUntil) return 0;
  const remaining = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
  return Math.max(0, remaining);
}

export function getExpiry(): Date {
  return new Date(Date.now() + config.otp.expiresMinutes * 60 * 1000);
}

export function getCooldownUntil(): Date {
  return new Date(Date.now() + config.otp.resendSeconds * 1000);
}

export interface IssueOtpOptions {
  user: UserRecord;
  purpose: 'registration' | 'password_reset';
  email?: string;
}

export async function issueOtp({
  user,
  purpose,
  email,
}: IssueOtpOptions): Promise<OtpResult> {
  const otp = generateOtp();
  const otpHash = await hashOtp(otp);
  const expiresAt = getExpiry();
  const cooldownUntil = getCooldownUntil();

  await getRepos().user.update(user.id, {
    otpHash,
    otpPurpose: purpose,
    otpExpiresAt: expiresAt,
    otpCooldownUntil: cooldownUntil,
  });

  const html = otpEmailHtml({ otp, purpose, minutes: config.otp.expiresMinutes });
  const result = await sendMail(
    {
      to: email ?? user.email,
      subject:
        purpose === 'password_reset'
          ? 'Your password reset code'
          : 'Verify your email — AI Resume Builder',
      html,
    },
    otp,
  );

  return { devOtp: result.devOtp, expiresAt, cooldownUntil };
}
