import express from 'express';
import { getIncomes, createIncome, deleteIncome, getIncomeById, updateIncome } from '../controllers/incomeController.js';

const router = express.Router();

router.route('/')
  .get(getIncomes)
  .post(createIncome);

router.route('/:id')
  .get(getIncomeById)
  .put(updateIncome)
  .delete(deleteIncome);

export default router;
