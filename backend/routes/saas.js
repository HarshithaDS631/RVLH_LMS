const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const SaaSTenant = require('../models/SaaSTenant');

router.get('/tenants', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const tenants = await SaaSTenant.find().sort({ createdAt: -1 });
      return res.json(tenants);
    }
    res.json([
      { _id: 't1', tenantName: 'RV College of Engineering', domain: 'rvce.edu.in', subdomain: 'rvce', plan: 'Enterprise', maxUsers: 5000, usedUsers: 4200, mrrAmount: 150000, status: 'Active', adminEmail: 'admin@rvce.edu.in' },
      { _id: 't2', tenantName: 'MediaCell Institute of Tech', domain: 'mediacell.edu.in', subdomain: 'mediacell', plan: 'Professional', maxUsers: 2500, usedUsers: 1850, mrrAmount: 95000, status: 'Active', adminEmail: 'principal@mediacell.edu.in' },
      { _id: 't3', tenantName: 'Delhi Public School Bangalore', domain: 'dpsbangalore.edu.in', subdomain: 'dpsb', plan: 'Starter', maxUsers: 1000, usedUsers: 890, mrrAmount: 45000, status: 'Active', adminEmail: 'principal@dpsb.edu.in' }
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/tenants/onboard', async (req, res) => {
  try {
    const { tenantName, domain, subdomain, plan, maxUsers, adminEmail } = req.body;
    if (!tenantName || !domain || !adminEmail) {
      return res.status(400).json({ message: 'Missing required tenant onboarding details' });
    }

    const planPrices = { Starter: 45000, Professional: 95000, Enterprise: 150000 };
    const mrrAmount = planPrices[plan] || 45000;

    let tenant = {
      tenantName,
      domain,
      subdomain: subdomain || domain.split('.')[0],
      plan: plan || 'Professional',
      maxUsers: Number(maxUsers) || 2500,
      usedUsers: 1,
      mrrAmount,
      status: 'Active',
      adminEmail
    };

    if (getMongoStatus()) {
      tenant = await SaaSTenant.create(tenant);
    }

    res.status(201).json({ message: 'SaaS Tenant onboarded successfully!', tenant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/metrics', async (req, res) => {
  try {
    if (getMongoStatus()) {
      const tenants = await SaaSTenant.find();
      const totalMRR = tenants.reduce((sum, t) => sum + (t.mrrAmount || 0), 0);
      const totalUsers = tenants.reduce((sum, t) => sum + (t.usedUsers || 0), 0);
      return res.json({ totalTenants: tenants.length, totalMRR, totalUsers });
    }
    res.json({ totalTenants: 3, totalMRR: 290000, totalUsers: 6940 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
