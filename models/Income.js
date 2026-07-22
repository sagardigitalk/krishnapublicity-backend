import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  customerName: {
    type: String,
    required: true,
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
  }
}, { timestamps: true });

const Income = mongoose.model('Income', incomeSchema);

export default Income;
