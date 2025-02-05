document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");

    // Check Firebase Auth state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // ✅ If user is signed in, set their Google Name
            userDropdown.textContent = user.displayName || "User"; // Fetch actual Google name
        } else {
            // ❌ If not signed in, show "Log In" instead of wrong name
            userDropdown.textContent = "Log In";
            userDropdown.addEventListener("click", () => {
                window.location.href = "login.html"; // Redirect to login page
            });
        }
    });

    // ✅ Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            window.location.href = "index.html"; // Redirect to homepage
        });
    });
});
