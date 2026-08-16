import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { profileSchema } from '../validation/schema';

function parseProfile(req: Request) {
  return profileSchema.parse(req.body.profile || {});
}

function sanitizeName(name: string): string {
  return name.trim().replace(/[^\w-]+/g, '_').replace(/_+/g, '_').slice(0, 60) || 'resume';
}

export const exportPdf = asyncHandler(async (req: Request, res: Response) => {
  const { buildResumePdf } = await import('../services/pdf.service');
  const profile = parseProfile(req);
  const outputs = req.body.outputs || {};
  const buffer = await buildResumePdf(profile, outputs);
  const fileName = `${sanitizeName(profile.fullName || profile.username || 'candidate')}_resume.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(buffer);
});

export const exportDocx = asyncHandler(async (req: Request, res: Response) => {
  const { buildResumeDocx } = await import('../services/docx.service');
  const profile = parseProfile(req);
  const outputs = req.body.outputs || {};
  const buffer = await buildResumeDocx(profile, outputs);
  const fileName = `${sanitizeName(profile.fullName || profile.username || 'candidate')}_resume.docx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(buffer);
});