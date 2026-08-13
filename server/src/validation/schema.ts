import { z } from 'zod';
import { LEVELS } from '../types';

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export const EMAIL_ERROR = 'Please enter a valid email address.';

export const profileSchema = z.object({
  fullName: z.string().optional().default(''),
  username: z.string().optional().default(''),
  email: z.string().regex(EMAIL_REGEX, EMAIL_ERROR).or(z.literal('')).default(''),
  phone: z.string().optional().default(''),
  skills: z.string().optional().default(''),
  company: z.string().optional().default(''),
  jobRole: z.string().optional().default(''),
  experience: z.string().optional().default(''),
  education: z.string().optional().default(''),
  projects: z.string().optional().default(''),
  github: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  portfolio: z.string().optional().default(''),
  careerObjective: z.string().optional().default(''),
  additionalInfo: z.string().optional().default(''),
  template: z.string().optional().default('software-engineer'),
  level: z.enum(LEVELS).default('mid'),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().trim().regex(EMAIL_REGEX, EMAIL_ERROR).max(160),
  username: z
    .string()
    .trim()
    .min(2, 'Username must be at least 2 characters')
    .max(40)
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, EMAIL_ERROR),
  password: z.string().min(1, 'Password is required'),
});

export const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

export const otpPurposeSchema = z.enum(['registration', 'password_reset']);

export const verifyOtpSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, EMAIL_ERROR),
  otp: otpCodeSchema,
  purpose: otpPurposeSchema,
});

export const resendOtpSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, EMAIL_ERROR),
  purpose: otpPurposeSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, EMAIL_ERROR),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().regex(EMAIL_REGEX, EMAIL_ERROR),
  otp: otpCodeSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100)
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80).optional(),
  phone: z.string().trim().max(30).optional(),
  address: z.string().trim().max(300).optional(),
  avatar: z.string().trim().max(2_000_000).optional(),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(30).default('Home'),
  fullName: z.string().trim().min(2, 'Recipient name is required').max(80),
  phone: z.string().trim().min(7, 'Phone number is required').max(30),
  line1: z.string().trim().min(2, 'Street address is required').max(160),
  line2: z.string().trim().max(160).optional().default(''),
  city: z.string().trim().min(2, 'City is required').max(80),
  state: z.string().trim().min(2, 'State is required').max(80),
  postalCode: z.string().trim().min(2, 'Postal code is required').max(20),
  country: z.string().trim().min(2, 'Country is required').max(80),
  isDefault: z.boolean().optional().default(false),
});

export const generateAllSchema = z.object({
  profile: profileSchema,
});

export const generateTypeSchema = z.object({
  type: z.string(),
  profile: profileSchema,
});

export const refineSchema = z.object({
  type: z.string(),
  currentText: z.string().min(1, 'currentText is required'),
  variant: z.enum(['improve', 'rewrite']),
  profile: profileSchema,
});