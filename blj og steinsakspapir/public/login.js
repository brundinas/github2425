const btnLogin = document.getElementById("btnLogin")
btnLogin.addEventListener("click", login)
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Successful login - Redirect to app.html
      window.location.href = "/app.html";
    } else {
      // Login failed - Show error message
      const data = await response.json(); // Parse JSON response
      errorMsg.innerText = data.message;  // Update error message
      errorMsg.style.display = "block";  // Show error message
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again.");
  }
}
  
  