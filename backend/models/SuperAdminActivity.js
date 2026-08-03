const mongoose = require('mongoose');

const superAdminActivitySchema = new mongoose.Schema({
  superAdminId: { type: String, required: true },
  superAdminName: { type: String, required: true },
  email: { type: String },
  action: { type: String, required: true },
  tenantId: { type: String },
  tenantName: { type: String },
  details: { type: String },
  ip: { type: String, default: '127.0.0.1' }
}, { timestamps: true });

module.exports = mongoose.model('SuperAdminActivity', superAdminActivitySchema, 'superadmin_activities');
