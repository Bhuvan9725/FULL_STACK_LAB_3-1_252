const form = document.getElementById("passwordForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (data.newPassword !== data.confirmPassword) {
        message.innerHTML = '<div class="error">New passwords do not match.</div>';
        return;
    }

    try {
        const response = await fetch("/api/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            })
        });

        const result = await response.json();

        if (!result.success) {
            message.innerHTML = `<div class="error">${result.message}</div>`;
            return;
        }

        message.innerHTML = `<div class="success">${result.message}</div>`;
        form.reset();
    } catch {
        message.innerHTML = '<div class="error">Unable to connect to server.</div>';
    }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    location.href = "login.html";
});
