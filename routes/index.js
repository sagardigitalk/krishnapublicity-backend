import express from 'express';
import authRoutes from './authRoutes.js';
import homeRoutes from './homeRoutes.js';
import aboutRoutes from './aboutRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/about', aboutRoutes);
router.use('/upload', uploadRoutes);

export default router;
