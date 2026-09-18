const userName = document.getElementById("userName");
const balance = document.getElementById("balance");
const accountNumber = document.getElementById("accountNumber");
const body = document.getElementById("transactionBody");

async function loadAccount() {
    const response = await fetch("/api/me");
    if (response.status === 401) {
        location.href = "login.html";
        return null;
    }
    const result = await response.json();
    userName.textContent = result.user.name;
    balance.textContent = `₹${Number(result.user.balance).toFixed(2)}`;
    accountNumber.textContent = result.user.accountNumber;
    return result.user;
}

function updateStatistics(transactions) {
    const deposits = transactions
        .filter(t => t.type === "DEPOSIT")
        .reduce((s, t) => s + Number(t.amount), 0);

    const withdrawals = transactions
        .filter(t => t.type === "WITHDRAW")
        .reduce((s, t) => s + Number(t.amount), 0);

    const transfers = transactions
        .filter(t => t.type === "TRANSFER")
        .reduce((s, t) => s + Number(t.amount), 0);

    document.getElementById("totalDeposits").textContent = `₹${deposits.toFixed(2)}`;
    document.getElementById("totalWithdrawals").textContent = `₹${withdrawals.toFixed(2)}`;
    document.getElementById("totalTransfers").textContent = `₹${transfers.toFixed(2)}`;
    document.getElementById("transactionCount").textContent = transactions.length;
}

async function loadTransactions() {
    const response = await fetch("/api/transactions");
    if (response.status === 401) {
        location.href = "login.html";
        return;
    }

    const result = await response.json();
    const transactions = result.transactions || [];
    updateStatistics(transactions);

    const recent = [...transactions].reverse().slice(0, 10);

    if (!recent.length) {
        body.innerHTML = '<tr><td colspan="4">No transactions yet.</td></tr>';
        return;
    }

    body.innerHTML = recent.map(t => `
        <tr>
          <td>${t.transactionId}</td>
          <td><span class="type ${t.type.toLowerCase()}">${t.type}</span></td>
          <td>₹${Number(t.amount).toFixed(2)}</td>
          <td>${new Date(t.date).toLocaleString()}</td>
        </tr>
    `).join("");
}

async function performAction(url, payload) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!result.success) {
        alert(result.message);
        return;
    }

    sessionStorage.setItem("bstLastTransaction", JSON.stringify(result.transaction));
    location.href = "receipt.html";
}

document.getElementById("depositBtn").addEventListener("click", () => {
    const amount = prompt("Enter deposit amount:");
    if (amount !== null) performAction("/api/deposit", { amount });
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
    const amount = prompt("Enter withdrawal amount:");
    if (amount !== null) performAction("/api/withdraw", { amount });
});

document.getElementById("transferBtn").addEventListener("click", () => {
    const receiverAccount = prompt("Enter receiver BST account number:");
    if (!receiverAccount) return;
    const amount = prompt("Enter transfer amount:");
    if (amount !== null) performAction("/api/transfer", { amount, receiverAccount });
});

document.getElementById("refreshBtn").addEventListener("click", async () => {
    await loadAccount();
    await loadTransactions();
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    location.href = "login.html";
});

(async function init() {
    const user = await loadAccount();
    if (user) await loadTransactions();
})();
