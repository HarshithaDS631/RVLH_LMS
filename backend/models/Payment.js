const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  material: { type: String, default: 'LMS Tuition & Fee Payment' },
  amount: { type: Number, required: true },
  method: { type: String, default: 'UPI' },
  status: { type: String, default: 'success' },
  type: { type: String, default: 'course' },
  date: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
