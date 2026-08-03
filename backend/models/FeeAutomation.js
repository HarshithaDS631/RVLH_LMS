const mongoose = require('mongoose');

const feeAutomationSchema = new mongoose.Schema({
  studentId: { type: String, default: 's1' },
  studentName: { type: String, default: 'Arjun Sharma' },
  rollNo: { type: String, default: 'RVLH-2026-042' },
  termName: { type: String, default: 'Term 2 — Academic Year 2025-26' },
  totalFee: { type: Number, default: 50000 },
  paidFee: { type: Number, default: 25000 },
  dueFee: { type: Number, default: 25000 },
  paymentMode: { type: String, enum: ['Online', 'OverTheCounter', 'ChequeDropBox'], default: 'Online' },
  receiptNo: { type: String, default: 'REC-2026-8801' },
  transactionId: { type: String, default: 'TXN-99042817' },
  chequeDetails: {
    chequeNo: { type: String },
    bankName: { type: String },
    dropboxLocation: { type: String },
    clearanceStatus: { type: String, enum: ['Pending Clearance', 'Cleared', 'Rejected'], default: 'Cleared' }
  }
}, { timestamps: true });

module.exports = mongoose.model('FeeAutomation', feeAutomationSchema, 'fee_automations');
