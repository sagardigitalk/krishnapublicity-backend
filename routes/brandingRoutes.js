import express from 'express';
import { getBranding, createBranding, updateBranding, deleteBranding } from '../controllers/brandingController.js';

const router = express.Router();

router.route('/')
  .get(getBranding)
  .post(createBranding);

router.route('/:id')
  .put(updateBranding)
  .delete(deleteBranding);

export default router;
