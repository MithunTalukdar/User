import type { OutputType, ProfileInput, Level } from '../../types';
import { OUTPUT_LABELS, OUTPUT_TYPES } from '../../types';

export function describeProfile(p: ProfileInput): string {
  const parts: string[] = [];
  const push = (label: string, value?: string) => {
    if (value && value.trim()) parts.push(`${label}: ${value.trim()}`);
  };
  push('Full Name', p.fullName);
  push('Username', p.username);
  push('Email', p.email);
  push('Phone', p.phone);
  push('Skills', p.skills);
  push('Company', p.company);
  push('Job Role', p.jobRole);
  push('Experience', p.experience);
  push('Education', p.education);
  push('Projects', p.projects);
  push('GitHub', p.github);
  push('LinkedIn', p.linkedin);
  push('Portfolio', p.portfolio);
  push('Career Objective', p.careerObjective);
  push('Additional Information', p.additionalInfo);
  return parts.length ? parts.join('\n') : '[No profile details provided]';
}

export const LEVEL_GUIDANCE: Record<Level, string> = {
  beginner:
    'Frame this person at BEGINNER level: highlight learning agility, foundational skills, eagerness, projects, and potential. Tone: promising, coachable, growth-minded.',
  mid: 'Frame this person at MID level: emphasize proven hands-on delivery, independence, and real-world impact. Tone: solid, dependable, professional.',
  senior:
    'Frame this person at SENIOR level: emphasize leadership, strategic impact, mentoring, architecture, and business results. Tone: authoritative and experienced.',
};

export const OUTPUT_DEFINITIONS: Record<OutputType, string> = {
  professionalHrSummary:
    'A polished 4-6 sentence summary an HR professional would write about this candidate: background, core skills, value, and fit.',
  resumeSummary:
    'An ATS-friendly resume summary: concise, keyword-rich, scannable, 3-4 lines, ideal for the top of a resume.',
  aboutMe:
    'A warm, first-person "About Me" paragraph (uses "I") that feels genuine, human, and professional.',
  professionalBio:
    'A professional bio in two parts: a 2-line short bio and a fuller paragraph (3-4 sentences).',
  selfIntroduction:
    'A brief, confident first-person self introduction used on calls and meetings (3-5 sentences).',
  interviewIntroduction:
    'A confident self-introduction a candidate would say at the start of an interview, including background and what they bring.',
  linkedinSummary:
    'A LinkedIn headline line plus a first-person summary that is engaging, personal, and professional.',
  atsResumeParagraph:
    'An ATS-optimized resume paragraph: keyword-dense, clean plain text, no tables or symbols, easy for parsers to read.',
  coverLetter:
    'A complete professional cover letter: greeting, compelling body, closing, signature, using the real profile details.',
  emailIntroduction:
    'A short, polite email a candidate sends to a recruiter or hiring manager to introduce themselves.',
  skillDescription:
    'A natural paragraph that showcases the candidate\'s skills with context, depth, and measurable impact.',
  careerObjective:
    'A focused career objective statement for a resume top section (2-3 sentences).',
};

export const QUALITY_RULES = [
  'Write in strictly professional, warm, persuasive, human English.',
  'Never use clichés or filler words such as "testament", "delve", "spearheaded", "synergy", "dynamic", "passionate".',
  'Fix poor grammar, correct spelling, and elevate vocabulary naturally. Never invent fake facts, names, or metrics.',
  'Use the real profile details below. Keep links, companies, and institutions exactly as provided.',
  'Return ONLY the finished text with no prefixes, markdown headers, or explanations.',
].join('\n');

export function buildGenerationPrompt(type: OutputType, profile: ProfileInput, level: Level): string {
  return [
    `Requested output — ${OUTPUT_LABELS[type]}:`,
    OUTPUT_DEFINITIONS[type],
    '',
    'Constraints and quality rules:',
    QUALITY_RULES,
    '',
    'Candidate level to reflect:',
    LEVEL_GUIDANCE[level],
    '',
    'Candidate profile:',
    describeProfile(profile),
  ].join('\n');
}

export function buildAllPrompt(profile: ProfileInput, level: Level): { system: string; user: string } {
  const specs = OUTPUT_TYPES.map((t) => `"${t}": "${OUTPUT_LABELS[t]}"`).join(',\n');
  const system = [
    'You are a senior HR consultant and professional copywriter generating recruiter-ready content for a candidate.',
    'Return a SINGLE valid JSON object and nothing else. No markdown fences, no commentary.',
    `The JSON object must contain exactly these keys:\n{\n${specs}\n}`,
    'Each value must be the finished text for that section.',
  ].join('\n');
  const user = [
    'Candidate level to reflect:',
    LEVEL_GUIDANCE[level],
    '',
    'Candidate profile:',
    describeProfile(profile),
    '',
    'Quality rules:',
    QUALITY_RULES,
  ].join('\n');
  return { system, user };
}

export function buildRefinePrompt(
  type: OutputType,
  currentText: string,
  variant: 'improve' | 'rewrite',
  profile: ProfileInput,
): string {
  const instructions: Record<'improve' | 'rewrite', string> = {
    improve:
      'Improve clarity, flow, grammar, and impact while preserving the meaning, facts, names, and links of the original.',
    rewrite:
      'Completely rewrite the text in fresh, natural, professional language. Keep every fact, name, company, and link exactly as given.',
  };
  return [
    `You are a professional HR copywriter refining the "${OUTPUT_LABELS[type]}".`,
    `Action: ${instructions[variant]}`,
    'Quality rules:',
    QUALITY_RULES,
    '',
    'Relevant candidate profile:',
    describeProfile(profile),
    '',
    'Current text:',
    currentText,
    '',
    'Return ONLY the refined text. No prefixes, no explanations.',
  ].join('\n');
}

export const CHAT_SYSTEM_PROMPT = [
  'You are a friendly, professional AI Career Assistant for a resume & HR profile builder.',
  'You help users with resumes, HR, interviews, career growth, and professional profiles.',
  'Give concise, practical, well-structured advice. Use short paragraphs and bullet points when helpful.',
  'If the user shares profile details, tailor your advice to them. Never invent facts about the user.',
  'Stay positive, professional, and encouraging.',
].join('\n');

export { OUTPUT_TYPES, OUTPUT_LABELS };
