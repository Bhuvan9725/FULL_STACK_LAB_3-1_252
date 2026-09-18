const profile = document.getElementById("profile");

async function loadProfile() {
    const response = await fetch("/api/me");
    if (response.status === 401) {
        location.href = "login.html";
        return;
    }

    const result = await response.json();
    const u = result.user;

    profile.innerHTML = `
      <div class="profile-grid">
        <div><span>Full Name</span><strong>${u.name}</strong></div>
        <div><span>Username</span><strong>${u.username}</strong></div>
        <div><span>Email</span><strong>${u.email}</strong></div>
        <div><span>Mobile</span><strong>${u.mobile}</strong></div>
        <div><span>Date of Birth</span><strong>${u.dob}</strong></div>
        <div><span>Gender</span><strong>${u.gender}</strong></div>
        <div><span>Account Number</span><strong>${u.accountNumber}</strong></div>
        <div><span>Balance</span><strong>₹${Number(u.balance).toFixed(2)}</strong></div>
        <div class="wide"><span>Address</span><strong>${u.address}</strong></div>
      </div>`;
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    location.href = "login.html";
});

loadProfile();
