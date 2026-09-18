const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (data.password !== data.confirmPassword) {
        message.innerHTML = '<div class="error">Passwords do not match.</div>';
        return;
    }

    delete data.confirmPassword;

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!result.success) {
            message.innerHTML = `<div class="error">${result.message}</div>`;
            return;
        }

        message.innerHTML =
            `<div class="success">Account created successfully!<br>
            Your account number is <strong>${result.accountNumber}</strong>.
            Redirecting to login...</div>`;

        form.reset();
        setTimeout(() => location.href = "login.html", 2500);
    } catch {
        message.innerHTML = '<div class="error">Unable to connect to server.</div>';
    }
});
