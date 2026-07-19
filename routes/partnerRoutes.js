import express from 'express';
import { getPartners, updatePartners } from '../controllers/partnerController.js';

const router = express.Router();

router.route('/')
  .get(getPartners)
  .put(updatePartners);

export default router;
