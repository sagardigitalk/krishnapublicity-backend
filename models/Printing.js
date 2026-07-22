import mongoose from 'mongoose';

const printingSchema = new mongoose.Schema({
  pressName: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0,
  },
  billNumber: {
    type: String,
  }
}, { timestamps: true });

const Printing = mongoose.model('Printing', printingSchema);

export default Printing;
