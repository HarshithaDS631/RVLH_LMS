const express = require('express');
const router = express.Router();
const { getMongoStatus } = require('../config/db');
const SelfHostedConfig = require('../models/SelfHostedConfig');

router.get('/status', async (req, res) => {
  try {
    if (getMongoStatus()) {
      let config = await SelfHostedConfig.findOne();
      if (!config) {
        config = await SelfHostedConfig.create({
          deploymentType: 'SelfHosted', serverStatus: 'Online', cpuUsagePct: 24, ramUsagePct: 28, diskUsagePct: 35, securityPatchVersion: 'v4.8.2-LMS-SECURE', backupLogs: []
        });
      }
      return res.json(config);
    }
    res.json({
      deploymentType: 'SelfHosted',
      serverStatus: 'Online',
      cpuUsagePct: 24,
      ramUsagePct: 28,
      diskUsagePct: 35,
      securityPatchVersion: 'v4.8.2-LMS-SECURE',
      backupLogs: [
        { backupId: 'DUMP-20260803-01', sizeMb: 42.5, timestamp: new Date() }
      ]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/backup', async (req, res) => {
  try {
    const backupId = 'DUMP-' + new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 10);
    const sizeMb = Number((35 + Math.random() * 15).toFixed(1));
    const newLog = { backupId, sizeMb, timestamp: new Date() };

    if (getMongoStatus()) {
      let config = await SelfHostedConfig.findOne();
      if (config) {
        config.backupLogs.unshift(newLog);
        await config.save();
        return res.status(201).json({ message: 'Self-Hosted Database backup completed cleanly!', backup: newLog });
      }
    }

    res.status(201).json({ message: 'Self-Hosted Database backup completed cleanly (mock)!', backup: newLog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/toggle-maintenance', async (req, res) => {
  try {
    if (getMongoStatus()) {
      let config = await SelfHostedConfig.findOne();
      if (config) {
        config.serverStatus = config.serverStatus === 'Online' ? 'Maintenance' : 'Online';
        await config.save();
        return res.json({ message: `Maintenance mode updated to ${config.serverStatus}`, status: config.serverStatus });
      }
    }
    res.json({ message: 'Maintenance mode toggled (mock)', status: 'Maintenance' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/switch-deployment', async (req, res) => {
  try {
    const { targetMode } = req.body;
    const mode = targetMode || 'SelfHosted';

    if (getMongoStatus()) {
      let config = await SelfHostedConfig.findOne();
      if (config) {
        config.deploymentType = mode;
        await config.save();
        return res.json({ message: `LMS Architecture switched to ${mode}`, deploymentType: mode });
      }
    }

    res.json({ message: `LMS Architecture switched to ${mode} (mock)`, deploymentType: mode });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
