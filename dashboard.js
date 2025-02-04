document.addEventListener("DOMContentLoaded", function() {

    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userNameDisplay = document.getElementById('userName');
    const logoutButton = document.getElementById('logoutBtn');

    // Simulate a user logged in, retrieve the user name (example)
    const user = localStorage.getItem('userLoggedIn');  // This can be replaced by real user info
    if (user) {
        userNameDisplay.textContent = user;  // Set the user's name
    }

    // Toggle dropdown visibility on profile button click
    profileBtn.addEventListener('click', function() {
        dropdownMenu.classList.toggle('show');
    });

    // Logout functionality
    logoutButton.addEventListener('click', function() {
        // Clear session data
        localStorage.removeItem('userLoggedIn');

        // Redirect to the homepage (index.html)
        window.location.href = 'index.html';
    });

});
