// Import and Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8950UoLWJ_-mL2h8qXrAfjV6KLtSYano",
    authDomain: "divine-appointements.firebaseapp.com",
    projectId: "divine-appointements",
    storageBucket: "divine-appointements.appspot.com",
    messagingSenderId: "352266934809",
    appId: "1:352266934809:web:3e99cd5fac7e044586a888",
    measurementId: "G-B9RPR118N2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Form Submission Handler
document.getElementById("appointmentForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get Form Data
    let fullName = document.getElementById("fullName").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let date = document.getElementById("date").value;
    let service = document.getElementById("service").value;
    let mode = document.getElementById("mode").value;
    let message = document.getElementById("message").value;

    // Save Data to Firebase Firestore
    db.collection("appointments").add({
        fullName: fullName,
        email: email,
        phone: phone,
        date: date,
        service: service,
        mode: mode,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("✅ Thank you for booking an appointment with Divine Care! You will receive a confirmation email within 30 minutes.");
        window.location.href = "index.html"; // Redirect to home page
    }).catch((error) => {
        alert("⚠️ Error submitting form. Please contact +918957604340 (Call or WhatsApp).");
        console.error("Error:", error);
    });
});
