import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const sidePanel = document.getElementById("sidePanel");

    const auth = getAuth();

    // Check user authentication status
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userDropdown.innerHTML = `${user.displayName}`;
        } else {
            userDropdown.innerHTML = "Log In";
            userDropdown.onclick = () => window.location.href = "login.html";
        }
    });

    // Toggle Side Panel
    hamburgerMenu.addEventListener("click", function () {
        sidePanel.classList.toggle("active");
    });

    // Close Side Panel when clicking outside
    document.addEventListener("click", function (event) {
        if (!sidePanel.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            sidePanel.classList.remove("active");
        }
    });

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "index.html"; // Redirect to home page after logout
        }).catch((error) => {
            console.error("Error logging out:", error);
        });
    });
});
