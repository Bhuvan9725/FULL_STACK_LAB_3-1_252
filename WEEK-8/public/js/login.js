const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!result.success) {
            message.innerHTML = `<div class="error">${result.message}</div>`;
            return;
        }

        location.href = "dashboard.html";
    } catch {
        message.innerHTML = '<div class="error">Unable to connect to server.</div>';
    }
});
