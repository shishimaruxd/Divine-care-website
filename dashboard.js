import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    // Firebase Auth
    const auth = getAuth();

    // Check user authentication status
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userDropdown.innerHTML = `${user.displayName} ▼`;
        } else {
            userDropdown.innerHTML = "Log In";
            userDropdown.onclick = () => window.location.href = "login.html";
        }
    });

    // Toggle dropdown menu
    userDropdown.addEventListener("click", function () {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "index.html"; // Redirect to home page after logout
        }).catch((error) => {
            console.error("Error logging out:", error);
        });
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!userDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});
