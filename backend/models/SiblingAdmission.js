const mongoose = require('mongoose');

const siblingAdmissionSchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  siblingName: { type: String, required: true },
  dob: { type: String },
  gradeApplying: { type: String, required: true },
  previousSchool: { type: String },
  status: { type: String, enum: ['Form Submitted', 'Document Verification', 'Interview Scheduled', 'Admitted', 'Rejected'], default: 'Form Submitted' },
  applicationNo: { type: String, required: true, unique: true },
  appliedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('SiblingAdmission', siblingAdmissionSchema);
