// Open Login Popup with Smooth Animation
function openLoginPopup() {
    let popup = document.getElementById("loginPopup");
    popup.classList.remove("hide"); // Remove hide animation
    popup.style.display = "flex";
    setTimeout(() => {
        popup.classList.add("show");
    }, 10);
}

// Close Login Popup with Smooth Animation
function closeLoginPopup() {
    let popup = document.getElementById("loginPopup");
    popup.classList.remove("show");
    popup.classList.add("hide");
    
    setTimeout(() => {
        popup.style.display = "none";
    }, 300); // Wait for animation to finish
}

// Handle Login Form Submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;

    if (email && password) {
        alert("Login successful! Welcome back.");
        closeLoginPopup();
    } else {
        alert("Please enter both email and password.");
    }
});
