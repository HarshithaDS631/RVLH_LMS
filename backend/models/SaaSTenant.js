const mongoose = require('mongoose');

const saasTenantSchema = new mongoose.Schema({
  tenantName: { type: String, required: true },
  domain: { type: String, required: true },
  subdomain: { type: String, required: true },
  plan: { type: String, enum: ['Starter', 'Professional', 'Enterprise'], default: 'Enterprise' },
  maxUsers: { type: Number, default: 5000 },
  usedUsers: { type: Number, default: 4200 },
  mrrAmount: { type: Number, default: 45000 },
  status: { type: String, enum: ['Active', 'Trialing', 'Suspended'], default: 'Active' },
  adminEmail: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SaaSTenant', saasTenantSchema, 'saas_tenants');
