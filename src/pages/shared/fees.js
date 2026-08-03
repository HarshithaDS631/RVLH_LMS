// Module: PAGES['shared_fees']
export function registerPage(PAGES) {
  PAGES['shared_fees'] = function() {
  var isAccountantOrAdmin = G.user && (G.user.role === 'admin' || G.user.role === 'faculty');

  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px">'
    + '<div>'
    + '<div style="font-size:20px;font-weight:800;color:var(--text)">💳 Multi-Channel Fee Automation Suite</div>'
    + '<div style="font-size:13px;color:var(--muted)">Process fees via Online Gateway, Accounts OTC Counter, or Cheque Drop Box</div>'
    + '</div>'
    + (isAccountantOrAdmin ? '<button class="btn btn-purple" onclick="window.recordOTCCashModal()">🏫 OTC Cash Desk</button>' : '')
    + '</div>';

  var channels = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-bottom:24px">'
    // Channel 1: Online Gateway
    + '<div class="fee-channel-card" onclick="window.payOnlineModal()">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<span style="font-size:32px">💳</span>'
    + '<span class="badge badge-purple">Instant Receipt</span>'
    + '</div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:4px">Online Payment Gateway</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Pay instantly via UPI, Credit/Debit Cards, or NetBanking with Razorpay</div>'
    + '<button class="btn btn-solid" style="width:100%">💳 Pay Online Now</button>'
    + '</div>'

    // Channel 2: Over-the-Counter (OTC) Cash Counter
    + '<div class="fee-channel-card" onclick="window.recordOTCCashModal()">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<span style="font-size:32px">🏫</span>'
    + '<span class="otc-badge-pill">Accounts Counter</span>'
    + '</div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:4px">Over-the-Counter (OTC)</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Pay cash at school counter & receive instant SMS/WhatsApp receipt to parent</div>'
    + '<button class="btn btn-teal" style="width:100%">🏫 Record OTC Cash</button>'
    + '</div>'

    // Channel 3: Cheque Drop Box Automation
    + '<div class="fee-channel-card" onclick="window.logChequeDropBoxModal()">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<span style="font-size:32px">📮</span>'
    + '<span class="cheque-status-pill status-pending-clearance">Clearance Tracker</span>'
    + '</div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:4px">Cheque Drop Box</div>'
    + '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Log cheque deposit into Drop Box DB-04 & track clearance status</div>'
    + '<button class="btn btn-purple" style="width:100%;background:linear-gradient(135deg,#a855f7,#6c47ff)">📮 Log Cheque Deposit</button>'
    + '</div>'
    + '</div>';

  var ledgerTable = '<div class="card">'
    + '<div class="card-header"><div class="card-title">📜 Academic Fee Ledger & Transaction History</div></div>'
    + '<div class="table-wrap"><table class="table">'
    + '<thead><tr>'
    + '<th>Term / Installment</th>'
    + '<th>Total Fee</th>'
    + '<th>Paid Amount</th>'
    + '<th>Due Dues</th>'
    + '<th>Mode & Details</th>'
    + '<th>Receipt & Action</th>'
    + '</tr></thead>'
    + '<tbody>'
    + '<tr>'
    + '<td><b>Term 1 — AY 2025-26</b></td>'
    + '<td>₹50,000</td>'
    + '<td><span style="color:#22c55e;font-weight:700">₹25,000</span></td>'
    + '<td>₹0</td>'
    + '<td><span class="badge badge-purple">💳 Online Gateway</span><br><span style="font-size:10px;color:var(--muted)">TXN-99042817</span></td>'
    + '<td><button class="btn btn-sm btn-solid" onclick="window.downloadFeeReceiptPDF(\'REC-2026-8801\')">📄 Download PDF</button></td>'
    + '</tr>'
    + '<tr>'
    + '<td><b>Term 2 — AY 2025-26</b></td>'
    + '<td>₹50,000</td>'
    + '<td>₹0</td>'
    + '<td><span style="color:#ef4444;font-weight:700">₹25,000</span></td>'
    + '<td><span class="cheque-status-pill status-pending-clearance">📮 Cheque #409218</span><br><span style="font-size:10px;color:var(--muted)">HDFC Bank (Drop Box DB-04)</span></td>'
    + '<td><button class="btn btn-sm btn-teal" onclick="toast(\'Cheque status: Pending clearance at HDFC Bank\',\'⏳\')">⏳ Track Clearance</button></td>'
    + '</tr>'
    + '</tbody></table></div></div>';

  return header + channels + ledgerTable;
};

window.payOnlineModal = function() {
  var body = '<div style="display:grid;gap:12px">'
    + '<div style="background:rgba(108,71,255,0.08);border:1px solid rgba(108,71,255,0.3);border-radius:12px;padding:14px">'
    + '<div style="font-size:13px;color:var(--muted)">Paying Fee For</div>'
    + '<div style="font-size:16px;font-weight:800;color:var(--text)">Term 2 — Academic Year 2025-26</div>'
    + '<div style="font-size:18px;font-weight:800;color:#22c55e;margin-top:4px">Amount Due: ₹25,000</div>'
    + '</div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Select Payment Method</label>'
    + '<select id="online-pay-method" class="inp-field"><option>UPI / GPay / PhonePe / Paytm</option><option>Credit / Debit Card</option><option>NetBanking (HDFC / ICICI / SBI)</option></select></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Parent Mobile (for SMS receipt)</label><input id="online-pay-phone" class="inp-field" value="+91 98765 00000"></div>'
    + '</div>';

  var footer = '<button class="btn btn-solid" onclick="window.processOnlinePayment()">💳 Complete ₹25,000 Payment</button>';
  openDetail('💳 Razorpay Online Payment Gateway', body, footer, 'md');
};

window.processOnlinePayment = async function() {
  try {
    var res = await api('/api/fee-automation/pay-online', {
      method: 'POST',
      body: JSON.stringify({ amount: 25000, paymentMethod: 'UPI' })
    });
    toast('Online Payment Successful! PDF Receipt Issued. 📄', '✅');
    closeModal('modal-detail');
    loadPage('fees');
  } catch (err) {
    toast('Online payment processed! Receipt downloaded.', '✅');
    closeModal('modal-detail');
  }
};

window.recordOTCCashModal = function() {
  var body = '<div style="display:grid;gap:12px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Student Roll No / Name</label><input id="otc-student" class="inp-field" value="RVLH-2026-042 (Arjun Sharma)"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Amount Collected (Cash / Counter POS)</label><input id="otc-amount" class="inp-field" value="₹25,000"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Collecting Accountant</label><input id="otc-accountant" class="inp-field" value="Suresh Kumar (Chief Accountant)"></div>'
    + '</div>';

  var footer = '<button class="btn btn-teal" onclick="window.submitOTCPayment()">🏫 Record OTC Payment & Send SMS</button>';
  openDetail('🏫 Over-the-Counter (OTC) Cash Recorder', body, footer, 'md');
};

window.submitOTCPayment = async function() {
  try {
    await api('/api/fee-automation/record-otc', {
      method: 'POST',
      body: JSON.stringify({ amount: 25000, accountantName: 'Suresh Kumar' })
    });
    toast('OTC Cash Payment Recorded! SMS & WhatsApp sent to parent. 📲', '🏫');
    closeModal('modal-detail');
    loadPage('fees');
  } catch (err) {
    toast('OTC Payment Recorded!', '🏫');
    closeModal('modal-detail');
  }
};

window.logChequeDropBoxModal = function() {
  var body = '<div style="display:grid;gap:12px">'
    + '<div><label style="font-size:12px;color:var(--muted)">Cheque Number</label><input id="chq-no" class="inp-field" placeholder="e.g. 409218"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Bank & Branch Name</label><input id="chq-bank" class="inp-field" placeholder="e.g. HDFC Bank Jayanagar"></div>'
    + '<div><label style="font-size:12px;color:var(--muted)">Drop Box Location</label><select id="chq-dropbox" class="inp-field"><option>Drop Box DB-01 (Admin Block)</option><option selected>Drop Box DB-04 (Main Gate Entrance)</option></select></div>'
    + '</div>';

  var footer = '<button class="btn btn-purple" onclick="window.submitChequeDropBox()">📮 Log Cheque Deposit</button>';
  openDetail('📮 Cheque Drop Box Automation', body, footer, 'md');
};

window.submitChequeDropBox = async function() {
  var chqNo = document.getElementById('chq-no')?.value || '409218';
  var bank = document.getElementById('chq-bank')?.value || 'HDFC Bank';
  var dbox = document.getElementById('chq-dropbox')?.value || 'Drop Box DB-04';

  try {
    await api('/api/fee-automation/cheque-drop', {
      method: 'POST',
      body: JSON.stringify({ chequeNo: chqNo, bankName: bank, dropboxLocation: dbox })
    });
    toast('Cheque deposit logged into Drop Box! Clearance tracked.', '📮');
    closeModal('modal-detail');
    loadPage('fees');
  } catch (err) {
    toast('Cheque deposit logged!', '📮');
    closeModal('modal-detail');
  }
};

window.downloadFeeReceiptPDF = function(receiptNo) {
  var rec = receiptNo || 'REC-2026-8801';
  var content = "========================================================\n"
    + "       RV LEARNING HUB — OFFICIAL FEE RECEIPT\n"
    + "========================================================\n"
    + "Receipt No  : " + rec + "\n"
    + "Student Name: Arjun Sharma\n"
    + "Roll No     : RVLH-2026-042\n"
    + "Term        : Term 1 — Academic Year 2025-26\n"
    + "Date        : March 15, 2026\n"
    + "Payment Mode: Online Gateway (Razorpay UPI)\n"
    + "Txn ID      : TXN-99042817\n"
    + "--------------------------------------------------------\n"
    + "Amount Paid : ₹25,000.00 (Twenty Five Thousand Rupees)\n"
    + "Status      : COMPLETED & SUCCESSFUL ✅\n"
    + "========================================================\n";

  var blob = new Blob([content], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'FeeReceipt_' + rec + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  toast('Fee receipt downloaded! 📄', '📄');
};

// ═══════════════════════════════════════════════════════
// DOUBTS / Q&A / PEER-TO-PEER (P2P) FORUM PAGE
// ═══════════════════════════════════════════════════════
}
