import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  details: {
    type: String,
    required: true,
  },
  printingPress: {
    type: String,
  },
  date: {
    type: String,
  },
  totalBill: {
    type: Number,
    default: 0,
  },
  givenAmount: {
    type: Number,
    default: 0,
  },
  pendingAmount: {
    type: Number,
    default: 0,
  },
  billNumber: {
    type: String,
  }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
