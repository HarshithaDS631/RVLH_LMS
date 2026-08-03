const SuperAdminActivity = require('../models/SuperAdminActivity');
const AdminActivity = require('../models/AdminActivity');
const UserActivity = require('../models/UserActivity');

// Central Log Activity Dispatcher Helper
async function logActivity(user, action, opts = {}) {
  if (!user) return;
  try {
    if (user.role === 'superadmin') {
      await SuperAdminActivity.create({
        superAdminId: user._id || 'sa_1',
        superAdminName: user.name || 'SaaS Director',
        email: user.email,
        action: action,
        tenantId: opts.tenantId,
        tenantName: opts.tenantName,
        details: opts.details || action
      });
    } else if (user.role === 'admin') {
      await AdminActivity.create({
        adminId: user._id || 'a_1',
        adminName: user.name || 'System Admin',
        email: user.email,
        action: action,
        targetType: opts.targetType || 'System',
        targetName: opts.targetName || 'LMS Platform',
        details: opts.details || action
      });
    } else {
      await UserActivity.create({
        userId: user._id || 'u_1',
        userName: user.name || 'User',
        email: user.email,
        role: user.role || 'student',
        action: action,
        module: opts.module || 'LMS',
        details: opts.details || action
      });
    }
  } catch (err) {
    console.error('Error recording activity log:', err.message);
  }
}

module.exports = { logActivity };
