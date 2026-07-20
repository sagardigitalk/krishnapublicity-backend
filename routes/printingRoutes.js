import express from 'express';
import { getPrintings, createPrinting, deletePrinting, getPrintingById, updatePrinting } from '../controllers/printingController.js';

const router = express.Router();

router.route('/')
  .get(getPrintings)
  .post(createPrinting);

router.route('/:id')
  .get(getPrintingById)
  .put(updatePrinting)
  .delete(deletePrinting);

export default router;
