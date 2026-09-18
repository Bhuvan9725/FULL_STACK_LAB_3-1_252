const data = JSON.parse(sessionStorage.getItem("bstLastTransaction") || "null");
const box = document.getElementById("receiptData");

if (!data) {
    box.innerHTML = '<div class="error">No recent transaction found.</div>';
} else {
    box.innerHTML = `
      <div class="receipt-row"><span>Transaction ID</span><strong>${data.transactionId}</strong></div>
      <div class="receipt-row"><span>Transaction Type</span><strong>${data.type}</strong></div>
      <div class="receipt-row"><span>Amount</span><strong>₹${Number(data.amount).toFixed(2)}</strong></div>
      <div class="receipt-row"><span>Date</span><strong>${new Date(data.date).toLocaleString()}</strong></div>
      <div class="receipt-row"><span>Status</span><strong>SUCCESS</strong></div>
    `;
}

document.getElementById("printBtn").addEventListener("click", () => window.print());
