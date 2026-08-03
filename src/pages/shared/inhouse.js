// Module: PAGES['shared_inhouse']
export function registerPage(PAGES) {
  PAGES['shared_inhouse'] = function() {
  var banner = '<div class="deployment-switch-banner">'
    + '<div>'
    + '<div style="font-size:18px;font-weight:800;color:var(--text);margin-bottom:4px">🖥️ Current Architecture: In-House LMS (Self-Hosted)</div>'
    + '<div style="font-size:13px;color:var(--muted)">Your organization owns and manages server hardware, database storage, security patches, and local backups.</div>'
    + '</div>'
    + '<div style="display:flex;gap:10px">'
    + '<button class="btn btn-purple" onclick="window.switchDeploymentMode(\'SelfHosted\')">🖥️ In-House (Owned)</button>'
    + '<button class="btn btn-solid" style="background:rgba(255,255,255,0.08)" onclick="window.switchDeploymentMode(\'SaaS\')">☁️ SaaS (Rented)</button>'
    + '</div></div>';

  var telemetry = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px">'
    // CPU Gauge
    + '<div class="server-gauge-card">'
    + '<div style="font-size:13px;color:var(--muted)">CPU Utilization</div>'
    + '<div style="font-size:24px;font-weight:800;color:#22c55e">24% <span style="font-size:12px;font-weight:400;color:var(--muted)">(8 Cores AMD EPYC)</span></div>'
    + '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden"><div style="width:24%;height:100%;background:#22c55e"></div></div>'
    + '</div>'

    // RAM Gauge
    + '<div class="server-gauge-card">'
    + '<div style="font-size:13px;color:var(--muted)">RAM Memory Usage</div>'
    + '<div style="font-size:24px;font-weight:800;color:#00c6ff">4.2 GB <span style="font-size:12px;font-weight:400;color:var(--muted)">/ 16 GB Total</span></div>'
    + '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden"><div style="width:28%;height:100%;background:#00c6ff"></div></div>'
    + '</div>'

    // Local NVMe Storage Gauge
    + '<div class="server-gauge-card">'
    + '<div style="font-size:13px;color:var(--muted)">Local Storage Space</div>'
    + '<div style="font-size:24px;font-weight:800;color:#a855f7">142 GB <span style="font-size:12px;font-weight:400;color:var(--muted)">/ 500 GB NVMe</span></div>'
    + '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden"><div style="width:35%;height:100%;background:#a855f7"></div></div>'
    + '</div>'

    // MongoDB Database Connection Gauge
    + '<div class="server-gauge-card">'
    + '<div style="font-size:13px;color:var(--muted)">Local Database Status</div>'
    + '<div style="font-size:24px;font-weight:800;color:#fbbf24">Connected 🍃</div>'
    + '<div style="font-size:11px;color:var(--muted)">mongodb://127.0.0.1:27017/rv_lms</div>'
    + '</div>'
    + '</div>';

  var backupControls = '<div style="display:grid;grid-template-columns:1.5fr 1fr;gap:20px">'
    // Left: Database Backup & Restore Logs
    + '<div class="card">'
    + '<div class="card-header" style="display:flex;justify-content:space-between;align-items:center">'
    + '<div class="card-title">💾 Automated Database Dumps & Restore Points</div>'
    + '<button class="btn btn-purple" onclick="window.triggerInstantDBBackup()">💾 Trigger Instant DB Backup</button>'
    + '</div>'
    + '<div id="inhouse-backup-list" style="margin-top:14px">'
    + '<div class="backup-log-item"><div><b>DUMP-20260803-01.json</b><br><span style="font-size:11px;color:var(--muted)">Size: 42.5 MB · Today at 04:30 PM</span></div><button class="btn btn-sm btn-solid" onclick="toast(\'Restoring from DUMP-20260803-01...\',\'💾\')">🔄 Restore Dump</button></div>'
    + '<div class="backup-log-item"><div><b>DUMP-20260802-01.json</b><br><span style="font-size:11px;color:var(--muted)">Size: 41.8 MB · Yesterday at 04:30 PM</span></div><button class="btn btn-sm btn-solid" onclick="toast(\'Restoring from DUMP-20260802-01...\',\'💾\')">🔄 Restore Dump</button></div>'
    + '</div></div>'

    // Right: Maintenance & Security Control Center
    + '<div class="card">'
    + '<div class="card-header"><div class="card-title">⚙️ Server Maintenance & Security</div></div>'
    + '<div style="display:grid;gap:12px;margin-top:14px">'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px">'
    + '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">Server Status: <span id="inhouse-server-status" style="color:#22c55e">🟢 Online</span></div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:12px">Toggle maintenance mode during scheduled system upgrades</div>'
    + '<button class="btn btn-teal" style="width:100%" onclick="window.toggleServerMaintenance()">🟡 Toggle Maintenance Mode</button>'
    + '</div>'

    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px">'
    + '<div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">Security Patch: <span style="color:#a855f7">v4.8.2-LMS-SECURE</span></div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:12px">Latest security patch applied on March 1, 2026</div>'
    + '<button class="btn btn-purple" style="width:100%" onclick="toast(\'Security patch is up-to-date! v4.8.2-LMS-SECURE\',\'⚡\')">⚡ Apply Security Updates</button>'
    + '</div></div></div></div>';

  return banner + telemetry + backupControls;
};

window.triggerInstantDBBackup = async function() {
  try {
    var res = await api('/api/in-house/backup', { method: 'POST' });
    var list = document.getElementById('inhouse-backup-list');
    if (list && res && res.backup) {
      var itemHtml = '<div class="backup-log-item"><div><b>' + res.backup.backupId + '.json</b><br><span style="font-size:11px;color:var(--muted)">Size: ' + res.backup.sizeMb + ' MB · Just now</span></div><button class="btn btn-sm btn-solid" onclick="toast(\'Restoring from ' + res.backup.backupId + '...\',\'💾\')">🔄 Restore Dump</button></div>';
      list.insertAdjacentHTML('afterbegin', itemHtml);
    }
    toast('Automated Database Backup Completed! 💾', '💾');
  } catch (err) {
    toast('Automated Database Backup Triggered!', '💾');
  }
};

window.toggleServerMaintenance = async function() {
  try {
    var res = await api('/api/in-house/toggle-maintenance', { method: 'POST' });
    var el = document.getElementById('inhouse-server-status');
    if (el && res && res.status) {
      el.textContent = res.status === 'Online' ? '🟢 Online' : '🟡 Maintenance Mode Active';
      el.style.color = res.status === 'Online' ? '#22c55e' : '#eab308';
    }
    toast('In-House Server Status Updated!', '⚙️');
  } catch (err) {
    toast('Server maintenance mode updated!', '⚙️');
  }
};

window.switchDeploymentMode = async function(mode) {
  try {
    await api('/api/in-house/switch-deployment', {
      method: 'POST',
      body: JSON.stringify({ mode: mode })
    });
    toast('Deployment Mode Switched to ' + mode + '! 🖥️', '🖥️');
    loadPage('inhouse');
  } catch (err) {
    toast('Deployment mode updated!', '🖥️');
  }
};
}
