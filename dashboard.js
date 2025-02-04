// Assuming you store the user's name in localStorage upon successful login
document.addEventListener("DOMContentLoaded", function () {
    // Set the username from localStorage (or default to 'User ID' if not set)
    let userName = localStorage.getItem('userName') || 'User ID';
    document.getElementById('userName').textContent = userName;

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', function () {
        // Clear the stored username and redirect to the main index.html page
        localStorage.removeItem('userName');
        window.location.href = 'index.html'; // Redirect to the home page
    });
});
