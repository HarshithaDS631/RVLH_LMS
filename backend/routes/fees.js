const express = require('express');
const router = express.Router();
const { fees } = require('../data/store');
const { protect } = require('../middleware/auth');
const { getMongoStatus } = require('../config/db');
const FeeAutomation = require('../models/FeeAutomation');

router.get('/', protect, (req, res) => {
  res.json(fees);
});

router.put('/:id', protect, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  const fee = fees.find(f => f._id === req.params.id);
  if (!fee) return res.status(404).json({ message: 'Fee record not found' });
  fee.status = req.body.status || 'Paid';
  res.json(fee);
});

// FEE AUTOMATION ENDPOINTS
router.get('/automation', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const records = await FeeAutomation.find().sort({ createdAt: -1 });
      return res.json(records);
    }
    res.json([
      { _id: 'fa-1', studentName: 'Arjun Sharma', rollNo: 'RVLH-2026-042', termName: 'Term 1 — Academic Year 2025-26', totalFee: 50000, paidFee: 25000, dueFee: 0, paymentMode: 'Online', receiptNo: 'REC-2026-8801', transactionId: 'TXN-99042817' },
      { _id: 'fa-2', studentName: 'Arjun Sharma', rollNo: 'RVLH-2026-042', termName: 'Term 2 — Academic Year 2025-26', totalFee: 50000, paidFee: 0, dueFee: 25000, paymentMode: 'ChequeDropBox', receiptNo: 'REC-2026-9042', transactionId: 'CHQ-409218', chequeDetails: { chequeNo: '409218', bankName: 'HDFC Bank Jayanagar', dropboxLocation: 'Drop Box DB-04 (Main Gate)', clearanceStatus: 'Pending Clearance' } }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/automation/pay-online', async (req, res) => {
  try {
    const { studentName, rollNo, termName, amount, paymentGateway } = req.body;
    const receiptNo = 'REC-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    const transactionId = 'TXN-' + String(Math.floor(10000000 + Math.random() * 90000000));

    let record = {
      studentId: 's1',
      studentName: studentName || 'Arjun Sharma',
      rollNo: rollNo || 'RVLH-2026-042',
      termName: termName || 'Term 2 — Academic Year 2025-26',
      totalFee: Number(amount) || 25000,
      paidFee: Number(amount) || 25000,
      dueFee: 0,
      paymentMode: 'Online',
      receiptNo,
      transactionId
    };

    if (getMongoStatus()) {
      record = await FeeAutomation.create(record);
    }

    res.status(201).json({ message: 'Online Fee Payment successful!', receiptNo, transactionId, data: record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/automation/record-otc', async (req, res) => {
  try {
    const { studentName, rollNo, termName, amount, paymentType, counterNo } = req.body;
    const receiptNo = 'OTC-REC-' + String(Math.floor(1000 + Math.random() * 9000));
    const transactionId = 'OTC-TXN-' + String(Math.floor(100000 + Math.random() * 900000));

    let record = {
      studentId: 's1',
      studentName: studentName || 'Arjun Sharma',
      rollNo: rollNo || 'RVLH-2026-042',
      termName: termName || 'Term 1 — Academic Year 2025-26',
      totalFee: Number(amount) || 25000,
      paidFee: Number(amount) || 25000,
      dueFee: 0,
      paymentMode: 'OverTheCounter',
      receiptNo,
      transactionId
    };

    if (getMongoStatus()) {
      record = await FeeAutomation.create(record);
    }

    res.status(201).json({ message: 'Over-the-Counter Cash/POS Payment recorded!', receiptNo, transactionId, counterNo: counterNo || 'Counter #2', data: record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/automation/cheque-drop', async (req, res) => {
  try {
    const { studentName, rollNo, termName, amount, chequeNo, bankName, dropboxLocation } = req.body;
    const receiptNo = 'CHQ-REC-' + String(Math.floor(1000 + Math.random() * 9000));
    const transactionId = 'CHQ-' + (chequeNo || '409218');

    let record = {
      studentId: 's1',
      studentName: studentName || 'Arjun Sharma',
      rollNo: rollNo || 'RVLH-2026-042',
      termName: termName || 'Term 2 — Academic Year 2025-26',
      totalFee: Number(amount) || 25000,
      paidFee: 0,
      dueFee: Number(amount) || 25000,
      paymentMode: 'ChequeDropBox',
      receiptNo,
      transactionId,
      chequeDetails: {
        chequeNo: chequeNo || '409218',
        bankName: bankName || 'HDFC Bank',
        dropboxLocation: dropboxLocation || 'Main Gate DropBox',
        clearanceStatus: 'Pending Clearance'
      }
    };

    if (getMongoStatus()) {
      record = await FeeAutomation.create(record);
    }

    res.status(201).json({ message: 'Cheque Drop Box submission logged successfully! Awaiting bank clearance.', receiptNo, transactionId, data: record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
