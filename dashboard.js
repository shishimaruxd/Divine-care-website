document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // Ensure Firebase is available
    if (typeof firebase === "undefined") {
        console.error("Firebase is not loaded. Check if SDK scripts are included correctly.");
        return;
    }

    const auth = firebase.auth();

    // Check user authentication status
    auth.onAuthStateChanged((user) => {
        if (user) {
            userDropdown.textContent = user.displayName || "User";
        } else {
            userDropdown.textContent = "Log In";
            userDropdown.addEventListener("click", () => {
                window.location.href = "login.html"; // Redirect to login page
            });
        }
    });

    // Logout functionality
    logoutBtn.addEventListener("click", () => {
        auth.signOut().then(() => {
            window.location.href = "index.html"; // Redirect to home page after logout
        }).catch((error) => {
            console.error("Error logging out:", error);
        });
    });
});
