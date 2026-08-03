// public/script/adminloginScript.js

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("togglePassword");
  
    // Password visibility toggle
    if (toggleIcon && passwordInput) {
      toggleIcon.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
  
        // Toggle eye icon
        toggleIcon.classList.toggle("fa-eye");
        toggleIcon.classList.toggle("fa-eye-slash");
      });
    }
  
    // Optional: Clear error message on input
    const errorMessage = document.querySelector(".error-message");
    const inputs = document.querySelectorAll("#loginForm input");
  
    inputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (errorMessage) {
          errorMessage.textContent = "";
        }
      });
    });
  });
  