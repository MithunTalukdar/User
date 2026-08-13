import PDFDocument from 'pdfkit';
import type { ProfileInput } from '../types';
import { OUTPUT_LABELS, OUTPUT_TYPES } from '../types';

interface PdfSection {
  title: string;
  body: string;
}

function buildSections(profile: ProfileInput, outputs: Record<string, string>): PdfSection[] {
  const contact = [profile.email, profile.phone, profile.github, profile.linkedin, profile.portfolio]
    .filter(Boolean)
    .join('  |  ');

  const sections: PdfSection[] = [];

  if (profile.jobRole) {
    sections.push({
      title: profile.jobRole,
      body: [profile.company, profile.experience, contact].filter(Boolean).join('  |  '),
    });
  }

  for (const type of OUTPUT_TYPES) {
    const text = outputs[type]?.trim();
    if (!text) continue;
    sections.push({ title: OUTPUT_LABELS[type], body: text.replace(/\n{2,}/g, '\n') });
  }

  if (profile.education) sections.push({ title: 'Education', body: profile.education });
  if (profile.projects) sections.push({ title: 'Projects', body: profile.projects });
  if (profile.careerObjective)
    sections.push({ title: 'Career Objective', body: profile.careerObjective });
  if (profile.additionalInfo)
    sections.push({ title: 'Additional Information', body: profile.additionalInfo });

  return sections;
}

export async function buildResumePdf(
  profile: ProfileInput,
  outputs: Record<string, string>,
): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 48, bottom: 48, left: 54, right: 54 } });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));

  const name = profile.fullName?.trim() || profile.username?.trim() || 'Candidate';
  const sections = buildSections(profile, outputs);

  doc.font('Helvetica-Bold').fontSize(26).fillColor('#0f172a').text(name, { align: 'left' });

  if (profile.email || profile.phone) {
    doc
      .moveDown(0.2)
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#475569')
      .text([profile.email, profile.phone].filter(Boolean).join('  ·  '));
  }

  doc.moveDown(0.4).moveTo(54, doc.y).lineTo(542, doc.y).strokeColor('#cbd5e1').lineWidth(1).stroke();

  for (const section of sections) {
    doc.moveDown(1.1);
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#0f172a').text(section.title);
    doc
      .moveDown(0.35)
      .font('Helvetica')
      .fontSize(10.5)
      .fillColor('#334155')
      .lineGap(2.5)
      .text(section.body);
  }

  doc.end();
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });
}
