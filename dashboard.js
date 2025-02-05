document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const logoutBtn = document.getElementById("logoutBtn");

    // Fetch authenticated user from Firebase
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            userDropdown.textContent = user.displayName || "User"; // Show actual user name
        } else {
            userDropdown.textContent = "Log In";
        }
    });

    userDropdown.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    logoutBtn.addEventListener("click", function () {
        firebase.auth().signOut().then(() => {
            alert("Logged out successfully!");
            window.location.href = "index.html"; // Redirect to home page
        });
    });

    document.addEventListener("click", function (e) {
        if (!userDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});
