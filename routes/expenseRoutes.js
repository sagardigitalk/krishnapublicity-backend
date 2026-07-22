import express from 'express';
import { getExpenses, createExpense, deleteExpense, getExpenseById, updateExpense, downloadExpenseReportPDF, downloadExpenseBillPDF } from '../controllers/expenseController.js';

const router = express.Router();

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.get('/pdf/report', downloadExpenseReportPDF);
router.get('/pdf/bill/:id', downloadExpenseBillPDF);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
