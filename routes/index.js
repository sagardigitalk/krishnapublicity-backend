import express from 'express';
import authRoutes from './authRoutes.js';
import homeRoutes from './homeRoutes.js';
import aboutRoutes from './aboutRoutes.js';
import partnerRoutes from './partnerRoutes.js';
import teamRoutes from './teamRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import hoardingRoutes from './hoardingRoutes.js';
import brandingRoutes from './brandingRoutes.js';
import graphicsRoutes from './graphicsRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/about', aboutRoutes);
router.use('/team', teamRoutes);
router.use('/partners', partnerRoutes);
router.use('/settings', settingsRoutes);
router.use('/hoardings', hoardingRoutes);
router.use('/branding', brandingRoutes);
router.use('/graphics', graphicsRoutes);
router.use('/upload', uploadRoutes);

export default router;
