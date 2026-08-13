import type { OutputType, ProfileInput, Level } from '../../types';
import { OUTPUT_TYPES } from '../../types';

function cap(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 3) + '...' : s;
}

function pick<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function nameOf(p: ProfileInput): string {
  return p.fullName?.trim() || p.username?.trim() || 'the candidate';
}

function firstName(p: ProfileInput): string {
  const full = nameOf(p);
  return full.split(' ')[0];
}

const IMPACT = [
  'turning complex challenges into measurable business outcomes',
  'shipping reliable solutions that teams can build on',
  'balancing pragmatic delivery with a strong eye for detail',
  'connecting technical rigor with clear business priorities',
  'driving steady, dependable progress in fast-moving environments',
];

const OPENS = [
  'An accomplished professional',
  'A results-oriented professional',
  'A dependable technical professional',
];

const TRAITS = [
  'collaboration',
  'reliability',
  'clear communication',
  'continuous improvement',
];

export function mockVariants(p: ProfileInput): Record<OutputType, string> {
  const name = nameOf(p);
  const first = firstName(p);
  const role = p.jobRole?.trim() || 'professional';
  const company = p.company?.trim() || 'their current company';
  const impact = pick(IMPACT);
  const open = pick(OPENS);
  const trait = pick(TRAITS);
  const exp = p.experience?.trim() || 'several years of';
  const skills = cap(p.skills?.trim() || 'modern tools and technologies', 160);
  const keySkills = cap(
    (p.skills?.trim() || '').split(/[,;]/)[0]?.trim() || 'modern technologies',
    70,
  );
  const education = cap(p.education?.trim() || 'a strong academic foundation', 120);
  const projects = p.projects?.trim() || 'practical, hands-on projects';
  const objective = p.careerObjective?.trim() || 'driving meaningful, reliable results';

  const core: Record<OutputType, string> = {
    professionalHrSummary: `${open} currently at ${company}, ${name} combines hands-on expertise in ${skills} with a record of using ${exp} of experience to ${impact}. Known for ${trait} and dependable execution, ${name} adds measurable value from day one — whether strengthening an existing team or helping a new initiative gain traction. This blend of skill and character makes ${name} a strong, low-risk hire for growth-focused teams.`,
    resumeSummary: `${traitFor(name)} with ${exp} of experience specializing in ${keySkills}. Proven ability to ${impact}. Adept at ${trait} within fast-moving, cross-functional teams. Seeking to bring measurable value to a growing organization.`,
    aboutMe: `I'm ${first}, a ${role} who cares about doing work that actually lands. Right now I apply ${skills} at ${company}, where I've learned to ${impact}. I'm practical, I communicate clearly, and I enjoy helping the people around me do their best work. My focus is simple: ship things that work, keep improving, and stay genuinely curious along the way.`,
    professionalBio: `Short: ${name} is a ${role} at ${company} specializing in ${keySkills}.\n\nFull: ${name} brings ${exp} of experience across ${skills}. Currently at ${company}, ${name} has built a reputation for ${trait} and dependable delivery, consistently turning goals into outcomes while supporting teammates and raising the bar for quality.`,
    selfIntroduction: `Hi, I'm ${first}. I work as a ${role} at ${company}, where I focus on ${keySkills} and ${trait}. I enjoy clean collaboration and outcomes that make a real difference, and I'm always looking for ways to do work that matters.`,
    interviewIntroduction: `Thank you for having me today. I'm ${name}, a ${role} currently with ${company}. My background covers ${skills}, and what I enjoy most is ${impact}. I'm excited to share how that experience could be valuable for your team.`,
    linkedinSummary: `${name} | ${capitalize(role)} at ${company}\n\nI help teams move faster by focusing on ${keySkills} and honest communication. ${capitalize(trait)} is how I work best — and it shows in the outcomes I deliver. Open to meaningful opportunities and good conversations.`,
    atsResumeParagraph: `${capitalize(role)} with ${exp} of experience specializing in ${keySkills}. Strong track record of ${impact} through ${trait}. Experienced across ${skills}. Proven ability to work effectively within cross-functional teams and deliver high-quality results on schedule.`,
    coverLetter: `Dear Hiring Manager,\n\nI'm writing to express my interest in joining your team as a ${role}. With ${exp} of experience and hands-on expertise in ${skills}, I've spent my time at ${company} learning to ${impact} in real-world settings.\n\nI value ${trait} and clear communication, and I enjoy work that produces results people can rely on. I'd welcome the chance to bring these strengths to your organization.\n\nThank you for your consideration. I'd be glad to connect for an introduction.\n\nBest regards,\n${name}`,
    emailIntroduction: `Hi there,\n\nI'm ${name}, a ${role} currently with ${company}. I focus on ${keySkills} and would love to explore how my background could be valuable for your team. Would you be open to a quick conversation?\n\nThank you,\n${name}`,
    skillDescription: `${name} brings practical, hands-on skill in ${skills}, applied consistently at ${company}. Beyond the tools themselves, ${name} is known for ${trait} and for ${impact}. This combination of technical depth and dependable delivery makes ${name} effective in both focused execution and collaborative team settings.`,
    careerObjective: `To apply ${exp} of experience and deep expertise in ${keySkills} toward ${objective}, while growing as a ${role} within a team that values ${trait}.`,
  };

  const result = {} as Record<OutputType, string>;
  for (const key of OUTPUT_TYPES) {
    result[key] = core[key] || core.professionalHrSummary;
  }
  return result;
}

export function mockChatReply(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (msg.includes('interview') || msg.includes('question')) {
    return `Great question. For interviews, structure your answers with the STAR method (Situation, Task, Action, Result). Keep each story under 2 minutes, lead with the outcome, and practice your introduction — it sets the tone for everything that follows.`;
  }
  if (msg.includes('ats') || msg.includes('resume') || msg.includes('cv')) {
    return `For ATS-friendly resumes: use standard section headings (Experience, Education, Skills), mirror the exact keywords from the job description, avoid tables/images/columns, use a clean font, and save as .docx or PDF. Plain text parses best.`;
  }
  if (msg.includes('linkedin')) {
    return `A strong LinkedIn summary: 3-5 short paragraphs, lead with your value proposition, include keywords recruiters search for, add a call-to-action, and back claims with measurable outcomes.`;
  }
  if (msg.includes('cover letter') || msg.includes('cover')) {
    return `Keep your cover letter to 3 short paragraphs: a strong opener naming the role, 1-2 paragraphs on relevant achievements with numbers, and a confident closing. Address it to a real person whenever possible.`;
  }
  if (msg.includes('career')) {
    return `Think of your career as a portfolio, not a ladder. Focus on skills that transfer across roles, seek projects that grow your visibility, and review your direction every 6 months. Small, consistent steps compound faster than big leaps.`;
  }
  if (msg.includes('salar')) {
    return `Research the market range before negotiating, aim slightly above midpoint, and always respond with a range rather than a single number. Practice saying "I need time to consider the full offer" before accepting.`;
  }
  return `That's a great topic. For practical advice, share a little more detail about your role, experience level, or the specific goal you're working toward, and I'll tailor my guidance to your situation.`;
}

const shortAction = () => pick(IMPACT).split(' ').slice(0, 7).join(' ').replace(/\.$/, '');
const traitFor = (n: string) => capitalize(pick(TRAITS));

export function mockProfileLevel(level: Level): string {
  return `Candidate positioned at ${level} level.`;
}

export { LEVEL_GUIDANCE } from './prompts';
