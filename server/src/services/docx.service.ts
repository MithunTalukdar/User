import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import type { ProfileInput } from '../types';
import { OUTPUT_LABELS, OUTPUT_TYPES } from '../types';

function asParagraphs(text: string): Paragraph[] {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  if (!blocks.length) return [];
  return blocks.map((block) => new Paragraph({ children: [new TextRun({ text: block })], spacing: { after: 200 } }));
}

export async function buildResumeDocx(
  profile: ProfileInput,
  outputs: Record<string, string>,
): Promise<Buffer> {
  const name = profile.fullName?.trim() || profile.username?.trim() || 'Candidate';
  const contact = [profile.email, profile.phone, profile.github, profile.linkedin, profile.portfolio]
    .filter(Boolean)
    .join('  |  ');

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      text: name,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
    }),
  );
  if (contact) {
    children.push(
      new Paragraph({ children: [new TextRun({ text: contact, color: '334155' })] }),
    );
  }
  children.push(new Paragraph({ children: [], spacing: { after: 200 } }));

  if (profile.jobRole) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: profile.jobRole, bold: true, size: 28 }),
          new TextRun({
            text: profile.company ? `   |   ${profile.company}` : '',
            size: 24,
            color: '475569',
          }),
        ],
        spacing: { after: 100 },
      }),
    );
    if (profile.experience) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: profile.experience, italics: true })], spacing: { after: 200 } }),
      );
    }
  }

  for (const type of OUTPUT_TYPES) {
    const text = outputs[type]?.trim();
    if (!text) continue;
    children.push(
      new Paragraph({ text: OUTPUT_LABELS[type], heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      ...asParagraphs(text),
    );
  }

  const extra: { title: string; value?: string }[] = [
    { title: 'Education', value: profile.education },
    { title: 'Projects', value: profile.projects },
    { title: 'Career Objective', value: profile.careerObjective },
    { title: 'Additional Information', value: profile.additionalInfo },
  ];
  for (const e of extra) {
    if (!e.value?.trim()) continue;
    children.push(
      new Paragraph({ text: e.title, heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 100 } }),
      ...asParagraphs(e.value),
    );
  }

  const doc = new Document({ sections: [{ properties: {}, children }] });
  return Packer.toBuffer(doc);
}