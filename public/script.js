// Submit /input form
document.getElementById("inputForm").addEventListener("submit", async e => {
    e.preventDefault();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;

    const res = await fetch("/input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email })
    });

    const data = await res.json();
    document.getElementById("result").innerText = JSON.stringify(data);
});

// Submit /verify form
document.getElementById("verifyForm").addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("verifyEmail").value;

    const res = await fetch(`/verify?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    document.getElementById("result").innerText = JSON.stringify(data);
});
