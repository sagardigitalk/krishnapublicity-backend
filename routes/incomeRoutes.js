import express from 'express';
import { getIncomes, createIncome, deleteIncome, getIncomeById, updateIncome, downloadIncomeReportPDF, downloadIncomeBillPDF } from '../controllers/incomeController.js';

const router = express.Router();

router.get('/pdf/report', downloadIncomeReportPDF);
router.get('/pdf/bill/:id', downloadIncomeBillPDF);

router.route('/')
  .get(getIncomes)
  .post(createIncome);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

export default router;
