import express from 'express';
import { getPrintings, createPrinting, deletePrinting, getPrintingById, updatePrinting, downloadPrintingReportPDF, downloadPrintingBillPDF } from '../controllers/printingController.js';

const router = express.Router();

router.route('/')
  .get(getPrintings)
  .post(createPrinting);

router.get('/pdf/report', downloadPrintingReportPDF);
router.get('/pdf/bill/:id', downloadPrintingBillPDF);

router.route('/:id')
  .get(getPrintingById)
  .put(updatePrinting)
  .delete(deletePrinting);

export default router;
