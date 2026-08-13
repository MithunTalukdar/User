export interface ProfileInput {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  skills: string;
  company: string;
  jobRole: string;
  experience: string;
  education: string;
  projects: string;
  github: string;
  linkedin: string;
  portfolio: string;
  careerObjective: string;
  additionalInfo: string;
  template?: string;
  level?: Level;
}

export const OUTPUT_TYPES = [
  'professionalHrSummary',
  'resumeSummary',
  'aboutMe',
  'professionalBio',
  'selfIntroduction',
  'interviewIntroduction',
  'linkedinSummary',
  'atsResumeParagraph',
  'coverLetter',
  'emailIntroduction',
  'skillDescription',
  'careerObjective',
] as const;

export type OutputType = (typeof OUTPUT_TYPES)[number];

export const OUTPUT_LABELS: Record<OutputType, string> = {
  professionalHrSummary: 'Professional HR Summary',
  resumeSummary: 'Resume Summary',
  aboutMe: 'About Me',
  professionalBio: 'Professional Bio',
  selfIntroduction: 'Self Introduction',
  interviewIntroduction: 'Interview Introduction',
  linkedinSummary: 'LinkedIn Summary',
  atsResumeParagraph: 'ATS-Optimized Resume Paragraph',
  coverLetter: 'Cover Letter',
  emailIntroduction: 'Email Introduction',
  skillDescription: 'Skill Description',
  careerObjective: 'Career Objective',
};

export const LEVELS = ['beginner', 'mid', 'senior'] as const;
export type Level = (typeof LEVELS)[number];

export type GenerationResult = Record<string, string>;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  phone: string;
  address: string;
  avatar: string;
  isVerified: boolean;
  passwordHash: string;
  otpHash?: string | null;
  otpPurpose?: 'registration' | 'password_reset' | null;
  otpExpiresAt?: Date | null;
  otpCooldownUntil?: Date | null;
  createdAt: Date;
}

export interface AddressRecord {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface NewAddress {
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
