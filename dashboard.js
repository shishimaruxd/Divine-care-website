document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");

    // Fetch user data from Firebase Auth
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            userDropdown.textContent = user.displayName || "User"; // Use Google name
        } else {
            // User is not signed in
            userDropdown.textContent = "Log In";
            userDropdown.addEventListener("click", () => {
                window.location.href = "login.html"; // Redirect to login page
            });
        }
    });

    // Log out function
    document.getElementById("logoutBtn").addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            window.location.href = "index.html"; // Redirect to home page after logout
        });
    });
});
