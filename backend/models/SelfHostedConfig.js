const mongoose = require('mongoose');

const selfHostedConfigSchema = new mongoose.Schema({
  deploymentType: { type: String, enum: ['SelfHosted', 'SaaS'], default: 'SelfHosted' },
  serverStatus: { type: String, enum: ['Online', 'Maintenance'], default: 'Online' },
  cpuUsagePct: { type: Number, default: 24 },
  ramUsagePct: { type: Number, default: 28 },
  diskUsagePct: { type: Number, default: 35 },
  lastBackupTimestamp: { type: Date, default: Date.now },
  securityPatchVersion: { type: String, default: 'v4.8.2-LMS-SECURE' },
  backupLogs: [
    {
      backupId: { type: String, required: true },
      sizeMb: { type: Number, default: 42.5 },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SelfHostedConfig', selfHostedConfigSchema, 'self_hosted_configs');
