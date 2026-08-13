import { Router } from 'express';
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  me,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
} from '../controllers/auth.controller';
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address.controller';
import { protect } from '../middleware/auth';
import {
  saveProfile,
  listProfiles,
  getProfile,
  updateProfile as updateResumeProfile,
  deleteProfile,
  togglePin,
} from '../controllers/profile.controller';
import {
  generateAllHandler,
  generateTypeHandler,
  refineHandler,
  chatHandler,
} from '../controllers/ai.controller';
import { exportPdf, exportDocx } from '../controllers/export.controller';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/resend-otp', resendOtp);
router.post('/auth/login', login);
router.get('/auth/me', protect, me);
router.patch('/auth/profile', protect, updateProfile);
router.put('/auth/change-password', protect, changePassword);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/logout', logout);

router.get('/addresses', protect, listAddresses);
router.post('/addresses', protect, createAddress);
router.patch('/addresses/:id', protect, updateAddress);
router.delete('/addresses/:id', protect, deleteAddress);

router.post('/generate', generateAllHandler);
router.post('/generate/type', generateTypeHandler);
router.post('/refine', refineHandler);

router.post('/chat', chatHandler);

router.post('/export/pdf', exportPdf);
router.post('/export/docx', exportDocx);

router.post('/profiles', protect, saveProfile);
router.get('/profiles', protect, listProfiles);
router.get('/profiles/:id', getProfile);
router.patch('/profiles/:id', protect, updateResumeProfile);
router.delete('/profiles/:id', protect, deleteProfile);
router.post('/profiles/:id/pin', protect, togglePin);

export default router;