import express from 'express';
import { getExpenses, createExpense, deleteExpense, getExpenseById, updateExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

export default router;
