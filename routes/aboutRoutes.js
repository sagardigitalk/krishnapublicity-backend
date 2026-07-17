import express from 'express';
import { getAboutContent, updateAboutContent } from '../controllers/aboutController.js';

const router = express.Router();

router.route('/')
  .get(getAboutContent)
  .put(updateAboutContent); // Protect with admin middleware in production

export default router;
