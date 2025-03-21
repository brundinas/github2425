const btnLogin = document.getElementById("btnLogin")
const btnShowRegister = document.getElementById("btnShowRegister")
const btnRegister = document.getElementById("btnRegister")
const formRegister = document.getElementById("formRegister")
const loginContainer = document.getElementById("loginContainer")

function showRegister(e) {
  e.preventDefault();
  loginContainer.style.display = "none";
  formRegister.style.display = "block";
};

btnLogin.addEventListener("click", login)
btnShowRegister.addEventListener("click", showRegister)
btnRegister.addEventListener("click", register)

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
      errorMsg.innerText = data.error;  // Update error message
      errorMsg.style.display = "block";  // Show error message
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMsg.innerText = error.JSON
   
  }
}
  
async function register() {
  const username = document.getElementById("regusername").value;
  const password = document.getElementById("regpassword").value;
  const errorMsg = document.getElementById("errorMsg");

  try {
    const response = await fetch("/registeruser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Successful login - Redirect to app.html
      window.location.href = "/app.html";
    } else {
      // Login failed - Show error message
      errorMsg.style.display = "block";  // Show error message
      const data = await response.json(); // Parse JSON response
      errorMsg.innerText = data.error;  // Update error message
     
    }
  } catch (error) {
    console.error("Login error:", error);
    errorMsg.innerText = error.JSON
   
  }
}  