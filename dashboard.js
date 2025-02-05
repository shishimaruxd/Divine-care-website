document.addEventListener("DOMContentLoaded", function () {
    const userDropdown = document.getElementById("userDropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const logoutBtn = document.getElementById("logoutBtn");

    // Simulated user data from Firebase Authentication
    const user = {
        displayName: "John Doe",
    };

    if (user) {
        userDropdown.textContent = user.displayName; // Show user name
    }

    userDropdown.addEventListener("click", function () {
        dropdownMenu.classList.toggle("show");
    });

    logoutBtn.addEventListener("click", function () {
        alert("Logging out...");
        window.location.href = "index.html"; // Redirect to home page
    });

    document.addEventListener("click", function (e) {
        if (!userDropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});
