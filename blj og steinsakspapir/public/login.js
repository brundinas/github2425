
const btnLogin = document.getElementById("btnLogin")
btnLogin.addEventListener('click',login)
function login() {
    const username = "Hilde";
    const password = "Passord";
    console.log("Login")
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Login successful") {
        localStorage.setItem("loggedIn", "true"); // Store session info
        window.location.href = "/app.html"; // Redirect to game hub
      } else {
        alert("Invalid credentials");
      }
    });
  }
  