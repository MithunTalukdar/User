import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { profileSchema } from '../validation/schema';
import { buildResumePdf } from '../services/pdf.service';
import { buildResumeDocx } from '../services/docx.service';

function parseProfile(req: Request) {
  return profileSchema.parse(req.body.profile || {});
}

function sanitizeName(name: string): string {
  return name.trim().replace(/[^\w-]+/g, '_').replace(/_+/g, '_').slice(0, 60) || 'resume';
}

export const exportPdf = asyncHandler(async (req: Request, res: Response) => {
  const profile = parseProfile(req);
  const outputs = req.body.outputs || {};
  const buffer = await buildResumePdf(profile, outputs);
  const fileName = `${sanitizeName(profile.fullName || profile.username || 'candidate')}_resume.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(buffer);
});

export const exportDocx = asyncHandler(async (req: Request, res: Response) => {
  const profile = parseProfile(req);
  const outputs = req.body.outputs || {};
  const buffer = await buildResumeDocx(profile, outputs);
  const fileName = `${sanitizeName(profile.fullName || profile.username || 'candidate')}_resume.docx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(buffer);
});