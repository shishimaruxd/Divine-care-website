document.addEventListener("DOMContentLoaded", function() {

    // Logout functionality
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Clear any session or authentication data
            localStorage.removeItem('userLoggedIn'); // Example of clearing login status

            // Redirect to the homepage (index.html)
            window.location.href = 'index.html';
        });
    }

});
