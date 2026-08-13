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
]

export const OUTPUT_LABELS = {
  professionalHrSummary: 'Professional HR Summary',
  resumeSummary: 'Resume Summary',
  aboutMe: 'About Me',
  professionalBio: 'Professional Bio',
  selfIntroduction: 'Self Introduction',
  interviewIntroduction: 'Interview Introduction',
  linkedinSummary: 'LinkedIn Summary',
  atsResumeParagraph: 'ATS Resume Paragraph',
  coverLetter: 'Cover Letter',
  emailIntroduction: 'Email Introduction',
  skillDescription: 'Skill Description',
  careerObjective: 'Career Objective',
}

export const FIELDS = [
  { key: 'fullName', label: 'Full Name', icon: '👤', group: 'Details' },
  { key: 'username', label: 'Professional Username', icon: '🏷️', group: 'Details' },
  { key: 'email', label: 'Email', icon: '✉️', group: 'Details' },
  { key: 'phone', label: 'Phone', icon: '📞', group: 'Details' },
  { key: 'jobRole', label: 'Job Title / Role', icon: '💼', group: 'Details' },
  { key: 'company', label: 'Current Company', icon: '🏢', group: 'Details' },
  { key: 'skills', label: 'Skills (comma separated)', icon: '🛠️', group: 'Professional' },
  { key: 'experience', label: 'Experience', icon: '📈', group: 'Professional' },
  { key: 'education', label: 'Education', icon: '🎓', group: 'Professional' },
  { key: 'projects', label: 'Projects', icon: '🚀', group: 'Professional' },
  { key: 'github', label: 'GitHub', icon: '🔗', group: 'Professional' },
  { key: 'linkedin', label: 'LinkedIn', icon: '🔗', group: 'Professional' },
  { key: 'portfolio', label: 'Portfolio', icon: '🌐', group: 'Professional' },
  { key: 'careerObjective', label: 'Career Objective', icon: '🎯', group: 'Objective' },
  { key: 'additionalInfo', label: 'Additional Info', icon: '📝', group: 'Objective' },
]

export const LEVELS = ['beginner', 'mid', 'senior']

export const EMPTY_PROFILE = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  skills: '',
  company: '',
  jobRole: '',
  experience: '',
  education: '',
  projects: '',
  github: '',
  linkedin: '',
  portfolio: '',
  careerObjective: '',
  additionalInfo: '',
  template: 'software-engineer',
  level: 'mid',
}