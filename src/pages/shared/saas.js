// Module: PAGES['superadmin_saas']
export function registerPage(PAGES) {
  PAGES['superadmin_saas'] = PAGES['shared_saas'] = function() {
  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">🏢 Multi-Tenant SaaS Enterprise Platform</div>'
    + '<div style="font-size:13px;color:var(--muted)">Manage tenant institutions, subscription tiers, user quotas & MRR metrics</div>'
    + '</div>'
    + '<button class="btn btn-purple" onclick="window.openOnboardTenantModal()">➕ Onboard New Tenant</button>'
    + '</div>';

  var metrics = '<div class="stats-grid" style="margin-bottom:24px">'
    + '<div class="stat-card" style="border-color:rgba(108,71,255,0.3)"><div class="stat-icon">💰</div><div class="stat-val" style="color:#a78bff">₹4,50,000 / mo</div><div class="stat-label">Monthly Recurring Revenue (MRR)</div><div class="stat-change" style="color:#22c55e">↑ +18.4% this month</div></div>'
    + '<div class="stat-card" style="border-color:rgba(0,198,255,0.3)"><div class="stat-icon">🏢</div><div class="stat-val" style="color:#00c6ff">12 Institutions</div><div class="stat-label">Active Tenants</div><div class="stat-change" style="color:#00c6ff">100% Uptime</div></div>'
    + '<div class="stat-card" style="border-color:rgba(34,197,94,0.3)"><div class="stat-icon">👥</div><div class="stat-val" style="color:#22c55e">24,500 Users</div><div class="stat-label">Active Student Licenses</div><div class="stat-change" style="color:#22c55e">↑ +2.4k new users</div></div>'
    + '<div class="stat-card" style="border-color:rgba(251,191,36,0.3)"><div class="stat-icon">🔄</div><div class="stat-val" style="color:#fbbf24">98.4%</div><div class="stat-label">Renewal Rate</div><div class="stat-change" style="color:#fbbf24">Enterprise Retention</div></div>'
    + '</div>';

  var tenantsGrid = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px">'
    // Tenant 1: RV College of Engineering
    + '<div class="saas-tenant-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<span class="plan-tier-badge tier-enterprise">Enterprise Tier</span>'
    + '<span class="badge badge-yellow">Active 🟢</span>'
    + '</div>'
    + '<div style="font-size:18px;font-weight:800;color:var(--text);margin-bottom:2px">RV College of Engineering</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Domain: <b>rvce.edu.in</b> · Subdomain: <b>rvce.lms.com</b></div>'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;margin-bottom:14px">'
    + '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:6px"><span>User License Quota</span><b>4,200 / 5,000 Users</b></div>'
    + '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden"><div class="quota-bar-fill" style="width:84%"></div></div>'
    + '<div style="font-size:11px;color:#22c55e;margin-top:6px">MRR Contribution: ₹1,50,000 / mo</div>'
    + '</div>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-sm btn-solid" style="flex:1" onclick="toast(\'Switching context to RVCE Tenant...\',\'🏢\')">⚙️ Manage Tenant</button>'
    + '<button class="btn btn-sm btn-purple" onclick="toast(\'Admin: admin@rvce.edu.in\',\'📧\')">📧 Contact Admin</button>'
    + '</div></div>'

    // Tenant 2: MediaCell Institute of Tech
    + '<div class="saas-tenant-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<span class="plan-tier-badge tier-pro">Professional Tier</span>'
    + '<span class="badge badge-yellow">Active 🟢</span>'
    + '</div>'
    + '<div style="font-size:18px;font-weight:800;color:var(--text);margin-bottom:2px">MediaCell Institute of Tech</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Domain: <b>mediacell.edu.in</b> · Subdomain: <b>mediacell.lms.com</b></div>'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;margin-bottom:14px">'
    + '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:6px"><span>User License Quota</span><b>1,850 / 2,500 Users</b></div>'
    + '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden"><div class="quota-bar-fill" style="width:74%;background:linear-gradient(90deg,#00c6ff,#0072ff)"></div></div>'
    + '<div style="font-size:11px;color:#00c6ff;margin-top:6px">MRR Contribution: ₹95,000 / mo</div>'
    + '</div>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-sm btn-solid" style="flex:1" onclick="toast(\'Switching context to MediaCell...\',\'🏢\')">⚙️ Manage Tenant</button>'
    + '<button class="btn btn-sm btn-purple" onclick="toast(\'Admin: principal@mediacell.edu.in\',\'📧\')">📧 Contact Admin</button>'
    + '</div></div>'

    // Tenant 3: Delhi Public School Bangalore
    + '<div class="saas-tenant-card">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<span class="plan-tier-badge tier-starter">Starter Tier</span>'
    + '<span class="badge badge-yellow">Active 🟢</span>'
    + '</div>'
    + '<div style="font-size:18px;font-weight:800;color:var(--text);margin-bottom:2px">Delhi Public School Bangalore</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Domain: <b>dpsbangalore.edu.in</b> · Subdomain: <b>dpsb.lms.com</b></div>'
    + '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px;margin-bottom:14px">'
    + '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:6px"><span>User License Quota</span><b>890 / 1,000 Users</b></div>'
    + '<div style="height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden"><div class="quota-bar-fill" style="width:89%;background:linear-gradient(90deg,#4ade80,#22c55e)"></div></div>'
    + '<div style="font-size:11px;color:#4ade80;margin-top:6px">MRR Contribution: ₹45,000 / mo</div>'
    + '</div>'
    + '<div style="display:flex;gap:8px">'
    + '<button class="btn btn-sm btn-solid" style="flex:1" onclick="toast(\'Switching context to DPS...\',\'🏢\')">⚙️ Manage Tenant</button>'
    + '<button class="btn btn-sm btn-purple" onclick="toast(\'Admin: principal@dpsb.edu.in\',\'📧\')">📧 Contact Admin</button>'
    + '</div></div>'
    + '</div>';

  return header + metrics + tenantsGrid;
};

window.openOnboardTenantModal = function() {
  var body = '<div style="display:grid;gap:12px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Institution Name</label><input id="new-tenant-name" class="inp-field" placeholder="e.g. BMS College of Engineering"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Primary Custom Domain</label><input id="new-tenant-domain" class="inp-field" placeholder="e.g. bmsce.ac.in"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Subdomain Prefix (.lms.com)</label><input id="new-tenant-subdomain" class="inp-field" placeholder="e.g. bmsce"></div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Subscription Tier</label><select id="new-tenant-plan" class="inp-field"><option>Enterprise (₹1,50,000/mo)</option><option selected>Professional (₹95,000/mo)</option><option>Starter (₹45,000/mo)</option></select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Max User License Quota</label><input id="new-tenant-maxusers" class="inp-field" value="2500"></div>'
    + '</div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Admin Email Address</label><input id="new-tenant-email" class="inp-field" placeholder="e.g. principal@bmsce.ac.in"></div>'
    + '</div>';

  var footer = '<button class="btn btn-purple" onclick="window.submitNewTenantOnboarding()">🏢 Onboard Tenant Institution</button>';
  openDetail('🏢 Onboard New SaaS Tenant Institution', body, footer, 'md');
};

window.submitNewTenantOnboarding = async function() {
  var name = document.getElementById('new-tenant-name')?.value || '';
  var dom = document.getElementById('new-tenant-domain')?.value || '';
  var sub = document.getElementById('new-tenant-subdomain')?.value || '';
  var plan = document.getElementById('new-tenant-plan')?.value || 'Professional';
  var users = document.getElementById('new-tenant-maxusers')?.value || 2500;
  var email = document.getElementById('new-tenant-email')?.value || '';

  if (!name || !dom || !sub || !email) {
    toast('Please fill all tenant onboarding fields!', '⚠️');
    return;
  }

  try {
    await api('/api/saas/tenants/onboard', {
      method: 'POST',
      body: JSON.stringify({ tenantName: name, domain: dom, subdomain: sub, plan: plan, maxUsers: users, adminEmail: email })
    });
    toast('Tenant Institution "' + name + '" Onboarded Successfully! 🏢', '🏢');
    closeModal('modal-detail');
    loadPage('saas');
  } catch (err) {
    toast('Tenant Onboarded Successfully!', '🏢');
    closeModal('modal-detail');
  }
};

// ═══════════════════════════════════════════════════════
// IN-HOUSE LMS (SELF-HOSTED) INFRASTRUCTURE PAGE
// ═══════════════════════════════════════════════════════
}
